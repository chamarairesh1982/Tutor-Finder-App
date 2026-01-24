# TutorMatch UK — MVP Definition

> A professional UK tutoring marketplace built on trust, clarity, and calm UX.

**Version:** 1.0 MVP  
**Date:** 24 January 2026  
**Status:** Final Definition

---

## 1. Target Users

### Primary Users

| User Type | Description | Primary Goal |
|-----------|-------------|--------------|
| **Parents** | UK parents seeking tutors for their children (ages 5-18) | Find trustworthy, qualified tutors safely |
| **Adult Learners** | Adults seeking tutoring (exam prep, career skills, hobbies) | Find convenient, affordable tutors |
| **Tutors** | Self-employed UK tutors seeking students | Build client base, manage bookings efficiently |

### Geographical Scope
- **MVP:** United Kingdom only
- **Future:** Designed for extension to Ireland, Europe, then global SaaS

### User Expectations (UK-Specific)
- DBS check visibility (even if self-declared)
- Clear pricing in GBP (£)
- UK postcode-based location
- Professional, understated design (not flashy)
- GDPR compliance awareness
- Safeguarding awareness in platform messaging

---

## 2. The Single Biggest Problem We Solve

> **Trust in stranger tutors.**

Parents and students need confidence that:
1. The tutor is who they say they are
2. The tutor is safe to be around (especially for children)
3. The tutor is qualified and competent
4. Other students had good experiences

**TutorMatch UK reduces this anxiety through:**
- Visible trust signals (DBS declaration, certifications, reviews)
- Clear professional profiles
- Verified reviews from completed bookings
- Transparent pricing
- Direct but structured communication

---

## 3. MVP Feature List — REQUIRED

### Discovery & Search
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Home / Discover screen | ✅ Keep, improve | Calm hero, clear categories |
| Subject category browsing | ✅ Keep | 10 core categories |
| Location-aware search | ✅ Keep | Postcode or GPS-based |
| Radius filter | ✅ Keep | Default 10 miles |
| Price range filter | ✅ Keep | £ slider |
| Rating filter | ✅ Keep | Minimum rating |
| Teaching mode filter | ✅ Keep | Online / In-Person / Both |
| Availability day filter | ✅ Keep | Simple day selector |
| Sort options | ✅ Keep | Nearest, Best Match, Rating, Price |

### Tutor Profiles
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Photo display | ✅ Keep | Fallback to initials avatar |
| Bio / About section | ✅ Keep | Clear, readable |
| Subjects list | ✅ Keep | Comma-separated or chips |
| Qualifications | ✅ Keep | Text field |
| Teaching style | ✅ Keep | Text field |
| Price per hour | ✅ Keep | Prominent GBP display |
| Location (general) | ✅ Keep | "Based in SW London" not full address |
| Teaching mode | ✅ Keep | Icons + text |
| DBS declaration badge | ✅ Keep | Self-declared with language |
| Certification badge | ✅ Keep | Self-declared |
| Average rating | ✅ Keep | Stars + number |
| Review count | ✅ Keep | "12 reviews" |
| Review list | ✅ Keep | Recent reviews visible |
| Availability summary | ✅ Keep | "Next available: Today" |
| Response time | ✅ Keep | "Typically responds in 2 hours" |

### Booking Flow
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Request booking button | ✅ Keep | Clear primary CTA |
| Mode selection | ✅ Keep | Online or In-Person |
| Preferred date picker | ✅ Keep | Optional date |
| Initial message | ✅ Keep | Required text |
| Booking confirmation | ✅ Keep | Clear feedback |
| Booking list (student view) | ✅ Keep | Pending, Accepted, Past |
| Booking list (tutor view) | ✅ Keep | Dashboard access |
| Accept / Decline (tutor) | ✅ Keep | Simple actions |
| Cancel booking (student) | ✅ Keep | With reason optional |

