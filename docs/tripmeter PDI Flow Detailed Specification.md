# tripmeter PDI Flow: Detailed Specification

Version 0.1 · Draft · Author: Deepak

This document describes the public pre-delivery inspection (PDI) experience end to end: who uses it, every screen and state from landing to a finished inspection, how items behave, what is saved, what happens on errors and interruptions, and how it connects to the tripmeter logbook.

## 1. Purpose and scope

**What a PDI is.** A pre-delivery inspection is the check done on a new vehicle before it is handed over to the buyer. Dealers do their own PDI, but buyers rarely verify it. This tool lets a buyer run an independent check at the showroom and keep evidence.

**What the PDI page must achieve**

1. Help a buyer catch defects, paperwork mismatches and missing items before signing the delivery note.
2. Produce evidence (notes, photos, a summary) the buyer can send to the dealer.
3. Work for someone standing in a showroom, on a phone, with patchy signal and frequent interruptions.
4. Be free and need no account, so it can be found and shared easily.
5. Hand the starting readings of the bike to the tripmeter logbook, optionally.

**In scope (v1):** the public checklist flow, local saving, summary, copy and print outputs, and the optional handoff to tripmeter.

**Out of scope (v1):** accounts, cloud sync, dealer-side tools, automated defect detection, legal advice, and model-specific official specifications.

**Disclaimer principle.** The checklist is a general guide. It does not replace the owner's manual or the dealer's own PDI sheet, and it must say so in plain words.

## 2. Users and contexts of arrival

| Context | Who | Where | Needs |
| --- | --- | --- | --- |
| **At the showroom** | Buyer about to take delivery | Standing next to the bike, phone in one hand | Speed, big targets, no reading walls, saves automatically |
| **Preparing at home** | Buyer a few days before delivery | Sofa, with time | Understand what will be checked and why, know what to bring |
| **Helping a friend** | Friend or relative joining the buyer | Showroom or home | Same as above, plus sharing results |
| **Post-delivery doubt** | Owner who already has the bike | Garage or home | Run the check late, flag things for the dealer |

The flow is designed for the showroom case first. The other contexts get optional explanation layers that the showroom user can ignore.

## 3. Design principles

1. **Walk-around order.** Items follow where the person physically stands, not how the machine is organised.
2. **Three honest states.** Each item can be OK, Issue or N/A. A tick only says "I looked". Flagging an issue is the real purpose and has equal weight.
3. **Never pre-tick.** Every item starts unchecked. Nothing in a safety checklist is assumed.
4. **One tap to record, one tap to undo.** No confirmation dialogs for normal ticking.
5. **Capture without leaving the spot.** Notes and photos open inline, in the row.
6. **Save everything instantly.** Interruptions are normal.
7. **Overview and focus together.** One scrolling list, with only the current zone open.
8. **Show gaps, not just results.** The summary highlights what was never checked.
9. **Persuasion last.** Any mention of tripmeter comes after the user has finished and received value.

## 4. Flow overview

```
Landing → Bike setup (optional) → Prepare → Paperwork → Walk-around zones → Test ride → Summary → Outputs → After (tripmeter handoff)
```

The user can jump between stages at any time. Only the summary is reached from anywhere via a persistent button.

| # | Stage | Purpose | Typical time |
| --- | --- | --- | --- |
| 1 | Landing | Explain, build trust, start | 5 to 15 s |
| 2 | Bike setup | Tailor the list | 10 to 20 s |
| 3 | Prepare | Tell what to bring and how to behave | 20 to 40 s |
| 4 | Paperwork | Verify identity and documents | 3 to 6 min |
| 5 | Walk-around | Physical inspection by zone | 12 to 20 min |
| 6 | Test ride | Dynamic checks | 3 to 5 min |
| 7 | Summary | Review issues and gaps | 1 to 2 min |
| 8 | Outputs | Send, print or save | 1 min |
| 9 | After | Keep the starting readings | optional |

## 5. Stage-by-stage specification

### 5.1 Landing

**Goal:** In five seconds, the visitor knows what this is, that it is free, that it needs no account, and how long it takes.

**Content**

