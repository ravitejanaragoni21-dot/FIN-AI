import React, { useState } from 'react';
import { SlidersHorizontal, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const BusinessDataModal: React.FC = () => {
  const {
    isBusinessModalOpen,
    setIsBusinessModalOpen,
    businessProfile,
    setBusinessProfile,
    metrics,
    setMetrics
  } = useFinance();

  const [name, setName] = useState(businessProfile.name);
  const [category, setCategory] = useState(businessProfile.category);
  const [location, setLocation] = useState(businessProfile.location);

  const [revenue, setRevenue] = useState(metrics.monthlyRevenue.toString());
  const [expenses, setExpenses] = useState(metrics.monthlyExpenses.toString());
  const [pending, setPending] = useState(metrics.pendingPayments.toString());
  const [emi, setEmi] = useState(metrics.existingMonthlyEmi.toString());

  if (!isBusinessModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rev = parseFloat(revenue) || 0;
    const exp = parseFloat(expenses) || 0;
    const pend = parseFloat(pending) || 0;
    const emiVal = parseFloat(emi) || 0;

    setBusinessProfile(prev => ({
      ...prev,
      name,
      category,
      location
    }));

    setMetrics(prev => ({
      ...prev,
      monthlyRevenue: rev,
      monthlyExpenses: exp,
      netCashFlow: rev - exp,
      pendingPayments: pend,
      existingMonthlyEmi: emiVal
    }));

    setIsBusinessModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Customize Business Financial Data</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsBusinessModalOpen(false)}
            className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Modify RK Traders financial parameters to test instant AI score recalculation across the entire platform.
        </p>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Business Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Monthly Revenue (₹)</label>
              <input
                type="number"
                value={revenue}
                onChange={e => setRevenue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Monthly Expenses (₹)</label>
              <input
                type="number"
                value={expenses}
                onChange={e => setExpenses(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pending Payments (₹)</label>
              <input
                type="number"
                value={pending}
                onChange={e => setPending(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Existing Monthly EMI (₹)</label>
              <input
                type="number"
                value={emi}
                onChange={e => setEmi(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all mt-2"
        >
          Update Dashboard & Recalculate AI Health Score
        </button>
      </form>
    </div>
  );
};
