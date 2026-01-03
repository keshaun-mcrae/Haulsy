# Haulsy
A mobile-first marketplace for the **Lower Mainland (Metro Vancouver)** — Vancouver, Surrey, Langley, Delta, Burnaby, Richmond + nearby — focused on **Furniture / Electronics / Appliances + Cars** with clean UI, built-in chat, optional live translation, built-in delivery gigs, and **smart AI that removes marketplace friction**.

**Wedge:** bulky local items where **speed + logistics** decide the sale (couches, appliances, TVs, cars).

---

## How it works (Buy / Sell / Deliver)

### Buy
1) Browse items near you (Lower Mainland)  
2) Open listing → **Message** with quick chips (availability / offer / pickup time)  
3) Optional: toggle 🌐 **Translate** inside the chat  
4) Meet up **or** request delivery  

### Sell
1) Snap photos → AI drafts the listing (title, category, price suggestion)  
2) Publish in minutes  
3) Chat + schedule pickup (chips + quick actions)  
4) If buyer needs it: create a delivery request in one tap  
5) Mark sold when handoff is done  

### Earn (Drivers / Helpers)
1) Turn on **Earn Mode**  
2) See delivery requests near you (small items → sedans, big items → SUVs/trucks)  
3) Accept → pickup → drop-off  
4) Get paid per delivery (tips + add-ons like stairs/assembly/junk removal in later phases)  

---

## What is this?
This repo is the plan + foundation for **Haulsy** — a marketplace that feels familiar (FB Marketplace) but much cleaner (Apple), with subtle Uber-style UX patterns (chips, sheets, sticky bars) and AI features that make deals close faster.

Think of it like:  
**Facebook Marketplace + Uber-style delivery requests + AI helper where it actually matters.**

---

## Why use Haulsy over Facebook Marketplace?
Because Marketplace isn’t missing “features.” It’s missing **flow**.

| Facebook Marketplace | Haulsy |
|---|---|
| Posting is manual + annoying | Photo → AI listing draft + price suggestion |
| Messaging is chaotic | Quick actions + scheduling chips that push the chat forward |
| “Is this available?” spam | Intent-aware prompts (offer, time, delivery) |
| Language friction | 🌐 Translation toggle inside chat (optional) |
| Deals die from pickup logistics | Built-in delivery requests + Earn Mode |
| Hard to trust strangers | Safety-first: report/block (scam signals later) |

The goal isn’t “more AI.”  
It’s **less friction** from listing → chat → meetup/delivery → done.

---

## The smart AI features (why it feels 10x better)

### AI Seller Autopilot (the “never miss a sale” feature)
One of the biggest problems with Facebook Marketplace is response speed: you list something, get flooded with messages, then life gets busy — and by the time you reply, the serious buyers have moved on.

Haulsy fixes that with an **AI seller assistant** that can:
- Instantly respond to every buyer inquiry  
- Answer common questions (availability, condition, dimensions, delivery options)  
- Qualify buyers (who’s serious vs. wasting time)  
- Negotiate within rules you set (firm price / minimum price / bundles)  
- Propose pickup or delivery times and confirm the plan  
- Mark an item as “pending” once a buyer commits  

**Guardrails (important):** Autopilot operates within seller-defined rules (min price, availability windows, delivery options).  
In early versions, final confirmation can be required before locking “pending/sold.”

Then it only pings you when it matters, like:  
**“Fridge sold for $320. Pickup Saturday 2–4pm.”**

### Everything else supports Autopilot
- **Photo → Listing Draft**: title, category, and description suggestions so you publish fast  
- **Smart Pricing**: suggested price range based on similar items + local demand signals (phase 2)  
- **Deal-Closing Chat UI**: quick action chips that push chats forward (offer / time / delivery)  
- **Translation Toggle 🌐**: on-demand translation inside chat with “View original”  
- **Scam Signals (phase 2)**: warnings for suspicious patterns (off-app payments, rushed pickups, too-cheap pricing)  
- **Delivery Match (Earn Mode)**: if a buyer can’t pick up, Haulsy can route the job to a driver/helper  

---

## Roadmap (ship order)
- **M1:** UI MVP (mock data)  
- **M2:** Listings + photos + auth  
- **M3:** Realtime chat + Autopilot auto-reply  
- **M4:** Earn Mode (delivery requests)  
- **M5:** Translation toggle + “View original”  
- **M6:** Pricing assist + scam signals  

---

## Quick Start
**Requirements:** Git + Node 18+ (Expo), Supabase account (later)

### 1) Clone this repo
```bash
git clone https://github.com/keshaun-mcrae/Haulsy.git
cd Haulsy

