
# Mobile Architecture — React Native (TypeScript)

## Goals
- Fast iteration for MVP
- Clean state management
- Offline-tolerant caching where helpful
- Works iOS/Android first
- Web later using same API contract

## Suggested Stack
- React Native + TypeScript
- Expo (recommended) for speed
- React Navigation
- TanStack Query for API caching
- Zustand (or Redux Toolkit) for app state (auth/user)
- Form: React Hook Form + Zod
- Maps: react-native-maps (Google) or Mapbox

## Structure (mobile/)
mobile/
  src/
    app/                 (navigation and screens)
    components/          (UI reusable)
    design/              (tokens, theme)
    features/
      auth/
      discovery/
      tutorProfile/
      bookings/
      reviews/
    api/                 (client + endpoints)
    store/               (auth/session)
    utils/
    types/

## State Strategy
- Server state: TanStack Query (search results, profiles, bookings)
- Client state: Zustand (token/session, UI prefs)

## Screens (MVP)
- DiscoverScreen (list + map toggle)
- SearchFiltersScreen (chips + sliders + availability)
- TutorProfileScreen
- BookingRequestScreen (modal)
- BookingsScreen (tabs: Pending/Accepted/Declined)
- Login/Register
- TutorOnboardingWizard (multi-step)
- ProfileScreen (student/tutor)

## Key UX
- Location prompt on first open
- Postcode entry fallback always visible
- List defaults to nearest with simple filters

## Web Later
- Keep API client in /src/api with typed endpoints
- Move shared types to backend-generated OpenAPI client OR shared schema in /docs
