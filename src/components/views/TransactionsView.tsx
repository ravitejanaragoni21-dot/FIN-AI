import React, { useState } from 'react';
import {
  ReceiptText,
  Search,
  Plus,
  Filter,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionCategory } from '../../types/finance';

export const TransactionsView: React.FC = () => {
  const { transactions, addTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new transaction modal
  const [newParty, setNewParty] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'Credit' | 'Debit'>('Credit');
  const [newCat, setNewCat] = useState<TransactionCategory>('Sales');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories: string[] = [
    'All',
    'Sales',
    'Purchases',
    'Suppliers',
    'Customer Payments',
    'Operating Expenses',
    'EMIs'
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParty || !newAmount) return;

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: newDesc || `${newCat} Transaction`,
      party: newParty,
      amount: parseFloat(newAmount),
      type: newType,
      category: newCat,
      paymentMethod: 'UPI / NetBanking'
    });

    setShowAddModal(false);
    setNewParty('');
    setNewDesc('');
    setNewAmount('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <ReceiptText className="w-3.5 h-3.5" />
            <span>AI Automated Categorization</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Business Transactions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ledger categorized automatically by FinPass AI models.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search party or description..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Party & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTransactions.map(txn => {
                const isCredit = txn.type === 'Credit';
                return (
                  <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {txn.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-100">{txn.party}</p>
                      <p className="text-[11px] text-slate-400">{txn.description}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                          {txn.category}
                        </span>
                        {txn.aiCategorized && (
                          <span title="AI Categorized">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{txn.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-right font-black text-sm">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          isCredit ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Add New Transaction
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Party / Customer Name</label>
                <input
                  type="text"
                  required
                  value={newParty}
                  onChange={e => setNewParty(e.target.value)}
                  placeholder="e.g. Telangana Mart Ltd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="e.g. Bulk Supply Stock Purchase"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Credit">Credit (+ Inflow)</option>
                    <option value="Debit">Debit (- Expense)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Category (Auto AI Tagging)
                </label>
                <select
                  value={newCat}
                  onChange={e => setNewCat(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                >
                  <option value="Sales">Sales</option>
                  <option value="Purchases">Purchases</option>
                  <option value="Suppliers">Suppliers</option>
                  <option value="Customer Payments">Customer Payments</option>
                  <option value="Operating Expenses">Operating Expenses</option>
                  <option value="EMIs">EMIs</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all mt-2"
            >
              Add & Calculate FinPass Impact
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
