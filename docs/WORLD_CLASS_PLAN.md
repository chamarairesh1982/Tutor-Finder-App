# World-Class Tutor Finder App - Upgrade Plan

## Vision
Transform the existing MVP into a production-grade, secure, scalable, and beautifully designed application. We prioritize "Clean Architecture" integrity, mobile-first UX, and developer experience.

## Phase 1: World-Class Foundation (Backbone & Security)

### P0 - Critical Infrastructure (Immediate)
| ID | Task | Description | Status |
|----|------|-------------|--------|
| B1 | **Secure CORS & Headers** | Replace `AllowAnyOrigin` with config-based origins. Add HSTS, Security Headers policy. | **Done** |
| B2 | **Rate Limiting & Safety** | Add ASP.NET Core Rate Limiting (Global + Auth endpoints). | **Done** |
| B3 | **API Versioning** | Implement `Asp.Versioning.Http`. Ensure `api/v1/...` routing is strict. | **Done** |
| B4 | **Observability** | Add OpenTelemetry (logs, traces, metrics) + Serilog usage. | **Done** |
| B5 | **Seeding Safety** | Wrap `DbSeeder` in `IsDevelopment` check to prevent prod data wipes. | **Done** |
| B6 | **Caching Strategy** | Add `IMemoryCache` for high-read endpoints (Search/Geocoding). | **Done** |

### P1 - Mobile UX & Design System
| ID | Task | Description | Status |
|----|------|-------------|--------|
| M1 | **Design System Components** | Build `Text`, `Card`, `Button`, `Chip` wrapping `theme.ts`. | **Done** |
| M2 | **Error & Load States** | Standardize React Query `isLoading` / `isError` UI. | **Done** |
| M3 | **Search Experience** | Sticky search bar, filters, empty states. | **Done** |

### P2 - Quality & CI/CD
| ID | Task | Description | Status |
|----|------|-------------|--------|
| Q1 | **CI Pipeline** | GitHub Actions for Build/Test/Lint. | **Done** |
| Q2 | **Architecture Tests** | Verify "Clean Architecture" rules (Reflection-based). | **Done** |

## Phase 2: Feature Polish (UX Perfection)

### P3 - Real-Time Interactivity (SignalR)
| ID | Task | Description | Status |
|----|------|-------------|--------|
| R1 | **Backend Hub** | Helper `NotificationHub`, secure it with JWT, integrate with `NotificationService`. | **Done** |
| R2 | **Mobile Client** | Connect to SignalR, handle reconnections, show Toast on message. | **Done** |

### P4 - Navigation & Accessibility
| ID | Task | Description | Status |
|----|------|-------------|--------|
| N1 | **Deep Linking** | Typed routes for `tutor/:id`, `booking/:id` in `expo-router` config. | **Done** (Configured scheme) |
| N2 | **A11y & Focus** | Audit `accessibilityLabel`, fix keyboard focus rings on Web. | **Done** (TutorCard) |

### P5 - Payments (Foundation)
| ID | Task | Description | Status |
|----|------|-------------|--------|
| P1 | **Payment Intent** | Backend endpoint to create PaymentIntent (Stripe pattern). | **Done** (Mock) |
| P2 | **Payment UI** | Simple checkout UI (Mock/Stub for now) to complete booking flow. | **Done** (Mock) |

## Implementation Log
- [x] Plan Created
- [x] **Backend**: Secure CORS, Rate Limiting, Versioning, Observability, Safe Seeding, Caching.
- [x] **Mobile**: Design System (Text, Card, Chip, Empty/Error States), Discover Screen UX upgrade.
- [x] **Tests**: Added unit tests for GeocodingService caching.
- [x] **Quality**: Added GitHub Actions CI and Architecture Tests (enforcing Clean Arch boundaries).
- [x] **Real-time**: Implemented SignalR NotificationHub (Backend) + Mobile connection management.
- [x] **Payments**: Mock Payment Intent API (Backend) and Payment Modal/Checkout Flow (Mobile).

## Next Steps
- [ ] User testing and feedback.
- [ ] Real Stripe keys integration.
- [ ] Production deployment.
