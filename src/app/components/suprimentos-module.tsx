import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ShoppingCart, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  getRequisicoes, createRequisicao, aprovarRequisicao,
  getOrdens, selecionarCotacao,
  Requisicao, OrdemCompra, Project
} from '@/services/api';
import { useProject } from './project-context';

function NovaRequisicaoDialog({ onSuccess, selectedProject }: { onSuccess: () => void, selectedProject: Project | null }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item: '', solicitante: '', valor: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRequisicao({ 
        ...form, 
        obra: selectedProject?.name || 'Obra não selecionada',
        valor: parseFloat(form.valor),
        projectId: selectedProject?.id 
      });
      setOpen(false);
      setForm({ item: '', solicitante: '', valor: '' });
      onSuccess();
    } finally { setLoading(false); }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A2E50]"><ShoppingCart className="w-4 h-4 mr-2" />Nova Requisição</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova Requisição de Material</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[['item', 'Item / Material'], ['solicitante', 'Solicitante']].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Obra</label>
            <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={selectedProject?.name || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Valor Estimado (R$)</label>
            <input type="number" step="0.01" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} required />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>{loading ? 'Salvando...' : 'Enviar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SuprimentosModule() {
  const { selectedProject } = useProject();
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [ordens, setOrdens] = useState<OrdemCompra[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const projectId = selectedProject?.id;
    const [r, o] = await Promise.all([
      getRequisicoes(projectId), 
      getOrdens(projectId)
    ]);
    setRequisicoes(r);
    setOrdens(o);
    setLoading(false);
  };

  useEffect(() => { 
    if (selectedProject?.id) {
      load(); 
    } else {
      setRequisicoes([]);
      setOrdens([]);
      setLoading(false);
    }
  }, [selectedProject?.id]);

  const handleAprovar = async (id: string) => { 
    try {
      await aprovarRequisicao(id); 
      toast.success('Requisição aprovada com sucesso!');
      load(); 
    } catch (err) {
      toast.error('Erro ao aprovar requisição.');
    }
  };
  const handleSelecionar = async (cotacaoId: string) => { 
    try {
      await selecionarCotacao(cotacaoId); 
      toast.success('Cotação selecionada!');
      load(); 
    } catch (err) {
      toast.error('Erro ao selecionar cotação.');
    }
  };

  const statusConfig = {
    pendente_aprovacao: { label: 'Pendente Aprovação', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    cotacao: { label: 'Em Cotação', color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
    aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelado: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: Clock },
  };

  const statusOC = {
    entregue: 'bg-green-500',
    transito: 'bg-blue-500',
    aguardando: 'bg-gray-500',
    cancelado: 'bg-red-500',
  };

  const pendentes = requisicoes.filter(r => r.status === 'pendente_aprovacao').length;
  const emCotacao = requisicoes.filter(r => r.status === 'cotacao').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suprimentos e Compras</h2>
          <p className="text-gray-600">Requisições, cotações e ordens de compra</p>
        </div>
        <NovaRequisicaoDialog onSuccess={load} selectedProject={selectedProject} />
      </div>

      {!selectedProject ? (
        <Card className="p-12 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Selecione uma Obra</h3>
          <p className="text-gray-500">Por favor, selecione uma obra ativa no menu lateral para gerenciar os suprimentos.</p>
        </Card>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4"><div className="text-sm text-gray-600">Requisições Pendentes</div><div className="text-2xl font-bold text-gray-900 mt-1">{pendentes}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Em Cotação</div><div className="text-2xl font-bold text-blue-600 mt-1">{emCotacao}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Ordens Ativas</div><div className="text-2xl font-bold text-green-600 mt-1">{ordens.filter(o => o.status !== 'entregue').length}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Total Requisições</div><div className="text-2xl font-bold text-orange-600 mt-1">{requisicoes.length}</div></Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Requisições de Material</h3>
        {loading ? <p className="text-sm text-gray-500">Carregando...</p> : requisicoes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">Nenhuma requisição. Clique em "Nova Requisição".</p>
        ) : (
          <div className="space-y-3">
            {requisicoes.map((req) => {
              const config = statusConfig[req.status as keyof typeof statusConfig] || statusConfig.cancelado;
              const Icon = config.icon;
              return (
                <div key={req.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{req.item}</h4>
                        <Badge className={config.color}><Icon className="w-3 h-3 mr-1" />{config.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{req.obra} • Solicitante: {req.solicitante}</p>
                    </div>
                    <p className="font-semibold text-lg">R$ {req.valor.toLocaleString('pt-BR')}</p>
                  </div>
                  {/* Cotações inline */}
                  {req.cotacoes && req.cotacoes.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {req.cotacoes.map((cot) => (
                        <div key={cot.id} className={`p-3 border rounded-lg ${cot.selecionada ? 'border-green-500 bg-green-50' : ''}`}>
                          {cot.selecionada && <Badge className="mb-1 bg-green-500">Selecionada</Badge>}
                          <p className="font-semibold text-sm">{cot.fornecedor}</p>
                          <p className="text-xs text-gray-600">R$ {cot.preco.toLocaleString('pt-BR')} • {cot.prazo}</p>
                          {!cot.selecionada && <Button size="sm" className="w-full mt-2 bg-[#0A2E50]" onClick={() => handleSelecionar(cot.id)}>Selecionar</Button>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString('pt-BR')}</span>
                    {req.status === 'pendente_aprovacao' && (
                      <Button size="sm" className="bg-[#0A2E50]" onClick={() => handleAprovar(req.id)}>Aprovar</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ordens de Compra (OC)</h3>
        {ordens.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhuma ordem gerada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b">
                <th className="text-left p-3">Fornecedor</th>
                <th className="text-right p-3">Valor</th>
                <th className="text-left p-3">Data</th>
                <th className="text-left p-3">Status</th>
              </tr></thead>
              <tbody>
                {ordens.map((ordem) => (
                  <tr key={ordem.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{ordem.fornecedor}</td>
                    <td className="p-3 text-right">R$ {ordem.valor.toLocaleString('pt-BR')}</td>
                    <td className="p-3">{new Date(ordem.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">
                      <Badge className={statusOC[ordem.status as keyof typeof statusOC] || 'bg-gray-400'}>
                        {ordem.status === 'entregue' ? 'Entregue' : ordem.status === 'transito' ? 'Em Trânsito' : ordem.status === 'aguardando' ? 'Aguardando' : 'Cancelado'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
        </>
      )}
    </div>
  );
}
