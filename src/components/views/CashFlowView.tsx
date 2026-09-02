import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { TrendingUp, AlertTriangle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const CashFlowView: React.FC = () => {
  const { historicalCashFlowData, forecastCashFlowData, setActiveTab } = useFinance();
  const [viewMode, setViewMode] = useState<'all' | 'historical' | 'forecast'>('all');

  // Combined chart dataset
  const combinedData = [
    ...historicalCashFlowData,
    ...forecastCashFlowData.map(f => ({
      ...f,
      period: `🔮 ${f.period}`
    }))
  ];

  const displayedData =
    viewMode === 'historical'
      ? historicalCashFlowData
      : viewMode === 'forecast'
      ? forecastCashFlowData
      : combinedData;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Modeling</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Cash-Flow Forecast</h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical 6-month performance vs. 30-day AI predictive trajectory.
          </p>
        </div>

        {/* Filter View Mode */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All (6 Mo + Forecast)
          </button>
          <button
            onClick={() => setViewMode('historical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'historical'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Past 6 Months
          </button>
          <button
            onClick={() => setViewMode('forecast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'forecast'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Next 30 Days Forecast
          </button>
        </div>
      </div>

      {/* AI Forecast Banner Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/30 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              AI Forecast Analysis
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold">
                High Accuracy
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              “Your projected cash position remains healthy for the next 30 days, but <strong className="text-amber-400">₹85,000 in overdue payments</strong> could create short-term pressure around Day 18 if receivables are delayed.”
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('payments')}
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
        >
          Collect Receivables <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Recharts Chart Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Revenue, Expenses & Net Cash Flow Visualization (₹)
          </h2>
          <span className="text-[11px] text-slate-400">
            Values in Indian Rupees (₹)
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#F8FAFC'
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#06B6D4" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={24} />
              <Line
                type="monotone"
                dataKey="netCashFlow"
                name="Net Cash Flow"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10B981' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
