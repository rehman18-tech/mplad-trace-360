import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PublicExplorer } from './pages/PublicExplorer';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { InteractiveMapPage } from './pages/InteractiveMapPage';
import { FundFlowPage } from './pages/FundFlowPage';
import { ContractsPage } from './pages/ContractsPage';
import { ContractorProfilePage } from './pages/ContractorProfilePage';
import { AIRiskCenterPage } from './pages/AIRiskCenterPage';
import { DisputesPage } from './pages/DisputesPage';
import { GuaranteesPage } from './pages/GuaranteesPage';
import { FieldInspectionPage } from './pages/FieldInspectionPage';
import { CitizenComplaintPage } from './pages/CitizenComplaintPage';
import { AlertsEscalationPage } from './pages/AlertsEscalationPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { AdminDataPage } from './pages/AdminDataPage';
import { DepartmentsPage } from './pages/DepartmentsPage';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [activeProjectId, setActiveProjectId] = useState<string>('MPLAD-AP-2026-00125');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenProject = (id: string) => {
    setActiveProjectId(id);
    setCurrentPage('detail');
  };

  const handleGlobalSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (trimmed.toUpperCase().startsWith('MPLAD-')) {
      setActiveProjectId(trimmed);
      setCurrentPage('detail');
    } else {
      setGlobalSearch(trimmed);
      setCurrentPage('projects');
    }
  };

  const handleViewOnMap = (id: string) => {
    setActiveProjectId(id);
    setCurrentPage('map');
  };

  const handleInspectProject = (id: string) => {
    setActiveProjectId(id);
    setCurrentPage('inspection');
  };

  const handleFileComplaint = (id: string) => {
    setActiveProjectId(id);
    setCurrentPage('complaints');
  };

  const handlePrintDossier = (id: string) => {
    setActiveProjectId(id);
    setCurrentPage('reports');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} onOpenProject={handleOpenProject} />;
      case 'departments':
        return (
          <DepartmentsPage
            onOpenProject={handleOpenProject}
            onViewMap={handleViewOnMap}
            onInspect={handleInspectProject}
            onComplaint={handleFileComplaint}
          />
        );
      case 'projects':
        return (
          <PublicExplorer
            initialSearch={globalSearch}
            onOpenProject={handleOpenProject}
            onViewMap={handleViewOnMap}
            onInspect={handleInspectProject}
            onComplaint={handleFileComplaint}
          />
        );
      case 'detail':
        return (
          <ProjectDetailPage
            projectId={activeProjectId}
            onBack={() => setCurrentPage('projects')}
            onInspect={handleInspectProject}
            onComplaint={handleFileComplaint}
            onViewMap={handleViewOnMap}
            onPrintDossier={handlePrintDossier}
          />
        );
      case 'map':
        return (
          <InteractiveMapPage
            onOpenProject={handleOpenProject}
            selectedProjectId={activeProjectId}
          />
        );
      case 'funds':
        return <FundFlowPage onOpenProject={handleOpenProject} />;
      case 'contracts':
        return <ContractsPage onOpenProject={handleOpenProject} />;
      case 'contractors':
        return <ContractorProfilePage onOpenProject={handleOpenProject} />;
      case 'ai-risk':
        return <AIRiskCenterPage onOpenProject={handleOpenProject} />;
      case 'disputes':
        return <DisputesPage onOpenProject={handleOpenProject} />;
      case 'guarantees':
        return <GuaranteesPage onOpenProject={handleOpenProject} />;
      case 'inspection':
        return <FieldInspectionPage initialProjectId={activeProjectId} onOpenProject={handleOpenProject} />;
      case 'complaints':
        return <CitizenComplaintPage initialProjectId={activeProjectId} onOpenProject={handleOpenProject} />;
      case 'alerts':
        return <AlertsEscalationPage onOpenProject={handleOpenProject} />;
      case 'reports':
        return <ReportsPage onOpenProject={handleOpenProject} selectedProjectId={activeProjectId} />;
      case 'audit':
        return <AuditLogsPage />;
      case 'admin':
        return <AdminDataPage />;
      default:
        return <LandingPage onNavigate={setCurrentPage} onOpenProject={handleOpenProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearchSelect={handleGlobalSearch}
        onNavigate={setCurrentPage}
      />

      <div className="flex-1 flex">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderPage()}
        </main>
      </div>

      {/* Official Government Light Prototype Footer */}
      <footer className="bg-[#F7F3EB] text-slate-600 text-xs py-7 border-t border-amber-200/80 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-600 text-white font-black flex items-center justify-center text-[10px] shadow-xs">
              360
            </div>
            <div>
              <p className="font-extrabold text-slate-900">{t('platform_name')}</p>
              <p className="text-[11px] text-slate-500">{t('tagline')}</p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px]">
            <p className="text-slate-700 font-bold">Built for Indian Public Infrastructure Transparency • {t('govt_of_india')}</p>
            <p className="text-slate-500 mt-0.5">Autonomous Surveillance • Ethical AI Governance • Zero Unsubstantiated Accusations</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

import { ToastProvider } from './context/ToastContext';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
