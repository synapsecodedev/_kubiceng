import { TrendingUp, DollarSign, AlertCircle, Package } from 'lucide-react';
import { KpiCard } from '@/app/components/kpi-card';
import { CurvaSChart } from '@/app/components/curva-s-chart';
import { ObrasMap } from '@/app/components/obras-map';
import { Alertas } from '@/app/components/alertas';
import { useEffect, useState } from 'react';
import { getDashboardKpis, DashboardKpis } from '@/services/api';

export function DashboardModule() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);

  useEffect(() => {
    getDashboardKpis().then(setKpis).catch(() => {});
  }, []);

  const saldoFormatado = kpis
    ? kpis.saldoCaixa >= 1000
      ? `R$ ${(kpis.saldoCaixa / 1000).toFixed(1)}k`
      : `R$ ${kpis.saldoCaixa.toFixed(0)}`
    : '—';

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
          value={kpis ? String(kpis.obrasAtivas) : '—'}
          subtitle="Projetos cadastrados"
          icon={TrendingUp}
          color="blue"
        />
        <KpiCard
          title="Receita Aprovada"
          value={saldoFormatado}
          subtitle="Medições aprovadas"
          icon={DollarSign}
          color="green"
        />
        <KpiCard
          title="Alertas Críticos"
          value={kpis ? String(kpis.alertasCriticos) : '—'}
          subtitle="Requerem ação imediata"
          icon={AlertCircle}
          color="red"
        />
        <KpiCard
          title="Compras Pendentes"
          value={kpis ? String(kpis.comprasPendentes) : '—'}
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
