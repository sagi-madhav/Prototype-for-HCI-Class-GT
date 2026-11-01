import React from 'react';
import { X, Check, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { calculateRouteMetrics } from '../../lib/routeCalculator';
import { validateRoute } from '../../lib/routeValidation';

export default function RouteComparisonModal({
  isOpen,
  onClose,
  routeIds,
  allRoutes,
  preferences,
  onSelectRoute,
}) {
  if (!isOpen || routeIds.length < 2) return null;

  const route1 = allRoutes.find(r => r.id === routeIds[0]);
  const route2 = allRoutes.find(r => r.id === routeIds[1]);

  if (!route1 || !route2) return null;

  const m1 = calculateRouteMetrics(route1, preferences);
  const v1 = validateRoute(m1, preferences);

  const m2 = calculateRouteMetrics(route2, preferences);
  const v2 = validateRoute(m2, preferences);

  const rows = [
    {
      label: 'Departure',
      val1: m1.firstDepartureTime,
      val2: m2.firstDepartureTime,
    },
    {
      label: 'Arrival',
      val1: m1.finalArrivalTime,
      val2: m2.finalArrivalTime,
    },
    {
      label: 'Total Duration',
      val1: `${m1.totalDurationMinutes} mins`,
      val2: `${m2.totalDurationMinutes} mins`,
    },
    {
      label: 'Usable Cushion',
      val1: `${m1.usableCushion} mins`,
      val2: `${m2.usableCushion} mins`,
      highlight: true,
      safe1: v1.qualifies,
      safe2: v2.qualifies,
    },
    {
      label: 'Meets Minimum?',
      val1: v1.qualifies ? 'Yes (Safe)' : 'No (Tight)',
      val2: v2.qualifies ? 'Yes (Safe)' : 'No (Tight)',
      isBadge: true,
      safe1: v1.qualifies,
      safe2: v2.qualifies,
    },
    {
      label: 'Connection Tradeoff',
      val1: v1.qualifies ? 'Relaxed platform transfer' : 'High risk of missed bus',
      val2: v2.qualifies ? 'Relaxed platform transfer' : 'High risk of missed bus',
    }
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-t-[32px] shadow-2xl border-t border-slate-200 max-h-[85%] flex flex-col overflow-hidden animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="font-bold text-[16px] text-slate-900">Route Comparison</h3>
            <p className="text-[11px] text-slate-500">Side-by-side trade-off evaluation</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-center pb-2 border-b border-slate-200">
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-[12px] font-bold text-slate-900 block truncate">{route1.title}</span>
              <button
                type="button"
                onClick={() => {
                  onSelectRoute(route1.id);
                  onClose();
                }}
                className="text-[10px] text-blue-600 font-bold hover:underline mt-0.5"
              >
                Select this route →
              </button>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-[12px] font-bold text-slate-900 block truncate">{route2.title}</span>
              <button
                type="button"
                onClick={() => {
                  onSelectRoute(route2.id);
                  onClose();
                }}
                className="text-[10px] text-blue-600 font-bold hover:underline mt-0.5"
              >
                Select this route →
              </button>
            </div>
          </div>

          <div className="space-y-2 text-[12px]">
            {rows.map((row, idx) => (
              <div key={idx} className="bg-slate-50/70 p-2 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  {row.label}
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className={`p-1 rounded ${row.highlight ? (row.safe1 ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-red-700 font-bold bg-red-50') : 'text-slate-800'}`}>
                    {row.val1}
                  </div>
                  <div className={`p-1 rounded ${row.highlight ? (row.safe2 ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-red-700 font-bold bg-red-50') : 'text-slate-800'}`}>
                    {row.val2}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-[12px] text-slate-700"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
