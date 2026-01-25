# ExpertFinder UK — Expansion Action Plan

> Step-by-step roadmap to expand from Tutor Marketplace to Multi-Vertical Expert Platform.

**Version:** 1.0  
**Date:** 25 January 2026  
**Sprint Duration:** 2 weeks

---

## Quick Reference: Priority Verticals

| Priority | Vertical | Why First | Time to Launch |
|----------|----------|-----------|----------------|
| 🥇 1 | **Fitness (Personal Trainers)** | High demand, similar trust model, premium pricing | 6-8 weeks |
| 🥈 2 | **Driving Instructors** | Massive UK market, clear verification (ADI) | 8-10 weeks |
| 🥉 3 | **Sports Coaching (Tennis, Swimming)** | Extensions of current sports category | 4-6 weeks |
| 4 | Creative Arts | Low complexity, similar to education | 4-6 weeks |
| 5 | Professional Coaching | Higher prices, smaller volume | 6-8 weeks |
| 6 | Pet Training | Niche, strong trust needs | 6-8 weeks |

---

## Phase 1: Foundation Work (Weeks 1-4)

### Sprint 1 (Weeks 1-2): Category Infrastructure

**Goal:** Make the platform category-agnostic and extensible

#### Backend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Extend Category enum | P0 | 2h | Add: `Fitness`, `Driving`, `PetTraining`, `Creative`, `Professional`, `HomeSkills` |
| Create vertical_attributes table | P0 | 4h | Flexible key-value store for vertical-specific data |
| Update TutorProfile entity | P0 | 4h | Add `primary_vertical` field, update search |
| Create badge configuration | P1 | 4h | JSON-based badge definitions per vertical |
| Update search filters | P1 | 8h | Category-specific filter support |
| Seed data for new verticals | P2 | 4h | Test data for Fitness + Driving tutors |

**Deliverables:**
- [ ] Database migrations for new schema
- [ ] API supports new categories
- [ ] Search returns results for new verticals

#### Frontend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Update category selector | P0 | 4h | Add new categories with icons |
| Create vertical badge components | P0 | 6h | REPs badge, ADI badge, Insurance badge |
| Update home page categories | P1 | 4h | New category tiles with imagery |
| Create filter components per vertical | P1 | 8h | Transmission filter for Driving, etc. |

**Deliverables:**
- [ ] Category selector shows all verticals
- [ ] Badges render correctly per vertical
- [ ] Home screen reflects new categories

---

### Sprint 2 (Weeks 3-4): Onboarding & Profiles

**Goal:** Allow professionals from new verticals to register and create profiles

#### Backend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Vertical-specific validation rules | P0 | 8h | ADI required for Driving, REPs for Fitness |
| Update onboarding command | P0 | 6h | Accept vertical-specific attributes |
| Create vertical-specific DTOs | P1 | 4h | DrivingInstructorProfile, PersonalTrainerProfile |
| Image upload enhancements | P2 | 4h | Car photos for Driving, gym photos for Fitness |

#### Frontend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Conditional onboarding steps | P0 | 8h | Show different fields based on vertical |
| Vertical-specific profile views | P0 | 6h | Car details for Driving, certifications for Fitness |
| Update TutorCard for verticals | P1 | 4h | Show relevant badges/info per category |
| Create vertical landing pages | P2 | 8h | /fitness, /driving, /sports landing pages |

**Deliverables:**
- [ ] Personal trainer can complete full onboarding
- [ ] Driving instructor can complete full onboarding
- [ ] Profiles display vertical-specific information

---

## Phase 2: Fitness Vertical (Weeks 5-8)

### Sprint 3 (Weeks 5-6): Fitness MVP

**Goal:** Launch Personal Trainers and Yoga Instructors

#### Content & Marketing

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Define fitness sub-categories | P0 | 2h | Personal Training, Yoga, Pilates, Nutrition |
| Create fitness badges | P0 | 4h | REPs Level 2/3/4, Yoga Alliance, Insurance |
| Write fitness terms/policies | P1 | 4h | Health disclaimers, liability |
| Create fitness hero images | P1 | 4h | Homepage, category page assets |
| Draft fitness tutor email templates | P2 | 2h | Welcome, booking confirmation |

#### Backend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Fitness-specific search filters | P0 | 8h | Indoor/Outdoor, Online available, Specialization |
| Insurance validation | P1 | 4h | Date-based expiry tracking |
| Session package pricing | P1 | 6h | 5-pack, 10-pack pricing options |
| Health disclaimer acceptance | P1 | 4h | Required before first booking |

