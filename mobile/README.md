# Tutor Finder Mobile (Expo)

This is the cross-platform mobile application for Tutor Finder, built with **Expo (React Native)**. It supports iOS, Android, and Web from a single codebase.

## Tech Stack
- **Framework**: Expo (SDK 54)
- **Routing**: Expo Router (File-based)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (v5)
- **API Client**: Axios with interceptors
- **Styling**: React Native StyleSheet (Shared Design Tokens)
- **Secure Storage**: Expo Secure Store (JWT Persistence)

## Features
- **Tutor Discovery**: Search by postcode, radius, and subject categories.
- **Geospatial Search**: Integrated with UK Postcode API (postcodes.io) and SQL Server Spatial backend.
- **Premium UI**: Modern, glassmorphism-inspired design optimized for both mobile and web.
- **Booking Flow**: Request lessons, accept/decline bookings.
- **Messaging**: Contextual chat thread for every booking.
- **Auth**: Fully integrated JWT-based login and registration.

## Getting Started

1.  **Configure API URL**:
    Update `src/api/client.ts`. By default, it uses `http://localhost:5270/api/v1` for local development.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the app**:
    ```bash
    npm start
    ```

4.  **Run on platforms**:
    -   `npm run ios` (requires macOS + Xcode)
    -   `npm run android` (requires Android Studio / Emulator)
    -   `npm run web` (runs in browser)

### Running for Web Development
To start the dedicated web development server:
```bash
npm install
npx expo start --web
```
This launches the app in your default browser at `http://localhost:8081`.

## Project Structure
- `app/`: Expo Router file-based screens and layouts.
- `src/api/`: API client and shared configurations.
- `src/components/`: Reusable UI components.
- `src/hooks/`: React Query hooks for data fetching.
- `src/lib/`: Theme and utility functions.
- `src/store/`: Zustand state management.
- `src/types/`: Shared TypeScript interfaces.
