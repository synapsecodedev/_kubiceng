import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Users, Shield, Clock, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { useEffect, useState } from 'react';
import { getFuncionarios, createFuncionario, getEpis, distribuirEpi, getPonto, Funcionario, ItemEpi, RegistroPonto } from '@/services/api';
import { useProject } from './project-context';

function NovoFuncionarioDialog({ onSuccess, selectedProjectId }: { onSuccess: () => void, selectedProjectId?: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', funcao: '', obra: '', tipo: 'proprio' as 'proprio' | 'terceiro', nr35: '', nr10: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFuncionario({ ...form, projectId: selectedProjectId });
      setOpen(false);
      setForm({ nome: '', funcao: '', obra: '', tipo: 'proprio', nr35: '', nr10: '' });
      onSuccess();
    } finally { setLoading(false); }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A2E50]"><Users className="w-4 h-4 mr-2" />Novo Funcionário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Cadastrar Funcionário</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[['nome', 'Nome Completo'], ['funcao', 'Função'], ['obra', 'Obra Atual']].map(([key, label]: string[]) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <select className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as any }))}>
              <option value="proprio">Próprio</option><option value="terceiro">Terceirizado</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Validade NR-35</label>
              <input type="date" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.nr35} onChange={e => setForm(f => ({ ...f, nr35: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Validade NR-10</label>
              <input type="date" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.nr10} onChange={e => setForm(f => ({ ...f, nr10: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FichaFuncionario({ func }: { func: Funcionario }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">Ver Ficha</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader><SheetTitle>{func.nome}</SheetTitle></SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500">Função</p><p className="font-medium">{func.funcao}</p></div>
            <div><p className="text-xs text-gray-500">Obra</p><p className="font-medium">{func.obra}</p></div>
            <div><p className="text-xs text-gray-500">Tipo</p><Badge variant={func.tipo === 'proprio' ? 'default' : 'outline'}>{func.tipo === 'proprio' ? 'Próprio' : 'Terceiro'}</Badge></div>
            <div><p className="text-xs text-gray-500">Status</p><Badge variant={func.status === 'ativo' ? 'default' : 'destructive'}>{func.status === 'ativo' ? 'Ativo' : 'Treinamento Vencido'}</Badge></div>
          </div>
          <div className="border-t pt-4">
            <p className="font-semibold mb-2">Treinamentos</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">NR-35</span><span>{func.nr35 || 'Não aplicável'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">NR-10</span><span>{func.nr10 || 'Não aplicável'}</span></div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function PessoasModule() {
  const { selectedProject } = useProject();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [epis, setEpis] = useState<ItemEpi[]>([]);
  const [ponto, setPonto] = useState<RegistroPonto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const projectId = selectedProject?.id;
    const [f, e, p] = await Promise.all([
      getFuncionarios(projectId), 
      getEpis(), 
      getPonto(undefined, projectId)
    ]);
    setFuncionarios(f);
    setEpis(e);
    setPonto(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedProject?.id]);

  const handleDistribuirEpi = async (epiId: string) => {
    const qtd = parseInt(prompt('Quantidade a distribuir:') || '0');
    if (qtd > 0) { await distribuirEpi(epiId, qtd); load(); }
  };

  const total = funcionarios.length;
  const proprios = funcionarios.filter(f => f.tipo === 'proprio').length;
  const terceiros = funcionarios.filter(f => f.tipo === 'terceiro').length;
  const vencidos = funcionarios.filter(f => f.status === 'treinamento_vencido').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Pessoas</h2>
          <p className="text-gray-600">RH, Segurança do Trabalho e controle de ponto</p>
        </div>
        <NovoFuncionarioDialog onSuccess={load} selectedProjectId={selectedProject?.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total de Funcionários</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{total}</div>
          <div className="text-xs text-gray-500 mt-1">{proprios} próprios • {terceiros} terceiros</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Treinamentos Vencidos</div>
          <div className={`text-2xl font-bold mt-1 ${vencidos > 0 ? 'text-red-600' : 'text-green-600'}`}>{vencidos}</div>
          <div className="text-xs text-gray-500 mt-1">{vencidos > 0 ? 'Requerem atenção' : 'Tudo em dia'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">EPIs Cadastrados</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{epis.length}</div>
          <div className="text-xs text-gray-500 mt-1">Itens monitorados</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Registros de Ponto</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{ponto.length}</div>
          <div className="text-xs text-gray-500 mt-1">Hoje</div>
        </Card>
      </div>

      <Tabs defaultValue="funcionarios" className="w-full">
        <TabsList>
          <TabsTrigger value="funcionarios"><Users className="w-4 h-4 mr-2" />Funcionários</TabsTrigger>
          <TabsTrigger value="sst"><Shield className="w-4 h-4 mr-2" />SST & Treinamentos</TabsTrigger>
          <TabsTrigger value="ponto"><Clock className="w-4 h-4 mr-2" />Controle de Ponto</TabsTrigger>
        </TabsList>

        <TabsContent value="funcionarios" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lista de Funcionários</h3>
            {loading ? <p className="text-sm text-gray-500">Carregando...</p> : funcionarios.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Nenhum funcionário cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b">
                    <th className="text-left p-3">Nome</th>
                    <th className="text-left p-3">Função</th>
                    <th className="text-left p-3">Obra</th>
                    <th className="text-left p-3">Tipo</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Ações</th>
                  </tr></thead>
                  <tbody>
                    {funcionarios.map((func) => (
                      <tr key={func.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{func.nome}</td>
                        <td className="p-3">{func.funcao}</td>
                        <td className="p-3 text-sm">{func.obra}</td>
                        <td className="p-3"><Badge variant={func.tipo === 'proprio' ? 'default' : 'outline'}>{func.tipo === 'proprio' ? 'Próprio' : 'Terceiro'}</Badge></td>
                        <td className="p-3"><Badge variant={func.status === 'ativo' ? 'default' : 'destructive'}>{func.status === 'ativo' ? 'Ativo' : 'Treinamento Vencido'}</Badge></td>
                        <td className="p-3 text-right"><FichaFuncionario func={func} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="sst" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Controle de EPIs</h3>
            {epis.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum EPI cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b">
                    <th className="text-left p-3">Item</th>
                    <th className="text-right p-3">Qtd. Disponível</th>
                    <th className="text-right p-3">Qtd. Mínima</th>
                    <th className="text-left p-3">Última Distribuição</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Ações</th>
                  </tr></thead>
                  <tbody>
                    {epis.map((epi) => {
                      const critico = epi.qtdDisponivel < epi.qtdMinima;
                      return (
                        <tr key={epi.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{epi.item}</td>
                          <td className={`p-3 text-right ${critico ? 'text-red-600 font-bold' : ''}`}>{epi.qtdDisponivel}</td>
                          <td className="p-3 text-right text-gray-500">{epi.qtdMinima}</td>
                          <td className="p-3">{epi.ultimaDistribuicao ? new Date(epi.ultimaDistribuicao).toLocaleDateString('pt-BR') : '-'}</td>
                          <td className="p-3"><Badge variant={critico ? 'destructive' : 'default'}>{critico ? 'Repor Estoque' : 'OK'}</Badge></td>
                          <td className="p-3 text-right">
                            <Button size="sm" variant="outline" onClick={() => handleDistribuirEpi(epi.id)}>Distribuir</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          {vencidos > 0 && (
            <Card className="p-6">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Treinamentos Vencidos</h4>
                  <p className="text-sm text-orange-800">{vencidos} funcionário(s) com treinamento vencido.</p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ponto" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Registro de Ponto — Hoje</h3>
            {ponto.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum registro de ponto para hoje.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b">
                    <th className="text-left p-3">Funcionário</th>
                    <th className="text-center p-3">Entrada</th>
                    <th className="text-center p-3">Saída Almoço</th>
                    <th className="text-center p-3">Volta Almoço</th>
                    <th className="text-center p-3">Saída</th>
                    <th className="text-center p-3">Total Horas</th>
                  </tr></thead>
                  <tbody>
                    {ponto.map((reg) => (
                      <tr key={reg.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{reg.funcionario?.nome || reg.funcionarioId}</td>
                        <td className="p-3 text-center">{reg.entrada || '-'}</td>
                        <td className="p-3 text-center">{reg.saidaAlmoco || '-'}</td>
                        <td className="p-3 text-center">{reg.voltaAlmoco || '-'}</td>
                        <td className="p-3 text-center">{reg.saida || '-'}</td>
                        <td className="p-3 text-center font-semibold">{reg.totalHoras || '-'}</td>
                      </tr>
                    ))}
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