- Headline: a plain promise (for example, "Check your new bike before you sign for it").
- Sub-line: free, no login, works offline once loaded, about 25 minutes.
- Primary button: **Start checklist**.
- Secondary link: **What is a PDI?** (opens a short explainer below the fold or on a separate section).
- A line of reassurance: "Your notes stay on this device."

**Behaviour**

- If a saved inspection exists on this device, replace the primary button with **Continue where you left off** (showing the percentage done) and offer **Start a new one** as a secondary action.
- Do not show sign-up prompts, banners over the button, or a long explainer before the button.

**Edge cases**

- Visitor on desktop: the layout still works, but a small note suggests opening it on a phone at the showroom, with a way to copy the link.
- No JavaScript or failed load: show a plain text version of the checklist so the content is still usable.
- Slow connection: the first screen should render before fonts and images arrive.

**Exit:** Start or Continue.

### 5.2 Bike setup (optional)

**Goal:** Remove items that do not apply, so the list feels relevant.

**Questions (all skippable, one screen):**

| Question | Options | Effect |
| --- | --- | --- |
| Drive | Chain / Belt / Shaft | Shows chain items or belt or shaft items |
| Brakes | ABS / CBS / Neither | Adds or removes ABS warning light checks |
| Tyres | Tubeless / Tube-type | Changes tyre and puncture items |
| Cooling | Air / Oil / Liquid | Adds or removes the coolant check |
| Start | Electric only / Electric and kick | Adds or removes kick-start check |
| Fuel system | Carburettor / Fuel injection | Changes idle and cold start notes |

**Also asked later, not here:** bike model, chassis number, odometer reading. They need the bike in front of the person and are captured inside the flow.

**Behaviour**

- A **Skip, show everything** button is as prominent as **Continue**.
- Choices can be changed later from the menu. Changing them re-filters the list without losing answered items.
- If an item was answered and then hidden by a new choice, keep its answer in storage but exclude it from counts.

**Exit:** Continue or Skip.

### 5.3 Prepare

**Goal:** Set up the person to do this well, once, then get out of the way.

**Content (a single card, dismissible)**

- **Bring or have ready:** invoice or booking receipt, insurance copy, both keys, a charged phone, and a torch (optional).
- **Ask for:** daylight if possible, the bike on its stand, and a few unhurried minutes.
- **Mindset line:** "A PDI is normal. Dealers expect it. Take your time."
- **How to use the checklist:** a one-line demonstration of the three states (OK, Issue, N/A) and what an Issue row does.

**Behaviour**

- Shown once per inspection. A "Don't show again" option is stored locally.
- A **Skip** is always visible. Showroom users in a hurry must not be blocked.

**Exit:** Begin the check, which opens the first zone.

### 5.4 Paperwork zone

**Goal:** Verify that the bike and the documents agree. Paperwork errors are costly and hard to fix after delivery.

**Why it comes first:** it can be done seated, it is calm, and discrepancies found here save the user from physical checks on the wrong bike.

**Items (examples; full list in section 6)**

- Chassis number on the bike matches the invoice and insurance.
- Engine number matches the papers.
- Insurance policy is active with the right start date and cover.
- Temporary registration or receipt, with the expected date for the permanent RC.
- Owner's manual, service book and warranty card, with dealer stamp.
- Two keys, and any key tag or security code card.
- Itemised final bill with no unexplained charges.

**Special item types**

- **Number-entry rows:** chassis number and engine number open a short text field so the user can type what is on the bike and compare it visually with the papers. The app does not verify the number; it stores it for the logbook.
- **Photo prompt:** a suggested photo of each document and the chassis plate.

**Behaviour**

- Items follow the standard three-state control.
- If the chassis number differs from the documents, the Issue state is the expected path, and the row expands with a note field plus a hint: "Do not accept delivery until this is resolved in writing."

**Exit:** Collapse automatically when all items are answered, with a count (for example, "7 of 7"), and the next zone opens.

### 5.5 Walk-around zones

**Goal:** Inspect the bike physically, in an order that matches movement around it.

**Zone order**

1. Front
2. Left side
3. Engine and fluids
4. Rear
5. Right side
6. Controls and cockpit
7. Fuel and extras

(Test ride and Handover are separate stages.)

**Zone header content**

- Zone name, answered count and total, and an issue count if any.
- State: collapsed, open or complete.

