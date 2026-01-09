# Data Model — TutorFinder UK

> Domain entities, relationships, constraints, and indexes for PostgreSQL + PostGIS.

---

## Enums

### UserRole
```csharp
public enum UserRole
{
    Student = 0,
    Tutor = 1,
    Admin = 2
}
```

### Category
```csharp
public enum Category
{
    Music = 0,
    Sports = 1,
    Education = 2
}
```

### TeachingMode
```csharp
public enum TeachingMode
{
    InPerson = 0,
    Online = 1,
    Both = 2
}
```

### BookingStatus
```csharp
public enum BookingStatus
{
    Pending = 0,
    Accepted = 1,
    Declined = 2,
    Cancelled = 3,
    Completed = 4
}
```

---

## Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ Id (PK)         │
│ Email           │◄─────────────────────────────────────────┐
│ PasswordHash    │                                          │
│ Role            │                                          │
│ DisplayName     │                                          │
│ CreatedAt       │                                          │
│ IsDeleted       │                                          │
└────────┬────────┘                                          │
         │ 1:1 (if Tutor)                                    │
         ▼                                                   │
┌─────────────────┐         ┌─────────────────┐             │
│  TutorProfile   │────────►│  TutorSubject   │             │
├─────────────────┤  1:N    ├─────────────────┤             │
│ Id (PK)         │         │ Id (PK)         │             │
│ UserId (FK)     │         │ TutorProfileId  │             │
│ FullName        │         │ Name            │             │
│ Bio             │         └─────────────────┘             │
│ PhotoUrl        │                                          │
│ Category        │         ┌─────────────────┐             │
│ Postcode        │────────►│AvailabilitySlot │             │
│ BaseLatitude    │  1:N    ├─────────────────┤             │
│ BaseLongitude   │         │ Id (PK)         │             │
│ Location (geo)  │         │ TutorProfileId  │             │
│ TravelRadius    │         │ DayOfWeek       │             │
│ PricePerHour    │         │ StartTime       │             │
│ TeachingMode    │         │ EndTime         │             │
│ HasDbs          │         │ IsActive        │             │
│ HasCertification│         └─────────────────┘             │
│ IsActive        │                                          │
│ AverageRating   │◄──── Denormalized                       │
│ ReviewCount     │◄──── Denormalized                       │
│ ResponseRate    │◄──── Denormalized (Phase 2)             │
│ CreatedAt       │                                          │
│ UpdatedAt       │                                          │
│ IsDeleted       │                                          │
└────────┬────────┘                                          │
         │                                                   │
         │ 1:N                                               │
         ▼                                                   │
┌─────────────────┐                                          │
│ BookingRequest  │                                          │
├─────────────────┤                                          │
│ Id (PK)         │                                          │
│ StudentUserId   │──────────────────────────────────────────┘
│ TutorProfileId  │
│ RequestedMode   │
│ PreferredDate   │
│ PreferredTime   │
│ Message         │
│ Status          │
│ CreatedAt       │
│ UpdatedAt       │
│ IsDeleted       │
└────────┬────────┘
         │ 1:N                            1:1
         ▼                                 │
┌─────────────────┐               ┌────────┴────────┐
│ BookingMessage  │               │     Review      │
├─────────────────┤               ├─────────────────┤
│ Id (PK)         │               │ Id (PK)         │
│ BookingId (FK)  │               │ BookingId (FK)  │ UNIQUE
│ SenderUserId    │               │ StudentUserId   │
│ Body            │               │ TutorProfileId  │
│ CreatedAt       │               │ Rating          │
│ IsRead          │               │ Comment         │
└─────────────────┘               │ CreatedAt       │
                                  │ IsDeleted       │
                                  └─────────────────┘
```

---

## Entities

### User

Primary user identity for authentication.

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| Id | UUID | ❌ | PK, default `gen_random_uuid()` |
| Email | VARCHAR(255) | ❌ | UNIQUE, lowercase |
| PasswordHash | VARCHAR(255) | ❌ | - |
| Role | INT | ❌ | CHECK (0,1,2) |
| DisplayName | VARCHAR(100) | ❌ | - |
| CreatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| UpdatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| IsDeleted | BOOLEAN | ❌ | default `false` |
| DeletedAt | TIMESTAMPTZ | ✅ | - |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_user_email ON "Users" (LOWER("Email")) WHERE "IsDeleted" = false;
```

---

### TutorProfile

