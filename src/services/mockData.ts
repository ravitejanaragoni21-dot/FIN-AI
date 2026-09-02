import {
  BusinessProfile,
  FinancialMetrics,
  Invoice,
  Transaction,
  CashFlowDataPoint,
  RiskAlert,
  AIInsight,
  AIRecommendation,
  CreditReadinessFactor
} from '../types/finance';

export const initialBusinessProfile: BusinessProfile = {
  id: 'biz_rk_traders_01',
  name: 'RK Traders',
  category: 'Retail',
  location: 'Hyderabad, India',
  gstin: '36AAACR1234F1Z5',
  establishedYear: 2018,
  contactEmail: 'contact@rktradershyd.com',
  contactPhone: '+91 98490 12345'
};

export const initialFinancialMetrics: FinancialMetrics = {
  monthlyRevenue: 450000,
  monthlyExpenses: 320000,
  netCashFlow: 130000,
  pendingPayments: 85000,
  existingMonthlyEmi: 25000,
  cashReserve: 210000
};

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-1023',
    customerName: 'Apex Stores',
    customerPhone: '+91 98765 43210',
    amount: 25000,
    dueDate: '2026-08-15',
    status: 'Overdue',
    daysOverdue: 18,
    itemsSummary: 'Bulk FMCG Inventory - Invoice #1023',
    invoiceDate: '2026-07-15'
  },
  {
    id: 'INV-1024',
    customerName: 'Metro Retail',
    customerPhone: '+91 98480 99887',
    amount: 32000,
    dueDate: '2026-08-10',
    status: 'Overdue',
    daysOverdue: 23,
    itemsSummary: 'Packaged Goods Supplies - Invoice #1024',
    invoiceDate: '2026-07-10'
  },
  {
    id: 'INV-1025',
    customerName: 'Sri Lakshmi Traders',
    customerPhone: '+91 91212 33445',
    amount: 18000,
    dueDate: '2026-09-10',
    status: 'Pending',
    daysOverdue: 0,
    itemsSummary: 'Seasonal Retail Stock - Invoice #1025',
    invoiceDate: '2026-08-25'
  },
  {
    id: 'INV-1026',
    customerName: 'Ravi Enterprises',
    customerPhone: '+91 99890 55667',
    amount: 10000,
    dueDate: '2026-08-28',
    status: 'Paid',
    daysOverdue: 0,
    itemsSummary: 'Confectionery Order - Invoice #1026',
    invoiceDate: '2026-08-01'
  },
  {
    id: 'INV-1027',
    customerName: 'Deccan Mart',
    customerPhone: '+91 94400 11223',
    amount: 15000,
    dueDate: '2026-08-20',
    status: 'Paid',
    daysOverdue: 0,
    itemsSummary: 'Beverages Wholesale - Invoice #1027',
    invoiceDate: '2026-07-20'
  }
];

export const historicalCashFlow: CashFlowDataPoint[] = [
  { period: 'Mar 2026', revenue: 380000, expenses: 290000, netCashFlow: 90000 },
  { period: 'Apr 2026', revenue: 410000, expenses: 300000, netCashFlow: 110000 },
  { period: 'May 2026', revenue: 395000, expenses: 295000, netCashFlow: 100000 },
  { period: 'Jun 2026', revenue: 420000, expenses: 310000, netCashFlow: 110000 },
  { period: 'Jul 2026', revenue: 435000, expenses: 315000, netCashFlow: 120000 },
  { period: 'Aug 2026', revenue: 450000, expenses: 320000, netCashFlow: 130000 }
];

export const forecastCashFlow: CashFlowDataPoint[] = [
  { period: 'Week 1 (Sep 1-7)', revenue: 115000, expenses: 80000, netCashFlow: 35000, projectedBalance: 245000, isForecast: true },
  { period: 'Week 2 (Sep 8-14)', revenue: 110000, expenses: 75000, netCashFlow: 35000, projectedBalance: 280000, isForecast: true },
  { period: 'Week 3 (Sep 15-21)', revenue: 105000, expenses: 95000, netCashFlow: 10000, projectedBalance: 290000, isForecast: true },
  { period: 'Week 4 (Sep 22-30)', revenue: 120000, expenses: 70000, netCashFlow: 50000, projectedBalance: 340000, isForecast: true }
];

