# Code Style Guidelines — TutorFinder UK

> Consistent code conventions for maintainable, readable code.

---

## General Principles

1. **Readability over cleverness** — Write code that's easy to understand
2. **Consistency** — Follow existing patterns in the codebase
3. **Self-documenting** — Use clear names; add comments only when "why" isn't obvious
4. **Single responsibility** — Each class/function does one thing well
5. **Fail fast** — Validate early, return early

---

## .NET / C# Conventions

### Project Configuration

```xml
<!-- Directory.Build.props (solution root) -->
<Project>
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <AnalysisLevel>latest-recommended</AnalysisLevel>
  </PropertyGroup>
</Project>
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Namespace | PascalCase, match folders | `TutorFinder.Application.Commands` |
| Class | PascalCase, noun | `TutorProfile`, `BookingService` |
| Interface | PascalCase, I-prefix | `ITutorRepository` |
| Method | PascalCase, verb | `CreateBooking`, `GetTutorById` |
| Property | PascalCase | `DisplayName`, `CreatedAt` |
| Field (private) | _camelCase | `_repository`, `_logger` |
| Parameter | camelCase | `tutorId`, `cancellationToken` |
| Constant | PascalCase | `MaxPageSize`, `DefaultRadius` |
| Enum | PascalCase | `BookingStatus.Pending` |

### File Organization

```csharp
// 1. Using statements (sorted, no unused)
using Microsoft.Extensions.Logging;
using TutorFinder.Domain.Entities;

// 2. Namespace (file-scoped)
namespace TutorFinder.Application.Commands;

// 3. Type definition
public class CreateBookingCommand
{
    // 4. Constants
    private const int MaxMessageLength = 1000;

    // 5. Private fields
    private readonly IBookingRepository _repository;
    private readonly ILogger<CreateBookingCommand> _logger;

    // 6. Constructor
    public CreateBookingCommand(IBookingRepository repository, ILogger<CreateBookingCommand> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    // 7. Public methods
    public async Task<Result<BookingDto>> ExecuteAsync(CreateBookingRequest request, CancellationToken ct)
    {
        // Implementation
    }

    // 8. Private methods
    private static void ValidateRequest(CreateBookingRequest request)
    {
        // Implementation
    }
}
```

### DTOs & Records

```csharp
// Use records for immutable DTOs
public record TutorSearchResultDto(
    Guid Id,
    string FullName,
    string? PhotoUrl,
    Category Category,
    IReadOnlyList<string> Subjects,
    decimal PricePerHour,
    decimal AverageRating,
    int ReviewCount,
    double DistanceMiles,
    string NextAvailableText
);

// Use classes for mutable request objects
public class CreateBookingRequest
{
    public Guid TutorId { get; init; }
    public TeachingMode RequestedMode { get; init; }
    public DateOnly? PreferredDate { get; init; }
    public string Message { get; init; } = string.Empty;
}
```

### Validation (FluentValidation)

```csharp
public class CreateBookingRequestValidator : AbstractValidator<CreateBookingRequest>
{
    public CreateBookingRequestValidator()
    {
        RuleFor(x => x.TutorId)
            .NotEmpty()
            .WithMessage("Tutor is required.");

        RuleFor(x => x.Message)
            .NotEmpty()
            .WithMessage("Message is required.")
            .MaximumLength(1000)
            .WithMessage("Message must be under 1000 characters.");

        RuleFor(x => x.RequestedMode)
            .IsInEnum()
            .WithMessage("Invalid teaching mode.");

        RuleFor(x => x.PreferredDate)
            .GreaterThan(DateOnly.FromDateTime(DateTime.Today))
            .When(x => x.PreferredDate.HasValue)
            .WithMessage("Preferred date must be in the future.");
    }
}
```

### Controllers

```csharp
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    /// <summary>
    /// Create a new booking request
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "StudentOnly")]
    [ProducesResponseType<BookingDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateBooking(
        [FromBody] CreateBookingRequest request,
        CancellationToken ct)
    {
        var userId = User.GetUserId(); // Extension method
        var result = await _bookingService.CreateAsync(userId, request, ct);

        return result.Match(
            success => CreatedAtAction(nameof(GetBooking), new { id = success.Id }, success),
            error => Problem(error.Message, statusCode: error.StatusCode)
        );
    }
}
```

### Result Pattern

```csharp
// Use a Result type for operations that can fail
public abstract record Result<T>
{
    public record Success(T Value) : Result<T>;
    public record Failure(string Message, int StatusCode = 400) : Result<T>;

    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<Failure, TResult> onFailure) =>
        this switch
        {
            Success s => onSuccess(s.Value),
            Failure f => onFailure(f),
            _ => throw new InvalidOperationException()
        };
}
```

### Async/Await

```csharp
// Always use async suffix
public async Task<TutorDto?> GetByIdAsync(Guid id, CancellationToken ct)
{
    // Always pass CancellationToken
    var tutor = await _context.Tutors
        .FirstOrDefaultAsync(t => t.Id == id, ct);

    // Don't await in return if it's the only async call
    return tutor is null ? null : MapToDto(tutor);
}

