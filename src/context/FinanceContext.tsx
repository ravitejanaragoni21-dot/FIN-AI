import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  BusinessProfile,
  FinancialMetrics,
  FinancialHealthBreakdown,
  Invoice,
  Transaction,
  CashFlowDataPoint,
  RiskAlert,
  AIInsight,
  AIRecommendation,
  CreditReadinessFactor,
  CopilotMessage
} from '../types/finance';

import {
  initialBusinessProfile,
  initialFinancialMetrics,
  initialInvoices,
  historicalCashFlow,
  forecastCashFlow,
  initialRiskAlerts,
  initialTransactions,
  creditReadinessFactors
} from '../services/mockData';

import {
  analyzeFinancialHealth,
  generateInsights,
  generateRecommendations,
  askLiveAICopilot,
  answerFinancialQuestion
} from '../services/aiEngine';

export type ActiveTab =
  | 'dashboard'
  | 'transactions'
  | 'payments'
  | 'insights'
  | 'cashflow'
  | 'passport'
  | 'copilot'
  | 'credit'
  | 'recommendations'
  | 'risk';

interface FinanceContextType {
  hasAccount: boolean;
  resetAccount: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  businessProfile: BusinessProfile;
  setBusinessProfile: React.Dispatch<React.SetStateAction<BusinessProfile>>;
  metrics: FinancialMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<FinancialMetrics>>;
  healthBreakdown: FinancialHealthBreakdown;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  riskAlerts: RiskAlert[];
  dismissRiskAlert: (id: string) => void;
  insights: AIInsight[];
  recommendations: AIRecommendation[];
  historicalCashFlowData: CashFlowDataPoint[];
  forecastCashFlowData: CashFlowDataPoint[];
  creditFactors: CreditReadinessFactor[];
  copilotMessages: CopilotMessage[];
  sendCopilotMessage: (text: string) => void;
  addTransaction: (newTxn: Omit<Transaction, 'id' | 'aiCategorized'>) => void;
  markInvoicePaid: (id: string) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isBusinessModalOpen: boolean;
  setIsBusinessModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (profile: BusinessProfile, newMetrics: FinancialMetrics) => void;
  tourStep: number | null;
  setTourStep: (step: number | null) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const emptyBusinessProfile: BusinessProfile = {
  id: '',
  name: '',
  ownerName: '',
  category: '',
  location: '',
  gstin: '',
  establishedYear: 2024,
  contactEmail: '',
  contactPhone: '',
  preferredLanguage: 'en'
};

const emptyMetrics: FinancialMetrics = {
  monthlyRevenue: 0,
  monthlyExpenses: 0,
  netCashFlow: 0,
  pendingPayments: 0,
  existingMonthlyEmi: 0,
  cashReserve: 0
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasAccount, setHasAccount] = useState<boolean>(() => {
    return !!localStorage.getItem('finpass_account');
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('finpass_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved business profile', e);
      }
    }
    return emptyBusinessProfile;
  });

  const [metrics, setMetrics] = useState<FinancialMetrics>(() => {
    const saved = localStorage.getItem('finpass_metrics');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved metrics', e);
      }
    }
    return emptyMetrics;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('finpass_invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved invoices', e);
      }
    }
    return initialInvoices;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finpass_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved transactions', e);
      }
    }
    return initialTransactions;
  });

  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(initialRiskAlerts);
  
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState<boolean>(false);
  
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('finpass_account');
  });

  const [tourStep, setTourStep] = useState<number | null>(null);

  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Namaste! I am FinPass Copilot. Ask me anything about your revenue, pending payments, cash flow forecast, or loan readiness.',
      timestamp: '10:00 AM'
    }
  ]);

  // Recalculate AI financial health dynamically when metrics change
  const healthBreakdown = useMemo(() => {
    return analyzeFinancialHealth(metrics);
  }, [metrics]);

  // Generate dynamic AI insights
  const insights = useMemo(() => {
    return generateInsights(metrics, invoices);
  }, [metrics, invoices]);

  // Generate dynamic AI recommendations
  const recommendations = useMemo(() => {
    return generateRecommendations(metrics, invoices);
  }, [metrics, invoices]);

  // Dismiss a risk alert
  const dismissRiskAlert = (id: string) => {
    setRiskAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  // Mark invoice as paid and automatically adjust metrics
  const markInvoicePaid = (id: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const updated = { ...inv, status: 'Paid' as const, daysOverdue: 0 };
          return updated;
        }
        return inv;
      })
    );

    const invToPay = invoices.find(i => i.id === id);
    if (invToPay && invToPay.status !== 'Paid') {
      // Update pending payments and cash reserve
      setMetrics(prev => ({
        ...prev,
        pendingPayments: Math.max(0, prev.pendingPayments - invToPay.amount),
        cashReserve: prev.cashReserve + invToPay.amount
      }));

      // Add corresponding transaction entry
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        description: `Payment Received: Invoice #${invToPay.id}`,
        party: invToPay.customerName,
        amount: invToPay.amount,
        type: 'Credit',
        category: 'Customer Payments',
        aiCategorized: true,
        paymentMethod: 'UPI / Bank Transfer'
      };

      setTransactions(prev => [newTxn, ...prev]);
    }
  };

  // Add new manual or imported transaction
  const addTransaction = (newTxn: Omit<Transaction, 'id' | 'aiCategorized'>) => {
    const createdTxn: Transaction = {
      ...newTxn,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      aiCategorized: true
    };

    setTransactions(prev => [createdTxn, ...prev]);

    // Recalculate metrics dynamically based on transaction type
    if (newTxn.type === 'Credit') {
      setMetrics(prev => ({
        ...prev,
        monthlyRevenue: prev.monthlyRevenue + newTxn.amount,
        netCashFlow: prev.netCashFlow + newTxn.amount
      }));
    } else {
      setMetrics(prev => ({
        ...prev,
        monthlyExpenses: prev.monthlyExpenses + newTxn.amount,
        netCashFlow: prev.netCashFlow - newTxn.amount
      }));
    }
  };

  // Send copilot user message and auto-generate AI response
  const sendCopilotMessage = async (text: string) => {
    const userMsg: CopilotMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCopilotMessages(prev => [...prev, userMsg]);

    try {
      const aiAns = await askLiveAICopilot(text, metrics, invoices, transactions, businessProfile.name);
      const aiMsg: CopilotMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: aiAns.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: aiAns.quickActions
      };
      setCopilotMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      const fallbackAns = answerFinancialQuestion(text, metrics, invoices, transactions);
      const aiMsg: CopilotMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: fallbackAns.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: fallbackAns.quickActions
      };
      setCopilotMessages(prev => [...prev, aiMsg]);
    }
  };


  const completeOnboarding = (profile: BusinessProfile, newMetrics: FinancialMetrics) => {
    setBusinessProfile(profile);
    setMetrics(newMetrics);
    setHasAccount(true);
    setIsOnboardingOpen(false);

    // Save to localStorage
    localStorage.setItem('finpass_account', JSON.stringify(profile));
    localStorage.setItem('finpass_metrics', JSON.stringify(newMetrics));
    localStorage.setItem('finpass_onboarded', 'true');

    // Create tailored invoices proportional to pending payments
    const pendingTotal = newMetrics.pendingPayments || 0;
    const inv1 = Math.round(pendingTotal * 0.45);
    const inv2 = Math.round(pendingTotal * 0.35);
    const inv3 = Math.max(0, pendingTotal - inv1 - inv2);

    const customInvoices: Invoice[] = [
      {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: `${profile.name} Client A`,
        customerPhone: '+91 98765 43210',
        amount: inv1 > 0 ? inv1 : 25000,
        dueDate: '2026-08-15',
        status: inv1 > 0 ? 'Overdue' : 'Paid',
        daysOverdue: inv1 > 0 ? 15 : 0,
        itemsSummary: `${profile.category} Service / Supply Order`,
        invoiceDate: '2026-07-15'
      },
      {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: `${profile.name} Wholesale Buyer`,
        customerPhone: '+91 98480 99887',
        amount: inv2 > 0 ? inv2 : 30000,
        dueDate: '2026-08-20',
        status: inv2 > 0 ? 'Overdue' : 'Paid',
        daysOverdue: inv2 > 0 ? 10 : 0,
        itemsSummary: `Bulk ${profile.category} Goods Delivery`,
        invoiceDate: '2026-07-20'
      },
      {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: `Premier Enterprise`,
        customerPhone: '+91 91212 33445',
        amount: inv3 > 0 ? inv3 : 20000,
        dueDate: '2026-09-15',
        status: 'Pending',
        daysOverdue: 0,
        itemsSummary: `Recurring ${profile.category} Contract`,
        invoiceDate: '2026-08-25'
      }
    ];
    setInvoices(customInvoices);
    localStorage.setItem('finpass_invoices', JSON.stringify(customInvoices));

    // Create tailored transactions
    const rev = newMetrics.monthlyRevenue || 100000;
    const exp = newMetrics.monthlyExpenses || 50000;
    const customTxns: Transaction[] = [
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: '2026-08-30',
        description: `${profile.category} Sales Collection`,
        party: 'Direct Commercial Sales',
        amount: Math.round(rev * 0.2),
        type: 'Credit',
        category: 'Sales',
        aiCategorized: true,
        paymentMethod: 'UPI / Bank Transfer'
      },
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: '2026-08-29',
        description: `Operational Outflow & Facility Rent`,
        party: `${profile.location} Commercial Space`,
        amount: Math.round(exp * 0.25),
        type: 'Debit',
        category: 'Operating Expenses',
        aiCategorized: true,
        paymentMethod: 'Bank Transfer'
      },
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: '2026-08-25',
        description: `Inventory & Materials Procurement`,
        party: 'Primary Supply Partner',
        amount: Math.round(exp * 0.4),
        type: 'Debit',
        category: 'Purchases',
        aiCategorized: true,
        paymentMethod: 'NEFT'
      }
    ];
    setTransactions(customTxns);
    localStorage.setItem('finpass_transactions', JSON.stringify(customTxns));

    // Set welcome message with their business and owner name
    setCopilotMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: `Namaste${profile.ownerName ? ` ${profile.ownerName}` : ''}! Welcome to FinPass AI for ${profile.name}. Your Business Financial Passport is ready. You can ask me about cash flow trajectories, payment recovery strategies, or loan readiness.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const resetAccount = () => {
    localStorage.removeItem('finpass_account');
    localStorage.removeItem('finpass_metrics');
    localStorage.removeItem('finpass_invoices');
    localStorage.removeItem('finpass_transactions');
    localStorage.removeItem('finpass_onboarded');
    setBusinessProfile(emptyBusinessProfile);
    setMetrics(emptyMetrics);
    setHasAccount(false);
    setIsOnboardingOpen(true);
  };

  return (
    <FinanceContext.Provider
      value={{
        hasAccount,
        resetAccount,
        activeTab,
        setActiveTab,
        businessProfile,
        setBusinessProfile,
        metrics,
        setMetrics,
        healthBreakdown,
        invoices,
        setInvoices,
        transactions,
        setTransactions,
        riskAlerts,
        dismissRiskAlert,
        insights,
        recommendations,
        historicalCashFlowData: historicalCashFlow,
        forecastCashFlowData: forecastCashFlow,
        creditFactors: creditReadinessFactors,
        copilotMessages,
        sendCopilotMessage,
        addTransaction,
        markInvoicePaid,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isBusinessModalOpen,
        setIsBusinessModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
        tourStep,
        setTourStep
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
