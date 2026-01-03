# Haulsy — Skill Plan

Mobile-first marketplace for Surrey, BC (Furniture / Electronics / Appliances + Cars) with clean UI, chat translation toggle, and future AR “Will it fit?”.

---

## Step 1: Concrete Examples

**User triggers:**
- “I want to sell my couch”
- “Find a used TV near me”
- “Show me appliances in Surrey”
- “Is this still available?”
- “Can you translate this chat?”
- “Will this fit in my room?”

**Core workflows**
1. Buyer opens app → browses categories (Furniture/Electronics/Appliances/Cars)
2. Buyer opens listing → taps **Message** → quick chips (availability, offer, pickup time)
3. Seller replies in chat (optional **Translate 🌐 toggle** inside chat header)
4. Buyer proposes meetup/pickup time → seller confirms
5. Seller marks item **Sold** / archives listing
6. (Later) Buyer uses **AR Fit Check** (v0 dimensions → v1 AR bounding box)

---

## Step 2: Reusable Skill Contents

| Type | File/Folder | Purpose |
|------|-------------|---------|
| **assets/** | `assets/preview.png` | Screenshots / UI references |
| **references/** | `references/trust-safety.md` | Scam patterns, safety copy, meetup tips |
| **docs/** | `docs/*` | Product specs (flows, UI system, data model, translation, AR) |
| **product/** | `product/backlog.md` | Master checklist + milestones |
| **supabase/** | `supabase/schema.sql` | DB schema (listings, chat, translations) |
| **supabase/** | `supabase/policies.sql` | RLS rules |
| **supabase/functions/** | `translate-message.md` | Translation function spec |
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
s