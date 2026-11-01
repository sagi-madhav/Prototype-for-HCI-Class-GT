import React, { useState } from 'react';
import { ChevronLeft, ArrowDownUp, SlidersHorizontal, ChevronUp, ChevronDown, Bus, Train, ShieldCheck, AlertCircle, Check } from 'lucide-react';

export default function PrototypeC({ onConfirmRoute, onLogError }) {
  // Transfer buffer slider: min 2, max 15, default 4 (requiring user adjustment to >= 8)
  const [transferBuffer, setTransferBuffer] = useState(4);
  const [walkingPace, setWalkingPace] = useState('Standard Commuter'); // 'Relaxed' | 'Standard Commuter' | 'Fast'
  const [hideDelayConnections, setHideDelayConnections] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const isSafe = transferBuffer >= 8;

  const handleConfirm = () => {
    if (!isSafe) {
      onLogError(`Transfer buffer is currently set to ${transferBuffer}m, which violates the required minimum 8-minute safe cushion.`);
      return;
    }

    onConfirmRoute({
      prototypeId: 'C',
      routeName: 'Filtered Transit Itinerary',
      departure: '07:22 AM',
      arrival: '08:18 AM',
      bufferMinutes: transferBuffer,
      walkingPace,
      hideDelayConnections,
      isValid: true
    });
  };

  return (
    <div className="relative flex flex-col h-full bg-[#f2f3f7] text-slate-800 font-sans overflow-hidden">
      {/* Top App Bar matching prototype3.jpg */}
      <div className="px-4 pt-1 pb-2 flex items-center justify-between bg-white border-b border-gray-200/80">
        <button 
          type="button"
          onClick={() => {}} 
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-1 text-gray-800"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <h1 className="font-bold text-[16px] text-gray-900 tracking-tight">
          Public Transit Trip Search
        </h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Main Content Area (Scrollable underneath drawer) */}
      <div className="flex-1 p-4 pb-24 overflow-y-auto custom-scrollbar space-y-3">
        {/* Origin / Destination Search Card */}
        <div className="bg-white rounded-2xl p-3 border border-gray-200/90 shadow-sm relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              {/* Origin */}
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                </div>
                <span className="text-[14px] font-medium text-gray-800">100 Main Street</span>
              </div>

              {/* Dotted vertical connector */}
              <div className="absolute left-[22px] top-[32px] w-[1px] h-[16px] border-l-2 border-dotted border-gray-300 pointer-events-none" />

              {/* Destination */}
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-[14px] font-medium text-gray-800">University Hospital</span>
              </div>
            </div>

            {/* Swap Button on Right */}
            <button 
              type="button"
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              title="Swap Origin and Destination"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Filter Pill Bar */}
        <div className="flex items-center space-x-2">
          {/* Pill 1: Buffer Quick Tag */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center space-x-1.5 bg-gray-200/80 hover:bg-gray-300 text-gray-800 text-[13px] font-semibold py-1.5 px-3 rounded-full transition-colors"
          >
            <Bus className="w-3.5 h-3.5 text-gray-700" />
            <span>{transferBuffer} mins</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Pill 2: Filters Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(prev => !prev)}
            className="flex items-center space-x-1.5 bg-gray-200/80 hover:bg-gray-300 text-gray-800 text-[13px] font-semibold py-1.5 px-3 rounded-full transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-700" />
            <span>Filters</span>
          </button>
        </div>

        {/* Visible Filtered Itinerary Card (As shown in screenshot behind modal) */}
        <div 
          onClick={handleConfirm}
          className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-sm relative ${
            isSafe ? 'border-emerald-500/80 hover:border-emerald-600' : 'border-amber-400 hover:border-amber-500'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-[14px] text-gray-900 leading-tight">
                Filter transit itinerary
              </h3>
              <p className="text-[12px] text-gray-500">
                {isSafe ? 'Safe transit route' : 'Risk of missed transfer'}
              </p>
            </div>

            {/* Hexagon / Pill Buffer Badge */}
            <div className={`px-2.5 py-1 rounded-lg text-white font-black text-[13px] flex items-center justify-center shadow-sm ${
              isSafe ? 'bg-[#15803d]' : 'bg-[#eab308]'
            }`}>
              {transferBuffer}m
            </div>
          </div>

          {/* Transit line summary */}
          <div className="flex items-center space-x-2 text-[12px] font-medium text-gray-700 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
              <Bus className="w-3 h-3" />
            </div>
            <span>URNL</span>
            <span className="text-gray-400">→</span>
            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
              <Train className="w-3 h-3" />
            </div>
            <span>{transferBuffer}m buffer</span>
          </div>

          {/* Status Row */}
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold">
            {isSafe ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Safe reliability score</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700">Tight connection (Under 8 mins safe threshold)</span>
              </>
            )}
          </div>
        </div>

        {/* Informative helper note for participant */}
        {!isDrawerOpen && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="text-[12px] font-semibold text-blue-600 hover:underline flex items-center justify-center space-x-1 mx-auto"
            >
              <span>Tap to Open "Trip Parameters" Drawer</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Expandable / Floating Bottom Sheet Modal: Trip Parameters */}
      <div 
        className={`absolute left-0 right-0 bottom-0 bg-white rounded-t-[28px] shadow-[0_-10px_30px_rgba(0,0,0,0.18)] border-t border-gray-200 transition-all duration-300 ease-in-out z-20 flex flex-col ${
          isDrawerOpen ? 'translate-y-0 max-h-[80%]' : 'translate-y-[calc(100%-48px)]'
        }`}
      >
        {/* Drag Pill Handle */}
        <div 
          onClick={() => setIsDrawerOpen(prev => !prev)}
          className="pt-2.5 pb-1 flex flex-col items-center cursor-pointer group"
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full group-hover:bg-gray-400 transition-colors" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-2 flex items-center justify-between">
          <h2 className="font-bold text-[17px] text-gray-900 tracking-tight">
            Trip Parameters
          </h2>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(prev => !prev)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            title={isDrawerOpen ? "Collapse parameters" : "Expand parameters"}
          >
            {isDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Modal Controls Body */}
        {isDrawerOpen && (
          <div className="px-5 pb-5 pt-1 space-y-4 overflow-y-auto">
            {/* Control 1: Transfer Buffer Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[14px] font-bold text-gray-900">
                  Transfer Buffer
                </span>
                <span className={`text-[12px] font-extrabold px-2 py-0.5 rounded ${isSafe ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                  {isSafe ? '✓ Safe Buffer' : '⚠️ Too Tight'}
                </span>
              </div>

              {/* Range input track */}
              <div className="relative py-2">
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={transferBuffer}
                  onChange={(e) => setTransferBuffer(Number(e.target.value))}
                  className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#007aff]"
                />
              </div>

              {/* Slider Labels */}
              <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium">
                <span>Tight (2m)</span>
                <span className="text-[13px] font-extrabold text-gray-900">
                  {transferBuffer} mins
                </span>
                <span>Relaxed (15m)</span>
              </div>
            </div>

            {/* Control 2: Walking Pace Segmented Control */}
            <div>
              <div className="text-[14px] font-bold text-gray-900 mb-2">
                Walking Pace
              </div>

              <div className="bg-[#ededf0] p-1 rounded-xl flex items-center justify-between text-[12px] font-semibold text-gray-600">
                {['Relaxed', 'Standard Commuter', 'Fast'].map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setWalkingPace(pace)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                      walkingPace === pace
                        ? 'bg-white text-gray-900 shadow-sm font-bold'
                        : 'hover:text-gray-900'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Schedule Reliability Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-[14px] font-bold text-gray-900 leading-tight">
                  Schedule Reliability:
                </div>
                <div className="text-[12px] text-gray-500">
                  Hide high delay connections
                </div>
              </div>

              {/* iOS-Style Toggle Switch */}
              <button
                type="button"
                onClick={() => setHideDelayConnections(prev => !prev)}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                  hideDelayConnections ? 'bg-[#34c759]' : 'bg-gray-300'
                }`}
              >
                <div 
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    hideDelayConnections ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Bottom Confirmation Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirm}
                className={`w-full py-2.5 rounded-xl text-white font-bold text-[14px] shadow transition-all flex items-center justify-center space-x-2 ${
                  isSafe ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Parameters & View Route</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
