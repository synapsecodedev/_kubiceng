import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { FileText, Upload, FolderOpen, Calendar, DollarSign, Plus, Trash2, ArrowLeft, Layers } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { cn } from '@/app/components/ui/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useEffect, useState } from 'react';
import {
  createProject, deleteProject,
  getSchedule, getBudget,
  Project, ScheduleItem, BudgetItem
} from '@/services/api';
import { useProject } from './project-context';

function NovoProjetoDialog({ onSuccess, open, setOpen }: { onSuccess: () => void, open: boolean, setOpen: (open: boolean) => void }) {
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
    } catch (err: any) {
      console.error('Error creating project:', err);
      const msg = err.response?.data?.message || err.message || 'Erro deconhecido';
      alert(`Erro ao criar projeto: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🎉 Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da Obra/Projeto</label>
            <input
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Edifício Horizonte"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Versão Inicial</label>
            <input
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={form.version}
              onChange={e => setForm(f => ({ ...f, version: e.target.value }))}
              placeholder="Ex: 1.0"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UploadProjetoDialog({ onSuccess, open, setOpen }: { onSuccess: () => void, open: boolean, setOpen: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de upload para projeto existente
    setTimeout(() => {
      setOpen(false);
      onSuccess();
      setLoading(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📁 Upload de Projeto Existente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Arraste arquivos ou clique para selecionar</p>
            <p className="text-xs text-gray-400 mt-1">Suporta PDF, DWG, Excel (Gantt)</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#4A9EFF]" disabled={loading}>
              {loading ? 'Subindo...' : 'Fazer Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({ open, onConfirm, onCancel, projectName }: { open: boolean, onConfirm: () => void, onCancel: () => void, projectName: string }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚠️ Excluir Projeto</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Deseja realmente excluir o projeto <strong>{projectName}</strong> e todos os dados vinculados? 
            Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>Excluir permanentemente</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EngenhariaModule() {
  const { projects: projetos, selectedProject, setSelectedProject, loading: loadingProjects, refreshProjects } = useProject();
  const [cronograma, setCronograma] = useState<ScheduleItem[]>([]);
  const [orcamento, setOrcamento] = useState<BudgetItem[]>([]);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{ id: string, name: string } | null>(null);

  const loadDetails = async () => {
    if (!selectedProject) return;
    try {
      const [sched, budg] = await Promise.all([
        getSchedule(selectedProject.id),
        getBudget(selectedProject.id),
      ]);
      setCronograma(sched);
      setOrcamento(budg);
    } finally {
      // Done
    }
  };

  useEffect(() => { loadDetails(); }, [selectedProject?.id]);

  const handleCreated = () => {
    refreshProjects();
  };

  const confirmDelete = async () => {
    if (!deleteData) return;
    try {
      await deleteProject(deleteData.id);
      setDeleteData(null);
      await refreshProjects();
    } catch (err: any) {
      console.error('Error deleting project:', err);
      alert(`Erro ao excluir projeto: ${err.message}`);
    }
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
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Projeto
          </Button>
          <Button className="bg-[#0A2E50]" onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>

          <NovoProjetoDialog onSuccess={handleCreated} open={isNewDialogOpen} setOpen={setIsNewDialogOpen} />
          <UploadProjetoDialog onSuccess={handleCreated} open={isUploadDialogOpen} setOpen={setIsUploadDialogOpen} />
          {deleteData && (
            <DeleteConfirmDialog 
              open={!!deleteData} 
              projectName={deleteData.name} 
              onConfirm={confirmDelete} 
              onCancel={() => setDeleteData(null)} 
            />
          )}
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {selectedProject ? `Documentos - ${selectedProject.name}` : 'GED - Documentos de Engenharia'}
              </h3>
              {selectedProject && (
                <Button variant="outline" size="sm" onClick={() => setSelectedProject(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Lista
                </Button>
              )}
            </div>

            {loadingProjects ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : !selectedProject ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4 italic">Selecione um projeto para ver seus documentos ou use a lista abaixo:</p>
                {projetos.map((projeto: Project) => (
                  <div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedProject(projeto)}>
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">{projeto.name}</h4>
                        <p className="text-sm text-gray-500">Versão {projeto.version} • {new Date(projeto.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={projeto.status === 'aprovado' ? 'default' : 'outline'}>
                        {projeto.status === 'aprovado' ? 'Aprovado' : projeto.status === 'revisao' ? 'Em Revisão' : 'Análise'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteData({ id: projeto.id, name: projeto.name }); }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {projetos.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">Nenhum projeto cadastrado.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Projetos e Plantas', count: 12, icon: Layers, color: 'text-blue-500' },
                  { name: 'Alvarás e Licenças', count: 4, icon: FileText, color: 'text-orange-500' },
                  { name: 'Contratos', count: 8, icon: FolderOpen, color: 'text-purple-500' },
                  { name: 'Memorial Descritivo', count: 2, icon: FileText, color: 'text-green-500' },
                ].map((folder, i) => (
                  <div key={i} className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all group">
                    <folder.icon className={cn("w-8 h-8 mb-3", folder.color)} />
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{folder.name}</h4>
                    <p className="text-xs text-gray-500">{folder.count} arquivos</p>
                  </div>
                ))}
                <div className="p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer transition-all">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Nova Pasta</span>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Cronograma Tab */}
        <TabsContent value="cronograma" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cronograma Físico - Gantt Interativo</h3>
            {!selectedProject ? (
               <p className="text-sm text-gray-500 text-center py-8 italic">Selecione um projeto na aba "GED" ou no menu lateral para ver o cronograma.</p>
            ) : cronograma.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Nenhuma etapa cadastrada para {selectedProject.name}.</p>
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
            {!selectedProject ? (
               <p className="text-sm text-gray-500 text-center py-8 italic">Selecione um projeto na aba "GED" ou no menu lateral para ver o orçamento.</p>
            ) : orcamento.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Nenhum item de orçamento cadastrado para {selectedProject.name}.</p>
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
