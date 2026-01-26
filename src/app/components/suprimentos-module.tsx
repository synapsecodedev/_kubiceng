import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ShoppingCart, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function SuprimentosModule() {
  const requisicoes = [
    { 
      id: 'REQ-2026-001', 
      item: '500 sacos de Cimento CP-II', 
      obra: 'Residencial Torres do Mar',
      solicitante: 'João Silva',
      data: '22/01/2026',
      status: 'pendente_aprovacao',
      valor: 'R$ 18.500'
    },
    { 
      id: 'REQ-2026-002', 
      item: '200m³ de Concreto FCK 25', 
      obra: 'Shopping Center Norte',
      solicitante: 'Ana Costa',
      data: '23/01/2026',
      status: 'cotacao',
      valor: 'R$ 52.000'
    },
    { 
      id: 'REQ-2026-003', 
      item: '1000 tijolos cerâmicos', 
      obra: 'Edifício Comercial Plaza',
      solicitante: 'Maria Santos',
      data: '24/01/2026',
      status: 'aprovado',
      valor: 'R$ 3.200'
    },
  ];

  const cotacoes = [
    {
      item: '500 sacos de Cimento CP-II',
      fornecedores: [
        { nome: 'CimentoMax', preco: 'R$ 37,00/un', prazo: '5 dias', condicao: '30 dias' },
        { nome: 'Constrular', preco: 'R$ 36,50/un', prazo: '3 dias', condicao: '45 dias' },
        { nome: 'DepositoBR', preco: 'R$ 38,00/un', prazo: '2 dias', condicao: '15 dias' },
      ]
    }
  ];

  const ordens = [
    { id: 'OC-2026-045', fornecedor: 'Constrular', valor: 'R$ 18.250', data: '20/01/2026', status: 'entregue' },
    { id: 'OC-2026-046', fornecedor: 'MetalPro', valor: 'R$ 45.800', data: '21/01/2026', status: 'transito' },
    { id: 'OC-2026-047', fornecedor: 'MaderMax', valor: 'R$ 12.300', data: '22/01/2026', status: 'aguardando' },
  ];

  const statusConfig = {
    pendente_aprovacao: { label: 'Pendente Aprovação', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    cotacao: { label: 'Em Cotação', color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
    aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  };

  const statusOC = {
    entregue: { label: 'Entregue', color: 'bg-green-500' },
    transito: { label: 'Em Trânsito', color: 'bg-blue-500' },
    aguardando: { label: 'Aguardando', color: 'bg-gray-500' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suprimentos e Compras</h2>
          <p className="text-gray-600">Requisições, cotações e ordens de compra</p>
        </div>
        <Button className="bg-[#0A2E50]">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Nova Requisição
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Requisições Pendentes</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">18</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Em Cotação</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">6</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Ordens Ativas</div>
          <div className="text-2xl font-bold text-green-600 mt-1">24</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Economia (mês)</div>
          <div className="text-2xl font-bold text-green-600 mt-1">R$ 84k</div>
        </Card>
      </div>

      {/* Requisições */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Requisições de Material</h3>
        <div className="space-y-3">
          {requisicoes.map((req) => {
            const config = statusConfig[req.status as keyof typeof statusConfig];
            const Icon = config.icon;

            return (
              <div key={req.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{req.item}</h4>
                      <Badge className={config.color}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{req.obra} • Solicitante: {req.solicitante}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{req.valor}</p>
                    <p className="text-xs text-gray-500">{req.id}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-500">Data: {req.data}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                    {req.status === 'pendente_aprovacao' && (
                      <Button size="sm" className="bg-[#0A2E50]">Aprovar</Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Mapa de Cotação */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Mapa de Cotação Comparativo</h3>
        {cotacoes.map((cotacao, index) => (
          <div key={index}>
            <h4 className="font-medium mb-3">{cotacao.item}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cotacao.fornecedores.map((fornecedor, idx) => (
                <Card key={idx} className={`p-4 ${idx === 1 ? 'border-2 border-green-500' : ''}`}>
                  {idx === 1 && (
                    <Badge className="mb-2 bg-green-500">Melhor Custo-Benefício</Badge>
                  )}
                  <h5 className="font-semibold mb-2">{fornecedor.nome}</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço:</span>
                      <span className="font-semibold">{fornecedor.preco}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prazo:</span>
                      <span>{fornecedor.prazo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pagamento:</span>
                      <span>{fornecedor.condicao}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-3" variant={idx === 1 ? 'default' : 'outline'}>
                    Selecionar
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Card>

      {/* Ordens de Compra */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ordens de Compra (OC)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Fornecedor</th>
                <th className="text-right p-3">Valor</th>
                <th className="text-left p-3">Data</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ordens.map((ordem) => (
                <tr key={ordem.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{ordem.id}</td>
                  <td className="p-3">{ordem.fornecedor}</td>
                  <td className="p-3 text-right">{ordem.valor}</td>
                  <td className="p-3">{ordem.data}</td>
                  <td className="p-3">
                    <Badge className={statusOC[ordem.status as keyof typeof statusOC].color}>
                      {statusOC[ordem.status as keyof typeof statusOC].label}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
