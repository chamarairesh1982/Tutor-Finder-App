# World-Class Upgrade Plan: TutorMatch UK

## Phase 0: Diagnosis Summary

### Backend (.NET 8 Clean Architecture)
- **Strengths**: Clean Architecture structure, API Versioning, Rate Limiting, OpenTelemetry base, ProblemDetails, Seeding restricted to Dev.
- **Gaps**:
    - CORS is "AllowAnyOrigin" in Dev but configurable in Prod.
    - Missing DB pattern optimization (NetTopologySuite is used but need to verify indexes).
    - Health checks are basic (generic check for Postgres).
    - Lack of request size limits.
    - Refresh token rotation exists in code but needs verification for security edge cases (family revocation).
    - Caching exists (MemoryCache) but more strategic application needed for geocoding.

### Mobile (Expo)
- **Strengths**: Rich design system tokens, responsive layout base, TanStack Query integrated.
- **Gaps**:
    - Design System implementation: Components exist but need to be the *source of truth* for all screens.
    - Accessibility Audit: Contrast ratios updated, but dynamic type and focus states need more work.
    - Navigation: Deep links and auth gate logic need verification.
    - Web Optimization: Responsive layouts improved, but keyboard navigation and desktop sidebars need polish.
    - Error/Loading UX: Inconsistent usage of Skeleton/ErrorState components.

---

## P0 Priorities (Foundation & Security)

| Task ID | Component | Task Description | Effort (Est.) |
| :--- | :--- | :--- | :--- |
| **P0-01** | Backend | **Harden CORS Policy**: Replace generic dev CORS with structured origin matching. | 1h |
| **P0-02** | Backend | **Request Integrity**: Add request size limits and security headers (Antiforgery/XSS). | 1h |
| **P0-03** | Backend | **Geo-Search Optimization**: Ensure DB indexes match `NetTopologySuite` query patterns and add geocoding cache. | 3h |
| **P0-04** | Backend | **Health Check Depth**: Implement deep health checks for DB (actual connectivity/query test). | 1h |
| **P0-05** | Backend | **Consistent CancellationToken**: Audit and propagate `CancellationToken` end-to-end. | 2h |
| **P0-06** | Mobile | **Standardized Typography**: Propagate `Text` component across all screens as the single source of truth. | 2h |
| **P0-07** | Mobile | **Global Loading/Error Pattern**: Implement TanStack Query `defaultOptions` for global error handling with `ErrorState`. | 2h |
| **P0-08** | Mobile | **Auth Gate & Session Recovery**: Hardened auth middleware with persistent refresh logic. | 3h |
| **P0-09** | Mobile | **Accessibility Overlay**: Add `accessible`, `accessibilityLabel`, and `accessibilityRole` to all interactive components. | 3h |
| **P0-10** | Mobile | **Web-First Sidebar**: Implement a proper fixed sidebar for the Search screen on desktop (>1024px). | 2h |
| **P0-11** | Backend | **Family-Based Refresh Token Revocation**: Ensure old refresh tokens are revoked when a new one is used from a suspicious context. | 3h |
| **P0-12** | CI/CD | **GitHub Actions Foundation**: Basic build/lint pipeline for Backend and Mobile. | 2h |

---

## P1 Priorities (Polish & Performance)
- Implement `Skeleton` loaders for every data-fetching component.
- Add Keyboard Navigation support for Web (shortcuts and TAB index).
- Enhanced geocoding with radius-based caching.
- Real-time notification SignalR status check in Header.

---

## P2 Priorities (Quality & Delivery)
- Playwright Smoke Tests for Web.
- Docker production compose with SSL termination.
- Performance Metrics (OpenTelemetry) Dashboard setup.
