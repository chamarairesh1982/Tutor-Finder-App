# Design System — TutorFinder UK (Mobile First)

> Bold, friendly, modern design system for trust and quick discovery.

## 🎨 Brand Personality
- **Bold** — Strong accents, confident typography
- **Friendly** — Rounded corners, warm tone
- **Modern** — Clean layouts, smooth animations
- **Trustworthy** — Verification badges, ratings prominent

---

## Color Tokens

### Light Theme
```typescript
const lightColors = {
  primary: '#2563EB',        // Blue - actions
  primaryHover: '#1D4ED8',
  primaryLight: '#DBEAFE',
  secondary: '#F97316',      // Orange - accents
  secondaryHover: '#EA580C',
  secondaryLight: '#FFEDD5',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#EAB308',
  warningLight: '#FEF9C3',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#2563EB',
};
```

### Dark Theme
```typescript
const darkColors = {
  primary: '#3B82F6',
  primaryHover: '#60A5FA',
  primaryLight: '#1E3A5F',
  secondary: '#FB923C',
  secondaryHover: '#FDBA74',
  secondaryLight: '#431407',
  success: '#22C55E',
  successLight: '#14532D',
  warning: '#FACC15',
  warningLight: '#422006',
  danger: '#EF4444',
  dangerLight: '#450A0A',
  background: '#0B1220',
  surface: '#111827',
  surfaceElevated: '#1F2937',
  border: '#1F2937',
  borderLight: '#374151',
  textPrimary: '#F9FAFB',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textInverse: '#0F172A',
  textLink: '#60A5FA',
};
```

> ⚠️ **Rule:** Use tokens only. Never hardcode hex values.

---

## Typography

**Font:** `Inter` (Google Fonts), fallback: `system-ui`

| Name | Size | Weight | Line Height |
|------|------|--------|-------------|
| displayLarge | 32px | 700 | 40px |
| displayMedium | 28px | 700 | 36px |
| headingLarge | 24px | 600 | 32px |
| headingMedium | 20px | 600 | 28px |
| headingSmall | 18px | 600 | 24px |
| bodyLarge | 16px | 400 | 24px |
| bodyMedium | 14px | 400 | 20px |
| bodySmall | 13px | 400 | 18px |
| caption | 12px | 400 | 16px |

---

## Spacing Scale (Base: 4px)

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Small chips |
| md | 8px | Buttons, inputs |
| lg | 12px | Cards |
| xl | 16px | Large cards, images |
| full | 9999px | Pills, avatars |

---

## Shadows

| Level | Usage |
|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` — Subtle lift |
| md | `0 4px 6px rgba(0,0,0,0.07)` — Cards |
| lg | `0 10px 15px rgba(0,0,0,0.1)` — Modals |
| xl | `0 20px 25px rgba(0,0,0,0.15)` — Overlays |

---

## Components

### 1. Tutor Card
- Photo: 80x80, borderRadius.xl
- Name: headingMedium
- Subjects: bodySmall, comma-separated
- Badges: DBS (green chip), Certified (blue chip)
- Price: bodyLarge, secondary, bold
- Rating: ⭐ + score + (count)
- Distance: bodySmall
- Availability: caption, green dot if today

### 2. Filter Chips
- Default: surface bg, border stroke
- Selected: primary bg, white text
- Horizontal scroll, single-select groups

### 3. Map View
- Price pins: primary color, £XX label
- Selected: enlarged, secondary accent
- Toggle: List | Map segmented control

### 4. Buttons

| Variant | Background | Text |
|---------|------------|------|
| Primary | primary | white |
| Secondary | primaryLight | primary |
| Outline | transparent | primary |
| Ghost | transparent | primary |
| Danger | danger | white |

**Sizes:** sm (32px), md (44px), lg (52px)

### 5. Inputs
- Height: 48px
- Focused: primary border 2px
- Error: danger border + error text
- Label: caption, above

### 6. Bottom Sheet
- Drag handle: 40x4px centered
- Border radius: xl top corners
- Backdrop: black 50%

### 7. Rating Stars
- Filled: #FFC107 (amber)
- Empty: borderLight
- Display + input modes

---

## Navigation (Bottom Tabs)

| Tab | Icon | Label |
|-----|------|-------|
| 🏠 | home | Discover |
| 🔍 | search | Search |
| 📅 | calendar | Bookings |
| 👤 | person | Profile |

- Height: 64px + safe area
- Active: primary color
- Inactive: textTertiary

---

## State Patterns

### Loading
- Skeleton: shimmer animation, 1.5s loop
- Button: spinner replaces text

### Empty States
| Screen | Message | Action |
|--------|---------|--------|
| No results | "No tutors found nearby" | "Expand radius" |
| No bookings | "No bookings yet" | "Find a tutor" |

### Errors
- Inline: red text below input
- Full screen: retry button + illustration

---

## Accessibility

| Requirement | Spec |
|-------------|------|
| Tap targets | Min 44x44px |
| Contrast | WCAG 2.1 AA (4.5:1 text) |
| Focus | 2px primary outline |
| Screen reader | All labels provided |
| Dynamic type | Support up to 200% |
| Reduced motion | Respect system setting |

---

## Animation Timing

| Type | Duration | Easing |
|------|----------|--------|
| Micro | 150-200ms | ease-out |
| Transitions | 250-350ms | ease-in-out |
| Page | 300-400ms | spring |

---

## Layout

- Screen margins: 16px horizontal
- Card gap: 12px vertical
- Header height: 56px

---

## Design Checklist

- [ ] Uses design tokens only
- [ ] Follows spacing scale
- [ ] Tap targets ≥ 44px
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Accessibility labels
- [ ] Dark mode tested
- [ ] Reduced motion respected
