import {
  FinancialMetrics,
  FinancialHealthBreakdown,
  Invoice,
  Transaction,
  CashFlowDataPoint,
  AIInsight,
  AIRecommendation,
  RiskAlert,
  CopilotMessage
} from '../types/finance';

/**
 * AI Engine for FinPass AI
 * Modularized logic ready for integration with LLM API (OpenAI / Gemini)
 */

export function analyzeFinancialHealth(metrics: FinancialMetrics): FinancialHealthBreakdown {
  const { monthlyRevenue, monthlyExpenses, netCashFlow, pendingPayments, existingMonthlyEmi } = metrics;
  
  // Calculate revenue stability (0-100)
  const revenueStability = Math.min(95, Math.round((monthlyRevenue / 500000) * 88));
  
  // Calculate expense control score (lower expenses ratio is better)
  const expenseRatio = monthlyExpenses / (monthlyRevenue || 1);
  const expenseControl = Math.max(50, Math.round(100 - expenseRatio * 30));
  
  // Cash flow stability score
  const cashFlowStability = Math.min(95, Math.round((netCashFlow / 150000) * 86));

  // Payment reliability score (impacted by pending payments ratio)
  const pendingRatio = pendingPayments / (monthlyRevenue || 1);
  const paymentReliability = Math.max(60, Math.round(95 - pendingRatio * 75));

  // Credit readiness (impacted by EMI capability & net income)
  const emiCoverage = netCashFlow / (existingMonthlyEmi || 1);
  const creditReadiness = Math.min(95, Math.max(50, Math.round(emiCoverage * 16 + 25)));

  // Overall Financial Health Score (Weighted Average)
  const overallScore = Math.round(
    revenueStability * 0.25 +
    expenseControl * 0.20 +
    cashFlowStability * 0.25 +
    paymentReliability * 0.15 +
    creditReadiness * 0.15
  );

  let status: 'Healthy' | 'Moderate' | 'At Risk' = 'Healthy';
  if (overallScore < 60) status = 'At Risk';
  else if (overallScore < 75) status = 'Moderate';

  return {
    overallScore,
    status,
    revenueStability,
    expenseControl,
    cashFlowStability,
    paymentReliability,
    creditReadiness
  };
}

export function generateInsights(metrics: FinancialMetrics, invoices: Invoice[]): AIInsight[] {
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
  const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + i.amount, 0);

  return [
    {
      id: 'ins_1',
      title: 'Revenue Growth Trend',
      description: 'Your revenue increased 18% compared with last month (₹4,50,000 vs ₹3,80,000).',
      type: 'positive',
      category: 'Revenue',
      changeValue: '+18%'
    },
    {
      id: 'ins_2',
      title: 'Expense Creep Warning',
      description: 'Your expenses increased 11% this month, primarily due to seasonal stock inventory and marketing.',
      type: 'warning',
      category: 'Expenses',
      changeValue: '+11%'
    },
    {
      id: 'ins_3',
      title: 'Outstanding Customer Receivables',
      description: `₹${metrics.pendingPayments.toLocaleString('en-IN')} in customer payments are currently outstanding across ${invoices.filter(i => i.status !== 'Paid').length} accounts.`,
      type: 'warning',
      category: 'Payments',
      changeValue: `₹${metrics.pendingPayments.toLocaleString('en-IN')}`
    },
    {
      id: 'ins_4',
      title: 'Overdue Invoices Action Required',
      description: `${overdueCount} invoices totaling ₹${overdueAmount.toLocaleString('en-IN')} are past due date.`,
      type: 'warning',
      category: 'Risk',
      changeValue: `${overdueCount} Invoices`
    },
    {
      id: 'ins_5',
      title: 'AI Cash-Flow Shortage Prediction',
      description: 'Based on current cash-flow patterns, your business may experience a cash-flow shortage in approximately 18 days if outstanding payments are not collected.',
      type: 'warning',
      category: 'Forecast',
      changeValue: '18 Days Risk'
    }
  ];
}

