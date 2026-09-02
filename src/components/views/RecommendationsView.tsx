import React, { useState } from 'react';
import { Lightbulb, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const RecommendationsView: React.FC = () => {
  const { recommendations, setActiveTab } = useFinance();
  const [completed, setCompleted] = useState<string[]>([]);

  const handleAction = (id: string, title: string) => {
    if (title.includes('Collect')) {
      setActiveTab('payments');
    } else if (title.includes('expenses')) {
      setActiveTab('transactions');
    } else {
      setActiveTab('cashflow');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>AI Actionable Financial Plan</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Recommendations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized steps designed to maximize net cash flow, collect receivables, and boost credit readiness.
          </p>
        </div>
      </div>

      {/* Priority Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map(rec => {
          const isDone = completed.includes(rec.id);
          return (
            <div
              key={rec.id}
              className={`p-6 rounded-2xl border transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                rec.priority === 1
                  ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/60'
                  : rec.priority === 2
                  ? 'bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-500/60'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full text-slate-950 font-black text-xs flex items-center justify-center ${
                      rec.priority === 1 ? 'bg-rose-400' : rec.priority === 2 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                  >
                    P{rec.priority}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      rec.priorityLevel === 'High'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {rec.priorityLevel} Priority
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100">{rec.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Reason</span>
                    <p className="text-slate-300 mt-0.5">{rec.reason}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Expected Impact</span>
                    <p className="text-emerald-400 font-semibold mt-0.5">{rec.expectedImpact}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAction(rec.id, rec.title)}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
