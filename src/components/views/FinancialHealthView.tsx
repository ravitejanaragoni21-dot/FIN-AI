import React from 'react';
import { ShieldCheck, TrendingUp, DollarSign, Receipt, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const FinancialHealthView: React.FC = () => {
  const { healthBreakdown, metrics, setActiveTab } = useFinance();

  const healthPillars = [
    {
      title: 'Financial Health',
      score: healthBreakdown.overallScore,
      status: healthBreakdown.status,
      icon: ShieldCheck,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      description: 'Overall financial stability derived from cash flow, revenue growth, receivables, and repayment history.'
    },
    {
      title: 'Revenue Stability',
      score: healthBreakdown.revenueStability,
      status: 'Stable Growth',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      description: '+18% revenue increase over last month. Consistent order volume across Retail customers.'
    },
    {
      title: 'Expense Control',
      score: healthBreakdown.expenseControl,
      status: 'Needs Monitoring',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      description: 'Expenses grew 11% this month due to an unbudgeted 42% spike in marketing spend.'
    },
    {
      title: 'Cash Flow Stability',
      score: healthBreakdown.cashFlowStability,
      status: 'Strong Surplus',
      icon: TrendingUp,
      color: 'from-cyan-500 to-indigo-500',
      textColor: 'text-cyan-400',
      description: 'Net monthly cash flow of ₹1,30,000 provides healthy operational liquidity.'
    },
    {
      title: 'Payment Reliability',
      score: healthBreakdown.paymentReliability,
      status: 'Action Needed',
      icon: Receipt,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      description: '₹85,000 in customer receivables remain pending across 3 invoices.'
    },
    {
      title: 'Credit Readiness',
      score: healthBreakdown.creditReadiness,
      status: 'Financing Ready',
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      description: 'High likelihood of approval for working capital loans up to ₹15,000,000.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Health Diagnostics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Financial Health Pillars</h1>
          <p className="text-xs text-slate-400 mt-1">
            In-depth evaluation of RK Traders' financial resilience and capital efficiency.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('passport')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          View Business Financial Passport →
        </button>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {healthPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${pillar.textColor}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{pillar.title}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{pillar.status}</span>
                    </div>
                  </div>
                  <span className={`text-2xl font-black ${pillar.textColor}`}>
                    {pillar.score}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1">
                  <span>Score Rating</span>
                  <span>{pillar.score} / 100</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${pillar.color} rounded-full transition-all duration-700`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
