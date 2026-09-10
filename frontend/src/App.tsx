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

  // Parse initial route from URL Hash / Search params (e.g. #/projects, #/detail?id=MPLAD-AP-2026-00125)
  const parseRouteFromUrl = (): { page: string; projectId: string } => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) return { page: 'landing', projectId: 'MPLAD-AP-2026-00125' };

      const [pathPart, queryPart] = hash.split('?');
      const page = pathPart || 'landing';
      let projectId = 'MPLAD-AP-2026-00125';

      if (queryPart) {
        const params = new URLSearchParams(queryPart);
        const pid = params.get('id') || params.get('projectId');
        if (pid) projectId = pid;
      }
      return { page, projectId };
    } catch {
      return { page: 'landing', projectId: 'MPLAD-AP-2026-00125' };
    }
  };

  const initialRoute = parseRouteFromUrl();
  const [currentPage, setCurrentPage] = useState<string>(initialRoute.page);
  const [activeProjectId, setActiveProjectId] = useState<string>(initialRoute.projectId);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state changes to browser window.history (pushState)
  const navigateTo = (page: string, projId?: string, replace = false) => {
    const targetProjectId = projId || activeProjectId;
    setCurrentPage(page);
    if (projId) setActiveProjectId(projId);

    const hashPath = page === 'detail' 
      ? `/${page}?id=${encodeURIComponent(targetProjectId)}`
      : `/${page}`;

    const newUrl = `${window.location.pathname}${window.location.search}#${hashPath}`;
    const stateObj = { page, projectId: targetProjectId };

    if (replace) {
      window.history.replaceState(stateObj, '', newUrl);
    } else {
      // Only push if different from current state to keep forward/backward clean
      const currentHash = window.location.hash.replace(/^#/, '');
      if (currentHash !== hashPath) {
        window.history.pushState(stateObj, '', newUrl);
      }
    }
  };

  // Listen to browser Back and Forward button events (popstate / hashchange)
  React.useEffect(() => {
    // Ensure initial entry has proper history state
    const currentHash = window.location.hash.replace(/^#\/?/, '');
    const initialHashPath = currentPage === 'detail'
      ? `/${currentPage}?id=${encodeURIComponent(activeProjectId)}`
      : `/${currentPage}`;

    if (!currentHash) {
      window.history.replaceState({ page: currentPage, projectId: activeProjectId }, '', `#${initialHashPath}`);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.projectId) setActiveProjectId(event.state.projectId);
      } else {
        const route = parseRouteFromUrl();
        setCurrentPage(route.page);
        if (route.projectId) setActiveProjectId(route.projectId);
      }
    };

    const handleHashChange = () => {
      const route = parseRouteFromUrl();
      setCurrentPage(route.page);
      if (route.projectId) setActiveProjectId(route.projectId);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Automatically scroll to the top of the viewport and main container on every page navigation
  React.useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.scrollTop = 0;
      const scrollables = document.querySelectorAll('.overflow-y-auto, .overflow-auto');
      scrollables.forEach(el => { el.scrollTop = 0; });
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const t1 = setTimeout(scrollToTop, 20);
    const t2 = setTimeout(scrollToTop, 80);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentPage, activeProjectId]);

  const handleOpenProject = (id: string) => {
    navigateTo('detail', id);
  };

  const handleGlobalSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (trimmed.toUpperCase().startsWith('MPLAD-')) {
      handleOpenProject(trimmed);
    } else {
      setGlobalSearch(trimmed);
      navigateTo('projects');
    }
  };

  const handleViewOnMap = (id: string) => {
    navigateTo('map', id);
  };

  const handleInspectProject = (id: string) => {
    navigateTo('inspection', id);
  };

  const handleFileComplaint = (id: string) => {
    navigateTo('complaints', id);
  };

  const handlePrintDossier = (id: string) => {
    navigateTo('reports', id);
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
            onBack={() => navigateTo('projects')}
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
        return <CitizenComplaintPage initialProjectId={activeProjectId} onOpenProject={handleOpenProject} onNavigate={navigateTo} />;
      case 'alerts':
        return <AlertsEscalationPage onOpenProject={handleOpenProject} />;
      case 'reports':
        return <ReportsPage onOpenProject={handleOpenProject} selectedProjectId={activeProjectId} />;
      case 'audit':
        return <AuditLogsPage />;
      case 'admin':
        return <AdminDataPage />;
      default:
        return <LandingPage onNavigate={navigateTo} onOpenProject={handleOpenProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearchSelect={handleGlobalSearch}
        onNavigate={navigateTo}
      />

      <div className="flex-1 flex">
        <Sidebar
          currentPage={currentPage}
          onNavigate={navigateTo}
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
