import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Camera, Users, Package as PackageIcon, FileCheck, CloudSun, CloudRain } from 'lucide-react';

export function ExecucaoModule() {
  const rdos = [
    {
      data: '25/01/2026',
      obra: 'Residencial Torres do Mar',
      clima: { manha: 'sol', tarde: 'sol' },
      efetivo: { proprio: 45, terceiro: 23 },
      atividades: [
        'Concretagem laje 12º andar',
        'Instalação hidráulica 10º andar',
        'Alvenaria 8º andar'
      ],
      fotos: 12
    },
    {
      data: '24/01/2026',
      obra: 'Residencial Torres do Mar',
      clima: { manha: 'sol', tarde: 'chuva' },
      efetivo: { proprio: 42, terceiro: 20 },
      atividades: [
        'Preparação de armadura laje 12',
        'Revestimento 9º andar'
      ],
      fotos: 8
    }
  ];

  const fvs = [
    {
      id: 'FVS-001',
      titulo: 'Conferência de Armadura - Laje 12',
      obra: 'Residencial Torres do Mar',
      data: '24/01/2026',
      status: 'aprovado',
      responsavel: 'João Silva - Eng. Civil'
    },
    {
      id: 'FVS-002',
      titulo: 'Verificação de Prumo - Pilares 11º Andar',
      obra: 'Residencial Torres do Mar',
      data: '23/01/2026',
      status: 'pendente',
      responsavel: 'Carlos Oliveira - Eng. Civil'
    }
  ];

  const estoque = [
    { material: 'Cimento CP-II', qtd_atual: 350, qtd_minima: 200, unidade: 'sacos', status: 'ok' },
    { material: 'Areia Média', qtd_atual: 15, qtd_minima: 20, unidade: 'm³', status: 'critico' },
    { material: 'Brita 1', qtd_atual: 42, qtd_minima: 30, unidade: 'm³', status: 'ok' },
    { material: 'Aço CA-50 10mm', qtd_atual: 180, qtd_minima: 150, unidade: 'barras', status: 'ok' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Execução e Canteiro</h2>
          <p className="text-gray-600">Diário de obra, qualidade e controle de almoxarifado</p>
        </div>
        <Button className="bg-[#0A2E50]">
          <Camera className="w-4 h-4 mr-2" />
          Novo RDO
        </Button>
      </div>

      <Tabs defaultValue="rdo" className="w-full">
        <TabsList>
          <TabsTrigger value="rdo">
            <FileCheck className="w-4 h-4 mr-2" />
            Diário de Obra (RDO)
          </TabsTrigger>
          <TabsTrigger value="fvs">
            <FileCheck className="w-4 h-4 mr-2" />
            Qualidade (FVS)
          </TabsTrigger>
          <TabsTrigger value="almoxarifado">
            <PackageIcon className="w-4 h-4 mr-2" />
            Almoxarifado
          </TabsTrigger>
        </TabsList>

        {/* RDO Tab */}
        <TabsContent value="rdo" className="space-y-4">
          {rdos.map((rdo, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{rdo.obra}</h3>
                  <p className="text-sm text-gray-500">{rdo.data}</p>
                </div>
                <Button variant="outline" size="sm">Ver Completo</Button>
              </div>

              {/* Clima */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {rdo.clima.manha === 'sol' ? (
                    <CloudSun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CloudRain className="w-5 h-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Manhã</p>
                    <p className="font-medium capitalize">{rdo.clima.manha}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rdo.clima.tarde === 'sol' ? (
                    <CloudSun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CloudRain className="w-5 h-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Tarde</p>
                    <p className="font-medium capitalize">{rdo.clima.tarde}</p>
                  </div>
                </div>
              </div>

              {/* Efetivo */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Users className="w-5 h-5 text-[#0A2E50]" />
                  <div>
                    <p className="text-xs text-gray-500">Próprio</p>
                    <p className="text-xl font-bold">{rdo.efetivo.proprio}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Users className="w-5 h-5 text-[#4A9EFF]" />
                  <div>
                    <p className="text-xs text-gray-500">Terceirizado</p>
                    <p className="text-xl font-bold">{rdo.efetivo.terceiro}</p>
                  </div>
                </div>
              </div>

              {/* Atividades */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Atividades Executadas</h4>
                <ul className="space-y-1">
                  {rdo.atividades.map((atividade, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A2E50]" />
                      {atividade}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fotos */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Camera className="w-4 h-4" />
                <span>{rdo.fotos} fotos geolocalizadas</span>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* FVS Tab */}
        <TabsContent value="fvs" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fichas de Verificação de Serviço</h3>
            <div className="space-y-3">
              {fvs.map((fvs) => (
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
                    <span className="text-sm text-gray-500">{fvs.data}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-600">{fvs.responsavel}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Ver Checklist</Button>
                      {fvs.status === 'pendente' && (
                        <Button size="sm" className="bg-[#0A2E50]">Assinar</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Almoxarifado Tab */}
        <TabsContent value="almoxarifado" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Controle de Estoque</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Entrada (NF-e)</Button>
                <Button size="sm" className="bg-[#0A2E50]">Saída Material</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Material</th>
                    <th className="text-right p-3">Qtd. Atual</th>
                    <th className="text-right p-3">Qtd. Mínima</th>
                    <th className="text-left p-3">Unidade</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {estoque.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.material}</td>
                      <td className="p-3 text-right">
                        <span className={item.status === 'critico' ? 'text-red-600 font-bold' : ''}>
                          {item.qtd_atual}
                        </span>
                      </td>
                      <td className="p-3 text-right text-gray-500">{item.qtd_minima}</td>
                      <td className="p-3">{item.unidade}</td>
                      <td className="p-3">
                        <Badge variant={item.status === 'ok' ? 'default' : 'destructive'}>
                          {item.status === 'ok' ? 'Estoque OK' : 'Estoque Crítico'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
