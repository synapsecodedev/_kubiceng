import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Camera, Users, Package as PackageIcon, FileCheck, CloudSun, CloudRain, Hammer, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { getRdos, createRdo, getFvs, assinarFvs, getEstoque, entradaEstoque, saidaEstoque, Rdo, FichaVerificacao, ItemEstoque, Project } from '@/services/api';
import { useProject } from './project-context';

function NovoRdoDialog({ onSuccess, selectedProject }: { onSuccess: () => void, selectedProject: Project | null }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ climaManha: 'sol', climaTarde: 'sol', efetivoProprio: 0, efetivoTerceiro: 0, atividades: '', fotos: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRdo({ 
        ...form, 
        obra: selectedProject?.name || 'Obra não selecionada',
        data: new Date().toISOString(),
        atividades: JSON.stringify(form.atividades.split('\n').filter(Boolean)),
        projectId: selectedProject?.id 
      });
      setOpen(false);
      onSuccess();
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A2E50]"><Camera className="w-4 h-4 mr-2" />Novo RDO</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo RDO - Diário de Obra</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Obra</label>
            <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={selectedProject?.name || 'Selecione uma Obra...'} disabled />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Clima Manhã</label>
              <select className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.climaManha} onChange={e => setForm(f => ({ ...f, climaManha: e.target.value }))}>
                <option value="sol">Sol</option><option value="chuva">Chuva</option><option value="nublado">Nublado</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Clima Tarde</label>
              <select className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.climaTarde} onChange={e => setForm(f => ({ ...f, climaTarde: e.target.value }))}>
                <option value="sol">Sol</option><option value="chuva">Chuva</option><option value="nublado">Nublado</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Efetivo Próprio</label>
              <input type="number" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.efetivoProprio} onChange={e => setForm(f => ({ ...f, efetivoProprio: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Efetivo Terceiros</label>
              <input type="number" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.efetivoTerceiro} onChange={e => setForm(f => ({ ...f, efetivoTerceiro: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Atividades (uma por linha)</label>
            <textarea className="w-full mt-1 border rounded-md px-3 py-2 text-sm" rows={4} value={form.atividades} onChange={e => setForm(f => ({ ...f, atividades: e.target.value }))} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>{loading ? 'Salvando...' : 'Salvar RDO'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MovimentacaoDialog({ item, tipo, onSuccess }: { item: ItemEstoque; tipo: 'entrada' | 'saida'; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [qtd, setQtd] = useState(1);
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tipo === 'entrada') await entradaEstoque(item.id, qtd, obs);
      else await saidaEstoque(item.id, qtd, obs);
      setOpen(false);
      onSuccess();
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={tipo === 'entrada' ? 'outline' : 'default'} className={tipo === 'saida' ? 'bg-[#0A2E50]' : ''}>
          {tipo === 'entrada' ? 'Entrada (NF-e)' : 'Saída Material'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{tipo === 'entrada' ? 'Entrada de Material' : 'Saída de Material'} — {item.material}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Quantidade ({item.unidade})</label>
            <input type="number" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" min={1} value={qtd} onChange={e => setQtd(parseInt(e.target.value) || 1)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Observação</label>
            <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={obs} onChange={e => setObs(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>{loading ? 'Salvando...' : 'Confirmar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ExecucaoModule() {
  const { selectedProject } = useProject();
  const [rdos, setRdos] = useState<Rdo[]>([]);
  const [fvsList, setFvsList] = useState<FichaVerificacao[]>([]);
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  // const [activeEstoque, setActiveEstoque] = useState<ItemEstoque | null>(null);

  const load = async () => {
    setLoading(true);
    const projectId = selectedProject?.id;
    const [r, f, e] = await Promise.all([
      getRdos(projectId), 
      getFvs(projectId), 
      getEstoque(projectId)
    ]);
    setRdos(r);
    setFvsList(f);
    setEstoque(e);
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedProject?.id]);

  const handleAssinar = async (id: string) => {
    try {
      await assinarFvs(id);
      toast.success('Fiche de Verificação assinada com sucesso!');
      load();
    } catch (err) {
      toast.error('Erro ao assinar ficha.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Execução e Canteiro</h2>
          <p className="text-gray-600">Diário de obra, qualidade e controle de estoque e almoxarifado</p>
        </div>
        <div className="flex gap-2">
           {/* Botões contextuais poderiam ir aqui, mas o RDO é o principal */}
           <NovoRdoDialog onSuccess={load} selectedProject={selectedProject} />
        </div>
      </div>

      {!selectedProject ? (
        <Card className="p-12 text-center">
          <Hammer className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Selecione uma Obra</h3>
          <p className="text-gray-500">Por favor, selecione uma obra ativa no menu lateral para gerenciar a execução e o estoque.</p>
        </Card>
      ) : (
        <>
        <Tabs defaultValue="rdo" className="w-full">
          <TabsList>
            <TabsTrigger value="rdo"><FileCheck className="w-4 h-4 mr-2" />Diário de Obra (RDO)</TabsTrigger>
            <TabsTrigger value="fvs"><CheckCircle className="w-4 h-4 mr-2" />Qualidade (FVS)</TabsTrigger>
            <TabsTrigger value="almoxarifado"><PackageIcon className="w-4 h-4 mr-2" />Controle de Estoque</TabsTrigger>
          </TabsList>

        <TabsContent value="rdo" className="space-y-4">
          {loading ? <p className="text-sm text-gray-500">Carregando...</p> : rdos.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">Nenhum RDO cadastrado. Clique em "Novo RDO" para começar.</Card>
          ) : rdos.map((rdo, index) => {
            const atividades: string[] = (() => { try { return JSON.parse(rdo.atividades); } catch { return [rdo.atividades]; } })();
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{rdo.obra}</h3>
                    <p className="text-sm text-gray-500">{new Date(rdo.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {rdo.climaManha === 'sol' ? <CloudSun className="w-5 h-5 text-yellow-500" /> : <CloudRain className="w-5 h-5 text-blue-500" />}
                    <div><p className="text-xs text-gray-500">Manhã</p><p className="font-medium capitalize">{rdo.climaManha}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    {rdo.climaTarde === 'sol' ? <CloudSun className="w-5 h-5 text-yellow-500" /> : <CloudRain className="w-5 h-5 text-blue-500" />}
                    <div><p className="text-xs text-gray-500">Tarde</p><p className="font-medium capitalize">{rdo.climaTarde}</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Users className="w-5 h-5 text-[#0A2E50]" />
                    <div><p className="text-xs text-gray-500">Próprio</p><p className="text-xl font-bold">{rdo.efetivoProprio}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Users className="w-5 h-5 text-[#4A9EFF]" />
                    <div><p className="text-xs text-gray-500">Terceirizado</p><p className="text-xl font-bold">{rdo.efetivoTerceiro}</p></div>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Atividades Executadas</h4>
                  <ul className="space-y-1">
                    {atividades.map((atv, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0A2E50]" />{atv}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="w-4 h-4" /><span>{rdo.fotos} fotos registradas</span>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="fvs" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fichas de Verificação de Serviço</h3>
            {fvsList.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma FVS cadastrada.</p>
            ) : (
              <div className="space-y-3">
                {fvsList.map((fvs) => (
                  <div key={fvs.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{fvs.titulo}</h4>
                          <Badge variant={fvs.status === 'aprovado' ? 'default' : 'outline'}>
                            {fvs.status === 'aprovado' ? 'Aprovado' : 'Pendente Assinatura'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{fvs.obra}</p>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(fvs.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-gray-600">{fvs.responsavel}</span>
                      <div className="flex gap-2">
                        {fvs.status === 'pendente' && (
                          <Button size="sm" className="bg-[#0A2E50]" onClick={() => handleAssinar(fvs.id)}>Assinar</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="almoxarifado" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Controle de Estoque</h3>
            </div>
            {estoque.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum item no estoque.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Material</th>
                      <th className="text-right p-3">Qtd. Atual</th>
                      <th className="text-right p-3">Qtd. Mínima</th>
                      <th className="text-left p-3">Unidade</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-right p-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estoque.map((item) => {
                      const critico = item.qtdAtual < item.qtdMinima;
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{item.material}</td>
                          <td className={`p-3 text-right ${critico ? 'text-red-600 font-bold' : ''}`}>{item.qtdAtual}</td>
                          <td className="p-3 text-right text-gray-500">{item.qtdMinima}</td>
                          <td className="p-3">{item.unidade}</td>
                          <td className="p-3">
                            <Badge variant={critico ? 'destructive' : 'default'}>
                              {critico ? 'Estoque Crítico' : 'Estoque OK'}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-1 justify-end">
                              <MovimentacaoDialog item={item} tipo="entrada" onSuccess={load} />
                              <MovimentacaoDialog item={item} tipo="saida" onSuccess={load} />
                            </div>
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
        </>
      )}
    </div>
  );
}
