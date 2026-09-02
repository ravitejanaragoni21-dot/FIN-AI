import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const AIInsightsView: React.FC = () => {
  const { insights, setActiveTab } = useFinance();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Autonomous Analysis</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Financial Insights</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time intelligence generated from RK Traders' ledger & transactions.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('recommendations')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          View Recommended Actions <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map(insight => {
          const isWarning = insight.type === 'warning';
          return (
            <div
              key={insight.id}
              className={`p-6 rounded-2xl border transition-all shadow-xl flex flex-col justify-between ${
                isWarning
                  ? 'bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {insight.category}
                  </span>
                  {insight.changeValue && (
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isWarning
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {insight.changeValue}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  {isWarning ? (
                    <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {insight.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {insight.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Analyzed 2 mins ago by AI Engine
                </span>

                {isWarning && (
                  <button
                    onClick={() => {
                      if (insight.category === 'Payments' || insight.category === 'Risk') {
                        setActiveTab('payments');
                      } else if (insight.category === 'Forecast') {
                        setActiveTab('cashflow');
                      } else {
                        setActiveTab('copilot');
                      }
                    }}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Take Action <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
