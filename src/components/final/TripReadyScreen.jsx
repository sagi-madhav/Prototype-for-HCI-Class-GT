import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Train, 
  Bus, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles,
  Share2
} from 'lucide-react';

export default function TripReadyScreen({
  confirmedData,
  onEditTrip,
  onStartNewTrip,
}) {
  const [copied, setCopied] = useState(false);

  const { route, metrics, validation, preferences } = confirmedData;

  const handleCopyItinerary = () => {
    const text = `🚇 TransferWise Itinerary Summary (Demo Schedule)
Origin: ${preferences.origin} (${metrics.firstDepartureTime})
Destination: ${preferences.destination} (${metrics.finalArrivalTime})
Total Journey: ${metrics.totalDurationMinutes} mins
Leg 1: Red Line (${metrics.firstDepartureTime} – 07:44)
Transfer: Metro Center Station (Walk: ${metrics.estimatedWalk} mins, Cushion: ${metrics.usableCushion} mins)
Leg 2: Bus 42 (07:58 – ${metrics.finalArrivalTime})
Status: ${validation.qualifies ? 'Meets all transfer preferences' : 'Tight connection selected'}
Sample Transit Prototype - CS 6750`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] text-slate-900 font-sans p-4 pt-1 justify-between select-none">
      
      {/* Top Success Badge */}
      <div className="text-center pt-2">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
          <CheckCircle className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-[20px] font-black text-slate-900 tracking-tight">
          Your route is ready
        </h1>
        <p className="text-[11px] text-slate-500">
          Demo itinerary based on evaluated sample schedules.
        </p>
      </div>

      {/* Main Itinerary Summary Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3.5 my-auto">
        {/* Times & Total Duration Header */}
        <div className="flex items-baseline justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CONFIRMED ITINERARY
            </div>
            <div className="text-[22px] font-black text-slate-900 font-mono">
              {metrics.firstDepartureTime} → {metrics.finalArrivalTime}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[12px] font-bold text-slate-700 font-mono">
              {metrics.totalDurationMinutes} mins total
            </span>
          </div>
        </div>

        {/* Transfer Cushion Feature Highlight */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-emerald-950">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-[13px] font-black leading-tight">
                {metrics.usableCushion} min usable transfer cushion
              </div>
              <div className="text-[10px] text-emerald-700">
                Guaranteed time on platform after {metrics.estimatedWalk} min walk
              </div>
            </div>
          </div>
        </div>

        {/* Journey Legs Breakdown */}
        <div className="space-y-2 text-[12px] text-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-red-100 text-red-600 flex items-center justify-center">
              <Train className="w-3 h-3" />
            </div>
            <span><strong>Red Line:</strong> {metrics.firstDepartureTime} from {preferences.origin}</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-500 text-[11px] pl-2 border-l-2 border-slate-200 ml-2.5">
            <span>Transfer at Metro Center ({metrics.estimatedWalk} min walk, {metrics.usableCushion} min buffer)</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bus className="w-3 h-3" />
            </div>
            <span><strong>Bus 42:</strong> 07:58 to {preferences.destination}</span>
          </div>
        </div>

        {/* Origin / Destination Details */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Arrival deadline: <strong>{preferences.latestArrival}</strong></span>
          <span className="text-emerald-700 font-semibold">{metrics.deadlineMarginMinutes}m early</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={handleCopyItinerary}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-[13px] shadow transition-all flex items-center justify-center space-x-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Itinerary copied!' : 'Copy itinerary'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEditTrip}
            className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-[12px] transition-colors"
          >
            Edit this trip
          </button>
          <button
            type="button"
            onClick={onStartNewTrip}
            className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-[12px] transition-colors flex items-center justify-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start over</span>
          </button>
        </div>
      </div>

    </div>
  );
}
