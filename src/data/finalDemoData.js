// Sample transit datasets and fixture routes for the TransferWise prototype

export const DEMO_LOCATIONS = [
  { id: 'loc-1', name: '100 Main Street', subtitle: 'Downtown Transit Center' },
  { id: 'loc-2', name: 'University Hospital', subtitle: 'Medical District Campus' },
  { id: 'loc-3', name: 'Central Station', subtitle: 'Intermodal Rail Terminal' },
  { id: 'loc-4', name: 'North Campus', subtitle: 'Student Center & Engineering' },
];

export const INITIAL_PREFERENCES = {
  origin: '100 Main Street',
  destination: 'University Hospital',
  earliestDeparture: '07:20', // 24h format
  latestArrival: '08:45',     // 24h format
  minimumUsableCushionMinutes: 8,
  walkingPace: 'standard', // 'relaxed' | 'standard' | 'fast'
  heavyItems: false,
  hideNonQualifying: false,
};

// Walking pace multipliers on base station transfer walk time
export const WALKING_PACE_CONFIG = {
  fast: { label: 'Fast', multiplier: 0.75, description: 'Brisk pace, familiar with station layout' },
  standard: { label: 'Standard', multiplier: 1.0, description: 'Normal walking pace' },
  relaxed: { label: 'Relaxed', multiplier: 1.4, description: 'Gentle pace, accessibility, or unfamiliar hub' },
};

export const HEAVY_ITEMS_EXTRA_MINUTES = 2; // Extra walking delay added when carrying luggage/materials

// Fixture routes defined deterministically
export const DEMO_ROUTES = [
  {
    id: 'route-balanced',
    title: 'Balanced',
    category: 'recommended',
    summaryTag: 'Best Connection Balance',
    legs: [
      {
        id: 'leg-1',
        mode: 'rail',
        lineName: 'Red Line',
        lineColor: '#ef4444',
        fromStation: '100 Main St Station',
        toStation: 'Metro Center Station',
        departureTime: '07:30',
        arrivalTime: '07:44',
        durationMinutes: 14,
      },
      {
        id: 'transfer-1',
        isTransfer: true,
        stationName: 'Metro Center Station',
        fromPlatform: 'Platform 2 (Subway)',
        toPlatform: 'Bus Bay 4 (Surface)',
        baseWalkMinutes: 4,
      },
      {
        id: 'leg-2',
        mode: 'bus',
        lineName: 'Bus 42',
        lineColor: '#3b82f6',
        fromStation: 'Metro Center Station',
        toStation: 'University Hospital',
        departureTime: '07:58',
        arrivalTime: '08:28',
        durationMinutes: 30,
      }
    ]
  },
  {
    id: 'route-fast',
    title: 'Fast but tight',
    category: 'tight',
    summaryTag: 'Tight Connection Alert',
    legs: [
      {
        id: 'leg-1',
        mode: 'rail',
        lineName: 'Red Line',
        lineColor: '#ef4444',
        fromStation: '100 Main St Station',
        toStation: 'Metro Center Station',
        departureTime: '07:32',
        arrivalTime: '07:48',
        durationMinutes: 16,
      },
      {
        id: 'transfer-1',
        isTransfer: true,
        stationName: 'Metro Center Station',
        fromPlatform: 'Platform 2 (Subway)',
        toPlatform: 'Bus Bay 1 (Express)',
        baseWalkMinutes: 4,
      },
      {
        id: 'leg-2',
        mode: 'bus',
        lineName: 'Bus 42',
        lineColor: '#3b82f6',
        fromStation: 'Metro Center Station',
        toStation: 'University Hospital',
        departureTime: '07:54',
        arrivalTime: '08:20',
        durationMinutes: 26,
      }
    ]
  },
  {
    id: 'route-relaxed',
    title: 'Extra breathing room',
    category: 'relaxed',
    summaryTag: 'High Connection Cushion',
    legs: [
      {
        id: 'leg-1',
        mode: 'rail',
        lineName: 'Red Line',
        lineColor: '#ef4444',
        fromStation: '100 Main St Station',
        toStation: 'Metro Center Station',
        departureTime: '07:25',
        arrivalTime: '07:42',
        durationMinutes: 17,
      },
      {
        id: 'transfer-1',
        isTransfer: true,
        stationName: 'Metro Center Station',
        fromPlatform: 'Platform 1 (Local)',
        toPlatform: 'Bus Bay 6 (Far Side)',
        baseWalkMinutes: 6,
      },
      {
        id: 'leg-2',
        mode: 'bus',
        lineName: 'Bus 42',
        lineColor: '#3b82f6',
        fromStation: 'Metro Center Station',
        toStation: 'University Hospital',
        departureTime: '08:02',
        arrivalTime: '08:35',
        durationMinutes: 33,
      }
    ]
  }
];

// Disruption simulation scenarios for the "What-If" simulator
export const DISRUPTION_SCENARIOS = [
  { id: 'on-time', label: 'On Schedule (Baseline)', trainDelay: 0, walkDelay: 0, busAdvance: 0, description: 'All legs and transfers operate on scheduled time.' },
  { id: 'train-late-5', label: 'First train arrives 5 mins late', trainDelay: 5, walkDelay: 0, busAdvance: 0, description: 'Red Line delayed 5 min in tunnel due to congestion.' },
  { id: 'walk-late-3', label: 'Walking takes 3 mins longer', trainDelay: 0, walkDelay: 3, busAdvance: 0, description: 'Crowded escalators or elevator wait slows walking transfer.' },
  { id: 'bus-early-4', label: 'Bus departs 4 mins early', trainDelay: 0, walkDelay: 0, busAdvance: 4, description: 'Bus 42 departs earlier than scheduled timetable.' },
];
