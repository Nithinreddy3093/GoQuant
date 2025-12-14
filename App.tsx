import React, { useEffect, useState, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  ShieldCheck, 
  Layers,
  LogOut,
  Menu,
  X,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import VaultControl from './components/VaultControl';
import TransactionTable from './components/TransactionTable';
import VaultChart from './components/VaultChart';
import { VaultService } from './services/mockVaultService';
import { VaultState, TransactionRecord } from './types';

function App() {
  const [vault, setVault] = useState<VaultState | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize data
  const fetchData = useCallback(async () => {
    try {
      const v = await VaultService.getVaultState();
      const t = await VaultService.getTransactions();
      setVault(v);
      setTransactions(t);
    } catch (error) {
      console.error("Failed to fetch vault data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Operations
  const handleInitialize = async () => {
    setOpLoading(true);
    try {
      await VaultService.initializeVault();
      await fetchData();
    } finally {
      setOpLoading(false);
    }
  };

  const handleDeposit = async (amount: number) => {
    setOpLoading(true);
    try {
      await VaultService.deposit(amount);
      await fetchData();
    } finally {
      setOpLoading(false);
    }
  };

  const handleWithdraw = async (amount: number) => {
    setOpLoading(true);
    try {
      await VaultService.withdraw(amount);
      await fetchData();
    } finally {
      setOpLoading(false);
    }
  };

  // Simulation controls for demo purposes
  const simulateCPILock = async () => {
    if (!vault) return;
    setOpLoading(true);
    try {
      await VaultService.simulateLockCollateral(100);
      await fetchData();
    } catch(e) { alert(e instanceof Error ? e.message : 'Error') } 
    finally { setOpLoading(false); }
  };

  const simulateCPIUnlock = async () => {
    if (!vault) return;
    setOpLoading(true);
    try {
      await VaultService.simulateUnlockCollateral(100);
      await fetchData();
    } catch(e) { alert(e instanceof Error ? e.message : 'Error') }
    finally { setOpLoading(false); }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-blue-400">Connecting to Solana Cluster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold font-mono tracking-tighter text-white flex items-center gap-2">
              <Layers className="text-blue-500" />
              GOQUANT
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg">
              <LayoutDashboard size={20} />
              <span className="font-medium">Vault Overview</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <History size={20} />
              <span className="font-medium">History</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <ShieldCheck size={20} />
              <span className="font-medium">Security</span>
            </button>
          </nav>

          <div className="p-6 border-t border-gray-800">
             {/* Dev Tools for Simulation */}
             <div className="mb-4 p-3 bg-gray-950 rounded-lg border border-gray-800">
              <p className="text-xs text-gray-500 mb-2 uppercase font-bold">Dev: Sim CPI</p>
              <div className="flex gap-2">
                <button onClick={simulateCPILock} disabled={opLoading || !vault?.isInitialized} className="flex-1 text-xs bg-purple-900/50 hover:bg-purple-900 text-purple-300 py-1 rounded border border-purple-800">
                  Lock 100
                </button>
                <button onClick={simulateCPIUnlock} disabled={opLoading || !vault?.isInitialized} className="flex-1 text-xs bg-emerald-900/50 hover:bg-emerald-900 text-emerald-300 py-1 rounded border border-emerald-800">
                  Unlock 100
                </button>
              </div>
            </div>

            <button className="w-full flex items-center gap-3 text-gray-500 hover:text-gray-300 transition-colors">
              <LogOut size={18} />
              <span className="text-sm">Disconnect Wallet</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900">
          <div className="flex items-center gap-2 font-bold font-mono">GOQUANT</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-400">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Collateral Vault</h2>
              <p className="text-gray-400 text-sm mt-1">Manage your margin collateral securely on-chain.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-xs text-gray-500 uppercase">Wallet Connected</p>
                <p className="font-mono text-sm text-blue-400">GqK...9xP</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs">
                GQ
              </div>
            </div>
          </div>

          {/* Initialization State */}
          {!vault?.isInitialized ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/50 p-12 text-center min-h-[400px]">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Layers size={40} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Initialize Your Vault</h3>
              <p className="text-gray-400 max-w-md mb-8">
                To start trading on GoQuant, you need to initialize a personal collateral vault (PDA). 
                This will create a dedicated on-chain account to secure your funds.
              </p>
              <button 
                onClick={handleInitialize}
                disabled={opLoading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] flex items-center gap-2"
              >
                {opLoading ? 'Initializing...' : (
                  <>
                    <Plus size={20} /> Create Vault Account
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  label="Total Collateral" 
                  value={`${vault.totalBalance.toFixed(2)}`} 
                  subValue="USDT"
                  icon={Wallet} 
                  color="blue"
                />
                <StatsCard 
                  label="Available" 
                  value={`${vault.availableBalance.toFixed(2)}`} 
                  subValue="Withdrawable"
                  icon={ArrowUpRight} 
                  color="green"
                />
                <StatsCard 
                  label="Locked Margin" 
                  value={`${vault.lockedBalance.toFixed(2)}`} 
                  subValue="In Open Positions"
                  icon={ShieldCheck} 
                  color="purple"
                />
                 <StatsCard 
                  label="Net PNL" 
                  value={`+${(vault.totalBalance - vault.totalDeposited + vault.totalWithdrawn).toFixed(2)}`} 
                  subValue="Lifetime"
                  icon={History} 
                  color="orange"
                />
              </div>

              {/* Main Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] lg:h-[500px]">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg">Balance History</h3>
                    <div className="flex gap-2">
                       <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">24H</span>
                       <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded">7D</span>
                       <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">30D</span>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <VaultChart transactions={transactions} />
                  </div>
                </div>

                {/* Control Panel */}
                <div className="lg:col-span-1 h-full">
                  <VaultControl 
                    vault={vault} 
                    onDeposit={handleDeposit} 
                    onWithdraw={handleWithdraw}
                    isLoading={opLoading}
                  />
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Recent Transactions</h3>
                  <button onClick={fetchData} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                    <History size={18} />
                  </button>
                </div>
                <TransactionTable transactions={transactions} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default App;