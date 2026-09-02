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

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(initialBusinessProfile);
  const [metrics, setMetrics] = useState<FinancialMetrics>(initialFinancialMetrics);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(initialRiskAlerts);
  
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return localStorage.getItem('finpass_onboarded') !== 'true';
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


  return (
    <FinanceContext.Provider
      value={{
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
