# AGENTS.md — TutorFinder UK Coding Agent Instructions

## Mission
Implement TutorFinder UK MVP using:
- Backend: .NET 8 Web API (Clean Architecture)
- Mobile: React Native TypeScript (Expo recommended)

Mobile-first. Web can be added later using the same API.

## Non-negotiables
- Follow Clean Architecture boundaries strictly (Domain/Application/Infrastructure/API).
- No business logic in Controllers.
- Use DTOs for API responses; never expose EF entities directly.
- Add validations for all command inputs.
- All endpoints must have predictable error responses (ProblemDetails).
- Keep code readable and consistent with CODESTYLE.md.

## Implementation Phases (do in order)
### Phase 0 — Repo scaffold
1. Create backend solution and projects:
   - TutorFinder.Domain
   - TutorFinder.Application
   - TutorFinder.Infrastructure
   - TutorFinder.Api
2. Setup DI, Swagger, ProblemDetails, Serilog
3. Setup EF Core + PostgreSQL
4. Create initial migrations

### Phase 1 — Auth & Users
1. User entity + repository
2. Register/Login endpoints
3. JWT issuance + auth policies for roles

### Phase 2 — Tutor Onboarding
1. TutorProfile CRUD
2. Subjects + availability slots
3. Upload photo URL + verification flags (MVP boolean)

### Phase 3 — Discovery Search
1. Implement /tutors/search with lat/lng or postcode
2. Geocoding service abstraction:
   - IGeocodingService.GeocodePostcode(postcode) -> (lat,lng)
3. Query tutors within radius
4. Filters + sorting
5. Add integration tests

### Phase 4 — Booking Requests + Messaging
1. BookingRequest create
2. Accept/Decline by tutor
3. Booking messages thread

### Phase 5 — Reviews
1. Review creation only after booking accepted
2. Update rating aggregates

## Testing Requirements
- Unit tests for domain rules
- Integration tests for API endpoints
- Use Testcontainers for PostgreSQL if possible

## Mobile App Tasks
- Setup navigation tabs
- Auth screens + store token securely
- Discover: list + map toggle
- Filters + search
- Tutor profile view
- Booking request flow
- Bookings list (pending/accepted/declined)

## Coding Style
- Use async everywhere in API/DB calls
- CancellationToken on handlers
- Result<T> or OneOf pattern for use cases
- Avoid over-engineering; keep MVP simple