Tutor's public profile and discovery data.

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| Id | UUID | ❌ | PK |
| UserId | UUID | ❌ | FK → Users.Id, UNIQUE |
| FullName | VARCHAR(100) | ❌ | - |
| Bio | VARCHAR(2000) | ❌ | - |
| PhotoUrl | VARCHAR(500) | ✅ | Valid URL |
| Category | INT | ❌ | CHECK (0,1,2) |
| Postcode | VARCHAR(10) | ❌ | UK postcode format |
| BaseLatitude | DECIMAL(9,6) | ❌ | CHECK (-90 to 90) |
| BaseLongitude | DECIMAL(9,6) | ❌ | CHECK (-180 to 180) |
| Location | GEOGRAPHY(Point, 4326) | ❌ | PostGIS computed |
| TravelRadiusMiles | INT | ❌ | CHECK (1-50) |
| PricePerHour | DECIMAL(8,2) | ❌ | CHECK (5.00-500.00) |
| TeachingMode | INT | ❌ | CHECK (0,1,2) |
| HasDbs | BOOLEAN | ❌ | default `false` |
| HasCertification | BOOLEAN | ❌ | default `false` |
| IsActive | BOOLEAN | ❌ | default `true` |
| AverageRating | DECIMAL(3,2) | ❌ | default `0.00`, CHECK (0-5) |
| ReviewCount | INT | ❌ | default `0`, CHECK (≥0) |
| ResponseRate | DECIMAL(5,2) | ✅ | Phase 2, CHECK (0-100) |
| CreatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| UpdatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| IsDeleted | BOOLEAN | ❌ | default `false` |
| DeletedAt | TIMESTAMPTZ | ✅ | - |

**Indexes:**
```sql
-- Spatial index for geo search (PostGIS)
CREATE INDEX idx_tutor_location ON "TutorProfiles" USING GIST ("Location");

-- Category + active filter
CREATE INDEX idx_tutor_category_active ON "TutorProfiles" ("Category", "IsActive") 
  WHERE "IsDeleted" = false;

-- Rating sort
CREATE INDEX idx_tutor_rating ON "TutorProfiles" ("AverageRating" DESC) 
  WHERE "IsDeleted" = false AND "IsActive" = true;

-- Price range filter
CREATE INDEX idx_tutor_price ON "TutorProfiles" ("PricePerHour") 
  WHERE "IsDeleted" = false AND "IsActive" = true;

-- User lookup
CREATE UNIQUE INDEX idx_tutor_user ON "TutorProfiles" ("UserId") 
  WHERE "IsDeleted" = false;
```

**Computed Column (Location):**
```sql
-- Trigger to update Location when lat/lng changes
CREATE OR REPLACE FUNCTION update_tutor_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW."Location" := ST_SetSRID(ST_MakePoint(NEW."BaseLongitude", NEW."BaseLatitude"), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tutor_location
BEFORE INSERT OR UPDATE OF "BaseLatitude", "BaseLongitude"
ON "TutorProfiles"
FOR EACH ROW EXECUTE FUNCTION update_tutor_location();
```

---

### TutorSubject

Subjects a tutor can teach (many per tutor).

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| Id | UUID | ❌ | PK |
| TutorProfileId | UUID | ❌ | FK → TutorProfiles.Id |
| Name | VARCHAR(50) | ❌ | - |
| CreatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |

**Indexes:**
```sql
CREATE INDEX idx_subject_tutor ON "TutorSubjects" ("TutorProfileId");
CREATE INDEX idx_subject_name ON "TutorSubjects" (LOWER("Name"));

-- Prevent duplicates
CREATE UNIQUE INDEX idx_subject_unique ON "TutorSubjects" ("TutorProfileId", LOWER("Name"));
```

**Constraints:**
- Max 20 subjects per tutor (enforced in application)

---

### AvailabilitySlot

Weekly recurring availability (MVP simple model).

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| Id | UUID | ❌ | PK |
| TutorProfileId | UUID | ❌ | FK → TutorProfiles.Id |
| DayOfWeek | INT | ❌ | CHECK (0-6), 0=Sunday |
| StartTime | TIME | ❌ | - |
| EndTime | TIME | ❌ | CHECK (> StartTime) |
| IsActive | BOOLEAN | ❌ | default `true` |
| CreatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| UpdatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |

**Indexes:**
```sql
CREATE INDEX idx_availability_tutor ON "AvailabilitySlots" ("TutorProfileId", "DayOfWeek") 
  WHERE "IsActive" = true;
```

