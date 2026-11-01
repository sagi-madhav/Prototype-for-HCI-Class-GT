import React, { useState } from 'react';
import { MapPin, Train, Bus, AlertTriangle, Check, Moon, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PrototypeB({ onConfirmRoute, onLogError }) {
  // Cushion presets: 3, 8, 15
  const [selectedCushion, setSelectedCushion] = useState(8);

  // Dynamic schedules based on cushion selection
  const scheduleData = {
    3: {
      leg2Time: '07:47 AM – 08:17 AM',
      totalTime: '47 mins',
      arrival: '08:17 AM',
      protectedTransfer: '3 mins at Metro Center',
      isSafe: false
    },
    8: {
      leg2Time: '07:52 AM – 08:22 AM',
      totalTime: '52 mins',
      arrival: '08:22 AM',
      protectedTransfer: '9 mins at Metro Center',
      isSafe: true
    },
    15: {
      leg2Time: '08:00 AM – 08:30 AM',
      totalTime: '60 mins',
      arrival: '08:30 AM',
      protectedTransfer: '16 mins at Metro Center',
      isSafe: true
    }
  };

  const activeSchedule = scheduleData[selectedCushion];

  const handleGenerate = () => {
    if (selectedCushion === 3) {
      onLogError('Configured +3 min (Tight) buffer which fails the requirement of at least an 8-minute safe transfer buffer.');
      return;
    }

    onConfirmRoute({
      prototypeId: 'B',
      routeName: 'Buffer-Protected Multi-Leg Route',
      departure: '07:30 AM',
      arrival: activeSchedule.arrival,
      bufferMinutes: selectedCushion,
      isValid: true
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] text-slate-800 font-sans p-4 pt-1 justify-between">
      {/* Top Header matching screenshot */}
      <div className="text-center mb-3">
        <h1 className="text-[17px] font-bold text-gray-900 tracking-tight leading-tight">
          Trip Builder: Prototype B
        </h1>
        <p className="text-[13px] font-medium text-gray-500">
          Modular Buffer-First
        </p>
      </div>

      {/* Main Spine Timeline Area */}
      <div className="relative flex-1 px-1 my-auto">
        {/* Continuous Vertical Spine Line */}
        <div className="absolute left-[36px] top-[28px] bottom-[28px] w-[2px] bg-gray-200 pointer-events-none" />

        {/* 1. Origin Card */}
        <div className="relative z-10 bg-white border border-gray-200/90 rounded-2xl p-3 shadow-sm flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-gray-500" />
          </div>
          <span className="font-semibold text-[14px] text-gray-800">
            100 Main Street
          </span>
        </div>

        {/* 2. Leg 1 Node (Rail Leg) */}
        <div className="relative z-10 flex items-center space-x-4 pl-4 mb-4">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-sm flex-shrink-0">
            <Train className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <div className="font-semibold text-[13px] text-gray-800">
              Rail Leg (Line Red)
            </div>
            <div className="text-[12px] text-gray-500 font-medium">
              07:30 AM – 07:44 AM
            </div>
          </div>
        </div>

        {/* 3. Central Elevated Card: Transfer Hub Node */}
        <div className="relative z-10 bg-white border border-gray-200 rounded-2xl p-3.5 shadow-lg mb-4 ring-1 ring-black/5">
          {/* Hub Header */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
              <Train className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <span className="font-bold text-[14px] text-gray-900">
              Metro Center Station
            </span>
          </div>

          {/* Subheader */}
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">
            CONNECTION CUSHION
          </div>

          {/* 3 Interactive Cushion Preset Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {/* Button 1: +3 min (Tight) */}
            <button
              type="button"
              onClick={() => setSelectedCushion(3)}
              className={`relative rounded-xl p-2 text-center transition-all border flex flex-col items-center justify-center ${
                selectedCushion === 3
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 absolute top-1.5 right-1.5 ${selectedCushion === 3 ? 'text-white' : 'text-amber-500'}`} />
              <span className="text-[13px] font-bold">+3 min</span>
              <span className="text-[10px] opacity-90 font-medium">(Tight)</span>
            </button>

            {/* Button 2: +8 min (Safe) - Target Recommended */}
            <button
              type="button"
              onClick={() => setSelectedCushion(8)}
              className={`relative rounded-xl p-2 text-center transition-all border flex flex-col items-center justify-center ${
                selectedCushion === 8
                  ? 'bg-[#1d63ff] text-white border-[#174ec7] shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full absolute top-1.5 right-1.5 flex items-center justify-center ${selectedCushion === 8 ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[13px] font-bold">+8 min</span>
              <span className="text-[10px] opacity-90 font-medium">(Safe)</span>
            </button>

            {/* Button 3: +15 min (Relaxed) */}
            <button
              type="button"
              onClick={() => setSelectedCushion(15)}
              className={`relative rounded-xl p-2 text-center transition-all border flex flex-col items-center justify-center ${
                selectedCushion === 15
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <Moon className={`w-3.5 h-3.5 absolute top-1.5 right-1.5 ${selectedCushion === 15 ? 'text-white' : 'text-gray-400'}`} />
              <span className="text-[13px] font-bold">+15 min</span>
              <span className="text-[10px] opacity-90 font-medium">(Relaxed)</span>
            </button>
          </div>

          {/* Recommended caption underneath */}
          <div className="text-center mt-2">
            <span className={`text-[10px] font-extrabold tracking-wider ${selectedCushion === 8 ? 'text-blue-600' : 'text-gray-400'}`}>
              RECOMMENDED
            </span>
          </div>
        </div>

        {/* 4. Leg 2 Node (Bus Leg) */}
        <div className="relative z-10 flex items-center space-x-4 pl-4 mb-4">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-sm flex-shrink-0">
            <Bus className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <div className="font-semibold text-[13px] text-gray-800">
              Bus Leg (Line 42)
            </div>
            <div className="text-[12px] text-gray-600 font-medium transition-all">
              {activeSchedule.leg2Time}
            </div>
          </div>
        </div>

        {/* 5. Destination Card */}
        <div className="relative z-10 bg-white border border-gray-200/90 rounded-2xl p-3 shadow-sm flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-gray-500" />
          </div>
          <span className="font-semibold text-[14px] text-gray-800">
            University Hospital
          </span>
        </div>
      </div>

      {/* Sticky Bottom Summary & Action Sheet matching prototype2.png */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-3.5 mt-2">
        <div className="grid grid-cols-2 text-[12px] text-gray-600 mb-1">
          <div>
            <span className="text-gray-500">Total Time: </span>
            <span className="font-bold text-gray-800">{activeSchedule.totalTime}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500">Departure: </span>
            <span className="font-bold text-gray-800">07:30 AM</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[12px] text-gray-600 mb-1.5">
          <span className="text-gray-500">Arrival:</span>
          <span className="font-bold text-gray-800">{activeSchedule.arrival}</span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] pb-3 border-b border-gray-100 mb-3">
          <span className="text-gray-500">Protected Transfer:</span>
          <span className={`font-semibold flex items-center space-x-1 ${selectedCushion === 3 ? 'text-red-500' : 'text-gray-800'}`}>
            <span>{activeSchedule.protectedTransfer}</span>
            {selectedCushion === 3 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline ml-1" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline ml-1" />
            )}
          </span>
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={handleGenerate}
          className={`w-full py-3 px-4 rounded-full font-bold text-[14px] text-white shadow-md transition-all flex items-center justify-center space-x-2 ${
            selectedCushion === 3
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-[#1848cc] hover:bg-[#1239a5]'
          }`}
        >
          <span>Generate Buffer-Protected Routes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
