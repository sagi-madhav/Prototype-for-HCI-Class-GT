import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles, Footprints, Clock, ShieldAlert } from 'lucide-react';

export default function PreferencesSheet({
  isOpen,
  onClose,
  preferences,
  onChangePreferences,
  onResetPreferences,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Dimmed Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content Container */}
      <div className="relative bg-white rounded-t-[32px] shadow-2xl border-t border-slate-200 max-h-[88%] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
        
        {/* Grabber Handle */}
        <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-slate-900 tracking-tight">Trip Preferences</h3>
              <p className="text-[11px] text-slate-500">Customize connection cushions and walking pace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-slate-800">
          
          {/* Section: Usable Transfer Cushion */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[13px] font-bold text-slate-900 flex items-center space-x-1.5">
                <span>Minimum Usable Cushion</span>
              </label>
              <span className="text-[13px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {preferences.minimumUsableCushionMinutes} mins
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Time you want to have remaining on the platform after completing your transfer walk.
            </p>

            {/* Continuous Range Slider + Steppers */}
            <div className="flex items-center space-x-3 mb-2">
              <button
                type="button"
                onClick={() => onChangePreferences({
                  minimumUsableCushionMinutes: Math.max(2, preferences.minimumUsableCushionMinutes - 1)
                })}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base flex items-center justify-center"
              >
                −
              </button>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={preferences.minimumUsableCushionMinutes}
                onChange={(e) => onChangePreferences({ minimumUsableCushionMinutes: Number(e.target.value) })}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <button
                type="button"
                onClick={() => onChangePreferences({
                  minimumUsableCushionMinutes: Math.min(25, preferences.minimumUsableCushionMinutes + 1)
                })}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Quick Presets row */}
            <div className="flex items-center space-x-2 pt-1">
              {[3, 8, 15].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChangePreferences({ minimumUsableCushionMinutes: preset })}
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                    preferences.minimumUsableCushionMinutes === preset
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {preset} min {preset === 8 ? '(Recommended)' : preset === 3 ? '(Tight)' : '(Relaxed)'}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Walking Pace */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-[13px] font-bold text-slate-900 block mb-1">
              Walking Pace
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Directly adjusts station concourse and escalator transfer estimates.
            </p>

            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'relaxed', label: 'Relaxed', desc: '1.4× walk time' },
                { id: 'standard', label: 'Standard', desc: '1.0× walk time' },
                { id: 'fast', label: 'Fast', desc: '0.75× walk time' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChangePreferences({ walkingPace: p.id })}
                  className={`py-2 px-1 rounded-lg text-center transition-all ${
                    preferences.walkingPace === p.id
                      ? 'bg-white text-slate-900 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="text-[12px] font-bold">{p.label}</div>
                  <div className="text-[9px] text-slate-400">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Luggage & Accessibility Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold text-slate-900">Carrying Heavy Items / Luggage</div>
                <div className="text-[11px] text-slate-500">Adds +2 mins for elevator & ramp navigation</div>
              </div>
              <button
                type="button"
                onClick={() => onChangePreferences({ heavyItems: !preferences.heavyItems })}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  preferences.heavyItems ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  preferences.heavyItems ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Section: Filter out non-qualifying toggle */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold text-slate-900">Hide Connections Below Minimum</div>
                <div className="text-[11px] text-slate-500">Only display routes satisfying all cushions</div>
              </div>
              <button
                type="button"
                onClick={() => onChangePreferences({ hideNonQualifying: !preferences.hideNonQualifying })}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  preferences.hideNonQualifying ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  preferences.hideNonQualifying ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
          <button
            type="button"
            onClick={onResetPreferences}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-[12px] font-semibold hover:bg-slate-100 flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] shadow transition-colors flex items-center justify-center space-x-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Apply Preferences</span>
          </button>
        </div>

      </div>
    </div>
  );
}
