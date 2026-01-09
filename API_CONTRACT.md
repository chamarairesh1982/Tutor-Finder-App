# API Contract — TutorFinder UK (v1)

Base URL: /api/v1

## Auth
### POST /auth/register
Body:
- email
- password
- role (Student|Tutor)
- displayName

### POST /auth/login
Body:
- email
- password
Returns:
- accessToken
- user { id, role, displayName }

## Tutor Profiles
### POST /tutors
Auth: Tutor
Creates tutor profile (onboarding)

### PUT /tutors/{tutorId}
Auth: Tutor (owner)
Updates profile

### GET /tutors/{tutorId}
Public (or Auth optional)
Returns full tutor profile + subjects + availability + reviews summary

### GET /tutors/search
Query params:
- lat (optional)
- lng (optional)
- postcode (optional)
- radiusMiles (default 10)
- subject (optional)
- category (optional)
- minRating (optional)
- priceMin (optional)
- priceMax (optional)
- mode (InPerson|Online|Both)
- availabilityDay (optional 0..6)
- sort (nearest|best|rating|price)
- page, pageSize

Rules:
- Either (lat & lng) OR postcode required.
- If postcode provided, backend geocodes it.

Returns:
- items: TutorSearchResult[]
  - tutorId, name, photoUrl, subjects[], category, distanceMiles, pricePerHour,
    averageRating, reviewCount, verificationFlags, teachingMode, nextAvailableText
- totalCount

## Bookings
### POST /bookings
Auth: Student
Body:
- tutorId
- requestedMode
- preferredDate (optional)
- preferredTimeRange (optional)
- message

Returns: BookingRequest details

### GET /bookings
Auth: Student or Tutor
Returns bookings relevant to user

### POST /bookings/{bookingId}/respond
Auth: Tutor (owner)
Body:
- action (Accept|Decline)
- message (optional)
Updates status

### POST /bookings/{bookingId}/messages
Auth: Student or Tutor (participants)
Body:
- body
Adds message

## Reviews
### POST /reviews
Auth: Student
Body:
- bookingId
- rating (1..5)
- comment
Validation:
- booking accepted
- no existing review for booking

### GET /tutors/{tutorId}/reviews
Public
Returns list + pagination

## System
### GET /health
Returns OK

## Response Conventions
- Use ProblemDetails for errors
- Always return requestId in error responses
