import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Users, Shield, Clock, AlertTriangle } from 'lucide-react';

export function PessoasModule() {
  const funcionarios = [
    { 
      nome: 'Carlos Silva', 
      funcao: 'Pedreiro', 
      obra: 'Residencial Torres do Mar',
      tipo: 'proprio',
      treinamentos: { nr35: '2025-12-15', nr10: 'Não aplicável' },
      status: 'ativo'
    },
    { 
      nome: 'José Santos', 
      funcao: 'Armador', 
      obra: 'Residencial Torres do Mar',
      tipo: 'terceiro',
      treinamentos: { nr35: '2026-03-20', nr10: 'Não aplicável' },
      status: 'ativo'
    },
    { 
      nome: 'Maria Oliveira', 
      funcao: 'Eletricista', 
      obra: 'Shopping Center Norte',
      tipo: 'proprio',
      treinamentos: { nr35: '2026-01-10', nr10: '2025-11-30' },
      status: 'treinamento_vencido'
    },
  ];

  const epis = [
    { item: 'Capacete', qtd_disponivel: 45, qtd_minima: 30, ultima_distribuicao: '20/01/2026' },
    { item: 'Luva de Raspa', qtd_disponivel: 28, qtd_minima: 40, ultima_distribuicao: '22/01/2026' },
    { item: 'Botina de Segurança', qtd_disponivel: 52, qtd_minima: 35, ultima_distribuicao: '18/01/2026' },
    { item: 'Óculos de Proteção', qtd_disponivel: 38, qtd_minima: 30, ultima_distribuicao: '21/01/2026' },
  ];

  const ponto = [
    { nome: 'Carlos Silva', entrada: '07:02', saida_almoco: '12:00', volta_almoco: '13:05', saida: '17:08', horas: '8h01' },
    { nome: 'José Santos', entrada: '06:58', saida_almoco: '12:03', volta_almoco: '13:00', saida: '17:02', horas: '8h03' },
    { nome: 'Maria Oliveira', entrada: '07:15', saida_almoco: '12:05', volta_almoco: '13:10', saida: '17:20', horas: '7h55' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Pessoas</h2>
          <p className="text-gray-600">RH, Segurança do Trabalho e controle de ponto</p>
        </div>
        <Button className="bg-[#0A2E50]">
          <Users className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total de Funcionários</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">68</div>
          <div className="text-xs text-gray-500 mt-1">45 próprios • 23 terceiros</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Treinamentos Vencidos</div>
          <div className="text-2xl font-bold text-red-600 mt-1">3</div>
          <div className="text-xs text-gray-500 mt-1">Requerem atenção urgente</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">EPIs Distribuídos (mês)</div>
          <div className="text-2xl font-bold text-green-600 mt-1">142</div>
          <div className="text-xs text-gray-500 mt-1">Com assinatura digital</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Horas Trabalhadas (mês)</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">12.480h</div>
          <div className="text-xs text-gray-500 mt-1">Janeiro/2026</div>
        </Card>
      </div>

      <Tabs defaultValue="funcionarios" className="w-full">
        <TabsList>
          <TabsTrigger value="funcionarios">
            <Users className="w-4 h-4 mr-2" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="sst">
            <Shield className="w-4 h-4 mr-2" />
            SST & Treinamentos
          </TabsTrigger>
          <TabsTrigger value="ponto">
            <Clock className="w-4 h-4 mr-2" />
            Controle de Ponto
          </TabsTrigger>
        </TabsList>

        {/* Funcionários */}
        <TabsContent value="funcionarios" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lista de Funcionários</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Nome</th>
                    <th className="text-left p-3">Função</th>
                    <th className="text-left p-3">Obra</th>
                    <th className="text-left p-3">Tipo</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((func, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{func.nome}</td>
                      <td className="p-3">{func.funcao}</td>
                      <td className="p-3 text-sm">{func.obra}</td>
                      <td className="p-3">
                        <Badge variant={func.tipo === 'proprio' ? 'default' : 'outline'}>
                          {func.tipo === 'proprio' ? 'Próprio' : 'Terceiro'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={func.status === 'ativo' ? 'default' : 'destructive'}>
                          {func.status === 'ativo' ? 'Ativo' : 'Treinamento Vencido'}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm">Ver Ficha</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* SST */}
        <TabsContent value="sst" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Controle de EPIs</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Item</th>
                    <th className="text-right p-3">Qtd. Disponível</th>
                    <th className="text-right p-3">Qtd. Mínima</th>
                    <th className="text-left p-3">Última Distribuição</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {epis.map((epi, index) => {
                    const critico = epi.qtd_disponivel < epi.qtd_minima;
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{epi.item}</td>
                        <td className={`p-3 text-right ${critico ? 'text-red-600 font-bold' : ''}`}>
                          {epi.qtd_disponivel}
                        </td>
                        <td className="p-3 text-right text-gray-500">{epi.qtd_minima}</td>
                        <td className="p-3">{epi.ultima_distribuicao}</td>
                        <td className="p-3">
                          <Badge variant={critico ? 'destructive' : 'default'}>
                            {critico ? 'Repor Estoque' : 'OK'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">Treinamentos Vencendo</h4>
                <p className="text-sm text-orange-800 mb-2">
                  3 funcionários com treinamento NR-10 vencido. O sistema bloqueará o acesso à obra automaticamente.
                </p>
                <Button size="sm" variant="outline">Agendar Renovação</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Ponto */}
        <TabsContent value="ponto" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Registro de Ponto - 25/01/2026</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Funcionário</th>
                    <th className="text-center p-3">Entrada</th>
                    <th className="text-center p-3">Saída Almoço</th>
                    <th className="text-center p-3">Volta Almoço</th>
                    <th className="text-center p-3">Saída</th>
                    <th className="text-center p-3">Total Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {ponto.map((registro, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{registro.nome}</td>
                      <td className="p-3 text-center">{registro.entrada}</td>
                      <td className="p-3 text-center">{registro.saida_almoco}</td>
                      <td className="p-3 text-center">{registro.volta_almoco}</td>
                      <td className="p-3 text-center">{registro.saida}</td>
                      <td className="p-3 text-center font-semibold">{registro.horas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