export const initialRiskAlerts: RiskAlert[] = [
  {
    id: 'risk_01',
    title: 'Unusual Expense Detected',
    description: 'Marketing expenses are 42% higher than your 3-month average (₹45,000 vs ₹31,600 avg).',
    severity: 'medium',
    category: 'expense',
    timestamp: '2 hours ago',
    dismissed: false,
    actionText: 'Review Marketing Expenses'
  },
  {
    id: 'risk_02',
    title: 'Payment Risk Alert',
    description: 'Customer Apex Stores has delayed payments 3 times consecutively (Overdue: ₹25,000).',
    severity: 'high',
    category: 'payment',
    timestamp: '5 hours ago',
    dismissed: false,
    actionText: 'Send AI Smart Reminder'
  },
  {
    id: 'risk_03',
    title: 'Cash-Flow Shortage Warning',
    description: 'Projected cash balance may fall below recommended reserve in 18 days if ₹85,000 outstanding payments are not collected.',
    severity: 'high',
    category: 'cashflow',
    timestamp: '1 day ago',
    dismissed: false,
    actionText: 'View 30-Day Forecast'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'TXN-9081',
    date: '2026-08-30',
    description: 'Counter Cash & UPI Daily Sales',
    party: 'Walk-in Customers',
    amount: 18500,
    type: 'Credit',
    category: 'Sales',
    aiCategorized: true,
    paymentMethod: 'UPI / Cash'
  },
  {
    id: 'TXN-9080',
    date: '2026-08-29',
    description: 'Store Rental & Maintenance',
    party: 'Hyderabad Commercial Property Ltd',
    amount: 35000,
    type: 'Debit',
    category: 'Operating Expenses',
    aiCategorized: true,
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'TXN-9079',
    date: '2026-08-28',
    description: 'Invoice #1026 Clearance',
    party: 'Ravi Enterprises',
    amount: 10000,
    type: 'Credit',
    category: 'Customer Payments',
    aiCategorized: true,
    paymentMethod: 'UPI'
  },
  {
    id: 'TXN-9078',
    date: '2026-08-25',
    description: 'Monthly Loan EMI Deduction',
    party: 'HDFC Business Bank',
    amount: 25000,
    type: 'Debit',
    category: 'EMIs',
    aiCategorized: true,
    paymentMethod: 'Auto Debit'
  },
  {
    id: 'TXN-9077',
    date: '2026-08-24',
    description: 'FMCG Stock Purchase',
    party: 'Telangana Wholesale Traders',
    amount: 85000,
    type: 'Debit',
    category: 'Purchases',
    aiCategorized: true,
    paymentMethod: 'NEFT'
  },
  {
    id: 'TXN-9076',
    date: '2026-08-22',
    description: 'Digital Marketing & Pamphlets',
    party: 'InstaReach Agency',
    amount: 45000,
    type: 'Debit',
    category: 'Operating Expenses',
    aiCategorized: true,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'TXN-9075',
    date: '2026-08-20',
    description: 'Invoice #1027 Clearance',
    party: 'Deccan Mart',
    amount: 15000,
    type: 'Credit',
    category: 'Customer Payments',
    aiCategorized: true,
    paymentMethod: 'NEFT'
  }
];

export const creditReadinessFactors: CreditReadinessFactor[] = [
  { factor: 'Consistent Revenue Growth', impact: 'positive', description: '+18% revenue growth over last month with stable monthly trend.', weight: 25 },
  { factor: 'Positive Net Cash Flow', impact: 'positive', description: 'Monthly net cash flow surplus of ₹1,30,000.', weight: 25 },
  { factor: 'Regular Transaction History', impact: 'positive', description: 'Over 6 months of active bank & UPI business transaction history.', weight: 20 },
  { factor: 'Good Repayment Behavior', impact: 'positive', description: 'Zero default on existing ₹25,000 monthly EMI.', weight: 15 },
  { factor: 'Outstanding Receivables Drag', impact: 'negative', description: '₹85,000 in outstanding customer receivables (3 overdue invoices).', weight: -12 },
  { factor: 'Volatile Operating Expenses', impact: 'negative', description: 'Marketing spend spike (+42%) reduced operating margin slightly.', weight: -5 }
];
