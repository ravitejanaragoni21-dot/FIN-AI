import React from 'react';
import {
  QrCode,
  RefreshCw,
  PowerOff,
  Building2,
  Lock,
  Zap,
  CheckCircle2,
  Sparkles,
  Link2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const ConnectedAccountCard: React.FC = () => {
  const {
    connectedAccount,
    isSyncing,
    syncToast,
    syncUPIAccount,
    setIsConnectUPIOpen,
    setIsDisconnectModalOpen
  } = useFinance();

  const isConnected = connectedAccount && connectedAccount.status === 'Connected';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-cyan-500/25 p-5 shadow-xl transition-all">
      {/* Background glow */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isConnected ? 'bg-emerald-500/10' : 'bg-cyan-500/10'
        }`}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Status Information */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-lg ${
              isConnected
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isConnected ? <QrCode className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">
                Business Financial Account
              </h3>

              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  🟢 Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  🔴 Not Connected
                </span>
              )}

              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                DEMO DATA
              </span>
            </div>

            {isConnected ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-300">
                <span className="font-semibold text-slate-200">
                  {connectedAccount?.providerName || 'Demo Business Account'}
                </span>
                <span className="text-slate-400">
                  Last sync: <strong className="text-slate-200">Just now</strong>
                </span>
                <span className="text-cyan-400 font-bold">
                  Transactions: {connectedAccount?.totalTransactionsCount || 47}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Connect your business bank or UPI account to automatically import real-time transactions into FIN AI.
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-center w-full sm:w-auto justify-end">
          {isConnected ? (
            <>
              <button
                onClick={() => syncUPIAccount()}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronizing...' : '🔄 Sync Now'}</span>
              </button>

              <button
                onClick={() => setIsDisconnectModalOpen(true)}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 font-semibold text-xs transition-colors cursor-pointer"
                title="Disconnect Financial Account"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsConnectUPIOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer animate-pulse"
            >
              <Link2 className="w-4 h-4" />
              <span>🔗 Connect Business UPI</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Toast feedback bar during sync */}
      {syncToast && (
        <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{syncToast}</span>
          </div>
          <span className="text-[10px] text-cyan-400 uppercase font-bold">Auto-Synced</span>
        </div>
      )}
    </div>
  );
};
