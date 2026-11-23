# tripmeter: Product Requirements Document

Version 0.1 · Draft · Author: Deepak

## 1. Overview

**tripmeter** is a personal operating system for a motorcycle owner. It brings everything a rider has to track about one bike into one fast, offline-capable app: the delivery inspection, fuel and mileage, service history and due dates, running costs, accessories, and documents.

It starts as a tool built for one user (the author, who is buying a new bike). If it proves useful in daily life, it will be shared with friends and then opened to wider distribution if demand shows up.

### Problem

Bike owners keep this information scattered: fuel in memory or a notes app, service dates on a paper booklet, bills in photos, insurance renewals in SMS, accessory ideas in chats. The result is missed services, no idea of the real cost per km, forgotten renewals, and no evidence when a dealer dispute arises.

### Product vision

One place that answers, at a glance: *What does my bike cost me? What is due next? Is anything wrong?*

### Goals

1. Log a fuel fill-up in under 10 seconds.
2. Always show what service or document is due next, based on the real odometer.
3. Show true cost of ownership and cost per km.
4. Give a new owner a trustworthy PDI (pre-delivery inspection) checklist that anyone can open without signing up.
5. Keep all data usable offline and exportable.

### Non-goals (v1)

- No OBD or hardware integration.
- No SMS or bank parsing.
- No social feed, marketplace or ride-sharing features.
- No payments, insurance sales or loans.
- No native app. v1 is a PWA.

## 2. Users

| User | Description | What they need |
| --- | --- | --- |
| **Primary: the owner-builder** | A new-bike owner who is also the developer. Uses the app daily. | Quick logging, clear next-due view, honest cost numbers. |
| **Secondary: friends** | Fellow bike owners invited to try the app. Mixed technical comfort. | Zero-setup start, simple UI, their own private data. |
| **Tertiary: public visitors** | People searching for a PDI checklist before taking delivery. | A free checklist with no login, printable, shareable. |

## 3. User journey

### Stage 1: Before delivery (public, no account)

- **Trigger:** The rider is about to collect a new bike and searches for a PDI checklist, or is sent the link by a friend.
- **Action:** Opens the public PDI page, goes through each section at the showroom, ticks items and flags defects with notes.
- **Outcome:** Defects are raised with the dealer before signing. Flagged issues can be copied and sent to the dealer on WhatsApp, or the checklist printed to PDF.
- **Bridge into the app:** After completing the checklist, the page offers "Start your bike's logbook" and carries over the odometer, tyre pressures, oil level and flagged defects.

### Stage 2: Day zero (onboarding)

- Create the bike profile: nickname, make and model, variant, purchase date, price, odometer, chassis and registration numbers, insurance and PUC dates.
- The app pre-fills the service schedule from a model template, and the user can edit any interval.
- Result: the home screen is useful within two minutes, with no empty state.

### Stage 3: Daily and weekly use

- **Fill-up:** From a home-screen shortcut, enter litres, price per litre (or total amount) and odometer. Toggle "full tank". The app shows mileage for that tank immediately.
- **Expense:** Add a wash, parking, puncture or challan in two taps using category chips.
- **Glance:** The home screen shows the next service due, upcoming document expiries, rolling mileage and this month's spend.

### Stage 4: Service moments

- A reminder shows "First free service due in 200 km or 12 days".
- After the visit, the user logs the service: date, odometer, items done, cost (or free), workshop, and a photo of the bill.
- The service intervals reset from that entry automatically.

### Stage 5: Wishlist to purchase

- The user saves accessories they want (item, link, price estimate, priority).
- When bought, the item is marked bought with the actual price and the entry lands in the expense ledger. No double entry.

### Stage 6: Long-term ownership

- Monthly and yearly cost summaries, cost per km trend, and mileage trend (a drop signals something to check).
- Document renewals each year.
- If the user shares the app with friends, each friend gets a separate private space.
- When the bike is sold, the user can export the full service and cost history as a PDF, which is useful for resale.

