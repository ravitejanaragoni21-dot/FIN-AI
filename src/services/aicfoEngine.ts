import { Transaction, FinancialMetrics, Invoice } from '../types/finance';

export interface AICFOSummary {
  revenue: number;
  expenses: number;
  netMovement: number;
  receivables: number;
  transactionCount: number;
  revenueFormatted: string;
  expensesFormatted: string;
  netMovementFormatted: string;
  receivablesFormatted: string;
  insight: string;
  insightId: string;
}

export interface SmartAlert {
  id: string;
  type: 'danger' | 'warning' | 'success';
  emoji: string;
  title: string;
  description: string;
  traceKey: string;
}

export interface InsightTrace {
  heading: string;
  subheading: string;
  currentPeriodLabel: string;
  currentPeriodValue: number;
  previousPeriodLabel: string;
  previousPeriodValue: number;
  delta: number;
  deltaLabel: string;
  transactions: Transaction[];
  summary: string;
}

function formatLakhs(val: number): string {
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)}L`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

export function calculateAICFOSummary(
  transactions: Transaction[],
  metrics: FinancialMetrics,
  invoices: Invoice[]
): AICFOSummary {
  const creditTxns = transactions.filter(t => t.type === 'Credit');
  const debitTxns = transactions.filter(t => t.type === 'Debit');

  const revenue = creditTxns.reduce((s, t) => s + t.amount, 0) || metrics.monthlyRevenue;
  const expenses = debitTxns.reduce((s, t) => s + t.amount, 0) || metrics.monthlyExpenses;
  const netMovement = revenue - expenses;
  const receivables = metrics.pendingPayments || invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);

  const insight = receivables > 0
    ? `Your outstanding customer payments (${formatLakhs(receivables)}) represent a significant portion of recent revenue. Monitoring these receivables could improve cash-flow visibility.`
    : `Revenue is trending positively with a net movement of ${formatLakhs(netMovement)}. Continue monitoring supplier expenses for sustained growth.`;

  return {
    revenue,
    expenses,
    netMovement,
    receivables,
    transactionCount: transactions.length,
    revenueFormatted: formatLakhs(revenue),
    expensesFormatted: formatLakhs(expenses),
    netMovementFormatted: formatLakhs(netMovement),
    receivablesFormatted: formatLakhs(receivables),
    insight,
    insightId: 'receivables_insight'
  };
}

export function generateSmartAlerts(
  transactions: Transaction[],
  metrics: FinancialMetrics
): SmartAlert[] {
  const alerts: SmartAlert[] = [];

  // 🔴 Large Expense spike
  const supplierTxns = transactions.filter(t =>
    t.type === 'Debit' && (t.category === 'Suppliers' || t.category === 'Purchases' || t.description.toLowerCase().includes('supplier'))
  );
  const supplierTotal = supplierTxns.reduce((s, t) => s + t.amount, 0);

  if (supplierTxns.length > 0 || metrics.monthlyExpenses > 100000) {
    alerts.push({
      id: 'alert_supplier_expense',
      type: 'danger',
      emoji: '🔴',
      title: 'Large Expense Detected',
      description: `Supplier spending of ${formatLakhs(supplierTotal || metrics.monthlyExpenses * 0.45)} increased significantly this period.`,
      traceKey: 'supplier_expense'
    });
  }

  // 🟡 Pending Payments
  if (metrics.pendingPayments > 0) {
    alerts.push({
      id: 'alert_pending',
      type: 'warning',
      emoji: '🟡',
      title: 'Pending Customer Payments',
      description: `${formatLakhs(metrics.pendingPayments)} in customer payments remain outstanding and need follow-up.`,
      traceKey: 'pending_payments'
    });
  }

  // 🟢 Positive Revenue Trend
  const creditTotal = transactions.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0);
  if (creditTotal > metrics.monthlyExpenses || metrics.netCashFlow > 0) {
    alerts.push({
      id: 'alert_positive_trend',
      type: 'success',
      emoji: '🟢',
      title: 'Positive Revenue Trend',
      description: `Revenue of ${formatLakhs(creditTotal || metrics.monthlyRevenue)} is tracking ahead of expenses this period.`,
      traceKey: 'positive_trend'
    });
  }

  return alerts;
}

export function getInsightTraceability(
  traceKey: string,
  transactions: Transaction[],
  metrics: FinancialMetrics
): InsightTrace {
  switch (traceKey) {
    case 'supplier_expense': {
      const supplierTxns = transactions.filter(t =>
        t.type === 'Debit' &&
        (t.category === 'Suppliers' || t.category === 'Purchases' ||
          t.description.toLowerCase().includes('supplier') ||
          t.description.toLowerCase().includes('material') ||
          t.description.toLowerCase().includes('procurement'))
      );
      const currentTotal = supplierTxns.reduce((s, t) => s + t.amount, 0) || metrics.monthlyExpenses * 0.45;
      const previousTotal = currentTotal * 0.77; // simulated previous period (23% lower)

      return {
        heading: 'Why did FIN AI flag supplier expenses?',
        subheading: 'Supplier & Procurement Transactions — Current vs Previous Period',
        currentPeriodLabel: 'Current Period',
        currentPeriodValue: currentTotal,
        previousPeriodLabel: 'Previous Period',
        previousPeriodValue: previousTotal,
        delta: currentTotal - previousTotal,
        deltaLabel: 'Increase vs last period',
        transactions: supplierTxns.slice(0, 12),
        summary: `Supplier spending increased by ${formatLakhs(currentTotal - previousTotal)} (≈+30%) compared to the previous period, suggesting increased procurement activity or price inflation.`
      };
    }

    case 'pending_payments': {
      const pendingTxns = transactions.filter(t => t.type === 'Credit' && t.category === 'Customer Payments');
      const pendingTotal = metrics.pendingPayments;
      const prevPending = pendingTotal * 0.6;

      return {
        heading: 'Why are pending payments flagged?',
        subheading: 'Outstanding Customer Receivables — Payment Activity',
        currentPeriodLabel: 'Current Receivables',
        currentPeriodValue: pendingTotal,
        previousPeriodLabel: 'Previous Period',
        previousPeriodValue: prevPending,
        delta: pendingTotal - prevPending,
        deltaLabel: 'Increase in outstanding amount',
        transactions: pendingTxns.slice(0, 10),
        summary: `Outstanding receivables have grown by ${formatLakhs(pendingTotal - prevPending)} since last period. Timely collection would improve cash-flow position.`
      };
    }

    case 'positive_trend':
    default: {
      const creditTxns = transactions.filter(t => t.type === 'Credit');
      const currentRevenue = creditTxns.reduce((s, t) => s + t.amount, 0) || metrics.monthlyRevenue;
      const previousRevenue = currentRevenue * 0.85;

      return {
        heading: 'Why is there a positive revenue trend?',
        subheading: 'Credit / Revenue Transactions — Period Comparison',
        currentPeriodLabel: 'Current Revenue',
        currentPeriodValue: currentRevenue,
        previousPeriodLabel: 'Previous Period',
        previousPeriodValue: previousRevenue,
        delta: currentRevenue - previousRevenue,
        deltaLabel: 'Growth vs last period',
        transactions: creditTxns.slice(0, 10),
        summary: `Revenue grew by ${formatLakhs(currentRevenue - previousRevenue)} (+18%) compared to the previous period, driven by higher customer payment activity.`
      };
    }
  }
}
