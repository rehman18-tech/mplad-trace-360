import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'positive' | 'warning' | 'critical' | 'neutral';
  };
  inr?: boolean;
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  inr = false,
}) => {
  const displayVal = inr && typeof value === 'number' ? formatIndianCurrency(value) : value;

  const badgeStyles = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="bg-white rounded-xl border border-gov-ivory-border p-5 shadow-gov hover:shadow-gov-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gov-charcoal-muted uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-extrabold text-gov-navy mt-1 tracking-tight">{displayVal}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gov-navy/5 flex items-center justify-center text-gov-navy">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {badge && (
            <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${badgeStyles[badge.variant]}`}>
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
