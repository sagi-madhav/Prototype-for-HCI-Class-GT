import React, { useState } from 'react';
import { Download, Copy, Check, BarChart3, Clock, AlertTriangle, ShieldCheck, RefreshCw, Award } from 'lucide-react';
import { PROTOTYPE_META } from '../data/experimentConstants';

export default function ResultsSummary({ results, counterbalanceOrder, onResetAll }) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  const prototypes = ['A', 'B', 'C'];

  // Calculate averages
  const completedList = prototypes.filter(p => results[p]?.completed);
  const avgTime = completedList.length > 0 
    ? (completedList.reduce((acc, p) => acc + (results[p]?.completionTimeSeconds || 0), 0) / completedList.length).toFixed(1)
    : 0;
  const totalErrors = completedList.reduce((acc, p) => acc + (results[p]?.errorCount || 0), 0);
  const avgSeq = completedList.length > 0
    ? (completedList.reduce((acc, p) => acc + (results[p]?.seqRating || 0), 0) / completedList.length).toFixed(1)
    : 0;
  const avgConf = completedList.length > 0
    ? (completedList.reduce((acc, p) => acc + (results[p]?.confidenceRating || 0), 0) / completedList.length).toFixed(1)
    : 0;

  // Format as Markdown Table
  const generateMarkdown = () => {
    let md = `### HCI Usability Evaluation Results Summary\n`;
    md += `**Counterbalance Order:** ${counterbalanceOrder}\n\n`;
    md += `| Prototype | Design Paradigm | Time (s) | Errors | Buffer (m) | SEQ (1-7) | Confidence (1-7) | Qualitative Notes |\n`;
    md += `| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n`;
    prototypes.forEach(p => {
      const r = results[p] || {};
      const meta = PROTOTYPE_META[p];
      md += `| **${meta.name}** | ${meta.subtitle} | ${r.completionTimeSeconds ? r.completionTimeSeconds.toFixed(1) : 'N/A'} | ${r.errorCount ?? 'N/A'} | ${r.finalBufferSelected ? `${r.finalBufferSelected}m` : 'N/A'} | ${r.seqRating ?? 'N/A'} | ${r.confidenceRating ?? 'N/A'} | ${r.comment ? `"${r.comment.replace(/"/g, "'")}"` : '-'} |\n`;
    });
    return md;
  };

  // Format as CSV
  const generateCSV = () => {
    let csv = `Prototype,Paradigm,CompletionTimeSec,ErrorCount,FinalBufferMin,SEQ_Rating,ConfidenceRating,QualitativeComment,Order\n`;
    prototypes.forEach(p => {
      const r = results[p] || {};
      const meta = PROTOTYPE_META[p];
      csv += `"${meta.name}","${meta.subtitle}",${r.completionTimeSeconds?.toFixed(1) || ''},${r.errorCount ?? ''},${r.finalBufferSelected ?? ''},${r.seqRating ?? ''},${r.confidenceRating ?? ''},"${(r.comment || '').replace(/"/g, '""')}","${counterbalanceOrder}"\n`;
    });
    return csv;
  };

  const copyToClipboard = (type) => {
    const text = type === 'markdown' ? generateMarkdown() : generateCSV();
    navigator.clipboard.writeText(text);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-[12px] font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Experiment Synthesis & Telemetry Log</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Multi-Leg Transit UI Evaluation Matrix
          </h2>
          <p className="text-[13px] text-slate-400 mt-1">
            Benchmark Task: Arrive &lt; 08:45 AM, Depart &gt; 07:20 AM, Transfer Buffer &ge; 8 mins. Tested under counterbalanced sequence: <span className="font-mono text-blue-300 font-semibold">{counterbalanceOrder}</span>.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 p-3 rounded-2xl">
          <div className="text-center px-3 border-r border-slate-700/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Avg Time</div>
            <div className="text-xl font-black text-white">{avgTime}s</div>
          </div>
          <div className="text-center px-3 border-r border-slate-700/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Errors</div>
            <div className="text-xl font-black text-amber-400">{totalErrors}</div>
          </div>
          <div className="text-center px-3 border-r border-slate-700/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Avg SEQ</div>
            <div className="text-xl font-black text-emerald-400">{avgSeq} <span className="text-[12px] text-slate-500">/ 7</span></div>
          </div>
          <div className="text-center px-3">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Confidence</div>
            <div className="text-xl font-black text-blue-400">{avgConf} <span className="text-[12px] text-slate-500">/ 7</span></div>
          </div>
        </div>
      </div>

      {/* Cross-Prototype Comparison Table */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <h3 className="font-bold text-white text-[16px] flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Quantitative Comparison Across Prototypes</span>
          </h3>
          <span className="text-[12px] text-slate-400">
            {completedList.length} of 3 prototypes tested
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-5">Prototype</th>
                <th className="py-3 px-4">Completion Time</th>
                <th className="py-3 px-4">Errors</th>
                <th className="py-3 px-4">Final Buffer</th>
                <th className="py-3 px-4">Usability (SEQ)</th>
                <th className="py-3 px-4">Transfer Confidence</th>
                <th className="py-3 px-5">Qualitative Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {prototypes.map((p) => {
                const r = results[p] || {};
                const meta = PROTOTYPE_META[p];
                const isComplete = r.completed;

                return (
                  <tr key={p} className="hover:bg-slate-700/30 transition-colors">
                    {/* Prototype Info */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-[14px]">
                        {meta.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {meta.subtitle}
                      </div>
                    </td>

                    {/* Completion Time */}
                    <td className="py-4 px-4 font-mono">
                      {isComplete ? (
                        <div className="flex items-center space-x-1.5 text-blue-300 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>{r.completionTimeSeconds?.toFixed(1)}s</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Not tested</span>
                      )}
                    </td>

                    {/* Error Count */}
                    <td className="py-4 px-4 font-mono">
                      {isComplete ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-bold ${
                          r.errorCount === 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {r.errorCount} {r.errorCount === 1 ? 'error' : 'errors'}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Final Buffer */}
                    <td className="py-4 px-4 font-mono font-bold text-emerald-400">
                      {isComplete ? `${r.finalBufferSelected} mins` : '-'}
                    </td>

                    {/* SEQ Rating */}
                    <td className="py-4 px-4">
                      {isComplete ? (
                        <div className="flex items-center space-x-1 font-bold text-white">
                          <span>{r.seqRating}</span>
                          <span className="text-slate-400 text-[11px]">/ 7</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Confidence Rating */}
                    <td className="py-4 px-4">
                      {isComplete ? (
                        <div className="flex items-center space-x-1 font-bold text-emerald-400">
                          <span>{r.confidenceRating}</span>
                          <span className="text-slate-400 text-[11px]">/ 7</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Comments */}
                    <td className="py-4 px-5 text-[12px] text-slate-300 max-w-[260px]">
                      {r.comment ? (
                        <span className="italic">"{r.comment}"</span>
                      ) : (
                        <span className="text-slate-500">None provided</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Markdown */}
          <button
            type="button"
            onClick={() => copyToClipboard('markdown')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm"
          >
            {copiedFormat === 'markdown' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedFormat === 'markdown' ? 'Copied Markdown!' : 'Copy Markdown Table'}</span>
          </button>

          {/* Copy CSV */}
          <button
            type="button"
            onClick={() => copyToClipboard('csv')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm"
          >
            {copiedFormat === 'csv' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedFormat === 'csv' ? 'Copied CSV!' : 'Copy CSV Row'}</span>
          </button>

          {/* Download JSON */}
          <button
            type="button"
            onClick={() => downloadFile('hci_transit_evaluation_results.json', JSON.stringify({ counterbalanceOrder, results }, null, 2), 'application/json')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>

          {/* Download CSV */}
          <button
            type="button"
            onClick={() => downloadFile('hci_transit_evaluation_results.csv', generateCSV(), 'text/csv')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Reset Experiment */}
        <button
          type="button"
          onClick={onResetAll}
          className="flex items-center space-x-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-[13px] font-bold transition-all ml-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Data</span>
        </button>
      </div>
    </div>
  );
}
