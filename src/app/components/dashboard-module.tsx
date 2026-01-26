import { TrendingUp, DollarSign, AlertCircle, Package, Users } from 'lucide-react';
import { KpiCard } from '@/app/components/kpi-card';
import { CurvaSChart } from '@/app/components/curva-s-chart';
import { ObrasMap } from '@/app/components/obras-map';
import { Alertas } from '@/app/components/alertas';

export function DashboardModule() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard - Cockpit do Engenheiro</h2>
        <p className="text-gray-600">Visão geral de todas as obras e indicadores em tempo real</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Obras Ativas"
          value="12"
          subtitle="4 em andamento normal"
          icon={TrendingUp}
          color="blue"
          trend={{ value: 8, label: 'vs. mês anterior' }}
        />
        <KpiCard
          title="Saldo em Caixa"
          value="R$ 8.5M"
          subtitle="Disponível para obras"
          icon={DollarSign}
          color="green"
          trend={{ value: -3, label: 'vs. planejado' }}
        />
        <KpiCard
          title="Alertas Críticos"
          value="3"
          subtitle="Requerem ação imediata"
          icon={AlertCircle}
          color="red"
        />
        <KpiCard
          title="Compras Pendentes"
          value="18"
          subtitle="Aguardando aprovação"
          icon={Package}
          color="orange"
        />
      </div>

      {/* Curva S */}
      <CurvaSChart />

      {/* Obras e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ObrasMap />
        <Alertas />
      </div>
    </div>
  );
}
