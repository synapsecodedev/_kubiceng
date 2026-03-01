import { LayoutDashboard, FileText, ShoppingCart, Hammer, DollarSign, Users, Package, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import { useState } from 'react';
import logoKubic from "../../assets/kubiceng-logo.png";

export type ModuleType = 'dashboard' | 'engenharia' | 'suprimentos' | 'execucao' | 'financeiro' | 'pessoas' | 'comercial';

interface SidebarKubicProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  onLogout: () => void;
}

export function SidebarKubic({ activeModule, onModuleChange, onLogout }: SidebarKubicProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as ModuleType, icon: LayoutDashboard, label: 'Dashboard', description: 'Visão Geral' },
    { id: 'engenharia' as ModuleType, icon: FileText, label: 'Engenharia', description: 'GED & Cronograma' },
    { id: 'suprimentos' as ModuleType, icon: ShoppingCart, label: 'Suprimentos', description: 'Compras & Cotações' },
    { id: 'execucao' as ModuleType, icon: Hammer, label: 'Execução', description: 'RDO & Canteiro' },
    { id: 'financeiro' as ModuleType, icon: DollarSign, label: 'Financeiro', description: 'Medições & Fluxo' },
    { id: 'pessoas' as ModuleType, icon: Users, label: 'Pessoas', description: 'RH & SST' },
    { id: 'comercial' as ModuleType, icon: Package, label: 'Comercial', description: 'Pós-Obra' },
  ];

  return (
    <div className={cn(
      "h-screen bg-[#0A2E50] text-white flex flex-col transition-all duration-300",
      collapsed ? "w-20" : "w-72"
    )}>
        {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            {/* Ícone da logo — container branco para PNG com fundo branco */}
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <img
                src={logoKubic}
                alt="KubicEng Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-base tracking-tight">
                  Kubic<span className="text-[#4A9EFF]">Eng</span>
                </span>
                <span className="text-white/40 text-xs">Gestão de Obras</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 ml-auto"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <div className="flex justify-center mt-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>


      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                "hover:bg-white/10",
                isActive && "bg-[#4A9EFF] shadow-lg",
                collapsed && "justify-center"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-white/60">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all text-white/80 hover:text-white",
            collapsed && "justify-center"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Configurações</span>}
        </button>
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 text-red-200 hover:text-red-100 transition-all",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sair do Sistema</span>}
        </button>
      </div>
    </div>
  );
}