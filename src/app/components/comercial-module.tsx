import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Package, FileText, Wrench, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useEffect, useState } from 'react';
import { getClientes, createCliente, getChamados, agendarChamado, Cliente, Chamado, Project } from '@/services/api';
import { useProject } from './project-context';

function NovoClienteDialog({ onSuccess, selectedProject }: { onSuccess: () => void, selectedProject: Project | null }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', unidade: '', progresso: '0', entregaPrevista: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCliente({ 
        ...form, 
        obra: selectedProject?.name || '',
        progresso: parseInt(form.progresso),
        projectId: selectedProject?.id
      });
      setOpen(false);
      setForm({ nome: '', unidade: '', progresso: '0', entregaPrevista: '' });
      onSuccess();
    } finally { setLoading(false); }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A2E50]"><Package className="w-4 h-4 mr-2" />Novo Cliente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Cadastrar Cliente</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[['nome', 'Nome Completo'], ['unidade', 'Unidade (ex: Apto 301 - Torre A)']].map(([key, label]: string[]) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Obra</label>
            <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={selectedProject?.name || ''} disabled />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Progresso (%)</label>
              <input type="number" min="0" max="100" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.progresso} onChange={e => setForm(f => ({ ...f, progresso: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Entrega Prevista</label>
              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" placeholder="MM/AAAA" value={form.entregaPrevista} onChange={e => setForm(f => ({ ...f, entregaPrevista: e.target.value }))} />
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

const ManualContent = () => (
  <div className="space-y-6">
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <h4 className="font-semibold text-[#0A2E50] mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" />Bem-vindo ao KubicEng</h4>
      <p className="text-sm text-blue-800">Este manual fornece uma visão geral completa das funcionalidades do sistema para gestão eficiente de sua construtora.</p>
    </div>
    <div className="space-y-4">
      {[
        ['1. Painel Principal (Dashboard)', 'No Dashboard, você tem uma visão macro dos indicadores chave (KPIs) da empresa.', ['Fluxo de Caixa: Monitore entradas e saídas em tempo real.', 'Status das Obras: Acompanhe o progresso físico de cada empreendimento.', 'Alertas: Notificações sobre prazos e pendências urgentes.']],
        ['2. Módulo de Engenharia', 'Centralize toda a documentação técnica e gestão de projetos.', ['GED: Upload e versionamento de documentos.', 'Cronogramas: Acompanhamento de etapas.', 'RDO Digital: Diário de obra preenchido diariamente.']],
        ['3. Módulo Financeiro & Suprimentos', 'Controle rigoroso do orçamento para evitar estouros.', ['Curva ABC: Identifique os insumos mais impactantes.', 'Mapa de Cotação: Compare fornecedores.', 'Medições: Libere pagamentos após aprovação.']],
      ].map(([title, desc, items]) => (
        <section key={title as string}>
          <h5 className="font-bold text-gray-900 mb-2 border-b pb-1">{title as string}</h5>
          <p className="text-sm text-gray-600 mb-2">{desc as string}</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {(items as string[]).map(item => <li key={item}><strong>{item.split(':')[0]}:</strong>{item.includes(':') ? item.split(':').slice(1).join(':') : ''}</li>)}
          </ul>
        </section>
      ))}
    </div>
  </div>
);

export function ComercialModule() {
  const { selectedProject } = useProject();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const projectId = selectedProject?.id;
    const [c, ch] = await Promise.all([
      getClientes(projectId), 
      getChamados(projectId)
    ]);
    setClientes(c);
    setChamados(ch);
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedProject?.id]);

  const handleAgendar = async (id: string) => { await agendarChamado(id); load(); };

  const unidadesVendidas = clientes.length;
  const chamadosAbertos = chamados.filter(c => c.status === 'aberto').length;

  const prioridadeConfig = {
    alta: { color: 'bg-red-100 text-red-800', label: 'Alta' },
    media: { color: 'bg-yellow-100 text-yellow-800', label: 'Média' },
    baixa: { color: 'bg-green-100 text-green-800', label: 'Baixa' },
  };
  const statusConfig = {
    aberto: { icon: Clock, color: 'bg-orange-100 text-orange-800', label: 'Aberto' },
    agendado: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', label: 'Agendado' },
    concluido: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Concluído' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comercial e Pós-Obra</h2>
          <p className="text-gray-600">Portal do cliente e assistência técnica</p>
        </div>
        <NovoClienteDialog onSuccess={load} selectedProject={selectedProject} />
      </div>

      {!selectedProject ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Selecione uma Obra</h3>
          <p className="text-gray-500">Por favor, selecione uma obra ativa no menu lateral para gerenciar o comercial e pós-obra.</p>
        </Card>
      ) : (
        <>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4"><div className="text-sm text-gray-600">Unidades Cadastradas</div><div className="text-2xl font-bold text-gray-900 mt-1">{unidadesVendidas}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Em Construção</div><div className="text-2xl font-bold text-blue-600 mt-1">{clientes.filter(c => c.status === 'em_construcao').length}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Chamados Abertos</div><div className={`text-2xl font-bold mt-1 ${chamadosAbertos > 0 ? 'text-orange-600' : 'text-green-600'}`}>{chamadosAbertos}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Total de Chamados</div><div className="text-2xl font-bold text-gray-900 mt-1">{chamados.length}</div></Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Portal do Cliente - Acompanhamento de Obra</h3>
        {loading ? <p className="text-sm text-gray-500">Carregando...</p> : clientes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">Nenhum cliente cadastrado. Clique em "Novo Cliente".</p>
        ) : (
          <div className="space-y-4">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{cliente.nome}</h4>
                    <p className="text-sm text-gray-600">{cliente.unidade} • {cliente.obra}</p>
                  </div>
                  <Badge variant="outline">{cliente.status === 'em_construcao' ? 'Em Construção' : 'Entregue'}</Badge>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progresso da Obra</span>
                    <span className="font-semibold">{cliente.progresso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#0A2E50] h-2 rounded-full" style={{ width: `${cliente.progresso}%` }} />
                  </div>
                </div>
                {cliente.entregaPrevista && (
                  <span className="text-sm text-gray-600">Entrega prevista: {cliente.entregaPrevista}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Assistência Técnica</h3>
        {chamados.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhum chamado registrado.</p>
        ) : (
          <div className="space-y-3">
            {chamados.map((chamado) => {
              const prioConfig = prioridadeConfig[chamado.prioridade as keyof typeof prioridadeConfig] || prioridadeConfig.media;
              const statConfig = statusConfig[chamado.status as keyof typeof statusConfig] || statusConfig.aberto;
              const StatusIcon = statConfig.icon;
              return (
                <div key={chamado.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{chamado.problema}</h4>
                        <Badge className={prioConfig.color}>{prioConfig.label}</Badge>
                        <Badge className={statConfig.color}><StatusIcon className="w-3 h-3 mr-1" />{statConfig.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{chamado.cliente?.nome} • {chamado.cliente?.unidade}</p>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(chamado.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <Badge variant="outline" className="bg-green-50">
                      <CheckCircle className="w-3 h-3 mr-1" />{chamado.garantia ? 'Em Garantia' : 'Fora de Garantia'}
                    </Badge>
                    {chamado.status === 'aberto' && (
                      <Button size="sm" className="bg-[#0A2E50]" onClick={() => handleAgendar(chamado.id)}>
                        <Wrench className="w-4 h-4 mr-1" />Agendar Visita
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-gradient-to-r from-[#0A2E50] to-[#4A9EFF] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Manual do Proprietário Digital</h3>
            <p className="text-sm text-white/80 mb-4">Acesso completo a documentos, garantias e instruções de manutenção</p>
            <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary"><FileText className="w-4 h-4 mr-2" />Acessar Manual</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-[#0A2E50]">
                    <Package className="w-6 h-6" />Manual do Usuário KubicEng
                  </DialogTitle>
                  <DialogDescription>Guia completo de utilização da plataforma e gestão de imóveis.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4"><ManualContent /></ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <Package className="w-16 h-16 opacity-20" />
        </div>
      </Card>
        </>
      )}
    </div>
  );
}
