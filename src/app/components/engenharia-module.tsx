import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { FileText, Upload, FolderOpen, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useEffect, useState } from 'react';
import { getProjects, Project } from '@/services/api';

export function EngenhariaModule() {
  const [projetos, setProjetos] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(data => setProjetos(data));
  }, []);

  const cronograma = [
    { etapa: 'Fundação', inicio: '01/01/2026', fim: '28/02/2026', progresso: 100, status: 'concluido' },
    { etapa: 'Estrutura', inicio: '01/03/2026', fim: '30/06/2026', progresso: 68, status: 'andamento' },
    { etapa: 'Alvenaria', inicio: '01/05/2026', fim: '31/08/2026', progresso: 35, status: 'andamento' },
    { etapa: 'Instalações', inicio: '01/07/2026', fim: '30/09/2026', progresso: 0, status: 'nao_iniciado' },
    { etapa: 'Acabamento', inicio: '01/10/2026', fim: '30/11/2026', progresso: 0, status: 'nao_iniciado' },
  ];

  const orcamento = [
    { item: 'Fundação e Estrutura', orcado: 'R$ 4.5M', realizado: 'R$ 4.2M', variacao: -6.7 },
    { item: 'Alvenaria e Vedação', orcado: 'R$ 2.8M', realizado: 'R$ 2.9M', variacao: 3.6 },
    { item: 'Instalações', orcado: 'R$ 3.2M', realizado: 'R$ 1.8M', variacao: -43.8 },
    { item: 'Acabamento', orcado: 'R$ 4.0M', realizado: 'R$ 0.3M', variacao: -92.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Engenharia e Planejamento</h2>
          <p className="text-gray-600">Gestão de documentos, cronogramas e orçamentos executivos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Projeto
          </Button>
          <Button className="bg-[#0A2E50]">
            <FileText className="w-4 h-4 mr-2" />
            Novo Documento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ged" className="w-full">
        <TabsList>
          <TabsTrigger value="ged">
            <FolderOpen className="w-4 h-4 mr-2" />
            GED - Documentos
          </TabsTrigger>
          <TabsTrigger value="cronograma">
            <Calendar className="w-4 h-4 mr-2" />
            Cronograma Físico
          </TabsTrigger>
          <TabsTrigger value="orcamento">
            <DollarSign className="w-4 h-4 mr-2" />
            Orçamento Executivo
          </TabsTrigger>
        </TabsList>

        {/* GED Tab */}
        <TabsContent value="ged" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Projetos - Residencial Torres do Mar</h3>
            <div className="space-y-3">
              {projetos.map((projeto) => (
                <div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#0A2E50]" />
                    <div>
                      <h4 className="font-medium">{projeto.name}</h4>
                      <p className="text-sm text-gray-500">Versão {projeto.version} • {new Date(projeto.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <Badge variant={projeto.status === 'aprovado' ? 'default' : 'outline'}>
                    {projeto.status === 'aprovado' ? 'Aprovado' : 'Em Revisão'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Cronograma Tab */}
        <TabsContent value="cronograma" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cronograma Físico - Gantt Interativo</h3>
            <div className="space-y-4">
              {cronograma.map((etapa, index) => {
                const statusColors = {
                  concluido: 'bg-green-500',
                  andamento: 'bg-blue-500',
                  nao_iniciado: 'bg-gray-300'
                };
                const statusLabels = {
                  concluido: 'Concluído',
                  andamento: 'Em Andamento',
                  nao_iniciado: 'Não Iniciado'
                };

                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{etapa.etapa}</h4>
                        <p className="text-sm text-gray-500">{etapa.inicio} - {etapa.fim}</p>
                      </div>
                      <Badge className={statusColors[etapa.status as keyof typeof statusColors]}>
                        {statusLabels[etapa.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={etapa.progresso} className="flex-1 h-3" />
                      <span className="text-sm font-semibold min-w-[3rem]">{etapa.progresso}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Orçamento Tab */}
        <TabsContent value="orcamento" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Orçamento Executivo - Curva ABC</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Item</th>
                    <th className="text-right p-3">Orçado</th>
                    <th className="text-right p-3">Realizado</th>
                    <th className="text-right p-3">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamento.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.item}</td>
                      <td className="p-3 text-right">{item.orcado}</td>
                      <td className="p-3 text-right">{item.realizado}</td>
                      <td className={`p-3 text-right font-semibold ${item.variacao > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.variacao > 0 ? '+' : ''}{item.variacao.toFixed(1)}%
                      </td>
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
