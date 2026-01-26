import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { DollarSign, TrendingDown, TrendingUp, Calendar, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function FinanceiroModule() {
  const contasPagar = [
    { id: 'CP-001', fornecedor: 'Constrular', valor: 'R$ 18.250', vencimento: '30/01/2026', status: 'pendente' },
    { id: 'CP-002', fornecedor: 'MetalPro', valor: 'R$ 45.800', vencimento: '15/02/2026', status: 'pendente' },
    { id: 'CP-003', fornecedor: 'MaderMax', valor: 'R$ 12.300', vencimento: '20/01/2026', status: 'vencido' },
  ];

  const medicoes = [
    {
      id: 'MED-2026-01',
      empreiteiro: 'Construtora ABC',
      servico: 'Alvenaria',
      periodo: 'Jan/2026 - 1ª Quinzena',
      executado: '68%',
      valor: 'R$ 34.500',
      retencao: 'R$ 1.725',
      liquido: 'R$ 32.775',
      status: 'aprovado'
    },
    {
      id: 'MED-2026-02',
      empreiteiro: 'Instalações Técnicas Ltda',
      servico: 'Instalações Hidráulicas',
      periodo: 'Jan/2026 - 1ª Quinzena',
      executado: '42%',
      valor: 'R$ 28.900',
      retencao: 'R$ 1.445',
      liquido: 'R$ 27.455',
      status: 'pendente'
    }
  ];

  const fluxoCaixa = [
    { mes: 'Jan', receita: 850, despesa: 680 },
    { mes: 'Fev', receita: 920, despesa: 750 },
    { mes: 'Mar', receita: 880, despesa: 820 },
    { mes: 'Abr', receita: 1050, despesa: 890 },
    { mes: 'Mai', receita: 980, despesa: 920 },
    { mes: 'Jun', receita: 1100, despesa: 950 },
  ];

  const realizadoOrcado = [
    { categoria: 'Fundação', orcado: 100, realizado: 95 },
    { categoria: 'Estrutura', orcado: 100, realizado: 102 },
    { categoria: 'Alvenaria', orcado: 100, realizado: 98 },
    { categoria: 'Instalações', orcado: 100, realizado: 105 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financeiro e Medições</h2>
          <p className="text-gray-600">Contas, medições de empreiteiros e fluxo de caixa</p>
        </div>
        <Button className="bg-[#0A2E50]">
          <DollarSign className="w-4 h-4 mr-2" />
          Nova Medição
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Saldo Disponível</div>
              <div className="text-2xl font-bold text-green-600 mt-1">R$ 8.5M</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">A Pagar (30 dias)</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">R$ 2.3M</div>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Medições Pendentes</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">5</div>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Economia (mês)</div>
              <div className="text-2xl font-bold text-green-600 mt-1">3.2%</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="contas" className="w-full">
        <TabsList>
          <TabsTrigger value="contas">
            <DollarSign className="w-4 h-4 mr-2" />
            Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="medicoes">
            <FileText className="w-4 h-4 mr-2" />
            Medições
          </TabsTrigger>
          <TabsTrigger value="fluxo">
            <TrendingUp className="w-4 h-4 mr-2" />
            Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger value="analise">
            <Calendar className="w-4 h-4 mr-2" />
            Realizado vs Orçado
          </TabsTrigger>
        </TabsList>

        {/* Contas a Pagar */}
        <TabsContent value="contas" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contas a Pagar</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Fornecedor</th>
                    <th className="text-right p-3">Valor</th>
                    <th className="text-left p-3">Vencimento</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contasPagar.map((conta) => (
                    <tr key={conta.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{conta.id}</td>
                      <td className="p-3">{conta.fornecedor}</td>
                      <td className="p-3 text-right font-semibold">{conta.valor}</td>
                      <td className="p-3">{conta.vencimento}</td>
                      <td className="p-3">
                        <Badge variant={conta.status === 'vencido' ? 'destructive' : 'default'}>
                          {conta.status === 'vencido' ? 'Vencido' : 'Pendente'}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="outline">Pagar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Medições */}
        <TabsContent value="medicoes" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Medições de Empreiteiros</h3>
            <div className="space-y-4">
              {medicoes.map((med) => (
                <div key={med.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{med.empreiteiro}</h4>
                      <p className="text-sm text-gray-600">{med.servico} • {med.periodo}</p>
                    </div>
                    <Badge variant={med.status === 'aprovado' ? 'default' : 'outline'}>
                      {med.status === 'aprovado' ? 'Aprovado' : 'Pendente Aprovação'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Executado</p>
                      <p className="font-semibold">{med.executado}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Valor Bruto</p>
                      <p className="font-semibold">{med.valor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Retenção (5%)</p>
                      <p className="font-semibold text-orange-600">{med.retencao}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Valor Líquido</p>
                      <p className="font-semibold text-green-600">{med.liquido}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                    {med.status === 'pendente' && (
                      <Button size="sm" className="bg-[#0A2E50]">Aprovar Medição</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Fluxo de Caixa */}
        <TabsContent value="fluxo" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa Projetado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fluxoCaixa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis label={{ value: 'Valores (R$ mil)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="receita" fill="#4A9EFF" name="Receita" />
                <Bar dataKey="despesa" fill="#0A2E50" name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Realizado vs Orçado */}
        <TabsContent value="analise" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análise: Realizado vs Orçado (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={realizadoOrcado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orcado" fill="#94a3b8" name="Orçado" />
                <Bar dataKey="realizado" fill="#0A2E50" name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