### Messaging
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Booking thread chat | ✅ Keep | Within booking context |
| Read receipts | ✅ Keep | Simple read status |
| Typing indicator | ✅ Keep (if exists) | Nice to have |
| Push notifications | 🔶 Defer | MVP: in-app only |

### Reviews & Ratings
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Leave review (student) | ✅ Keep | After accepted booking |
| 1-5 star rating | ✅ Keep | Standard |
| Written comment | ✅ Keep | Required with rating |
| Rating breakdown | ✅ Keep | Bar chart on profile |

### Favorites
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Save tutor | ✅ Keep | Heart icon |
| Favorites list | ✅ Keep | Tab in app |

### Tutor Dashboard
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Stats overview | ✅ Keep | Views, bookings, earnings |
| Pending bookings | ✅ Keep | Action required list |
| Profile edit | ✅ Keep | Full editing |
| Availability management | ✅ Keep | Weekly slots |
| Photo upload | ✅ Keep | Safe, with guidelines |

### Account & Settings
| Feature | MVP Scope | Notes |
|---------|-----------|-------|
| Register (Student/Tutor) | ✅ Keep | Email + password |
| Login | ✅ Keep | Standard |
| Forgot password | ✅ Keep | Email reset |
| Profile edit (basic) | ✅ Keep | Name, email |
| Change password | ✅ Keep | Standard |
| Notification preferences | 🔶 Simplify | Minimal toggles |
| Help center | ✅ Keep | FAQs + contact |
| Terms of service | ✅ Keep | Legal requirement |
| Privacy policy | ✅ Keep | Legal requirement |
| Logout | ✅ Keep | Standard |

---

## 4. MVP Pages List

### Navigation Structure

```
Bottom Tabs (Mobile)
├── Discover (Home)
├── Search
├── Bookings
└── Profile

Top Nav (Web)
├── Discover
├── Find Tutors (Search)
├── My Bookings
└── Account / Login
```

### Page Inventory (Improvements, No Removals)

| Page | Route | MVP Action |
|------|-------|------------|
| Home / Discover | `/(tabs)/index` | ✅ Improve: calmer hero, clearer trust signals |
| Search Results | `/search` | ✅ Improve: better filter UX, location prominence |
| Tutor Profile | `/tutor/[id]` | ✅ Improve: trust section, clearer CTA |
| Booking Request | `/booking` folder | ✅ Keep with improvements |
| Booking Detail | `/booking/[id]` | ✅ Improve: clearer status, messaging |
| Bookings List | `/(tabs)/bookings` | ✅ Keep, minor polish |
| Favorites | `/(tabs)/favorites` | ✅ Keep |
| Profile / Account | `/(tabs)/profile` | ✅ Improve: cleaner sections |
| Tutor Dashboard | `/profile/dashboard` | ✅ Improve: clearer stats |
| Tutor Settings | `/profile/tutor-settings` | ✅ Keep with polish |
| Edit Profile | `/profile/edit-info` | ✅ Keep |
| Change Password | `/profile/change-password` | ✅ Keep |
| Help Center | `/profile/help-center` | ✅ Keep |
| Terms | `/profile/terms` | ✅ Keep |
| Privacy | `/profile/privacy` | ✅ Keep |
| Notifications Settings | `/profile/notifications` | 🔶 Simplify |
| Login | `/(auth)/login` | ✅ Keep |
| Register | `/(auth)/register` | ✅ Keep |

---

## 5. Core User Journeys

### Journey 1: Parent Finds a Trusted Tutor

```
1. Opens app → Sees calm, professional home screen
2. Either:
   a. Taps category tile (e.g., "Maths") → Goes to search
   b. Uses search bar with subject + location → Goes to search
3. Views tutor cards with:
   - Photo, name, rating, price
   - DBS/certification badges visible
   - Distance and teaching mode
4. Taps tutor card → Views full profile
5. Sees trust section clearly:
   - "DBS Checked (Self-Declared)"
   - Reviews and ratings
   - Qualifications
6. Taps "Request Booking"
7. Selects mode (Online/In-Person), optional date, writes message
8. Submits → Sees confirmation
9. Receives notification when tutor responds
```

