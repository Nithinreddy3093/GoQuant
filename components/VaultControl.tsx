import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet, AlertCircle } from 'lucide-react';
import { VaultState } from '../types';

interface VaultControlProps {
  vault: VaultState;
  onDeposit: (amount: number) => Promise<void>;
  onWithdraw: (amount: number) => Promise<void>;
  isLoading: boolean;
}

const VaultControl: React.FC<VaultControlProps> = ({ vault, onDeposit, onWithdraw, isLoading }) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const val = parseFloat(amount);
    
    if (isNaN(val) || val <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      if (mode === 'deposit') {
        await onDeposit(val);
      } else {
        await onWithdraw(val);
      }
      setAmount('');
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    }
  };

  const setMax = () => {
    if (mode === 'withdraw') {
      setAmount(vault.availableBalance.toString());
    } else {
      setAmount("10000"); // Mock user wallet balance max
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => { setMode('deposit'); setError(null); }}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mode === 'deposit' 
              ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <ArrowDownLeft size={16} /> Deposit
        </button>
        <button
          onClick={() => { setMode('withdraw'); setError(null); }}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mode === 'withdraw' 
              ? 'bg-orange-600/10 text-orange-400 border-b-2 border-orange-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <ArrowUpRight size={16} /> Withdraw
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Asset</span>
              <span>
                {mode === 'deposit' ? 'Wallet Balance' : 'Available to Withdraw'}: 
                <span className="text-white font-mono ml-1">
                  {mode === 'deposit' ? '10,000.00' : vault.availableBalance.toFixed(2)} USDT
                </span>
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-white">T</div>
                <span className="font-semibold text-gray-200">USDT</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg py-4 pl-24 pr-20 text-right text-2xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
              />
              <button
                type="button"
                onClick={setMax}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-400/10 px-2 py-1 rounded"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gray-950/50 rounded-lg p-4 text-sm space-y-2 border border-gray-800/50">
            <div className="flex justify-between">
              <span className="text-gray-500">Exchange Rate</span>
              <span className="text-gray-300">1 USDT = 1.00 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Network Fee</span>
              <span className="text-gray-300">~0.00005 SOL</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !vault.isInitialized}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'deposit' 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]' 
                : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <>
                 {mode === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                 {mode === 'deposit' ? 'Deposit Collateral' : 'Withdraw Funds'}
               </>
             )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VaultControl;