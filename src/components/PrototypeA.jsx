import React, { useState } from 'react';
import { Navigation, MapPin, Bus, Train, User, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

export default function PrototypeA({ onConfirmRoute, onLogError }) {
  // Slider state in minutes from midnight:
  // 06:00 = 360, 07:00 = 420, 07:20 = 440, 08:00 = 480, 08:45 = 525, 09:00 = 540
  const [earliestDepMins, setEarliestDepMins] = useState(440); // 07:20 AM
  const [latestArrMins, setLatestArrMins] = useState(525);   // 08:45 AM
  const [selectedRoute, setSelectedRoute] = useState('option-1');
  const [opt1Buffer, setOpt1Buffer] = useState(15); // 15 mins default as in screenshot

  // Helper to format minutes into hh:mm AM/PM
  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Convert minutes (360 - 540, representing 06:00 to 09:00) to percentage (0% to 100%)
  const minRange = 360; // 06:00 AM
  const maxRange = 540; // 09:00 AM
  const getPercent = (val) => Math.max(0, Math.min(100, ((val - minRange) / (maxRange - minRange)) * 100));

  const leftPercent = getPercent(earliestDepMins);
  const rightPercent = getPercent(latestArrMins);

  const handleConfirm = () => {
    if (selectedRoute === 'option-2') {
      onLogError('Selected Option 2 which violates the minimum 8-minute buffer constraint (it has only a 3-minute high-risk cushion).');
      return;
    }

    // Option 1 validation:
    // Dep: 07:25 AM (445 mins), Arr: 08:25 AM (505 mins)
    if (earliestDepMins > 445) {
      onLogError(`Selected route departs at 07:25 AM, which is earlier than your configured earliest departure (${formatTime(earliestDepMins)}).`);
      return;
    }
    if (latestArrMins < 505) {
      onLogError(`Selected route arrives at 08:25 AM, which is later than your configured latest arrival (${formatTime(latestArrMins)}).`);
      return;
    }

    if (opt1Buffer < 8) {
      onLogError(`Transfer buffer is configured to ${opt1Buffer}m, which is below the safe 8-minute threshold.`);
      return;
    }

    onConfirmRoute({
      prototypeId: 'A',
      routeName: 'Option 1 - Express Route',
      departure: '07:25 AM',
      arrival: '08:25 AM',
      bufferMinutes: opt1Buffer,
      isValid: true
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f9fafb] text-slate-800 font-sans p-4 pt-1">
      {/* Centered Top Title */}
      <h1 className="text-center font-bold text-[18px] text-gray-900 mb-3 tracking-tight">
        Plan a Journey
      </h1>

      {/* Origin & Destination Card */}
      <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-sm mb-4 relative">
        <div className="flex items-center space-x-3 mb-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Navigation className="w-3.5 h-3.5 text-blue-600 fill-blue-600 rotate-45" />
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[14px] font-medium text-gray-700 shadow-inner">
            My Current Location
          </div>
        </div>

        {/* Dotted connecting line */}
        <div className="absolute left-[26px] top-[34px] w-[1px] h-[18px] border-l-2 border-dotted border-gray-300 pointer-events-none" />

        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[14px] font-medium text-gray-700 shadow-inner">
            789 Broadway, New York
          </div>
        </div>
      </div>

      {/* Section: Dual-Anchor Schedule */}
      <div className="mb-4">
        <h2 className="font-bold text-[16px] text-gray-900 mb-2">
          Dual-Anchor Schedule
        </h2>

        {/* Callout Badges Floating above Track */}
        <div className="relative h-[48px] mb-1">
          {/* Left Callout Badge */}
          <div 
            className="absolute -translate-x-1/2 top-0 bg-white border border-gray-200/90 shadow-md rounded-xl px-2.5 py-1 text-center cursor-pointer transition-all hover:scale-105 active:scale-95"
            style={{ left: `${Math.max(22, Math.min(leftPercent, 45))}%` }}
            onClick={() => setEarliestDepMins(440)}
            title="Earliest Departure constraint"
          >
            <div className="text-[11px] font-medium text-gray-600 leading-tight">Earliest Departure</div>
            <div className="text-[12px] font-bold text-gray-900 flex items-center justify-center space-x-0.5">
              <span>({formatTime(earliestDepMins)})</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          {/* Right Callout Badge */}
          <div 
            className="absolute -translate-x-1/2 top-0 bg-white border border-gray-200/90 shadow-md rounded-xl px-2.5 py-1 text-center cursor-pointer transition-all hover:scale-105 active:scale-95"
            style={{ left: `${Math.max(55, Math.min(rightPercent, 78))}%` }}
            onClick={() => setLatestArrMins(525)}
            title="Latest Arrival constraint"
          >
            <div className="text-[11px] font-medium text-gray-600 leading-tight flex items-center justify-center space-x-0.5">
              <ChevronLeft className="w-3 h-3 text-gray-400" />
              <span>Latest Arrival</span>
            </div>
            <div className="text-[12px] font-bold text-gray-900">
              ({formatTime(latestArrMins)})
            </div>
          </div>
        </div>

        {/* Dual-Thumb Slider Track */}
        <div className="relative pt-2 pb-6 px-3 bg-gray-50 rounded-2xl border border-gray-200/60">
          <div className="relative w-full h-[18px] bg-gray-200 rounded-md overflow-visible flex items-center">
            {/* Active Range Fill (Bright Sky Blue) */}
            <div 
              className="absolute h-full bg-[#38bdf8] transition-all"
              style={{
                left: `${leftPercent}%`,
                width: `${Math.max(0, rightPercent - leftPercent)}%`
              }}
            />

            {/* Left Handle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[22px] h-[34px] bg-white rounded-lg shadow-md border border-gray-300 flex items-center justify-center cursor-ew-resize z-20 hover:scale-105"
              style={{ left: `${leftPercent}%` }}
              title="Drag or click to adjust earliest departure"
            >
              <span className="text-[12px] font-bold text-gray-700">&gt;</span>
            </div>

            {/* Right Handle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[22px] h-[34px] bg-white rounded-lg shadow-md border border-gray-300 flex items-center justify-center cursor-ew-resize z-20 hover:scale-105"
              style={{ left: `${rightPercent}%` }}
              title="Drag or click to adjust latest arrival"
            >
              <span className="text-[12px] font-bold text-gray-700">&lt;</span>
            </div>
          </div>

          {/* Time markers beneath track */}
          <div className="relative w-full flex justify-between text-[11px] font-semibold text-gray-500 pt-2">
            <span className="relative before:content-[''] before:absolute before:-top-2 before:left-1/2 before:w-[1px] before:h-1.5 before:bg-gray-400">06:00</span>
            <span className="relative before:content-[''] before:absolute before:-top-2 before:left-1/2 before:w-[1px] before:h-1.5 before:bg-gray-400">07:00</span>
            <span className="relative before:content-[''] before:absolute before:-top-2 before:left-1/2 before:w-[1px] before:h-1.5 before:bg-gray-400">08:00</span>
            <span className="relative before:content-[''] before:absolute before:-top-2 before:left-1/2 before:w-[1px] before:h-1.5 before:bg-gray-400">09:00</span>
          </div>

          {/* Quick Stepper adjustment controls for accessibility */}
          <div className="flex justify-between items-center text-[11px] text-gray-500 pt-2 border-t border-gray-200 mt-2">
            <div className="flex items-center space-x-1">
              <span>Dep:</span>
              <button 
                onClick={() => setEarliestDepMins(m => Math.max(minRange, m - 5))}
                className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-bold"
              >-</button>
              <span className="font-semibold text-gray-800">{formatTime(earliestDepMins)}</span>
              <button 
                onClick={() => setEarliestDepMins(m => Math.min(latestArrMins - 30, m + 5))}
                className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-bold"
              >+</button>
            </div>
            <div className="flex items-center space-x-1">
              <span>Arr:</span>
              <button 
                onClick={() => setLatestArrMins(m => Math.max(earliestDepMins + 30, m - 5))}
                className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-bold"
              >-</button>
              <span className="font-semibold text-gray-800">{formatTime(latestArrMins)}</span>
              <button 
                onClick={() => setLatestArrMins(m => Math.min(maxRange, m + 5))}
                className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-bold"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Gantt-style itinerary */}
      <div className="flex-1 space-y-3 pb-2">
        <h2 className="font-bold text-[16px] text-gray-900">
          Gantt-style itinerary
        </h2>

        {/* Card 1: Option 1 - Express Route (Target Safe Route) */}
        <div 
          onClick={() => setSelectedRoute('option-1')}
          className={`bg-white rounded-2xl p-3 border-2 transition-all cursor-pointer shadow-sm ${
            selectedRoute === 'option-1' 
              ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[14px] text-gray-900">
              Option 1 - Express Route
            </span>
            <span className="text-[12px] font-semibold text-emerald-600">
              Comfortable ({opt1Buffer} mins)
            </span>
          </div>

          {/* Gantt Bar Visualization */}
          <div className="flex items-center space-x-1 bg-gray-100/70 p-1.5 rounded-xl mb-1.5">
            {/* Bus Node icon */}
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bus className="w-3 h-3 text-blue-600" />
            </div>

            {/* Segment 1: Bus */}
            <div className="flex-1 bg-[#2563eb] text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg text-center leading-tight shadow-sm">
              Bus (Line M15)
            </div>

            {/* Walk connector */}
            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />

            {/* Segment 2: Transfer Buffer (Safe) - Clickable to toggle buffer */}
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpt1Buffer(b => b === 8 ? 12 : b === 12 ? 15 : 8);
              }}
              title="Click to toggle transfer cushion: 8m / 12m / 15m"
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-[10px] font-bold py-1.5 px-2 rounded-lg text-center leading-tight shadow-sm flex flex-col items-center justify-center transition-colors"
            >
              <span>Transfer Buffer</span>
              <span className="text-[9px] opacity-90">(Safe {opt1Buffer}m ⚙️)</span>
            </button>

            {/* Segment 3: Subway */}
            <div className="flex-1 bg-[#9333ea] text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg text-center leading-tight shadow-sm">
              Subway (R train)
            </div>

            {/* Train Node icon */}
            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Train className="w-3 h-3 text-purple-600" />
            </div>
          </div>

          {/* Timestamps Row beneath bar */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium px-1">
            <span>07:25 AM</span>
            <span>07:45 AM</span>
            <span className="text-emerald-600 font-bold">{opt1Buffer} mins</span>
            <span>08:00 AM</span>
            <span>08:25 AM</span>
          </div>
        </div>

        {/* Card 2: Option 2 - Early Route (Trap High-Risk Route) */}
        <div 
          onClick={() => setSelectedRoute('option-2')}
          className={`bg-white rounded-2xl p-3 border-2 transition-all cursor-pointer shadow-sm ${
            selectedRoute === 'option-2' 
              ? 'border-red-500 ring-2 ring-red-100 shadow-md' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[14px] text-gray-900">
              Option 2 - Early Route
            </span>
            <span className="text-[11px] font-bold text-red-600 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span>Tight Connection Alert (3 mins)</span>
            </span>
          </div>

          {/* Gantt Bar Visualization */}
          <div className="flex items-center space-x-1 bg-gray-100/70 p-1.5 rounded-xl mb-1.5">
            {/* Segment 1: Subway */}
            <div className="flex-[2] bg-[#f59e0b] text-gray-900 text-[11px] font-bold py-1.5 px-2 rounded-lg text-center leading-tight shadow-sm">
              Subway (N train)
            </div>

            {/* Segment 2: Red Warning Buffer (3m) */}
            <div className="bg-[#ef4444] text-white text-[10px] font-black py-1.5 px-2 rounded-lg flex items-center space-x-0.5 shadow-sm">
              <AlertTriangle className="w-3 h-3" />
              <span>3m</span>
            </div>

            {/* Walk connector */}
            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />

            {/* Segment 3: Bus */}
            <div className="flex-1 bg-[#2563eb] text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 shadow-sm">
              <Bus className="w-3 h-3 text-white" />
              <span>Bus</span>
            </div>
          </div>

          {/* Timestamps Row beneath bar */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium px-1">
            <span>07:30 AM</span>
            <span>08:10 AM</span>
            <span className="text-red-500 font-bold">08:13 AM</span>
            <span>08:35 AM</span>
          </div>
        </div>

        {/* Selected Route Action Banner */}
        <div className="pt-2">
          <button 
            type="button"
            onClick={handleConfirm}
            className={`w-full py-3 px-4 rounded-xl font-bold text-[14px] text-white shadow-md transition-all flex items-center justify-center space-x-2 ${
              selectedRoute === 'option-2' 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm Selected Route ({selectedRoute === 'option-1' ? 'Option 1' : 'Option 2'})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