## 4. Features and requirements

Priority key: **P0** = needed for the first usable version, **P1** = next, **P2** = later.

### 4.1 Bike profile

| ID | Requirement | Priority |
| --- | --- | --- |
| BP-1 | Create a bike with nickname, make, model, variant, purchase date, purchase price, starting odometer. | P0 |
| BP-2 | Store chassis number, engine number, registration number, insurer and policy number. | P0 |
| BP-3 | Support multiple bikes per user (data model only in v1; one-bike UI is fine). | P0 |
| BP-4 | Show a single "current odometer" derived from the highest odometer across all entries. | P0 |
| BP-5 | Model templates with default tank size, service schedule and tyre pressures. | P1 |
| BP-6 | Bike photo and a shareable bike card. | P2 |

### 4.2 Public PDI checklist

| ID | Requirement | Priority |
| --- | --- | --- |
| PDI-1 | Open to anyone via a public URL, with no login. | P0 |
| PDI-2 | Grouped sections: paperwork, body, engine and fluids, tyres, brakes and suspension, electricals, fuel and extras, handover. | P0 |
| PDI-3 | Each item can be ticked or flagged, with a free-text note on flagged items. | P0 |
| PDI-4 | Progress bar with checked and flagged counts. | P0 |
| PDI-5 | Progress is saved on the device and works offline. | P0 |
| PDI-6 | Print or save as PDF, and copy the flagged issues as text. | P0 |
| PDI-7 | Capture baseline readings: odometer, tyre pressures, oil level, chassis number. | P1 |
| PDI-8 | Import a completed PDI into the bike profile as the first logbook entry, including photos. | P1 |
| PDI-9 | Model-specific variants (chain or belt, ABS, tubeless, liquid-cooled). | P1 |
| PDI-10 | Hindi version. | P1 |
| PDI-11 | Indexable, fast-loading page for search discovery. | P1 |

### 4.3 Fuel log

| ID | Requirement | Priority |
| --- | --- | --- |
| FL-1 | Add a fill-up with date (default today), litres, price per litre or total cost, odometer, and a full-tank toggle. | P0 |
| FL-2 | Auto-calculate any one of litres, price or total from the other two. | P0 |
| FL-3 | Compute mileage (km/l) only between consecutive full-tank fills. Partial fills are accumulated into the next full fill. | P0 |
| FL-4 | Show last mileage, rolling average (last 5 full fills), and lifetime average. | P0 |
| FL-5 | Cost per km and fuel spend per month. | P0 |
| FL-6 | Validate odometer is not lower than the previous entry and warn on suspicious jumps. | P0 |
| FL-7 | Home-screen shortcut that opens the add-fuel form directly. | P0 |
| FL-8 | Edit and delete past entries, with recalculation. | P0 |
| FL-9 | Petrol pump or location tag. | P2 |
| FL-10 | Fuel price history chart. | P2 |

### 4.4 Service tracker

| ID | Requirement | Priority |
| --- | --- | --- |
| ST-1 | Define service items with an interval by km, by time, or both (whichever comes first): first free service, engine oil, oil filter, air filter, chain clean and lube, chain adjustment or replacement, brake pads, brake fluid, coolant, spark plug, tyres, battery. | P0 |
| ST-2 | Each item shows status: OK, due soon (within a configurable margin), or overdue, with the remaining km and days. | P0 |
| ST-3 | Log a service visit: date, odometer, items done, cost per item or total, workshop, notes, and bill photo. | P0 |
| ST-4 | Logging an item resets its next-due calculation. | P0 |
| ST-5 | Free-service countdown that respects both km and time limits from the warranty card. | P0 |
| ST-6 | Service history timeline, filterable by item. | P1 |
| ST-7 | Warranty and extended-warranty tracking with end date and km. | P1 |
| ST-8 | Customisable item list, so users can add their own items. | P1 |
| ST-9 | Workshop directory with notes and ratings (personal only). | P2 |

