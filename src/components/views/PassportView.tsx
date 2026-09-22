import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  MapPin,
  FileCheck2,
  Download,
  Share2,
  Eye,
  EyeOff,
  RefreshCw,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Bot,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Link2,
  Sparkles,
  Building2,
  Database,
  Cpu,
  ChevronDown
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { calculateAICFOSummary } from '../../services/aicfoEngine';

const ArchitectureFlow: React.FC = () => {
  const [open, setOpen] = useState(false);

  const steps = [
    { icon: Building2, label: 'BUSINESS', color: 'from-slate-700 to-slate-600' },
    { icon: Link2, label: 'CONNECT FINANCIAL ACCOUNT', color: 'from-cyan-700 to-cyan-600' },
    { icon: ShieldCheck, label: 'CONSENT-BASED ACCESS', color: 'from-indigo-700 to-indigo-600' },
    { icon: Database, label: 'FINPASS DATA LAYER', color: 'from-blue-700 to-blue-600' },
    { icon: Cpu, label: 'FINANCIAL ENGINE (Revenue · Expenses · Receivables · Trends)', color: 'from-purple-700 to-purple-600' },
    { icon: Bot, label: 'AI CFO (Insights · Smart Alerts)', color: 'from-violet-700 to-violet-600' },
    { icon: FileCheck2, label: 'BUSINESS FINANCIAL PASSPORT', color: 'from-emerald-700 to-emerald-600' }
  ];

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Platform Architecture</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">Production Vision</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r ${step.color} text-white`}>
                  <Icon className="w-4 h-4 flex-shrink-0 opacity-90" />
                  <span className="text-[11px] font-extrabold tracking-wide">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-3 bg-slate-700 my-0.5" />
                )}
              </div>
            );
          })}

          <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 leading-relaxed">
            <strong className="text-slate-400">Production ready:</strong> The demo provider can be replaced by an authorized RBI Account Aggregator or Open Banking API. All security constraints (no UPI PIN, no passwords, no OTPs) remain enforced at every layer.
          </p>
        </div>
      )}
    </div>
  );
};

