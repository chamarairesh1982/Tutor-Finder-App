# AGENTS.md — TutorFinder UK AI Coding Agent Instructions

> Instructions for AI coding agents working on this codebase.

---

## 🎯 Mission

Build TutorFinder UK MVP — a mobile-first UK tutor marketplace using:
- **Backend:** .NET 8 Web API (Clean Architecture)
- **Mobile:** React Native TypeScript (Expo)
- **Database:** PostgreSQL 16 + PostGIS

Mobile first. Web can be added later using the same API.

---

## 🚫 Non-Negotiables

### Architecture Rules
1. **Follow Clean Architecture boundaries strictly** — Domain/Application/Infrastructure/API
2. **No business logic in Controllers** — Controllers only: authorize → map → call service → return
3. **No EF entities in API responses** — Use DTOs always
4. **Domain layer has zero external dependencies** — No EF, no HTTP, no external packages
5. **Application layer depends only on Domain** — Interfaces defined here, implemented in Infrastructure

### Code Quality Rules
1. **Validate all command inputs** — FluentValidation in Application layer
2. **All endpoints return predictable errors** — ProblemDetails RFC 7807
3. **Async everywhere** — All DB and I/O operations
4. **CancellationToken on all handlers** — Pass through the entire call chain
5. **Use Result<T> pattern** — No exceptions for expected failures
6. **Follow CODESTYLE.md** — Read it. Follow it.

### Testing Rules
1. **Unit tests for domain rules** — Pure logic, no mocks for domain
2. **Unit tests for validators** — Every validation rule tested
3. **Integration tests for API endpoints** — Use WebApplicationFactory + Testcontainers
4. **Test naming: Method_Scenario_ExpectedResult**

### Security Rules
1. **Never log secrets** — No passwords, tokens, or API keys in logs
2. **Always hash passwords** — BCrypt with work factor 12
3. **Validate ownership** — Always check user owns resource before update/delete
4. **Parameterized queries only** — Never string concatenation for SQL

---

## 📋 Implementation Phases

### Phase 0 — Repository Scaffold
**Goal:** Runnable API skeleton with health check

**Tasks:**
1. Create solution: `TutorFinder.sln`
2. Create projects:
   - `src/TutorFinder.Domain` (classlib)
   - `src/TutorFinder.Application` (classlib)
   - `src/TutorFinder.Infrastructure` (classlib)
   - `src/TutorFinder.Api` (webapi)
   - `tests/TutorFinder.UnitTests` (xunit)
   - `tests/TutorFinder.IntegrationTests` (xunit)
3. Setup project references (Api→App→Domain, Infra→App→Domain)
4. Configure Program.cs with DI, Swagger, ProblemDetails, Serilog
5. Add `/health` endpoint
6. Configure EF Core + PostgreSQL + PostGIS
7. Create initial migration with PostGIS extension
8. Verify: `dotnet build` succeeds, Swagger loads

**Acceptance:**
```bash
curl http://localhost:5000/api/v1/health
# Returns: { "status": "Healthy" }
```

---

### Phase 1 — Authentication & Users
**Goal:** Register, login, JWT issuance

**Tasks:**
1. Create `User` entity in Domain
2. Create `IUserRepository` interface in Application
3. Create `UserRepository` in Infrastructure
4. Create `RegisterUserCommand` with validator
5. Create `LoginQuery` with validator
6. Implement `JwtService` for token generation
7. Configure JWT authentication in Program.cs
8. Create `AuthController` with `/register`, `/login`, `/me` endpoints
9. Add authorization policies: `StudentOnly`, `TutorOnly`, `AdminOnly`
10. Write integration tests for auth flows

**Acceptance:**
```bash
# Register
curl -X POST /api/v1/auth/register -d '{"email":"test@test.com","password":"Pass123!","displayName":"Test","role":"Student"}'
# Returns token + user

# Login
curl -X POST /api/v1/auth/login -d '{"email":"test@test.com","password":"Pass123!"}'
# Returns token + user

# Me
curl -H "Authorization: Bearer {token}" /api/v1/auth/me
# Returns user
```

---

### Phase 2 — Tutor Onboarding
**Goal:** Tutor can create and update profile

**Tasks:**
1. Create entities: `TutorProfile`, `TutorSubject`, `AvailabilitySlot`
2. Create EF configurations with indexes
3. Add PostGIS geography column + trigger
4. Create `ITutorRepository` interface
5. Create `CreateTutorProfileCommand` + validator
6. Create `UpdateTutorProfileCommand` + validator
7. Create `TutorsController` with POST, PUT endpoints
8. Implement `IGeocodingService` with postcodes.io
9. Add ownership check: Only profile owner can update
10. Write unit tests for profile validation
11. Write integration tests for CRUD

