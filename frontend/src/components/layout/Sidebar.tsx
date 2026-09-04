import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, FolderKanban, MapPin, IndianRupee, FileText, 
  Users, AlertTriangle, Scale, ShieldAlert, Smartphone, MessageSquareQuote, 
  BellRing, FileCheck, Files, History, Settings, ChevronRight, Layers
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const { role } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { id: 'landing', label: t('nav_landing'), icon: LayoutDashboard, categoryKey: 'cat_core', categoryLabel: t('cat_core') },
    { id: 'departments', label: t('nav_departments'), icon: Layers, categoryKey: 'cat_core', categoryLabel: t('cat_core'), badge: '8', badgeType: 'info' },
    { id: 'projects', label: t('nav_projects'), icon: FolderKanban, categoryKey: 'cat_core', categoryLabel: t('cat_core') },
    { id: 'map', label: t('nav_map'), icon: MapPin, categoryKey: 'cat_core', categoryLabel: t('cat_core') },
    { id: 'funds', label: t('nav_funds'), icon: IndianRupee, categoryKey: 'cat_financials', categoryLabel: t('cat_financials') },
    { id: 'contracts', label: t('nav_contracts'), icon: FileText, categoryKey: 'cat_financials', categoryLabel: t('cat_financials') },
    { id: 'contractors', label: t('nav_contractors'), icon: Users, categoryKey: 'cat_financials', categoryLabel: t('cat_financials') },
    { id: 'ai-risk', label: t('nav_ai_risk'), icon: AlertTriangle, badge: '24', badgeType: 'alert', categoryKey: 'cat_intelligence', categoryLabel: t('cat_intelligence') },
    { id: 'disputes', label: t('nav_disputes'), icon: Scale, badge: '8', badgeType: 'warning', categoryKey: 'cat_intelligence', categoryLabel: t('cat_intelligence') },
    { id: 'guarantees', label: t('nav_guarantees'), icon: ShieldAlert, badge: '4', badgeType: 'critical', categoryKey: 'cat_intelligence', categoryLabel: t('cat_intelligence') },
    { id: 'inspection', label: t('nav_inspections'), icon: Smartphone, categoryKey: 'cat_ground_ops', categoryLabel: t('cat_ground_ops') },
    { id: 'complaints', label: t('nav_complaints'), icon: MessageSquareQuote, categoryKey: 'cat_ground_ops', categoryLabel: t('cat_ground_ops') },
    { id: 'alerts', label: t('nav_alerts'), icon: BellRing, badge: '12', badgeType: 'alert', categoryKey: 'cat_governance', categoryLabel: t('cat_governance') },
    { id: 'reports', label: t('nav_reports'), icon: FileCheck, categoryKey: 'cat_governance', categoryLabel: t('cat_governance') },
    { id: 'documents', label: t('nav_documents'), icon: Files, categoryKey: 'cat_governance', categoryLabel: t('cat_governance') },
    { id: 'audit', label: t('nav_audit'), icon: History, categoryKey: 'cat_administration', categoryLabel: t('cat_administration') },
    { id: 'admin', label: t('nav_admin'), icon: Settings, categoryKey: 'cat_administration', categoryLabel: t('cat_administration') },
  ];

  // Group by categoryKey
  const categoryKeys = Array.from(new Set(navItems.map(item => item.categoryKey)));

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
        className={`fixed lg:sticky top-[53px] left-0 h-[calc(100vh-53px)] w-64 bg-[#FCFAF7]/95 backdrop-blur-md border-r border-amber-200/80 flex flex-col z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 no-scrollbar">
          {categoryKeys.map((catKey) => {
            const catItems = navItems.filter(item => item.categoryKey === catKey);
            const catTitle = catItems[0]?.categoryLabel || t(catKey);
            return (
              <div key={catKey}>
                <p className="px-3 text-[10px] font-mono font-bold tracking-widest text-amber-950/80 uppercase mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
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
                            ? 'bg-gradient-to-r from-amber-100/90 to-orange-50/60 text-amber-950 font-bold border-l-3 border-amber-600 shadow-xs'
                            : 'text-slate-700 hover:bg-amber-100/50 hover:text-amber-900'
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
                                ? 'bg-amber-200/90 text-amber-950 border-amber-300'
                                : item.badgeType === 'critical'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : item.badgeType === 'alert'
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
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
        <div className="p-3 bg-[#F7F3EB] border-t border-amber-200/80 text-xs">
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

