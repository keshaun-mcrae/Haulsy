# UI System
# UI System — Haulsy

**Vibe:** Facebook Marketplace familiarity + Apple clean minimal + subtle Uber patterns (chips / sheets / sticky action bars).

**Goal:** zero clutter, fast scanning, and “deal-closing” UI (messages turn into pickup/delivery plans).

---

## Design Tokens (lock these)
### Colors (high level)
- Background: white / near-white
- Text: near-black
- Borders: light gray
- One accent color for primary actions (keep it consistent across app)

### Typography
- 1 font family
- 2 weights max: Regular / Semibold
- Type scale (recommended):
  - Title: 20–24
  - Section header: 16–18
  - Body: 14–16
  - Caption/meta: 12–13

### Spacing
- Screen padding: 16
- Card padding: 12–16
- Gap between cards: 12
- Vertical rhythm: 8pt grid (8/16/24)

### Radius & Elevation
- Radius: 12–16 (default 14)
- Shadows: minimal (prefer borders)
- Bottom sheets: soft shadow only at top edge

### Buttons
- Primary: filled
- Secondary: outline
- Tertiary: text-only
- Max **2 primary actions per screen**

---

## Global UI Rules
- White/near-white background everywhere (no heavy gradients)
- Every list supports: **loading → empty → error → loaded**
- Avoid icon-only actions (unless extremely obvious)
- Forms: always show helper text when needed (dimensions, car fields)
- Keep copy short (chips should be 1–3 words)
- Always show **price + location + time** in list items where relevant

---

## Navigation
**Tabs:** Browse / Sell / Inbox / Earn / Profile

- Browse: discovery + filters
- Sell: create/edit listing
- Inbox: conversations
- Earn: delivery jobs
- Profile: settings + autopilot defaults

---

## Core Components (must exist)

### 1) TopBar
**Contains:**
- Location pill (city + radius)
- Search
- Filter icon (opens bottom sheet)

**Behavior:**
- Search is always visible on Browse
- Location pill is tappable → city/radius picker sheet

---

### 2) CategoryChips
Horizontal chips: Furniture / Electronics / Appliances / Cars

**Rules:**
- One selected at a time (default = All)
- Chips are scrollable, not wrapped

---

### 3) ListingCard + ListingGrid
**Grid:** 2-column (like Marketplace)

**Card includes:**
- Photo (1st image)
- Price (bold)
- Title (1 line)
- Location (city)
- Posted time (e.g., “2h ago”)

**Optional badges (small):**
- “Delivery available”
- “Firm”
- “Pending/Sold” (only for seller view)

---

### 4) FilterSheet (Bottom Sheet)
**Fields:**
- Price range
- Condition (optional)
- Category-specific filters:
  - Cars: make/model/year/mileage
  - Furniture: dimensions available (toggle)

**Rule:**
- One “Apply” primary action
- “Clear” as secondary

---

### 5) Listing Detail Layout
**Sections:**
- Image carousel
- Price + title + location
- Seller mini card
- Description
- Key specs (dimensions for furniture, car specs for cars)

**StickyActionBar (bottom):**
- Primary: Message
- Secondary: Request delivery (or “Delivery available”)
- If seller: Edit / Mark sold

---

### 6) Chat Thread
**Chat Header includes:**
- Listing mini context (title + price)
- 🌐 Translate toggle
- Language pill when Translate is ON
- “Autopilot” indicator when enabled (seller view)

**Message features:**
- Quick chips above input: Offer / Pickup time / Delivery / Still available?
- “View original” appears on translated messages
- Message bubble spacing is tight, readable

---

### 7) Earn Mode UI (Delivery Jobs)
**Job Card includes:**
- Pickup area → Dropoff area
- Item size badge (Small/Medium/Large)
- Payout estimate (placeholder until payments)
- Time urgency (ASAP / scheduled)

**Primary actions:**
- Accept (if available)
- Start pickup / Complete dropoff (state-based)

---

## Autopilot UI (Seller)
**Where it shows:**
- On listing creation/edit: “Autopilot: Off/On”
- In chat: “Autopilot handling replies” badge (seller view)

**Seller rule controls (v0):**
- Minimum price / firm
- Pickup windows
- Delivery allowed (yes/no)
- Require approval before “Pending”

---

## Required States (don’t skip)
Every major screen must include:
- Loading skeleton
- Empty state copy + CTA
- Error state with retry
- Disabled states (buttons, chips)

---

## Microcopy Guidelines
- Keep labels short: “Message”, “Offer”, “Pickup”, “Delivery”
- Avoid paragraphs in UI
- Make the next step obvious: “Propose a time” > “Send message”
