# .NET Backend Architecture — Clean Architecture (.NET 8)

## Goals
- Clean separation of concerns
- Testable business logic
- Stable domain model
- Simple REST API for mobile now, web later
- Location search scalable (indexing + geo queries)

## Solution Structure (backend/)
backend/
  TutorFinder.sln
  src/
    TutorFinder.Api/              (Web API, Controllers, DI, Auth)
    TutorFinder.Application/      (Use cases, DTOs, Validators)
    TutorFinder.Domain/           (Entities, ValueObjects, Domain rules)
    TutorFinder.Infrastructure/   (EF Core, external services, auth impl)
  tests/
    TutorFinder.UnitTests/
    TutorFinder.IntegrationTests/

## Layer Responsibilities
### Domain
- Entities: TutorProfile, BookingRequest, Review, AvailabilitySlot
- Enums: Category, TeachingMode, BookingStatus
- Domain rules:
  - Review allowed only if booking accepted
  - Tutor must have at least one subject + base location
  - Ratings average computed from reviews (or cached field)

### Application
- Use Cases (Commands/Queries):
  - RegisterUser, Login
  - CreateTutorProfile, UpdateTutorProfile
  - SearchTutors (by coords/postcode + radius + filters)
  - CreateBookingRequest, RespondToBookingRequest
  - CreateReview
- Validation (FluentValidation recommended)
- DTO mapping (Mapster or AutoMapper)

### Infrastructure
- EF Core DbContext
- Repositories
- Geocoding provider wrapper (postcode -> lat/lng)
- Notification provider wrapper (email, later push)
- Identity/Auth (JWT)

### API
- Controllers expose REST endpoints
- AuthZ policies (Student vs Tutor)
- Versioned routes: /api/v1/...

## Recommended Tech
- .NET 8
- PostgreSQL + PostGIS (best for geo queries)
- EF Core + Npgsql
- JWT auth (later can add refresh tokens)
- OpenAPI/Swagger

## Geo Strategy (UK)
- Store Tutor base location as lat/lng (WGS84)
- For postcode search: geocode postcode -> lat/lng -> radius search
- For fast queries:
  - PostGIS geography index OR
  - fallback: bounding box filter + Haversine

## Cross-cutting
- Logging: Serilog
- Error handling: ProblemDetails
- Validation: FluentValidation
- Result type: use a standard Result<T> pattern

## Example Use Case Flow: Search Tutors
1. Input: user coords OR postcode + radius + filters
2. If postcode: Geocode to coords via IGeocodingService
3. Query TutorProfiles within radius
4. Apply filters (mode, price, rating, category, subject)
5. Sort (distance, rating, price, best match)
6. Return paged results

## API Versioning
- Start with /api/v1
- Keep mobile stable while web evolves
