# .NET Backend Architecture — Clean Architecture (.NET 8)


> Scalable, testable, maintainable API for TutorFinder UK.

---

## Goals
- Clean separation of concerns (Domain/Application/Infrastructure/API)
- Testable business logic (no framework dependencies in Domain)
- Stable REST API contract for mobile and web
- Performant geo-search with UK postcode support via SQL Server Geography
- Secure by default (JWT, RBAC, Validation, CORS)

---

## Solution Structure

```
backend/
├── TutorFinder.sln
├── src/
│   ├── TutorFinder.Api/              # Web API layer
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   ├── Filters/
│   │   └── Program.cs
│   │
│   ├── TutorFinder.Application/      # Use cases, DTOs, validators
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── DTOs/
│   │   ├── Validators/
│   │   ├── Interfaces/
│   │   └── Mappings/
│   │
│   ├── TutorFinder.Domain/           # Entities, value objects, enums
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Enums/
│   │   └── Rules/
│   │
│   └── TutorFinder.Infrastructure/   # EF Core, external services
│       ├── Data/
│       │   ├── AppDbContext.cs
│       │   ├── Configurations/
│       │   └── Migrations/
│       ├── Repositories/
│       ├── Services/
│       │   ├── GeocodingService.cs
│       │   ├── EmailService.cs
│       │   └── JwtService.cs
│       └── Identity/
│
└── tests/
    ├── TutorFinder.UnitTests/
    │   ├── Domain/
    │   └── Application/
    └── TutorFinder.IntegrationTests/
        ├── Api/
        └── Infrastructure/
```

---

## Layer Responsibilities

### Domain Layer
**Purpose:** Core business entities and rules. Zero external dependencies.

**Contains:**
- **Entities:** User, TutorProfile, TutorSubject, AvailabilitySlot, BookingRequest, BookingMessage, Review
- **Value Objects:** Location (lat/lng), Money, Rating
- **Enums:** UserRole, Category, TeachingMode, BookingStatus
- **Domain Rules:**
  - Review allowed only if booking status is Accepted
  - Tutor must have ≥1 subject and valid base location
  - Rating must be 1-5

### Application Layer
**Purpose:** Use cases, orchestration, DTOs. Depends only on Domain.

**Contains:**
- **Commands:** RegisterUser, CreateTutorProfile, CreateBookingRequest, RespondToBooking, CreateReview
- **Queries:** GetTutorProfile, SearchTutors, GetBookings, GetReviews
- **DTOs:** Request/Response objects for API
- **Validators:** FluentValidation rules per command/query
- **Interfaces:** IUserRepository, ITutorRepository, IGeocodingService, IEmailService
- **Mappings:** Entity ↔ DTO (Mapster recommended)

### Infrastructure Layer
**Purpose:** External concerns (database, APIs, email). Implements interfaces from Application.

**Contains:**
- **EF Core:** DbContext, entity configurations, migrations
- **Repositories:** Implement IXxxRepository interfaces
- **Services:**
  - `GeocodingService` — Postcode → lat/lng (postcodes.io)
  - `EmailService` — SendGrid adapter
  - `JwtService` — Token generation/validation
- **Identity:** Password hashing, user management

### API Layer
**Purpose:** HTTP endpoints, auth config, middleware. Thin layer.

**Contains:**
- **Controllers:** Map HTTP → Commands/Queries → Response
- **Middleware:** Exception handling, correlation ID
- **Filters:** Validation, authorization
- **Configuration:** JWT, CORS, Swagger

---

## Dependency Flow

```
API → Application → Domain
        ↓
  Infrastructure (implements Application interfaces)
```

**Dependency Injection (Program.cs):**
```csharp
builder.Services.AddApplication();      // Extension method
builder.Services.AddInfrastructure();   // Extension method
```

---

## Security

### Authentication (JWT)

```csharp
// JWT Configuration
  "Jwt": {
    "Secret": "ReplaceWithAStrongSecretKeyAtLeast32CharactersLong",
    "Issuer": "TutorFinder",
    "Audience": "TutorFinderMobile"
  }
}
```

