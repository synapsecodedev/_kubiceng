import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { DollarSign, TrendingDown, TrendingUp, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import {
  getContasPagar, pagarConta, createContaPagar,
  getMedicoes, createMedicao, aprovarMedicao,
  getFluxoCaixa,
  ContaPagar, Medicao, FluxoCaixa
} from '@/services/api';

function NovaMedicaoDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ empreiteiro: '', servico: '', periodo: '', executado: '', valor: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMedicao({ ...form, valor: parseFloat(form.valor) });
      setOpen(false);
      setForm({ empreiteiro: '', servico: '', periodo: '', executado: '', valor: '' });
      onSuccess();
    } finally { setLoading(false); }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A2E50]"><DollarSign className="w-4 h-4 mr-2" />Nova Medição</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova Medição de Empreiteiro</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[['empreiteiro', 'Empreiteiro'], ['servico', 'Serviço'], ['periodo', 'Período (ex: Jan/2026)'], ['executado', 'Executado (ex: 68%)']].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Valor Bruto (R$)</label>
            <input type="number" step="0.01" className="w-full mt-1 border rounded-md px-3 py-2 text-sm" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} required />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FinanceiroModule() {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [fluxo, setFluxo] = useState<FluxoCaixa[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [c, m, f] = await Promise.all([getContasPagar(), getMedicoes(), getFluxoCaixa()]);
    setContas(c);
    setMedicoes(m);
    setFluxo(f);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handlePagar = async (id: string) => {
    await pagarConta(id);
    load();
  };

  const handleAprovar = async (id: string) => {
    await aprovarMedicao(id);
    load();
  };

  const saldoDisponivel = medicoes.filter(m => m.status === 'aprovado').reduce((s, m) => s + m.liquido, 0);
  const aPagar30 = contas.filter(c => c.status !== 'pago').reduce((s, c) => s + c.valor, 0);
  const pendentes = medicoes.filter(m => m.status === 'pendente').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financeiro e Medições</h2>
          <p className="text-gray-600">Contas, medições de empreiteiros e fluxo de caixa</p>
        </div>
        <NovaMedicaoDialog onSuccess={load} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Receita Aprovada</div>
              <div className="text-2xl font-bold text-green-600 mt-1">R$ {(saldoDisponivel / 1000).toFixed(1)}k</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">A Pagar</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">R$ {(aPagar30 / 1000).toFixed(1)}k</div>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Medições Pendentes</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{pendentes}</div>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total de Contas</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{contas.length}</div>
            </div>
            <DollarSign className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="contas" className="w-full">
        <TabsList>
          <TabsTrigger value="contas"><DollarSign className="w-4 h-4 mr-2" />Contas a Pagar</TabsTrigger>
          <TabsTrigger value="medicoes"><FileText className="w-4 h-4 mr-2" />Medições</TabsTrigger>
          <TabsTrigger value="fluxo"><TrendingUp className="w-4 h-4 mr-2" />Fluxo de Caixa</TabsTrigger>
        </TabsList>

        <TabsContent value="contas" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contas a Pagar</h3>
            {loading ? <p className="text-sm text-gray-500">Carregando...</p> : contas.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Nenhuma conta cadastrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Fornecedor</th>
                      <th className="text-right p-3">Valor</th>
                      <th className="text-left p-3">Vencimento</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-right p-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contas.map((conta) => (
                      <tr key={conta.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{conta.fornecedor}</td>
                        <td className="p-3 text-right font-semibold">R$ {conta.valor.toLocaleString('pt-BR')}</td>
                        <td className="p-3">{new Date(conta.vencimento).toLocaleDateString('pt-BR')}</td>
                        <td className="p-3">
                          <Badge variant={conta.status === 'vencido' ? 'destructive' : conta.status === 'pago' ? 'default' : 'outline'}>
                            {conta.status === 'vencido' ? 'Vencido' : conta.status === 'pago' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          {conta.status !== 'pago' && (
                            <Button size="sm" variant="outline" onClick={() => handlePagar(conta.id)}>Pagar</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="medicoes" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Medições de Empreiteiros</h3>
            {medicoes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Nenhuma medição cadastrada.</p>
            ) : (
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
                      <div><p className="text-xs text-gray-500">Executado</p><p className="font-semibold">{med.executado}</p></div>
                      <div><p className="text-xs text-gray-500">Valor Bruto</p><p className="font-semibold">R$ {med.valor.toLocaleString('pt-BR')}</p></div>
                      <div><p className="text-xs text-gray-500">Retenção (5%)</p><p className="font-semibold text-orange-600">R$ {med.retencao.toLocaleString('pt-BR')}</p></div>
                      <div><p className="text-xs text-gray-500">Valor Líquido</p><p className="font-semibold text-green-600">R$ {med.liquido.toLocaleString('pt-BR')}</p></div>
                    </div>
                    {med.status === 'pendente' && (
                      <div className="flex justify-end">
                        <Button size="sm" className="bg-[#0A2E50]" onClick={() => handleAprovar(med.id)}>Aprovar Medição</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="fluxo" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa Projetado</h3>
            {fluxo.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Sem dados de fluxo de caixa. Adicione medições aprovadas e contas pagas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fluxo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis label={{ value: 'Valores (R$ mil)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="receita" fill="#4A9EFF" name="Receita" />
                  <Bar dataKey="despesa" fill="#0A2E50" name="Despesa" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
