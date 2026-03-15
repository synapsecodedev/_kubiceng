import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { AlertTriangle, Clock, DollarSign, FileWarning, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAlertas, Alerta } from '@/services/api';
import { useProject } from './project-context';

export function Alertas() {
  const { selectedProject } = useProject();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAlertas(selectedProject?.id)
      .then(setAlertas)
      .finally(() => setLoading(false));
  }, [selectedProject?.id]);

  const tipoConfig = {
    critico: { label: 'Crítico', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, iconColor: 'text-red-500' },
    atencao: { label: 'Atenção', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock, iconColor: 'text-orange-500' },
    info: { label: 'Info', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2, iconColor: 'text-blue-500' },
  };

  const categoriaIcons = {
    cronograma: Clock,
    orcamento: DollarSign,
    documentacao: FileWarning,
    compras: AlertTriangle,
    seguranca: AlertTriangle,
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alertas Inteligentes</h3>
        <p className="text-sm text-gray-500">Notificações sobre eventos críticos nas obras</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando alertas...</p>
      ) : alertas.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p className="font-medium text-green-700">Tudo em dia!</p>
          <p className="text-sm">Nenhum alerta crítico no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((alerta) => {
            const config = tipoConfig[alerta.tipo as keyof typeof tipoConfig] || tipoConfig.info;
            const Icon = config.icon;
            const CategoriaIcon = categoriaIcons[alerta.categoria as keyof typeof categoriaIcons] || AlertTriangle;

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
                    <Badge variant="outline" className={config.color}>{config.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alerta.descricao}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CategoriaIcon className="w-3 h-3" />{alerta.obra}
                    </span>
                    <span>{alerta.data}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