### Journey 2: Student Manages Bookings

```
1. Opens Bookings tab
2. Sees list organized by status:
   - Pending (awaiting response)
   - Upcoming (accepted)
   - Past (completed)
3. Taps booking → Views detail
4. Can:
   - Read/send messages
   - Cancel (if pending/upcoming)
   - Leave review (if completed, no review yet)
```

### Journey 3: Tutor Responds to Booking

```
1. Opens app → Sees notification badge on Bookings
2. Views pending request with student details
3. Reads initial message
4. Either:
   - Accepts → Booking confirmed, can message
   - Declines → With optional reason
```

### Journey 4: Tutor Sets Up Profile

```
1. Registers as Tutor
2. Completes profile wizard:
   - Name, photo
   - Subjects (multi-select or free entry)
   - Bio, qualifications, teaching style
   - Location (postcode)
   - Price per hour
   - Teaching mode (Online/In-Person/Both)
3. Declares DBS status (checkbox + optional certificate upload)
4. Sets availability (weekly schedule)
5. Profile goes live
```

### Journey 5: Leave a Review

```
1. After booking marked as completed
2. Student opens booking detail
3. Taps "Leave Review"
4. Selects 1-5 stars
5. Writes comment (required)
6. Submits → Review appears on tutor profile
```

---

## 6. NOT IN MVP — Explicitly Excluded

| Feature | Reason | Future Phase |
|---------|--------|--------------|
| **Automated payments (Stripe)** | Legal/complexity; MVP uses direct tutor arrangement | Phase 2 |
| **Identity verification (ID check)** | Requires third-party service, cost | Phase 2 |
| **Background check integration (DBS API)** | Cost and complexity; self-declaration MVP | Phase 3 |
| **Video calling in-app** | Complexity; tutors can use Zoom/Meet | Phase 3+ |
| **Calendar sync (Google/Apple)** | Nice-to-have polish | Phase 2 |
| **Push notifications (native)** | Requires native builds, setup | Phase 2 |
| **Admin panel** | Manual moderation via database initially | Phase 2 |
| **Multi-language support** | UK English only for MVP | Phase 3 |
| **Subscription/premium tutors** | Revenue model not MVP critical | Phase 2 |
| **Group lessons** | Complexity; 1-on-1 only for MVP | Phase 3 |
| **Tutor onboarding video** | Nice-to-have | Phase 2 |
| **AI-powered recommendations** | Over-engineering for MVP | Phase 3+ |
| **Social login (Google/Apple)** | Nice-to-have polish | Phase 2 |
| **Referral system** | Growth feature, not core | Phase 2 |
| **Advanced analytics (tutor)** | Basic stats sufficient for MVP | Phase 2 |

---

## 7. Trust Model

### Trust Signals Displayed

| Signal | Display Location | Implementation |
|--------|-----------------|----------------|
| **DBS Declaration** | Tutor card + profile | Checkbox in settings, badge on card |
| **DBS Certificate** | Profile only | Optional upload, viewable link |
| **Certification Badge** | Tutor card + profile | Checkbox in settings |
| **Verified Reviews** | Profile | Tied to completed bookings only |
| **Response Time** | Profile | Calculated from booking responses |
| **Member Since** | Profile | Registration date |
| **Booking Count** | Profile (subtle) | "50+ lessons completed" |

### Badge Visual Language

```
┌─────────────────────────────────────┐
│  ✓ DBS Checked (Self-Declared)      │  Green subtle badge
│  ✓ Qualified Teacher                │  Blue subtle badge
│  ⭐ 4.9 (23 reviews)                │  Amber stars
└─────────────────────────────────────┘
```

### Trust Language (UK-Appropriate)

**DO SAY:**
- "DBS Checked (Self-Declared)"
- "This tutor has declared they hold a valid DBS certificate"
- "Certificate uploaded by tutor"

**DO NOT SAY:**
- "Verified" (unless actually verified)
- "Background checked" (unless using DBS API)
- "Approved by TutorMatch"

