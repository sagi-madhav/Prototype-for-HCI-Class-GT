import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Train, 
  Bus, 
  Footprints, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  Shuffle, 
  ChevronDown,
  Info
} from 'lucide-react';
import { calculateRouteMetrics } from '../../lib/routeCalculator';
import { validateRoute } from '../../lib/routeValidation';
import { DISRUPTION_SCENARIOS } from '../../data/finalDemoData';
import { minutesToTimeString12 } from '../../lib/time';

export default function RouteDetailsScreen({
  route,
  preferences,
  onBackToResults,
  onConfirmRoute,
  onOpenPreferencesSheet,
}) {
  const [showGanttTimeline, setShowGanttTimeline] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState('on-time');

  const activeScenario = DISRUPTION_SCENARIOS.find(s => s.id === activeScenarioId) || DISRUPTION_SCENARIOS[0];

  // Recalculate metrics based on current active disruption scenario
  const metrics = calculateRouteMetrics(route, preferences, activeScenario);
  const validation = validateRoute(metrics, preferences);

  const leg1 = route.legs[0];
  const transfer = route.legs[1];
  const leg2 = route.legs[2];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] text-slate-900 font-sans p-4 pt-1 justify-between select-none">
      
      {/* Top Bar Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onBackToResults}
            className="flex items-center space-x-1 text-[13px] font-bold text-slate-700 hover:text-blue-600 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            <span>All routes</span>
          </button>
          
          <span className="text-[11px] font-bold text-slate-500">
            Route Details
          </span>
        </div>

        {/* Route Times Banner */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs mb-3">
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="text-[20px] font-black text-slate-900 font-mono tracking-tight">
              {metrics.firstDepartureTime} → {metrics.finalArrivalTime}
            </h2>
            <span className="text-[12px] font-bold text-slate-600 font-mono">
              {metrics.totalDurationMinutes} mins
            </span>
          </div>

          {/* Validation Tag Badge */}
          <div className="flex items-center space-x-1.5 text-[11px]">
            {validation.qualifies ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Meets your trip preferences</span>
              </span>
            ) : (
              <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Transfer buffer below minimum preference</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Scrollable Timeline Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-3">
        
        {/* Vertical Journey Timeline (Spine Architecture) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative">
          <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-3">
            JOURNEY TIMELINE
          </div>

          {/* Continuous Vertical Spine line */}
          <div className="absolute left-[31px] top-[46px] bottom-[38px] w-[2px] bg-slate-200" />

          {/* Step 1: Origin & Boarding Leg 1 */}
          <div className="relative z-10 flex items-start space-x-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Train className="w-3.5 h-3.5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-[13px] text-slate-900">
                  {leg1.departureTime}
                </span>
                <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  Red Line
                </span>
              </div>
              <p className="text-[12px] font-medium text-slate-700">
                Board at {leg1.fromStation}
              </p>
              <p className="text-[10px] text-slate-400">
                Ride 14 mins ({leg1.toStation})
              </p>
            </div>
          </div>

          {/* Step 2: Arrival at Transfer Hub */}
          <div className="relative z-10 flex items-start space-x-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center flex-shrink-0 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-[13px] text-slate-900">
                  {leg1.arrivalTime}
                </span>
                <span className="text-[10px] text-slate-400">Arrival</span>
              </div>
              <p className="text-[12px] font-bold text-slate-800">
                {transfer.stationName}
              </p>
              <p className="text-[10px] text-slate-500">
                Alight at {transfer.fromPlatform}
              </p>
            </div>
          </div>

          {/* Step 3: Walking Transfer Leg */}
          <div className="relative z-10 flex items-start space-x-3 my-3 pl-0.5">
            <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 ml-0.5">
              <Footprints className="w-3 h-3 text-amber-700" />
            </div>
            <div className="flex-1 bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-amber-900 flex items-center space-x-1">
                  <span>{metrics.estimatedWalk} min transfer walk</span>
                </span>
                <span className="text-[10px] text-amber-700 capitalize font-medium">
                  {preferences.walkingPace} pace
                </span>
              </div>
              <p className="text-[10px] text-amber-800/80 mt-0.5">
                Walk across concourse to {transfer.toPlatform}
              </p>
            </div>
          </div>

          {/* Step 4: Usable Transfer Cushion Highlight Box */}
          <div className="relative z-10 flex items-start space-x-3 my-3 pl-0.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-0.5 border ${
              validation.qualifies
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                : 'bg-red-100 border-red-400 text-red-700'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className={`flex-1 rounded-xl p-2.5 border ${
              validation.qualifies
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-black">
                  {metrics.usableCushion} min usable waiting cushion
                </span>
                <span className="text-[10px] font-bold">
                  {validation.qualifies ? 'Safe' : 'Tight'}
                </span>
              </div>
              <p className="text-[10px] opacity-80 mt-0.5">
                Time remaining on platform before boarding next vehicle.
              </p>
            </div>
          </div>

          {/* Step 5: Leg 2 Departure (Bus) */}
          <div className="relative z-10 flex items-start space-x-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Bus className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-[13px] text-slate-900">
                  {leg2.departureTime}
                </span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  Bus 42
                </span>
              </div>
              <p className="text-[12px] font-medium text-slate-700">
                Board {leg2.lineName} at {transfer.toPlatform}
              </p>
              <p className="text-[10px] text-slate-400">
                Ride 30 mins to {leg2.toStation}
              </p>
            </div>
          </div>

          {/* Step 6: Final Destination Arrival */}
          <div className="relative z-10 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-[13px] text-slate-900">
                  {metrics.finalArrivalTime}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Destination</span>
              </div>
              <p className="text-[12px] font-bold text-slate-800">
                {leg2.toStation}
              </p>
              <p className="text-[10px] text-slate-400">
                Arrives {metrics.deadlineMarginMinutes} mins before 08:45 AM deadline
              </p>
            </div>
          </div>

        </div>

        {/* Section: Why This Route Works (Math Breakdown) */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs">
          <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-2">
            CONNECTION SAFETY BREAKDOWN
          </div>

          <div className="space-y-1 text-[12px] font-mono text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex justify-between">
              <span>Scheduled vehicle gap:</span>
              <span className="font-bold">{metrics.scheduledConnectionGap} mins</span>
            </div>
            <div className="flex justify-between text-amber-700">
              <span>− Estimated transfer walk:</span>
              <span className="font-bold">−{metrics.estimatedWalk} mins</span>
            </div>
            {metrics.disruptionImpact > 0 && (
              <div className="flex justify-between text-red-600">
                <span>− Delay simulation impact:</span>
                <span className="font-bold">−{metrics.disruptionImpact} mins</span>
              </div>
            )}
            <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-[13px] text-slate-900">
              <span>= Usable safety cushion:</span>
              <span className={validation.qualifies ? 'text-emerald-600' : 'text-red-600'}>
                {metrics.usableCushion} mins
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 px-0.5">
            Your minimum required cushion is {validation.minCushionRequested} mins.
          </div>
        </div>

        {/* Interactive Feature Controls: Timeline Strip & Delay Simulator */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowGanttTimeline(prev => !prev)}
              className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{showGanttTimeline ? 'Hide visual Gantt bar' : 'See Gantt visual timeline'}</span>
            </button>
            <span className="text-[10px] text-slate-400">Prototype A feature</span>
          </div>

          {/* Prototype A Gantt Strip */}
          {showGanttTimeline && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 animate-in fade-in">
              <div className="flex items-center space-x-1 h-7 rounded-lg overflow-hidden text-[10px] font-bold text-white mb-1 shadow-inner">
                <div className="flex-1 bg-red-500 h-full flex items-center justify-center px-1 truncate">
                  Train (14m)
                </div>
                <div className="w-[18%] bg-amber-500 h-full flex items-center justify-center px-1 truncate text-slate-900">
                  Walk ({metrics.estimatedWalk}m)
                </div>
                <div className={`w-[22%] h-full flex items-center justify-center px-1 truncate ${
                  validation.qualifies ? 'bg-emerald-500' : 'bg-red-600'
                }`}>
                  Buffer ({metrics.usableCushion}m)
                </div>
                <div className="flex-[2] bg-blue-600 h-full flex items-center justify-center px-1 truncate">
                  Bus (30m)
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>07:30</span>
                <span>07:44</span>
                <span>07:58</span>
                <span>08:28</span>
              </div>
            </div>
          )}

          {/* What-If Disruption Simulator (Feature F10) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>What-If Delay Simulator</span>
              </span>
              <span className="text-[9px] text-slate-400">Interactive Demo</span>
            </div>

            <select
              value={activeScenarioId}
              onChange={(e) => setActiveScenarioId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-semibold rounded-xl p-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {DISRUPTION_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.label}
                </option>
              ))}
            </select>

            {activeScenario.id !== 'on-time' && (
              <p className="text-[10px] text-indigo-700 mt-1 italic">
                {activeScenario.description} Usable cushion shifts to {metrics.usableCushion} min.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Confirmation Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-md mt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
          <span>Arrive by {metrics.finalArrivalTime}</span>
          <span className="font-bold text-slate-800">
            {metrics.usableCushion} min cushion remaining
          </span>
        </div>

        <button
          type="button"
          onClick={() => onConfirmRoute(route, metrics, validation)}
          className={`w-full py-3 px-4 rounded-xl text-white font-extrabold text-[14px] shadow transition-all flex items-center justify-center space-x-1.5 ${
            validation.qualifies
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{validation.qualifies ? 'Use this route' : 'Choose route anyway'}</span>
        </button>
      </div>

    </div>
  );
}
