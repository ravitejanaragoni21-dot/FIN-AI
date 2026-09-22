import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const DisconnectConfirmModal: React.FC = () => {
  const { isDisconnectModalOpen, setIsDisconnectModalOpen, disconnectUPIAccount } = useFinance();
  const [retainData, setRetainData] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isDisconnectModalOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    await disconnectUPIAccount(retainData);
    setIsProcessing(false);
    setIsDisconnectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={() => setIsDisconnectModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-white">
            Disconnect Financial Account?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Are you sure you want to disconnect this financial account?
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={retainData}
              onChange={e => setRetainData(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <span>Retain imported historical data for financial analysis</span>
          </label>
          <p className="text-[11px] text-slate-500 pl-6">
            If unchecked, imported DEMO transactions will be removed from your ledger.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setIsDisconnectModalOpen(false)}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isProcessing ? 'Disconnecting...' : 'Disconnect'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