**Zone behaviour**

- Only one zone is open at a time by default. Tapping a collapsed zone opens it and closes the previous one. A user can pin a zone open from the menu if they prefer.
- A zone is **complete** when every visible item has a state (OK, Issue or N/A).
- When a zone completes, it collapses with a short transition, and the next incomplete zone opens. The user can still re-open any zone.

**Navigation**

- A sticky bottom bar has **Next unchecked** (primary) and **Summary** (secondary).
- **Next unchecked** scrolls to the next item without an answer, opening its zone if needed, in the walk-around order.
- The progress bar at the top shows answered items versus total, with a red segment for issues.

**Item row anatomy**

1. Label, one clear sentence.
2. Optional hint line (how to check), shown in small text under the label.
3. A three-state segmented control: OK, Issue, N/A.
4. If the item needs a value (tyre pressure, odometer, oil level), a small numeric or text field appears when the user taps OK or Issue.

**Hint behaviour**

- Hints are collapsed by default after the first zone, to keep the list short for experienced users. A "Show how to check" toggle in the menu expands all hints.
- Every hint is plain language and says what "good" looks like.

### 5.6 Recording an issue

This is the most important interaction. It must be quick and never take the user out of context.

**Trigger:** the user taps **Issue** on a row.

**Result:** the row expands in place with

1. **Note field** with a prompt ("What is wrong?"), multi-line, optional.
2. **Photo** button that opens the camera or gallery, with up to 3 photos per item. Thumbnails appear in the row.
3. **Severity** (optional chips): *Cosmetic*, *Fix before delivery*, *Get it in writing*. Defaults to none.
4. **Hint line** on what to ask the dealer for (for example, "Ask for the part to be replaced and a note on the delivery receipt").

**Rules**

- The state is saved the instant Issue is tapped, even if no note is written.
- Changing from Issue to OK keeps the note and photos in storage until the user explicitly removes them, in case it was a mis-tap. The row collapses, and an "Undo" link remains visible for 8 seconds.
- Photos are stored on the device and never uploaded in v1.
- If photo storage fails (permission denied or quota full), show a calm message and let the note stand alone.

### 5.7 Interruptions and resume

Interruptions are the norm in a showroom.

| Event | Required behaviour |
| --- | --- |
| Phone locks or app switches | All answers are already saved; on return, restore scroll position and the open zone |
| Browser tab closed | Reopening the page shows Continue where you left off |
| Signal drops | Nothing breaks; all features work offline after first load |
| User leaves for hours or days | The inspection remains until the user clears it; an age label shows ("Started 2 days ago") |
| Two inspections needed (for example, two bikes) | A **Start new** option archives the current one into a local list with a name and date |

### 5.8 Test ride

**Goal:** Check what a stationary inspection cannot: dynamic behaviour.

**Why separate:** a user should not feel the check is finished before riding.

**Items (examples)**

- Pulls to one side at low speed.
- Unusual vibration at steady speed.
- Clutch engages smoothly and gear changes are clean.
- Brakes work evenly and without noise.
- Idle is steady after the engine warms up.
- No warning lights appear on the cluster.
- Side-stand cut-off works (if fitted).

**Behaviour**

- Preceded by a short safety line: wear a helmet, ride only a short distance in a safe area, and follow the dealer's rules for test rides.
- If the dealer does not allow a test ride, the user can mark the whole zone as N/A with one action.
- Items use the same three states and the same inline issue flow.

### 5.9 Summary

**Goal:** Turn answers into a decision: "Am I ready to sign?"

**Reachable from:** the persistent Summary button at any time, and automatically offered when all zones are complete.

**Layout (top to bottom)**

1. **Headline status**, computed, not editable:
   - *Not finished* if any visible item has no state.
   - *Issues to resolve* if any issue exists.
   - *All clear* only if every item is OK or N/A and no issues.
2. **Issues** list, grouped by severity, each with note and photo thumbnails.
3. **Unchecked items** list, each with a link that jumps to the row.
4. **Skipped (N/A)** list, collapsed by default, so the user can sanity-check what was skipped.
5. **Baseline readings** captured during the flow: chassis number, engine number, odometer, tyre pressures, oil level, and date and place of inspection if the user entered them.
6. **Guidance line** tailored to the status. For example, with must-fix issues: "Do not accept delivery until these are fixed, or written on the delivery note and signed by the dealer."

