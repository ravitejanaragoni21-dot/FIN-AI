import React, { useState, useRef } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const PassportView: React.FC = () => {
  const { businessProfile, metrics, healthBreakdown } = useFinance();
  const [hideMetrics, setHideMetrics] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastGenerated, setLastGenerated] = useState<string>('September 02, 2026');
  const [shareToast, setShareToast] = useState<string | null>(null);
  const passportRef = useRef<HTMLDivElement>(null);

  const handleGeneratePassport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLastGenerated(new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }));
      setIsGenerating(false);
      setShareToast('Business Financial Passport updated & verified!');
      setTimeout(() => setShareToast(null), 3000);
    }, 800);
  };

  const handleDownloadPDF = () => {
    setShareToast('Opening Print / PDF Export dialog...');
    setTimeout(() => {
      window.print();
      setShareToast(null);
    }, 400);
  };

  const handleSharePassport = () => {
    if (navigator.share) {
      navigator.share({
        title: `${businessProfile.name} - FIN AI Business Financial Passport`,
        text: `Verified Business Financial Passport for ${businessProfile.name} (Health Score: 84/100).`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast('Passport verification link copied to clipboard!');
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const formatVal = (val: number) => {
    if (hideMetrics) return '••••••••';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          {shareToast}
        </div>
      )}

      {/* Action Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Digital Credential • Verified Profile</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Business Financial Passport</h1>
          <p className="text-xs text-slate-400 mt-1">
            Universal digital passport for lenders, suppliers, and commercial partners.
          </p>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHideMetrics(!hideMetrics)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Privacy Masking"
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
            <span>Share Passport</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Credential Card Container */}
      <div
        ref={passportRef}
        className="relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-cyan-500/40 p-6 md:p-10 shadow-2xl space-y-8 bg-mesh"
      >
        {/* Top Watermark Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-widest text-white uppercase">
                  FIN AI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED IDENTITY
                </span>
              </div>
              <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mt-0.5">
                BUSINESS FINANCIAL PASSPORT
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right">
            <p className="text-[10px] uppercase font-bold text-slate-500">Passport ID</p>
            <p className="text-xs font-mono font-bold text-slate-200">FP-HYD-2026-8891</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Issued: {lastGenerated}</p>
          </div>
        </div>

        {/* Business Metadata Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Business Name</span>
            <h3 className="text-lg font-black text-white mt-0.5">{businessProfile.name}</h3>
            <span className="text-xs font-semibold text-cyan-400">{businessProfile.category} Business</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Location</span>
            <p className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {businessProfile.location}
            </p>
            <span className="text-xs text-slate-400">GSTIN: {businessProfile.gstin}</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500">Financial Health Score</span>
              <p className="text-2xl font-black text-cyan-400 mt-0.5">{healthBreakdown.overallScore}/100</p>
              <span className="text-xs font-bold text-emerald-400">{healthBreakdown.status}</span>
            </div>

            {/* Simulated QR Code for Instant Verification */}
            <div className="p-2 rounded-xl bg-white text-slate-950 flex flex-col items-center justify-center shadow-md">
              <QrCode className="w-10 h-10" />
              <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">SCAN VERIFY</span>
            </div>
          </div>
        </div>

        {/* Financial Metrics Summary Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Verified Financial Key Indicators
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Monthly Revenue</span>
              <p className="text-base font-black text-slate-100 mt-1">
                {formatVal(metrics.monthlyRevenue)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Monthly Expenses</span>
              <p className="text-base font-black text-slate-100 mt-1">
                {formatVal(metrics.monthlyExpenses)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Net Cash Flow</span>
              <p className="text-base font-black text-cyan-400 mt-1">
                {formatVal(metrics.netCashFlow)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Outstanding Payments</span>
              <p className="text-base font-black text-amber-400 mt-1">
                {formatVal(metrics.pendingPayments)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Existing Monthly EMI</span>
              <p className="text-base font-black text-indigo-400 mt-1">
                {formatVal(metrics.existingMonthlyEmi)}
              </p>
            </div>
          </div>
        </div>

        {/* Stability Scores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold">Revenue Stability</span>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">High Stability</p>
            </div>
            <span className="text-xl font-black text-slate-100">
              {healthBreakdown.revenueStability}/100
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold">Payment Reliability</span>
              <p className="text-xs text-indigo-400 font-bold mt-0.5 font-sans">Moderate</p>
            </div>
            <span className="text-xl font-black text-slate-100">
              {healthBreakdown.paymentReliability}/100
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold">Credit Readiness</span>
              <p className="text-xs text-cyan-400 font-bold mt-0.5">Good Standing</p>
            </div>
            <span className="text-xl font-black text-slate-100">
              {healthBreakdown.creditReadiness}/100
            </span>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-500 leading-normal">
          <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>FIN AI Passport Disclaimer:</strong> This Business Financial Passport is presented as a verified digital financial summary and profile based on uploaded ledger transaction records. It does NOT constitute a guaranteed credit score or guaranteed loan approval by regulated banking institutions.
          </p>
        </div>
      </div>
    </div>
  );
};