### 4.5 Expense ledger

| ID | Requirement | Priority |
| --- | --- | --- |
| EX-1 | One ledger for all costs. Fuel and service entries appear automatically. | P0 |
| EX-2 | Quick-add with category chips: fuel, service, accessories, insurance, challan, parking, wash, puncture, toll, other. | P0 |
| EX-3 | Monthly and yearly totals, category breakdown. | P0 |
| EX-4 | Total cost of ownership (purchase price plus all running costs) and rupees per km. | P0 |
| EX-5 | Optional attachments (receipt photo). | P1 |
| EX-6 | Budget per month with a simple over-budget indicator. | P2 |

### 4.6 Accessories wishlist

| ID | Requirement | Priority |
| --- | --- | --- |
| AW-1 | Add an item with name, estimated price, link, notes, priority, and status (wishlist, ordered, bought, installed). | P0 |
| AW-2 | Total estimated cost of the wishlist and cost by priority. | P0 |
| AW-3 | Marking an item as bought creates an expense entry with the actual price. | P0 |
| AW-4 | Image per item (uploaded or via link preview). | P1 |
| AW-5 | Compatibility notes and a "where to buy" list for comparison. | P2 |

### 4.7 Documents and reminders

| ID | Requirement | Priority |
| --- | --- | --- |
| DR-1 | Track expiry dates: insurance, PUC, driving licence, registration, and custom documents. | P0 |
| DR-2 | Status chips (valid, expiring soon, expired) on the home screen. | P0 |
| DR-3 | Local notifications before expiry (default 30, 7 and 1 day) and before service due. | P1 |
| DR-4 | Store a photo or PDF of each document in the app. | P1 |
| DR-5 | Renewal history. | P2 |

### 4.8 Home dashboard

| ID | Requirement | Priority |
| --- | --- | --- |
| HD-1 | "Next due" card: the nearest service or document by urgency. | P0 |
| HD-2 | Mileage card: last, rolling average and trend arrow. | P0 |
| HD-3 | This month's spend and cost per km. | P0 |
| HD-4 | Primary action buttons: Add fuel, Add expense. | P0 |
| HD-5 | Charts: mileage trend, monthly spend. | P1 |

### 4.9 Data, privacy and sharing

| ID | Requirement | Priority |
| --- | --- | --- |
| DP-1 | Works fully offline; data stored locally on the device. | P0 |
| DP-2 | Export all data as CSV or JSON. | P0 |
| DP-3 | Import from the same export format. | P1 |
| DP-4 | Optional account and cloud sync, added only when friends start using it. | P1 |
| DP-5 | Per-user data isolation. | P1 |
| DP-6 | Read-only share link for a bike's service history (useful at resale). | P2 |
| DP-7 | PDF service and cost report. | P2 |

## 5. Key calculations

- **Mileage (km/l)** = distance between two consecutive full-tank fills ÷ total litres added after the first of those fills up to and including the second. Partial fills in between are summed into the litres.
- **Cost per km** = total running cost ÷ distance travelled since the starting odometer. Report a version with purchase price included (ownership cost) and one without (running cost).
- **Service due (km)** = last-done odometer + interval − current odometer.
- **Service due (time)** = last-done date + interval − today. The status uses whichever is closer.
- **Current odometer** = the highest odometer reading across fuel, service and ride entries.

## 6. Data model (overview)

- **User**: id, name
- **Vehicle**: id, user, nickname, make, model, variant, purchase date, purchase price, start odometer, identifiers
- **FuelLog**: id, vehicle, date, litres, price per litre, total, odometer, full-tank flag
- **ServiceItem**: id, vehicle, name, interval km, interval days, last-done odometer, last-done date
- **ServiceVisit**: id, vehicle, date, odometer, workshop, total cost, notes, attachments, items done
- **Expense**: id, vehicle, date, category, amount, note, source (manual, fuel, service, wishlist)
- **WishlistItem**: id, vehicle, name, link, estimated price, priority, status, actual price
- **Document**: id, vehicle, type, number, expiry date, attachment
- **PDIRecord**: id, vehicle, item states, notes, baseline readings, completed date

