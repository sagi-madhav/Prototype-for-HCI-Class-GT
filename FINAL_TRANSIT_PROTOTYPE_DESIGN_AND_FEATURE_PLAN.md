# Final Transit Prototype — Feature, UI/UX, and Implementation Plan

**Project:** Human–Computer Interaction (CS 6750) — Safer Multi-Leg Transit Planning  
**Purpose:** Turn the three exploratory designs into one polished, interactive, high-fidelity prototype.  
**Recommended concept:** **TransferWise** (working name) — *Plan around your connections, not just your arrival time.*  
**Target platform:** Responsive React web app, presented as a mobile experience in an iPhone frame during demos.  
**Status:** Design/implementation proposal, **not** a claim that these features have already been built.

---

## 1. Executive Recommendation

Your three references are useful for different reasons:

| Earlier concept | Keep from it | Improve for the final product |
|---|---|---|
| **A — Dual-Anchor Timeline** | Earliest-departure/latest-arrival constraints; graphical route timeline; clearly visible transfer risk | Make the controls easier to tap, add stepper/text alternatives to dragging, and use the timeline as a secondary route-detail visualization rather than the entire primary interface. |
| **B — Modular Buffer-First** | A transfer-specific `+3 / +8 / +15 min` choice, a clear vertical sequence of trip legs, and a summary near the main action | Use this as the **primary interaction**, with better explanatory text and dynamically generated route choices. |
| **C — Parametric Filter Sheet** | Walking pace, exact buffer setting, and delay-related preferences | Move these into a clean **Advanced preferences** bottom sheet instead of making users adjust everything before seeing results. |

### Recommended final product

Build **one integrated trip planner**, rather than displaying A, B, and C as three disconnected prototypes. Lead with the simplicity of B, expose the flexibility of C as needed, and borrow A's visual timeline when users want to inspect their journey.

**Core user promise:**

> “Show me trips that start after 7:20 AM, arrive before 8:45 AM, and leave me at least 8 minutes of usable transfer time after I walk between platforms.”

The design should make that promise *visible and understandable*, not just show a generic green “Safe” badge.

**Important distinction:** A route that has an 8-minute gap between vehicles does **not** necessarily have 8 minutes of usable waiting time if a traveler needs 4 minutes to walk between them. The final design should explicitly separate **scheduled connection gap**, **estimated walking time**, and **remaining cushion**. This is the strongest functional improvement you can make.

### Suggested final scope

- **Must-have:** Functional planning flow, route results, explicit time constraints, customizable buffer, walking pace, visible transfer math, route selection, clear unsafe-route warnings, mobile polish, and a working end-to-end demo.
- **Should-have:** Compare routes, route detail timeline, a realistic but labeled delay simulation, reset/empty/error states, accessibility, and researcher demo mode.
- **Nice-to-have:** Saved preferences, route favoriting, animations, simulated live disruption banner, map thumbnail, light/dark theme, and exportable itinerary.

---

## 2. Primary User Experience

### A. What the user should be able to do

1. Enter or choose an origin and destination.
2. Set both **earliest departure** and **latest arrival**, instead of having to choose one.
3. Pick a minimum **usable transfer cushion** (e.g., 8 min).
4. Adjust walking pace and optionally indicate heavy bags or limited mobility.
5. Generate **deterministic, realistic-looking sample route options**.
6. See which routes satisfy the constraints and exactly *why*.
7. Compare the tradeoff among total journey time, arrival time, walking, transfer comfort, and number of connections.
8. Open a route to inspect a leg-by-leg timeline.
9. Confirm a route and view an attractive trip summary.
10. Change a preference and immediately see the new results or a clear “Apply changes” action.

### B. Recommended primary flow

```text
Welcome / Plan Trip
        ↓
Origin + Destination
Earliest departure + Latest arrival
Minimum usable transfer cushion: [ 3 ] [ 8 ✓ ] [ 15 ]
Walking pace: [ Relaxed ] [ Standard ] [ Fast ]
        ↓
           [ Find routes ]
        ↓
Route Results
  ✓ Recommended — meets constraints
  ! Fast but tight — 2 min usable cushion
  ✓ Relaxed — larger cushion, later arrival
        ↓
Select a result → Route Details
  Leg 1 → transfer walk → cushion → Leg 2
  Visual timeline + explanation of safety status
        ↓
          [ Use this route ]
        ↓
Trip Confirmation / Itinerary Summary
```

**Use five high-quality screens rather than ten unfinished screens.** The flow should be navigable with Back, Edit Trip, and Start Over; no dead-end buttons.

---

## 3. Detailed Feature Backlog

### P0 — Essential features (implement first)

#### F01. Modern, functional trip search card

