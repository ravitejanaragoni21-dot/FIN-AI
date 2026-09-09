import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  Bot,
  FileCheck2,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const DashboardView: React.FC = () => {
  const {
    businessProfile,
    metrics,
    healthBreakdown,
    riskAlerts,
    setActiveTab
  } = useFinance();

  const activeRisks = riskAlerts.filter(r => !r.dismissed);

  // SVG Gauge calculations for 84/100 score
  const score = healthBreakdown.overallScore;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/60 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Financial Intelligence Platform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {businessProfile.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Here’s your business financial health at a glance.
            </p>
          </div>

          {/* Health Score Circular Animated Gauge */}
          <div
            onClick={() => setActiveTab('passport')}
            className="cursor-pointer group flex items-center gap-5 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-500/60 shadow-xl transition-all"
          >
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Score Progress Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-cyan-400 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white group-hover:scale-105 transition-transform">
                  {score}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Score
                </span>
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {healthBreakdown.status}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-100 mt-1">
                Financial Health
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Top 15% in Retail
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 group-hover:underline mt-2">
                View Passport <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Financial Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Monthly Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">
            ₹{metrics.monthlyRevenue.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18% vs last month</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Monthly Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">
            ₹{metrics.monthlyExpenses.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+11% (Marketing spike)</span>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Net Cash Flow
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-cyan-400 mt-2">
            ₹{metrics.netCashFlow.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Positive Cash Surplus
          </p>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => setActiveTab('payments')}
          className="cursor-pointer p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Pending Payments
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">
            ₹{metrics.pendingPayments.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-amber-300 font-semibold">
              3 Overdue Invoices
            </span>
            <span className="text-[11px] text-cyan-400 font-bold group-hover:underline">
              Remind →
            </span>
          </div>
        </div>
      </div>

      {/* AI Quick Actions Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">Quick AI Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('passport')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Financial Passport
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            AI Payment Reminders
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            Ask FIN AI Copilot
          </button>
          <button
            onClick={() => setActiveTab('credit')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            Credit Readiness (83/100)
          </button>
        </div>
      </div>

      {/* Financial Health Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Scores */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Financial Health Pillars
            </h2>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Full Analysis →
            </button>
          </div>

          <div className="space-y-3">
            {/* Revenue Stability */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Revenue Stability</span>
                <span className="text-cyan-400">{healthBreakdown.revenueStability}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${healthBreakdown.revenueStability}%` }}
                />
              </div>
            </div>

            {/* Expense Control */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Expense Control</span>
                <span className="text-amber-400">{healthBreakdown.expenseControl}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{ width: `${healthBreakdown.expenseControl}%` }}
                />
              </div>
            </div>

            {/* Cash Flow Stability */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Cash Flow Stability</span>
                <span className="text-emerald-400">{healthBreakdown.cashFlowStability}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${healthBreakdown.cashFlowStability}%` }}
                />
              </div>
            </div>

            {/* Payment Reliability */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Payment Reliability</span>
                <span className="text-indigo-400">{healthBreakdown.paymentReliability}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${healthBreakdown.paymentReliability}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active AI Risk Alerts */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              AI Risk & Anomaly Monitor
            </h2>
            <button
              onClick={() => setActiveTab('risk')}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              View Monitor →
            </button>
          </div>

          <div className="space-y-3">
            {activeRisks.slice(0, 2).map(alert => (
              <div
                key={alert.id}
                onClick={() => setActiveTab('risk')}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-500/20 hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {alert.title}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
