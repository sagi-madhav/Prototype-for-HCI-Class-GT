# Project Specification: Interactive Multi-Leg Transit UI Experiment & Usability Testing Suite

## 1. Project Overview
Build a clean, modern, interactive web application for a Human-Computer Interaction (HCI) experiment evaluating **three low-fidelity/medium-fidelity mobile UI prototypes** for configuring multi-leg public transit trips and transfer buffers.

The web app will allow test participants and peer reviewers to:
1. Read a standardized transit planning benchmark task.
2. Interact with **Prototype A (Dual-Anchor Timeline)**, **Prototype B (Modular Buffer-First Canvas)**, and **Prototype C (Parametric Faceted Filter Sheet)** inside a realistic, centered iPhone device frame.
3. Have their **task completion time** and **configuration errors** tracked automatically as they complete the task on each prototype.
4. Answer two quick post-task rating questions (Single Ease Question & Transfer Confidence Score) after each prototype.
5. Export or copy a clean summary of their evaluation metrics (JSON/CSV/Clipboard) to share with the researcher.

---

## 2. Recommended Tech Stack & Layout Architecture
- **Framework:** React (Vite) with Tailwind CSS and `lucide-react` icons (or a self-contained single-page application).
- **No External API Keys Required:** All transit routes, schedules, and buffer calculations must be deterministic and state-driven on the client side.
- **Desktop / Web Layout:**
  - **Top Bar:** Experiment Header, Prototype Switcher Tabs (`Prototype A: Timeline`, `Prototype B: Modular Buffer`, `Prototype C: Faceted Sheet`, and `Results Summary`), and Participant Order Selector (Latin Square counterbalancing presets: `A → B → C`, `B → C → A`, `C → A → B`).
  - **Left Panel (Experiment Brief & Task Prompt):**
    - Displays the active **Benchmark Task Scenario**:
      > *"Plan a multi-leg transit trip arriving before **08:45 AM**, departing no earlier than **07:20 AM**. Because you are navigating a busy transfer hub with heavy materials, configure the trip to guarantee **at least an 8-minute safe transfer buffer** between vehicles, then select a valid route."*
    - Displays a live status indicator (`Task In Progress` / `Task Completed`), automatic timer, and a button to start/reset the current prototype test.
  - **Center Stage (iPhone Mockup Frame):**
    - A realistic iPhone bezel (`390px × 844px` viewport, rounded corners, status bar showing `9:41`, signal, Wi-Fi, battery, and home indicator bar at the bottom).
    - Renders the currently active prototype screen with smooth transitions.
  - **Right Panel (Post-Task Evaluation & Telemetry):**
    - Unlocks when the user confirms a route in the active prototype (or can be toggled manually).
    - Captures 1–7 Likert ratings for **Usability (SEQ)** and **Transfer Confidence**, plus an optional comment box.

---

## 3. Detailed Prototype UI & Interactive State Specifications

### 3.1 Prototype A: Interactive Dual-Anchor Temporal Timeline
**Visual Reference:** Matches the "Plan a Journey" Dual-Anchor Schedule & Gantt-style Itinerary wireframe.

#### UI Components (Top to Bottom inside Phone Frame):
1. **Header:** Centered title `"Plan a Journey"`.
2. **Origin & Destination Input Group:**
   - Left vertical connector: Blue circle with navigation arrow icon connected via dotted line to a red circle with pin icon.
   - Input 1 (Read-only or selectable): `"My Current Location"` (or `"100 Main Street"`).
   - Input 2 (Read-only or selectable): `"789 Broadway, New York"` (or `"University Hospital"`).
3. **Section: `"Dual-Anchor Schedule"`**
   - Two floating callout badges above a horizontal timeline track (`06:00`, `07:00`, `08:00`, `09:00` grid lines):
     - Left Badge: `"Earliest Departure (07:20 AM) >"`
     - Right Badge: `"< Latest Arrival (08:45 AM)"`
   - **Interactive Dual-Thumb Slider Track:**
     - Gray background bar with a bright sky-blue active fill between the left and right draggable/clickable handles (`[ > ]` and `[ < ]`).
     - Users can drag or click +/- step buttons on the handles to adjust Earliest Departure (from `06:00 AM` to `08:00 AM` in 5-min steps) and Latest Arrival (from `07:45 AM` to `09:30 AM` in 5-min steps).
