# API Contract — TutorFinder UK (v1)

> Stable REST API for mobile (iOS/Android) and future web clients.

**Base URL:** `/api/v1`  
**Content-Type:** `application/json`  
**Authentication:** Bearer JWT token in `Authorization` header

---

## Common Patterns

### Authentication Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Pagination Request

```
?page=1&pageSize=20
```

### Pagination Response

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

### Error Response (ProblemDetails)

```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "instance": "/api/v1/bookings",
  "traceId": "00-abc123def456-789ghi-00",
  "errors": {
    "tutorId": ["Tutor not found."],
    "message": ["Message is required.", "Message must be under 1000 characters."]
  }
}
```

### Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Input validation failed |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Business rule violation |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## 🔐 Authentication

### POST /api/v1/auth/register

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "displayName": "John Smith",
  "role": "Student"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | ✅ | Valid email, unique |
| password | string | ✅ | Min 8 chars, 1 uppercase, 1 number |
| displayName | string | ✅ | 2-100 chars |
| role | enum | ✅ | `Student` or `Tutor` |

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-01-09T18:32:00Z",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "user@example.com",
    "displayName": "John Smith",
    "role": "Student",
    "createdAt": "2026-01-09T17:32:00Z"
  }
}
```

**Errors:**
- 400: Validation errors
- 409: Email already registered

---

### POST /api/v1/auth/login

Authenticate user and get access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-01-09T18:32:00Z",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "user@example.com",
    "displayName": "John Smith",
    "role": "Student",
    "createdAt": "2026-01-09T17:32:00Z"
  }
}
```

**Errors:**
- 401: Invalid credentials

---

### GET /api/v1/auth/me

Get current authenticated user.

**Auth:** Required

**Response (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "displayName": "John Smith",
  "role": "Student",
  "createdAt": "2026-01-09T17:32:00Z"
}
```

---

## 👨‍🏫 Tutors

### POST /api/v1/tutors

Create tutor profile (onboarding).

**Auth:** Required (Tutor role)

**Request:**
```json
{
  "fullName": "Jane Smith",
  "bio": "Experienced piano teacher with 10+ years...",
  "photoUrl": "https://cdn.example.com/photos/abc123.jpg",
  "category": "Music",
  "subjects": ["Piano", "Music Theory"],
  "postcode": "SW1A 1AA",
  "baseLatitude": 51.5014,
  "baseLongitude": -0.1419,
  "travelRadiusMiles": 10,
  "pricePerHour": 35.00,
  "teachingMode": "Both",
  "hasDbs": true,
  "hasCertification": true,
  "availability": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "12:00" },
    { "dayOfWeek": 1, "startTime": "14:00", "endTime": "18:00" },
    { "dayOfWeek": 3, "startTime": "10:00", "endTime": "16:00" }
  ]
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| fullName | string | ✅ | 2-100 chars |
| bio | string | ✅ | 10-2000 chars |
| photoUrl | string | ❌ | Valid URL |
| category | enum | ✅ | `Music`, `Sports`, `Education` |
| subjects | string[] | ✅ | 1-20 subjects, each 2-50 chars |
| postcode | string | ✅ | Valid UK postcode |
| baseLatitude | decimal | ❌ | -90 to 90 (auto from postcode if missing) |
| baseLongitude | decimal | ❌ | -180 to 180 |
| travelRadiusMiles | int | ✅ | 1-50 |
| pricePerHour | decimal | ✅ | 5.00-500.00 |
| teachingMode | enum | ✅ | `InPerson`, `Online`, `Both` |
| hasDbs | bool | ❌ | Default false |
| hasCertification | bool | ❌ | Default false |
| availability | array | ❌ | See below |

**Availability Slot:**
| Field | Type | Validation |
|-------|------|------------|
| dayOfWeek | int | 0 (Sun) - 6 (Sat) |
| startTime | string | HH:mm format |
| endTime | string | HH:mm, must be > startTime |