---

## 8. Safeguarding UX

### Safeguarding Statement (Footer on Key Pages)

> TutorMatch is a marketplace connecting students with tutors. We do not employ tutors or verify credentials. Parents and students should conduct their own due diligence. If you have a safeguarding concern, please report it immediately.

### Report a Concern

- **Location:** Tutor profile page, Booking detail page
- **Action:** "Report a Concern" text link (not prominent, but accessible)
- **Flow:** Opens form/modal with:
  - Reason dropdown (Safety concern, Inappropriate behaviour, Other)
  - Details text area
  - Submit sends to admin(s) via email

### Code of Conduct (Tutor Registration)

Tutors must accept:

> I agree to:
> - Maintain professional conduct at all times
> - Never arrange lessons with minors without parental consent
> - Comply with all UK safeguarding requirements
> - Respond honestly about my qualifications and DBS status
> - Report any safeguarding concerns

---

## 9. Legal Clarity

### Platform Disclaimer (Terms of Service Key Points)

1. **Marketplace Role:** TutorMatch is a platform connecting students and tutors. We are not a party to any tutoring agreement.

2. **No Employment:** Tutors are independent contractors. TutorMatch does not employ tutors.

3. **Verification Limits:** While tutors may upload DBS certificates, TutorMatch does not verify the authenticity of these documents in MVP phase.

4. **Payment:** MVP does not process payments. Tutors and students arrange payment directly.

5. **Liability:** TutorMatch is not liable for the quality of tutoring, tutor conduct, or disputes between users.

### Cancellation Language

| Party | Timeframe | Policy |
|-------|-----------|--------|
| Student | Before acceptance | Free cancellation |
| Student | After acceptance | Advised to contact tutor |
| Tutor | Before acceptance | Decline (no penalty) |
| Tutor | After acceptance | Cancel (reason required, tracked) |

---

## 10. Future Extensibility

### Designed for Expansion

The MVP architecture supports:

1. **Other Tutor Types:**
   - Music tutors (already in categories)
   - Sports coaches
   - Driving instructors
   - Personal trainers
   - Life coaches

2. **Geographic Expansion:**
   - Ireland (similar legal framework)
   - EU countries (with localization)
   - Global (with currency and regulatory adaptation)

3. **Monetization:**
   - Transaction fee per booking
   - Premium tutor subscriptions
   - Featured listings
   - Stripe Connect integration

4. **Enhanced Trust:**
   - Integrated DBS check via API
   - ID verification (Stripe Identity, Onfido)
   - Video introduction reviews

### Technical Extensibility

- Category enum designed for expansion
- Location system supports global coordinates
- Currency can be parameterized (currently GBP hardcoded)
- Role system supports additional user types

---

## 11. Success Metrics (MVP)

| Metric | Target | Measured By |
|--------|--------|-------------|
| Tutor registrations | 50+ in first month | Database count |
| Booking requests sent | 100+ in first month | Database count |
| Booking acceptance rate | >60% | Accepted / Total |
| 5-star reviews | >70% of reviews | Review ratings |
| Time to first booking | <7 days avg | User journey tracking |
| Mobile vs Web usage | 60/40 mobile | Analytics |

---

## 12. MVP Delivery Priorities

### P0 — Must Ship
1. Home/Discover screen (polished)
2. Search with filters (working, clear)
3. Tutor profile (trust-first)
4. Booking request flow (simple)
5. Bookings list (student + tutor)
6. Reviews (leave + display)
7. Auth (login, register, forgot password)

### P1 — Should Ship
1. Tutor dashboard with stats
2. Favorites
3. Profile editing (tutor + student)
4. Help center
5. Terms + Privacy pages

### P2 — Nice to Have
1. Notification preferences
2. Typing indicators in chat
3. Advanced filter combinations
4. Map view of tutors

---

*Document authored by Claude as Product Founder, Lead Product Designer, and Senior UI/UX Engineer.*
