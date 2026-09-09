export interface BusinessProfile {
  id: string;
  name: string;
  ownerName?: string;
  category: string;
  location: string;
  gstin?: string;
  establishedYear?: number;
  contactEmail?: string;
  contactPhone?: string;
  preferredLanguage?: 'en' | 'te' | 'hi';
}

export interface FinancialMetrics {
  monthlyRevenue: number;
  monthlyExpenses: number;
  netCashFlow: number;
  pendingPayments: number;
  existingMonthlyEmi: number;
  cashReserve: number;
}

export interface FinancialHealthBreakdown {
  overallScore: number;
  status: 'Healthy' | 'Moderate' | 'At Risk';
  revenueStability: number;
  expenseControl: number;
  cashFlowStability: number;
  paymentReliability: number;
  creditReadiness: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerPhone?: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  daysOverdue?: number;
  itemsSummary: string;
  invoiceDate: string;
}

export type TransactionCategory =
  | 'Sales'
  | 'Purchases'
  | 'Suppliers'
  | 'Customer Payments'
  | 'Operating Expenses'
  | 'EMIs';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  party: string;
  amount: number;
  type: 'Credit' | 'Debit';
  category: TransactionCategory;
  aiCategorized: boolean;
  paymentMethod: string;
}

export interface CashFlowDataPoint {
  period: string; // e.g. "Mar", "Apr", "Day 1-5"
  revenue: number;
  expenses: number;
  netCashFlow: number;
  projectedBalance?: number;
  isForecast?: boolean;
}

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: 'expense' | 'payment' | 'cashflow';
  timestamp: string;
  dismissed: boolean;
  actionText: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
  category: string;
  changeValue?: string;
}

export interface AIRecommendation {
  id: string;
  priority: number;
  title: string;
  reason: string;
  expectedImpact: string;
  priorityLevel: 'High' | 'Medium' | 'Low';
  actionText: string;
  actionCompleted: boolean;
}

export interface CreditReadinessFactor {
  factor: string;
  impact: 'positive' | 'negative';
  description: string;
  weight: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: 'en' | 'te' | 'hi';
  suggestedActions?: string[];
  dataPayload?: any;
}