- Origin and destination fields with pin/navigation icons and a visible swap button.
- Preload a **sample trip** so an evaluator can immediately test the design.
- Show a small “Demo route data” label. Do **not** imply the app is retrieving actual transit schedules.
- Optional preset destinations (e.g., University Hospital, Central Station, North Campus). These can use local arrays; no geocoding is necessary.
- Input validation for empty or identical origin/destination.

**UI detail:** Two stacked fields connected by a subtle vertical line. One compact swap icon, not a large competing action.

#### F02. Dual-anchor scheduling, made simpler

- Present **Earliest departure** and **Arrive by** as two compact time controls.
- Keep both constraints visible in a pinned search summary when viewing results.
- Provide 5-minute increment/decrement controls or native time inputs; dragging a tiny thumb must not be the only way to adjust times.
- An optional mini timeline can visualize the allowable travel window.
- Block invalid configurations where `earliestDeparture >= latestArrival`, with specific recovery guidance.

**Example:** `Leave after 7:20 AM`  ·  `Arrive by 8:45 AM`.

#### F03. Transfer cushion presets + custom setting

- Primary selector: **3 min / 8 min / 15 min**.
- **8 min** can be preselected for the standardized scenario; explain it as the user's chosen preference, not an objectively universal safe time.
- Show a small `Customize` affordance for choosing another value such as 10 or 12 minutes.
- On selection, update result availability, the visual timeline, and any route status immediately or when the user taps Apply.
- Use labels: `Tight`, `Comfortable`, `Extra time`; avoid promising that any buffer is “guaranteed safe.”

**Example feedback:** `Minimum cushion set to 8 min after walking.`

#### F04. Walking pace and carrying-items preference

- Walking pace: **Relaxed / Standard / Fast**.
- Optional toggle: **Carrying heavy items**.
- The selected pace must alter estimated station-transfer walking time and therefore route eligibility.
- Make this available in a compact row with a link to `Trip preferences`.
- Use clearly labeled **sample estimates**; don't claim precise station accessibility information unless you have validated data.

**Interaction example:** Choosing Relaxed changes a route's transfer walk from 4 to 6 minutes, reducing the usable cushion by 2 minutes.

#### F05. Route results with understandable recommendations

Each result card should contain:

1. Departure and arrival time (large, immediately scannable).
2. Total journey duration.
3. Transit modes/line chips (e.g., red rail → bus 42).
4. The **usable transfer cushion** in minutes, not just a green/red status.
5. Arrival deadline margin (`17 min before your deadline`).
6. A small reason: `14-min connection gap − 4-min walk = 10-min cushion`.
7. One clear `View details` or selectable card action.

Default ranking: **Meets constraints first**, then earliest arrival or shortest duration according to a visible sort preference. Do not silently hide all risky routes; provide a separate “Doesn't meet preferences” group for explanation and comparison.

#### F06. Transparent transfer risk assessment

Use a simple, explainable rule:

```text
scheduledConnectionGap = nextLeg.departure - previousLeg.arrival
usableCushion = scheduledConnectionGap - estimatedTransferWalk

meetsBuffer = usableCushion >= requestedMinimumCushion
meetsWindow = firstLeg.departure >= earliestDeparture
           && lastLeg.arrival <= latestArrival

routeQualifies = meetsBuffer && meetsWindow
```

- For multi-transfer journeys, evaluate **every** transfer; use the smallest usable cushion as the journey's headline buffer.
- Show **exactly which constraint fails** for a rejected route.
- Avoid labels like `97% reliable` unless a real source supports that calculation.
- Label simulated risk judgments as **based on scheduled times**, not predictive certainty.

**Warning example:** `This connection leaves 2 min after your estimated walk. Your selected minimum is 8 min.`

#### F07. Leg-by-leg trip details

Display a refined vertical journey timeline:

- Departure location and time.
- Rail/bus line label and ride duration.
- Arrival at transfer station.
- Walking stage with estimated minutes.
- Remaining cushion (visually highlighted).
- Next vehicle departure and final destination arrival.
- A compact time bar/Gantt strip borrowed from A showing travel versus waiting time.

Use `Travel`, `Walk`, `Waiting cushion`, and `Arrive` as the legend. Every graphical segment needs a corresponding text label.

#### F08. Sticky route confirmation and completed state

- On the route detail page, show a sticky bottom panel with arrival time, usable cushion, and primary `Use this route` button.
- If the route does not satisfy current preferences, show a warning with `Adjust preferences` and `Choose anyway` actions; the demo should not misrepresent noncompliant routes as qualifying.
- On confirmation, show a success/summary screen with **Trip planned**, the selected itinerary, and buttons `Edit trip` / `Plan another trip`.
- Because this is a simulation, do not claim tickets were bought or a real journey was booked.

### P1 — Differentiating features (implement next)

#### F09. Route comparison drawer

Allow selecting **up to two routes** for a bottom-sheet comparison:

| Attribute | Recommended | Faster but tight |
|---|---|---|
| Arrival | 8:28 AM | 8:20 AM |
| Duration | 58 min | 48 min |
| Usable transfer cushion | 10 min | 2 min |
| Meets your 8-min minimum? | Yes | No |
| Tradeoff | Later but more time to transfer | Earlier but tight connection |

This is far more useful than a generic “Option 1 / Option 2” heading.

#### F10. What-if disruption simulator

Introduce a **Demo scenario** control on the detail screen:

- `On schedule` (default).
- `First train arrives 5 minutes late`.
- `Walking takes 3 minutes longer`.
- `Bus departs 4 minutes early` (purely hypothetical; clearly labeled).

When a scenario is selected:

- Recompute the **remaining cushion** and route validity.
- Show the before/after figures.
- Explain the impact with plain language: `Your 10-min cushion becomes 5 min after a 5-min delay.`
- Provide a `Find another route` action that returns to filtered results.

This feature directly demonstrates the value of buffer-aware planning. **Do not label simulated schedules as live transit tracking.**

#### F11. Smart empty state and guided recovery

If no sample route satisfies all the settings, show:

> **No trips match every preference.**  
> Try leaving 10 minutes earlier, allowing a later arrival, or lowering your minimum cushion.

Use **single-tap suggestions** like `Arrive by 8:55` or `Buffer 6 min`, but show the resulting change clearly and never adjust constraints without user action.

#### F12. Contextual educational tooltips

Small optional info buttons explain:

- **Connection gap:** Clock time between scheduled vehicle arrival and the next departure.
- **Transfer walk:** Estimated time to move between stops/platforms.
- **Usable cushion:** Time left after the estimated walk.
- **Why recommended?** A short explanation of the user-selected constraints the route meets.

Do not make users read a tutorial to accomplish a basic trip.

#### F13. Subtle, meaningful motion

- 150–250 ms card expansion and sheet transitions.
- Soft highlight transition when a buffer changes.
- Route results crossfade or reorder smoothly.
- Brief checkmark animation for successful confirmation.
- Honor `prefers-reduced-motion` and disable nonessential movement.

Motion should reinforce cause/effect, not distract from usability.

#### F14. Better researcher/demo controls

Keep the **existing A/B/C usability evaluation interface** as a *separate mode or route* from the new final experience. Add:

- `Final Prototype` alongside `A`, `B`, `C`, and `Results` in the desktop demo navigation.
- A small `Demo / Researcher` control **outside the phone screen**.
- Deterministic reset button to reproduce the benchmark case.
- Optional “Show why this route qualifies” overlay, hidden during participant testing.
- Keep old test metrics intact; do not compare post-redesign results to prior studies as though the testing conditions were identical.

### P2 — Optional stretch features (only after core experience works)

#### F15. Saved presets

- `Morning hospital trip`, `Extra walking time`, `Fewest transfers`.
- Implement using client-side state or `localStorage` if desired.
- Add clear `Save preferences` and `Reset to defaults` controls.

#### F16. Journey share/export card

- Generate a plain-text itinerary or printable/shareable summary.
- Include departure, arrival, transfer station, cushion, and a **Demo itinerary** label.
- Do not pretend this is a bookable ticket or official transit instruction.

#### F17. Lightweight map or station layout preview

- A stylized, explicitly schematic route map with origin, transfer station, and destination dots.
- Optional visual emphasis on where the traveler walks between services.
- A static/schematic map is enough for a class prototype; don't invent accurate station geography.

#### F18. Personalization and theme

- Optional dark-mode preview and persistent preferred walking pace.
- Design light mode first; apply semantic colors consistently in both modes.
- Avoid spending time here before the data and interaction model works.

---

## 4. The Five Main Screens — Pixel-Level Design Direction

### Screen 1 — **Plan your trip**

**Visual priority:** A clean hero heading and a short form; no overwhelming filter panel.

```text
┌──────────────────────────────────┐
│  ←                     ?          │
│  Plan your trip                  │
│  Find a connection that fits you  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ ◉  100 Main Street        │  │
│  │ │                          │  │
│  │ ●  University Hospital    │  │
│  └────────────────────────────┘  │
│                                  │
│  YOUR TIME WINDOW                │
│  [Leave after]    [Arrive by]    │
│  [ 7:20 AM  ]     [ 8:45 AM ]    │
│                                  │
│  MINIMUM TRANSFER CUSHION        │
│  [ 3 min ] [ 8 min ✓ ] [15 min]  │
│  After walking between stops     │
│                                  │
│  Walking pace  [Relaxed   ˅]     │
│  Advanced preferences         ›  │
│                                  │
│  ┌────────────────────────────┐  │
│  │      Find routes →         │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Design notes:**

- A plain off-white background, white cards, and indigo/blue primary action.
- A small accent eyebrow such as `SMARTER CONNECTIONS`, but avoid excess marketing copy.
- Show a discreet explanatory sentence: `We'll check your walking time at every transfer.`
- The primary CTA stays comfortably above the phone home indicator.

