import React from 'react';
import { RiskLevel } from '../../types';
import { AlertTriangle, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const normLevel = (level || 'NORMAL').toUpperCase();

  let colorClasses = 'bg-gov-green-subtle text-gov-green border-gov-green/30';
  let Icon = CheckCircle2;
  let label = 'NORMAL';

  if (normLevel.includes('CRITICAL')) {
    colorClasses = 'bg-red-50 text-red-700 border-red-300 font-semibold';
    Icon = ShieldAlert;
    label = 'CRITICAL RISK';
  } else if (normLevel.includes('HIGH')) {
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-300 font-semibold';
    Icon = AlertTriangle;
    label = 'HIGH RISK';
  } else if (normLevel.includes('WATCH') || normLevel.includes('ATTENTION')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
    Icon = AlertCircle;
    label = 'WATCH';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs tracking-wider uppercase ${sizeClasses} ${colorClasses}`}
      title={`Risk Classification: ${label}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
