import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { FileText, Upload, FolderOpen, Calendar, DollarSign, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { useEffect, useState } from 'react';
import {
  getProjects, createProject, deleteProject,
  getSchedule, getBudget,
  Project, ScheduleItem, BudgetItem
} from '@/services/api';

function NovoProjetoDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', version: '1.0', status: 'revisao' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject({ ...form, date: new Date().toISOString() });
      setOpen(false);
      setForm({ name: '', version: '1.0', status: 'revisao' });
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A2E50]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Documento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Documento / Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome do Documento</label>
            <input
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Projeto Arquitetônico - Torre A"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Versão</label>
            <input
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={form.version}
              onChange={e => setForm(f => ({ ...f, version: e.target.value }))}
              placeholder="Ex: 1.0"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              <option value="revisao">Em Revisão</option>
              <option value="aprovado">Aprovado</option>
              <option value="em_analise">Em Análise</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EngenhariaModule() {
  const [projetos, setProjetos] = useState<Project[]>([]);
  const [cronograma, setCronograma] = useState<ScheduleItem[]>([]);
  const [orcamento, setOrcamento] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjetos = async () => {
    try {
      const data = await getProjects();
      setProjetos(data);
      // Carregar cronograma e orçamento do primeiro projeto
      if (data.length > 0) {
        const [sched, budg] = await Promise.all([
          getSchedule(data[0].id),
          getBudget(data[0].id),
        ]);
        setCronograma(sched);
        setOrcamento(budg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjetos(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este documento?')) return;
    await deleteProject(id);
    loadProjetos();
  };

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
          <NovoProjetoDialog onSuccess={loadProjetos} />
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
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : projetos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Nenhum documento cadastrado. Clique em "Novo Documento" para começar.</p>
            ) : (
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
                    <div className="flex items-center gap-2">
                      <Badge variant={projeto.status === 'aprovado' ? 'default' : 'outline'}>
                        {projeto.status === 'aprovado' ? 'Aprovado' : projeto.status === 'revisao' ? 'Em Revisão' : 'Em Análise'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(projeto.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Cronograma Tab */}
        <TabsContent value="cronograma" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cronograma Físico - Gantt Interativo</h3>
            {cronograma.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Nenhuma etapa cadastrada para este projeto.</p>
            ) : (
              <div className="space-y-4">
                {cronograma.map((etapa) => {
                  const statusColors = { concluido: 'bg-green-500', andamento: 'bg-blue-500', nao_iniciado: 'bg-gray-300' };
                  const statusLabels = { concluido: 'Concluído', andamento: 'Em Andamento', nao_iniciado: 'Não Iniciado' };
                  return (
                    <div key={etapa.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{etapa.stage}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(etapa.startDate).toLocaleDateString('pt-BR')} - {new Date(etapa.endDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge className={statusColors[etapa.status as keyof typeof statusColors]}>
                          {statusLabels[etapa.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={etapa.progress} className="flex-1 h-3" />
                        <span className="text-sm font-semibold min-w-[3rem]">{etapa.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Orçamento Tab */}
        <TabsContent value="orcamento" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Orçamento Executivo - Curva ABC</h3>
            {orcamento.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Nenhum item de orçamento cadastrado.</p>
            ) : (
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
                    {orcamento.map((item) => {
                      const variacao = item.budgetedAmount > 0
                        ? ((item.realizedAmount - item.budgetedAmount) / item.budgetedAmount) * 100
                        : 0;
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{item.item}</td>
                          <td className="p-3 text-right">R$ {item.budgetedAmount.toLocaleString('pt-BR')}</td>
                          <td className="p-3 text-right">R$ {item.realizedAmount.toLocaleString('pt-BR')}</td>
                          <td className={`p-3 text-right font-semibold ${variacao > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