#### Frontend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Fitness category page | P0 | 8h | Dedicated /fitness with sub-category filters |
| Personal Trainer profile view | P0 | 6h | Certifications, specializations, equipment |
| Yoga Instructor profile view | P1 | 4h | Styles taught, experience level welcome |
| Session package purchase flow | P2 | 8h | Buy 10 sessions at discounted rate |

**Launch Checklist:**
- [ ] 20+ fitness professionals registered (seed + early sign-ups)
- [ ] All fitness badges displaying correctly
- [ ] Search filters working for fitness category
- [ ] Health disclaimer in booking flow
- [ ] Marketing: social media announcement

---

### Sprint 4 (Weeks 7-8): Fitness Optimization

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| REPs verification integration | P1 | 12h | API lookup for REPs membership |
| Fitness-specific review prompts | P2 | 4h | Ask about fitness goals achieved |
| Location type indicator | P2 | 4h | Home visit, gym, park, online |
| Equipment provided toggle | P2 | 2h | Filter for equipment availability |

---

## Phase 3: Driving Vertical (Weeks 9-12)

### Sprint 5 (Weeks 9-10): Driving MVP

**Goal:** Launch Driving Instructors

#### Content & Marketing

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Define driving sub-categories | P0 | 2h | Car, Motorcycle, HGV, Refresher |
| Create driving badges | P0 | 4h | ADI Green Badge, ADI Trainee (Pink) |
| Write driving terms | P1 | 4h | Lesson cancellation, safety |
| Create driving imagery | P1 | 4h | Category assets |
| Outreach to driving instructors | P1 | 8h | DM/email 50 local instructors |

#### Backend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Driving-specific fields | P0 | 8h | ADI number, transmission, car model |
| Pickup location types | P0 | 4h | Home, Work, Test Center |
| Transmission filter | P0 | 2h | Manual, Automatic, Both |
| Test center proximity | P1 | 6h | Nearest DVSA test center indicator |
| Block booking (intensive) | P2 | 8h | Book X lessons at once |

#### Frontend Tasks

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Driving category page | P0 | 8h | /driving with transmission filter |
| Driving Instructor profile | P0 | 6h | Car details, ADI badge, test centers |
| Pickup location selector | P1 | 6h | Map-based pickup point selection |
| Intensive course booking | P2 | 8h | Multi-day booking flow |

**Launch Checklist:**
- [ ] 15+ driving instructors registered
- [ ] ADI badge verification flow working
- [ ] Transmission filter functional
- [ ] Pickup location in booking request
- [ ] Marketing: driving instructor forums

---

### Sprint 6 (Weeks 11-12): Driving Optimization

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| DVSA ADI verification | P1 | 16h | Optional ADI number lookup API |
| Pass rate display | P2 | 8h | Calculated or self-reported |
| Theory test help toggle | P2 | 2h | Instructor offers theory support |
| Car details gallery | P2 | 4h | Photos of instructor's car |

---

## Phase 4: Sports Expansion (Weeks 13-16)

### Sprint 7-8: Extended Sports

**Goal:** Expand sports beyond basic coaching

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Tennis coaching sub-category | P0 | 6h | LTA badge, court availability |
| Swimming lessons | P0 | 6h | ASA badges, pool location, child-friendly |
| Golf instruction | P1 | 6h | PGA badge, course partnerships |
| Martial arts | P1 | 6h | Belt rank, style (Karate, BJJ, etc.) |
| Venue partnerships | P2 | 8h | Courts, pools, gyms as bookable locations |

---

## Phase 5: Creative & Professional (Weeks 17-20)

### Sprint 9-10: Creative Arts

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Photography tutoring | P1 | 4h | Portfolio link, equipment list |
| Art lessons | P1 | 4h | Styles, age groups |
| Dance instruction | P1 | 6h | Dance styles, performance credits |

### Sprint 11: Professional Coaching

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Career coaching | P1 | 6h | Industry background, LinkedIn integration |
| Business mentoring | P1 | 6h | Business achievements, areas of expertise |
| Interview preparation | P2 | 4h | Company-specific prep, mock interviews |

---

## Phase 6: Pet Services (Weeks 21-24)

### Sprint 12: Dog Training

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Dog trainer category | P1 | 6h | ABTC badge, methods, dog sizes |
| Behavior specialist | P1 | 4h | Problem behaviors specialty |
| Puppy training | P2 | 4h | New owner support |

