# TutorMatch UI/UX World-Class Plan

## Current Issues & Diagnosis
- **Typography**: Inconsistent font sizes and weights across screens. No clear semantic hierarchy.
- **Layout**: Excessive vertical whitespace on mobile. Section spacing feels disconnected.
- **Tutor Cards**: Crowded hierarchy. Interaction between favorite heart and price is confusing. CTAs are weak on mobile.
- **Category Tiles**: Heavy visuals. Inconsistent label alignment when text wraps.
- **Search (Web)**: Single column layout wastes desktop space. Filter sidebar doesn't feel integrated.
- **Navigation**: Overlap issues with the bottom tab bar on certain mobile devices.
- **Visual Style**: Multiple card styles and border radiuses. Shadows are inconsistent.
- **A11Y**: Low contrast on muted text. Small tap targets for icons (e.g., favorite heart).

## Design System Principles
- **Grid**: 8pt spacing system (4, 8, 16, 24, 32, 48, 64).
- **Radius**: Large (24px) for cards, Medium (12px) for inputs/buttons, Small (8px) for chips.
- **Shadows**: 2 elevations (Soft Floating, Subtle Card).
- **Typography**: `AppText` component with variants (`h1-h4`, `bodyLarge`, `body`, `caption`, `label`).
- **Standardized Color Usage**: Only use theme tokens. Accessibility-first contrast (WCAG AA).

## Phase A: Design System Primitives
- [ ] Refactor `src/components/Text.tsx` to `AppText` with semantic variants.
- [ ] Create `src/components/Layout` primitives: `Screen`, `Section`, `Container`, `Spacer`.
- [ ] Standardize `AppButton` with Primary, Outline, and Ghost variants.
- [ ] Implement `AppCard` with unified elevations.
- [ ] Standardize `Chip` and `Badge` components.

## Phase B: Core Component Redesign
- [ ] **Redesign TutorCard (Mobile)**:
  - Avatar with online state.
  - Verification badges near name.
  - Clear subject line.
  - "Next available" in distinct footer.
- [ ] **Redesign TutorCard (Web)**:
  - Multi-column internal layout.
  - "View Profile" + "Book Now" prominent CTAs.
- [ ] **Redesign Category Grid**: Compact, 2-column mobile, 5-column web.

## Phase C: Screen Overhaul
- [ ] **Home Screen**: Refactor hero, search bar, and grid.
- [ ] **Search Screen (Web)**: Implement 3-column layout (Sticky Filters | Results | Preview/Action).
- [ ] **Search Screen (Mobile)**: Bottom sheet filters, consistent result cards.
- [ ] **Tutor Profile**: Refactor header, section headers, and booking CTA placement.

## Phase D: Quality & Polish
- [ ] **Safe Area Alignment**: Fix bottom tab bar overlap.
- [ ] **Animations**: Add micro-interactions (hover states for web, scale on press for mobile).
- [ ] **A11Y**: 44px hit targets + focus rings + semantic labels.
- [ ] **Performance**: Optimize list rendering and memoization.
