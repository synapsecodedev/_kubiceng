import { Card } from '@/app/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { getProjects, getSchedule } from '@/services/api';

interface CurvaPoint {
  mes: string;
  planejado: number;
  realizado: number;
}

// Converte itens de cronograma em pontos mensais da Curva S
function buildCurvaS(scheduleItems: { stage: string; startDate: string; endDate: string; progress: number; status: string }[]): CurvaPoint[] {
  if (scheduleItems.length === 0) return [];

  const mesesPt = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const total = scheduleItems.length;

  // Calcular progresso planejado e realizado por mês
  const pontos: Record<string, { planejadoCount: number; realizadoSum: number }> = {};

  scheduleItems.forEach((item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const mes = `${mesesPt[start.getMonth()]}/${String(start.getFullYear()).slice(2)}`;
    if (!pontos[mes]) pontos[mes] = { planejadoCount: 0, realizadoSum: 0 };
    pontos[mes].planejadoCount += 1;
    pontos[mes].realizadoSum += item.progress;
  });

  // Acumular para curva S
  const entries = Object.entries(pontos).sort(([a], [b]) => a.localeCompare(b));
  let acumPlan = 0;
  let acumReal = 0;

  return entries.map(([mes, val]) => {
    acumPlan += (val.planejadoCount / total) * 100;
    acumReal += (val.realizadoSum / total);
    return {
      mes,
      planejado: Math.round(Math.min(acumPlan, 100)),
      realizado: Math.round(Math.min(acumReal, 100)),
    };
  });
}

const FALLBACK_DATA = [
  { mes: 'Jan', planejado: 5, realizado: 4 },
  { mes: 'Fev', planejado: 12, realizado: 11 },
  { mes: 'Mar', planejado: 22, realizado: 20 },
  { mes: 'Abr', planejado: 35, realizado: 32 },
  { mes: 'Mai', planejado: 48, realizado: 45 },
  { mes: 'Jun', planejado: 62, realizado: 58 },
  { mes: 'Jul', planejado: 75, realizado: 68 },
];

export function CurvaSChart() {
  const [data, setData] = useState<CurvaPoint[]>(FALLBACK_DATA);

  useEffect(() => {
    getProjects()
      .then(async (projetos) => {
        if (projetos.length === 0) return;
        // Pegar cronograma do primeiro projeto ativo
        const sched = await getSchedule(projetos[0].id);
        if (sched.length > 0) {
          const curva = buildCurvaS(sched);
          if (curva.length > 0) setData(curva);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Curva S - Avanço Físico vs. Financeiro</h3>
        <p className="text-sm text-gray-500">Comparativo de progresso planejado x realizado</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis label={{ value: '% Concluído', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="planejado" stroke="#94a3b8" strokeWidth={2} name="Planejado" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="realizado" stroke="#0A2E50" strokeWidth={3} name="Físico Real" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
