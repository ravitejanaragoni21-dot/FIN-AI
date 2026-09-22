import {
  FinancialDataProvider,
  ConnectionOptions,
  ConnectedAccountInfo,
  FinancialAccountTransaction,
  SyncResult
} from '../../types/financialAccount';
import { demoFinancialDataProvider } from './demoFinancialDataProvider';
import { firebaseService } from './firebaseService';

export class FinancialDataService {
  private activeProvider: FinancialDataProvider;
  private currentUserId: string = 'usr_finpass_default';

  constructor(provider: FinancialDataProvider = demoFinancialDataProvider) {
    this.activeProvider = provider;
  }

  setProvider(provider: FinancialDataProvider) {
    this.activeProvider = provider;
  }

  setUserId(userId: string) {
    this.currentUserId = userId;
  }

  /**
   * Primary connection flow:
   * 1. Call active provider (demoFinancialDataProvider)
   * 2. Store connected account in Firebase Firestore
   * 3. Batch save initial 47 demo transactions in Firestore
   */
  async connect(options: ConnectionOptions): Promise<{ account: ConnectedAccountInfo; transactions: FinancialAccountTransaction[] }> {
    const { account, initialTransactions } = await this.activeProvider.connect(options);

    // Save account & transactions into Firestore
    await firebaseService.saveConnectedAccount(this.currentUserId, account);
    await firebaseService.saveTransactionsBatch(this.currentUserId, account.accountId, initialTransactions);

    return { account, transactions: initialTransactions };
  }

  /**
   * Fetch connected account status from Firebase / cache
   */
  async getConnectedAccount(): Promise<ConnectedAccountInfo | null> {
    return await firebaseService.getConnectedAccount(this.currentUserId);
  }

  /**
   * Fetch imported transactions
   */
  async getTransactions(accountId: string): Promise<FinancialAccountTransaction[]> {
    const firestoreTxns = await firebaseService.getTransactions(this.currentUserId, accountId);
    if (firestoreTxns.length > 0) {
      return firestoreTxns;
    }
    return await this.activeProvider.getTransactions(accountId);
  }

  /**
   * Trigger automatic transaction sync:
   * 1. Call provider sync
   * 2. Save new transactions into Firestore
   * 3. Update account lastSyncedAt in Firestore
   */
  async syncTransactions(accountId: string): Promise<SyncResult> {
    const result = await this.activeProvider.syncTransactions(accountId);

    if (result.success && result.newTransactions.length > 0) {
      await firebaseService.saveTransactionsBatch(this.currentUserId, accountId, result.newTransactions);
      await firebaseService.updateAccountStatus(this.currentUserId, accountId, 'Connected', result.lastSyncedAt);
    }

    return result;
  }

  /**
   * Disconnect financial account cleanly
   */
  async disconnect(accountId: string, retainHistoricalData: boolean = true): Promise<void> {
    await this.activeProvider.disconnect(accountId, retainHistoricalData);
    await firebaseService.deleteConnectedAccount(this.currentUserId, accountId, retainHistoricalData);
  }
}

export const financialDataService = new FinancialDataService();
