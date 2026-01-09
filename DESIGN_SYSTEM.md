# Design System — TutorFinder UK (Mobile First)

## Brand Personality
- Bold, friendly, modern, trustworthy
- “Local + safe + easy booking”
- Rounded cards, clear icons, bright accents

## Color Tokens (suggested)
- Primary: #2563EB (Blue)
- Secondary: #F97316 (Orange)
- Success: #16A34A (Green)
- Danger: #DC2626 (Red)
- Background: #0B1220 (Dark Navy) OR #F8FAFC (Light)
- Surface/Card: #111827 (dark) OR #FFFFFF (light)
- Text Primary: #0F172A / #F9FAFB
- Text Secondary: #64748B / #94A3B8
- Border: #E2E8F0 / #1F2937

> Use tokens; no hardcoding in components.

## Typography
- H1: 28–32, bold
- H2: 20–24, semibold
- Body: 14–16, regular
- Caption: 12–13

## Spacing
- Base unit: 4
- Common: 8, 12, 16, 24

## Radius
- Card: 16
- Button: 12
- Chips: 999

## Components (Mobile)
### 1. Tutor Card
- Photo (left) + name + subject chips
- Badges row (DBS/Certified)
- Price per hour
- Rating stars + count
- Distance (e.g., “1.8 mi”)
- Availability snippet (e.g., “Today 5–7pm”)

### 2. Filter Chips
- Category (Music/Sports/Education)
- In-person / Online / Both
- Price slider modal
- Rating min stars

### 3. Map + List Toggle
- Segmented control: “List” | “Map”
- Map pins with price bubble

### 4. Booking CTA
- Primary button: “Request Booking”
- Opens modal with:
  - Date/time preference
  - Message
  - Mode (In-person/Online)
  - Location notes (optional)

## Navigation (Bottom Tabs)
- Home (Discover)
- Search/Filters
- Bookings
- Profile

## Accessibility
- Minimum tap target 44px
- Contrast safe tokens
- Dynamic font scale friendly

## UX Rules
- Discovery must work in < 3 taps
- Always show distance + next availability
- Trust signals visible early (badges + rating)
