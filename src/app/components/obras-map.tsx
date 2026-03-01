import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { useEffect, useState } from 'react';
import { getProjects, getBudget, Project } from '@/services/api';

interface ObraDisplay {
  id: string;
  nome: string;
  status: string;
  progresso: number;
  orcamento: string;
  prazo: string;
}

export function ObrasMap() {
  const [obras, setObras] = useState<ObraDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(async (projetos: Project[]) => {
        const obrasComDados = await Promise.all(
          projetos.map(async (p) => {
            let progressoMedio = 0;
            let orcamentoTotal = 'N/A';
            try {
              const budget = await getBudget(p.id);
              if (budget.length > 0) {
                const totalOrcado = budget.reduce((s, b) => s + b.budgetedAmount, 0);
                orcamentoTotal = `R$ ${(totalOrcado / 1_000_000).toFixed(1)}M`;
              }
            } catch {}
            return {
              id: p.id,
              nome: p.name,
              status: p.status,
              progresso: progressoMedio,
              orcamento: orcamentoTotal,
              prazo: p.date
                ? new Date(p.date).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
                : '—',
            };
          })
        );
        setObras(obrasComDados);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusConfig: Record<string, { label: string; color: string }> = {
    aprovado: { label: 'Aprovado', color: 'bg-green-500' },
    revisao: { label: 'Em Revisão', color: 'bg-yellow-500' },
    em_analise: { label: 'Em Análise', color: 'bg-blue-500' },
    atrasado: { label: 'Atrasado', color: 'bg-red-500' },
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Mapa de Obras</h3>
        <p className="text-sm text-gray-500">Visão geográfica das obras ativas</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando obras...</p>
      ) : obras.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Nenhuma obra cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {obras.map((obra) => {
            const cfg = statusConfig[obra.status] ?? { label: obra.status, color: 'bg-gray-500' };
            return (
              <Card key={obra.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{obra.nome}</h4>
                    <div className="flex items-center text-sm text-gray-600 gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Versão {obra.prazo}</span>
                    </div>
                  </div>
                  <Badge className={cfg.color}>{cfg.label}</Badge>
                </div>

                {obra.progresso > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progresso Físico</span>
                      <span className="font-semibold">{obra.progresso}%</span>
                    </div>
                    <Progress value={obra.progresso} className="h-2" />
                  </div>
                )}

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
                      <p className="text-xs text-gray-500">Data</p>
                      <p className="font-medium">{obra.prazo}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Card>
  );
}