**Response (201 Created):**
```json
{
  "id": "abc123...",
  "userId": "user123...",
  "fullName": "Jane Smith",
  "bio": "Experienced piano teacher...",
  "photoUrl": "https://...",
  "category": "Music",
  "subjects": ["Piano", "Music Theory"],
  "postcode": "SW1A 1AA",
  "baseLatitude": 51.5014,
  "baseLongitude": -0.1419,
  "travelRadiusMiles": 10,
  "pricePerHour": 35.00,
  "teachingMode": "Both",
  "hasDbs": true,
  "hasCertification": true,
  "isActive": true,
  "averageRating": 0,
  "reviewCount": 0,
  "availability": [...],
  "createdAt": "2026-01-09T17:32:00Z",
  "updatedAt": "2026-01-09T17:32:00Z"
}
```

---

### PUT /api/v1/tutors/{tutorId}

Update tutor profile.

**Auth:** Required (Tutor role, must be owner)

**Request:** Same as POST (partial allowed)

**Response (200 OK):** Updated TutorProfile

**Errors:**
- 403: Not the owner
- 404: Tutor not found

---

### GET /api/v1/tutors/{tutorId}

Get tutor profile details.

**Auth:** Optional (public endpoint)

**Response (200 OK):**
```json
{
  "id": "abc123...",
  "fullName": "Jane Smith",
  "bio": "Experienced piano teacher with 10+ years...",
  "photoUrl": "https://...",
  "category": "Music",
  "subjects": ["Piano", "Music Theory"],
  "postcode": "SW1A 1AA",
  "travelRadiusMiles": 10,
  "pricePerHour": 35.00,
  "teachingMode": "Both",
  "hasDbs": true,
  "hasCertification": true,
  "isActive": true,
  "averageRating": 4.8,
  "reviewCount": 127,
  "availability": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "12:00", "isActive": true }
  ],
  "nextAvailableText": "Tomorrow 9-12am",
  "recentReviews": [
    {
      "id": "rev1...",
      "rating": 5,
      "comment": "Excellent teacher!",
      "studentName": "Alex M.",
      "createdAt": "2026-01-08T10:00:00Z"
    }
  ],
  "createdAt": "2025-06-15T10:00:00Z"
}
```

---

### GET /api/v1/tutors/search

Search for tutors with filters.

**Auth:** Optional

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| lat | decimal | ❌* | - | Latitude |
| lng | decimal | ❌* | - | Longitude |
| postcode | string | ❌* | - | UK postcode (auto-geocoded) |
| radiusMiles | int | ❌ | 10 | Search radius (1-50) |
| category | enum | ❌ | - | Music, Sports, Education |
| subject | string | ❌ | - | Subject name (partial match) |
| minRating | decimal | ❌ | - | Minimum average rating (1-5) |
| priceMin | decimal | ❌ | - | Min price per hour |
| priceMax | decimal | ❌ | - | Max price per hour |
| mode | enum | ❌ | - | InPerson, Online, Both |
| availabilityDay | int | ❌ | - | Day of week (0-6) |
| sort | enum | ❌ | best | `nearest`, `best`, `rating`, `priceLow`, `priceHigh` |
| page | int | ❌ | 1 | Page number |
| pageSize | int | ❌ | 20 | Items per page (max 50) |

