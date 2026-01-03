
---

## `GETTING_STARTED.md` (paste this)
```md
# Getting Started — Haulsy (Planning → Build)

## Step 0 — Planning (do this first)
- Read: `skill-plan.md`
- Lock MVP IN/OUT: `docs/01-scope-mvp.md`
- UI rules: `docs/03-ui-system.md`
- Translation spec: `docs/06-translation-spec.md`
- AR spec: `docs/07-ar-spec.md`

## Step 1 — UI MVP (Mock Data)
Goal: build the full app UX with fake data before wiring backend.

**Screens**
- Browse (grid + chips + filter sheet)
- Listing detail (photos + sticky action bar)
- Sell wizard (Photos → Details → Publish)
- Inbox list
- Chat thread + Translate toggle UI (mock)
- Saved
- Profile

**Done when**
- You can tap through the entire flow without errors
- UI spacing/typography/buttons are consistent

## Step 2 — Supabase MVP (Real Data)
- Create Supabase project
- Apply `supabase/schema.sql` + `supabase/policies.sql`
- Wire Auth
- Listings CRUD + Storage photos
- Browse query + pagination

## Step 3 — Realtime Chat
- Conversations create/read
- Messages insert/read
- Realtime subscribe
- Pagination

## Step 4 — Translation
- Toggle per chat (default OFF)
- Translate-on-send function
- Store per-user translations + “View original”

## Step 5 — Delivery v0-lite
- Simple request delivery flow
- Create delivery job record

## Step 6 — AR Fit Check
- v0 dimensions required
- v1 AR bounding box behind feature flag
