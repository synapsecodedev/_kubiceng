import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Package, FileText, Wrench, CheckCircle, Clock, Search, BookOpen, Share2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useState } from 'react';

export function ComercialModule() {
  const [isManualOpen, setIsManualOpen] = useState(false);

  // ... (keeping existing data arrays clientes/chamados SAME)
  const clientes = [
    {
      nome: 'João Pedro Almeida',
      unidade: 'Apto 1203 - Torre A',
      obra: 'Residencial Torres do Mar',
      status: 'em_construcao',
      progresso: 68,
      entrega_prevista: '12/2026'
    },
    {
      nome: 'Maria Clara Santos',
      unidade: 'Apto 805 - Torre B',
      obra: 'Residencial Torres do Mar',
      status: 'em_construcao',
      progresso: 68,
      entrega_prevista: '12/2026'
    }
  ];

  const chamados = [
    {
      id: 'AT-2026-001',
      cliente: 'Roberto Silva',
      unidade: 'Apto 301 - Torre C',
      problema: 'Infiltração no banheiro',
      data: '20/01/2026',
      prioridade: 'alta',
      status: 'aberto',
      garantia: 'sim'
    },
    {
      id: 'AT-2026-002',
      cliente: 'Ana Paula Costa',
      unidade: 'Apto 502 - Torre A',
      problema: 'Porta do quarto emperrando',
      data: '22/01/2026',
      prioridade: 'media',
      status: 'agendado',
      garantia: 'sim'
    },
    {
      id: 'AT-2026-003',
      cliente: 'Carlos Eduardo',
      unidade: 'Apto 1104 - Torre B',
      problema: 'Tomada sem energia',
      data: '24/01/2026',
      prioridade: 'alta',
      status: 'aberto',
      garantia: 'sim'
    }
  ];

  const ManualContent = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-semibold text-[#0A2E50] mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Bem-vindo ao KubicEng
        </h4>
        <p className="text-sm text-blue-800">
          Este manual fornece uma visão geral completa das funcionalidades do sistema para gestão eficiente de sua construtora.
        </p>
      </div>

      <div className="space-y-4">
        <section>
          <h5 className="font-bold text-gray-900 mb-2 border-b pb-1">1. Painel Principal (Dashboard)</h5>
          <p className="text-sm text-gray-600 mb-2">
            No Dashboard, você tem uma visão macro dos indicadores chave (KPIs) da empresa.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Fluxo de Caixa:</strong> Monitore entradas e saídas em tempo real.</li>
            <li><strong>Status das Obras:</strong> Acompanhe o progresso físico de cada empreendimento.</li>
            <li><strong>Alertas:</strong> Notificações sobre prazos e pendências urgentes.</li>
          </ul>
        </section>

        <section>
          <h5 className="font-bold text-gray-900 mb-2 border-b pb-1">2. Módulo de Engenharia</h5>
          <p className="text-sm text-gray-600 mb-2">
            Centralize toda a documentação técnica e gestão de projetos.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>GED (Gestão Eletrônica de Documentos):</strong> Upload e versionamento de plantas .DWG, .RV, etc.</li>
            <li><strong>Cronogramas:</strong> Importe arquivos do MS Project ou Excel.</li>
            <li><strong>RDO Digital:</strong> Diário de obra preenchido via mobile pelo engenheiro residente.</li>
          </ul>
        </section>

        <section>
          <h5 className="font-bold text-gray-900 mb-2 border-b pb-1">3. Módulo Financeiro & Suprimentos</h5>
          <p className="text-sm text-gray-600 mb-2">
            Controle rigoroso do orçamento para evitar estouros.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Curva ABC:</strong> Identifique os insumos mais impactantes.</li>
            <li><strong>Mapa de Cotação:</strong> Compare 3 preços automaticamente para cada compra.</li>
            <li><strong>Medições:</strong> Libere pagamentos apenas após aprovação da medição física.</li>
          </ul>
        </section>

        <section>
          <h5 className="font-bold text-gray-900 mb-2 border-b pb-1">4. Comercial & Pós-Obra</h5>
          <p className="text-sm text-gray-600 mb-2">
            Acompanhe a jornada do cliente desde a compra até a entrega das chaves.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Portal do Cliente:</strong> Onde o proprietário acessa fotos e boletos.</li>
            <li><strong>Assistência Técnica:</strong> Abertura e gestão de chamados de garantia.</li>
            <li><strong>Manual do Proprietário:</strong> Disponibilize este manual digitalmente.</li>
          </ul>
        </section>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button className="flex-1 bg-[#0A2E50]">
          <Download className="w-4 h-4 mr-2" />
          Baixar PDF
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comercial e Pós-Obra</h2>
          <p className="text-gray-600">Portal do cliente e assistência técnica</p>
        </div>
        <Button className="bg-[#0A2E50]">
          <Package className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... (Keeping Stats cards SAME) */}
        <Card className="p-4">
          <div className="text-sm text-gray-600">Unidades Vendidas</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">142</div>
          <div className="text-xs text-gray-500 mt-1">89% do total</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Unidades Entregues</div>
          <div className="text-2xl font-bold text-green-600 mt-1">87</div>
          <div className="text-xs text-gray-500 mt-1">Em 2025</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Chamados Abertos</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">12</div>
          <div className="text-xs text-gray-500 mt-1">Dentro da garantia</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Satisfação (NPS)</div>
          <div className="text-2xl font-bold text-green-600 mt-1">8.7</div>
          <div className="text-xs text-gray-500 mt-1">Muito bom</div>
        </Card>
      </div>

      {/* Portal do Cliente */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Portal do Cliente - Acompanhamento de Obra</h3>
        <div className="space-y-4">
          {clientes.map((cliente, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{cliente.nome}</h4>
                  <p className="text-sm text-gray-600">{cliente.unidade} • {cliente.obra}</p>
                </div>
                <Badge variant="outline">Em Construção</Badge>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progresso da Obra</span>
                  <span className="font-semibold">{cliente.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#0A2E50] h-2 rounded-full" 
                    style={{ width: `${cliente.progresso}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Entrega prevista: {cliente.entrega_prevista}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Boletos
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Fotos
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Assistência Técnica - Keeping SAME mostly */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Assistência Técnica</h3>
        <div className="space-y-3">
          {chamados.map((chamado) => {
            const prioridadeConfig = {
              alta: { color: 'bg-red-100 text-red-800', label: 'Alta' },
              media: { color: 'bg-yellow-100 text-yellow-800', label: 'Média' },
              baixa: { color: 'bg-green-100 text-green-800', label: 'Baixa' }
            };

            const statusConfig = {
              aberto: { icon: Clock, color: 'bg-orange-100 text-orange-800', label: 'Aberto' },
              agendado: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', label: 'Agendado' },
              concluido: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Concluído' }
            };

            const prioConfig = prioridadeConfig[chamado.prioridade as keyof typeof prioridadeConfig];
            const statConfig = statusConfig[chamado.status as keyof typeof statusConfig];
            const StatusIcon = statConfig.icon;

            return (
              <div key={chamado.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{chamado.problema}</h4>
                      <Badge className={prioConfig.color}>
                        {prioConfig.label}
                      </Badge>
                      <Badge className={statConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {chamado.cliente} • {chamado.unidade}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-500">{chamado.id}</p>
                    <p className="text-gray-500">{chamado.data}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Em Garantia
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                    {chamado.status === 'aberto' && (
                      <Button size="sm" className="bg-[#0A2E50]">
                        <Wrench className="w-4 h-4 mr-1" />
                        Agendar Visita
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Manual Digital */}
      <Card className="p-6 bg-gradient-to-r from-[#0A2E50] to-[#4A9EFF] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Manual do Proprietário Digital</h3>
            <p className="text-sm text-white/80 mb-4">
              Acesso completo a documentos, garantias e instruções de manutenção
            </p>
            <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" onClick={() => setIsManualOpen(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Acessar Manual
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-[#0A2E50]">
                    <Package className="w-6 h-6" />
                    Manual do Usuário KubicEng
                  </DialogTitle>
                  <DialogDescription>
                    Guia completo de utilização da plataforma e gestão de imóveis.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4">
                  <ManualContent />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <Package className="w-16 h-16 opacity-20" />
        </div>
      </Card>
    </div>
  );
}
