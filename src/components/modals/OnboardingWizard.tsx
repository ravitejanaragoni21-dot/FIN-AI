import React, { useState, useEffect, useRef } from 'react';
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
  X,
  ArrowRight,
  Cpu,
  Lock,
  Activity,
  Globe2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { initialBusinessProfile, initialFinancialMetrics } from '../../services/mockData';

// Live Background Particles Canvas Component
const LiveBlackCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for cyber finance grid
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? '#06b6d4' : '#3b82f6'
    }));

    const render = () => {
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, width, height);

      // Subtle cyber grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connective lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#06b6d4';
            ctx.globalAlpha = (1 - dist / 110) * 0.18;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export const OnboardingWizard: React.FC = () => {
  const {
    hasAccount,
    isOnboardingOpen,
    setIsOnboardingOpen,
    completeOnboarding
  } = useFinance();

  // Step 0 is the FIN AI Intro Screen; Steps 1-4 are the Registration Flow
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form State - Starts completely empty for fresh accounts
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
    setCurrentStep(1);
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
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
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
    }, 1400);
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
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Live Cyber Particle Canvas Background */}
      <LiveBlackCanvas />

      {/* Radiant Electric Blue Ambient Glow Halos */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-3xl bg-[#030712]/95 border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden animate-zoom-hero my-auto backdrop-blur-2xl">
        
        {/* Close Button (only if account already exists) */}
        {hasAccount && (
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ---------------------------------------------------- */}
        {/* SCREEN 0: FIN AI CINEMATIC INTRO SCREEN              */}
        {/* ---------------------------------------------------- */}
        {currentStep === 0 && (
          <div className="p-6 sm:p-10 text-center relative overflow-hidden">
            {/* Animated Laser Scanning Beam */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

            {/* Glowing FIN AI Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-cyan-300">
                LIVE AUTONOMOUS FINANCIAL INTELLIGENCE
              </span>
            </div>

            {/* Main FIN AI Brand Header with Electric Blue Highlighter Effect */}
            <div className="relative my-4 flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-[0_0_40px_rgba(6,182,212,0.5)] mb-4 animate-float">
                <div className="w-full h-full bg-[#030712] rounded-[22px] flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                </div>
              </div>

              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white flex items-center gap-3">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  FIN AI
                </span>
              </h1>

              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full my-3 glow-blue-highlighter" />

              <p className="max-w-xl text-sm sm:text-base text-slate-300 font-medium leading-relaxed mt-2">
                Empowering businesses with <span className="text-cyan-400 font-bold">Verifiable Financial Passports</span>, automated cash flow forecasting, and multi-lingual AI intelligence.
              </p>
            </div>

            {/* Interactive Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-8 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/25 hover:border-cyan-400/60 transition-all hover:bg-slate-900/90 shadow-lg group">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2.5 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Financial Passport</h4>
                <p className="text-[11px] text-slate-400">
                  Instant QR-verifiable creditworthiness credential for loans and suppliers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/25 hover:border-cyan-400/60 transition-all hover:bg-slate-900/90 shadow-lg group">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2.5 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">30-Day Forecasting</h4>
                <p className="text-[11px] text-slate-400">
                  Real-time cash flow projections with early liquidity deficit warnings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/25 hover:border-cyan-400/60 transition-all hover:bg-slate-900/90 shadow-lg group">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2.5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Voice & Copilot</h4>
                <p className="text-[11px] text-slate-400">
                  AI advisor in English, Telugu, and Hindi for collections and EMIs.
                </p>
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>START PROCESS</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={handleQuickLoadDemo}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:border-cyan-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>⚡ 1-Click Sample Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SCREENS 1-4: FULL STEP-BY-STEP PROCESS              */}
        {/* ---------------------------------------------------- */}
        {currentStep > 0 && (
          <div className="relative">
            {/* Top Navigation & Stepper */}
            <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)]">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                        FIN AI Business Setup
                      </h2>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/40 uppercase tracking-wider glow-cyan">
                        Step {currentStep} of 4
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Fill out your details to configure your Autonomous Business Passport.
                    </p>
                  </div>
                </div>

                {/* Quick Pre-fill Demo Button */}
                <button
                  type="button"
                  onClick={handleQuickLoadDemo}
                  className="self-start sm:self-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
                  title="Click to fill sample data for quick test"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span>⚡ Pre-fill Sample</span>
                </button>
              </div>

              {/* Progress Stepper Bar with Electric Blue Highlighters */}
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
                      className={`flex items-center justify-center sm:justify-start gap-2 text-xs font-bold transition-all p-2 rounded-xl ${
                        isActive
                          ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : isPast
                          ? 'text-slate-300 hover:text-white bg-slate-900/40 border border-slate-800'
                          : 'text-slate-600 bg-slate-950/40 border border-slate-900 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black transition-all ${
                          isActive
                            ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40'
                            : isPast
                            ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
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

            {/* Error Notification Alert */}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step Body Forms */}
            <div className="p-5 sm:p-6">
              {/* STEP 1: Identity & Founder Profile */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800/80 pb-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      Step 1: Business Identity & Founder Details
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter registered commercial name and owner details for cryptographic passport verification.
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
                          className="w-full pl-9 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium glow-cyan"
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
                          className="w-full pl-9 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium glow-cyan"
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
                        className="w-full px-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium"
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
                          className="w-full pl-9 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium"
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
                          className="w-full pl-9 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium"
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
                          className="w-full pl-9 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-medium"
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
                          className="w-full pl-9 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-medium"
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
                        className="w-full px-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Monthly Financials & Liquidity */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800/80 pb-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      Step 2: Monthly Inflows, Operating Expenses & Cash Reserves
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      FIN AI computes operational margin and models your 30-day cash flow curve.
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
                          className="w-full pl-8 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-bold"
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
                          onChange={e => {
                            setMonthlyExpenses(e.target.value);
                            if (errorMsg) setErrorMsg('');
                          }}
                          placeholder="e.g. 350000"
                          className="w-full pl-8 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-bold"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Rent, inventory stock, staff payroll & utilities
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
                        className="w-full pl-8 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* Dynamic Real-Time Margin Box with Blue Highlighter */}
                  <div className="p-4 rounded-2xl bg-black border border-cyan-500/30 flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        Live Net Monthly Surplus Calculation
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        ₹{revNum.toLocaleString('en-IN')} - ₹{expNum.toLocaleString('en-IN')}
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
                        {netCashFlow >= 0 ? 'Positive Operating Surplus' : 'Operating Deficit'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Receivables, Debt & AI Language */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800/80 pb-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      Step 3: Pending Receivables, Loan EMIs & AI Language
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      FIN AI sets up multi-lingual payment recovery automation and loan eligibility score.
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
                          className="w-full pl-8 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-bold"
                        />
                      </div>
                      <span className="text-[10px] text-amber-400/80 mt-1 block">
                        AI will generate multi-lingual automated payment reminders
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
                          className="w-full pl-8 pr-3 py-2.5 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono font-bold"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Working capital, machinery, or vehicle loans
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Preferred Language for FIN AI Copilot
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
                              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                              : 'bg-black border-slate-800 text-slate-400 hover:text-white'
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
                  <div className="border-b border-slate-800/80 pb-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Step 4: AI Financial Passport Verification & Launch
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Confirm parameters. Your verifiable Financial Passport will be cryptographically initialized.
                    </p>
                  </div>

                  {/* Passport Preview Card with Electric Blue Highlighter */}
                  <div className="p-5 rounded-2xl bg-black border-2 border-cyan-500/50 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                          {name ? name.slice(0, 2).toUpperCase() : 'AI'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{name || 'Your Business'}</h4>
                          <p className="text-[11px] text-slate-400">
                            {ownerName && `Owner: ${ownerName} • `}
                            {category} • {location}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Verification Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Revenue</span>
                        <p className="text-xs font-black text-slate-100 mt-0.5 font-mono">
                          ₹{revNum.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Expenses</span>
                        <p className="text-xs font-black text-slate-100 mt-0.5 font-mono">
                          ₹{expNum.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Net Surplus</span>
                        <p className="text-xs font-black text-cyan-400 mt-0.5 font-mono">
                          ₹{netCashFlow.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400">FIN AI Health</span>
                        <p className="text-xs font-black text-emerald-400 mt-0.5 font-mono">
                          {healthEstimate}/100
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Digital Financial Passport Credential QR & PDF ready</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">100% Client-Side Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step Navigation Controls Footer */}
            <div className="p-5 sm:p-6 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setCurrentStep(prev => prev - 1);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all border border-slate-800 hover:border-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{currentStep === 1 ? 'Back to Intro' : 'Back'}</span>
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all hover:scale-105 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>INITIALIZING FIN AI PASSPORT...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>CREATE ACCOUNT & LAUNCH FIN AI 🚀</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
