# TutorMatch UI/UX Redesign - Fix-First Plan

## Problem Identification (P0)

1. **Incorrect Web Centering**: Home and Search screens have huge empty left/top areas due to hard-coded margins and misaligned containers.
   - *Affected File*: `mobile/src/components/Layout.tsx`, `mobile/app/(tabs)/index.tsx`, `mobile/app/search.tsx`
2. **Aggressive Color Palette**: The "purple slab" hero is too heavy. Needs neutral #F7F8FA base with purple as an accent.
   - *Affected File*: `mobile/src/lib/theme.ts`, `mobile/app/(tabs)/index.tsx`
3. **Ghosted Toggles**: Chips/SegmentedControls lack contrast and proper spacing.
   - *Affected File*: `mobile/src/components/HomeSearchBar.tsx`, `mobile/src/components/FilterSidebar.tsx`
4. **Missing Map Mode**: Search results are list-only. Needs interactive split-view (Web) and Toggle (Mobile).
   - *Affected File*: `mobile/app/search.tsx`, `mobile/src/components/MapPanel.tsx` (New)
5. **Card Hierarchy Jumble**: Tutor cards are cluttered with inconsistent badges and badges overlap content.
   - *Affected File*: `mobile/src/components/TutorCard.tsx`, `mobile/src/components/TutorCardWeb.tsx`
6. **Profile Banner Weight**: Hero section on the profile is too large/heavy, pushing critical bio info down.
   - *Affected File*: `mobile/app/tutor/[id].tsx`
7. **Safe Area Leaks**: Navigation elements and tab bars have inconsistent padding on various devices.
   - *Affected File*: `mobile/app/(tabs)/_layout.tsx`, `mobile/src/components/Layout.tsx`

---

## Redesign Principles

### 1. Mobile-First, Web-Optimized
- Mobile: Compact, thumb-driven, vertical stacks.
- Web: Multi-column, sticky elements, hover states, max-width (1200px) centered blocks.

### 2. Modern Neutral Visuals
- **Primary BG**: #F7F8FA
- **Surface**: #FFFFFF
- **Accent**: Fuchsia-700 (used for UI actions only)
- **Hierarchy**: Bold H1/H2 for headings, Slate-700/600 for body text.

### 3. Progressive Disclosure
- Don't show every filter/badge at once. Use "View More" or drawers on mobile.
- Clean cards with core metadata only; full details on Profile.

---

## Action Plan (Commit Sequence)

### Phase 1: Foundation (Tokens & Layout)
- [ ] **Commit UI: tokens**: Update `theme.ts` with #F7F8FA background, neutral palette, and refined typography.
- [ ] **Commit UI: layout**: Rewrite `Screen` and `Container` in `Layout.tsx` to handle auto-centering and max-widths correctly on Web.

### Phase 2: Item Redesign
- [ ] **Commit UI: TutorCard**: Unify card styles. Name -> Subject -> Rating -> Price. Use small verification badges.

### Phase 3: Screen Overhauls
- [ ] **Commit UX: Home**: Neutral hero with white search card. 2-col mobile grid / 5-col web grid for categories.
- [ ] **Commit UX: Search**: Implement Map mode. Split layout (Web) / Toggle (Mobile).
- [ ] **Commit UX: Profile**: Compact hero banner. Sticky booking card for Web.

### Phase 4: Quality & A11Y
- [ ] **Commit A11Y**: 44px hit targets, contrast checks, and keyboard focus rings.
