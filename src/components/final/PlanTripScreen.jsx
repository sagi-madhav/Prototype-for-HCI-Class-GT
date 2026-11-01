import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Clock, 
  SlidersHorizontal, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { DEMO_LOCATIONS } from '../../data/finalDemoData';
import { timeStringToMinutes, minutesToTimeString12, minutesToTimeString24 } from '../../lib/time';

export default function PlanTripScreen({
  preferences,
  onChangePreferences,
  onOpenPreferencesSheet,
  onFindRoutes,
}) {
  const [validationError, setValidationError] = useState(null);

  const earliestMins = timeStringToMinutes(preferences.earliestDeparture);
  const latestMins = timeStringToMinutes(preferences.latestArrival);

  // Quick 5-minute stepper adjustments
  const stepTime = (field, deltaMinutes) => {
    const currentMins = timeStringToMinutes(preferences[field]);
    const newMins = Math.max(0, Math.min(1435, currentMins + deltaMinutes));
    const newStr = minutesToTimeString24(newMins);
    onChangePreferences({ [field]: newStr });
    setValidationError(null);
  };

  const handleSwap = () => {
    onChangePreferences({
      origin: preferences.destination,
      destination: preferences.origin,
    });
  };

  const handleProceed = () => {
    if (earliestMins >= latestMins) {
      setValidationError('Arrive by time must be later than Leave after time.');
      return;
    }
    if (preferences.origin === preferences.destination) {
      setValidationError('Origin and destination cannot be identical.');
      return;
    }
    setValidationError(null);
    onFindRoutes();
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] text-slate-900 font-sans p-4 pt-1 justify-between select-none">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            TransferWise
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Sample Schedule Demo
          </span>
        </div>
        <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-tight">
          Plan your trip
        </h1>
        <p className="text-[12px] text-slate-500 mb-3">
          Find connections with protected, realistic transfer buffers.
        </p>

        {/* Origin & Destination Card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm relative mb-3">
          <div className="flex items-center space-x-2.5">
            {/* Left Connector Icons */}
            <div className="flex flex-col items-center justify-center space-y-1 py-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Navigation className="w-3.5 h-3.5 text-blue-600 fill-blue-600 rotate-45" />
              </div>
              <div className="w-[1px] h-6 border-l-2 border-dotted border-slate-300" />
              <div className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              </div>
            </div>

            {/* Inputs Container */}
            <div className="flex-1 space-y-2">
              <div className="relative">
                <select
                  value={preferences.origin}
                  onChange={(e) => onChangePreferences({ origin: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {DEMO_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={preferences.destination}
                  onChange={(e) => onChangePreferences({ destination: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {DEMO_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
              title="Swap origin and destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section: Your Time Window */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm mb-3">
          <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>YOUR TIME WINDOW</span>
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">Dual Anchor</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Leave After Control */}
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-500 block">Leave after</span>
              <div className="flex items-center justify-between mt-0.5">
                <button
                  type="button"
                  onClick={() => stepTime('earliestDeparture', -5)}
                  className="w-6 h-6 rounded bg-white shadow-xs font-bold text-slate-700 text-xs flex items-center justify-center hover:bg-slate-100"
                >
                  −
                </button>
                <span className="font-bold text-[13px] text-slate-900">
                  {minutesToTimeString12(earliestMins)}
                </span>
                <button
                  type="button"
                  onClick={() => stepTime('earliestDeparture', 5)}
                  className="w-6 h-6 rounded bg-white shadow-xs font-bold text-slate-700 text-xs flex items-center justify-center hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Arrive By Control */}
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-500 block">Arrive by</span>
              <div className="flex items-center justify-between mt-0.5">
                <button
                  type="button"
                  onClick={() => stepTime('latestArrival', -5)}
                  className="w-6 h-6 rounded bg-white shadow-xs font-bold text-slate-700 text-xs flex items-center justify-center hover:bg-slate-100"
                >
                  −
                </button>
                <span className="font-bold text-[13px] text-slate-900">
                  {minutesToTimeString12(latestMins)}
                </span>
                <button
                  type="button"
                  onClick={() => stepTime('latestArrival', 5)}
                  className="w-6 h-6 rounded bg-white shadow-xs font-bold text-slate-700 text-xs flex items-center justify-center hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Minimum Transfer Cushion */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>MINIMUM TRANSFER CUSHION</span>
            </span>
            <button
              type="button"
              onClick={onOpenPreferencesSheet}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              Customize ›
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">
            Target safety cushion left after walking between platforms.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { mins: 3, label: 'Tight', desc: 'Fast connection' },
              { mins: 8, label: 'Comfortable', desc: 'Recommended', isTarget: true },
              { mins: 15, label: 'Extra time', desc: 'Relaxed' },
            ].map((preset) => {
              const isSelected = preferences.minimumUsableCushionMinutes === preset.mins;
              return (
                <button
                  key={preset.mins}
                  type="button"
                  onClick={() => onChangePreferences({ minimumUsableCushionMinutes: preset.mins })}
                  className={`rounded-xl py-2 px-1 text-center transition-all border flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-100'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <span className="text-[13px] font-black">{preset.mins} min</span>
                  <span className={`text-[9px] font-semibold leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Walking Pace & Advanced Preferences row */}
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-sm mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[12px] font-bold text-slate-800">
                Pace: <span className="capitalize text-blue-600">{preferences.walkingPace}</span>
                {preferences.heavyItems && <span className="text-amber-600 text-[10px] ml-1 font-semibold">(Heavy bags)</span>}
              </div>
              <div className="text-[10px] text-slate-400">
                Affects estimated transfer walk
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPreferencesSheet}
            className="flex items-center space-x-0.5 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-100 px-2 py-1 rounded-lg transition-colors"
          >
            <span>Edit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-[11px] mb-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-[15px] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <span>Find routes</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-1.5">
          We'll evaluate walking times and safety margins at every transfer.
        </p>
      </div>

    </div>
  );
}