### Screen 2 — **Your routes**

**Visual priority:** Compare arrival and transfer cushion at a glance.

```text
┌──────────────────────────────────┐
│  ←  Your routes                  │
│  7:20–8:45 • 8-min cushion       │
│  [Edit]               [Sort ˅]   │
│                                  │
│  RECOMMENDED                     │
│  ┌────────────────────────────┐  │
│  │ 7:30 ───────────── 8:28    │  │
│  │ 🚆 Red Line  →  🚌 Bus 42  │  │
│  │ ✓ 10 min usable cushion   │  │
│  │ 17 min before deadline    │  │
│  │ View route details     →  │  │
│  └────────────────────────────┘  │
│                                  │
│  ANOTHER COMFORTABLE OPTION      │
│  ┌────────────────────────────┐  │
│  │ 7:25 ───────────── 8:35    │  │
│  │ ✓ 14 min cushion          │  │
│  │ View route details     →  │  │
│  └────────────────────────────┘  │
│                                  │
│  DOESN'T MEET YOUR PREFERENCES   │
│  ┌────────────────────────────┐  │
│  │ 7:32 ───────────── 8:20    │  │
│  │ ! Only 2 min cushion      │  │
│  │ See why it is tight    →  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Design notes:**

- Use a light blue tint for the recommended card, *not* a fully saturated blue background.
- Do not rely on green/red alone; use icons and text.
- Each card should be individually clickable and have a clear hover/focus/pressed state.
- Put `Compare` as a tertiary action only after the basic flow works.

### Screen 3 — **Route details**

**Visual priority:** The connection explanation is the hero, not the technical terminology.

```text
┌──────────────────────────────────┐
│  ←  Route details                │
│  7:30 AM → 8:28 AM              │
│  ✓ Meets your trip preferences   │
│                                  │
│  🚆 7:30  Board Red Line         │
│  │                               │
│  🚆 7:44  Metro Center arrival   │
│  │                               │
│  🚶 4 min walk to Bus 42        │
│  │                               │
│  🟢 10 min remaining cushion     │
│  │                               │
│  🚌 7:58  Board Bus 42           │
│  │                               │
│  📍 8:28  University Hospital    │
│                                  │
│  WHY THIS ROUTE WORKS            │
│  14 min between vehicles         │
│  −4 min estimated walking        │
│  ───────────────────────────     │
│  =10 min usable cushion          │
│                                  │
│  [See timeline] [Try a delay]    │
│  ┌────────────────────────────┐  │
│  │      Use this route       │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Design notes:**

- Route duration and arrival margin are compact chips beneath the title.
- Use a vertical connector spine inspired by Prototype B.
- Put the detailed Gantt strip behind `See timeline`; do not make everyone parse it just to choose a route.
- Explain the time math in a visually separated, highly readable box.

### Screen 4 — **Trip preferences** (bottom sheet)

- Header `Trip preferences`, brief supporting copy, top grabber, obvious close button.
- Groups: **Schedule**, **Transfer comfort**, **Walking**, **Avoid risky transfers**.
- A continuous buffer slider is allowed here, paired with a visible numeric value and `− / +` buttons for precision.
- Mode choice using segmented control: Relaxed / Standard / Fast.
- Reliability control label should say `Hide connections below my selected cushion` instead of suggesting actual delay predictions.
- Sticky `Show X matching routes` action; `Reset` secondary.
- The background is dimmed, not blurred so heavily that orientation is lost.

### Screen 5 — **Trip ready**

- Small success illustration/check, `Your route is ready` (not `Guaranteed safe`).
- Elegant summary card: 7:30 departure, 8:28 arrival, Red Line → Metro Center → Bus 42.
- Highlight `10 min usable transfer cushion`.
- Mention `Demo itinerary — based on sample schedules`.
- Actions: `Edit trip`, `Start a new trip`, optionally `Copy itinerary`.

---

## 5. Complete Visual Design System

### Visual personality

**Keywords:** Calm, focused, trustworthy, approachable, transit-native, thoughtfully premium.  
**Avoid:** Large gradients everywhere, glassmorphism on every card, tiny text, loud fluorescent green, crowded dashboards, and marketing flourishes that hide critical schedule data.

### Color tokens (starting point)

