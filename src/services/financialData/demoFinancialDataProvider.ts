import {
  FinancialDataProvider,
  AccountProviderId,
  ConnectionOptions,
  ConnectedAccountInfo,
  FinancialAccountTransaction,
  SyncResult
} from '../../types/financialAccount';

const MOCK_CUSTOMERS = [
  'Sri Ram Retailers',
  'Laxmi Traders Hyderabad',
  'Venkateshwara Supplies',
  'Metro Supermarket Vizag',
  'Balaji Enterprises',
  'AP Wholesale Mart',
  'Deccan Hardware Stores',
  'Krishna Pharma Agencies',
  'Swagath Restaurant & Caterers',
  'Kiran General Stores'
];

const MOCK_SUPPLIERS = [
  'Reliance Consumer Logistics',
  'TATA Power & Utilities',
  'Airtel Business Broadband',
  'HDFC Merchant QR Settlement',
  'Godrej Material Procurement',
  'Southern Packaging Pvt Ltd',
  'State Transport Logistics',
  'Bharat Petroleum Fuel Center'
];

export class DemoFinancialDataProvider implements FinancialDataProvider {
  id: AccountProviderId = 'demo-upi-business';
  name: string = 'Demo UPI Business Account';

  private generateInitialDemoTransactions(count: number = 47): FinancialAccountTransaction[] {
    const transactions: FinancialAccountTransaction[] = [];
    const baseDate = new Date(2026, 8, 22); // 22 Sep 2026

    // Specific mandatory examples requested in prompt
    transactions.push(
      {
        transactionId: 'TXN1001',
        amount: 25000,
        type: 'CREDIT',
        date: '2026-09-22',
        description: 'Customer Payment - Sri Ram Retailers',
        category: 'Customer Payment',
        reference: 'UPI/20260922/994821',
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'UPI QR'
      },
      {
        transactionId: 'TXN1002',
        amount: 8500,
        type: 'DEBIT',
        date: '2026-09-22',
        description: 'Supplier Payment - Godrej Material Procurement',
        category: 'Supplier Payment',
        reference: 'UPI/20260922/883210',
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'UPI VPA'
      },
      {
        transactionId: 'TXN1003',
        amount: 12000,
        type: 'CREDIT',
        date: '2026-09-21',
        description: 'Customer Payment - Laxmi Traders Hyderabad',
        category: 'Customer Payment',
        reference: 'UPI/20260921/771092',
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'UPI QR'
      },
      {
        transactionId: 'TXN1004',
        amount: 3200,
        type: 'DEBIT',
        date: '2026-09-20',
        description: 'Utility Payment - TATA Power Electricity',
        category: 'Utility Payment',
        reference: 'UPI/20260920/664109',
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'Auto-Debit'
      }
    );

    // Generate remaining up to `count`
    for (let i = 5; i <= count; i++) {
      const daysAgo = Math.floor((i - 4) / 1.8);
      const txDate = new Date(baseDate);
      txDate.setDate(txDate.getDate() - daysAgo);
      const dateStr = txDate.toISOString().split('T')[0];

      const isCredit = i % 3 !== 0; // ~66% credit, 33% debit
      const txnNum = 1000 + i;

      if (isCredit) {
        const customer = MOCK_CUSTOMERS[i % MOCK_CUSTOMERS.length];
        const amounts = [4500, 7800, 15500, 22000, 31000, 18200, 9400, 14000, 48000];
        const amt = amounts[i % amounts.length] + (i * 120 % 500);

        transactions.push({
          transactionId: `TXN${txnNum}`,
          amount: amt,
          type: 'CREDIT',
          date: dateStr,
          description: `UPI Payment Received: ${customer}`,
          category: i % 2 === 0 ? 'Customer Payment' : 'Sales',
          reference: `UPI/202609${Math.max(1, 22 - daysAgo)}/${Math.floor(100000 + Math.random() * 899999)}`,
          status: 'SUCCESS',
          isDemoData: true,
          accountNumberMasked: '•••• 8821',
          paymentChannel: i % 2 === 0 ? 'UPI QR' : 'UPI VPA'
        });
      } else {
        const supplier = MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length];
        const amounts = [3500, 6200, 14500, 28000, 9100, 5400, 16800];
        const amt = amounts[i % amounts.length] + (i * 90 % 300);

        transactions.push({
          transactionId: `TXN${txnNum}`,
          amount: amt,
          type: 'DEBIT',
          date: dateStr,
          description: `UPI Payment Sent: ${supplier}`,
          category: i % 4 === 0 ? 'Operating Expenses' : i % 5 === 0 ? 'EMI' : 'Supplier Payment',
          reference: `UPI/202609${Math.max(1, 22 - daysAgo)}/${Math.floor(100000 + Math.random() * 899999)}`,
          status: 'SUCCESS',
          isDemoData: true,
          accountNumberMasked: '•••• 8821',
          paymentChannel: 'UPI VPA'
        });
      }
    }

