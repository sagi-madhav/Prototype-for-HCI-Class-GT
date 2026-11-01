import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function PhoneFrame({ children, activePrototype, hasDynamicIsland = false }) {
  return (
    <div className="relative mx-auto flex flex-col items-center select-none">
      {/* Device Outer Chassis */}
      <div className="relative w-[390px] h-[844px] bg-[#1a1a1e] rounded-[52px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_4px_2px_rgba(255,255,255,0.15)] ring-1 ring-black">
        
        {/* Antennas & Side Buttons Accents */}
        <div className="absolute -left-[12px] top-[115px] w-[3px] h-[28px] bg-[#3a3a40] rounded-l-sm" />
        <div className="absolute -left-[12px] top-[165px] w-[3px] h-[50px] bg-[#3a3a40] rounded-l-sm" />
        <div className="absolute -left-[12px] top-[225px] w-[3px] h-[50px] bg-[#3a3a40] rounded-l-sm" />
        <div className="absolute -right-[12px] top-[175px] w-[3px] h-[75px] bg-[#3a3a40] rounded-r-sm" />

        {/* Screen Bezel & Display Area */}
        <div className="relative w-full h-full bg-[#f8f9fc] rounded-[42px] overflow-hidden flex flex-col shadow-inner">
          
          {/* iOS Status Bar */}
          <div className="relative z-30 h-[44px] pt-3 px-7 flex items-center justify-between text-black text-[14px] font-semibold tracking-tight">
            <span>9:41</span>
            
            {/* Dynamic Island or Top Notch */}
            {hasDynamicIsland ? (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[115px] h-[28px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#101014] ring-1 ring-[#222]" />
                <div className="w-3 h-3 rounded-full bg-[#080820] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#142036]" />
                </div>
              </div>
            ) : (
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[150px] h-[25px] bg-black rounded-b-[18px] flex items-center justify-center">
                <div className="w-[50px] h-[4px] bg-[#222] rounded-full mb-1" />
              </div>
            )}

            <div className="flex items-center space-x-1.5 text-black">
              {/* Signal Bars */}
              <div className="flex items-end space-x-0.5 h-3">
                <div className="w-[3px] h-[4px] bg-current rounded-[0.5px]" />
                <div className="w-[3px] h-[6px] bg-current rounded-[0.5px]" />
                <div className="w-[3px] h-[8px] bg-current rounded-[0.5px]" />
                <div className="w-[3px] h-[10px] bg-current rounded-[0.5px]" />
              </div>
              <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
              {/* Battery Icon */}
              <div className="flex items-center space-x-[1px]">
                <div className="w-[20px] h-[10px] border border-current rounded-[3px] p-[1px] flex items-center">
                  <div className="w-full h-full bg-current rounded-[1px]" />
                </div>
                <div className="w-[1.5px] h-[4px] bg-current rounded-r-[1px]" />
              </div>
            </div>
          </div>

          {/* Interactive Mobile Screen Body */}
          <div className="relative flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
            {children}
          </div>

          {/* Home Bar Indicator */}
          <div className="relative z-30 h-[22px] flex items-center justify-center pointer-events-none bg-transparent">
            <div className="w-[130px] h-[4px] bg-black/80 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
}
