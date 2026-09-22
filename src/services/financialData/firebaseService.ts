import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { ConnectedAccountInfo, FinancialAccountTransaction } from '../../types/financialAccount';

// Optional Firebase configuration from Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoConfigKeyForHackatonFinPassAI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'finpass-ai-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'finpass-ai-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'finpass-ai-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456'
};

const isRealFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Initialize Firebase App safely
let app;
let db: any = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase initialization notice: using hybrid simulated Firestore store.', e);
}

export class FirebaseService {
  private getStorageKeyAccount(userId: string): string {
    return `firestore_users_${userId}_connectedAccount`;
  }

  private getStorageKeyTxns(userId: string, accountId: string): string {
    return `firestore_users_${userId}_${accountId}_txns`;
  }

  /**
   * Store connected account info in Firestore:
   * Path: users/{userId}/connectedAccounts/{accountId}
   */
  async saveConnectedAccount(userId: string, account: ConnectedAccountInfo): Promise<void> {
    // 1. Local fallback cache
    try {
      localStorage.setItem(this.getStorageKeyAccount(userId), JSON.stringify(account));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }

    // 2. Real Firestore attempt if configured
    if (db && isRealFirebaseConfigured) {
      try {
        const accountRef = doc(db, 'users', userId, 'connectedAccounts', account.accountId);
        await setDoc(accountRef, {
          provider: account.provider,
          providerName: account.providerName,
          accountType: account.accountType,
          status: account.status,
          connectedAt: account.connectedAt,
          lastSyncedAt: account.lastSyncedAt,
          accountHolderName: account.accountHolderName,
          vpaOrAccountMasked: account.vpaOrAccountMasked,
          consent: account.consent,
          totalTransactionsCount: account.totalTransactionsCount,
          isDemoAccount: true
          // STRICT SECURITY RULE: Never write UPI PIN, OTP, password to Firestore
        }, { merge: true });
        console.log(`[Firestore] Account stored at users/${userId}/connectedAccounts/${account.accountId}`);
      } catch (err) {
        console.warn('[Firestore Sync] Account write fallback active', err);
      }
    }
  }

  /**
   * Save transaction list in Firestore:
   * Path: users/{userId}/connectedAccounts/{accountId}/transactions/{transactionId}
   */
  async saveTransactionsBatch(
    userId: string,
    accountId: string,
    transactions: FinancialAccountTransaction[]
  ): Promise<void> {
    // 1. Local persistent storage
    try {
      const existingStr = localStorage.getItem(this.getStorageKeyTxns(userId, accountId));
      const existing: FinancialAccountTransaction[] = existingStr ? JSON.parse(existingStr) : [];
      
      const map = new Map<string, FinancialAccountTransaction>();
      existing.forEach(t => map.set(t.transactionId, t));
      transactions.forEach(t => map.set(t.transactionId, t));

      const merged = Array.from(map.values());
      localStorage.setItem(this.getStorageKeyTxns(userId, accountId), JSON.stringify(merged));
    } catch (e) {
      console.error('LocalStorage txns write error', e);
    }

    // 2. Real Firestore Batch write if configured
    if (db && isRealFirebaseConfigured) {
      try {
        const batch = writeBatch(db);
        transactions.forEach(tx => {
          const txRef = doc(db, 'users', userId, 'connectedAccounts', accountId, 'transactions', tx.transactionId);
          batch.set(txRef, {
            amount: tx.amount,
            type: tx.type,
            date: tx.date,
            description: tx.description,
            category: tx.category,
            reference: tx.reference,
            status: tx.status,
            accountNumberMasked: tx.accountNumberMasked || '•••• 8821',
            paymentChannel: tx.paymentChannel || 'UPI',
            isDemoData: true
          }, { merge: true });
        });
        await batch.commit();
        console.log(`[Firestore] ${transactions.length} transactions saved at users/${userId}/connectedAccounts/${accountId}/transactions`);
      } catch (err) {
        console.warn('[Firestore Sync] Batch transactions write fallback active', err);
      }
    }
  }

  /**
   * Load account info from Firestore or local fallback
   */
  async getConnectedAccount(userId: string): Promise<ConnectedAccountInfo | null> {
    if (db && isRealFirebaseConfigured) {
      try {
        const querySnap = await getDocs(collection(db, 'users', userId, 'connectedAccounts'));
        if (!querySnap.empty) {
          const docData = querySnap.docs[0].data();
          return {
            ...docData,
            accountId: querySnap.docs[0].id
          } as ConnectedAccountInfo;
        }
      } catch (err) {
        console.warn('[Firestore Read] Account read fallback', err);
      }
    }

    // Fallback to localStorage
    const cached = localStorage.getItem(this.getStorageKeyAccount(userId));
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Cached account parse error', e);
      }
    }

    return null;
  }

  /**
   * Load transactions from Firestore or local fallback
   */
  async getTransactions(userId: string, accountId: string): Promise<FinancialAccountTransaction[]> {
    if (db && isRealFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(db, 'users', userId, 'connectedAccounts', accountId, 'transactions'));
        if (!snap.empty) {
          return snap.docs.map(d => ({
            transactionId: d.id,
            ...d.data()
          })) as FinancialAccountTransaction[];
        }
      } catch (err) {
        console.warn('[Firestore Read] Transactions read fallback', err);
      }
    }

    const cachedStr = localStorage.getItem(this.getStorageKeyTxns(userId, accountId));
    if (cachedStr) {
      try {
        return JSON.parse(cachedStr);
      } catch (e) {
        console.error('Cached txns parse error', e);
      }
    }

    return [];
  }

  /**
   * Update status on disconnect or sync
   */
  async updateAccountStatus(userId: string, accountId: string, status: 'Connected' | 'Disconnected', lastSyncedAt?: string): Promise<void> {
    const cached = await this.getConnectedAccount(userId);
    if (cached && cached.accountId === accountId) {
      const updated: ConnectedAccountInfo = {
        ...cached,
        status,
        ...(lastSyncedAt ? { lastSyncedAt } : {})
      };
      await this.saveConnectedAccount(userId, updated);
    }

    if (db && isRealFirebaseConfigured) {
      try {
        const ref = doc(db, 'users', userId, 'connectedAccounts', accountId);
        await setDoc(ref, { status, ...(lastSyncedAt ? { lastSyncedAt } : {}) }, { merge: true });
      } catch (e) {
        console.warn('[Firestore] Update status fallback', e);
      }
    }
  }

  /**
   * Remove account data from Firestore & local storage
   */
  async deleteConnectedAccount(userId: string, accountId: string, retainData: boolean): Promise<void> {
    if (!retainData) {
      localStorage.removeItem(this.getStorageKeyTxns(userId, accountId));
    }
    
    // Update local account status to Disconnected
    const cached = await this.getConnectedAccount(userId);
    if (cached && cached.accountId === accountId) {
      const disconnected = { ...cached, status: 'Disconnected' as const };
      localStorage.setItem(this.getStorageKeyAccount(userId), JSON.stringify(disconnected));
    }

    if (db && isRealFirebaseConfigured) {
      try {
        const accountRef = doc(db, 'users', userId, 'connectedAccounts', accountId);
        if (retainData) {
          await setDoc(accountRef, { status: 'Disconnected' }, { merge: true });
        } else {
          await deleteDoc(accountRef);
        }
      } catch (e) {
        console.warn('[Firestore] Delete account fallback', e);
      }
    }
  }
}

export const firebaseService = new FirebaseService();