**Rules**

- "All clear" never appears while unchecked items exist.
- Counting excludes items hidden by bike setup.
- The summary is recomputed live; editing an item from the summary updates it immediately.

### 5.10 Outputs

| Output | Content | Notes |
| --- | --- | --- |
| **Copy issues for dealer** | Plain text list: date, bike, each issue with note and severity | Formatted to paste into WhatsApp or email; no photos |
| **Save as PDF / Print** | Full report: summary, all zones with states and notes, photos | Uses the browser's print dialog with print-friendly styling |
| **Share link** (later) | Read-only view of the report | Needs accounts or hosting; not in v1 |
| **Download data** | JSON of the inspection | For import into the tripmeter logbook |

**Copy text template (example structure)**

```
PDI issues found on [date]
Bike: [model] · Chassis: [number]
1. [Item]: [note] ([severity])
2. ...
Please confirm these will be resolved before delivery.
```

The template stays neutral in tone; users can edit it before sending.

### 5.11 After: the tripmeter handoff

**Goal:** Offer a useful next step without gating the PDI result.

**Content**

- Confirmation that the inspection is saved on this device.
- A short note on what to do about unresolved issues.
- An optional card: **Start your bike's logbook**. It explains that the app will keep the odometer, tyre pressures, oil level, chassis number and flagged issues as the bike's starting record, and will track fuel, service dates and costs.

**Behaviour**

- Entirely optional; a **No thanks** is equally visible.
- If accepted in v1 (before the app exists), offer a way to download the data and a note that the app is coming; do not collect an email unless the user chooses to.
- When the app exists: import the inspection as the first logbook entry, with photos, and mark flagged issues as warranty-related items to follow up.

## 6. Checklist content

Each item has: a label, a hint, a type (check, number-entry, photo-suggested), an applicability rule, and a default severity if flagged.

### 6.1 Paperwork

| Item | Type | Notes |
| --- | --- | --- |
| Chassis number matches invoice and insurance | Number entry | Type what is on the bike |
| Engine number matches papers | Number entry |  |
| Insurance active, start date and cover correct | Check |  |
| Registration or temporary receipt in hand | Check | Ask when the permanent RC arrives |
| Owner's manual, service book, warranty card with dealer stamp | Check |  |
| Two keys and any key tag or code card | Check | Test both keys |
| Itemised final bill, no unexplained charges | Check | Accessories listed separately |

### 6.2 Front

| Item | Type | Applies to |
| --- | --- | --- |
| Headlight low and high beam | Check | All |
| Front indicators work | Check | All |
| Front tyre pressure matches manual | Number entry | All |
| Front tyre age (manufacture week and year) | Number entry | All |
| No cuts, bulges or flat spots on front tyre | Check | All |
| Front brake lever feels firm and returns | Check | All |
| Front brake fluid level and colour | Check | Disc brake |
| Fork has no oil on the stanchions | Check | All |
| Front wheel spins freely and runs true | Check | All |

### 6.3 Left side

| Item | Type | Applies to |
| --- | --- | --- |
| Paint and panels free of scratches and dents | Photo suggested | All |
| Panel gaps even, no loose plastics | Check | All |
| Mirror, footpeg and grab rail tight | Check | All |
| Side stand and its cut-off switch work | Check | All |
| Battery terminals tight, no corrosion | Check | Where accessible |
| Chain tension and lube | Check | Chain drive |
| Belt or shaft condition | Check | Belt or shaft drive |
| Rear shock has no leaks | Check | All |

### 6.4 Engine and fluids

| Item | Type | Applies to |
| --- | --- | --- |
| Engine oil level in range | Number entry (level note) | All |
| Coolant level between marks | Check | Liquid-cooled |
| No leaks under the engine | Photo suggested | All |
| Cold start works smoothly | Check | All |
| Kick start works | Check | If fitted |
| Idle is steady, no unusual noise | Check | All |
| Exhaust fixed, no unusual smoke | Check | All |
| Air filter housing closed and clean | Check | Where accessible |

### 6.5 Rear

