import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGE_LABELS } from '../../constants/languages';
import { useToast } from '../../context/ToastContext';
import { UserRole, Language } from '../../types';
import { 
  Search, Bell, User, Globe, Check, AlertTriangle, ShieldCheck, 
  ChevronDown, ExternalLink, Menu, Layers, Sparkles
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onSearchSelect?: (projectId: string) => void;
  onNavigate?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onSearchSelect, onNavigate }) => {
  const { role, setRole, userName, userDesignation } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setShowLangMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(target)) {
        setShowRoleMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLangMenu(false);
        setShowRoleMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const notifications = [
    { id: 1, title: "Critical Anomaly Flagged", text: "110-day delay & 36.5% progress gap in MPLAD-UP-2026-00084 (Varanasi)", time: "10m ago", sev: "critical", projId: "MPLAD-UP-2026-00084" },
    { id: 2, title: "PBG Guarantee Expiring", text: "Performance Bank Guarantee expires in 18 days for Purvanchal Nirman", time: "25m ago", sev: "warning", projId: "MPLAD-UP-2026-00084" },
    { id: 3, title: "Duplicate Work Review", text: "93% spatial match between Biligere road works in Mysuru", time: "1h ago", sev: "warning", projId: "MPLAD-KA-2026-00302" },
    { id: 4, title: "Field Inspection Verified", text: "AEE submitted geotagged inspection for Community Hall", time: "2h ago", sev: "info", projId: "MPLAD-AP-2026-00125" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearchSelect) {
      onSearchSelect(searchTerm.trim());
    }
  };

  const getRoleDisplayName = (r: UserRole): string => {
    switch (r) {
      case 'CITIZEN': return t('role_citizen', 'Citizen');
      case 'FIELD_OFFICER': return t('role_officer', 'Field Officer / Inspector');
      case 'DISTRICT_AUTHORITY': return t('role_district', 'District Authority');
      case 'ADMIN': return t('role_admin', 'Higher Authority / Admin');
      case 'VIGILANCE_AUDITOR': return 'State Technical Vigilance (CTEO / CVC)';
      case 'CONTRACTOR': return 'Contractor / EPC Vendor';
    }
  };

  const getRoleInitial = (r: UserRole): string => {
    switch (r) {
      case 'CITIZEN': return 'C';
      case 'FIELD_OFFICER': return 'F';
      case 'DISTRICT_AUTHORITY': return 'D';
      case 'ADMIN': return 'A';
      case 'VIGILANCE_AUDITOR': return 'V';
      case 'CONTRACTOR': return 'B';
    }
  };

  const roleLabels: Record<UserRole, string> = {
    CITIZEN: "Role: " + t('role_citizen'),
    FIELD_OFFICER: "Role: " + t('role_officer'),
    DISTRICT_AUTHORITY: "Role: " + t('role_district'),
    ADMIN: "Role: " + t('role_admin'),
    VIGILANCE_AUDITOR: "Role: Technical Vigilance (CTEO)",
    CONTRACTOR: "Role: Contractor / EPC Vendor",
  };

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setShowLangMenu(false);
    showToast(t('lang_switched'), 'success');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md text-slate-800 border-b border-amber-200/80 shadow-xs">
      {/* Sleek Tri-Color Micro Accent Ribbon with Shimmer */}
      <div className="h-[3px] w-full animate-tiranga-shimmer opacity-95"></div>

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg hover:bg-amber-50 text-slate-700 transition-colors border border-amber-200"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => onNavigate && onNavigate(role === 'CONTRACTOR' ? 'tenders' : role === 'FIELD_OFFICER' ? 'inspection' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Authentic Revolving 24-Spoke Ashoka Chakra Emblem */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-50 via-orange-50 to-amber-100/60 border border-amber-300 flex items-center justify-center shadow-xs group-hover:border-amber-500 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xs"></div>
              
              {/* Revolving 24-Spoke Chakra SVG */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-900 animate-chakra">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <circle cx="12" cy="12" r="2.5" fill="#0B2545" stroke="currentColor" strokeWidth="1" />
                <circle cx="12" cy="12" r="1" fill="#EA580C" />
                {/* 24 spokes */}
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="12"
                    y1="12"
                    x2="12"
                    y2="2"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 15} 12 12)`}
                  />
                ))}
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-slate-900 flex items-center gap-1">
                  <span>MPLAD</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 font-black">TRACE 360</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-orange-100/80 text-orange-800 rounded-full border border-orange-300/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  {t('live_audit', 'LIVE AUDIT')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-900 font-bold font-mono hidden md:inline-block">सत्यमेव जयते</span>
                <span className="text-amber-300 hidden md:inline-block">•</span>
                <p className="text-[10px] text-slate-600 hidden md:block font-medium">
                  {t('govt_of_india')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Global Search & Quick Department View */}
        <div className="flex-1 max-w-lg hidden md:flex items-center gap-2.5">
          {role !== 'CONTRACTOR' && role !== 'FIELD_OFFICER' && (
            <button
              onClick={() => onNavigate && onNavigate('departments')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50/90 hover:bg-amber-100 border border-amber-300/80 text-xs font-bold text-amber-900 transition-all flex items-center gap-2 shrink-0 shadow-xs hover:border-amber-500"
              title="Browse works by Ministry & Department"
            >
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              <span>{t('nav_departments')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 font-mono font-bold">8</span>
            </button>
          )}

          <form onSubmit={handleSearchSubmit} className="relative flex-1 group">
            <button
              type="submit"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-orange-600 focus:outline-none transition-colors"
              title="Click to Search Works"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={t('nav_search_placeholder', 'Search works, MPs, IDs...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-9 pr-24 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-[11px] font-mono px-1 rounded"
                title="Clear Search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-[10px] font-bold tracking-wider transition-all shadow-xs"
              title="Execute Search"
            >
              {t('search_button')}
            </button>
          </form>
        </div>

        {/* Right: Role Switcher, Language & Notifications */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-700 border border-amber-300 transition-colors shadow-2xs"
            title="Search Works"
            aria-label="Toggle Mobile Search"
          >
            <Search className="w-4 h-4 text-orange-600" />
          </button>

          {/* Language Selector */}
          <div ref={langRef} className="relative no-translate" data-no-translate="true">
            <button
              type="button"
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowRoleMenu(false);
                setShowNotifications(false);
              }}
              className="no-translate flex items-center gap-1 sm:gap-1.5 text-xs px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-semibold transition-all hover:border-amber-400 shadow-xs"
              title="Change Language / भाषा बदलें"
              data-no-translate="true"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="no-translate font-bold text-[11px] hidden xs:inline">
                {LANGUAGE_LABELS[language]?.native || 'English'}
              </span>
              <span className="no-translate uppercase font-mono text-[10px] px-1 py-0.2 rounded bg-amber-200/80 text-amber-900 font-bold">
                {LANGUAGE_LABELS[language]?.code || 'EN'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-1.5rem)] bg-white text-slate-800 rounded-2xl shadow-xl border border-amber-200/90 py-2 z-50 text-xs divide-y divide-amber-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-amber-900 uppercase tracking-wider bg-amber-50/50">
                  Select Language / भाषा चुनें
                </div>
                <div className="py-1 max-h-72 overflow-y-auto">
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((langCode) => {
                    const info = LANGUAGE_LABELS[langCode];
                    const isSelected = language === langCode;
                    return (
                      <button
                        key={langCode}
                        onClick={() => handleLanguageSelect(langCode)}
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-amber-50/80 transition-colors ${
                          isSelected ? 'font-bold text-orange-700 bg-amber-50' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{info.native}</span>
                          <span className="text-[10px] text-slate-500">({info.english})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                            {info.code}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Button */}
          <div ref={roleRef} className="relative no-translate" data-no-translate="true">
            <button
              key={role}
              type="button"
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowLangMenu(false);
                setShowNotifications(false);
              }}
              className="no-translate flex items-center gap-1.5 sm:gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 hover:border-amber-400 px-2 sm:px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs text-slate-800"
              title="Switch Evaluation Persona / भूमिका बदलें"
              data-no-translate="true"
            >
              <div className="no-translate w-5 h-5 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0">
                {getRoleInitial(role)}
              </div>
              <div className="hidden sm:block text-left no-translate">
                <div className="no-translate text-[9px] uppercase tracking-wider text-slate-500 font-mono leading-none">Role</div>
                <div className="no-translate font-semibold text-slate-800 leading-tight">{getRoleDisplayName(role)}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="no-translate absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white text-slate-800 rounded-2xl shadow-xl border border-amber-200/90 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150" data-no-translate="true">
                <div className="px-3 py-2 border-b border-amber-100 mb-1 bg-amber-50/60 rounded-xl">
                  <p className="font-bold text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Switch Evaluation Persona</span>
                  </p>
                  <p className="text-[11px] text-slate-600">Simulate different administrative workflows</p>
                </div>
                {(['CITIZEN', 'FIELD_OFFICER', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR', 'CONTRACTOR'] as UserRole[]).map((r) => {
                  const displayName = getRoleDisplayName(r);
                  const isCurrent = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { 
                        setRole(r); 
                        setShowRoleMenu(false); 
                        showToast(`Switched persona: ${displayName}`, 'success');
                        if (onNavigate) {
                          if (r === 'CONTRACTOR') onNavigate('tenders');
                          else if (r === 'FIELD_OFFICER') onNavigate('inspection');
                          else onNavigate('landing');
                        }
                      }}
                      className={`no-translate w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'bg-amber-50 border border-amber-300 text-amber-950 font-semibold' 
                          : 'hover:bg-amber-50/50 text-slate-700'
                      }`}
                      data-no-translate="true"
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5 text-slate-900">
                          <span className="w-4 h-4 rounded bg-amber-100 text-amber-800 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {getRoleInitial(r)}
                          </span>
                          <span>Role: {displayName}</span>
                          {isCurrent && <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">ACTIVE</span>}
                        </div>
                        <div className="text-[10px] mt-0.5 text-slate-500">
                          {r === 'CITIZEN' && 'Public works search, financials & grievance reporting'}
                          {r === 'FIELD_OFFICER' && 'Mobile geotagging, inspection & photo upload'}
                          {r === 'DISTRICT_AUTHORITY' && 'Anomaly review, officer assignment & dispute resolution'}
                          {r === 'ADMIN' && 'Nationwide analytics, risk rules & data import'}
                          {r === 'VIGILANCE_AUDITOR' && 'Tender price floor audits, anti-corruption nexus & stop-work orders'}
                          {r === 'CONTRACTOR' && 'e-Tender bidding, BOQ submission, price floor clearance & measurement bills'}
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLangMenu(false);
                setShowRoleMenu(false);
              }}
              className="relative p-1.5 sm:p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-slate-900 border border-amber-300 transition-all shadow-xs"
              title="System Alerts & Escalations"
            >
              <Bell className="w-4 h-4 text-amber-900" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-88 max-w-[calc(100vw-1.5rem)] bg-white text-slate-800 rounded-2xl shadow-xl border border-amber-200 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-amber-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-slate-900">Surveillance Feeds (4)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold uppercase">Live Telemetry</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        setShowNotifications(false);
                        if (onSearchSelect) onSearchSelect(n.projId);
                      }}
                      className="p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 cursor-pointer transition-all border border-amber-200/80 hover:border-amber-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    if (onNavigate) onNavigate('alerts');
                  }}
                  className="w-full mt-3 py-2 text-center text-xs font-bold text-orange-700 hover:text-orange-800 rounded-xl hover:bg-amber-50 transition-colors border-t border-amber-100 block"
                >
                  Open Full Early Warning Console →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Mobile Search Row */}
      {mobileSearchOpen && (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder={t('nav_search_placeholder', 'Search works, MPs, IDs...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-16 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-bold rounded-lg shadow-xs"
            >
              {t('search_button')}
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
