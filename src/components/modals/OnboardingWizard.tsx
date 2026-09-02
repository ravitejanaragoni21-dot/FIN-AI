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
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { initialBusinessProfile, initialFinancialMetrics } from '../../services/mockData';

export const OnboardingWizard: React.FC = () => {
  const {
    isOnboardingOpen,
    completeOnboarding
  } = useFinance();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>('RK Traders');
  const [category, setCategory] = useState<string>('Retail');
  const [location, setLocation] = useState<string>('Hyderabad, India');
  const [email, setEmail] = useState<string>('contact@rktradershyd.com');
  const [phone, setPhone] = useState<string>('+91 98490 12345');
  const [gstin, setGstin] = useState<string>('36AAACR1234F1Z5');
  const [establishedYear, setEstablishedYear] = useState<number>(2018);

  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(450000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(320000);
  const [cashReserve, setCashReserve] = useState<number>(210000);

  const [pendingPayments, setPendingPayments] = useState<number>(85000);
  const [existingMonthlyEmi, setExistingMonthlyEmi] = useState<number>(25000);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  if (!isOnboardingOpen) return null;

  const netCashFlow = monthlyRevenue - monthlyExpenses;
  const healthEstimate = Math.min(
    95,
    Math.max(
      40,
      Math.round(
        (monthlyRevenue > 0 ? (netCashFlow / monthlyRevenue) * 50 + 55 : 50) -
        (pendingPayments / (monthlyRevenue || 1)) * 25
      )
    )
  );

  const handleQuickLoadDemo = () => {
    setName(initialBusinessProfile.name);
    setCategory(initialBusinessProfile.category);
    setLocation(initialBusinessProfile.location);
    setEmail(initialBusinessProfile.contactEmail || 'contact@rktradershyd.com');
    setPhone(initialBusinessProfile.contactPhone || '+91 98490 12345');
    setGstin(initialBusinessProfile.gstin || '36AAACR1234F1Z5');
    setEstablishedYear(initialBusinessProfile.establishedYear || 2018);

    setMonthlyRevenue(initialFinancialMetrics.monthlyRevenue);
    setMonthlyExpenses(initialFinancialMetrics.monthlyExpenses);
    setCashReserve(initialFinancialMetrics.cashReserve);
    setPendingPayments(initialFinancialMetrics.pendingPayments);
    setExistingMonthlyEmi(initialFinancialMetrics.existingMonthlyEmi);
  };

  const handleFinish = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      completeOnboarding(
        {
          id: `biz_${Date.now()}`,
          name: name || 'My Business',
          category: category || 'Retail',
          location: location || 'India',
          contactEmail: email,
          contactPhone: phone,
          gstin: gstin || '36AAACR1234F1Z5',
          establishedYear: Number(establishedYear) || 2020
        },
        {
          monthlyRevenue: Number(monthlyRevenue) || 0,
          monthlyExpenses: Number(monthlyExpenses) || 0,
          netCashFlow: Number(netCashFlow) || 0,
          pendingPayments: Number(pendingPayments) || 0,
          existingMonthlyEmi: Number(existingMonthlyEmi) || 0,
          cashReserve: Number(cashReserve) || 0
        }
      );
      setIsAnalyzing(false);
    }, 1200);
  };

  const categories = [
    'Retail',
    'Wholesale / Distribution',
    'Manufacturing',
    'Services / Agency',
    'Restaurant & Food',
    'Pharmacy & Healthcare',
    'E-Commerce',
    'Logistics & Transport'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/50 overflow-hidden animate-in zoom-in-95 my-auto">
        {/* Background glow effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white tracking-tight">FinPass AI Setup</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                    Onboarding
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Configure your business parameters to initialize your Business Financial Passport
                </p>
              </div>
            </div>

            {/* Quick Demo Pre-fill Button */}
            <button
              type="button"
              onClick={handleQuickLoadDemo}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
              title="Populate with RK Traders Demo Data"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>⚡ Load RK Traders Demo</span>
            </button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            {[
              { num: 1, label: 'Business Profile', icon: Building2 },
              { num: 2, label: 'Revenue & Expenses', icon: TrendingUp },
              { num: 3, label: 'Receivables & Debt', icon: CreditCard },
              { num: 4, label: 'AI Passport Engine', icon: Sparkles }
            ].map(step => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'text-cyan-400'
                      : isPast
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : isPast
                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800/60 text-slate-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span className="hidden md:inline text-[11px]">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6">
          {/* STEP 1: Business Identity & Contact Info */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Step 1: Business Information & Contact
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your business identity details for the digital financial passport credential.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Business Name <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. RK Traders"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Business Category <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location / City <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Hyderabad, India"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GSTIN Number (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={gstin}
                      onChange={e => setGstin(e.target.value)}
                      placeholder="e.g. 36AAACR1234F1Z5"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono"
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
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. business@rktradershyd.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
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
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +91 98490 12345"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Inflows & Operating Expenses */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Step 2: Monthly Inflow, Outflow & Reserves
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  FinPass AI analyzes your revenue-to-expense margins to forecast cash flow trajectories.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Average Monthly Revenue (₹) <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-slate-500 absolute left-3.5 top-2.5 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={monthlyRevenue}
                      onChange={e => setMonthlyRevenue(Number(e.target.value))}
                      placeholder="450000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Sales collections, client receipts & store income
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
                      onChange={e => setMonthlyExpenses(Number(e.target.value))}
                      placeholder="320000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Rent, supplier stock, staff salaries & utilities
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
                    onChange={e => setCashReserve(Number(e.target.value))}
                    placeholder="210000"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                    required
                  />
                </div>
              </div>

              {/* Live Calculator Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Net Monthly Cash Flow
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    (₹{monthlyRevenue.toLocaleString('en-IN')} - ₹{monthlyExpenses.toLocaleString('en-IN')})
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
                    {netCashFlow >= 0 ? 'Positive Surplus' : 'Operating Deficit'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Receivables & Debt Obligations */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  Step 3: Pending Receivables & Loan Obligations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Used by FinPass to calculate overdue risks, reminder automation, and credit eligibility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pending Customer Payments / Unpaid Invoices (₹)
                  </label>
                  <div className="relative">
                    <span className="text-slate-500 absolute left-3.5 top-2.5 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={pendingPayments}
                      onChange={e => setPendingPayments(Number(e.target.value))}
                      placeholder="85000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-amber-400/80 mt-1 block">
                    FinPass AI will generate multi-lingual automated payment reminders
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
                      onChange={e => setExistingMonthlyEmi(Number(e.target.value))}
                      placeholder="25000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Working capital loans, vehicle loans, or equipment EMIs
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <p className="font-bold text-cyan-300">Credit Health Preview</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    With an estimated monthly surplus of ₹{netCashFlow.toLocaleString('en-IN')} and ₹
                    {existingMonthlyEmi.toLocaleString('en-IN')} EMI burden, your business exhibits strong debt
                    servicing capacity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI Financial Intelligence & Passport Initializer */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Step 4: AI Analysis & Financial Passport Verification
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review your business financial summary before generating your Business Financial Passport.
                </p>
              </div>

              {/* Passport Preview Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {category} • {location} • {email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready to Generate
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Revenue</span>
                    <p className="text-xs font-black text-slate-100 mt-0.5">
                      ₹{monthlyRevenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Expenses</span>
                    <p className="text-xs font-black text-slate-100 mt-0.5">
                      ₹{monthlyExpenses.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Net Surplus</span>
                    <p className="text-xs font-black text-cyan-400 mt-0.5">
                      ₹{netCashFlow.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Health</span>
                    <p className="text-xs font-black text-emerald-400 mt-0.5">
                      {healthEstimate}/100
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Digital Passport Credential will be registered</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Status: Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
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
              onClick={() => setCurrentStep(prev => prev + 1)}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-xl shadow-cyan-500/30 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Financial Passport...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Launch FinPass AI Dashboard 🚀</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