    return transactions;
  }

  async connect(options: ConnectionOptions): Promise<{ account: ConnectedAccountInfo; initialTransactions: FinancialAccountTransaction[] }> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const providerNameMap: Record<AccountProviderId, string> = {
      'demo-bank': 'Demo Commercial Bank',
      'demo-upi-business': 'Demo UPI Business Merchant Account',
      'demo-account-aggregator': 'Demo Account Aggregator Sandbox'
    };

    const initialTransactions = this.generateInitialDemoTransactions(47);

    const now = new Date().toISOString();

    const account: ConnectedAccountInfo = {
      accountId: `acc_demo_${Date.now().toString(36)}`,
      provider: options.providerId || 'demo-upi-business',
      providerName: providerNameMap[options.providerId || 'demo-upi-business'],
      accountType: 'Current / Merchant UPI',
      status: 'Connected',
      connectedAt: now,
      lastSyncedAt: now,
      accountHolderName: options.accountHolderName || 'Demo Business Enterprise',
      vpaOrAccountMasked: options.providerId === 'demo-bank' ? 'HDFC Bank •••• 4912' : 'business@demoupi',
      consent: {
        grantedAt: now,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        permissions: {
          transactionHistory: true,
          transactionAmount: true,
          transactionDate: true,
          transactionReference: true,
          creditDebitInfo: true
        },
        forbiddenData: {
          upiPin: false,
          atmPin: false,
          password: false,
          otp: false
        }
      },
      totalTransactionsCount: initialTransactions.length,
      isDemoAccount: true
    };

    return { account, initialTransactions };
  }

  async getTransactions(_accountId: string): Promise<FinancialAccountTransaction[]> {
    return this.generateInitialDemoTransactions(47);
  }

  async syncTransactions(accountId: string): Promise<SyncResult> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const todayStr = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();

    const newTransactions: FinancialAccountTransaction[] = [
      {
        transactionId: `TXN_SYNC_${timestamp}_1`,
        amount: 18500,
        type: 'CREDIT',
        date: todayStr,
        description: 'Customer Payment - Balaji Enterprises',
        category: 'Customer Payment',
        reference: `UPI/${todayStr.replace(/-/g, '')}/${Math.floor(100000 + Math.random() * 899999)}`,
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'UPI QR'
      },
      {
        transactionId: `TXN_SYNC_${timestamp}_2`,
        amount: 6400,
        type: 'DEBIT',
        date: todayStr,
        description: 'Supplier Payment - Southern Packaging',
        category: 'Supplier Payment',
        reference: `UPI/${todayStr.replace(/-/g, '')}/${Math.floor(100000 + Math.random() * 899999)}`,
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'UPI VPA'
      },
      {
        transactionId: `TXN_SYNC_${timestamp}_3`,
        amount: 29500,
        type: 'CREDIT',
        date: todayStr,
        description: 'Bulk Order Collection - Metro Supermarket',
        category: 'Sales',
        reference: `UPI/${todayStr.replace(/-/g, '')}/${Math.floor(100000 + Math.random() * 899999)}`,
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'UPI QR'
      },
      {
        transactionId: `TXN_SYNC_${timestamp}_4`,
        amount: 4200,
        type: 'DEBIT',
        date: todayStr,
        description: 'Broadband & Infrastructure Bill',
        category: 'Operating Expenses',
        reference: `UPI/${todayStr.replace(/-/g, '')}/${Math.floor(100000 + Math.random() * 899999)}`,
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'Auto-Debit'
      },
      {
        transactionId: `TXN_SYNC_${timestamp}_5`,
        amount: 14000,
        type: 'CREDIT',
        date: todayStr,
        description: 'Advance Payment - Swagath Caterers',
        category: 'Customer Payment',
        reference: `UPI/${todayStr.replace(/-/g, '')}/${Math.floor(100000 + Math.random() * 899999)}`,
        status: 'SUCCESS',
        isDemoData: true,
        accountNumberMasked: '•••• 8821',
        paymentChannel: 'UPI VPA'
      }
    ];

    const now = new Date().toISOString();

    return {
      success: true,
      newTransactionsCount: newTransactions.length,
      lastSyncedAt: now,
      message: `${newTransactions.length} new transactions imported securely via simulated API.`,
      newTransactions
    };
  }

  async disconnect(_accountId: string, _retainHistoricalData?: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const demoFinancialDataProvider = new DemoFinancialDataProvider();
