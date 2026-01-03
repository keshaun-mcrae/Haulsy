# Observability — Haulsy

Goal: ship fast without flying blind. This doc defines what we measure, how we log, and how we catch crashes early.

**Principles**
- Minimum overhead, maximum signal
- Privacy-first: no message content in logs/analytics
- Structured logs > random console spam
- All critical flows have events + error tracking

---

## 1) Crash Reporting

**Tooling (recommended)**
- Sentry (mobile): crash + performance + breadcrumbs

**What to capture**
- App version, build number, platform (iOS/Android), device model
- Screen name / route
- Network status (online/offline)
- Non-sensitive user id (internal uuid)
- Error stack + breadcrumb trail (navigation + key actions)

**What NOT to capture**
- Chat message text
- Phone numbers, addresses, emails (unless explicitly stored and masked)
- Full listing descriptions in error payloads

**Release process**
- Every release must upload source maps
- Tag crashes by version: `haulsy@<version>+<build>`
- Gate rollout if crash-free sessions drop below a threshold (set later)

---

## 2) Logging

### 2.1 Client Logging
Use structured logs with levels:
- `debug` (dev only)
- `info`
- `warn`
- `error`

**Log schema**
- `timestamp`
- `level`
- `screen`
- `event`
- `context` (object, no PII)

**Examples**
- `event: "listing_publish_started", context: { category, photo_count }`
- `event: "chat_realtime_connected", context: { conversation_id_hash }`

> Use hashes/ids, not raw text.

### 2.2 Server / Edge Function Logging
For Supabase functions:
- Log request id + function name + status + latency
- Never log message text or translated content
- Log language codes, not content (e.g., `en → pa`)

---

## 3) Analytics

Analytics exist to answer:
1) Are users able to buy/sell successfully?
2) Where are deals dying?
3) Is Autopilot improving response speed and conversion?
4) Is delivery reducing drop-off?

### 3.1 Event Naming
Use `snake_case`:
- `listing_created`
- `listing_published`
- `message_sent`
- `autopilot_enabled`
- `delivery_job_requested`

### 3.2 Required Events (MVP)
**Acquisition / Setup**
- `app_opened`
- `signed_up`
- `logged_in`

**Marketplace**
- `feed_viewed` { category, radius, query? }
- `listing_viewed` { listing_id, category }
- `listing_saved` { listing_id }
- `listing_created` { category }
- `listing_published` { category, photo_count }
- `listing_marked_sold` { listing_id }

**Chat**
- `inbox_viewed`
- `chat_opened` { conversation_id }
- `message_sent` { conversation_id }
- `message_failed` { reason_code }

**Autopilot**
- `autopilot_enabled` { listing_id }
- `autopilot_rule_updated` { rule_type }
- `autopilot_reply_sent` { conversation_id }
- `autopilot_escalated` { reason_code }
- `deal_pending_set` { listing_id }

**Delivery / Earn**
- `delivery_requested` { listing_id, size }
- `job_posted` { size }
- `job_accepted` { job_id }
- `job_completed` { job_id }

**Trust & Safety**
- `user_reported` { target_type }
- `user_blocked` { target_type }

### 3.3 KPIs (what we track)
**Marketplace**
- Listing publish success rate
- Listing → message conversion
- Time to first response (human vs Autopilot)
- % of chats that reach “pending”
- % of pending that reach “sold”

**Delivery**
- % of chats that request delivery
- Delivery request → job accepted rate
- Job completion rate

**Translation**
- Translate toggle on rate
- Translate usage per conversation (count, not content)

---

## 4) Performance Monitoring (Optional but recommended)
Track these spans:
- feed load time
- listing detail load time
- chat open time
- image upload time

Use Sentry performance or similar.

---

## 5) Privacy & Data Handling
- Never store or transmit chat message content to analytics
- If you need content-based metrics later, use on-device aggregation + opt-in
- Hash sensitive identifiers where possible (conversation ids in logs)

---

## 6) Debug Playbook
When something breaks:
1) Check Sentry for crashes (by version)
2) Check event drop-offs around the broken flow
3) Reproduce with the same route + network conditions
4) Verify Supabase RLS errors (common cause of “it loads but shows empty”)

---

## 7) Release Checklist (Observability)
Before shipping:
- [ ] Source maps uploaded
- [ ] Crash reporting verified in staging
- [ ] Key events firing (feed_viewed, listing_published, message_sent)
- [ ] No PII in logs/analytics
