# TutorFinder UK (MVP)

UK-based location tutor marketplace MVP:
- Mobile app first (React Native)
- .NET Web API backend (Clean Architecture)
- Postcode + GPS discovery
- Booking requests (no payments)
- Reviews + ratings
- Tutor onboarding

## Monorepo Structure

/ (root)
  /backend        .NET Web API (Clean Architecture)
  /mobile         React Native app (iOS/Android)
  /docs           Architecture, API, data model, design system
  AGENTS.md       AI coding rules + task breakdown style
  CODESTYLE.md    Code conventions

## MVP Scope (Phase 1)
- Auth (email+password) + roles (Student, Tutor)
- Tutor profile CRUD + onboarding
- Search tutors by GPS or UK postcode + radius
- Filters: category, price, rating, availability, in-person/online
- Booking requests messaging (simple thread per request)
- Tutor accept/decline
- Reviews only after accepted booking

## Tech
- Backend: .NET 8 Web API + EF Core + PostgreSQL (recommended)
- Mobile: React Native (Expo recommended) + TypeScript
- Maps: Google Maps or Mapbox (mobile)
- Geocoding postcodes: internal service wrapper (pluggable)

## Docs
See `/docs` for architecture and contracts.