| Item | Type | Applies to |
| --- | --- | --- |
| Tail light and brake light work | Check | All |
| Rear indicators work | Check | All |
| Number plate light works | Check | All |
| Rear tyre pressure matches manual | Number entry | All |
| Rear tyre age and condition | Number entry | All |
| Rear brake pedal or lever works, free play correct | Check | All |
| Rear wheel spins freely and runs true | Check | All |

### 6.6 Right side

| Item | Type | Applies to |
| --- | --- | --- |
| Paint and panels free of scratches and dents | Photo suggested | All |
| Exhaust heat shield and mounting secure | Check | All |
| Footpeg and gear lever tight | Check | All |
| Brake fluid reservoir level | Check | Rear disc |
| Footrest and pillion pegs secure | Check | All |

### 6.7 Controls and cockpit

| Item | Type | Applies to |
| --- | --- | --- |
| Instrument cluster shows no warning lights | Check | All |
| Odometer reading recorded | Number entry | All |
| Odometer is very low (a few kilometres) | Check | All |
| Throttle returns smoothly on release | Check | All |
| Clutch lever free play and smoothness | Check | Manual |
| Horn is loud and clear | Check | All |
| Hazard and indicator switches work | Check | All |
| Ignition, steering lock and seat lock work | Check | All |
| USB or charging port works | Check | If fitted |

### 6.8 Fuel and extras

| Item | Type | Applies to |
| --- | --- | --- |
| Enough fuel to reach a pump | Check | All |
| Tool kit, jack or puncture kit present | Check | If supplied |
| Fitted accessories work and match the bill | Check | If any |
| Free-service date and kilometre limit written down | Number entry | All |
| Promised freebies received (helmet etc.) | Check | If promised |

### 6.9 Test ride

See section 5.8.

### 6.10 Handover

| Item | Type |
| --- | --- |
| Photos of the bike, chassis plate and odometer taken | Photo suggested |
| Service contact and roadside assistance number saved | Check |
| Any promised fixes are written on the delivery note | Check |

## 7. State model

### 7.1 Item states

| State | Meaning | Counts as answered | Effect on summary |
| --- | --- | --- | --- |
| **Unanswered** | Not yet looked at | No | Appears in Unchecked |
| **OK** | Checked and fine | Yes | None |
| **Issue** | A problem exists | Yes | Appears in Issues; blocks "All clear" |
| **N/A** | Not applicable or not possible | Yes | Appears in Skipped |

Allowed transitions: any state to any other state, with one tap. Moving away from Issue retains the note and photos until removed.

### 7.2 Zone states

- **Not started:** all items unanswered.
- **In progress:** some answered.
- **Complete:** all visible items answered.
- **Has issues:** at least one Issue (shown alongside the above state).

### 7.3 Inspection states

- **Draft:** not all items answered.
- **Ready to review:** all items answered, issues possible.
- **Closed:** the user has chosen **Finish** on the summary. Closing is reversible; it only locks the date and stamps the report.

### 7.4 Progress calculation

- Progress = answered visible items ÷ total visible items.
- The red segment on the progress bar = issues ÷ total visible items.
- Hidden items (by bike setup) are excluded from both.

## 8. Data model

**Inspection**

- id, created at, updated at, closed at (optional), name or label (optional)
- bike setup: drive, brakes, tyres, cooling, start, fuel system
- bike details: model, chassis number, engine number, odometer reading
- readings: front tyre pressure, rear tyre pressure, oil level note
- location (optional text, such as dealer name)

**ItemAnswer**

- inspection id, item id, state, value (if any), note, severity, photo ids, updated at

**Photo**

- id, inspection id, item id, image data (compressed on device), created at

**Item definition (static, shipped with the page)**

- id, zone, order, label, hint, type, applicability rule, default severity

**Storage:** IndexedDB for photos and answers; a small key in local storage for UI preferences (hints shown, prepare card dismissed). If IndexedDB is unavailable, fall back to local storage for text only and warn that photos cannot be kept.

## 9. Content and tone