4. **Section: `"Gantt-style itinerary"`**
   - Dynamically filters and updates route cards based on the slider bounds.
   - **Card 1: `"Option 1 - Express Route"` (Valid Target Route)**
     - Subtitle right-aligned in green: `"Comfortable (15 mins)"` (or dynamically adjustable if user taps the green transfer block!).
     - Horizontal Gantt Bar:
       - Segment 1 (Blue rounded block with bus icon): `"Bus (Line M15)"`
       - Walking person icon
       - Segment 2 (Green rounded block, clickable to micro-adjust buffer between 8m, 12m, 15m): `"Transfer Buffer (Safe)"`
       - Segment 3 (Purple rounded block with train icon): `"Subway (R train)"`
     - Timestamps row beneath bar: `07:25 AM` | `07:45 AM` | `15 mins` (green text) | `08:00 AM` | `08:25 AM`.
     - Clicking this card highlights it with a selection border and shows a `"Confirm Selected Route"` button.
   - **Card 2: `"Option 2 - Early Route"` (High-Risk Trap Route)**
     - Subtitle right-aligned in red with warning triangle: `"⚠️ Tight Connection Alert (3 mins)"`
     - Horizontal Gantt Bar:
       - Segment 1 (Yellow rounded block): `"Subway (N train)"`
       - Segment 2 (Red warning block with `!` triangle): `3m`
       - Walking icon
       - Segment 3 (Blue block with bus icon): `"Bus"`
     - Timestamps row beneath bar: `07:30 AM` | `08:10 AM` | `08:13 AM` | `08:35 AM`.
     - **Error Logging Logic:** If a participant selects and confirms Option 2 (which only has a 3-minute buffer), increment `errors` count for Prototype A and display gentle feedback or record the error before advancing.

---

### 3.2 Prototype B: Modular Buffer-First Canvas
**Visual Reference:** Matches the "Trip Builder: Prototype B - Modular Buffer-First" wireframe.

#### UI Components (Top to Bottom inside Phone Frame):
1. **Vertical Spine Layout:** A light gray vertical timeline line running down the left-center connecting the modular nodes.
2. **Origin Card:** White rounded card with gray pin icon: `"100 Main Street"`.
3. **Leg 1 Node:** Circular gray train icon on the spine with text:
   - `"Rail Leg (Line Red)"`
   - `"07:30 AM – 07:44 AM"`
4. **Central Interactive Card: Transfer Hub Node (Elevated White Card with Shadow)**
   - Header: Train icon + `"Metro Center Station"`
   - Subheader label: `"CONNECTION CUSHION"` (uppercase, small gray tracking).
   - **3 Interactive Cushion Preset Buttons (Grid of 3):**
     - **Button 1:** `"+3 min"` / `"(Tight)"` with small amber warning triangle in top-right corner.
     - **Button 2 (Default/Target):** `"+8 min"` / `"(Safe)"` with checkmark badge in top-right corner. When active, styled with vibrant blue background (`#1D63FF`), white text, and `"RECOMMENDED"` caption underneath in blue uppercase letters.
     - **Button 3:** `"+15 min"` / `"(Relaxed)"` with a small crescent/relaxed icon in top-right corner.
5. **Leg 2 Node (Dynamically updates when Cushion Button changes!):**
   - Circular gray bus icon on the spine: `"Bus Leg (Line 42)"`
   - Dynamic Schedule based on selected cushion:
     - If `+3 min` selected: `"07:47 AM – 08:17 AM"` (Total Time: `47 mins`, Protected Transfer: `3 mins (High Risk)`).
     - If `+8 min` selected: `"07:52 AM – 08:22 AM"` (Total Time: `52 mins`, Protected Transfer: `8–9 mins at Metro Center`).
     - If `+15 min` selected: `"08:00 AM – 08:30 AM"` (Total Time: `60 mins`, Protected Transfer: `16 mins at Metro Center`).
6. **Destination Card:** White rounded card with gray pin icon: `"University Hospital"`.
7. **Sticky Bottom Summary & Action Sheet:**
   - Summary stats grid:
     - `"Total Time: 52 mins"` | `"Departure: 07:30 AM"`
     - `"Arrival: 08:22 AM"`
     - `"Protected Transfer: 9 mins at Metro Center 🛡️"`
   - Primary CTA Button (Full-width dark blue pill button): `"Generate Buffer-Protected Routes"`
   - **Interaction & Error Logic:**
     - Clicking the CTA with `+8 min` or `+15 min` selected completes the task with `0 errors`.
     - Clicking the CTA with `+3 min` selected logs `1 configuration error` (violated the $\ge 8\text{ min}$ requirement).

