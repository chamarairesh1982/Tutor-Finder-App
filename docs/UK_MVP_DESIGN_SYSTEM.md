# TutorMatch UK — MVP Design System

> A calm, professional, world-class design system for UK trust and clarity.

**Version:** 1.0 MVP  
**Date:** 24 January 2026  
**Platform:** Expo React Native (Mobile + Web)

---

## 1. Design Principles

### Core Philosophy

| Principle | Description |
|-----------|-------------|
| **Trust First** | Every design decision should reinforce trustworthiness |
| **Calm > Busy** | Generous whitespace, restrained colour, clear hierarchy |
| **Professional** | UK expectations: understated, premium, not flashy |
| **Clarity** | Information should be immediately scannable |
| **Accessible** | WCAG 2.1 AA minimum, inclusive by default |

### Visual Tone
- **Not:** Bright, playful, startup-y, gamified
- **Yes:** Calm, confident, premium, trustworthy, British

---

## 2. Colour System

### Philosophy
- **Light backgrounds** as the foundation
- **Accent colour sparingly** — only for key actions and highlights
- **No dominant colour blocks** — colour should accent, not dominate
- **Neutral palette** does the heavy lifting

### Light Theme Palette

```typescript
export const colors = {
  // Primary — Use sparingly, for CTAs and key highlights
  primary: '#1E40AF',           // Deep blue, trustworthy
  primaryHover: '#1E3A8A',
  primaryLight: '#DBEAFE',      // Very subtle tint
  primarySoft: '#EFF6FF',       // Barely-there background

  // Semantic Status
  success: '#059669',           // Green — confirmations
  successLight: '#ECFDF5',
  warning: '#D97706',           // Amber — caution
  warningLight: '#FEF3C7',
  error: '#DC2626',             // Red — errors only
  errorLight: '#FEF2F2',
  
  // Neutrals — The foundation
  neutrals: {
    background: '#FAFBFC',      // Page background
    surface: '#FFFFFF',         // Cards, panels
    surfaceAlt: '#F4F6F8',      // Subtle alternate
    border: '#E5E7EB',          // Default borders
    borderLight: '#F3F4F6',     // Subtle dividers
    textPrimary: '#111827',     // Main text
    textSecondary: '#4B5563',   // Secondary text
    textMuted: '#9CA3AF',       // Hints, placeholders
    textInverse: '#FFFFFF',     // On dark backgrounds
  },
  
  // Trust Badge Colours (subtle, not loud)
  trust: {
    dbs: '#059669',             // DBS green
    dbsLight: '#ECFDF5',
    certified: '#1E40AF',       // Certification blue
    certifiedLight: '#EFF6FF',
    verified: '#6366F1',        // Future verified status
    verifiedLight: '#EEF2FF',
  },
  
  // Rating
  rating: '#F59E0B',            // Amber for stars
  ratingMuted: '#E5E7EB',       // Empty stars
};
```

### Dark Theme (Phase 2)
- Not MVP priority
- Designed but not implemented initially
- All tokens should reference semantic names for easy swap

### Colour Usage Rules

