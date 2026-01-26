import { Card } from '@/app/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Jan', planejado: 5, realizado: 4, financeiro: 3 },
  { mes: 'Fev', planejado: 12, realizado: 11, financeiro: 10 },
  { mes: 'Mar', planejado: 22, realizado: 20, financeiro: 19 },
  { mes: 'Abr', planejado: 35, realizado: 32, financeiro: 30 },
  { mes: 'Mai', planejado: 48, realizado: 45, financeiro: 43 },
  { mes: 'Jun', planejado: 62, realizado: 58, financeiro: 55 },
  { mes: 'Jul', planejado: 75, realizado: 68, financeiro: 65 },
  { mes: 'Ago', planejado: 85, realizado: 76, financeiro: 72 },
  { mes: 'Set', planejado: 92, realizado: 85, financeiro: 80 },
  { mes: 'Out', planejado: 97, realizado: 90, financeiro: 86 },
  { mes: 'Nov', planejado: 99, realizado: 94, financeiro: 90 },
  { mes: 'Dez', planejado: 100, realizado: 97, financeiro: 94 },
];

export function CurvaSChart() {
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
          <Line 
            type="monotone" 
            dataKey="planejado" 
            stroke="#94a3b8" 
            strokeWidth={2}
            name="Planejado"
            strokeDasharray="5 5"
          />
          <Line 
            type="monotone" 
            dataKey="realizado" 
            stroke="#0A2E50" 
            strokeWidth={3}
            name="Físico Real"
          />
          <Line 
            type="monotone" 
            dataKey="financeiro" 
            stroke="#4A9EFF" 
            strokeWidth={3}
            name="Financeiro"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
