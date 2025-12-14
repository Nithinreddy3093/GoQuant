export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  LOCK = 'Lock',
  UNLOCK = 'Unlock',
  TRANSFER = 'Transfer',
}

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  fee: number;
  network: string;
  timestamp: number;
  txHash: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
}

export interface VaultState {
  isInitialized: boolean;
  owner: string; // Pubkey string
  vaultAddress: string; // PDA
  totalBalance: number;
  lockedBalance: number;
  availableBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  createdAt: number;
}

export interface ChartDataPoint {
  timestamp: string;
  balance: number;
  locked: number;
}