export function generateRecommendations(metrics: FinancialMetrics, invoices: Invoice[]): AIRecommendation[] {
  const overdueTotal = invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0);
  
  return [
    {
      id: 'rec_1',
      priority: 1,
      title: `Collect ₹${overdueTotal.toLocaleString('en-IN')} from overdue customers`,
      reason: 'Apex Stores (₹25k) and Metro Retail (₹32k) are overdue by >18 days.',
      expectedImpact: 'Improves cash balance immediately and eliminates short-term 18-day liquidity risk.',
      priorityLevel: 'High',
      actionText: 'Send AI Payment Reminders',
      actionCompleted: false
    },
    {
      id: 'rec_2',
      priority: 2,
      title: 'Reduce unnecessary monthly expenses by ~₹15,000',
      reason: 'Marketing spends jumped 42% above 3-month average without proportional direct conversions.',
      expectedImpact: 'Increases net monthly cash flow from ₹1.30L to ₹1.45L (+11.5%).',
      priorityLevel: 'Medium',
      actionText: 'Optimize Expense Budget',
      actionCompleted: false
    },
    {
      id: 'rec_3',
      priority: 3,
      title: 'Maintain at least 2 months of operating expenses as a cash reserve',
      reason: 'Current liquid cash reserves cover 1.4 months of operating overheads.',
      expectedImpact: 'Boosts Credit Readiness score from 83/100 to 91/100 for future bank financing.',
      priorityLevel: 'Medium',
      actionText: 'Set Auto-Reserve Goal',
      actionCompleted: false
    }
  ];
}

export function generatePaymentReminder(invoice: Invoice, language: 'en' | 'te' | 'hi' = 'en'): string {
  const amountStr = `₹${invoice.amount.toLocaleString('en-IN')}`;
  
  if (language === 'te') {
    return `నమస్కారం ${invoice.customerName}, RK Traders నుండి చిన్న జ్ఞాపిక. మీ ఇన్వాయిస్ #${invoice.id} మొత్తం ${amountStr} బకాయిపడి ఉంది. దయచేసి త్వరగా చెల్లించగలరని మనవి. ఏవైనా సందేహాలు ఉంటే మమ్మల్ని సంప్రదించండి. ధన్యవాదాలు!`;
  }
  
  if (language === 'hi') {
    return `नमस्ते ${invoice.customerName}, RK Traders की ओर से एक विनम्र रिमाइंडर। आपका चालान #${invoice.id} राशि ${amountStr} का भुगतान लंबित है। कृपया जल्द से जल्द भुगतान करने में सहायता करें। धन्यवाद!`;
  }

  // English default
  return `Hello ${invoice.customerName}, this is a friendly reminder regarding invoice #${invoice.id} for ${amountStr}, which is currently overdue by ${invoice.daysOverdue || 0} days. Please let us know if you need any assistance. Thank you! - RK Traders`;
}