---

## Technical Debt & Quality

### Ongoing Tasks (Each Sprint)

| Task | Frequency | Description |
|------|-----------|-------------|
| Performance optimization | Every sprint | Load times, image optimization |
| Test coverage | Every sprint | Unit + integration tests for new features |
| Code review quality | Every sprint | Architecture adherence |
| Documentation updates | Every sprint | API docs, README |
| Accessibility audit | Every 2 sprints | WCAG compliance |

---

## Marketing & Growth Per Vertical

### Launch Playbook (Per Vertical)

| Week | Activity | Details |
|------|----------|---------|
| -2 | Early access sign-ups | Landing page for pros to register interest |
| -1 | Seed data + beta testing | 10-20 early professionals onboarded |
| 0 | Soft launch | Enable category, limited marketing |
| +1 | Social media push | Targeted ads to professionals |
| +2 | Student/client outreach | "Now find X near you" campaign |
| +4 | Press/blog coverage | Local news, industry blogs |
| +8 | Performance review | Metrics, feedback, iterate |

### Key Partnerships Per Vertical

| Vertical | Partnership Opportunities |
|----------|---------------------------|
| **Fitness** | Local gyms (referral), REPs (verification), fitness blogs |
| **Driving** | DVSA (testing), driving schools (ADI recruitment), learner forums |
| **Sports** | Sports clubs, national governing bodies, leisure centers |
| **Creative** | Photography stores, art supply shops, studios |
| **Professional** | LinkedIn, career services, universities |
| **Pets** | Vets, pet stores, kennel clubs |

---

## Resource Requirements

### Team Additions (When Needed)

| Role | When | Why |
|------|------|-----|
| **Content Writer** | Phase 2 | Vertical-specific copy, SEO |
| **Growth Marketer** | Phase 2 | Acquisition per vertical |
| **QA Engineer** | Phase 3 | Manual + automated testing |
| **Customer Success** | Phase 3+ | Support increased user base |

### Budget Estimates (Per Vertical Launch)

| Item | Cost |
|------|------|
| Imagery & Design | £500-1000 |
| Ads (first month) | £1000-2000 |
| API Integrations | £0-500 (depending on API) |
| Legal Review | £500-1000 |
| **Total per vertical** | **£2000-4500** |

---

## Success Criteria

### Per Vertical Launch

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Registered Professionals | 30+ | 100+ |
| Paid Subscribers | 5+ | 30+ |
| Completed Bookings | 50+ | 200+ |
| Average Rating | 4.5+ | 4.7+ |
| Provider NPS | 35+ | 45+ |

---

## Immediate Next Actions (This Week)

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Review and approve expansion vision | Founder | Day 1 |
| 2 | Prioritize: Fitness or Driving first? | Product | Day 2 |
| 3 | Create database migration PR for new categories | Backend | Day 3 |
| 4 | Design category icons for new verticals | Design | Day 4 |
| 5 | Update home page with "Coming Soon: Fitness, Driving" | Frontend | Day 5 |
| 6 | Create early access sign-up form | Marketing | Day 5 |
| 7 | Research REPs API for fitness verification | Backend | Day 5 |
| 8 | Draft outreach message for personal trainers | Marketing | Day 5 |

---

## Decision Log

| Decision | Options | Chosen | Rationale |
|----------|---------|--------|-----------|
| First expansion vertical | Fitness vs Driving | **TBD** | Fitness: higher margins; Driving: clearer verification |
| Platform name change | Keep TutorMatch vs ExpertFinder | **TBD** | Consider after 2+ verticals live |
| Subscription pricing | Same vs different per vertical | **Different** | Value differs significantly |
| Category architecture | Flat vs nested | **Flat with sub-categories** | Simpler, extensible |

---

## Appendix: Category Icons & Imagery

| Category | Icon | Hero Image Concept |
|----------|------|-------------------|
| 🎓 Education | Graduation cap | Student with tutor at desk |
| 🏋️ Fitness | Dumbbell | Trainer with client in gym |
| 🚗 Driving | Car | Learner with instructor in car |
| ⚽ Sports | Football | Coach with student on field |
| 🎨 Creative | Palette | Artist teaching painting |
| 💼 Professional | Briefcase | Mentor in coffee shop meeting |
| 🐕 Pets | Paw | Trainer with dog in park |

---

*Action plan for ExpertFinder UK platform expansion — Version 1.0*
