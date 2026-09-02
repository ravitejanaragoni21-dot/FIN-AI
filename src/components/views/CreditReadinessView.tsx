import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const CreditReadinessView: React.FC = () => {
  const { healthBreakdown, creditFactors, setActiveTab, markInvoicePaid, invoices } = useFinance();
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const score = healthBreakdown.creditReadiness;

  const toggleStep = (stepIdx: number) => {
    if (completedSteps.includes(stepIdx)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepIdx));
    } else {
      setCompletedSteps([...completedSteps, stepIdx]);
    }
  };

  const wizardSteps = [
    {
      title: 'Send Multi-lingual Reminders to Overdue Clients',
      description: 'Dispatch AI reminders for ₹85,000 overdue invoices (Apex Stores & Metro Retail).',
      impact: '+4 Points to Credit Score',
      actionText: 'Go to Invoices',
      onClick: () => setActiveTab('payments')
    },
    {
      title: 'Optimize Monthly Operating Expenses',
      description: 'Cap digital marketing & promo spend at ₹30,000/month to restore profit margins.',
      impact: '+3 Points to Credit Score',
      actionText: 'Review Transactions',
      onClick: () => setActiveTab('transactions')
    },
    {
      title: 'Set Up Auto-Reserve Reserve Fund Goal',
      description: 'Set aside ₹20,000 monthly into liquid reserves to cover 2 months of overheads.',
      impact: '+2 Points to Credit Score',
      actionText: 'View Cash Flow',
      onClick: () => setActiveTab('cashflow')
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Commercial Loan Preparedness</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Credit Readiness Score</h1>
          <p className="text-xs text-slate-400 mt-1">
            FinPass evaluation of RK Traders' credit eligibility for working capital financing.
          </p>
        </div>

        <button
          onClick={() => setShowWizard(!showWizard)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          {showWizard ? 'Close Improvement Wizard' : 'Improve My Credit Readiness'}
        </button>
      </div>

      {/* Score Hero Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/10">
            <span className="text-3xl font-black text-emerald-400">{score}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Out of 100</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-base font-bold text-white">Good Credit Eligibility</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
              RK Traders displays healthy cash surplus and a clean repayment record. Reaching <strong className="text-emerald-400">90+</strong> unlocks pre-approved collateral-free working capital lines up to ₹25 Lakhs.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('passport')}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-colors"
        >
          Generate Passport for Lenders →
        </button>
      </div>

      {/* Interactive Improvement Wizard (Modal / Slide-down) */}
      {showWizard && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-2 border-emerald-500/40 space-y-4 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">
                AI Step-by-Step Credit Enhancement Roadmap
              </h3>
            </div>
            <span className="text-xs text-emerald-300 font-bold">
              {completedSteps.length} of {wizardSteps.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {wizardSteps.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStep(idx)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-colors mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                    </button>

                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                      <span className="inline-block text-[10px] font-extrabold text-emerald-400 mt-1">
                        {step.impact}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={step.onClick}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    {step.actionText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Driver Factors Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Drivers */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Positive Score Drivers (+)
          </h3>

          <div className="space-y-3">
            {creditFactors
              .filter(f => f.impact === 'positive')
              .map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-200">{f.factor}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{f.description}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">+{f.weight} pts</span>
                </div>
              ))}
          </div>
        </div>

        {/* Negative Drag Factors */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Areas to Improve (-)
          </h3>

          <div className="space-y-3">
            {creditFactors
              .filter(f => f.impact === 'negative')
              .map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-200">{f.factor}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{f.description}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400">{f.weight} pts</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
