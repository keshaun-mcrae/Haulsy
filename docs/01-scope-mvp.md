# MVP Scope — Haulsy

**Wedge:** bulky local items where **speed + logistics** decide the sale (Lower Mainland / Metro Vancouver).

---

## IN (MVP)
### Core Marketplace
- Auth + profiles
- Browse feed (grid) + search + basic filters
- Location-first UX (city/radius)
- Listing detail + image gallery
- Sell wizard (3 steps: Photos → Details → Publish)
- Save listings
- Inbox list + chat thread (realtime)
- Mark sold / archive
- Report + block

### AI Seller Autopilot (v0)
- Autopilot **auto-reply** for new inquiries (fast response)
- Buyer qualification prompts (availability, budget, pickup vs delivery)
- Scheduling chips (propose time windows)
- **Guardrails:** seller-defined rules (min price / pickup windows / delivery allowed)
- Optional seller confirmation before marking “pending”

### Delivery / Earn (v0-lite)
- Buyer can request delivery from listing/chat
- Delivery job record + statuses: requested → accepted → completed
- Earn Mode basic: list nearby jobs + accept/complete flow
- No payments in MVP (placeholder payout tracking only)

---

## OUT (Not MVP)
- Payments/escrow
- Ratings/reviews
- Full disputes / chargebacks
- Full delivery marketplace (routing, batching, insurance, etc.)
- Advanced pricing engine (beyond basic suggestions)
- Automated scam detection + buyer intent scoring (phase 2)
- AR fit-check (ships later)

---

## MVP Definition of Done
- A user can sign up, create a listing with photos, and see it in the feed
- A buyer can message a seller and chat in realtime (RLS verified: participants only)
- Autopilot can respond instantly and move chats toward a pickup/delivery plan
- A buyer can request delivery and a driver can accept/complete the job (v0-lite)
- Seller can mark sold, and users can block/report
