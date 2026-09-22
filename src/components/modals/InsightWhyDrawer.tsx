import React, { useState } from 'react';
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Bot,
  ReceiptText,
  AlertTriangle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getInsightTraceability } from '../../services/aicfoEngine';

export const InsightWhyDrawer: React.FC = () => {
  const { whyDrawerKey, setWhyDrawerKey, transactions, metrics, setActiveTab } = useFinance();

  if (!whyDrawerKey) return null;

  const trace = getInsightTraceability(whyDrawerKey, transactions, metrics);
  const delta = trace.delta;
  const deltaPositive = delta > 0;

  const formatINR = (val: number) =>
    `₹${Math.abs(val).toLocaleString('en-IN')}`;

  const formatLakhs = (val: number) => {
    if (Math.abs(val) >= 100000) return `₹${(Math.abs(val) / 100000).toFixed(2)}L`;
    return `₹${Math.abs(val).toLocaleString('en-IN')}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
        onClick={() => setWhyDrawerKey(null)}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-snug">{trace.heading}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{trace.subheading}</p>
            </div>
          </div>
          <button
            onClick={() => setWhyDrawerKey(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Metrics */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">{trace.currentPeriodLabel}</p>
              <p className="text-lg font-black text-white mt-1">{formatLakhs(trace.currentPeriodValue)}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">{trace.previousPeriodLabel}</p>
              <p className="text-lg font-black text-slate-400 mt-1">{formatLakhs(trace.previousPeriodValue)}</p>
            </div>

            <div className={`p-3.5 rounded-2xl text-center border ${
              deltaPositive
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <p className="text-[10px] uppercase font-bold text-slate-500">Difference</p>
              <div className={`flex items-center justify-center gap-1 mt-1 ${
                deltaPositive ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {deltaPositive
                  ? <TrendingUp className="w-3.5 h-3.5" />
                  : <TrendingDown className="w-3.5 h-3.5" />
                }
                <span className="text-lg font-black">{deltaPositive ? '+' : '-'}{formatLakhs(delta)}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{trace.deltaLabel}</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">AI Analysis</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{trace.summary}</p>
          </div>

          {/* Underlying Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ReceiptText className="w-4 h-4 text-slate-400" />
                Underlying Transactions ({trace.transactions.length})
              </h3>
            </div>

            {trace.transactions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                No transactions found for this period. Connect Business UPI to import live transaction data.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {trace.transactions.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        t.type === 'Credit'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {t.type === 'Credit'
                          ? <ArrowUpRight className="w-3.5 h-3.5" />
                          : <ArrowDownRight className="w-3.5 h-3.5" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{t.description}</p>
                        <p className="text-[10px] text-slate-500">{t.date} • {t.category}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-extrabold flex-shrink-0 ml-2 ${
                      t.type === 'Credit' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {t.type === 'Credit' ? '+' : '-'}{formatINR(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={() => { setWhyDrawerKey(null); setActiveTab('transactions'); }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ReceiptText className="w-3.5 h-3.5" />
            View All Transactions
          </button>
          <button
            onClick={() => { setWhyDrawerKey(null); setActiveTab('copilot'); }}
            className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            Ask AI Copilot
          </button>
        </div>
      </div>
    </>
  );
};
