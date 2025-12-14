import React, { useState, useMemo } from 'react';
import { TransactionRecord, TransactionType } from '../types';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Filter, 
  Calendar,
  X 
} from 'lucide-react';

interface TransactionTableProps {
  transactions: TransactionRecord[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return <ArrowDownLeft size={16} className="text-blue-400" />;
      case TransactionType.WITHDRAWAL:
        return <ArrowUpRight size={16} className="text-orange-400" />;
      case TransactionType.LOCK:
        return <Lock size={16} className="text-purple-400" />;
      case TransactionType.UNLOCK:
        return <Unlock size={16} className="text-emerald-400" />;
      default:
        return <RefreshCw size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'text-emerald-400 bg-emerald-400/10';
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'Failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const clearFilters = () => {
    setFilterType('All');
    setFilterStatus('All');
    setStartDate('');
    setEndDate('');
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Type Filter
      if (filterType !== 'All' && tx.type !== filterType) return false;
      
      // Status Filter
      if (filterStatus !== 'All' && tx.status !== filterStatus) return false;
      
      // Date Range Filter
      if (startDate) {
        const start = new Date(startDate).getTime();
        if (tx.timestamp < start) return false;
      }
      if (endDate) {
        // Add one day to include the end date fully
        const end = new Date(endDate).getTime() + 86400000; 
        if (tx.timestamp >= end) return false;
      }

      return true;
    });
  }, [transactions, filterType, filterStatus, startDate, endDate]);

  return (
    <div className="flex flex-col">
      {/* Filters Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          
          {/* Type Filter */}
          <div className="relative group">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-950 border border-gray-800 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-9 pr-8 py-2 appearance-none hover:bg-gray-900 transition-colors cursor-pointer outline-none"
            >
              <option value="All">All Types</option>
              {Object.values(TransactionType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 hover:bg-gray-900 transition-colors cursor-pointer outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2">
            <Calendar size={14} className="text-gray-500" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-gray-300 text-sm focus:outline-none w-24 sm:w-auto [&::-webkit-calendar-picker-indicator]:invert-[.5] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <span className="text-gray-600">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-gray-300 text-sm focus:outline-none w-24 sm:w-auto [&::-webkit-calendar-picker-indicator]:invert-[.5] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(filterType !== 'All' || filterStatus !== 'All' || startDate || endDate) && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-2 bg-red-400/10 rounded-lg border border-red-400/20"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800 bg-gray-900/30">
              <th className="p-4 font-medium min-w-[140px]">Type</th>
              <th className="p-4 font-medium">Amount (USDT)</th>
              <th className="p-4 font-medium">Fee (SOL)</th>
              <th className="p-4 font-medium">Network</th>
              <th className="p-4 font-medium">Transaction Hash</th>
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-800 border border-gray-700">
                        {getTypeIcon(tx.type)}
                      </div>
                      <span className="font-medium text-gray-200">{tx.type}</span>
                    </div>
                  </td>
                  <td className={`p-4 font-mono font-medium ${
                    [TransactionType.DEPOSIT, TransactionType.UNLOCK].includes(tx.type) ? 'text-emerald-400' : 'text-gray-200'
                  }`}>
                    { [TransactionType.DEPOSIT, TransactionType.UNLOCK].includes(tx.type) ? '+' : '-' }
                    {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-xs">
                    {tx.fee ? tx.fee.toFixed(6) : '-'}
                  </td>
                  <td className="p-4 text-gray-400 text-xs">
                    <span className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded border border-blue-900/30">
                      {tx.network || 'Solana'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">
                    <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                      {tx.txHash}
                    </a>
                  </td>
                  <td className="p-4 text-gray-400 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium border border-opacity-20 ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  {transactions.length === 0 ? "No transactions found on-chain." : "No transactions match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;