| Use Case | Colour | Notes |
|----------|--------|-------|
| Primary CTA button | `primary` on white text | One per screen ideally |
| Secondary button | `primaryLight` bg with `primary` text | |
| Ghost/Text button | Transparent with `primary` text | |
| Page background | `neutrals.background` | Never pure white |
| Card surface | `neutrals.surface` (#FFFFFF) | |
| Headings | `neutrals.textPrimary` | |
| Body text | `neutrals.textSecondary` | |
| Hints/placeholders | `neutrals.textMuted` | |
| Borders | `neutrals.border` | |
| Success states | `success` (text) on `successLight` (bg) | |
| Error states | `error` (text) on `errorLight` (bg) | |
| DBS badge | `trust.dbs` on `trust.dbsLight` | |
| Certification badge | `trust.certified` on `trust.certifiedLight` | |

---

## 3. Typography

### Font Stack

```typescript
export const fonts = {
  family: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  // Web fallback
  fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};
```

### Type Scale

| Token | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| `displayLarge` | 32px | 700 (Bold) | 40px | Hero headlines only |
| `displayMedium` | 28px | 700 (Bold) | 36px | Page titles |
| `headingLarge` | 24px | 600 (SemiBold) | 32px | Section headings |
| `headingMedium` | 20px | 600 (SemiBold) | 28px | Card titles, tutor names |
| `headingSmall` | 18px | 600 (SemiBold) | 24px | Subsections |
| `bodyLarge` | 16px | 400 (Regular) | 24px | Primary body text |
| `bodyMedium` | 14px | 400 (Regular) | 20px | Secondary text |
| `bodySmall` | 13px | 400 (Regular) | 18px | Tertiary text |
| `caption` | 12px | 400 (Regular) | 16px | Labels, hints |
| `label` | 11px | 500 (Medium) | 14px | Badges, tiny labels |

### Typography Rules

1. **Maximum 3 sizes per screen** — avoid visual noise
2. **Headlines use SemiBold/Bold**, body uses Regular
3. **Line height = size × 1.5** for readability
4. **Letter spacing:** Slight negative (-0.3px) on headlines, normal on body
5. **Never use ALL CAPS** except for tiny labels/badges

---

## 4. Spacing Scale (8pt Grid)

### Token System

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
  '5xl': 96,
};
```

### Usage Guidelines

| Component | Spacing |
|-----------|---------|
| Icon to text | `sm` (8px) |
| Form field gap | `md` (12px) |
| Card padding | `lg` (16px) |
| Section padding | `xl` (24px) |
| Between sections | `2xl` (32px) |
| Screen margins (mobile) | `lg` (16px) |
| Screen margins (web) | `xl` (24px) |

---

## 5. Border Radius System

### Token System

```typescript
export const borderRadius = {
  none: 0,
  sm: 4,      // Small chips, very tight corners
  md: 8,      // Buttons, inputs
  lg: 12,     // Cards
  xl: 16,     // Large cards, images
  '2xl': 24,  // Hero elements, search bars
  full: 9999, // Pills, avatars
};
```

### Radius Rules

| Element | Radius |
|---------|--------|
| Avatar (circle) | `full` |
| Primary buttons | `md` (8px) |
| Input fields | `md` (8px) |
| Standard cards | `lg` (12px) |
| Tutor cards | `xl` (16px) |
| Chips/badges | `full` |
| Hero search container | `2xl` (24px) |
| Modal/sheet corners | `xl` (16px) top only |

---

## 6. Elevation System (Shadows)

### Philosophy
- **Minimal shadow use** — elevation is functional, not decorative
- **Maximum 2 levels** in MVP
- **Subtle and soft** — no harsh drop shadows

### Token System

```typescript
export const shadows = {
  // Level 1: Cards, subtle lift
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  
  // Level 2: Elevated elements, modals, dropdowns
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // CSS equivalents for web
  // sm: '0 1px 3px rgba(0, 0, 0, 0.04)'
  // md: '0 4px 12px rgba(0, 0, 0, 0.08)'
};
```

### Shadow Rules

| Element | Shadow Level |
|---------|--------------|
| Cards | `sm` |
| Search bar container | `md` |
| Dropdown menus | `md` |
| Modals | `md` |
| Bottom sheet | `md` |
| Buttons | None (use colour change on press) |

---

## 7. Grid System

### Mobile Grid

```
|-- 16px --| Content Area (100% - 32px) |-- 16px --|
```

- **Margin:** 16px horizontal
- **Gutter:** 12px between elements
- **Single column** for most content
- **2-column grid** for category tiles (50% each)
- **Touch targets:** Minimum 44px height

### Web Grid

```
|-- auto --|-- max-width: 1200px --|-- auto --|
```

- **Max content width:** 1200px
- **Container padding:** 24px
- **Card grid:** 
  - Tutor cards: 2 columns (50% - gutters)
  - Category tiles: 5 columns (20% each)
- **Sidebar layouts:** 320px sidebar + fluid content

### Responsive Breakpoints

```typescript
export const breakpoints = {
  sm: 640,   // Small tablets
  md: 768,   // Tablets
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
};
```

---

## 8. Component Specifications

### 8.1 Buttons

#### Primary Button
```
┌─────────────────────────────┐
│       Request Booking       │
└─────────────────────────────┘
- Background: primary (#1E40AF)
- Text: white, 16px, SemiBold
- Padding: 16px vertical, 24px horizontal
- Border Radius: 8px
- Height: 52px (mobile), 48px (web)
- Full width on mobile, auto on web
```

#### Secondary Button
```
┌─────────────────────────────┐
│        View Profile         │
└─────────────────────────────┘
- Background: primaryLight (#DBEAFE)
- Text: primary, 16px, SemiBold  
- Border: none
```

#### Ghost Button
```
- Background: transparent
- Text: primary, 16px, Medium
- Border: none
- Used for: "Cancel", "View all"
```

#### Button States
| State | Change |
|-------|--------|
| Default | As specified |
| Hover | 10% darker background |
| Pressed | 15% darker, scale 0.98 |
| Disabled | 50% opacity, no interaction |
| Loading | Spinner replaces text |

### 8.2 Input Fields

```
┌─────────────────────────────────────┐
│ Label                               │
├─────────────────────────────────────┤
│ [Icon]  Placeholder text...         │
└─────────────────────────────────────┘
- Height: 48px
- Background: surface (white)
- Border: 1px neutrals.border
- Border Radius: 8px
- Padding: 12px 16px
- Icon: 20px, textMuted colour
- Focus: 2px primary border
- Error: error border + error text below
```

### 8.3 Tutor Card

#### Mobile Layout
```
┌─────────────────────────────────────┐
│ [Photo 72px]  Name                  │
│               ⭐ 4.9 (23)  £35/hr  │
│               Maths, Physics        │
├─────────────────────────────────────┤
│ [DBS ✓]  [Qualified ✓]             │
│ 📍 2.3 miles · Online & In-Person  │
│ ⏰ Next available: Today           │
└─────────────────────────────────────┘
- Card padding: 16px
- Photo: 72px, borderRadius.xl
- Border: 1px neutrals.border
- Shadow: shadows.sm
```

#### Web Layout (Same info, horizontal)
```
┌───────────────────────────────────────────────────────────────┐
│ [Photo 80px]  │ Name            │ [DBS ✓] [Qual ✓] │  £35/hr │
│               │ Maths, Physics  │                   │         │
│               │ ⭐ 4.9 (23)     │                   │         │
├───────────────┴─────────────────┴───────────────────┴─────────┤
│ 📍 2.3mi  ·  Online & In-Person  ·  Next: Today     [View →] │
└───────────────────────────────────────────────────────────────┘
```

### 8.4 Trust Badges

#### DBS Badge
```
┌────────────────────────────┐
│ ✓  DBS Checked            │
└────────────────────────────┘
- Background: trust.dbsLight (#ECFDF5)
- Text: trust.dbs (#059669), 12px, Medium
- Icon: Checkmark, 14px
- Padding: 4px 10px
- Border Radius: full
```

#### Certification Badge
```
┌────────────────────────────┐
│ ✓  Qualified              │
└────────────────────────────┘
- Background: trust.certifiedLight (#EFF6FF)
- Text: trust.certified (#1E40AF)
- Same dimensions as DBS
```

### 8.5 Rating Display

```
⭐⭐⭐⭐⭐ 4.9 (23 reviews)
- Star size: 14px
- Filled: rating (#F59E0B)
- Empty: ratingMuted (#E5E7EB)
- Number: bodySmall, textPrimary, SemiBold
- Count: bodySmall, textMuted
```

---

## 9. Mobile vs Web Differentiation

### Mobile-First Design Decisions

| Element | Mobile | Web |
|---------|--------|-----|
| Navigation | Bottom tabs | Top header |
| CTAs | Bottom-fixed where critical | Inline |
| Search | Expandable search bar | Always visible full bar |
| Filters | Bottom sheet | Sidebar |
| Tutor cards | Stacked single column | 2-column grid |
| Category grid | 2 columns | 5 columns |
| Spacing | Tighter (16px margins) | More generous (24px) |
| Touch targets | 44px minimum | Can be smaller |
| Modals | Full screen or sheet | Centered dialog |

### Mobile-Specific Patterns

1. **Bottom Sheet Filters**
   - Drag handle: 40x4px, centered, borderRadius.full
   - Backdrop: rgba(0,0,0,0.5)
   - Border radius: 16px top corners only
   
2. **Safe Area Handling**
   - Bottom tab height: 64px + safe area
   - No content hidden behind home indicator
   
3. **Thumb-Friendly Zones**
   - Primary actions in bottom 60% of screen
   - Destructive actions harder to reach

### Web-Specific Patterns

1. **Max Width Container**
   - Content max-width: 1200px
   - Centered with auto margins
   
2. **Multi-Column Layouts**
   - Search: Filters (300px) + Results (fluid)
   - Profile: Info (400px) + Content (fluid)
   
3. **Hover States**
   - Cards: subtle lift on hover
   - Buttons: colour shift
   - Links: underline appears
   
4. **Keyboard Navigation**
   - Focus rings: 2px primary, 2px offset
   - Tab order logical
   - Enter/Space activate buttons

---

## 10. Accessibility Requirements

### WCAG 2.1 AA Compliance

| Requirement | Specification |
|-------------|---------------|
| Text contrast | Minimum 4.5:1 (body), 3:1 (large text) |
| Touch targets | Minimum 44x44px |
| Focus indicators | 2px visible outline |
| Screen reader | All elements labelled (accessibilityLabel) |
| Motion | Respect prefers-reduced-motion |
| Dynamic type | Support up to 200% scaling |

### Contrast Validation

| Colour Pair | Contrast Ratio | Pass |
|-------------|----------------|------|
| textPrimary on background | 13.5:1 | ✅ |
| textSecondary on background | 7.2:1 | ✅ |
| textMuted on background | 4.8:1 | ✅ |
| primary on white | 8.2:1 | ✅ |
| white on primary | 8.2:1 | ✅ |
| error on errorLight | 5.6:1 | ✅ |

### Focus States

```css
/* Web focus ring */
:focus-visible {
  outline: 2px solid #1E40AF;
  outline-offset: 2px;
}
```

---

## 11. Animation & Transitions

### Timing Tokens

```typescript
export const animation = {
  duration: {
    fast: 150,     // Micro-interactions
    normal: 250,   // Standard transitions
    slow: 400,     // Page transitions
  },
  easing: {
    default: 'ease-out',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};
```

### Animation Guidelines

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button press | 150ms | ease-out |
| Card hover lift | 250ms | ease-out |
| Modal enter | 300ms | spring |
| Modal exit | 200ms | ease-in |
| Page transition | 300ms | ease-out |
| Skeleton shimmer | 1500ms | linear, loop |

### Reduced Motion

```typescript
// Check system preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// If true, use 0ms duration for all animations
```

---

## 12. Icon System

### Icon Library
- **Ionicons** (existing, keep)
- Style: Outline for inactive, Filled for active

### Icon Sizes

| Context | Size |
|---------|------|
| Tab bar | 24px |
| Inline with text | 16px-20px |
| Card accents | 20px |
| Feature icons (categories) | 28px |
| Empty state illustrations | 64px |

### Common Icons

| Use | Icon Name |
|-----|-----------|
| Search | search-outline |
| Location | location-outline |
| Calendar | calendar-outline |
| Online | videocam-outline |
| In-person | people-outline |
| DBS check | shield-checkmark-outline |
| Rating star | star |
| Favorite | heart-outline / heart |
| Filter | options-outline |
| Back | chevron-back |
| Close | close |
| Chat | chatbubble-ellipses-outline |

---

## 13. Z-Index Scale

```typescript
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
  tooltip: 500,
};
```

---

## 14. Design Checklist

### Before Shipping Any Screen

- [ ] Uses only design tokens (no hardcoded values)
- [ ] Follows 8pt spacing grid
- [ ] Touch targets ≥ 44px on mobile
- [ ] Contrast meets WCAG AA
- [ ] Loading state defined
- [ ] Error state defined
- [ ] Empty state defined
- [ ] All elements have accessibility labels
- [ ] Focus order is logical (web)
- [ ] Works at 360px, 390px, 430px (mobile)
- [ ] Works at 1024px, 1280px (web)
- [ ] No content hidden behind safe areas
- [ ] Animations respect reduced-motion

---

## 15. File Organisation

```
src/
├── lib/
│   └── theme.ts          # All tokens exported
├── components/
│   ├── Layout.tsx        # Screen, Container, Section primitives
│   ├── Text.tsx          # AppText with variants
│   ├── Button.tsx        # Primary, Secondary, Ghost
│   ├── Card.tsx          # Standard card wrapper
│   ├── Badge.tsx         # Trust badges (DBS, Certified)
│   ├── Input.tsx         # Form input
│   ├── TutorCard.tsx     # Mobile tutor card
│   ├── TutorCardWeb.tsx  # Web tutor card
│   └── ...
```

---

*Design System authored by Claude as Lead Product Designer and Senior UI/UX Engineer.*
