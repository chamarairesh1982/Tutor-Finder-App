# Mobile Architecture — React Native (TypeScript)

> Fast, beautiful, offline-tolerant mobile app for iOS and Android.

---

## Goals
- Rapid MVP iteration with Expo managed workflow
- Type-safe codebase (strict TypeScript)
- Clean separation: UI components ↔ business logic
- Offline-tolerant with smart caching
- Consistent with Design System tokens
- Upgrade path to web (shared API client)

---

## Tech Stack

| Category | Choice | Notes |
|----------|--------|-------|
| Framework | Expo SDK 54 | Based on React Native 0.76+ |
| Routing | Expo Router | File-based navigation |
| Language | TypeScript 5.9 | Full strict mode |
| Server State | TanStack Query 5 | Caching, refetching |
| Client State | Zustand 5 | Auth, global state |
| HTTP | Axios | Interceptors for auth |
| Storage | SecureStore + LocalStorage | Cross-platform persistence |

---

## Project Structure

```
mobile/
├── app/                      # Expo Router (Tabs & Screens)
│   ├── (tabs)/               # Main application tabs
│   │   ├── index.tsx         # Discover
│   │   ├── bookings.tsx      # My Bookings
│   │   └── profile.tsx       # My Profile
│   ├── (auth)/               # Auth flow screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── booking/              # Booking details
│   ├── tutor/                # Tutor details
│   └── _layout.tsx           # Global Providers
├── assets/                   # Images & Fonts
├── src/                      # Source logic
│   ├── api/                  # Axios client & types
│   ├── components/           # Premium UI components
│   ├── hooks/                # Query & logic hooks
│   ├── lib/                  # Theme & Constants
│   ├── store/                # Zustand state
│   └── types/                # TS definitions
```

---

## Navigation Architecture

### Navigator Hierarchy

```
RootNavigator
├── AuthNavigator (if not authenticated)
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen
│
└── MainTabNavigator (if authenticated)
    ├── DiscoverStack
    │   ├── DiscoverScreen
    │   ├── SearchFiltersScreen
    │   └── TutorProfileScreen
    │
    ├── BookingsStack
    │   ├── BookingsScreen
    │   └── BookingDetailScreen
    │
    └── ProfileStack
        ├── ProfileScreen
        ├── EditProfileScreen
        ├── TutorOnboardingScreen (if role=Tutor)
        └── SettingsScreen
```

### Deep Linking (Phase 2)

```typescript
const linking = {
  prefixes: ['tutorfinder://', 'https://tutorfinder.uk'],
  config: {
    screens: {
      TutorProfile: 'tutor/:tutorId',
      Booking: 'booking/:bookingId',
    },
  },
};
```

---

## State Management

### Server State (TanStack Query)

```typescript
// features/discovery/hooks/useSearchTutors.ts
export function useSearchTutors(filters: SearchFilters) {
  return useQuery({
    queryKey: ['tutors', 'search', filters],
    queryFn: () => tutorsApi.search(filters),
    staleTime: 1000 * 60 * 5,       // 5 min
    gcTime: 1000 * 60 * 30,         // 30 min cache
    placeholderData: keepPreviousData,
  });
}

// features/tutorProfile/hooks/useTutorProfile.ts
export function useTutorProfile(tutorId: string) {
  return useQuery({
    queryKey: ['tutors', tutorId],
    queryFn: () => tutorsApi.getById(tutorId),
    staleTime: 1000 * 60 * 10,
  });
}
```

### Client State (Zustand)

```typescript
// store/authStore.ts
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      login: async (token, user) => {
        await SecureStore.setItemAsync('accessToken', token);
        set({ token, user, isAuthenticated: true });
      },
      
      logout: async () => {
        await SecureStore.deleteItemAsync('accessToken');
        queryClient.clear();
        set({ token: null, user: null, isAuthenticated: false });
      },
      
      restoreSession: async () => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          // Validate token and fetch user
          try {
            const user = await authApi.me();
            set({ token, user, isAuthenticated: true });
          } catch {
            await get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ user: state.user }), // Don't persist token
    }
  )
);
```

### Filter State (Zustand)

```typescript
// store/filtersStore.ts
interface FilterState {
  location: { lat: number; lng: number } | null;
  postcode: string | null;
  radiusMiles: number;
  category: Category | null;
  subject: string | null;
  minRating: number | null;
  priceRange: [number, number] | null;
  mode: TeachingMode | null;
  sort: SortOption;
  
  setLocation: (loc: { lat: number; lng: number }) => void;
  setPostcode: (pc: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}
```

---

## API Client

### Axios Configuration

```typescript
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

### Typed Endpoints

```typescript
// api/endpoints/tutors.ts
import { apiClient } from '../client';
import { TutorSearchResult, TutorProfile, PagedResponse } from '../types';