export const PassportView: React.FC = () => {
  const { businessProfile, metrics, healthBreakdown, transactions, invoices, connectedAccount, syncUPIAccount, isSyncing } = useFinance();
  const [hideMetrics, setHideMetrics] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastGenerated, setLastGenerated] = useState<string>('22 Sep 2026');
  const [shareToast, setShareToast] = useState<string | null>(null);

  const cfoSummary = useMemo(
    () => calculateAICFOSummary(transactions, metrics, invoices),
    [transactions, metrics, invoices]
  );

  const txnCount = connectedAccount?.totalTransactionsCount || transactions.length;
  const isConnected = connectedAccount?.status === 'Connected';

  const handleGeneratePassport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLastGenerated(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
      setIsGenerating(false);
      setShareToast('✓ Financial Passport Updated & Verified!');
      setTimeout(() => setShareToast(null), 3500);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    setShareToast('Opening PDF Export...');
    setTimeout(() => {
      window.print();
      setShareToast(null);
    }, 400);
  };

  const handleSharePassport = () => {
    if (navigator.share) {
      navigator.share({
        title: `${businessProfile.name} — FinPass AI Business Financial Passport`,
        text: `Verified Business Financial Passport for ${businessProfile.name} (Health Score: ${healthBreakdown.overallScore}/100).`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast('Passport verification link copied!');
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const formatVal = (val: number) => {
    if (hideMetrics) return '••••••';
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const paymentActivityStatus = healthBreakdown.paymentReliability >= 80 ? 'Healthy' : healthBreakdown.paymentReliability >= 65 ? 'Moderate' : 'Needs Attention';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Toast */}
      {shareToast && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4" />
          {shareToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Digital Credential • Verified Profile</span>
            </div>
            {/* Demo label */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
              🔗 Demo Financial Connection
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Business Financial Passport</h1>
          <p className="text-xs text-slate-400 mt-1">Universal digital passport for lenders, suppliers & commercial partners.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHideMetrics(!hideMetrics)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            {hideMetrics ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>{hideMetrics ? 'Show Values' : 'Hide Values'}</span>
          </button>

          <button
            onClick={handleGeneratePassport}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Re-Generate'}</span>
          </button>

          <button
            onClick={handleSharePassport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Passport
          </button>
        </div>
      </div>

      {/* Passport Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-cyan-500/30 shadow-2xl">
        {/* Top watermark gradient stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        <div className="p-6 md:p-10 space-y-8">
          {/* Passport Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-black tracking-widest text-white uppercase">FINPASS</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mt-0.5">Business Financial Passport</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-500">Passport ID</p>
                <p className="text-xs font-mono font-bold text-slate-200">FP-HYD-2026-8891</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Last Updated: {lastGenerated}</p>
              </div>
              <div className="p-2 rounded-xl bg-white text-slate-950 flex flex-col items-center justify-center shadow-md">
                <QrCode className="w-10 h-10" />
                <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">SCAN VERIFY</span>
              </div>
            </div>
          </div>

          {/* Business Profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Business Name</span>
              <h3 className="text-lg font-black text-white mt-0.5">{businessProfile.name || 'Demo Business'}</h3>
              <span className="text-xs font-semibold text-cyan-400">{businessProfile.category || 'SME'} Business</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Location</span>
              <p className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {businessProfile.location || 'Hyderabad, Telangana'}
              </p>
              {businessProfile.gstin && <span className="text-xs text-slate-400">GSTIN: {businessProfile.gstin}</span>}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Financial Health</span>
                <p className="text-2xl font-black text-cyan-400 mt-0.5">{healthBreakdown.overallScore}/100</p>
                <span className={`text-xs font-bold ${
                  healthBreakdown.status === 'Healthy' ? 'text-emerald-400' :
                  healthBreakdown.status === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
                }`}>{healthBreakdown.status}</span>
              </div>
            </div>
          </div>

          {/* ── Separator ── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Financial Overview</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Revenue', value: formatVal(cfoSummary.revenue || metrics.monthlyRevenue), color: 'emerald', icon: TrendingUp },
              { label: 'Expenses', value: formatVal(cfoSummary.expenses || metrics.monthlyExpenses), color: 'rose', icon: TrendingDown },
              { label: 'Net Movement', value: formatVal(cfoSummary.netMovement || metrics.netCashFlow), color: 'cyan', icon: ArrowUpRight },
              { label: 'Receivables', value: formatVal(cfoSummary.receivables || metrics.pendingPayments), color: 'amber', icon: ArrowUpRight },
              { label: 'Transactions', value: hideMetrics ? '••' : String(txnCount), color: 'indigo', icon: FileCheck2 }
            ].map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className={`p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center`}>
                  <Icon className={`w-4 h-4 mx-auto mb-1.5 ${
                    m.color === 'emerald' ? 'text-emerald-400' :
                    m.color === 'rose' ? 'text-rose-400' :
                    m.color === 'cyan' ? 'text-cyan-400' :
                    m.color === 'amber' ? 'text-amber-400' : 'text-indigo-400'
                  }`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">{m.label}</span>
                  <p className={`text-base font-black mt-1 ${
                    m.color === 'emerald' ? 'text-emerald-400' :
                    m.color === 'rose' ? 'text-rose-400' :
                    m.color === 'cyan' ? 'text-cyan-400' :
                    m.color === 'amber' ? 'text-amber-400' : 'text-indigo-300'
                  }`}>{m.value}</p>
                </div>
              );
            })}
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold">Payment Activity</span>
                <p className={`text-xs font-bold mt-0.5 ${
                  paymentActivityStatus === 'Healthy' ? 'text-emerald-400' :
                  paymentActivityStatus === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
                }`}>{paymentActivityStatus}</p>
              </div>
              <span className="text-xl font-black text-slate-100">{healthBreakdown.paymentReliability}/100</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold">Recent Activity</span>
                <p className="text-xs font-bold text-cyan-400 mt-0.5">{txnCount} transactions</p>
              </div>
              <span className="text-xl font-black text-slate-100">{healthBreakdown.revenueStability}/100</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold">AI Summary</span>
                <p className="text-xs font-bold text-indigo-400 mt-0.5">Available</p>
              </div>
              <span className="text-xl font-black text-slate-100">{healthBreakdown.creditReadiness}/100</span>
            </div>
          </div>

          {/* AI Summary excerpt */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">AI Summary</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{cfoSummary.insight}</p>
          </div>

          {/* One-Click Sync CTA */}
          {isConnected && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
              <div>
                <p className="text-xs font-bold text-slate-200">Keep Passport Updated</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sync latest transactions to refresh passport metrics.</p>
              </div>
              <button
                onClick={() => syncUPIAccount()}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition-all disabled:opacity-60 shadow-lg shadow-cyan-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Financial Data'}
              </button>
            </div>
          )}

          {/* Legal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-500 leading-normal">
            <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-400">FinPass AI Passport Disclaimer:</strong> This passport is a verified digital financial summary based on imported ledger transaction records tagged as DEMO DATA. It does not constitute a guaranteed credit score or loan approval by regulated banking institutions. A real RBI-authorized Account Aggregator integration is the production path.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Flow */}
      <ArchitectureFlow />

      {/* Pitch Line */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-cyan-950/60 border border-indigo-500/25 text-center">
        <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-white leading-relaxed max-w-xl mx-auto">
          "FinPass AI doesn't just show businesses their transactions. It turns their financial data into an intelligent, continuously updated <span className="text-cyan-400">Business Financial Passport</span>."
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">🏆 FinPass AI — iQoo Hackathon 2026</span>
        </div>
      </div>
    </div>
  );
};