| Token | Example | Usage |
|---|---|---|
| `appBg` | `#F6F8FC` | Main phone background |
| `surface` | `#FFFFFF` | Cards, sheets, input surfaces |
| `textPrimary` | `#172033` | Headings and primary data |
| `textSecondary` | `#607086` | Supporting information |
| `brand` | `#2457D6` | Primary CTA, selected tabs, active controls |
| `brandSoft` | `#EAF0FF` | Recommended route background |
| `success` | `#187744` | Qualifying status; always with text and icon |
| `successSoft` | `#E8F6ED` | Positive status panels |
| `warning` | `#9B5A07` | Tight connections |
| `warningSoft` | `#FFF3DB` | Warning backgrounds |
| `danger` | `#B4232F` | Invalid route/constraint issues |
| `border` | `#E2E8F0` | Subtle dividers and input outlines |

**Validation:** Check real rendered contrast; palette values are suggestions, not proof of WCAG conformance.

### Type scale

- Page title: **26–28 px**, semibold/bold.
- Main route times: **22–26 px**, semibold, tabular numerals.
- Section titles: **16–18 px**, semibold.
- Body: **14–16 px**, normal/medium.
- Labels: **12–13 px**, but don't use small text for critical instructions.
- Button text: **15–16 px**, semibold.
- Fonts: platform system font or Inter, preserving iOS-style polish without depending on proprietary font files.

### Shape, spacing, and elevation

- Use an **8 px spacing grid** (4, 8, 12, 16, 24, 32).
- Cards: **16–20 px radius**; inputs: 12–14 px; CTA: 14–16 px.
- Main phone content: **18–20 px horizontal padding**.
- Cards: 16–20 px internal padding, 12–16 px vertical gap.
- Shadows: extremely subtle; stronger only for an active bottom sheet.
- Standard tap targets: **at least 44 × 44 CSS px as a usability target**, even though WCAG 2.2 AA's minimum has some smaller-target allowances.
- Fixed bottom CTA must respect safe-area padding and never cover scrollable content.

### Icons and visual hierarchy

- Use your existing `lucide-react` dependency: `MapPin`, `Navigation`, `ArrowLeft`, `ArrowRight`, `ArrowLeftRight`, `TrainFront`, `BusFront`, `Footprints`, `Clock3`, `ShieldCheck`, `TriangleAlert`, `SlidersHorizontal`, `Info`, `Check`, `ChevronDown`.
- Pick one consistent stroke width (usually 1.75–2 px).
- One primary action per screen; tertiary actions use simple text or icons.
- Do not communicate risk using color alone: include a readable label and warning/check icon.

### Responsive layout

- **On phones:** Use a full-viewport mobile app layout; no decorative bezel that consumes screen width.
- **On desktop demos:** Keep a centered **390 × 844 logical viewport** in a realistic phone frame, scale safely when vertical space is tight, and display optional researcher controls in side panels.
- Ensure vertically scrollable content is reachable; the bottom sheet scrolls within the phone, not behind it.
- Make sticky elements account for a 34 px-style home indicator area when the device frame includes one.

---

## 6. A Consistent Demo Dataset (No External API Required)

Your previous prototypes use slightly different location names and schedules because they were independent concepts. For a final combined experience, use **one internally consistent scenario** throughout the screens. The following data is **new fictional sample data**, not verified transit timetables:

**Scenario:** `100 Main Street` → `University Hospital`, earliest departure `07:20`, latest arrival `08:45`, desired **8 minutes usable cushion**, estimated station walking time depends on user preference.

| Route | First leg | Transfer + walk | Second leg | End | Usable cushion | Qualifies? |
|---|---|---|---|---|---:|---|
| **Balanced (recommended)** | Red Line 07:30–07:44 | 14-min connection gap; 4-min walk | Bus 42 07:58–08:28 | 08:28 | **10 min** | **Yes** |
| **Fast but tight** | Red Line 07:32–07:48 | 6-min connection gap; 4-min walk | Bus 42 07:54–08:20 | 08:20 | **2 min** | **No: buffer too short** |
| **Extra breathing room** | Red Line 07:25–07:42 | 20-min connection gap; 6-min walk | Bus 42 08:02–08:35 | 08:35 | **14 min** | **Yes** |

**Consistency checks:**

- Balanced: 07:44 → 07:58 = 14 min; 14 − 4 = 10; total journey = 58 min; arrival is 17 minutes before deadline.
- Fast: 07:48 → 07:54 = 6 min; 6 − 4 = 2; total journey = 48 min; arrival is 25 minutes before deadline.
- Relaxed: 07:42 → 08:02 = 20 min; 20 − 6 = 14; total journey = 70 min; arrival is 10 minutes before deadline.
- The walking estimate depends on the station/route and walking mode; include an explanation in the UI.
- If the user picks a different walking pace, recompute estimates and status using a deterministic multiplier; document assumptions.

### Critical edge cases to support