### CORS Policies

```csharp
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
```

**Token Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-01-09T18:32:00Z",
  "user": {
    "id": "guid",
    "email": "user@example.com",
    "role": "Student",
    "displayName": "John"
  }
}
```

### Authorization (RBAC Policies)

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("StudentOnly", p => p.RequireRole("Student"));
    options.AddPolicy("TutorOnly", p => p.RequireRole("Tutor"));
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
});
```

**Endpoint Authorization:**
| Endpoint | Policy |
|----------|--------|
| POST /bookings | StudentOnly |
| POST /bookings/{id}/respond | TutorOnly (+ owner check) |
| POST /reviews | StudentOnly |
| POST /tutors | TutorOnly |
| PUT /tutors/{id} | TutorOnly (+ owner check) |

### Security Headers

```csharp
app.UseSecurityHeaders(policies =>
{
    policies.AddDefaultSecurityHeaders();
    policies.AddStrictTransportSecurityMaxAgeIncludeSubDomains();
});
```

---

## Error Handling

### ProblemDetails Standard

All errors return RFC 7807 ProblemDetails:

```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "instance": "/api/v1/bookings",
  "traceId": "00-abc123...",
  "errors": {
    "tutorId": ["Tutor not found"],
    "message": ["Message is required"]
  }
}
```

### Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource doesn't exist |
| CONFLICT | 409 | Business rule violation |
| INTERNAL_ERROR | 500 | Unexpected server error |

### Global Exception Handler

```csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        var problemDetails = exception switch
        {
            ValidationException ve => new ValidationProblemDetails(ve.Errors),
            NotFoundException nf => new ProblemDetails { Status = 404, Title = nf.Message },
            ForbiddenException => new ProblemDetails { Status = 403, Title = "Forbidden" },
            _ => new ProblemDetails { Status = 500, Title = "Internal Server Error" }
        };
        await context.Response.WriteAsJsonAsync(problemDetails);
    });
});
```

---

## Validation Strategy

### FluentValidation

```csharp
public class CreateBookingRequestValidator : AbstractValidator<CreateBookingRequest>
{
    public CreateBookingRequestValidator()
    {
        RuleFor(x => x.TutorId).NotEmpty();
        RuleFor(x => x.Message).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.RequestedMode).IsInEnum();
    }
}
```

### Auto-Validation Pipeline

```csharp
builder.Services.AddValidatorsFromAssemblyContaining<CreateBookingRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();
```

---

## Pagination

### Standard Paged Request

```csharp
public record PagedRequest
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
```

### Standard Paged Response

```csharp
public record PagedResponse<T>
{
    public IReadOnlyList<T> Items { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
```

**Example Response:**
```json
{
  "items": [...],
  "page": 1,
  "pageSize": 20,
  "totalCount": 156,
  "totalPages": 8,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## Geo Strategy (UK)

### Technology: SQL Server Spatial
- **Type:** `geography` (not `geometry`)
- **SRID:** 4326 (WGS 84 - standard for GPS)

### Query Implementation

```csharp
// Using EF Core + NetTopologySuite
var searchPoint = geometryFactory.CreatePoint(new Coordinate(lng, lat));
double radiusMeters = radiusMiles * 1609.34;

var tutors = await context.TutorProfiles
    .Where(t => t.Location.Distance(searchPoint) <= radiusMeters)
    .OrderBy(t => t.Location.Distance(searchPoint))
    .ToListAsync();
```

### Spatial Indexing
Spatial indexes must be explicitly created in migrations for performance:

```csharp
builder.HasSpatialIndex(t => t.Location);
```

### Geocoding Service

```csharp
public interface IGeocodingService
{
    Task<GeocodingResult?> GeocodePostcodeAsync(string postcode, CancellationToken ct);
}

