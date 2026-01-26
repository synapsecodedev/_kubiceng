import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { AlertTriangle, Clock, DollarSign, FileWarning, CheckCircle2 } from 'lucide-react';

interface Alerta {
  id: string;
  tipo: 'critico' | 'atencao' | 'info';
  categoria: 'cronograma' | 'orcamento' | 'documentacao' | 'compras' | 'seguranca';
  titulo: string;
  descricao: string;
  obra: string;
  data: string;
}

const alertas: Alerta[] = [
  {
    id: '1',
    tipo: 'critico',
    categoria: 'cronograma',
    titulo: 'Atraso no Cronograma',
    descricao: 'Concretagem da laje 12º andar atrasada em 5 dias',
    obra: 'Residencial Torres do Mar',
    data: '25/01/2026'
  },
  {
    id: '2',
    tipo: 'atencao',
    categoria: 'orcamento',
    titulo: 'Estouro de Orçamento',
    descricao: 'Gastos com acabamento 15% acima do previsto',
    obra: 'Edifício Comercial Plaza',
    data: '24/01/2026'
  },
  {
    id: '3',
    tipo: 'critico',
    categoria: 'documentacao',
    titulo: 'Documentação Vencida',
    descricao: 'Alvará de construção vence em 3 dias',
    obra: 'Condomínio Verde Vida',
    data: '23/01/2026'
  },
  {
    id: '4',
    tipo: 'atencao',
    categoria: 'compras',
    titulo: 'Compra Pendente Urgente',
    descricao: 'Solicitação de 500 sacos de cimento aguarda aprovação há 2 dias',
    obra: 'Shopping Center Norte',
    data: '22/01/2026'
  },
  {
    id: '5',
    tipo: 'info',
    categoria: 'seguranca',
    titulo: 'Treinamento NR-35',
    descricao: '12 funcionários precisam renovar certificação',
    obra: 'Residencial Torres do Mar',
    data: '22/01/2026'
  }
];

export function Alertas() {
  const tipoConfig = {
    critico: { 
      label: 'Crítico', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertTriangle,
      iconColor: 'text-red-500'
    },
    atencao: { 
      label: 'Atenção', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Clock,
      iconColor: 'text-orange-500'
    },
    info: { 
      label: 'Info', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle2,
      iconColor: 'text-blue-500'
    }
  };

  const categoriaIcons = {
    cronograma: Clock,
    orcamento: DollarSign,
    documentacao: FileWarning,
    compras: AlertTriangle,
    seguranca: AlertTriangle
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alertas Inteligentes</h3>
        <p className="text-sm text-gray-500">Notificações sobre eventos críticos nas obras</p>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta) => {
          const config = tipoConfig[alerta.tipo];
          const Icon = config.icon;
          const CategoriaIcon = categoriaIcons[alerta.categoria];

          return (
            <div
              key={alerta.id}
              className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{alerta.titulo}</h4>
                  <Badge variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alerta.descricao}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CategoriaIcon className="w-3 h-3" />
                    {alerta.obra}
                  </span>
                  <span>{alerta.data}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