export async function askLiveAICopilot(
  query: string,
  metrics: FinancialMetrics,
  invoices: Invoice[],
  transactions: Transaction[],
  businessName: string = 'RK Traders'
): Promise<{ response: string; quickActions?: string[] }> {
  const apiKey =
    localStorage.getItem('finpass_gemini_api_key') ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    '';

  if (!apiKey || apiKey.trim() === '') {
    // Fallback to local intelligent rule-based response
    return answerFinancialQuestion(query, metrics, invoices, transactions);
  }

  try {
    const overdueInvoices = invoices.filter(i => i.status === 'Overdue');
    const pendingInvoices = invoices.filter(i => i.status !== 'Paid');
    const systemPrompt = `You are FinPass AI, an expert conversational financial advisor and CFO copilot for small and medium businesses in India (currently assisting ${businessName}).
Financial Summary:
- Monthly Revenue: ₹${metrics.monthlyRevenue.toLocaleString('en-IN')}
- Monthly Operating Expenses: ₹${metrics.monthlyExpenses.toLocaleString('en-IN')}
- Net Monthly Cash Flow: ₹${metrics.netCashFlow.toLocaleString('en-IN')}
- Cash Reserves: ₹${metrics.cashReserve.toLocaleString('en-IN')}
- Total Pending Receivables: ₹${metrics.pendingPayments.toLocaleString('en-IN')} across ${pendingInvoices.length} accounts
- Overdue Receivables: ${overdueInvoices.map(i => `${i.customerName} (₹${i.amount}, ${i.daysOverdue} days overdue)`).join(', ') || 'None'}
- Existing Monthly EMI: ₹${metrics.existingMonthlyEmi.toLocaleString('en-IN')}
- Overall Financial Health Score: 84/100 (Healthy)
- Credit Readiness Score: 83/100 (Good)

Guidelines:
1. Provide concise, clear, and actionable advice tailored to Indian SMBs (MSMEs).
2. Format important figures with ₹ and Indian numbering (e.g., ₹1,30,000).
3. If the user asks in Telugu, Hindi, or English, reply in that language or friendly Hinglish/Telugish if appropriate.
4. Keep answers under 3-4 bullet points or short paragraphs for fast reading.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Question: ${query}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API returned non-OK response, falling back to local engine:', response.statusText);
      return answerFinancialQuestion(query, metrics, invoices, transactions);
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      answerFinancialQuestion(query, metrics, invoices, transactions).response;

    return {
      response: replyText,
      quickActions: ['How much money is pending?', 'Cash flow forecast', 'Credit readiness']
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return answerFinancialQuestion(query, metrics, invoices, transactions);
  }
}

export function answerFinancialQuestion(
  query: string,
  metrics: FinancialMetrics,
  invoices: Invoice[],
  transactions: Transaction[]
): { response: string; quickActions?: string[] } {
  const q = query.toLowerCase();

  if (q.includes('pending') || q.includes('how much money is pending') || q.includes('outstanding')) {
    const overdue = invoices.filter(i => i.status === 'Overdue');
    const totalPending = metrics.pendingPayments;
    const overdueTotal = overdue.reduce((acc, i) => acc + i.amount, 0);
    return {
      response: `You have **₹${totalPending.toLocaleString('en-IN')}** total pending payments. Out of this, **₹${overdueTotal.toLocaleString('en-IN')}** is overdue across ${overdue.length} accounts: **Apex Stores** (₹25,000) and **Metro Retail** (₹32,000).`,
      quickActions: ['Send Reminders to Overdue Customers', 'View Invoices Page']
    };
  }

  if (q.includes('owe me') || q.includes('which customers owe me')) {
    return {
      response: `Here are your top customers with outstanding payments:\n1. **Metro Retail**: ₹32,000 (23 days overdue)\n2. **Apex Stores**: ₹25,000 (18 days overdue)\n3. **Sri Lakshmi Traders**: ₹18,000 (Due Sep 10)`,
      quickActions: ['Generate AI Reminder for Metro Retail', 'Generate AI Reminder for Apex Stores']
    };
  }

  if (q.includes('enough cash') || q.includes('cash next month') || q.includes('future cash')) {
    return {
      response: `Yes, your overall cash flow remains positive. Projected net revenue for next month is **₹4,50,000** against **₹3,20,000** expected expenses. However, collecting the **₹85,000** pending receivables is critical to prevent short-term liquidity pressure around Day 18.`,
      quickActions: ['View 30-Day Cash Flow Forecast', 'Check AI Risk Monitor']
    };
  }

  if (q.includes('expenses increase') || q.includes('why did my expenses')) {
    return {
      response: `Your expenses increased by **11%** (₹3,20,000 vs ₹2,90,000 baseline). Primary driver: A **42% surge in marketing & advertising spend** (₹45,000 spent vs ₹31,600 historical monthly average).`,
      quickActions: ['View Operating Expense Transactions', 'Set Marketing Budget Limit']
    };
  }

  if (q.includes('risk') || q.includes('biggest financial risks')) {
    return {
      response: `FinPass AI identified 3 active risks:\n• **High Risk**: Cash-flow shortage projected in 18 days if receivables are delayed.\n• **High Risk**: Repeat payment delays by Apex Stores.\n• **Medium Risk**: Marketing expenses 42% above normal average.`,
      quickActions: ['Open AI Risk Monitor', 'Collect Pending Payments']
    };
  }

  if (q.includes('revenue trend') || q.includes('show my revenue')) {
    return {
      response: `Your monthly revenue has grown steadily for 6 consecutive months, rising from **₹3,80,000** in March to **₹4,50,000** in August (+18.4% total growth). Revenue stability score is **88/100**.`,
      quickActions: ['View Revenue Chart', 'Open Passport Profile']
    };
  }

  if (q.includes('apply for financing') || q.includes('ready to apply') || q.includes('loan')) {
    return {
      response: `Your Credit Readiness score is **83/100** (Good). Strengths: Consistent monthly cash surplus of ₹1,30,000 and clean EMI repayment track record. **To reach 90+**: Collect ₹85,000 pending receivables and stabilize marketing expenses.`,
      quickActions: ['View Credit Readiness Breakdown', 'Generate Business Financial Passport']
    };
  }

  // Fallback response
  return {
    response: `Based on RK Traders' financial data (Revenue: ₹4,50,000, Net Cash Flow: ₹1,30,000, Pending: ₹85,000), your overall business health is **Healthy (84/100)**. Would you like me to analyze cash flow, inspect overdue payments, or check credit readiness?`,
    quickActions: ['How much money is pending?', 'Will I have enough cash next month?', 'Am I ready to apply for financing?']
  };
}


