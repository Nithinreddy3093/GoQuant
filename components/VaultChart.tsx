import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TransactionRecord, TransactionType } from '../types';

// Helper to generate chart data from transaction history
const generateChartData = (transactions: TransactionRecord[]) => {
  // Sort by time ascending
  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  
  let currentBalance = 0;
  let currentLocked = 0;
  
  const data = sorted.map(tx => {
    if (tx.type === TransactionType.DEPOSIT) currentBalance += tx.amount;
    if (tx.type === TransactionType.WITHDRAWAL) currentBalance -= tx.amount;
    if (tx.type === TransactionType.LOCK) currentLocked += tx.amount;
    if (tx.type === TransactionType.UNLOCK) currentLocked -= tx.amount;

    return {
      time: new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      balance: currentBalance,
      locked: currentLocked,
      available: currentBalance - currentLocked
    };
  });

  // If no data, return baseline
  if (data.length === 0) return [{ time: 'Now', balance: 0, locked: 0, available: 0 }];
  
  // Add current state as last point if needed, or just return data
  return data;
};

interface VaultChartProps {
  transactions: TransactionRecord[];
}

const VaultChart: React.FC<VaultChartProps> = ({ transactions }) => {
  const data = generateChartData(transactions);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLocked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#4b5563" 
            tick={{fontSize: 12}}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#4b5563" 
            tick={{fontSize: 12}}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorBalance)" 
            strokeWidth={2}
            name="Total Balance"
          />
          <Area 
            type="monotone" 
            dataKey="locked" 
            stroke="#a855f7" 
            fillOpacity={1} 
            fill="url(#colorLocked)" 
            strokeWidth={2}
            name="Locked Collateral"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VaultChart;