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

type AppPage = 'landing' | 'termos' | 'privacidade' | 'lgpd' | 'app';

export default function App() {
  const [page, setPage] = useState<AppPage>('landing');
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');

  const goBack = () => setPage('landing');

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
  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':   return <DashboardModule />;
      case 'engenharia':  return <EngenhariaModule />;
      case 'suprimentos': return <SuprimentosModule />;
      case 'execucao':    return <ExecucaoModule />;
      case 'financeiro':  return <FinanceiroModule />;
      case 'pessoas':     return <PessoasModule />;
      case 'comercial':   return <ComercialModule />;
      default:            return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarKubic
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onLogout={() => setPage('landing')}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}
