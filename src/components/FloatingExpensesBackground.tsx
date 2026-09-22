import React from 'react';
import { ArrowUpRight, ArrowDownRight, Zap, ShieldCheck } from 'lucide-react';

interface FloatingItem {
  id: string;
  label: string;
  amount: string;
  type: 'CREDIT' | 'DEBIT' | 'UPI';
  tag: string;
  top: string;
  left: string;
  animationDelay: string;
  duration: string;
  scale: string;
  blur: string;
}

const FLOATING_EXPENSES: FloatingItem[] = [
  {
    id: 'f1',
    label: 'Sri Ram Retailers',
    amount: '+₹25,000',
    type: 'CREDIT',
    tag: 'UPI QR Payment',
    top: '12%',
    left: '8%',
    animationDelay: '0s',
    duration: '14s',
    scale: 'scale-90',
    blur: 'blur-[0.3px]'
  },
  {
    id: 'f2',
    label: 'Godrej Material Procurement',
    amount: '-₹8,500',
    type: 'DEBIT',
    tag: 'Supplier Outflow',
    top: '28%',
    left: '82%',
    animationDelay: '2.5s',
    duration: '16s',
    scale: 'scale-95',
    blur: 'blur-[0px]'
  },
  {
    id: 'f3',
    label: 'Laxmi Traders Hyderabad',
    amount: '+₹12,000',
    type: 'CREDIT',
    tag: 'Customer Collection',
    top: '68%',
    left: '5%',
    animationDelay: '1.2s',
    duration: '15s',
    scale: 'scale-85',
    blur: 'blur-[0.5px]'
  },
  {
    id: 'f4',
    label: 'TATA Power Utilities',
    amount: '-₹3,200',
    type: 'DEBIT',
    tag: 'Auto-Debit Bill',
    top: '78%',
    left: '78%',
    animationDelay: '4.1s',
    duration: '18s',
    scale: 'scale-90',
    blur: 'blur-[0.2px]'
  },
  {
    id: 'f5',
    label: 'Metro Supermarket Vizag',
    amount: '+₹48,000',
    type: 'CREDIT',
    tag: 'Bulk Settlement',
    top: '44%',
    left: '90%',
    animationDelay: '3.3s',
    duration: '13s',
    scale: 'scale-100',
    blur: 'blur-[0px]'
  },
  {
    id: 'f6',
    label: 'UPI Merchant Sync',
    amount: '47 TXNs',
    type: 'UPI',
    tag: 'Auto-Synced',
    top: '85%',
    left: '35%',
    animationDelay: '5s',
    duration: '17s',
    scale: 'scale-85',
    blur: 'blur-[0.4px]'
  }
];

export const FloatingExpensesBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/3 right-10 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Financial Expense Pills */}
      {FLOATING_EXPENSES.map(item => {
        const isCredit = item.type === 'CREDIT';
        const isDebit = item.type === 'DEBIT';

        return (
          <div
            key={item.id}
            style={{
              top: item.top,
              left: item.left,
              animationDelay: item.animationDelay,
              animationDuration: item.duration
            }}
            className={`absolute animate-float ${item.scale} ${item.blur} transition-all duration-700 hidden md:flex items-center gap-3 px-3.5 py-2 rounded-2xl border shadow-xl backdrop-blur-md ${
              isCredit
                ? 'bg-slate-950/70 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10'
                : isDebit
                ? 'bg-slate-950/70 border-rose-500/30 text-rose-300 shadow-rose-500/10'
                : 'bg-slate-950/70 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCredit
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isDebit
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              }`}
            >
              {isCredit ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : isDebit ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">{item.label}</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {item.tag}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs font-black ${
                    isCredit ? 'text-emerald-400' : isDebit ? 'text-rose-400' : 'text-cyan-400'
                  }`}
                >
                  {item.amount}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-cyan-500" /> Live Feed
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