1. A route arrives **exactly** at latest arrival (qualifies if `<=` is intended).
2. A route departs **exactly** at earliest departure (qualifies if `>=` is intended).
3. The usable cushion is exactly equal to the minimum (qualifies).
4. A later bus makes the cushion larger but violates arrival deadline (fails).
5. A 3-minute vehicle gap with 4-minute walk produces **−1 min** usable cushion (connection is infeasible under estimated walking time; do not label this as simply a small buffer).
6. There are zero eligible routes (show recovery recommendations).
7. The user increases minimum cushion and one previously recommended route no longer qualifies.
8. A selected slow walking pace causes a route to fail.
9. Multiple transfers: even if one is comfortable, one tight transfer makes the route fail the minimum.
10. Data validation: times are ordered, no negative leg durations, origin/destination are set, and route IDs remain stable.

---

## 7. Suggested Component Architecture (React + Vite + Tailwind)

The uploaded project lists **React 19, Vite 6, Tailwind CSS 4, and lucide-react**, so you can build this without introducing another major UI framework. The supplied `index.html` mounts `src/main.jsx`, but the uploaded file bundle does **not** contain the `src/` directory; component-level behavior is therefore unverified.

Recommended architecture for the **new final prototype**:

```text
src/
├── main.jsx
├── App.jsx
├── styles/
│   └── index.css
├── data/
│   ├── demoRoutes.js
│   └── demoLocations.js
├── lib/
│   ├── time.js
│   ├── routeCalculator.js
│   └── routeValidation.js
├── components/
│   ├── PhoneFrame.jsx
│   ├── AppHeader.jsx
│   ├── LocationInput.jsx
│   ├── TimeWindowPicker.jsx
│   ├── BufferPresets.jsx
│   ├── WalkingPaceSelector.jsx
│   ├── RouteCard.jsx
│   ├── RouteTimeline.jsx
│   ├── TransferBreakdown.jsx
│   ├── PreferencesSheet.jsx
│   ├── RiskExplanation.jsx
│   └── StickyActionBar.jsx
├── screens/
│   ├── PlanTrip.jsx
│   ├── RouteResults.jsx
│   ├── RouteDetails.jsx
│   ├── TripReady.jsx
│   └── ResearcherDemo.jsx
└── state/
    └── useTripPlanner.js
```

### Shared application state

```js
const tripPreferences = {
  origin: '100 Main Street',
  destination: 'University Hospital',
  earliestDeparture: '07:20',
  latestArrival: '08:45',
  minimumUsableCushionMinutes: 8,
  walkingPace: 'relaxed', // or 'standard' / 'fast'
  heavyItems: true,
  showNonQualifyingRoutes: true,
};

const uiState = {
  screen: 'plan', // plan | results | details | ready
  selectedRouteId: null,
  preferencesSheetOpen: false,
  activeDemoScenario: 'on-time',
  comparisonRouteIds: [],
};
```

### Separation of responsibilities

- `demoRoutes.js`: Static schedule fixtures and travel legs, not simulated state logic.
- `routeCalculator.js`: Pure functions to compute walking time, connection gap, usable cushion, duration, and deadline margin.
- `routeValidation.js`: Pure functions to determine if each constraint is satisfied and return *specific reasons* for failure.
- `useTripPlanner.js`: Owns app preferences, selected route, view transitions, and actions.
- Components: Mostly presentational; pass state and callbacks as props. No hardcoded contradictory schedule numbers inside individual cards.
- Demo controls: May override delays or preferences but must be isolated from the original A/B/C evaluation data.

**Tailwind note:** Since the project uses Tailwind v4 with the Vite plugin, confirm whether your entry CSS uses `@import "tailwindcss";` and whether custom theme tokens are defined in a supported v4 configuration. Do not assume the old config file alone is sufficient without checking the actual CSS.

### Action behavior requirements

| Control | Must do |
|---|---|
| Swap locations | Swap visible origin and destination; recompute/clear appropriate route results. |
| Earliest time | Update earliest bound and rerun validation. |
| Latest time | Update arrival deadline and rerun validation. |
| 3/8/15 cushion buttons | Update selection and all route classifications. |
| Walking pace | Update derived walking estimates and cushions. |
| Advanced sheet | Open, close, reset, and apply safely. |
| Find routes | Navigate to results; show valid/invalid groups. |
| Route card | Open the selected route's detailed schedule. |
| Try a delay | Change displayed scenario; recompute affected cushion. |
| Use this route | Navigate to confirmation with the correct selected itinerary. |
| Back/Edit/Restart | Preserve or intentionally reset state as labeled. |
| Copy itinerary (optional) | Copy a real formatted summary; show success feedback. |

---

## 8. Motion, Feedback, Empty States, and Microcopy

### Feedback states to explicitly design

