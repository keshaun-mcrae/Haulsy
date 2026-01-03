# Security — Haulsy

Goal: protect user data, prevent unauthorized access, and harden the marketplace against common abuse.

**Non-goals (MVP)**
- Payments/escrow security (out of scope until payments exist)
- Advanced identity verification (phase 2)

---

## 1) Threat Model (What can go wrong?)

### 1.1 Data Access Threats
- A user reads another user’s chats
- A user edits another user’s listing
- A driver accesses delivery jobs they shouldn’t
- Public URLs leak private images (storage misconfig)

### 1.2 Abuse / Marketplace Threats
- Scam attempts (off-platform payments, fake delivery, impersonation)
- Harassment/spam in chat
- Fake listings / bait-and-switch
- Scraping listings at scale

### 1.3 Platform Threats
- Exposed API keys
- Misconfigured RLS policies
- Over-permissive storage bucket policies
- Logging/analytics accidentally capturing PII

---

## 2) Security Principles
- **RLS-first**: database enforces permissions, not the client
- **Least privilege** everywhere
- **No secrets in client** (never ship service role key)
- **Assume hostile client**: users can call your APIs directly
- **Privacy-by-default**: translate off by default; no message content in analytics

---

## 3) Supabase RLS Verification Checklist (MVP)

### 3.1 Tables (expected access rules)
#### `profiles`
- Users can read public profile basics
- Users can update only their own profile

#### `listings`
- Anyone can read public active listings
- Only the owner can insert/update/archive/mark sold
- Archived/sold visibility rules defined (public vs owner-only)

#### `listing_images`
- Public read allowed only for images attached to public listings
- Owner can upload/delete images for their listings only

#### `conversations`
- Only participants can read a conversation
- Only participants can create a conversation
- Unique constraint: (listing_id, buyer_id) prevents duplicates (recommended)

#### `messages`
- Only participants can read messages
- Only participants can insert messages
- Updates/deletes restricted (ideally no edits in MVP)

#### `delivery_jobs`
- Job visible to:
  - buyer + seller tied to the listing
  - accepted driver (after accept)
- Only drivers can accept jobs
- Only involved parties can change status

#### `autopilot_settings`
- Only listing owner can read/write settings
- Never visible to buyers

#### `translations` (if stored)
- Only the requesting user can read their translated copy
- Never visible to the other participant unless explicitly desired

---

## 4) RLS Test Cases (Run these before shipping)
These are “must pass” checks.

### Listings
- [ ] User A cannot edit User B’s listing
- [ ] User A cannot delete User B’s listing images
- [ ] Public can read active listings (but not drafts/private)

### Chat
- [ ] Non-participant cannot read conversation rows
- [ ] Non-participant cannot read messages rows
- [ ] Participant can read/write messages
- [ ] Participant cannot write messages into a conversation they aren’t in

### Delivery Jobs
- [ ] Random user cannot view a job they aren’t involved in
- [ ] Random user cannot accept a job they shouldn’t see
- [ ] Only accepted driver can move job to “picked_up/completed”

### Autopilot
- [ ] Buyer cannot read seller autopilot rules
- [ ] Only owner can enable/disable Autopilot

---

## 5) Storage Policies (Images)
**Rules**
- Use a dedicated bucket for listing images
- Upload path convention:
  - `listings/<listing_id>/<uuid>.jpg`
- Public read only if the listing is public/active
- Owner can upload/delete only within their listing folder

**Checklist**
- [ ] Bucket policy does not allow arbitrary public uploads
- [ ] No “public read everything” unless intentional
- [ ] Delete permissions are owner-only

---

## 6) Secrets & Environment Variables
- Keep Supabase anon key in client (OK)
- Keep Supabase service role key server-only (never in app)
- Store keys in `.env` and add `.env` to `.gitignore`
- Rotate keys if leaked

---

## 7) Client Security Basics
- Validate inputs client-side for UX, server-side for security
- Rate limit sensitive edge functions (translation/autopilot) if exposed
- Prevent UI injection:
  - Render messages as plain text (no HTML)
- Do not log user content

---

## 8) Abuse Controls (MVP)
- Block + report are first-class
- Basic spam throttle:
  - limit new conversations per hour (phase 2 if needed)
- “Safety tips” surfaced in meetup/delivery flows

---

## 9) Security Release Checklist
Before shipping:
- [ ] RLS test cases pass (manual + scripts if available)
- [ ] Storage policies verified
- [ ] No service role keys in repo
- [ ] No PII in logs/analytics
- [ ] Report/block works end-to-end
