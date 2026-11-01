import React, { useState, useEffect, useRef } from 'react';
import PhoneFrame from './components/PhoneFrame';
import PrototypeA from './components/PrototypeA';
import PrototypeB from './components/PrototypeB';
import PrototypeC from './components/PrototypeC';
import PostTaskSurvey from './components/PostTaskSurvey';
import ResultsSummary from './components/ResultsSummary';
import TransferWiseApp from './components/final/TransferWiseApp';
import { 
  BENCHMARK_TASK, 
  COUNTERBALANCE_ORDERS, 
  PROTOTYPE_META 
} from './data/experimentConstants';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Shuffle, 
  Check, 
  ChevronRight, 
  Compass, 
  Layers, 
  Sliders,
  Footprints,
  ShieldCheck,
  Award,
  Eye
} from 'lucide-react';

export default function App() {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const activeOrder = COUNTERBALANCE_ORDERS[selectedOrderIndex];

  // Active view: 'FINAL' | 'A' | 'B' | 'C' | 'results'
  const [activeTab, setActiveTab] = useState('FINAL');

  // Key to force reset of Final prototype state when clicking Reset
  const [finalKey, setFinalKey] = useState(0);

  // Telemetry state per prototype
  const [prototypeTelemetry, setPrototypeTelemetry] = useState({
    FINAL: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 10, completed: false, seqRating: null, confidenceRating: null, comment: '' },
    A: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 15, completed: false, seqRating: null, confidenceRating: null, comment: '' },
    B: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 8, completed: false, seqRating: null, confidenceRating: null, comment: '' },
    C: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 4, completed: false, seqRating: null, confidenceRating: null, comment: '' },
  });

  const [activeErrorToast, setActiveErrorToast] = useState(null);
  const [showSurveyFor, setShowSurveyFor] = useState(null);
  const [showDebugOverlay, setShowDebugOverlay] = useState(false);

  // Live timer tick
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Timer loop for active prototype
  useEffect(() => {
    if (activeTab === 'results') return;
    const current = prototypeTelemetry[activeTab];

    if (current?.timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((Date.now() - current.startTime) / 1000);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (current?.completionTimeSeconds) {
        setElapsedSeconds(current.completionTimeSeconds);
      } else {
        setElapsedSeconds(0);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, prototypeTelemetry]);

  // Start task for active prototype
  const handleStartTask = (pId = activeTab) => {
    setPrototypeTelemetry(prev => ({
      ...prev,
      [pId]: {
        ...prev[pId],
        timerRunning: true,
        startTime: Date.now(),
        completionTimeSeconds: 0,
      }
    }));
    setShowSurveyFor(null);
  };

  // Reset task for active prototype
  const handleResetCurrentTask = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSeconds(0);
    setShowSurveyFor(null);

    if (activeTab === 'FINAL') {
      setFinalKey(k => k + 1);
    }

    setPrototypeTelemetry(prev => ({
      ...prev,
      [activeTab]: {
        timerRunning: false,
        startTime: null,
        completionTimeSeconds: 0,
        errorCount: 0,
        finalBufferSelected: activeTab === 'FINAL' ? 10 : activeTab === 'A' ? 15 : activeTab === 'B' ? 8 : 4,
        completed: false,
        seqRating: null,
        confidenceRating: null,
        comment: ''
      }
    }));
  };

  // Log an error
  const handleLogError = (message) => {
    const current = prototypeTelemetry[activeTab];
    const startTime = current.timerRunning ? current.startTime : Date.now();

    setPrototypeTelemetry(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        timerRunning: true,
        startTime: startTime,
        errorCount: prev[activeTab].errorCount + 1
      }
    }));

    setActiveErrorToast(message);
    setTimeout(() => {
      setActiveErrorToast(null);
    }, 4500);
  };

  // Confirm valid route
  const handleConfirmRoute = ({ prototypeId, bufferMinutes }) => {
    const pId = prototypeId || activeTab;
    const current = prototypeTelemetry[pId];
    const finalTime = current.timerRunning && current.startTime
      ? (Date.now() - current.startTime) / 1000
      : (elapsedSeconds > 0 ? elapsedSeconds : 14.8);

    if (timerRef.current) clearInterval(timerRef.current);

    setPrototypeTelemetry(prev => ({
      ...prev,
      [pId]: {
        ...prev[pId],
        timerRunning: false,
        completionTimeSeconds: finalTime,
        finalBufferSelected: bufferMinutes,
        completed: true
      }
    }));

    setShowSurveyFor(pId);
  };

  // Complete survey
  const handleCompleteSurvey = ({ prototypeId, seqRating, confidenceRating, comment }) => {
    setPrototypeTelemetry(prev => ({
      ...prev,
      [prototypeId]: {
        ...prev[prototypeId],
        seqRating,
        confidenceRating,
        comment
      }
    }));
    setShowSurveyFor(null);

    // Auto-advance logic: if doing Latin Square study sequence
    if (activeTab !== 'FINAL') {
      const seq = activeOrder.sequence;
      const currentIndex = seq.indexOf(prototypeId);
      if (currentIndex < seq.length - 1) {
        const nextPrototype = seq[currentIndex + 1];
        setActiveTab(nextPrototype);
      } else {
        setActiveTab('results');
      }
    }
  };

  // Reset entire experiment
  const handleResetAll = () => {
    setPrototypeTelemetry({
      FINAL: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 10, completed: false, seqRating: null, confidenceRating: null, comment: '' },
      A: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 15, completed: false, seqRating: null, confidenceRating: null, comment: '' },
      B: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 8, completed: false, seqRating: null, confidenceRating: null, comment: '' },
      C: { timerRunning: false, startTime: null, completionTimeSeconds: 0, errorCount: 0, finalBufferSelected: 4, completed: false, seqRating: null, confidenceRating: null, comment: '' },
    });
    setElapsedSeconds(0);
    setShowSurveyFor(null);
    setFinalKey(k => k + 1);
    setActiveTab('FINAL');
  };

  const currentTel = activeTab !== 'results' ? prototypeTelemetry[activeTab] : null;

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="h-[68px] bg-[#161b22] border-b border-slate-700/80 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-[16px] font-black tracking-tight text-white flex items-center space-x-2">
              <span>TransferWise</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Final Prototype
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hidden md:inline">
                CS 6750 HCI
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Connection-First Multi-Leg Transit Planning & Buffer Verification
            </p>
          </div>
        </div>

        {/* Prototype Switcher Tabs */}
        <div className="flex items-center bg-[#0d1117] p-1 rounded-2xl border border-slate-700/80">
          {/* Final Integrated Prototype Tab */}
          <button
            onClick={() => {
              setActiveTab('FINAL');
              setShowSurveyFor(prototypeTelemetry.FINAL.completed ? 'FINAL' : null);
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-[12px] font-extrabold transition-all ${
              activeTab === 'FINAL'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>TransferWise (Final)</span>
            {prototypeTelemetry.FINAL.completed && (
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            )}
          </button>

          <div className="w-[1px] h-5 bg-slate-700/80 mx-1" />

          {/* Exploratory Prototypes A, B, C */}
          {(['A', 'B', 'C']).map((pId) => {
            const isCompleted = prototypeTelemetry[pId].completed;
            const isActive = activeTab === pId;
            return (
              <button
                key={pId}
                onClick={() => {
                  setActiveTab(pId);
                  setShowSurveyFor(prototypeTelemetry[pId].completed ? pId : null);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                  isActive
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>Prototype {pId}</span>
                {isCompleted && (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                )}
              </button>
            );
          })}

          <div className="w-[1px] h-5 bg-slate-700/80 mx-1" />

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>Results Summary</span>
          </button>
        </div>

        {/* Counterbalance Latin Square Order Selector */}
        <div className="flex items-center space-x-2">
          <Shuffle className="w-4 h-4 text-slate-400" />
          <select
            value={selectedOrderIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedOrderIndex(idx);
              setActiveTab(COUNTERBALANCE_ORDERS[idx].sequence[0]);
            }}
            className="bg-[#0d1117] border border-slate-700 text-slate-200 text-[12px] font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            title="Latin square sequence counterbalancing order for evaluation"
          >
            {COUNTERBALANCE_ORDERS.map((ord, idx) => (
              <option key={ord.id} value={idx}>
                {ord.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 justify-center items-start">
        {activeTab === 'results' ? (
          <div className="w-full h-full overflow-y-auto">
            <ResultsSummary
              results={prototypeTelemetry}
              counterbalanceOrder={activeOrder.id}
              onResetAll={handleResetAll}
            />
          </div>
        ) : (
          <>
            {/* Left Panel: Experiment Brief & Task Prompt */}
            <div className="w-[330px] flex flex-col gap-4 flex-shrink-0">
              
              {/* Task Scenario Card */}
              <div className="bg-[#161b22] border border-slate-700/80 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">
                    {activeTab === 'FINAL' ? 'Target Benchmark Scenario' : 'Active Benchmark Task'}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {activeTab === 'FINAL' ? 'CS 6750 Final' : `Step ${activeOrder.sequence.indexOf(activeTab) + 1} of 3`}
                  </span>
                </div>

                <div className="p-3.5 bg-[#0d1117] rounded-2xl border border-slate-800 mb-3">
                  <p className="text-[12px] text-slate-200 leading-relaxed">
                    &ldquo;{BENCHMARK_TASK.scenarioText}&rdquo;
                  </p>
                </div>

                {/* Constraints Checklist */}
                <div className="space-y-1.5 mb-3 text-[12px]">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Depart no earlier than: <strong>07:20 AM</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Arrive no later than: <strong>08:45 AM</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Minimum Safe Cushion: <strong>&ge; 8 mins after walk</strong></span>
                  </div>
                </div>

                {/* Live Task Timer Card */}
                <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Task Timer</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentTel?.completed 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : currentTel?.timerRunning 
                          ? 'bg-amber-500/20 text-amber-400 animate-pulse' 
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {currentTel?.completed ? 'Completed' : currentTel?.timerRunning ? 'Timing...' : 'Ready'}
                    </span>
                  </div>

                  <div className="text-2xl font-black font-mono text-white mb-2">
                    {elapsedSeconds.toFixed(1)} <span className="text-xs font-sans font-medium text-slate-400">sec</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Errors Logged:</span>
                      <span className={`font-bold font-mono ${currentTel?.errorCount > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                        {currentTel?.errorCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Confirmed Buffer:</span>
                      <span className="font-bold font-mono text-emerald-400">
                        {currentTel?.finalBufferSelected ? `${currentTel.finalBufferSelected}m` : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls: Start & Reset */}
                <div className="flex items-center gap-2 mt-3">
                  {!currentTel?.timerRunning && !currentTel?.completed && (
                    <button
                      type="button"
                      onClick={() => handleStartTask(activeTab)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[12px] rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Task Timer</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetCurrentTask}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700 flex items-center space-x-1"
                    title="Reset prototype state to benchmark default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Reset</span>
                  </button>
                </div>
              </div>

              {/* Error Feedback Toast */}
              {activeErrorToast && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-2xl p-3.5 shadow-lg animate-bounce">
                  <div className="flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[12px] text-red-300">Constraint Error Recorded!</div>
                      <div className="text-[11px] text-red-200/90 mt-0.5 leading-snug">{activeErrorToast}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center Stage: iPhone Mockup Frame */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <PhoneFrame 
                activePrototype={activeTab}
                hasDynamicIsland={activeTab === 'FINAL' || activeTab === 'B'}
              >
                {activeTab === 'FINAL' && (
                  <TransferWiseApp
                    key={finalKey}
                    onTaskCompleted={handleConfirmRoute}
                    onLogError={handleLogError}
                  />
                )}
                {activeTab === 'A' && (
                  <PrototypeA 
                    onConfirmRoute={handleConfirmRoute}
                    onLogError={handleLogError}
                  />
                )}
                {activeTab === 'B' && (
                  <PrototypeB 
                    onConfirmRoute={handleConfirmRoute}
                    onLogError={handleLogError}
                  />
                )}
                {activeTab === 'C' && (
                  <PrototypeC 
                    onConfirmRoute={handleConfirmRoute}
                    onLogError={handleLogError}
                  />
                )}
              </PhoneFrame>
            </div>

            {/* Right Panel: Post-Task Evaluation or Feature Synthesis Details */}
            <div className="w-[340px] flex flex-col gap-4 flex-shrink-0">
              {showSurveyFor ? (
                <PostTaskSurvey
                  prototypeId={showSurveyFor}
                  telemetry={prototypeTelemetry[showSurveyFor]}
                  onCompleteSurvey={handleCompleteSurvey}
                />
              ) : activeTab === 'FINAL' ? (
                <div className="bg-[#161b22] border border-slate-700/80 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      <span>Final Design Synthesis</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Plan Implemented</span>
                  </div>

                  {/* Transfer Math Rule Box */}
                  <div className="bg-[#0d1117] p-3 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-bold text-slate-300 mb-1 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Transfer Cushion Math</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug font-mono">
                      Usable Cushion = (Next Dep − Prev Arr) − Transfer Walk
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Separates timetable connection gap from walking transit time across platforms.
                    </p>
                  </div>

                  {/* Features Implemented Checklist */}
                  <div className="space-y-2 text-[12px]">
                    <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <span className="text-blue-400">F01–F03:</span>
                        <span>Dual-Anchor & Buffer Presets</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        5-min stepper adjustments for earliest departure & arrival, plus 3/8/15 min cushions.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <Footprints className="w-3.5 h-3.5 text-amber-400" />
                        <span>F04: Walking Pace Multipliers</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Relaxed (1.4×), Standard (1.0×), and Fast (0.75×) pace dynamically alter route safety.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>F09 & F10: Compare & Delay Simulator</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Compare any 2 routes side-by-side; test delays in route details to recompute cushion live.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/60 rounded-xl text-[11px] text-slate-400 italic">
                    💡 Complete the trip to &ldquo;Trip Ready&rdquo; to copy the verified itinerary summary.
                  </div>
                </div>
              ) : (
                <div className="bg-[#161b22] border border-slate-700/80 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center space-x-2 text-blue-400 text-[11px] font-black uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Prototype Specification</span>
                  </div>
                  
                  <h3 className="text-[17px] font-bold text-white mb-1">
                    {PROTOTYPE_META[activeTab].name}
                  </h3>
                  <div className="text-[13px] text-blue-300 font-medium mb-3">
                    {PROTOTYPE_META[activeTab].subtitle}
                  </div>

                  <p className="text-[12px] text-slate-300 leading-relaxed mb-4">
                    {PROTOTYPE_META[activeTab].description}
                  </p>

                  <div className="bg-[#0d1117] rounded-2xl p-3 border border-slate-800 text-[12px] space-y-2 mb-4">
                    <div className="text-slate-400 text-[11px] font-semibold uppercase">Interaction Paradigm:</div>
                    <div className="text-slate-200">
                      {activeTab === 'A' && "Direct Gantt bar manipulation + dual-thumb temporal interval bounding."}
                      {activeTab === 'B' && "Discrete connection cushion nodes configured directly along the trip spine."}
                      {activeTab === 'C' && "Faceted search drawer with continuous buffer slider and reliability toggles."}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/60 rounded-xl text-[12px] text-slate-400 italic">
                    💡 Once you configure the parameters and confirm a valid route in the phone frame, the post-task questionnaire will unlock here.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