- **Default:** 8-minute preference selected, recommendations visible on results.
- **Selected:** Active buffer button visually raised/outlined, value shown in text.
- **Updated:** `Showing 2 routes that meet your preferences` after an edit.
- **Warning:** `This route has only 2 min after walking.`
- **Invalid input:** `Arrival time must be later than earliest departure.`
- **No match:** Actionable adjustment suggestions, not just `No results`.
- **Confirmation:** `Trip ready — your selected route meets the current schedule preferences.`
- **Scenario changed:** `Demo delay applied: remaining cushion 10 → 5 min.`
- **Loading (optional):** A short *simulated* searching state is fine for realism, but must not be confused with real API activity.

### Writing tone

Use plain language instead of technical jargon:

| Avoid | Prefer |
|---|---|
| “Dual-anchor temporal constraint” | “Leave after / Arrive by” |
| “Connection cushion parametric optimization” | “Extra time for your connection” |
| “Validated reliable itinerary” | “Meets your selected time and transfer preferences” |
| “Safe transfer guaranteed” | “10 min left after walking, based on the sample schedule” |
| “Transfer violation” | “Not enough time for this connection” |

---

## 9. Accessibility and HCI Considerations

Design for usability and demonstrable HCI rationale:

- **Visibility of system status:** Every settings change updates route counts, cushion, and eligibility visibly.
- **Error prevention:** Warn before users confirm a nonqualifying connection and suggest recovery actions.
- **Recognition rather than recall:** Keep chosen deadline and minimum cushion visible in route results.
- **User control/freedom:** Back, Edit, Reset, Change route, and undoable preference changes.
- **Flexibility and efficiency:** Simple 8-min preset plus advanced customization for power users.
- **Aesthetic/minimalist design:** A compact primary screen and progressive disclosure for optional settings.
- **Accessible input:** Keyboard-operable sliders/steppers, labeled controls, visible focus indicator, no drag-only action.
- **Accessible feedback:** Use readable success/warning text and icons in addition to color.
- **Contrast:** Aim for at least **4.5:1 for normal text** and **3:1 for large text** under WCAG 2.2 AA, where applicable.
- **Touch:** Aim for 44 px controls; check WCAG 2.2 target-size rules and exceptions.
- **Motion:** Respect reduced-motion preferences.
- **Content resize:** Ensure 200% text zoom does not clip the key controls.
- **Screen readers:** Announce route count/result changes using an appropriate live region and label buffer radio controls with the value and meaning.

References:

- [Nielsen Norman Group — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [W3C — Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)

---

## 10. Keep the Research Story Clear

This is a **final iteration after testing three design concepts**, not necessarily a new scientifically validated result. In the report or demo, explain the progression:

1. **Problem:** Conventional transit route options can emphasize speed while hiding the danger of very tight connections.
2. **Three explored solutions:** Timeline-heavy A, modular buffer-first B, and configurable filter C.
3. **Design synthesis:** Use B for immediate, low-effort buffer selection; C for optional controls; A for time visualization.
4. **Final implementation:** Make the connection math visible, account for walking, and explain tradeoffs across routes.
5. **Validation:** Run a new short usability walkthrough or study of the final design. Report it separately from earlier A/B/C comparisons.

### Suggested final evaluation tasks

**Task 1 — Find a qualifying trip:**

> Plan a trip from 100 Main Street to University Hospital. You cannot depart before 7:20 AM and must arrive no later than 8:45 AM. You are carrying heavy items and want at least 8 minutes of usable time after walking to your next vehicle. Select a qualifying route.

**Task 2 — Change walking constraints:**

> Change the walking pace to Relaxed. Confirm which routes still meet your desired minimum cushion.

**Task 3 — Understand an unsafe route:**

> Look at the faster route and explain why it fails your transfer preference.

**Task 4 — Handle a disruption:**

> Apply a simulated 5-minute delay and decide whether you would keep the recommended route.

### What to measure

- Task completion time (per task).
- Valid/invalid route selections.
- Whether participants can **correctly explain the usable cushion**.
- Number of backtracks or unnecessary setting changes.
- Ease rating (1–7) and confidence (1–7) using consistent wording.
- Short qualitative feedback: what was reassuring, confusing, or visually cluttered.

**Research safeguard:** Do not claim a statistical improvement based on the final iteration without new participant data. If you include participant analytics, seek consent and avoid collecting unnecessary personally identifiable information.

---

## 11. Suggested Development Order

### Phase 1 — Foundation and correct behavior (highest value)

- [ ] Create the final flow and shared trip state.
- [ ] Build one coherent fixture dataset.
- [ ] Implement time parsing and connection-cushion calculations.
- [ ] Implement trip window and buffer validation.
- [ ] Build searchable/selectable location presets.
- [ ] Build earliest/latest time controls.
- [ ] Build buffer presets and walking pace selector.
- [ ] Render valid vs nonvalid results with clear explanations.
- [ ] Complete route details and confirmation flow.
- [ ] Test all benchmark scenarios and edge cases.

### Phase 2 — Visual polish

- [ ] Apply typography/color/spacing tokens consistently.
- [ ] Refine mobile route cards with icons, times, and concise status text.
- [ ] Add the B-style vertical journey timeline.
- [ ] Add an A-style horizontal Gantt strip behind an expandable detail.
- [ ] Add the C-style preferences bottom sheet.
- [ ] Add safe-area-aware sticky actions and smooth page transitions.
- [ ] Add error, no-results, and success states.
- [ ] Check 390 px phone view and desktop demo framing.
- [ ] Perform keyboard, contrast, zoom, and reduced-motion checks.

### Phase 3 — Showcase features

- [ ] Add an interactive route comparison.
- [ ] Add the on-time/late/walking-longer simulation.
- [ ] Add a one-click reset to the standardized research scenario.
- [ ] Add a clear entry point from the old A/B/C experiment suite to the new final flow.
- [ ] Add optional share/copy itinerary.

### If time is extremely limited, prioritize these five

1. **Beautiful Plan Trip screen**, with working dual time anchors and 8-min preset.
2. **Route result cards** with usable cushion and route ranking.
3. **Route Details** featuring a premium vertical journey timeline and connection breakdown.
4. **Walking pace** actually changes route validity.
5. **Completed flow** with no broken buttons and polished feedback.

A fully functioning five-screen prototype is more convincing than a large mock app with mostly inert controls.

---

## 12. Final Acceptance Checklist

The final prototype is ready to show when all of these are true:

- [ ] It opens on a polished, usable mobile planning screen.
- [ ] The same scenario and schedules appear consistently on all pages.
- [ ] Both earliest departure and latest arrival can be set together.
- [ ] Transfer cushion can be selected using 3/8/15 presets and optionally custom input.
- [ ] Walking pace changes actual derived estimates, not only the visual selection.
- [ ] A tight connection is not labeled safe merely because its first vehicle arrives on time.
- [ ] Every result has a correct departure, arrival, journey duration, and transfer calculation.
- [ ] All routes visibly disclose whether they meet the user's preferences.
- [ ] A rejected route has a specific, actionable explanation.
- [ ] Route details clearly distinguish vehicle travel, walking, and usable transfer time.
- [ ] A selected route produces a coherent confirmation screen.
- [ ] The app differentiates fictional demo schedules from live transit information.
- [ ] The back, edit, reset, sheet, and confirm buttons work.
- [ ] The phone-size viewport is readable with no hidden/overlapping footer content.
- [ ] Keyboard navigation, contrast, focus indicators, and accessible labels are checked.
- [ ] The existing experiment and its collected results are not silently overwritten.

---

## 13. Ready-to-Paste Implementation Brief for a Coding Assistant

> **Build a polished, high-fidelity React/Vite/Tailwind mobile prototype for an HCI project about safer multi-leg transit planning.** Use the existing project dependencies (React, Tailwind, lucide-react) and preserve the original A/B/C experiment mode rather than replacing it without a backup. The final product should combine Prototype B's easy buffer presets, Prototype C's advanced walking/reliability preferences, and Prototype A's timeline visualization. Use one coherent fictional route dataset and clearly label demo schedules. Implement a functional flow: Plan Trip → Route Results → Route Details → Trip Ready. Users must specify earliest departure, latest arrival, minimum **usable** transfer cushion, and walking pace. Compute usable cushion as the scheduled time between vehicles minus the estimated transfer walk, and validate all transfers, time boundaries, and selected preferences. Show recommended and nonqualifying routes with human-readable reasons, not invented numerical reliability claims. Implement elegant vertically connected route steps, tasteful cards, sticky bottom actions, an optional parameters sheet, precise typography/spacing, responsive phone/desktop layouts, empty/error/success states, and working back/edit/reset/confirm interactions. Add an optional labeled delay simulation and two-route comparison only after the core flow is correct. Respect keyboard access, high contrast, and reduced-motion settings. Follow the feature definitions, sample route fixtures, and acceptance criteria in this specification; do not leave decorative controls that do nothing.**

---

## 14. What NOT to Add Yet

- No login/account creation unless the course rubric requires it.
- No Stripe/payment/ticket purchase features.
- No fake “live arrival predictions” or fake accuracy percentages.
- No real-location permission prompt unless a supported map/location flow exists.
- No complicated AI chatbot: explaining the route math in the UI is more valuable.
- No unnecessary dashboard, charts, or bottom tabs on every screen.
- No map API, database, or backend unless needed for the actual evaluation goals.
- No claims of guaranteed transfers; transit delays, crowding, and accessibility can change conditions.

**Final quality bar:** Someone should be able to open the prototype, make a trip, understand **why a transfer is comfortable or risky**, and reach a successful completion state without verbal instructions from the researcher.
