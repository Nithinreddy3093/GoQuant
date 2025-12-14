import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, subValue, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className={`p-6 rounded-xl border bg-gray-900 ${colorClasses[color]} border-opacity-50 transition-all hover:border-opacity-100`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[1]}`}>
          <Icon size={20} className={colorClasses[color].split(' ')[0]} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold font-mono text-white">{value}</span>
        {subValue && <span className="text-xs text-gray-500 mt-1">{subValue}</span>}
      </div>
    </div>
  );
};

export default StatsCard;