Design rule: every entry that happens on the road carries an odometer value, because the odometer drives mileage, service reminders and ownership cost.

## 7. UX principles

1. **Speed over completeness.** Logging must be possible one-handed with the fewest fields, with smart defaults (today's date, last fuel price, last odometer).
2. **Show the answer, not the data.** The home screen shows what is due and what things cost, not tables.
3. **Forgiving input.** Everything can be edited later. Warn on odd values instead of blocking.
4. **Works anywhere.** Offline first, light on data, readable in sunlight (high contrast, large tap targets).
5. **Your data is yours.** Local by default, always exportable.

## 8. Technical approach

- **Client:** Next.js PWA, installable, with a service worker for offline use and a home-screen shortcut to quick-add.
- **Storage:** IndexedDB (through a small wrapper) for all user data in v1.
- **Public PDI page:** a static, indexable route (`/pdi`) that needs no storage beyond local progress.
- **Later, when sharing:** accounts, a hosted database and a sync layer, with per-user isolation. Add them only after real friend usage.
- **Notifications:** local reminders in v1; push after accounts exist.
- **Quality:** responsive from 360 px wide, keyboard accessible, supports light and dark themes.

## 9. Success metrics

**Phase 1: personal use (first 4 to 6 weeks)**

- Logged fuel at least weekly without being forced to.
- Median time to log a fill-up is under 10 seconds.
- No data entered twice for any purchase.
- The next service was triggered by the app, not by memory.

**Phase 2: friends (next 2 to 3 months)**

- At least 5 friends set up a bike profile.
- At least 3 are still logging after 30 days.
- Qualitative: what did they ask for that is missing?

**Public PDI page**

- Visits and completions (checklists with 50% or more ticked).
- Share rate (copy or print actions).
- Number of people who continue to the bike profile once that is available.

## 10. Roadmap

| Phase | Scope |
| --- | --- |
| **0: Now** | Public PDI checklist live. Bike chosen. Service schedule and tyre pressure defaults collected. |
| **1: MVP (about 1 to 2 weekends)** | Bike profile, fuel log with mileage, service tracker, expense ledger, wishlist, document expiry dates, home dashboard, CSV export. |
| **2: Daily-use polish** | Local reminders, PDI import into the bike profile, charts, attachments, Hindi PDI. |
| **3: Share with friends** | Accounts and sync, multiple bikes, model templates, JSON import, shareable service history. |
| **4: Only if demand appears** | Resale report, workshop directory, wider distribution, and anything friends repeatedly ask for. |

## 11. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| The author stops logging after a few weeks. | Keep logging under 10 seconds, use the home-screen shortcut, and review friction after week two. |
| Mileage numbers look wrong because users skip full-tank fills. | Make the full-tank toggle prominent and handle partial fills in the formula. |
| Wrong service intervals for a given model. | Treat templates as suggestions, make every interval editable, and always point to the owner's manual. |
| Local-only data is lost with the phone. | Provide export now and sync later. Remind users to export periodically. |
| Scope creep from a long ideas list. | Build only P0 until it has been used daily for two weeks. |
| Public PDI content is treated as definitive. | Label it a general guide and defer to the manual and the dealer's own sheet. |

## 12. Open questions

1. Which bike and variant? This sets the default service schedule, tank size, tyre pressure and chain or belt specifics.
2. Should the PDI and logbook live in one app from day one, or ship the PDI separately first?
3. Which interface languages are needed at launch (English only, or Hindi too)?
4. What is the sharing plan: invite link, install link, or self-hosted for friends?
5. Will the app stay free, or is there any future monetisation worth considering? Nothing is planned for v1.
