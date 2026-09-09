import React from 'react';
import {
  Play,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useFinance, ActiveTab } from '../context/FinanceContext';

interface TourStepDef {
  step: number;
  title: string;
  tab: ActiveTab;
  description: string;
  actionText?: string;
}

const tourSteps: TourStepDef[] = [
  {
    step: 1,
    title: '1. Welcome to FIN AI',
    tab: 'dashboard',
    description: 'Viewing Live Autonomous Business Financial Intelligence Dashboard.'
  },
  {
    step: 2,
    title: '2. View Financial Passport Profile',
    tab: 'passport',
    description: 'Explore the digital Business Financial Passport overview.'
  },
  {
    step: 3,
    title: '3. Inspect Financial Health Score',
    tab: 'dashboard',
    description: 'Animated Score Indicator showing 84/100 (Healthy Status).'
  },
  {
    step: 4,
    title: '4. Revenue & Expenses Summary',
    tab: 'dashboard',
    description: 'Monthly Revenue: ₹4.5L | Expenses: ₹3.2L | Net Cash Flow: ₹1.3L.'
  },
  {
    step: 5,
    title: '5. Dynamic AI Insights',
    tab: 'insights',
    description: 'AI detected +18% revenue growth, +11% expense creep, and receivables.'
  },
  {
    step: 6,
    title: '6. Cash-Flow Prediction Chart',
    tab: 'cashflow',
    description: 'Past 6 months trend + Next 30 days AI forecast (18-day cash shortage warning).'
  },
  {
    step: 7,
    title: '7. ₹85,000 Overdue Receivables',
    tab: 'payments',
    description: 'Apex Stores (₹25k overdue) & Metro Retail (₹32k overdue).'
  },
  {
    step: 8,
    title: '8. AI Payment Reminder (Multi-lingual)',
    tab: 'payments',
    description: 'Generates polite reminders in English, Telugu (తెలుగు), and Hindi (हिंदी).'
  },
  {
    step: 9,
    title: '9. Open FIN AI Copilot',
    tab: 'copilot',
    description: 'Ask financial questions via chat or simulated voice interaction.'
  },
  {
    step: 10,
    title: '10. Question: "Will I have enough cash next month?"',
    tab: 'copilot',
    actionText: 'Ask Question',
    description: 'Copilot analyzes cash flow stability & receivables.'
  },
  {
    step: 11,
    title: '11. AI Response & Visual Recommendations',
    tab: 'copilot',
    description: 'AI provides detailed breakdown and quick action suggestions.'
  },
  {
    step: 12,
    title: '12. Credit Readiness (83/100)',
    tab: 'credit',
    description: 'Factor breakdown: Positive cash flow vs receivables drag + Action wizard.'
  },
  {
    step: 13,
    title: '13. Official Financial Passport Card',
    tab: 'passport',
    description: 'Digital credential with QR code, verification seal & PDF export.'
  },
  {
    step: 14,
    title: '14. Download / Share Passport',
    tab: 'passport',
    description: 'Click Download PDF or Share Passport with privacy masking options.'
  }
];

export const HackathonDemoTour: React.FC = () => {
  const { tourStep, setTourStep, setActiveTab, sendCopilotMessage } = useFinance();

  if (tourStep === null) {
    return (
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-cyan-500/30 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span className="font-semibold">Hackathon Judge Demo Flow:</span>
          <span className="text-slate-300 hidden md:inline">
            Follow the 14-step presentation sequence automatically!
          </span>
        </div>
        <button
          onClick={() => {
            setTourStep(1);
            setActiveTab(tourSteps[0].tab);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 transition-transform active:scale-95"
        >
          <Play className="w-3 h-3 fill-current" />
          Start Guided Demo Tour
        </button>
      </div>
    );
  }

  const currentStepDef = tourSteps.find(s => s.step === tourStep) || tourSteps[0];

  const handleNext = () => {
    if (tourStep < tourSteps.length) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      const nextDef = tourSteps.find(s => s.step === nextStep);
      if (nextDef) {
        setActiveTab(nextDef.tab);
        if (nextStep === 10) {
          sendCopilotMessage('Will I have enough cash next month?');
        }
      }
    } else {
      setTourStep(null);
    }
  };

  const handlePrev = () => {
    if (tourStep > 1) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      const prevDef = tourSteps.find(s => s.step === prevStep);
      if (prevDef) setActiveTab(prevDef.tab);
    }
  };

  return (
    <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b-2 border-cyan-500 px-4 py-2.5 shadow-2xl z-40 relative animate-in fade-in">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
            {currentStepDef.step}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">
                {currentStepDef.title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                Step {tourStep} of {tourSteps.length}
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5">
              {currentStepDef.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handlePrev}
            disabled={tourStep === 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
          >
            {tourStep === tourSteps.length ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Finish Tour
              </>
            ) : (
              <>
                Next Step <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            onClick={() => setTourStep(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Exit Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
