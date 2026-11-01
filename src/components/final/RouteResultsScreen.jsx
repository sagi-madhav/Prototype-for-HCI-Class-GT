import React, { useState } from 'react';
import { 
  ChevronLeft, 
  SlidersHorizontal, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Train, 
  Bus, 
  Footprints, 
  Check, 
  RotateCcw,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { calculateRouteMetrics } from '../../lib/routeCalculator';
import { validateRoute } from '../../lib/routeValidation';
import { minutesToTimeString12 } from '../../lib/time';

export default function RouteResultsScreen({
  routes,
  preferences,
  onSelectRoute,
  onBackToPlan,
  onOpenPreferencesSheet,
  onCompareRoutes,
}) {
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'earliest-arrival' | 'cushion'

  // Calculate metrics and validation for all routes
  const evaluatedRoutes = routes.map((route) => {
    const metrics = calculateRouteMetrics(route, preferences);
    const validation = validateRoute(metrics, preferences);
    return {
      ...route,
      metrics,
      validation,
    };
  });

  // Sort logic
  const sortedRoutes = [...evaluatedRoutes].sort((a, b) => {
    if (sortBy === 'cushion') {
      return b.metrics.usableCushion - a.metrics.usableCushion;
    }
    if (sortBy === 'earliest-arrival') {
      return a.metrics.finalArrivalMinutes - b.metrics.finalArrivalMinutes;
    }
    // Default 'recommended': qualifying first, then best balance
    if (a.validation.qualifies && !b.validation.qualifies) return -1;
    if (!a.validation.qualifies && b.validation.qualifies) return 1;
    return a.metrics.finalArrivalMinutes - b.metrics.finalArrivalMinutes;
  });

  const qualifyingRoutes = sortedRoutes.filter(r => r.validation.qualifies);
  const nonQualifyingRoutes = sortedRoutes.filter(r => !r.validation.qualifies);

  const toggleCompare = (routeId, e) => {
    e.stopPropagation();
    setSelectedForCompare(prev => {
      if (prev.includes(routeId)) {
        return prev.filter(id => id !== routeId);
      }
      if (prev.length >= 2) {
        return [prev[1], routeId]; // Keep max 2
      }
      return [...prev, routeId];
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] text-slate-900 font-sans p-4 pt-1 justify-between select-none">
      
      {/* Top Bar Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onBackToPlan}
            className="flex items-center space-x-1 text-[13px] font-bold text-slate-700 hover:text-blue-600 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            <span>Edit search</span>
          </button>
          
          <div className="flex items-center space-x-1.5">
            {selectedForCompare.length === 2 && (
              <button
                type="button"
                onClick={() => onCompareRoutes(selectedForCompare)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse flex items-center space-x-1"
              >
                <span>Compare (2)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenPreferencesSheet}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              title="Filter and preferences"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pinned Constraints Summary Chip */}
        <div className="bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-xs mb-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">
              {minutesToTimeString12(preferences.earliestDeparture ? preferences.earliestDeparture.split(':').reduce((h, m) => h * 60 + Number(m), 0) : 440)}
              {' – '}
              {minutesToTimeString12(preferences.latestArrival ? preferences.latestArrival.split(':').reduce((h, m) => h * 60 + Number(m), 0) : 525)}
            </span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="font-bold text-blue-600">
              ≥{preferences.minimumUsableCushionMinutes}m cushion
            </span>
            {preferences.walkingPace !== 'standard' && (
              <span className="ml-1 text-slate-400">({preferences.walkingPace})</span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-semibold">
            <span>{qualifyingRoutes.length} available</span>
          </div>
        </div>
      </div>

      {/* Main Scrollable Results Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-3">
        
        {/* Empty State when no routes qualify */}
        {qualifyingRoutes.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center my-2">
            <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
            <h3 className="font-bold text-[14px] text-amber-900 mb-1">
              No trips match every preference
            </h3>
            <p className="text-[12px] text-amber-800 leading-snug mb-3">
              Your requested {preferences.minimumUsableCushionMinutes}-minute transfer cushion exceeds available sample connections.
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={onOpenPreferencesSheet}
                className="w-full py-1.5 px-3 bg-white border border-amber-300 rounded-xl text-amber-900 font-bold text-[11px] hover:bg-amber-100 transition-colors"
              >
                Lower minimum cushion to 8 mins
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Recommended Qualifying Routes */}
        {qualifyingRoutes.length > 0 && (
          <div>
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1.5 px-1 flex items-center justify-between">
              <span>RECOMMENDED OPTIONS</span>
              <span className="text-emerald-600 font-bold flex items-center space-x-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>MEETS CONSTRAINTS</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {qualifyingRoutes.map((route, idx) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isPrimaryRecommended={idx === 0}
                  isSelectedForCompare={selectedForCompare.includes(route.id)}
                  onToggleCompare={(e) => toggleCompare(route.id, e)}
                  onSelect={() => onSelectRoute(route.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Non-Qualifying / Tight Connections */}
        {!preferences.hideNonQualifying && nonQualifyingRoutes.length > 0 && (
          <div className="pt-2">
            <div className="text-[10px] font-black tracking-wider uppercase text-amber-600 mb-1.5 px-1 flex items-center justify-between">
              <span>DOESN'T MEET PREFERENCES</span>
              <span className="text-[10px] text-slate-400">Connection at risk</span>
            </div>

            <div className="space-y-2.5">
              {nonQualifyingRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isNonQualifying={true}
                  isSelectedForCompare={selectedForCompare.includes(route.id)}
                  onToggleCompare={(e) => toggleCompare(route.id, e)}
                  onSelect={() => onSelectRoute(route.id)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Info Note */}
      <div className="pt-1 text-center">
        <span className="text-[10px] text-slate-400">
          Tap any card to inspect leg-by-leg timeline & connection safety math.
        </span>
      </div>

    </div>
  );
}

// Individual Route Card Component
function RouteCard({
  route,
  isPrimaryRecommended = false,
  isNonQualifying = false,
  isSelectedForCompare = false,
  onToggleCompare,
  onSelect,
}) {
  const { metrics, validation } = route;

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs relative ${
        isPrimaryRecommended
          ? 'bg-[#f4f7ff] border-blue-300 ring-2 ring-blue-100 hover:border-blue-500'
          : isNonQualifying
            ? 'bg-white border-amber-200/90 hover:border-amber-400 opacity-95'
            : 'bg-white border-slate-200/90 hover:border-blue-400'
      }`}
    >
      {/* Top Row: Times & Duration */}
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-baseline space-x-2">
          <span className="text-[18px] font-black text-slate-900 tracking-tight font-mono">
            {metrics.firstDepartureTime}
          </span>
          <span className="text-[13px] text-slate-400 font-medium">→</span>
          <span className="text-[18px] font-black text-slate-900 tracking-tight font-mono">
            {metrics.finalArrivalTime}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[12px] font-bold text-slate-700 font-mono">
            {metrics.totalDurationMinutes} min
          </span>
          <span className="text-[10px] text-slate-400 block -mt-0.5">
            {metrics.deadlineMarginMinutes}m before deadline
          </span>
        </div>
      </div>

      {/* Transit Modes Line Chips */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-[11px] font-bold">
          <Train className="w-3 h-3" />
          <span>Red Line</span>
        </div>
        <span className="text-slate-300 text-xs">→</span>
        <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-[11px] font-bold">
          <Bus className="w-3 h-3" />
          <span>Bus 42</span>
        </div>

        {/* Compare Checkbox Trigger */}
        <button
          type="button"
          onClick={onToggleCompare}
          className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
            isSelectedForCompare
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {isSelectedForCompare ? '✓ Selected' : '+ Compare'}
        </button>
      </div>

      {/* Usable Transfer Cushion Highlight Box */}
      <div className={`p-2 rounded-xl mb-2 flex items-center justify-between text-[11px] ${
        validation.qualifies
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          : 'bg-amber-50 border border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center space-x-1.5 font-bold">
          {validation.qualifies ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          )}
          <span>
            {metrics.usableCushion} min usable cushion
          </span>
        </div>

        <span className="text-[10px] opacity-80">
          {validation.qualifies ? 'Safe transfer' : 'Below 8m minimum'}
        </span>
      </div>

      {/* Transfer Math Explanation Row */}
      <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-1 border-t border-slate-100">
        <span>
          {metrics.scheduledConnectionGap}m gap − {metrics.estimatedWalk}m walk = <strong className={validation.qualifies ? 'text-slate-800' : 'text-amber-700'}>{metrics.usableCushion}m</strong>
        </span>
        <span className="text-blue-600 font-bold text-[11px] flex items-center space-x-0.5">
          <span>Details</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