public record GeocodingResult(decimal Latitude, decimal Longitude, string FormattedPostcode);
```

**Implementation:** Use https://postcodes.io (free, UK-specific, no API key needed)

---

## Notifications (MVP)

### Email Notifications

**Triggers:**
- Booking request created → Email to tutor
- Booking accepted/declined → Email to student

**Service Interface:**
```csharp
public interface IEmailService
{
    Task SendBookingRequestEmailAsync(string tutorEmail, BookingRequestDto booking, CancellationToken ct);
    Task SendBookingResponseEmailAsync(string studentEmail, BookingResponseDto response, CancellationToken ct);
}
```

**Phase 2:** Add Firebase Cloud Messaging for push notifications.

---

## Best Match Scoring

For `sort=best`, compute a weighted score:

```csharp
public static double ComputeBestMatchScore(TutorProfile tutor, double distanceMiles)
{
    // Weights (tune based on data)
    const double distanceWeight = 0.35;
    const double ratingWeight = 0.30;
    const double reviewCountWeight = 0.20;
    const double responseRateWeight = 0.15;

    // Normalize distance (0-1, closer is better)
    var distanceScore = Math.Max(0, 1 - (distanceMiles / 50.0));

    // Normalize rating (0-1)
    var ratingScore = tutor.AverageRating / 5.0;

    // Normalize review count (log scale, cap at 100)
    var reviewScore = Math.Min(1, Math.Log10(tutor.ReviewCount + 1) / 2.0);

    // Response rate (if tracked, otherwise 0.5 default)
    var responseScore = tutor.ResponseRate ?? 0.5;

    return (distanceWeight * distanceScore) +
           (ratingWeight * ratingScore) +
           (reviewCountWeight * reviewScore) +
           (responseRateWeight * responseScore);
}
```

---

## Next Available Text Computation

```csharp
public static string ComputeNextAvailableText(IEnumerable<AvailabilitySlot> slots)
{
    var now = DateTime.UtcNow;
    var ukNow = TimeZoneInfo.ConvertTimeFromUtc(now, ukTimeZone);
    
    var activeSlots = slots.Where(s => s.IsActive).OrderBy(s => s.DayOfWeek).ThenBy(s => s.StartTime);
    
    foreach (var slot in activeSlots)
    {
        var slotDay = GetNextOccurrence(ukNow, slot.DayOfWeek);
        var slotStart = slotDay.Date + slot.StartTime;
        
        if (slotStart > ukNow)
        {
            var daysUntil = (slotStart.Date - ukNow.Date).Days;
            var dayLabel = daysUntil switch
            {
                0 => "Today",
                1 => "Tomorrow",
                _ => slotStart.ToString("ddd")
            };
            return $"{dayLabel} {slot.StartTime:hh\\:mm}-{slot.EndTime:hh\\:mm}";
        }
    }
    return "Check availability";
}
```

---

## Testing Strategy

### Unit Tests (Domain + Application)

```
tests/TutorFinder.UnitTests/
├── Domain/
│   ├── ReviewTests.cs          # Review creation rules
│   ├── TutorProfileTests.cs    # Profile validation
│   └── BookingRequestTests.cs  # State transitions
└── Application/
    ├── Validators/
    │   └── CreateBookingValidatorTests.cs
    └── Queries/
        └── SearchTutorsQueryTests.cs
```

**Tools:** xUnit, FluentAssertions, NSubstitute

### Integration Tests (API + Database)
Integration tests run against a real SQL Server instance (LocalDB or Docker).

**Tools:** WebApplicationFactory, Respawn (for database cleanup)

---

## Cross-Cutting Concerns

| Concern | Implementation |
|---------|----------------|
| Logging | Serilog + structured logging |
| Correlation | Middleware adds `X-Correlation-Id` |
| Caching | IMemoryCache for geocoding results |
| Rate Limiting | AspNetCoreRateLimit (future) |
| Health Checks | `/health` endpoint |

---

## Configuration

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddApiServices();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Configure
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));

var app = builder.Build();

// Middleware pipeline
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

---

## API Versioning

```csharp
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});
```

Routes: `/api/v1/tutors/search`, `/api/v2/...` (future)
