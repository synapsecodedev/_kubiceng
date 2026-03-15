import { useState } from 'react';
import { LandingPage } from '@/app/pages/landing-page';
import { TermosDeUsoPage, PoliticaPrivacidadePage, LgpdPage } from '@/app/pages/legal-pages';
import { SidebarKubic, ModuleType } from '@/app/components/sidebar-kubic';
import { DashboardModule } from '@/app/components/dashboard-module';
import { EngenhariaModule } from '@/app/components/engenharia-module';
import { SuprimentosModule } from '@/app/components/suprimentos-module';
import { ExecucaoModule } from '@/app/components/execucao-module';
import { FinanceiroModule } from '@/app/components/financeiro-module';
import { PessoasModule } from '@/app/components/pessoas-module';
import { ComercialModule } from '@/app/components/comercial-module';
import { PlanProvider, usePlan } from '@/app/components/plan-context';
import { SuperAdminModule } from '@/app/components/super-admin-module';
import { SidebarAdmin } from '@/app/components/sidebar-admin';
import { FeatureGate } from '@/app/components/feature-gate';
import { SettingsModule } from '@/app/components/settings-module';
import { Toaster } from 'sonner';

type AppPage = 'landing' | 'termos' | 'privacidade' | 'lgpd' | 'app';

function AppContent() {
  const [page, setPage] = useState<AppPage>('landing');
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [adminTab, setAdminTab] = useState('overview');
  
  const { user, logout, isSuperAdmin } = usePlan();

  const goBack = () => setPage('landing');

  const handleLogout = () => {
    logout();
    setPage('landing');
  };

  // Se o user estiver logado no context mas a página ainda for landing, muda para app
  if (user && page === 'landing') {
    setPage('app');
  }

  // Páginas legais
  if (page === 'termos') return <TermosDeUsoPage onBack={goBack} />;
  if (page === 'privacidade') return <PoliticaPrivacidadePage onBack={goBack} />;
  if (page === 'lgpd') return <LgpdPage onBack={goBack} />;

  // Landing page
  if (page === 'landing') {
    return (
      <LandingPage
        onLogin={() => setPage('app')}
        onNavigate={(p) => setPage(p as AppPage)}
      />
    );
  }

  // App principal (logado)
  
  // Caso de Super Admin
  if (isSuperAdmin()) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarAdmin 
          activeTab={adminTab} 
          onTabChange={setAdminTab} 
          onLogout={handleLogout} 
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-[1600px] mx-auto">
            <SuperAdminModule activeTab={adminTab as any} onTabChange={setAdminTab} />
          </div>
        </main>
      </div>
    );
  }

  // Caso de Usuário Comum
  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':   return <DashboardModule />;
      case 'engenharia':  return <FeatureGate module="engenharia"><EngenhariaModule /></FeatureGate>;
      case 'suprimentos': return <FeatureGate module="suprimentos"><SuprimentosModule /></FeatureGate>;
      case 'execucao':    return <FeatureGate module="execucao"><ExecucaoModule /></FeatureGate>;
      case 'financeiro':  return <FeatureGate module="financeiro"><FinanceiroModule /></FeatureGate>;
      case 'pessoas':     return <FeatureGate module="pessoas"><PessoasModule /></FeatureGate>;
      case 'comercial':   return <FeatureGate module="comercial"><ComercialModule /></FeatureGate>;
      case 'settings':    return <SettingsModule />;
      default:            return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarKubic
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto transition-all">
        <div className="p-8 max-w-[1600px] mx-auto">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PlanProvider>
      <Toaster position="top-right" richColors />
      <AppContent />
    </PlanProvider>
  );
}
