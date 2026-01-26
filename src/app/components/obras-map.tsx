import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';

interface Obra {
  id: string;
  nome: string;
  localizacao: string;
  status: 'ativa' | 'atrasada' | 'concluida' | 'pausada';
  progresso: number;
  orcamento: string;
  prazo: string;
  engenheiro: string;
}

const obras: Obra[] = [
  {
    id: '1',
    nome: 'Residencial Torres do Mar',
    localizacao: 'Fortaleza, CE',
    status: 'ativa',
    progresso: 68,
    orcamento: 'R$ 15.5M',
    prazo: '12/2026',
    engenheiro: 'João Silva'
  },
  {
    id: '2',
    nome: 'Edifício Comercial Plaza',
    localizacao: 'São Paulo, SP',
    status: 'atrasada',
    progresso: 42,
    orcamento: 'R$ 22.3M',
    prazo: '06/2026',
    engenheiro: 'Maria Santos'
  },
  {
    id: '3',
    nome: 'Condomínio Verde Vida',
    localizacao: 'Rio de Janeiro, RJ',
    status: 'ativa',
    progresso: 85,
    orcamento: 'R$ 8.7M',
    prazo: '03/2026',
    engenheiro: 'Carlos Oliveira'
  },
  {
    id: '4',
    nome: 'Shopping Center Norte',
    localizacao: 'Brasília, DF',
    status: 'ativa',
    progresso: 35,
    orcamento: 'R$ 45.2M',
    prazo: '12/2027',
    engenheiro: 'Ana Costa'
  },
];

export function ObrasMap() {
  const statusConfig = {
    ativa: { label: 'Em Andamento', color: 'bg-green-500' },
    atrasada: { label: 'Atrasada', color: 'bg-red-500' },
    concluida: { label: 'Concluída', color: 'bg-blue-500' },
    pausada: { label: 'Pausada', color: 'bg-yellow-500' },
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Mapa de Obras</h3>
        <p className="text-sm text-gray-500">Visão geográfica das obras ativas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {obras.map((obra) => (
          <Card key={obra.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{obra.nome}</h4>
                <div className="flex items-center text-sm text-gray-600 gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{obra.localizacao}</span>
                </div>
              </div>
              <Badge className={statusConfig[obra.status].color}>
                {statusConfig[obra.status].label}
              </Badge>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progresso Físico</span>
                <span className="font-semibold">{obra.progresso}%</span>
              </div>
              <Progress value={obra.progresso} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Orçamento</p>
                  <p className="font-medium">{obra.orcamento}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Prazo</p>
                  <p className="font-medium">{obra.prazo}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Engenheiro Responsável</p>
              <p className="text-sm font-medium">{obra.engenheiro}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
