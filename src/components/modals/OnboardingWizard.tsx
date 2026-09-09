import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  CreditCard,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  Zap,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { initialBusinessProfile, initialFinancialMetrics } from '../../services/mockData';

export const OnboardingWizard: React.FC = () => {
  const {
    hasAccount,
    isOnboardingOpen,
    setIsOnboardingOpen,
    completeOnboarding
  } = useFinance();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form State - Starts completely empty for new accounts
  const [name, setName] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gstin, setGstin] = useState<string>('');
  const [establishedYear, setEstablishedYear] = useState<string>('');

  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');
  const [cashReserve, setCashReserve] = useState<string>('');

  const [pendingPayments, setPendingPayments] = useState<string>('');
  const [existingMonthlyEmi, setExistingMonthlyEmi] = useState<string>('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'te' | 'hi'>('en');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  if (!isOnboardingOpen) return null;

  const revNum = Number(monthlyRevenue) || 0;
  const expNum = Number(monthlyExpenses) || 0;
  const resNum = Number(cashReserve) || 0;
  const pendingNum = Number(pendingPayments) || 0;
  const emiNum = Number(existingMonthlyEmi) || 0;

  const netCashFlow = revNum - expNum;
  const healthEstimate = Math.min(
    96,
    Math.max(
      45,
      Math.round(
        (revNum > 0 ? (netCashFlow / revNum) * 45 + 55 : 50) -
        (pendingNum / (revNum || 1)) * 20
      )
    )
  );

  const handleQuickLoadDemo = () => {
    setErrorMsg('');
    setName(initialBusinessProfile.name);
    setOwnerName('Ravi Teja (Proprietor)');
    setCategory(initialBusinessProfile.category);
    setLocation(initialBusinessProfile.location);
    setEmail(initialBusinessProfile.contactEmail || 'contact@rktradershyd.com');
    setPhone(initialBusinessProfile.contactPhone || '+91 98490 12345');
    setGstin(initialBusinessProfile.gstin || '36AAACR1234F1Z5');
    setEstablishedYear(String(initialBusinessProfile.establishedYear || 2018));

    setMonthlyRevenue(String(initialFinancialMetrics.monthlyRevenue));
    setMonthlyExpenses(String(initialFinancialMetrics.monthlyExpenses));
    setCashReserve(String(initialFinancialMetrics.cashReserve));
    setPendingPayments(String(initialFinancialMetrics.pendingPayments));
    setExistingMonthlyEmi(String(initialFinancialMetrics.existingMonthlyEmi));
  };

  const validateStep1 = () => {
    if (!name.trim()) return 'Please enter your Business or Enterprise Name';
    if (!ownerName.trim()) return 'Please enter Founder / Owner Name';
    if (!category.trim()) return 'Please select your Business Category';
    if (!location.trim()) return 'Please enter Business City & State';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid Contact Email Address';
    if (!phone.trim() || phone.trim().length < 8) return 'Please enter a valid Contact Phone Number';
    return '';
  };

  const validateStep2 = () => {
    if (!monthlyRevenue || revNum <= 0) return 'Please enter average monthly revenue (greater than 0)';
    if (!monthlyExpenses || expNum < 0) return 'Please enter average monthly operating expenses';
    if (!cashReserve || resNum < 0) return 'Please enter current liquid cash/bank reserve';
    return '';
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleFinish = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      completeOnboarding(
        {
          id: `biz_${Date.now()}`,
          name: name.trim(),
          ownerName: ownerName.trim(),
          category: category.trim(),
          location: location.trim(),
          contactEmail: email.trim(),
          contactPhone: phone.trim(),
          gstin: gstin.trim() || 'Unregistered / MSME',
          establishedYear: Number(establishedYear) || new Date().getFullYear(),
          preferredLanguage
        },
        {
          monthlyRevenue: revNum,
          monthlyExpenses: expNum,
          netCashFlow: netCashFlow,
          pendingPayments: pendingNum,
          existingMonthlyEmi: emiNum,
          cashReserve: resNum
        }
      );
      setIsAnalyzing(false);
    }, 1200);
  };

  const categories = [
    'Retail Store / Supermarket',
    'Wholesale & Distribution',
    'Manufacturing & Industrial',
    'Services / Digital Agency',
    'Restaurant, Cafe & Food',
    'Pharmacy & Healthcare',
    'E-Commerce & Online Store',
    'Logistics, Transport & Fleet',
    'Agriculture, Dairy & Poultry',
    'Construction & Real Estate',
    'Other Business'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden animate-in zoom-in-95 my-auto">
        {/* Glow ambient background highlights */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 relative">
          {hasAccount && (
            <button
              onClick={() => setIsOnboardingOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8 sm:pr-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white tracking-tight">Business Account Registration</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                    FinPass AI
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Please fill in your business details to establish your Verified Business Financial Passport.
                </p>
              </div>
            </div>

            {/* Quick Demo Pre-fill Button */}
            <button
              type="button"
              onClick={handleQuickLoadDemo}
              className="self-start sm:self-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
              title="Click to fill realistic sample data instantly for testing"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>⚡ Fill Sample Demo</span>
            </button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-4 gap-2">
            {[
              { num: 1, label: 'Identity', icon: Building2 },
              { num: 2, label: 'Financials', icon: TrendingUp },
              { num: 3, label: 'Obligations', icon: CreditCard },
              { num: 4, label: 'AI Passport', icon: Sparkles }
            ].map(step => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (isPast) {
                      setErrorMsg('');
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`flex items-center justify-center sm:justify-start gap-2 text-xs font-bold transition-all p-1.5 rounded-lg ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                      : isPast
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : isPast
                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800/60 text-slate-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span className="hidden sm:inline text-[11px]">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert Box if validation fails */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Body Content */}
        <div className="p-5 sm:p-6">
          {/* STEP 1: Business Identity & Contact Info */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Step 1: Business Identity & Owner Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter legal name, founder profile, and contact details for your business credit verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Business / Enterprise Name <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. Sri Lakshmi Enterprises"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Founder / Owner Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={e => {
                        setOwnerName(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. Ravi Teja"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Industry / Business Category <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => {
                      setCategory(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-medium"
                  >
                    <option value="" disabled className="text-slate-500">
                      -- Select Category --
                    </option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City & State <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={location}
                      onChange={e => {
                        setLocation(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. Hyderabad, Telangana"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. owner@business.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone Number <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GSTIN / Tax ID (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={gstin}
                      onChange={e => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 36AAACR1234F1Z5"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Year Established
                  </label>
                  <input
                    type="number"
                    value={establishedYear}
                    onChange={e => setEstablishedYear(e.target.value)}
                    placeholder="e.g. 2021"
                    min="1950"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Inflows & Operating Expenses */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Step 2: Monthly Inflows, Operating Expenses & Cash Reserves
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  FinPass AI analyzes your monthly operational margin to forecast 30-day cash flows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Average Monthly Revenue / Inflow (₹) <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-slate-500 absolute left-3.5 top-2.5 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={monthlyRevenue}
                      onChange={e => {
                        setMonthlyRevenue(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. 500000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Sales collections, customer receipts & store income
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Average Monthly Operating Expenses (₹) <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-slate-500 absolute left-3.5 top-2.5 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={monthlyExpenses}
                      onChange={e => {
                        setMonthlyExpenses(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. 350000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Rent, supplier raw stock, salaries & utilities
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Liquid Cash / Bank Balance (₹) <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <span className="text-slate-500 absolute left-3.5 top-2.5 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={cashReserve}
                    onChange={e => {
                      setCashReserve(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. 200000"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Live Calculator preview */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Live Net Monthly Margin Estimate
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    (₹{revNum.toLocaleString('en-IN')} - ₹{expNum.toLocaleString('en-IN')})
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-base font-black font-mono ${
                      netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {netCashFlow >= 0 ? '+' : ''}₹{netCashFlow.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] block font-bold text-slate-500">
                    {netCashFlow >= 0 ? 'Operating Surplus' : 'Operating Deficit'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Receivables & Debt Obligations */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  Step 3: Pending Invoices, Loans & AI Language
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  FinPass AI configures automated multi-lingual reminders and debt servicing score.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pending / Uncollected Customer Invoices (₹)
                  </label>
                  <div className="relative">
                    <span className="text-slate-500 absolute left-3.5 top-2.5 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={pendingPayments}
                      onChange={e => setPendingPayments(e.target.value)}
                      placeholder="e.g. 75000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-amber-400/80 mt-1 block">
                    AI will auto-generate multi-lingual WhatsApp & SMS reminders
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Existing Monthly Loan EMI (₹)
                  </label>
                  <div className="relative">
                    <span className="text-slate-500 absolute left-3.5 top-2.5 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={existingMonthlyEmi}
                      onChange={e => setExistingMonthlyEmi(e.target.value)}
                      placeholder="e.g. 20000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Working capital, machinery, or vehicle loan EMIs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Language for AI Copilot & Reports
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'en', label: 'English', desc: 'Global MSME Standard' },
                    { code: 'te', label: 'తెలుగు (Telugu)', desc: 'Regional Vernacular' },
                    { code: 'hi', label: 'हिंदी (Hindi)', desc: 'National Vernacular' }
                  ].map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreferredLanguage(lang.code as 'en' | 'te' | 'hi')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        preferredLanguage === lang.code
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs font-bold">{lang.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lang.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI Financial Intelligence & Passport Summary */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Step 4: AI Financial Passport Verification & Launch
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm your parameters. Your verifiable Financial Passport will be initialized immediately.
                </p>
              </div>

              {/* Passport Preview Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                      {name ? name.slice(0, 2).toUpperCase() : 'BIZ'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{name || 'Your Business'}</h4>
                      <p className="text-[11px] text-slate-400">
                        {ownerName && `Owner: ${ownerName} • `}
                        {category} • {location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Revenue</span>
                    <p className="text-xs font-black text-slate-100 mt-0.5 font-mono">
                      ₹{revNum.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Expenses</span>
                    <p className="text-xs font-black text-slate-100 mt-0.5 font-mono">
                      ₹{expNum.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Net Surplus</span>
                    <p className="text-xs font-black text-cyan-400 mt-0.5 font-mono">
                      ₹{netCashFlow.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">AI Health Score</span>
                    <p className="text-xs font-black text-emerald-400 mt-0.5 font-mono">
                      {healthEstimate}/100
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Digital Passport Credential QR & Shareable PDF ready</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">100% Client-Side Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setCurrentStep(prev => prev - 1);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/25 transition-all"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-cyan-500/30 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Generating AI Financial Passport...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Create Account & Launch FinPass AI 🚀</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