// Use ValueTask for hot paths that often complete synchronously
public ValueTask<int> GetCachedCountAsync()
{
    if (_cache.TryGetValue("count", out int count))
        return ValueTask.FromResult(count);

    return new ValueTask<int>(GetCountFromDbAsync());
}
```

### Logging

```csharp
public class BookingService
{
    private readonly ILogger<BookingService> _logger;

    public async Task<Result<BookingDto>> CreateAsync(Guid userId, CreateBookingRequest request, CancellationToken ct)
    {
        // Use structured logging with message templates
        _logger.LogInformation(
            "Creating booking for user {UserId} to tutor {TutorId}",
            userId, request.TutorId);

        try
        {
            // ... implementation
            _logger.LogInformation("Booking {BookingId} created successfully", booking.Id);
        }
        catch (Exception ex)
        {
            // Include exception as first parameter
            _logger.LogError(ex, "Failed to create booking for user {UserId}", userId);
            throw;
        }
    }
}
```

### Entity Configuration (EF Core)

```csharp
public class TutorProfileConfiguration : IEntityTypeConfiguration<TutorProfile>
{
    public void Configure(EntityTypeBuilder<TutorProfile> builder)
    {
        builder.ToTable("TutorProfiles");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.FullName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(t => t.PricePerHour)
            .HasPrecision(8, 2)
            .IsRequired();

        builder.HasOne<User>()
            .WithOne()
            .HasForeignKey<TutorProfile>(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.Subjects)
            .WithOne()
            .HasForeignKey(s => s.TutorProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // Soft delete filter
        builder.HasQueryFilter(t => !t.IsDeleted);

        // Indexes
        builder.HasIndex(t => t.UserId).IsUnique();
        builder.HasIndex(t => new { t.Category, t.IsActive });
    }
}
```

---

## React Native / TypeScript Conventions

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Component | PascalCase | `TutorCard.tsx`, `FilterChips.tsx` |
| Hook | camelCase, use-prefix | `useSearchTutors.ts` |
| Context | PascalCase | `AuthContext.tsx` |
| Type/Interface | PascalCase | `TutorProfile`, `BookingStatus` |
| Function | camelCase | `formatDistance`, `validateEmail` |
| Constant | SCREAMING_SNAKE | `MAX_PAGE_SIZE`, `API_BASE_URL` |
| File (component) | PascalCase | `TutorCard.tsx` |
| File (utility) | camelCase | `formatters.ts` |

### Component Structure

```tsx
// components/TutorCard.tsx
import React, { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { TutorSearchResult } from '@/api/types/tutor';

// 1. Props interface
interface TutorCardProps {
  tutor: TutorSearchResult;
  onPress: (id: string) => void;
  variant?: 'default' | 'compact';
}

// 2. Component function
function TutorCard({ tutor, onPress, variant = 'default' }: TutorCardProps) {
  const { colors, spacing } = useTheme();

  // 3. Callbacks memoized
  const handlePress = useCallback(() => {
    onPress(tutor.id);
  }, [tutor.id, onPress]);

  // 4. Styles using theme
  const cardStyle = [
    styles.card,
    { backgroundColor: colors.surface, padding: spacing.lg },
  ];

  return (
    <Pressable onPress={handlePress} style={cardStyle}>
      <Text style={[styles.name, { color: colors.textPrimary }]}>
        {tutor.fullName}
      </Text>
      {/* ... */}
    </Pressable>
  );
}

// 5. Styles at bottom
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
});

// 6. Memoize if props are stable
export default memo(TutorCard);
```

### Custom Hooks

```tsx
// features/discovery/hooks/useSearchTutors.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { tutorsApi } from '@/api/endpoints/tutors';
import { SearchFilters } from '@/api/types/tutor';

