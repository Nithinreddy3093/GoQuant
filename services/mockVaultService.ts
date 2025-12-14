import { VaultState, TransactionRecord, TransactionType } from '../types';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initial Mock State
let mockVault: VaultState = {
  isInitialized: false,
  owner: 'GqK...9xP',
  vaultAddress: '',
  totalBalance: 0,
  lockedBalance: 0,
  availableBalance: 0,
  totalDeposited: 0,
  totalWithdrawn: 0,
  createdAt: 0,
};

let mockTransactions: TransactionRecord[] = [];

// Helper to create a realistic mock transaction
const createTx = (type: TransactionType, amount: number, status: 'Confirmed' | 'Pending' | 'Failed' = 'Confirmed'): TransactionRecord => ({
  id: Math.random().toString(36).substring(7),
  type,
  amount,
  fee: 0.000005,
  network: 'Solana',
  timestamp: Date.now(),
  txHash: (type === TransactionType.LOCK || type === TransactionType.UNLOCK ? 'CPI...' : 'Sol...') + Math.random().toString(36).substring(7),
  status
});

export const VaultService = {
  
  async getVaultState(): Promise<VaultState> {
    await delay(600);
    return { ...mockVault };
  },

  async getTransactions(): Promise<TransactionRecord[]> {
    await delay(400);
    return [...mockTransactions].sort((a, b) => b.timestamp - a.timestamp);
  },

  async initializeVault(): Promise<VaultState> {
    await delay(1500);
    mockVault = {
      ...mockVault,
      isInitialized: true,
      vaultAddress: 'Vlt...5k2', // Simulated PDA
      createdAt: Date.now(),
    };
    return { ...mockVault };
  },

  async deposit(amount: number): Promise<VaultState> {
    await delay(1200);
    
    if (!mockVault.isInitialized) throw new Error("Vault not initialized");
    if (amount <= 0) throw new Error("Invalid amount");

    mockVault.totalBalance += amount;
    mockVault.availableBalance += amount;
    mockVault.totalDeposited += amount;

    const tx = createTx(TransactionType.DEPOSIT, amount);
    mockTransactions.push(tx);

    return { ...mockVault };
  },

  async withdraw(amount: number): Promise<VaultState> {
    await delay(1200);

    if (!mockVault.isInitialized) throw new Error("Vault not initialized");
    if (amount <= 0) throw new Error("Invalid amount");
    if (amount > mockVault.availableBalance) throw new Error("Insufficient available funds (Check locked collateral)");

    mockVault.totalBalance -= amount;
    mockVault.availableBalance -= amount;
    mockVault.totalWithdrawn += amount;

    const tx = createTx(TransactionType.WITHDRAWAL, amount);
    mockTransactions.push(tx);

    return { ...mockVault };
  },

  // Simulating the CPI call from the Position Manager
  async simulateLockCollateral(amount: number): Promise<VaultState> {
    await delay(800);
    if (amount > mockVault.availableBalance) throw new Error("Cannot lock more than available");
    
    mockVault.availableBalance -= amount;
    mockVault.lockedBalance += amount;

    const tx = createTx(TransactionType.LOCK, amount);
    mockTransactions.push(tx);
    return { ...mockVault };
  },

  // Simulating the CPI call from the Position Manager when closing a position
  async simulateUnlockCollateral(amount: number): Promise<VaultState> {
    await delay(800);
    if (amount > mockVault.lockedBalance) throw new Error("Cannot unlock more than locked");

    mockVault.lockedBalance -= amount;
    mockVault.availableBalance += amount;

    const tx = createTx(TransactionType.UNLOCK, amount);
    mockTransactions.push(tx);
    return { ...mockVault };
  }
};