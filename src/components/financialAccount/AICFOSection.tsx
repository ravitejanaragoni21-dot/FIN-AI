import React, { useMemo } from 'react';
import {
  Bot,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText,
  MessageSquare,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  calculateAICFOSummary,
  generateSmartAlerts,
  SmartAlert
} from '../../services/aicfoEngine';

const SyncPipeline: React.FC<{ stage: string }> = ({ stage }) => {
  const stages = ['Connecting', 'Fetching', 'Processing', 'AI Analysis', 'Updated'];
  const currentIdx = stages.findIndex(s => s === stage);
  if (!stage) return null;

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            i < currentIdx
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : i === currentIdx
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 animate-pulse'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}>{s}</span>
          {i < stages.length - 1 && (
            <span className={`text-[10px] ${i < currentIdx ? 'text-emerald-400' : 'text-slate-700'}`}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const AICFOSection: React.FC = () => {
  const {
    transactions,
    metrics,
    invoices,
    setActiveTab,
    setActiveTab: navTo,
    setWhyDrawerKey,
    connectedAccount,
    isSyncing,
    syncUPIAccount,
    syncStage,
    syncToast,
    setIsConnectUPIOpen
  } = useFinance();

  const cfoSummary = useMemo(
    () => calculateAICFOSummary(transactions, metrics, invoices),
    [transactions, metrics, invoices]
  );

  const smartAlerts = useMemo(
    () => generateSmartAlerts(transactions, metrics),
    [transactions, metrics]
  );

  const isConnected = connectedAccount?.status === 'Connected';

  return (
    <div className="space-y-4">
      {/* ── AI CFO Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white">AI CFO Summary</h2>
            <p className="text-[10px] text-slate-400">Auto-analysed from imported transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo label */}
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            Demo Financial Connection
          </span>

          {isConnected && (
            <button
              onClick={() => syncUPIAccount()}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-[11px] transition-all disabled:opacity-60"
            >
              <Sparkles className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Financial Data'}
            </button>
          )}
        </div>
      </div>

      {/* ── Sync Stage Pipeline ── */}
      {isSyncing && syncStage && <SyncPipeline stage={syncStage} />}
      {syncToast && !isSyncing && (
        <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="text-emerald-400">✓</span>
          {syncToast}
        </div>
      )}

      {/* ── Financial Overview Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Revenue', value: cfoSummary.revenueFormatted, color: 'emerald', icon: TrendingUp, raw: cfoSummary.revenue },
          { label: 'Expenses', value: cfoSummary.expensesFormatted, color: 'rose', icon: TrendingDown, raw: cfoSummary.expenses },
          { label: 'Net Movement', value: cfoSummary.netMovementFormatted, color: 'cyan', icon: ArrowUpRight, raw: cfoSummary.netMovement },
          { label: 'Outstanding', value: cfoSummary.receivablesFormatted, color: 'amber', icon: ArrowDownRight, raw: cfoSummary.receivables }
        ].map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`p-4 rounded-2xl bg-slate-900/80 border transition-all hover:scale-[1.02] ${
                item.color === 'emerald' ? 'border-emerald-500/20 hover:border-emerald-500/40' :
                item.color === 'rose' ? 'border-rose-500/20 hover:border-rose-500/40' :
                item.color === 'cyan' ? 'border-cyan-500/20 hover:border-cyan-500/40' :
                'border-amber-500/20 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                <Icon className={`w-3.5 h-3.5 ${
                  item.color === 'emerald' ? 'text-emerald-400' :
                  item.color === 'rose' ? 'text-rose-400' :
                  item.color === 'cyan' ? 'text-cyan-400' :
                  'text-amber-400'
                }`} />
              </div>
              <p className={`text-xl font-black ${
                item.color === 'emerald' ? 'text-emerald-400' :
                item.color === 'rose' ? 'text-rose-400' :
                item.color === 'cyan' ? 'text-cyan-400' :
                'text-amber-400'
              }`}>{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Transactions Count Row ── */}
      {cfoSummary.transactionCount > 0 && (
        <div
          onClick={() => setActiveTab('transactions')}
          className="cursor-pointer flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-600 transition-colors text-xs"
        >
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <ReceiptText className="w-3.5 h-3.5 text-slate-400" />
            <span>Transactions synchronized</span>
          </div>
          <span className="font-extrabold text-cyan-400">{cfoSummary.transactionCount} Total</span>
        </div>
      )}

      {/* ── AI Insight Card ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/40 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">AI Insight</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{cfoSummary.insight}</p>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setWhyDrawerKey(cfoSummary.insightId === 'receivables_insight' ? 'pending_payments' : 'positive_trend')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors border border-slate-700"
          >
            <HelpCircle className="w-3 h-3" />
            Why?
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-bold transition-colors border border-indigo-500/20"
          >
            <MessageSquare className="w-3 h-3" />
            Ask AI
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-bold transition-colors border border-cyan-500/20"
          >
            <ReceiptText className="w-3 h-3" />
            View Transactions
          </button>
        </div>
      </div>

      {/* ── Smart Alerts ── */}
      {smartAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Smart Alerts</h3>
          <div className="space-y-2">
            {smartAlerts.map((alert: SmartAlert) => (
              <div
                key={alert.id}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                  alert.type === 'danger'
                    ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'
                    : alert.type === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="text-base leading-none mt-0.5">{alert.emoji}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-extrabold ${
                      alert.type === 'danger' ? 'text-rose-300' :
                      alert.type === 'warning' ? 'text-amber-300' :
                      'text-emerald-300'
                    }`}>{alert.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{alert.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => setWhyDrawerKey(alert.traceKey)}
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors border border-slate-700"
                >
                  <HelpCircle className="w-3 h-3" />
                  Why?
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Connect CTA if not connected ── */}
      {!isConnected && (
        <div className="p-4 rounded-2xl border border-dashed border-cyan-500/30 bg-cyan-950/10 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-400">Connect your Business UPI account to import real transaction data for AI analysis.</p>
          <button
            onClick={() => setIsConnectUPIOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition-colors"
          >
            🔗 Connect Business UPI
          </button>
        </div>
      )}
    </div>
  );
};
