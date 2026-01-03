# Getting Started — Haulsy (Planning → Build)

This repo is organized to ship fast: **UI first**, then **backend**, then **realtime chat**, then **Autopilot**, then **Earn/Delivery**, then **Translation**, then **AR**.

---

## Step 0 — Planning (do this first)
- Read: `skill-plan.md`
- Read: `README.md` (product pitch + wedge)
- Lock MVP IN/OUT: `docs/01-scope-mvp.md`
- UI rules: `docs/03-ui-system.md`
- Trust & safety: `references/trust-safety.md`

**Decide upfront**
- Cities: Lower Mainland / Metro Vancouver
- Categories: Furniture / Electronics / Appliances / Cars
- Autopilot v0 guardrails: min price, pickup windows, delivery allowed, approval required

---

## Step 1 — UI MVP (Mock Data)
Goal: build the entire UX with fake data before wiring backend.

**Screens (must-have)**
- Browse (grid + chips + filter sheet + location radius)
- Listing detail (photos + sticky action bar: Message / Request delivery)
- Sell wizard (Photos → Details → Publish)
- Inbox list
- Chat thread (Autopilot indicator + quick chips + Translate toggle UI mock)
- Saved
- Profile (basic settings)
- Earn (delivery requests list mock)

**Done when**
- You can tap through the full flow without errors
- UI spacing/typography/buttons are consistent
- Every screen has loading/empty/error states (even if fake)

---

## Step 2 — Supabase MVP (Real Data)
Goal: make listings + photos + auth real.

- Create Supabase project
- Apply:
  - `supabase/schema.sql`
  - `supabase/policies.sql`
  - `supabase/storage-policies.sql` (if present)
- Wire Auth + profiles
- Listings CRUD
- Storage photos (follow required path convention)
- Browse query + pagination
- Saved listings

**Done when**
- A new user can sign up, create a listing with photos, and see it in the feed

---

## Step 3 — Realtime Chat
Goal: make buyer↔seller messaging real and private.

- Conversations create/read (use RPC if implemented)
- Messages insert/read
- Realtime subscribe
- Pagination / “load older”
- Block/report basics (MVP)

**Done when**
- Only participants can read messages (RLS verified)
- Messages appear in realtime on both devices

---

## Step 4 — AI Seller Autopilot v0 (Rules + Auto-Reply)
Goal: stop sellers from missing sales.

**v0 scope (keep it simple)**
- Seller sets rules per listing:
  - min price / firm price
  - pickup windows
  - delivery allowed (yes/no)
  - approval required before “pending”
- Autopilot:
  - instant auto-reply
  - answers FAQs from listing fields (price, dimensions, condition)
  - qualifies buyers (availability, budget, delivery needs)
  - pushes toward scheduling using chips
- Seller notification when a buyer is ready to confirm

**Done when**
- Autopilot can handle the first 80% of messages and only escalate when needed

---

## Step 5 — Earn Mode (Delivery v0-lite)
Goal: keep deals from dying because “I can’t pick it up.”

- Delivery request form (pickup → dropoff → item size)
- Create delivery job record:
  - requested → accepted → completed
- Earn feed (jobs near you)
- Basic driver workflow (accept → pickup → dropoff)

**Done when**
- A buyer can request delivery and a driver can accept/complete (no payments yet)

---

## Step 6 — Translation v1
Goal: remove language friction without leaking data.

- Per-chat toggle 🌐 (default OFF)
- Translate on demand or on send (depending on spec)
- Store per-user translations + “View original”
- Handle multi-language quick replies

**Done when**
- Buyer and seller can chat seamlessly across languages

---

## Step 7 — AR Fit Check (later)
Goal: reduce “will it fit?” uncertainty for furniture.

- v0: require dimensions for furniture listings
- v1: AR bounding box placement behind feature flag

---

## Suggested Build Order (TL;DR)
1) UI MVP (mock)
2) Supabase (auth + listings + photos)
3) Realtime chat
4) Autopilot v0
5) Earn Mode v0-lite
6) Translation v1
7) AR later