**Acceptance:**
```bash
# Create profile (as Tutor)
curl -X POST /api/v1/tutors -H "Authorization: Bearer {tutor_token}" \
  -d '{"fullName":"Jane","bio":"...","category":"Music","subjects":["Piano"],"postcode":"SW1A 1AA",...}'
# Returns created profile

# Update profile
curl -X PUT /api/v1/tutors/{id} -H "Authorization: Bearer {tutor_token}" -d '{...}'
# Returns updated profile
```

---

### Phase 3 — Discovery Search
**Goal:** Students can search and find tutors

**Tasks:**
1. Create `SearchTutorsQuery` with all filter params
2. Implement geo-search using PostGIS `ST_DWithin`
3. Add fallback: bounding box + Haversine if PostGIS unavailable
4. Implement all filters: category, subject, price, rating, mode, availability
5. Implement sorting: nearest, best, rating, priceLow, priceHigh
6. Implement `nextAvailableText` computation
7. Implement `best` match scoring algorithm
8. Add pagination with `PagedResponse<T>`
9. Create `GET /tutors/search` endpoint
10. Create `GET /tutors/{id}` endpoint
11. Cache geocoding results (postcode → coords)
12. Write integration tests with seed data

**Acceptance:**
```bash
# Search by postcode
curl "/api/v1/tutors/search?postcode=SW1A%201AA&radiusMiles=5&category=Music"
# Returns paged tutor results with distance

# Search by coords
curl "/api/v1/tutors/search?lat=51.5&lng=-0.1&radiusMiles=10&sort=best"
# Returns paged tutor results sorted by best match
```

---

### Phase 4 — Booking Requests & Messaging
**Goal:** Students request bookings, tutors respond

**Tasks:**
1. Create `BookingRequest` and `BookingMessage` entities
2. Create `CreateBookingRequestCommand` + validator
3. Create `RespondToBookingCommand` + validator
4. Create `CancelBookingCommand` + validator
5. Create `SendBookingMessageCommand` + validator
6. Implement status transitions with validation
7. Create `BookingsController` with all endpoints
8. Add authorization: participant-only access
9. Implement email notifications (SendGrid):
   - Booking created → Email to tutor
   - Booking accepted/declined → Email to student
10. Write integration tests for all flows

**Acceptance:**
```bash
# Create booking (as Student)
curl -X POST /api/v1/bookings -H "Authorization: Bearer {student_token}" \
  -d '{"tutorId":"...","requestedMode":"InPerson","message":"Hello..."}'
# Returns booking with Pending status

# Respond (as Tutor)
curl -X POST /api/v1/bookings/{id}/respond -H "Authorization: Bearer {tutor_token}" \
  -d '{"action":"Accept","message":"Sure!"}'
# Returns booking with Accepted status
```

---

### Phase 5 — Reviews
**Goal:** Students can review after accepted booking

**Tasks:**
1. Create `Review` entity with unique constraint on BookingId
2. Create `CreateReviewCommand` + validator
3. Implement validation: booking accepted, not already reviewed
4. Implement rating aggregate trigger (or application-level update)
5. Create `POST /reviews` endpoint
6. Create `GET /tutors/{id}/reviews` with pagination + summary
7. Write unit tests for review rules
8. Write integration tests

**Acceptance:**
```bash
# Create review (as Student, after accepted booking)
curl -X POST /api/v1/reviews -H "Authorization: Bearer {student_token}" \
  -d '{"bookingId":"...","rating":5,"comment":"Great teacher!"}'
# Returns review

# Get tutor reviews
curl /api/v1/tutors/{id}/reviews
# Returns paged reviews with rating summary
```

---

### Phase 6 — Mobile App Foundation
**Goal:** Runnable Expo app with navigation

**Tasks:**
1. Initialize Expo project with TypeScript
2. Setup project structure per ARCHITECTURE_MOBILE.md
3. Configure React Navigation (tabs + stacks)
4. Setup Zustand auth store
5. Setup TanStack Query client
6. Create theme tokens from DESIGN_SYSTEM.md
7. Create API client with Axios + interceptors
8. Implement secure token storage
9. Create Login/Register screens
10. Verify: App runs on iOS simulator + Android emulator

---

