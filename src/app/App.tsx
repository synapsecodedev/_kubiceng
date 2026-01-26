import { useState } from 'react';
import { LandingPage } from '@/app/pages/landing-page';
import { SidebarKubic, ModuleType } from '@/app/components/sidebar-kubic';
import { DashboardModule } from '@/app/components/dashboard-module';
import { EngenhariaModule } from '@/app/components/engenharia-module';
import { SuprimentosModule } from '@/app/components/suprimentos-module';
import { ExecucaoModule } from '@/app/components/execucao-module';
import { FinanceiroModule } from '@/app/components/financeiro-module';
import { PessoasModule } from '@/app/components/pessoas-module';
import { ComercialModule } from '@/app/components/comercial-module';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');

  if (!isLoggedIn) {
    return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'engenharia':
        return <EngenhariaModule />;
      case 'suprimentos':
        return <SuprimentosModule />;
      case 'execucao':
        return <ExecucaoModule />;
      case 'financeiro':
        return <FinanceiroModule />;
      case 'pessoas':
        return <PessoasModule />;
      case 'comercial':
        return <ComercialModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarKubic 
        activeModule={activeModule} 
        onModuleChange={setActiveModule} 
        onLogout={() => setIsLoggedIn(false)}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}