---

### 3.3 Prototype C: Parametric Faceted Filter Sheet
**Visual Reference:** Matches the "Public Transit Trip Search - Trip Parameters" bottom-sheet wireframe.

#### UI Components (Top to Bottom inside Phone Frame):
1. **Top App Bar & Search Header (Dimmed when Drawer is Open, Interactive when Drawer is Minimized):**
   - Back arrow `<` and title `"Public Transit Trip Search"`.
   - Origin / Destination input card (`"Origin: 100 Main Street"`, `"Destination: University Hospital"`) with swap arrows `⇅`.
   - Filter bar below inputs: Pill badge `"🚌 8 mins ⌄"` and `"Filters"` button (clicking either opens/expands the **Trip Parameters** bottom sheet).
2. **Expandable Bottom Sheet / Modal Card (`"Trip Parameters"`):**
   - Header: `"Trip Parameters"` (bold) with a circular collapse/expand chevron button `^` on the right.
   - **Control 1: `"Transfer Buffer"`**
     - Continuous range slider (`min="2"`, `max="15"`, `step="1"`, default `4` so user must actively adjust it to $\ge 8$).
     - Blue active track and blue circular thumb.
     - Labels row beneath slider: `"Tight (2m)"` (left), `"8 mins"` (center, updates live as slider moves), `"Relaxed (15m)"` (right).
   - **Control 2: `"Walking Pace"`**
     - 3-option segmented control pill (`Relaxed`, `Standard Commuter`, `Fast`).
     - Clicking an option highlights it with a white elevated pill background.
   - **Control 3: `"Schedule Reliability:"`**
     - Subtitle: `"Hide high delay connections"`
     - Right side: Interactive iOS-style toggle switch.
   - **Apply / View Routes Action:** Users can either tap the chevron `^` or tap the visible route card below to confirm their filtered route.
3. **Filtered Route List (Visible below the Parameters Sheet):**
   - **Route Card:**
     - Title: `"Filter transit itinerary"` / `"Safe transit route"`
     - Right badge: Green hexagon displaying `"8m"` (updates dynamically to match the slider value; turns red/amber if slider $< 8\text{m}$, green if $\ge 8\text{m}$).
     - Transit icons row: Blue bus icon `URNL` $\rightarrow$ Red train icon `8m buffer`.
     - Bottom status row: Green shield checkmark `"Safe reliability score"` (if buffer $\ge 8\text{m}$ and reliability toggle is ON) or `"Moderate/Low reliability"` (if buffer $< 8\text{m}$).
     - Clicking the route card confirms the selection and finishes the task for Prototype C.

---

## 4. Built-in Experiment Telemetry & Data Export
To make this website directly usable for the CS 6750 Evaluation Results section, include a lightweight state tracker:

1. **Per-Prototype Metrics Collected Automatically:**
   - `completionTimeSeconds`: Elapsed time from clicking "Start Task" on that prototype until confirming a route.
   - `errorCount`: Number of times the user attempted to select a route with $< 8$ minutes buffer or outside the time window.
   - `finalBufferSelected`: The buffer value (in minutes) when the route was confirmed.
2. **Post-Prototype Micro-Survey Modal:**
   - Immediately after confirming a route in Prototype A, B, or C, pop up a non-intrusive card in the right-hand panel:
     - **Q1 (Single Ease Question, 1–7):** *"Overall, how easy or difficult was it to configure your trip parameters and transfer cushion?"*
     - **Q2 (Confidence Score, 1–7):** *"How confident are you that the route you selected will not result in a missed connection?"*
     - **Q3 (Optional Qualitative Note):** *"What was most helpful or confusing about this screen?"*
3. **Results Summary & Export Tab:**
   - Displays a comparison table of the participant's metrics across Prototype A, Prototype B, and Prototype C.
   - Includes a **"Copy Evaluation Data to Clipboard"** button (formatted as a clean Markdown/CSV row) and a **"Download JSON/CSV"** button so participants or classmates can paste their results directly into a reply or form.

---

## 5. Visual Polish & UX Guidelines for Antigravity
- Use clean San Francisco / Inter system typography (`font-sans`).
- Ensure the phone frame remains at a comfortable, fixed mobile aspect ratio (`390px × 844px`) on desktop screens, and scales gracefully on smaller laptops.
- Make all interactive controls (sliders, segmented buttons, toggles, Gantt transfer blocks) have clear hover, active, and focus states so the prototype feels responsive and realistic during screen recordings and live user tests.