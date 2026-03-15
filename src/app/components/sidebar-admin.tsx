import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { useState } from 'react';

interface SidebarAdminProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
}

export function SidebarAdmin({ activeTab, onTabChange, onLogout }: SidebarAdminProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral', description: 'Plataforma' },
    { id: 'accounts', icon: Users, label: 'Construtoras', description: 'Contas & Acesso' },
    { id: 'plans', icon: CreditCard, label: 'Gestão Planos', description: 'Regras & Preços' },
    { id: 'financial', icon: TrendingUp, label: 'Financeiro', description: 'MRR & Receita' },
  ];

  return (
    <div className={cn(
      "h-screen bg-[#0A2E50] text-white flex flex-col transition-all duration-300 border-r border-white/5",
      collapsed ? "w-20" : "w-72"
    )}>
        {/* Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="w-10 h-10 bg-[#4A9EFF] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/10">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-base tracking-tight">
                  Kubic<span className="text-[#4A9EFF]">Admin</span>
                </span>
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mt-0.5">Super Controle</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all relative group",
                isActive 
                  ? "bg-[#4A9EFF]/10 text-[#4A9EFF]" 
                  : "text-white/50 hover:text-white hover:bg-white/5",
                collapsed && "justify-center"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-[0_0_8px_rgba(74,158,255,0.5)]")} />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-[10px] opacity-60">{item.description}</div>
                </div>
              )}
              {isActive && !collapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#4A9EFF] shadow-[0_0_10px_#4A9EFF]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
           onClick={() => setCollapsed(!collapsed)}
           className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-white/40 hover:text-white",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Recolher</span>
            </>
          )}
        </button>
        
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500/60 hover:text-red-400 transition-all",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-semibold">Sair do Admin</span>}
        </button>
      </div>
    </div>
  );
}
