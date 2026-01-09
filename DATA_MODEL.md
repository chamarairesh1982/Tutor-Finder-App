# Data Model (Domain) — TutorFinder UK

## Enums
- UserRole: Student, Tutor
- Category: Music, Sports, Education
- TeachingMode: InPerson, Online, Both
- BookingStatus: Pending, Accepted, Declined, Cancelled

## Entities

### User
- Id (GUID)
- Email (unique)
- PasswordHash
- Role (UserRole)
- DisplayName
- CreatedAt

### TutorProfile
- Id (GUID)
- UserId (FK User)
- FullName
- PhotoUrl
- Bio
- Category (Category) [optional if subjects cover it; but keep for filtering]
- BaseLatitude (decimal)
- BaseLongitude (decimal)
- Postcode (string, UK)
- TravelRadiusMiles (int, 1..50)
- PricePerHour (decimal)
- TeachingMode (TeachingMode)
- VerificationFlags (DBS, Certificates) (bools)
- AverageRating (decimal) (denormalized)
- ReviewCount (int) (denormalized)
- CreatedAt, UpdatedAt

### TutorSubject
- Id
- TutorProfileId
- Name (e.g., "Guitar", "Maths")

### AvailabilitySlot
- Id
- TutorProfileId
- DayOfWeek (0..6)
- StartTime (HH:mm)
- EndTime (HH:mm)
- IsActive

> MVP: weekly recurring availability (simple). Later: exceptions + calendar.

### BookingRequest
- Id
- StudentUserId (FK User)
- TutorProfileId (FK TutorProfile)
- RequestedMode (TeachingMode)
- PreferredDate (date nullable)
- PreferredTimeRange (string nullable)
- Message (string)
- Status (BookingStatus)
- CreatedAt, UpdatedAt

### BookingMessage
- Id
- BookingRequestId
- SenderUserId
- Body
- CreatedAt

> MVP: minimal chat thread.

### Review
- Id
- BookingRequestId (unique, FK)
- StudentUserId
- TutorProfileId
- Rating (1..5)
- Comment
- CreatedAt

## Core Rules
- Only Student can create BookingRequest
- Only Tutor owner can accept/decline BookingRequest
- Review can be created only if:
  - BookingRequest.Status == Accepted
  - Review not already exists for booking
- AverageRating + ReviewCount updated after review insert
