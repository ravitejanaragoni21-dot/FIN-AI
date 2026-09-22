import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  RefreshCw,
  Ban,
  CheckCircle2,
  XCircle,
  Building2,
  QrCode,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Layers
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { AccountProviderId } from '../../types/financialAccount';

const PROVIDERS = [
  {
    id: 'demo-upi-business' as AccountProviderId,
    name: 'Demo UPI Business Account',
    tagline: 'Instant QR & VPA Transaction Feed (Recommended)',
    category: 'UPI Merchant',
    badge: 'Fast Sync',
    icon: QrCode
  },
  {
    id: 'demo-bank' as AccountProviderId,
    name: 'Demo Commercial Bank',
    tagline: 'Current Account & Corporate Ledger Import',
    category: 'Business Banking',
    badge: 'Full Statement',
    icon: Building2
  },
  {
    id: 'demo-account-aggregator' as AccountProviderId,
    name: 'Demo Account Aggregator Sandbox',
    tagline: 'RBI AA Framework Compliant Sandbox',
    category: 'Account Aggregator',
    badge: 'Consent Standard',
    icon: Layers
  }
];

export const ConnectUPIModal: React.FC = () => {
  const { isConnectUPIOpen, setIsConnectUPIOpen, connectUPIAccount, businessProfile } = useFinance();

  // Wizard Steps: 1 = Overview, 2 = Select Provider, 3 = Grant Permissions, 4 = Connecting Simulation, 5 = Connected Success
  const [step, setStep] = useState<number>(1);
  const [selectedProvider, setSelectedProvider] = useState<AccountProviderId>('demo-upi-business');
  
  // Simulation phase text state
  const [loadingPhase, setLoadingPhase] = useState<string>('Connecting securely...');
  const [importedCount, setImportedCount] = useState<number>(47);

  if (!isConnectUPIOpen) return null;

  const handleClose = () => {
    setIsConnectUPIOpen(false);
    setTimeout(() => {
      setStep(1);
    }, 300);
  };

  const handleStartConnection = () => {
    setStep(2);
  };

  const handleSelectProviderSubmit = () => {
    setStep(3);
  };

  const handleAllowAccessSubmit = async () => {
    setStep(4);
    setLoadingPhase('Connecting securely...');

    setTimeout(() => {
      setLoadingPhase('Verifying consent...');
    }, 900);

    setTimeout(() => {
      setLoadingPhase('Fetching transaction information...');
    }, 1800);

    setTimeout(async () => {
      const res = await connectUPIAccount(selectedProvider);
      if (res && res.transactions) {
        setImportedCount(res.transactions.length);
      }
      setStep(5);
    }, 2700);
  };

  const activeProviderObj = PROVIDERS.find(p => p.id === selectedProvider) || PROVIDERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  HACKATHON DEMO MODULE
                </span>
                <span className="text-xs font-semibold text-slate-400">Step {step} of 5</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Connect Business Financial Account
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body per Step */}
        <div className="p-6 space-y-6">
          {/* STEP 1: Overview & Trust Pillars */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-sm text-slate-300">
                <p className="font-semibold text-white mb-1">
                  Connect your Business Financial Account
                </p>
                <p className="text-xs text-slate-300">
                  Securely connect an eligible financial account to automatically import transaction information into FinPass AI.
                </p>
              </div>

              {/* Trust Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">🔒 Secure Connection</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">256-bit encrypted communication channel.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">🛡️ Consent-based Access</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">You hold 100% explicit control over data sharing.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">🔄 Auto Sync</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Automated synchronization of transactions.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                    <Ban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-rose-300">🚫 No UPI PIN Required</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">FinPass AI never asks for your UPI PIN.</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartConnection}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
                >
                  <span>Connect Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Provider */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-white">Step 1 — Select Financial Provider</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose a simulated provider for this hackathon prototype demonstration.
                </p>
              </div>

              <div className="space-y-3">
                {PROVIDERS.map(prov => {
                  const Icon = prov.icon;
                  const isSelected = selectedProvider === prov.id;

                  return (
                    <div
                      key={prov.id}
                      onClick={() => setSelectedProvider(prov.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-950/90 border-cyan-400 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{prov.name}</h4>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              {prov.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{prov.tagline}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSelectProviderSubmit}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <span>Continue to Permissions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Grant Permission & Security Disclosures */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-white">Step 2 — Grant Permission</h3>
                <blockquote className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-medium">
                  “FinPass AI requests permission to access transaction information for financial analysis.”
                </blockquote>
              </div>

              {/* Granted Permissions List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Granted Data Permissions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Transaction history</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Transaction amount</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Transaction date</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Transaction reference</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-semibold sm:col-span-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Credit / Debit classification & category</span>
                  </div>
                </div>
              </div>

              {/* Explicit FORBIDDEN credentials box */}
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                <p className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-rose-400" />
                  Never Requested & Strictly Forbidden:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-rose-400">
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> ❌ UPI PIN
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> ❌ ATM PIN
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> ❌ Banking Password
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> ❌ OTP
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleAllowAccessSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Allow Access</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Simulated Multi-Stage Loading */}
          {step === 4 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">{loadingPhase}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connecting to {activeProviderObj.name} using secure encryption...
                </p>
              </div>

              <div className="w-full max-w-xs bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full w-3/4 animate-pulse" />
              </div>
            </div>
          )}

          {/* STEP 5: Connected Success Screen */}
          {step === 5 && (
            <div className="py-4 space-y-6 animate-in zoom-in-95">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">✓ Account Connected Successfully</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your business transactions have been imported into FinPass AI.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-semibold">Account:</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    {activeProviderObj.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  <span className="font-extrabold text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    🟢 Connected
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-semibold">Last Synchronized:</span>
                  <span className="font-semibold text-slate-200">Just now</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Transactions Imported:</span>
                  <span className="font-black text-cyan-400 text-sm">{importedCount} Transactions</span>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all"
                >
                  Done & View Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
