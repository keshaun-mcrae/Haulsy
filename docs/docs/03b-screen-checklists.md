# Screen Checklists — Haulsy

Use this to build fast and consistently. Every screen must ship with:
✅ loading ✅ empty ✅ error ✅ retry ✅ basic analytics events

---

## Browse (Feed)
**Must-have UI**
- TopBar: location pill + search + filter
- CategoryChips
- ListingGrid (2 columns)
- Pull to refresh
- Infinite scroll pagination

**States**
- Loading skeleton grid
- Empty: “No results” + Clear filters
- Error: Retry

**Events**
- feed_viewed { category, radius, query? }
- listing_viewed { listing_id }

---

## Filters (Bottom Sheet)
**Must-have UI**
- Price range
- Category-specific fields
- Apply (primary), Clear (secondary)

**Events**
- filters_applied
- filters_cleared

---

## Listing Detail
**Must-have UI**
- Image carousel
- Price + title + city
- Key specs (dimensions / car fields)
- Seller card
- Description

**StickyActionBar**
- Message (primary)
- Request delivery (secondary)

**States**
- Loading skeleton
- Error: Retry

**Events**
- listing_viewed
- message_started
- delivery_requested_started

---

## Sell Wizard
### Step 1: Photos
- Add / reorder / remove
- Upload progress + retry

### Step 2: Details
- Category
- Title, price
- Location (city default)
- Category-specific fields:
  - Furniture/appliances: dimensions optional (for AR later)
  - Cars: make/model/year/mileage

### Step 3: Publish
- Preview card
- Publish (primary)

**States**
- Validation errors
- Upload failures + retry

**Events**
- sell_started
- listing_photo_added { count }
- listing_published { listing_id, category }

---

## Inbox (Conversations List)
**Must-have UI**
- Sorted by last message
- Listing context snippet (title/price)
- Unread indicator

**States**
- Empty: “No messages yet”
- Error: Retry

**Events**
- inbox_viewed
- chat_opened { conversation_id }

---

## Chat Thread
**Header**
- Listing mini context (title/price)
- Translate toggle 🌐
- Language pill when ON
- Autopilot indicator (seller view)

**Body**
- Messages list + pagination (load older)
- Day separators optional

**Composer**
- Input + send
- Quick chips (offer / propose time / delivery)

**Behaviors**
- Disable send while offline
- Show sending state + retry on failure
- “View original” for translated messages

**Events**
- message_sent { conversation_id }
- translate_toggled { enabled, target_lang }

---

## Earn (Jobs Feed)
**Must-have UI**
- Jobs list
- Job card: pickup→dropoff, size, payout estimate, urgency
- Accept flow

**States**
- Empty: “No jobs nearby”
- Error: Retry

**Events**
- earn_viewed
- job_opened
- job_accepted
- job_completed

---

## Job Detail (Driver)
**Must-have UI**
- Pickup instructions (seller contact)
- Dropoff instructions (buyer contact)
- Status buttons: Start pickup → Complete dropoff

**States**
- Confirmations for status changes
- Error: Retry

**Events**
- job_started_pickup
- job_completed_dropoff

---

## Profile / Settings
**Must-have UI**
- Basic profile (name, photo optional)
- Language preference
- Autopilot defaults (optional in v0)

**Events**
- profile_viewed
- settings_updated
