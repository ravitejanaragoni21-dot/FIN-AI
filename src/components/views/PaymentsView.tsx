import React, { useState } from 'react';
import {
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Languages,
  Copy,
  Check,
  Sparkles,
  Phone,
  Calendar,
  X
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Invoice } from '../../types/finance';
import { generatePaymentReminder } from '../../services/aiEngine';

export const PaymentsView: React.FC = () => {
  const { invoices, markInvoicePaid } = useFinance();
  const [filter, setFilter] = useState<'All' | 'Overdue' | 'Pending' | 'Paid'>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [reminderLang, setReminderLang] = useState<'en' | 'te' | 'hi'>('en');
  const [copied, setCopied] = useState(false);
  const [sentToast, setSentToast] = useState<string | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'All') return true;
    return inv.status === filter;
  });

  const totalOverdue = invoices
    .filter(i => i.status === 'Overdue')
    .reduce((a, b) => a + b.amount, 0);

  const handleCopyReminder = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = (inv: Invoice, text: string) => {
    setSentToast(`Simulated WhatsApp reminder sent to ${inv.customerName}!`);
    setTimeout(() => setSentToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Toast Notification */}
      {sentToast && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          {sentToast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>Receivables & Payment Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Invoices & Payments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer balances and dispatch AI multi-lingual payment reminders.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Overdue</p>
            <p className="text-base font-black text-rose-400">
              ₹{totalOverdue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
            {invoices.filter(i => i.status === 'Overdue').length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['All', 'Overdue', 'Pending', 'Paid'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? tab === 'Overdue'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800'
            }`}
          >
            {tab}
            <span className="ml-2 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {tab === 'All'
                ? invoices.length
                : invoices.filter(i => i.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Invoice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInvoices.map(inv => {
          const isOverdue = inv.status === 'Overdue';
          const isPaid = inv.status === 'Paid';

          return (
            <div
              key={inv.id}
              onClick={() => setSelectedInvoice(inv)}
              className={`p-5 rounded-2xl border transition-all shadow-xl cursor-pointer flex flex-col justify-between ${
                isOverdue
                  ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/60'
                  : isPaid
                  ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
                  : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{inv.id}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isOverdue
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : isPaid
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {inv.status} {inv.daysOverdue ? `(${inv.daysOverdue}d)` : ''}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100">{inv.customerName}</h3>
                <p className="text-xs text-slate-400 mt-1">{inv.itemsSummary}</p>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Amount</p>
                    <p className="text-lg font-black text-slate-100">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500">Due Date</p>
                    <p className="text-xs font-semibold text-slate-300">{inv.dueDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {!isPaid ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedInvoice(inv);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Payment Reminder
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Payment Cleared
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice Detail & AI Reminder Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Invoice #{selectedInvoice.id}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedInvoice.customerName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Quick Summary */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">Amount Due:</span>
                <p className="text-base font-black text-amber-400 mt-0.5">
                  ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Status:</span>
                <p className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1">
                  {selectedInvoice.status === 'Overdue' && (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  {selectedInvoice.status} ({selectedInvoice.daysOverdue || 0} days)
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Phone:</span>
                <p className="text-slate-200 font-semibold mt-0.5">
                  {selectedInvoice.customerPhone}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Due Date:</span>
                <p className="text-slate-200 font-semibold mt-0.5">
                  {selectedInvoice.dueDate}
                </p>
              </div>
            </div>

            {/* AI Multi-lingual Reminder Generator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-cyan-400" />
                  AI Payment Reminder Generator:
                </span>

                {/* Language Selectors */}
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setReminderLang('en')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      reminderLang === 'en'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setReminderLang('te')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      reminderLang === 'te'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    తెలుగు
                  </button>
                  <button
                    onClick={() => setReminderLang('hi')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      reminderLang === 'hi'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Generated Text Box */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed font-sans relative">
                {generatePaymentReminder(selectedInvoice, reminderLang)}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() =>
                    handleCopyReminder(generatePaymentReminder(selectedInvoice, reminderLang))
                  }
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard' : 'Copy Message'}
                </button>

                <button
                  onClick={() =>
                    handleSendWhatsApp(
                      selectedInvoice,
                      generatePaymentReminder(selectedInvoice, reminderLang)
                    )
                  }
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Send className="w-4 h-4" /> Send via WhatsApp
                </button>
              </div>

              {selectedInvoice.status !== 'Paid' && (
                <button
                  onClick={() => {
                    markInvoicePaid(selectedInvoice.id);
                    setSelectedInvoice(null);
                  }}
                  className="w-full mt-2 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-colors"
                >
                  ✓ Mark Invoice as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
