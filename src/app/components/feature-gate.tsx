import React from 'react';
import { usePlan } from './plan-context';
import { Lock, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface FeatureGateProps {
  children: React.ReactNode;
  module: string;
  fallback?: React.ReactNode;
}

export function FeatureGate({ children, module, fallback }: FeatureGateProps) {
  const { canAccessModule } = usePlan();

  if (canAccessModule(module)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative group">
      {/* Visual de bloqueio */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-blue-100">
          <Lock className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Módulo Bloqueado</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-[240px] text-center">
          Esta funcionalidade não está disponível no seu plano atual.
        </p>
        <Button className="bg-[#0A2E50] hover:bg-[#0A2E50]/90 text-white gap-2 shadow-lg">
          <Zap className="w-4 h-4 fill-current" />
          Fazer Upgrade
        </Button>
      </div>
      
      {/* Conteúdo obscurecido ao fundo */}
      <div className="opacity-40 grayscale pointer-events-none select-none">
        {children}
      </div>
    </div>
  );
}
