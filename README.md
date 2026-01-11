# TutorFinder UK — MVP

> A **UK-based mobile-first tutor marketplace** connecting students with local tutors for Music, Sports, and Education.

[![.NET 8](https://img.shields.io/badge/.NET-8-512BD4)](https://dotnet.microsoft.com/)

[![React Native](https://img.shields.io/badge/React_Native-Expo-000020)](https://expo.dev/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927)](https://www.microsoft.com/en-gb/sql-server/)

---

## 🎯 Vision

Make finding and booking a trusted local tutor as easy as ordering a coffee. Bold, friendly, and built for mobile-first UK users with a premium, focused web-optimized experience.

---

## 🚀 MVP Features (Phase 1)

| Feature | Description |
|---------|-------------|
| **Auth** | Email/password registration with Student or Tutor role |
| **Tutor Onboarding** | Multi-step wizard: profile, subjects, location, availability, verification badges |
| **Discovery** | Search tutors by GPS or UK postcode + radius with a world-class UI |
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
│   │   ├── TutorFinder.Api/              # API Endpoints, Auth, Controllers
│   │   ├── TutorFinder.Application/      # Use Cases, DTOs, Logic
│   │   ├── TutorFinder.Domain/           # Entities, Enums
│   │   └── TutorFinder.Infrastructure/   # SQL Server, Repositories, Seeding
│   └── tests/
│       ├── TutorFinder.UnitTests/
│       └── TutorFinder.IntegrationTests/
│
├── mobile/                     # React Native (Expo) - Web Optimized
│   └── src/
│       ├── app/                # File-based routing (Expo Router)
│       ├── components/         # Shared Premium UI components
│       ├── hooks/              # API Query hooks (TanStack Query)
│       ├── lib/                # Theme, Storage utilities
│       ├── store/              # Auth & Global state (Zustand)
│       └── types/              # TypeScript definitions
│
├── docs/                       # Architecture & design docs
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | .NET 8 Web API, EF Core 9, SQL Server 2022 |

| **Auth** | JWT Bearer tokens with custom middleware |
| **Mobile** | React Native (Expo SDK 54), TypeScript 5.9 |
| **State** | TanStack Query v5 (server), Zustand (client) |
| **Web Dev** | Optimized for Web with Mobile-focused width (480px) |
| **Storage** | Cross-platform utility (SecureStore + LocalStorage fallback) |

---

## 🏁 Quick Start

### Prerequisites

- .NET 8 SDK

- Node.js 20+ / npm 10+
- SQL Server (LocalDB or Express) with Spatial support
- Expo CLI: `npm install -g expo-cli`

### Backend Setup (Postgres first, SQL Server fallback)

```bash
cd backend
# start Postgres + PostGIS locally
npm install --global cross-env # optional if you prefer
docker compose up -d

# restore/build
dotnet restore
dotnet build

# Run migrations (configure provider via appsettings: Database:Provider)
# Postgres (default): ensure ConnectionStrings:Postgres is set
# SQL Server fallback: set Database:Provider=SqlServer and ConnectionStrings:DefaultConnection
# then apply migrations
# dotnet ef database update --project src/TutorFinder.Infrastructure --startup-project src/TutorFinder.Api

# Seed test data (optional)
# 1. Run the API (see below)
# 2. POST to http://localhost:5270/api/v1/system/seed (via Swagger)
dotnet run --project src/TutorFinder.Api --launch-profile http
```

- **HTTP**: `http://localhost:5270/swagger` (Recommended for local dev)
- **HTTPS**: `https://localhost:7287/swagger`

**SQL Server local path**
- Ensure SQL Server or LocalDB is running.
- Set `Database:Provider=SqlServer` and `ConnectionStrings:DefaultConnection` (LocalDB example: `Server=(localdb)\\mssqllocaldb;Database=TutorFinder;Trusted_Connection=True;MultipleActiveResultSets=true`).
- Run `dotnet ef database update --project src/TutorFinder.Infrastructure --startup-project src/TutorFinder.Api` then `dotnet run --project src/TutorFinder.Api --launch-profile http`.

### Mobile Setup


```bash
cd mobile
npm install
npm start
# Press 'w' to run in browser (recommended for world-class UI preview)
```

### Environment Variables

**Backend (`backend/src/TutorFinder.Api/appsettings.json`):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TutorFinder;User Id=sa;Password=yourpassword;TrustServerCertificate=True"
  },
  "Jwt": {
    "Secret": "ReplaceWithAStrongSecretKeyAtLeast32CharactersLong",
    "Issuer": "TutorFinder",
    "Audience": "TutorFinderMobile"
  }
}
```

**Mobile API Configuration (`mobile/src/api/client.ts`):**
Defaults to `http://localhost:5270/api/v1` for easy local development.

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