*Either `(lat, lng)` OR `postcode` is required.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "abc123...",
      "fullName": "Jane Smith",
      "photoUrl": "https://...",
      "category": "Music",
      "subjects": ["Piano", "Music Theory"],
      "pricePerHour": 35.00,
      "teachingMode": "Both",
      "hasDbs": true,
      "hasCertification": true,
      "averageRating": 4.8,
      "reviewCount": 127,
      "distanceMiles": 1.2,
      "nextAvailableText": "Today 5-7pm"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 45,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "searchLocation": {
    "latitude": 51.5014,
    "longitude": -0.1419,
    "postcode": "SW1A 1AA"
  }
}
```

**Sort Options:**
| Value | Algorithm |
|-------|-----------|
| `nearest` | Distance ascending |
| `best` | Weighted score: distance (35%) + rating (30%) + reviews (20%) + response (15%) |
| `rating` | Average rating descending |
| `priceLow` | Price ascending |
| `priceHigh` | Price descending |

---

### PATCH /api/v1/tutors/{tutorId}/status

Toggle tutor active status.

**Auth:** Required (Tutor, owner)

**Request:**
```json
{
  "isActive": false
}
```

**Response (200 OK):** Updated TutorProfile

---

## 📅 Bookings

### POST /api/v1/bookings

Create a booking request.

**Auth:** Required (Student role)

**Request:**
```json
{
  "tutorId": "abc123...",
  "requestedMode": "InPerson",
  "preferredDate": "2026-01-15",
  "preferredTimeRange": "14:00-16:00",
  "message": "Hi Jane, I'd love to learn piano basics..."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| tutorId | guid | ✅ | Must exist, must be active |
| requestedMode | enum | ✅ | InPerson, Online |
| preferredDate | date | ❌ | Must be future date |
| preferredTimeRange | string | ❌ | Free text (e.g., "afternoon", "14:00-16:00") |
| message | string | ✅ | 10-1000 chars |

**Response (201 Created):**
```json
{
  "id": "booking123...",
  "studentId": "student123...",
  "tutorId": "tutor123...",
  "tutorName": "Jane Smith",
  "tutorPhotoUrl": "https://...",
  "requestedMode": "InPerson",
  "preferredDate": "2026-01-15",
  "preferredTimeRange": "14:00-16:00",
  "message": "Hi Jane...",
  "status": "Pending",
  "createdAt": "2026-01-09T17:32:00Z",
  "updatedAt": "2026-01-09T17:32:00Z"
}
```

**Errors:**
- 404: Tutor not found
- 409: Tutor is not active

---

### GET /api/v1/bookings

Get user's bookings.

**Auth:** Required

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | enum | - | Filter by status |
| page | int | 1 | Page number |
| pageSize | int | 20 | Items per page |

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "booking123...",
      "tutorId": "tutor123...",
      "tutorName": "Jane Smith",
      "tutorPhotoUrl": "https://...",
      "studentId": "student123...",
      "studentName": "John Smith",
      "requestedMode": "InPerson",
      "preferredDate": "2026-01-15",
      "status": "Pending",
      "createdAt": "2026-01-09T17:32:00Z",
      "hasUnreadMessages": true
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 5,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```

**Notes:**
- Students see their sent requests
- Tutors see requests received for their profile

---

### GET /api/v1/bookings/{bookingId}

Get booking details with messages.

**Auth:** Required (participant only)

**Response (200 OK):**
```json
{
  "id": "booking123...",
  "studentId": "student123...",
  "studentName": "John Smith",
  "tutorId": "tutor123...",
  "tutorName": "Jane Smith",
  "tutorPhotoUrl": "https://...",
  "requestedMode": "InPerson",
  "preferredDate": "2026-01-15",
  "preferredTimeRange": "14:00-16:00",
  "status": "Pending",
  "createdAt": "2026-01-09T17:32:00Z",
  "updatedAt": "2026-01-09T17:32:00Z",
  "messages": [
    {
      "id": "msg1...",
      "senderId": "student123...",
      "senderName": "John Smith",
      "body": "Hi Jane...",
      "createdAt": "2026-01-09T17:32:00Z"
    }
  ],
  "canReview": false
}
```

---

### POST /api/v1/bookings/{bookingId}/respond

Accept or decline a booking request.

**Auth:** Required (Tutor, owner)

**Request:**
```json
{
  "action": "Accept",
  "message": "Great! Looking forward to it."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| action | enum | ✅ | `Accept`, `Decline` |
| message | string | ❌ | 0-500 chars |

**Response (200 OK):** Updated Booking

**Errors:**
- 403: Not the tutor
- 409: Booking not in Pending status

---

### POST /api/v1/bookings/{bookingId}/cancel

Cancel a booking (student only, pending only).

**Auth:** Required (Student, owner)

**Request:**
```json
{
  "reason": "Schedule changed"
}
```

**Response (200 OK):** Updated Booking with status `Cancelled`

**Errors:**
- 403: Not the student
- 409: Booking not in Pending status

---

### POST /api/v1/bookings/{bookingId}/messages

Send a message in booking thread.

**Auth:** Required (participant only)

**Request:**
```json
{
  "body": "What should I prepare for the first lesson?"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| body | string | ✅ | 1-1000 chars |

**Response (201 Created):**
```json
{
  "id": "msg123...",
  "bookingId": "booking123...",
  "senderId": "student123...",
  "senderName": "John Smith",
  "body": "What should I prepare...",
  "createdAt": "2026-01-09T17:35:00Z"
}
```

---

## ⭐ Reviews

### POST /api/v1/reviews

Create a review for a tutor.

**Auth:** Required (Student)

**Request:**
```json
{
  "bookingId": "booking123...",
  "rating": 5,
  "comment": "Jane is an excellent piano teacher! Very patient and knowledgeable."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| bookingId | guid | ✅ | Must exist, status Accepted, not already reviewed |
| rating | int | ✅ | 1-5 |
| comment | string | ✅ | 10-1000 chars |

**Response (201 Created):**
```json
{
  "id": "review123...",
  "bookingId": "booking123...",
  "tutorId": "tutor123...",
  "studentId": "student123...",
  "rating": 5,
  "comment": "Jane is an excellent...",
  "createdAt": "2026-01-09T17:40:00Z"
}
```

**Side Effects:**
- Updates tutor's `averageRating` and `reviewCount`

**Errors:**
- 404: Booking not found
- 409: Booking not accepted OR already reviewed

---

### GET /api/v1/tutors/{tutorId}/reviews

Get reviews for a tutor.

**Auth:** Optional (public)

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| page | int | 1 |
| pageSize | int | 20 |
| sort | enum | `newest` |

**Sort Options:** `newest`, `highest`, `lowest`

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "review123...",
      "rating": 5,
      "comment": "Excellent teacher!",
      "studentName": "John S.",
      "createdAt": "2026-01-09T17:40:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 127,
  "totalPages": 7,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "summary": {
    "averageRating": 4.8,
    "totalReviews": 127,
    "distribution": {
      "5": 98,
      "4": 20,
      "3": 6,
      "2": 2,
      "1": 1
    }
  }
}
```

---

## 📤 File Upload

### POST /api/v1/uploads/photo

Get a presigned URL for photo upload.

**Auth:** Required

**Request:**
```json
{
  "contentType": "image/jpeg",
  "fileName": "profile.jpg"
}
```

**Response (200 OK):**
```json
{
  "uploadUrl": "https://storage.example.com/upload?token=...",
  "publicUrl": "https://cdn.example.com/photos/abc123.jpg",
  "expiresAt": "2026-01-09T18:32:00Z"
}
```

**Usage:**
1. Call this endpoint to get presigned URL
2. PUT file to `uploadUrl`
3. Use `publicUrl` in profile update

---

## 🏥 System

### GET /api/v1/health

Health check endpoint.

**Auth:** None

**Response (200 OK):**
```json
{
  "status": "Healthy",
  "timestamp": "2026-01-09T17:32:00Z",
  "version": "1.0.0"
}
```

---

### GET /api/v1/categories

Get available categories and subjects.

**Auth:** None

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "Music",
      "name": "Music",
      "icon": "🎵",
      "popularSubjects": ["Piano", "Guitar", "Violin", "Singing"]
    },
    {
      "id": "Sports",
      "name": "Sports",
      "icon": "⚽",
      "popularSubjects": ["Football", "Tennis", "Swimming", "Yoga"]
    },
    {
      "id": "Education",
      "name": "Education",
      "icon": "📚",
      "popularSubjects": ["Maths", "English", "Science", "French"]
    }
  ]
}
```

---

## Rate Limiting (Phase 2)

| Endpoint | Limit |
|----------|-------|
| POST /auth/login | 5/minute |
| POST /auth/register | 3/minute |
| POST /bookings | 10/hour |
| GET /tutors/search | 60/minute |
| All others | 100/minute |

Response when limited:
```json
{
  "type": "https://httpstatuses.com/429",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

---

## Webhooks (Phase 2)

For future integrations:

| Event | Payload |
|-------|---------|
| booking.created | BookingRequest |
| booking.accepted | BookingRequest |
| booking.declined | BookingRequest |
| review.created | Review |