**Notes:**
- Times stored in **UK local time** (Europe/London)
- Overlapping slots allowed (tutor may have multiple session types)
- Phase 2: Add exception dates, calendar integration

---

### BookingRequest

Student-to-tutor booking request with messaging.

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| Id | UUID | ❌ | PK |
| StudentUserId | UUID | ❌ | FK → Users.Id |
| TutorProfileId | UUID | ❌ | FK → TutorProfiles.Id |
| RequestedMode | INT | ❌ | CHECK (0,1) - InPerson or Online only |
| PreferredDate | DATE | ✅ | Must be future if provided |
| PreferredTimeRange | VARCHAR(100) | ✅ | Free text |
| Message | VARCHAR(1000) | ❌ | Initial message |
| Status | INT | ❌ | CHECK (0-4), default `0` (Pending) |
| ResponseMessage | VARCHAR(500) | ✅ | Tutor's response |
| RespondedAt | TIMESTAMPTZ | ✅ | - |
| CreatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| UpdatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| IsDeleted | BOOLEAN | ❌ | default `false` |
| DeletedAt | TIMESTAMPTZ | ✅ | - |

**Indexes:**
```sql
-- Student's bookings
CREATE INDEX idx_booking_student ON "BookingRequests" ("StudentUserId", "Status") 
  WHERE "IsDeleted" = false;

-- Tutor's bookings
CREATE INDEX idx_booking_tutor ON "BookingRequests" ("TutorProfileId", "Status") 
  WHERE "IsDeleted" = false;

-- Recent bookings
CREATE INDEX idx_booking_created ON "BookingRequests" ("CreatedAt" DESC) 
  WHERE "IsDeleted" = false;
```

**State Transitions:**
```
Pending → Accepted (tutor)
Pending → Declined (tutor)
Pending → Cancelled (student)
Accepted → Completed (automatic after date passes, or manual Phase 2)
```

---

### BookingMessage

Messages within a booking thread.

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| Id | UUID | ❌ | PK |
| BookingRequestId | UUID | ❌ | FK → BookingRequests.Id |
| SenderUserId | UUID | ❌ | FK → Users.Id |
| Body | VARCHAR(1000) | ❌ | - |
| IsRead | BOOLEAN | ❌ | default `false` |
| CreatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |

**Indexes:**
```sql
CREATE INDEX idx_message_booking ON "BookingMessages" ("BookingRequestId", "CreatedAt");
```

**Notes:**
- Initial booking message is stored in BookingRequest.Message
- Subsequent messages go here
- Only participants can send/read messages (enforced in application)

---

### Review

Student review of tutor after accepted booking.

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| Id | UUID | ❌ | PK |
| BookingRequestId | UUID | ❌ | FK → BookingRequests.Id, UNIQUE |
| StudentUserId | UUID | ❌ | FK → Users.Id |
| TutorProfileId | UUID | ❌ | FK → TutorProfiles.Id |
| Rating | INT | ❌ | CHECK (1-5) |
| Comment | VARCHAR(1000) | ❌ | - |
| CreatedAt | TIMESTAMPTZ | ❌ | default `NOW()` |
| IsDeleted | BOOLEAN | ❌ | default `false` |
| DeletedAt | TIMESTAMPTZ | ✅ | - |

**Indexes:**
```sql
-- One review per booking
CREATE UNIQUE INDEX idx_review_booking ON "Reviews" ("BookingRequestId") 
  WHERE "IsDeleted" = false;

-- Tutor's reviews
CREATE INDEX idx_review_tutor ON "Reviews" ("TutorProfileId", "CreatedAt" DESC) 
  WHERE "IsDeleted" = false;

-- Rating distribution queries
CREATE INDEX idx_review_tutor_rating ON "Reviews" ("TutorProfileId", "Rating") 
  WHERE "IsDeleted" = false;
```

**Trigger - Update Rating Aggregates:**
```sql
CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS TRIGGER AS $$
DECLARE
  new_avg DECIMAL(3,2);
  new_count INT;
BEGIN
  SELECT 
    COALESCE(AVG("Rating"), 0),
    COUNT(*)
  INTO new_avg, new_count
  FROM "Reviews"
  WHERE "TutorProfileId" = COALESCE(NEW."TutorProfileId", OLD."TutorProfileId")
    AND "IsDeleted" = false;
  
  UPDATE "TutorProfiles"
  SET 
    "AverageRating" = new_avg,
    "ReviewCount" = new_count,
    "UpdatedAt" = NOW()
  WHERE "Id" = COALESCE(NEW."TutorProfileId", OLD."TutorProfileId");
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tutor_rating
AFTER INSERT OR UPDATE OR DELETE ON "Reviews"
FOR EACH ROW EXECUTE FUNCTION update_tutor_rating();
```