export function useSearchTutors(filters: SearchFilters) {
  return useQuery({
    queryKey: ['tutors', 'search', filters],
    queryFn: () => tutorsApi.search(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: Boolean(filters.lat && filters.lng) || Boolean(filters.postcode),
  });
}
```

### Zustand Store

```tsx
// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (token, user) => {
        await SecureStore.setItemAsync('token', token);
        set({ token, user, isAuthenticated: true });
      },

      logout: async () => {
        await SecureStore.deleteItemAsync('token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

### API Types

```tsx
// api/types/tutor.ts
export interface TutorSearchResult {
  id: string;
  fullName: string;
  photoUrl: string | null;
  category: Category;
  subjects: string[];
  pricePerHour: number;
  averageRating: number;
  reviewCount: number;
  distanceMiles: number;
  nextAvailableText: string;
  hasDbs: boolean;
  hasCertification: boolean;
}

export interface SearchFilters {
  lat?: number;
  lng?: number;
  postcode?: string;
  radiusMiles: number;
  category?: Category;
  subject?: string;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  mode?: TeachingMode;
  sort: SortOption;
  page: number;
  pageSize: number;
}

export type Category = 'Music' | 'Sports' | 'Education';
export type TeachingMode = 'InPerson' | 'Online' | 'Both';
export type SortOption = 'nearest' | 'best' | 'rating' | 'priceLow' | 'priceHigh';
```

### Form Validation (Zod)

```tsx
// features/auth/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### Error Handling

```tsx
// Use error boundaries for unexpected errors
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>

// Handle API errors in hooks
const { data, error, isError } = useSearchTutors(filters);

if (isError) {
  return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
}
```

### Accessibility

```tsx
<Pressable
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel={`View ${tutor.fullName}'s profile`}
  accessibilityHint="Opens the tutor's full profile page"
>
  {/* ... */}
</Pressable>

<Image
  source={{ uri: tutor.photoUrl }}
  accessibilityLabel={`Photo of ${tutor.fullName}`}
/>
```

---

## Testing Conventions

### Test File Location

```
# Backend
src/TutorFinder.Application/Commands/CreateBookingCommand.cs
tests/TutorFinder.UnitTests/Application/Commands/CreateBookingCommandTests.cs

# Mobile
src/components/TutorCard.tsx
__tests__/components/TutorCard.test.tsx
```

### Test Naming

```csharp
// Backend: Method_Scenario_ExpectedResult
[Fact]
public async Task CreateBooking_ValidRequest_ReturnsSuccess()
{
}

[Fact]
public async Task CreateBooking_TutorNotFound_ReturnsNotFoundError()
{
}
```

```tsx
// Mobile: describe > it pattern
describe('TutorCard', () => {
  it('displays tutor name and rating', () => {
  });

  it('calls onPress with tutor id when pressed', () => {
  });
});
```

### Arrange-Act-Assert

```csharp
[Fact]
public async Task CreateBooking_ValidRequest_ReturnsSuccess()
{
    // Arrange
    var request = new CreateBookingRequest { TutorId = tutorId, Message = "Hello" };
    _tutorRepository.GetByIdAsync(tutorId, Arg.Any<CancellationToken>())
        .Returns(new TutorProfile { Id = tutorId, IsActive = true });

    // Act
    var result = await _sut.CreateAsync(studentId, request, CancellationToken.None);

    // Assert
    result.Should().BeOfType<Result<BookingDto>.Success>();
    result.As<Result<BookingDto>.Success>().Value.Status.Should().Be(BookingStatus.Pending);
}
```

---

## Git Commit Messages

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation only
- `style` — Formatting, no code change
- `refactor` — Code restructuring
- `test` — Adding tests
- `chore` — Maintenance tasks

**Examples:**
```
feat(api): add tutor search endpoint with geo filtering

Implements POST /api/v1/tutors/search with:
- PostGIS radius query
- Category, price, rating filters
- Pagination support

Closes #123
```

```
fix(mobile): handle null photo URL in TutorCard

Added fallback avatar when tutor has no photo uploaded.
```

---

## Code Review Checklist

- [ ] Follows naming conventions
- [ ] No unused imports/variables
- [ ] Proper error handling
- [ ] CancellationToken passed through
- [ ] Tests for new functionality
- [ ] Accessibility labels (mobile)
- [ ] No hardcoded values (use constants/tokens)
- [ ] Documentation updated if needed