export const tutorsApi = {
  search: async (params: SearchParams): Promise<PagedResponse<TutorSearchResult>> => {
    const { data } = await apiClient.get('/tutors/search', { params });
    return data;
  },
  
  getById: async (id: string): Promise<TutorProfile> => {
    const { data } = await apiClient.get(`/tutors/${id}`);
    return data;
  },
  
  create: async (profile: CreateTutorRequest): Promise<TutorProfile> => {
    const { data } = await apiClient.post('/tutors', profile);
    return data;
  },
  
  update: async (id: string, profile: UpdateTutorRequest): Promise<TutorProfile> => {
    const { data } = await apiClient.put(`/tutors/${id}`, profile);
    return data;
  },
};
```

---

## Token Storage & Security

### Secure Storage

```typescript
// utils/storage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  getToken: () => SecureStore.getItemAsync('accessToken'),
  setToken: (token: string) => SecureStore.setItemAsync('accessToken', token),
  removeToken: () => SecureStore.deleteItemAsync('accessToken'),
};
```

**Rules:**
- ✅ Tokens in SecureStore (encrypted, Keychain/Keystore)
- ❌ Never store tokens in AsyncStorage
- ❌ Never log tokens

---

## Offline Strategy

### Caching Approach

| Data | Strategy | Stale Time |
|------|----------|------------|
| Tutor search results | Cache-first, refresh on focus | 5 min |
| Tutor profiles | Cache-first, dedupe | 10 min |
| User's bookings | Cache-first, background refresh | 1 min |
| Reviews | Cache-first | 30 min |
| Static data (categories) | Cache-forever | ∞ |

### Network Status

```typescript
// hooks/useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
  }, []);
  
  return { isConnected };
}
```

### Offline UI

- Show cached data with "Last updated X ago" badge
- Disable mutations with "You're offline" toast
- Queue booking requests for retry (Phase 2)

---

## Screen Flows

### 1. Discovery Flow

```
DiscoverScreen
├── Location prompt (first open)
├── Postcode input (fallback)
├── Filter chips (horizontal scroll)
├── List/Map toggle
├── TutorCard list OR MapView
└── Tap card → TutorProfileScreen
    ├── Hero (photo, name, badges)
    ├── About section
    ├── Subjects chips
    ├── Availability preview
    ├── Reviews section
    └── "Request Booking" FAB
        └── BookingRequestSheet (bottom sheet)
            ├── Date picker
            ├── Time preference
            ├── Mode selector
            ├── Message input
            └── Submit button
```

### 2. Bookings Flow

```
BookingsScreen
├── Tabs: Pending | Accepted | Past
├── BookingCard list
│   ├── Tutor info (mini)
│   ├── Status badge
│   ├── Date/time
│   └── Actions (if owner)
└── Tap → BookingDetailScreen
    ├── Full booking info
    ├── Message thread
    ├── Accept/Decline (if tutor)
    └── Leave Review (if accepted + student)
```

### 3. Tutor Onboarding Flow (Multi-step)

```
TutorOnboardingScreen
├── Step 1: Basic Info
│   ├── Display name
│   ├── Bio
│   └── Photo upload
├── Step 2: Subjects
│   ├── Category selection
│   └── Subject tags (multi-select)
├── Step 3: Location
│   ├── Postcode input
│   ├── Map preview
│   └── Travel radius slider
├── Step 4: Availability
│   ├── Weekly slots picker
│   └── In-person/Online toggle
├── Step 5: Pricing
│   └── Hourly rate input
└── Step 6: Verification
    ├── DBS checkbox
    └── Qualifications
→ Submit → Profile created
```

---

## Map/List Behavior

### Map View

```typescript
// features/discovery/components/TutorMap.tsx
export function TutorMap({ tutors, onMarkerPress }: TutorMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      region={mapRegion}
      onRegionChangeComplete={handleRegionChange}
    >
      {tutors.map((tutor) => (
        <Marker
          key={tutor.id}
          coordinate={{ latitude: tutor.lat, longitude: tutor.lng }}
          onPress={() => setSelectedId(tutor.id)}
        >
          <PricePin 
            price={tutor.pricePerHour} 
            isSelected={selectedId === tutor.id} 
          />
        </Marker>
      ))}
    </MapView>
  );
}
```

### Sync Behavior

- List and Map share the same query/filters
- Selecting marker in Map highlights card in List
- "Search this area" button when map moved significantly

---

## Form Validation (Zod)

```typescript
// features/auth/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Usage in component
const { control, handleSubmit } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

---

## Error Handling

### API Errors

```typescript
// api/types/api.ts
interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: Record<string, string[]>;
}

// hooks/useApiError.ts
export function useApiError() {
  const handleError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      if (apiError.errors) {
        // Validation errors - show inline
        return { type: 'validation', errors: apiError.errors };
      }
      // General error - show toast
      Toast.show({ type: 'error', text1: apiError.title });
    } else {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  }, []);
  
  return { handleError };
}
```

---

## Performance

### Optimizations

- **FlatList:** Use `getItemLayout`, `windowSize`, `maxToRenderPerBatch`
- **Images:** Use expo-image with caching
- **Re-renders:** Memoize components, use `useCallback`/`useMemo`
- **Bundle:** Enable Hermes, use `metro.config.js` tree shaking

### Monitoring (Phase 2)

- Sentry for crash reporting
- Performance traces for slow screens

---

## Testing

### Unit Tests

```typescript
// __tests__/utils/formatters.test.ts
describe('formatDistance', () => {
  it('formats distance in miles', () => {
    expect(formatDistance(1.5)).toBe('1.5 mi');
  });
});
```

### Component Tests

```typescript
// __tests__/components/TutorCard.test.tsx
import { render, screen } from '@testing-library/react-native';
import { TutorCard } from '@/components/TutorCard';

describe('TutorCard', () => {
  it('displays tutor name and rating', () => {
    render(<TutorCard tutor={mockTutor} onPress={jest.fn()} />);
    expect(screen.getByText('Jane Smith')).toBeTruthy();
    expect(screen.getByText('4.9')).toBeTruthy();
  });
});
```

### E2E Tests (Phase 2)

- Detox for critical flows
- CI/CD integration

---

## Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.tutorfinder.uk/api/v1
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your-key

# .env.development
EXPO_PUBLIC_API_URL=http://localhost:5001/api/v1
```

---

## Build & Deploy

### Development

```bash
npx expo start
```

### Production (EAS)

```bash
# Build for stores
eas build --platform all --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Upgrade Path (Web)

1. Extract `api/` to shared package
2. Use Vite + React for web
3. Share types and API client
4. Rebuild UI with responsive components