- Plain, calm, second-person language. No blame, no alarm.
- Hints say what good looks like and what to ask for, never technical lectures.
- Bilingual from the start of design (English first, Hindi next). Labels must be short enough to survive translation; avoid idioms.
- No legal claims. Never state that the dealer must do something by law. Use "ask the dealer to" or "get it in writing".
- Never imply that the checklist guarantees a defect-free bike.

## 10. Accessibility and ergonomics

- Tap targets at least 44 px, with 8 px spacing, usable one-handed and with gloves.
- State is never conveyed by colour alone: each state also has a label (OK, Issue, N/A) and a distinct shape or icon.
- Text contrast of at least 4.5:1, including small hints, and visible in strong sunlight.
- Real buttons, inputs and labels, so screen readers and keyboards work.
- Respect reduced-motion settings; collapse and expand transitions are short and optional.
- Support large system font sizes without breaking the row layout.
- Primary actions sit in the lower half of the screen for thumb reach.

## 11. Edge cases and errors

| Situation | Behaviour |
| --- | --- |
| Dealer says a check is not allowed (for example, test ride) | Mark as N/A, add a note "Dealer did not allow", and surface it in the summary |
| User marks everything OK in seconds | No blocking, but the summary shows the elapsed time and a gentle prompt to re-check key items such as brakes and tyres |
| User changes bike setup midway | Re-filter list; keep stored answers; recompute counts |
| Photo permission denied | Explain once, allow note-only, offer a retry |
| Storage full | Warn, offer to remove photos or export data |
| User clears browser data | Inspection is lost; explain in the footer that data lives on the device, and recommend exporting after finishing |
| Opened on a different device | No sync in v1; offer a download and import of the inspection data as a later feature |
| Wrong chassis number typed | Editable at any time, including from the summary |
| Long notes or many photos | Keep rows responsive; thumbnails lazy-load; reports paginate when printed |
| Language switch midway | Labels change; user answers and notes are untouched |

## 12. Analytics and success measures

The page should respect privacy: no personal data, no photos or notes ever sent. Use aggregate, anonymous counts if any analytics are added.

| Measure | Why |
| --- | --- |
| Landing to start rate | Is the promise clear? |
| Share of starts that reach 50% and 100% | Where do people give up? |
| Median time per zone | Finds slow or confusing zones |
| Issue rate per item (aggregate) | Shows which checks matter most and improves content |
| Summary views, copy actions, print actions | Confirms the output is useful |
| Clicks on the tripmeter handoff card | Interest in the app, measured only after value is delivered |
| Return visits to a saved inspection | Confirms interruptions are handled |

## 13. Test scenarios

1. First-time user on a phone at a showroom completes the full checklist in one sitting.
2. User is interrupted three times (lock, call, tab closed) and resumes without losing anything.
3. User flags three issues with photos, then copies the issues text and pastes it into WhatsApp.
4. User skips bike setup and gets the full list, then sets it later and sees counts update correctly.
5. User tries to reach "All clear" with one item still unanswered; the summary must refuse.
6. User with no signal opens a previously loaded page and finishes the inspection.
7. Print preview on a 3-page report with photos is readable and complete.
8. Large font setting and a screen reader can complete the flow.
9. Photo permission denied, and the flow still works with notes only.
10. User switches between two saved inspections without mixing data.

## 14. Build phases

| Phase | Scope |
| --- | --- |
| **A: Done** | A simple single-list page with tick and flag, local saving, print and copy of issues |
| **B: Core flow** | Walk-around zones, three-state rows, inline issue panel with note and photo, Next unchecked, and the summary screen |
| **C: Tailoring** | Bike setup filtering, number-entry rows, severity chips, multiple inspections, Hindi |
| **D: Handoff** | Data export, import into the tripmeter logbook, optional logbook card |
| **E: Later** | Accounts and sync, share link, model-specific templates, dealer-ready report formats |

## 15. Open questions

1. Should the checklist content be reviewed by a mechanic or experienced riders before public launch, to reduce the chance of wrong or missing checks?
2. How much should the page teach ("why this matters") versus stay lean for showroom use?
3. Do we want severity chips in v1, or only notes and photos?
4. Is cross-device resume important enough to bring accounts forward?
5. What is the best sharing format for dealers: text, PDF, or a link?
6. Which languages come after English and Hindi, if any?
7. Should the page name or promote tripmeter at all before the logbook exists?
