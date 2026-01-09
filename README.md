# TutorFinder UK — MVP

> A **UK-based mobile-first tutor marketplace** connecting students with local tutors for Music, Sports, and Education.

[![.NET 8](https://img.shields.io/badge/.NET-8-512BD4)](https://dotnet.microsoft.com/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-000020)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791)](https://www.postgresql.org/)

---

## 🎯 Vision

Make finding and booking a trusted local tutor as easy as ordering a coffee. Bold, friendly, and built for mobile-first UK users.

---

## 🚀 MVP Features (Phase 1)

| Feature | Description |
|---------|-------------|
| **Auth** | Email/password registration with Student or Tutor role |
| **Tutor Onboarding** | Multi-step wizard: profile, subjects, location, availability, verification badges |
| **Discovery** | Search tutors by GPS or UK postcode + radius with map/list toggle |
| **Filters** | Category, subject, price range, rating, availability, teaching mode |
| **Booking Requests** | Student sends request → Tutor accepts/declines → Simple messaging thread |
| **Reviews** | Students can review tutors after accepted bookings |
| **Notifications** | Email notifications for booking status changes (push in Phase 2) |

---

## 📁 Monorepo Structure

```
/
├── backend/                    # .NET 8 Web API (Clean Architecture)
│   ├── src/
│   │   ├── TutorFinder.Api/
│   │   ├── TutorFinder.Application/
│   │   ├── TutorFinder.Domain/
│   │   └── TutorFinder.Infrastructure/
│   └── tests/
│       ├── TutorFinder.UnitTests/
│       └── TutorFinder.IntegrationTests/
│
├── mobile/                     # React Native (Expo) TypeScript
│   └── src/
│       ├── app/                # Navigation + screens
│       ├── components/         # UI components
│       ├── features/           # Auth, Discovery, Bookings, etc.
│       ├── api/                # API client
│       ├── store/              # Zustand state
│       └── design/             # Theme tokens
│
├── docs/                       # Architecture & design docs (this folder)
│
├── AGENTS.md                   # AI agent coding instructions
├── CODESTYLE.md                # Code conventions
└── README.md                   # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | .NET 8 Web API, EF Core 8, PostgreSQL 16 + PostGIS |
| **Auth** | JWT Bearer tokens (refresh tokens in Phase 2) |
| **Mobile** | React Native (Expo SDK 52), TypeScript 5.x |
| **State** | TanStack Query (server), Zustand (client) |
| **Maps** | react-native-maps (Google Maps API) |
| **Geocoding** | postcodes.io (free UK postcode API) or Google Geocoding |
| **Email** | SendGrid (MVP), SMTP fallback |

---

## 🏁 Quick Start

### Prerequisites

- .NET 8 SDK
- Node.js 20+ / npm 10+
- PostgreSQL 16 with PostGIS extension
- Expo CLI: `npm install -g expo-cli`
- Docker (optional, for local PostgreSQL)

### Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update --project src/TutorFinder.Infrastructure
dotnet run --project src/TutorFinder.Api
```

API runs at: `https://localhost:5001/swagger`

### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

Scan QR with Expo Go app (iOS/Android).

### Environment Variables

Create `.env` files based on `.env.example` in each project folder. Required:

**Backend (`backend/src/TutorFinder.Api/appsettings.Development.json`):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=tutorfinder;Username=postgres;Password=yourpassword"
  },
  "Jwt": {
    "Secret": "your-256-bit-secret-key-here-min-32-chars",
    "Issuer": "TutorFinder",
    "Audience": "TutorFinderMobile",
    "ExpiryMinutes": 60
  }
}
```

**Mobile (`mobile/.env`):**
```
API_BASE_URL=http://localhost:5001/api/v1
GOOGLE_MAPS_API_KEY=your-key
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE_DOTNET.md](./ARCHITECTURE_DOTNET.md) | Backend Clean Architecture guide |
| [ARCHITECTURE_MOBILE.md](./ARCHITECTURE_MOBILE.md) | React Native architecture |
| [API_CONTRACT.md](./API_CONTRACT.md) | Full REST API specification |
| [DATA_MODEL.md](./DATA_MODEL.md) | Entity relationships, indexes, constraints |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI tokens, components, accessibility |
| [AGENTS.md](./AGENTS.md) | AI coding agent instructions |
| [CODESTYLE.md](./CODESTYLE.md) | Code conventions |

---

## 🗺️ Roadmap

### Phase 1: MVP ✅
- Core auth, discovery, booking requests, reviews
- Email notifications
- iOS + Android via Expo

### Phase 2: Engagement
- Push notifications (Firebase)
- Refresh tokens
- Favorites/saved tutors
- Booking calendar improvements

### Phase 3: Monetization
- Payment integration (Stripe)
- Tutor subscription tiers
- Featured listings

### Phase 4: Scale
- Web app (Next.js sharing API)
- Admin dashboard
- Analytics + reporting

---

## 🤝 Contributing

1. Follow [CODESTYLE.md](./CODESTYLE.md)
2. Reference [AGENTS.md](./AGENTS.md) for task breakdown
3. Create feature branches: `feature/ABC-123-description`
4. Write tests for new features
5. PR requires 1 approval

---

## 📄 License

Proprietary — © 2026 TutorFinder UK. All rights reserved.
