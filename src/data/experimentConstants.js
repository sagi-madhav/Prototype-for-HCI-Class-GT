// Default benchmark task constraints
export const BENCHMARK_TASK = {
  earliestDeparture: "07:20 AM",
  earliestDepartureMins: 7 * 60 + 20, // 440 mins
  latestArrival: "08:45 AM",
  latestArrivalMins: 8 * 60 + 45, // 525 mins
  minBufferMins: 8,
  scenarioText: "Plan a multi-leg transit trip arriving before 08:45 AM, departing no earlier than 07:20 AM. Because you are navigating a busy transfer hub with heavy materials, configure the trip to guarantee at least an 8-minute safe transfer buffer between vehicles, then select a valid route."
};

// Counterbalancing orders (Latin Square) for HCI study
export const COUNTERBALANCE_ORDERS = [
  { id: 'ABC', label: 'Order 1: A → B → C (Timeline First)', sequence: ['A', 'B', 'C'] },
  { id: 'BCA', label: 'Order 2: B → C → A (Modular Buffer First)', sequence: ['B', 'C', 'A'] },
  { id: 'CAB', label: 'Order 3: C → A → B (Faceted Sheet First)', sequence: ['C', 'A', 'B'] },
];

export const PROTOTYPE_META = {
  FINAL: {
    id: 'FINAL',
    name: 'TransferWise',
    subtitle: 'Integrated Multi-Leg Transit Prototype',
    description: 'High-fidelity synthesis combining Modular Buffer Presets (from B), Walking Pace & Preferences Sheet (from C), and Visual Timeline Details (from A).',
    tag: 'Final Integrated'
  },
  A: {
    id: 'A',
    name: 'Prototype A',
    subtitle: 'Dual-Anchor Temporal Timeline',
    description: 'Visual Gantt chart with dual-thumb temporal slider handles and direct-manipulation route segment bars.',
    tag: 'Temporal Visual'
  },
  B: {
    id: 'B',
    name: 'Prototype B',
    subtitle: 'Modular Buffer-First Canvas',
    description: 'Node-spine topology where transfer cushions are primary first-class configuration nodes.',
    tag: 'Structural Modular'
  },
  C: {
    id: 'C',
    name: 'Prototype C',
    subtitle: 'Parametric Faceted Filter Sheet',
    description: 'Bottom drawer sheet exposing continuous parametric buffer slider, walking pace, and reliability filters.',
    tag: 'Faceted Filter'
  }
};