### Phase 7 — Mobile Discovery
**Goal:** Students can browse tutors

**Tasks:**
1. Implement location permission flow
2. Create postcode input fallback
3. Implement `useSearchTutors` hook
4. Create TutorCard component per design system
5. Create TutorList with FlatList optimization
6. Create TutorMap with markers
7. Implement List/Map toggle
8. Create FilterChips component
9. Implement filter bottom sheet
10. Create TutorProfileScreen
11. Implement pull-to-refresh
12. Add skeleton loaders

---

### Phase 8 — Mobile Bookings
**Goal:** Complete booking flow

**Tasks:**
1. Create BookingRequestSheet (bottom sheet form)
2. Implement `useCreateBooking` mutation
3. Create BookingsScreen with tabs (Pending/Accepted/Past)
4. Create BookingCard component
5. Create BookingDetailScreen with message thread
6. Implement `useRespondBooking` for tutors
7. Implement message sending
8. Add review prompt on accepted bookings
9. Create ReviewForm component

---

## 🧪 Testing Requirements

### Unit Test Coverage
| Area | Minimum |
|------|---------|
| Domain entities | 80% |
| Application validators | 100% |
| Application services | 70% |

### Integration Test Coverage
| Flow | Required |
|------|----------|
| Auth (register, login) | ✅ |
| Tutor CRUD | ✅ |
| Search (basic, filters, pagination) | ✅ |
| Booking lifecycle | ✅ |
| Review creation | ✅ |

### Test Tools
- **Backend:** xUnit, FluentAssertions, NSubstitute, Testcontainers
- **Mobile:** Jest, React Native Testing Library

---

## 📁 File Naming Conventions

### Backend (.NET)
```
Entities:           User.cs, TutorProfile.cs
Commands:           CreateBookingRequestCommand.cs
Queries:            SearchTutorsQuery.cs
Handlers:           CreateBookingRequestHandler.cs
Validators:         CreateBookingRequestValidator.cs
DTOs:               TutorSearchResultDto.cs
Repositories:       TutorRepository.cs
Controllers:        TutorsController.cs
Tests:              TutorsControllerTests.cs, CreateBookingRequestValidatorTests.cs
```

### Mobile (React Native)
```
Screens:            DiscoverScreen.tsx, TutorProfileScreen.tsx
Components:         TutorCard.tsx, FilterChips.tsx
Hooks:              useSearchTutors.ts, useCreateBooking.ts
API:                tutors.ts, bookings.ts
Store:              authStore.ts
Types:              tutor.ts, booking.ts
Tests:              TutorCard.test.tsx
```

---

## 🔄 Git Workflow

### Branch Naming
```
feature/ABC-123-tutor-search
bugfix/ABC-456-login-error
chore/ABC-789-update-deps
```

### Commit Messages
```
feat(api): add tutor search endpoint with geo filtering
fix(mobile): handle null location in TutorCard
test(api): add integration tests for booking flow
docs: update API contract with pagination
chore: upgrade EF Core to 8.0.2
```

### PR Requirements
1. All tests pass
2. No new linting errors
3. Documentation updated if needed
4. At least 1 approval

---

## 🚨 Common Pitfalls to Avoid

1. **Don't expose EF entities** — Always map to DTOs
2. **Don't skip validation** — Every command needs a validator
3. **Don't hardcode colors** — Use design tokens
4. **Don't forget cancellation tokens** — Pass them everywhere
5. **Don't use string interpolation in SQL** — Parameterize everything
6. **Don't store tokens in AsyncStorage** — Use SecureStore
7. **Don't skip error states** — Every screen needs loading/error/empty
8. **Don't forget ownership checks** — Validate user owns resource

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview |
| [ARCHITECTURE_DOTNET.md](./ARCHITECTURE_DOTNET.md) | Backend patterns |
| [ARCHITECTURE_MOBILE.md](./ARCHITECTURE_MOBILE.md) | Mobile patterns |
| [API_CONTRACT.md](./API_CONTRACT.md) | API specification |
| [DATA_MODEL.md](./DATA_MODEL.md) | Database schema |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI tokens |
| [CODESTYLE.md](./CODESTYLE.md) | Code conventions |

---

## ✅ Definition of Done

A task is complete when:
- [ ] Code compiles without warnings
- [ ] All tests pass
- [ ] New tests written for new functionality
- [ ] Documentation updated
- [ ] Follows CODESTYLE.md
- [ ] PR reviewed and approved
- [ ] Works on both iOS and Android (mobile tasks)
