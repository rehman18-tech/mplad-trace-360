import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, FolderKanban, MapPin, IndianRupee, FileText, 
  Users, AlertTriangle, Scale, ShieldAlert, Smartphone, MessageSquareQuote, 
  BellRing, FileCheck, Files, History, Settings, ChevronRight, Layers, Gavel, Sparkles
} from 'lucide-react';

import { UserRole } from '../../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const { role } = useAuth();
  const { t } = useLanguage();

  const navItems: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    categoryKey: string;
    categoryLabel: string;
    badge?: string;
    badgeType?: string;
    allowedRoles?: UserRole[];
  }> = [
    { id: 'landing', label: t('nav_landing'), icon: LayoutDashboard, categoryKey: 'cat_core', categoryLabel: t('cat_core'), allowedRoles: ['CITIZEN', 'FIELD_OFFICER', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'departments', label: t('nav_departments'), icon: Layers, categoryKey: 'cat_core', categoryLabel: t('cat_core'), badge: '8', badgeType: 'info', allowedRoles: ['CITIZEN', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'projects', label: t('nav_projects'), icon: FolderKanban, categoryKey: 'cat_core', categoryLabel: t('cat_core') },
    { id: 'map', label: t('nav_map'), icon: MapPin, categoryKey: 'cat_core', categoryLabel: t('cat_core'), allowedRoles: ['CITIZEN', 'FIELD_OFFICER', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'tenders', label: 'e-Tender Bidding', icon: Gavel, categoryKey: 'cat_financials', categoryLabel: t('cat_financials'), badge: 'OPEN', badgeType: 'info', allowedRoles: ['CONTRACTOR', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'funds', label: t('nav_funds'), icon: IndianRupee, categoryKey: 'cat_financials', categoryLabel: t('cat_financials'), allowedRoles: ['CITIZEN', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'contracts', label: t('nav_contracts'), icon: FileText, categoryKey: 'cat_financials', categoryLabel: t('cat_financials'), allowedRoles: ['DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'contractors', label: t('nav_contractors'), icon: Users, categoryKey: 'cat_financials', categoryLabel: t('cat_financials'), allowedRoles: ['DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'ai-risk', label: t('nav_ai_risk'), icon: AlertTriangle, badge: '24', badgeType: 'alert', categoryKey: 'cat_intelligence', categoryLabel: t('cat_intelligence'), allowedRoles: ['DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'disputes', label: t('nav_disputes'), icon: Scale, badge: '8', badgeType: 'warning', categoryKey: 'cat_intelligence', categoryLabel: t('cat_intelligence'), allowedRoles: ['DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'guarantees', label: t('nav_guarantees'), icon: ShieldAlert, badge: '4', badgeType: 'critical', categoryKey: 'cat_intelligence', categoryLabel: t('cat_intelligence'), allowedRoles: ['DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR', 'CONTRACTOR'] },
    { id: 'inspection', label: t('nav_inspections'), icon: Smartphone, categoryKey: 'cat_ground_ops', categoryLabel: t('cat_ground_ops'), allowedRoles: ['FIELD_OFFICER', 'DISTRICT_AUTHORITY', 'VIGILANCE_AUDITOR', 'ADMIN'] },
    { id: 'complaints', label: t('nav_complaints'), icon: MessageSquareQuote, categoryKey: 'cat_ground_ops', categoryLabel: t('cat_ground_ops'), allowedRoles: ['CITIZEN', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'alerts', label: t('nav_alerts'), icon: BellRing, badge: '12', badgeType: 'alert', categoryKey: 'cat_governance', categoryLabel: t('cat_governance'), allowedRoles: ['DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'reports', label: t('nav_reports'), icon: FileCheck, categoryKey: 'cat_governance', categoryLabel: t('cat_governance'), allowedRoles: ['FIELD_OFFICER', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'audit', label: t('nav_audit'), icon: History, categoryKey: 'cat_administration', categoryLabel: t('cat_administration'), allowedRoles: ['DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR'] },
    { id: 'admin', label: t('nav_admin'), icon: Settings, categoryKey: 'cat_administration', categoryLabel: t('cat_administration'), allowedRoles: ['ADMIN'] },
  ];

  // Filter items based on active role permissions
  const filteredNavItems = navItems.filter(item => !item.allowedRoles || item.allowedRoles.includes(role));

  // Group by categoryKey
  const categoryKeys = Array.from(new Set(filteredNavItems.map(item => item.categoryKey)));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-[53px] left-0 h-[calc(100dvh-53px)] max-h-[calc(100dvh-53px)] w-64 bg-white/95 backdrop-blur-md border-r border-slate-200 flex flex-col z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {categoryKeys.map((catKey) => {
            const catItems = filteredNavItems.filter(item => item.categoryKey === catKey);
            const catTitle = catItems[0]?.categoryLabel || t(catKey);
            return (
              <div key={catKey}>
                <p className="px-3 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  <span>{catTitle}</span>
                </p>
                <div className="space-y-0.5">
                  {catItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-orange-50 text-orange-950 font-bold border-l-3 border-orange-600 shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-orange-600' : 'text-slate-500 group-hover:text-orange-600'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border ${
                              isActive
                                ? 'bg-orange-100 text-orange-900 border-orange-300'
                                : item.badgeType === 'critical'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : item.badgeType === 'alert'
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700">PFMS Node Latency</span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              24ms • HEALTHY
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">e-SAKSHI & GeM APIs Connected</p>
        </div>
      </aside>
    </>
  );
};