---

## Domain Rules

### User Rules
1. Email must be unique (case-insensitive)
2. Password must meet complexity requirements
3. Role cannot be changed after registration (MVP)

### TutorProfile Rules
1. One profile per User with Tutor role
2. Must have at least 1 subject
3. Must have valid UK postcode
4. Must have valid coordinates within UK bounds
5. PricePerHour must be £5-£500
6. TravelRadius must be 1-50 miles

### Availability Rules
1. EndTime must be after StartTime
2. Maximum duration per slot: 8 hours
3. Maximum slots per tutor: 20

### Booking Rules
1. Only Students can create bookings
2. Cannot book yourself (if user is also a tutor)
3. Tutor must be active
4. Only Tutor owner can Accept/Decline
5. Only Student owner can Cancel
6. Can only respond when Status = Pending
7. PreferredDate must be in the future

### Review Rules
1. Only Student who made the booking can review
2. Booking must have Status = Accepted
3. Only one review per booking
4. Rating must be 1-5

---

## Soft Delete Strategy

All primary entities use soft delete:

```csharp
public interface ISoftDeletable
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}
```

**Query Filter (EF Core):**
```csharp
modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
modelBuilder.Entity<TutorProfile>().HasQueryFilter(t => !t.IsDeleted);
modelBuilder.Entity<BookingRequest>().HasQueryFilter(b => !b.IsDeleted);
modelBuilder.Entity<Review>().HasQueryFilter(r => !r.IsDeleted);
```

---

## Timezone Handling

| Data | Storage | Display |
|------|---------|---------|
| CreatedAt, UpdatedAt | UTC (TIMESTAMPTZ) | Converted to user's timezone |
| PreferredDate | Date only (no time) | As-is |
| AvailabilitySlot times | UK local time (TIME) | As-is |

**UK Timezone:** `Europe/London` (handles GMT/BST automatically)

---

## Database Migration Strategy

```bash
# Generate migration
dotnet ef migrations add InitialCreate --project src/TutorFinder.Infrastructure

# Apply migration
dotnet ef database update --project src/TutorFinder.Infrastructure

# Generate SQL script
dotnet ef migrations script --project src/TutorFinder.Infrastructure
```

**PostGIS Setup:**
```sql
-- Run before first migration
CREATE EXTENSION IF NOT EXISTS postgis;
```

---

## Seed Data (Development)

```csharp
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;
        
        // Admin user
        var admin = new User { Email = "admin@tutorfinder.uk", Role = UserRole.Admin, ... };
        
        // Sample tutors
        var tutors = new[]
        {
            CreateTutor("jane@example.com", "Jane Smith", Category.Music, "Piano", "SW1A 1AA"),
            CreateTutor("bob@example.com", "Bob Jones", Category.Sports, "Tennis", "M1 1AA"),
            CreateTutor("alice@example.com", "Alice Brown", Category.Education, "Maths", "B1 1AA"),
        };
        
        // Sample student
        var student = new User { Email = "student@example.com", Role = UserRole.Student, ... };
        
        await context.Users.AddRangeAsync(admin, student);
        await context.TutorProfiles.AddRangeAsync(tutors);
        await context.SaveChangesAsync();
    }
}
```

---

## Performance Considerations

### Query Optimization

1. **Geo Search:** Always use PostGIS spatial index
2. **Filtering:** Composite indexes for common filter combinations
3. **Pagination:** Use keyset pagination for large result sets (Phase 2)
4. **Denormalization:** AverageRating/ReviewCount on TutorProfile avoids joins

### Connection Pooling

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=...;Pooling=true;Maximum Pool Size=100;Connection Idle Lifetime=300"
  }
}
```

### Caching Candidates

| Data | Cache Duration | Strategy |
|------|----------------|----------|
| Categories | Forever | In-memory |
| Popular subjects | 1 hour | In-memory |
| Geocoded postcodes | 24 hours | Distributed cache |
| Tutor profiles (by ID) | 5 minutes | Query cache |
