import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { RiskAlert } from '../../types/finance';

export const RiskMonitorView: React.FC = () => {
  const { riskAlerts, dismissRiskAlert, setActiveTab } = useFinance();
  const [selectedDetail, setSelectedDetail] = useState<RiskAlert | null>(null);

  const activeAlerts = riskAlerts.filter(r => !r.dismissed);

  const handleAction = (alert: RiskAlert) => {
    if (alert.category === 'payment') {
      setActiveTab('payments');
    } else if (alert.category === 'cashflow') {
      setActiveTab('cashflow');
    } else {
      setActiveTab('transactions');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Autonomous Risk Sentinel</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Risk Monitor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time anomaly detection identifying cash flow bottlenecks, unusual expense spikes, and default risks.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
          {activeAlerts.length} Active Anomaly Alerts
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {riskAlerts.map(alert => {
          const isHigh = alert.severity === 'high';

          return (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                alert.dismissed
                  ? 'bg-slate-950/40 border-slate-800 opacity-50'
                  : isHigh
                  ? 'bg-slate-900/90 border-rose-500/40 hover:border-rose-500/70'
                  : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-500/70'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isHigh
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {alert.severity} Risk
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {alert.timestamp}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mt-1">{alert.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>

              {!alert.dismissed && (
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => setSelectedDetail(alert)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => dismissRiskAlert(alert.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Dismiss Alert"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAction(alert)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1"
                  >
                    <span>{alert.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Anomaly Intelligence Briefing
              </h3>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Title</span>
                <p className="text-slate-100 font-bold mt-0.5">{selectedDetail.title}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-bold uppercase text-[10px]">AI Root Cause Analysis</span>
                <p className="text-slate-300 mt-1 leading-relaxed">{selectedDetail.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Mitigation Recommendation</span>
                <p className="text-cyan-400 font-semibold mt-1">
                  Execute recommended action immediately to maintain 84+ Financial Health score.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                handleAction(selectedDetail);
                setSelectedDetail(null);
              }}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all mt-2"
            >
              Take Recommended Action Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
