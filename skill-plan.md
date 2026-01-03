# Haulsy — Skill Plan

Mobile-first marketplace for the **Lower Mainland (Metro Vancouver)** — Vancouver, Surrey, Langley, Delta, Burnaby, Richmond + nearby — focused on **Furniture / Electronics / Appliances + Cars** with clean UI, built-in delivery gigs, chat translation toggle, and **AI Seller Autopilot**.

**Wedge:** bulky local items where **speed + logistics** decide the sale.

---

## Step 1: Concrete Examples

**User triggers:**
- “I want to sell my couch”
- “Find a used TV near me”
- “Show me appliances near me”
- “Is this still available?”
- “Request delivery”
- “Earn money delivering items”
- “Turn on Autopilot for this listing”
- “Can you translate this chat?”
- “Will this fit in my room?” (later)

**Core workflows**
1. Seller posts listing (photos → AI draft title/category/price → publish)
2. Buyers browse/search by location + category
3. Buyers message seller → quick chips (availability, offer, pickup time, delivery)
4. **AI Seller Autopilot** replies instantly, qualifies buyers, and negotiates within seller rules
5. Pickup or delivery is scheduled → item marked **Pending**
6. Handoff happens → seller marks **Sold** (buyer confirms)
7. (Later) **AR Fit Check** for furniture (v0 dimensions → v1 AR bounding box)

**Autopilot guardrails (v1)**
- Seller sets rules: min price / firm price, pickup windows, delivery allowed, auto-pending behavior
- Autopilot can require seller approval before final price/time or before marking “pending/sold”

---

## Step 2: Reusable Skill Contents

| Type | File/Folder | Purpose |
|------|-------------|---------|
| **assets/** | `assets/preview.png` | UI screenshots / references |
| **references/** | `references/trust-safety.md` | Scam patterns + safety copy |
| **docs/** | `docs/*` | PRD, UX flows, architecture, analytics |
| **product/** | `product/backlog.md` | Master checklist + milestones |
| **supabase/** | `supabase/schema.sql` | DB schema (listings, chat, delivery jobs, settings) |
| **supabase/** | `supabase/policies.sql` | RLS rules |
| **supabase/** | `supabase/storage-policies.sql` | Storage policies for listing images |
| **supabase/functions/** | `translate-message.md` | Translation function spec |
| **supabase/functions/** | `autopilot-reply.md` | Autopilot reply/negotiation spec |
| **app/mobile/** | (later) | Expo app |

---

## Step 3: Repo Structure

```txt
Haulsy/
├── skill-plan.md
├── GETTING_STARTED.md
├── README.md
├── assets/
│   └── preview.png
├── references/
│   └── trust-safety.md
├── docs/
├── product/
├── supabase/
└── app/
    └── mobile/
