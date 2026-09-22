export type AccountProviderId = 'demo-bank' | 'demo-upi-business' | 'demo-account-aggregator';

export type ConnectionStatus = 'Connected' | 'Disconnected' | 'Syncing' | 'Error';

export interface FinancialProviderInfo {
  id: AccountProviderId;
  name: string;
  tagline: string;
  category: 'UPI Merchant' | 'Business Banking' | 'Account Aggregator';
  icon: string;
  isPopular?: boolean;
}

export interface ConnectionConsent {
  grantedAt: string;
  validUntil: string;
  permissions: {
    transactionHistory: boolean;
    transactionAmount: boolean;
    transactionDate: boolean;
    transactionReference: boolean;
    creditDebitInfo: boolean;
  };
  forbiddenData: {
    upiPin: false;
    atmPin: false;
    password: false;
    otp: false;
  };
}

export interface FinancialAccountTransaction {
  transactionId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string; // ISO date string or formatted date
  description: string;
  category: 'Customer Payment' | 'Supplier Payment' | 'Utility Payment' | 'Sales' | 'Purchases' | 'Operating Expenses' | 'EMI' | 'Vendor Settlement';
  reference: string;
  status: 'SUCCESS' | 'PENDING' | 'RECONCILED';
  isDemoData: true;
  accountNumberMasked?: string;
  paymentChannel?: 'UPI QR' | 'UPI VPA' | 'IMPS / NEFT' | 'Auto-Debit';
}

export interface ConnectedAccountInfo {
  accountId: string;
  provider: AccountProviderId;
  providerName: string;
  accountType: string;
  status: ConnectionStatus;
  connectedAt: string;
  lastSyncedAt: string;
  accountHolderName: string;
  vpaOrAccountMasked: string;
  consent: ConnectionConsent;
  totalTransactionsCount: number;
  isDemoAccount: true;
}

export interface SyncResult {
  success: boolean;
  newTransactionsCount: number;
  lastSyncedAt: string;
  message: string;
  newTransactions: FinancialAccountTransaction[];
}

export interface ConnectionOptions {
  providerId: AccountProviderId;
  accountHolderName: string;
  businessGstin?: string;
}

export interface FinancialDataProvider {
  id: AccountProviderId;
  name: string;
  connect(options: ConnectionOptions): Promise<{ account: ConnectedAccountInfo; initialTransactions: FinancialAccountTransaction[] }>;
  getTransactions(accountId: string): Promise<FinancialAccountTransaction[]>;
  syncTransactions(accountId: string): Promise<SyncResult>;
  disconnect(accountId: string, retainHistoricalData?: boolean): Promise<void>;
}
