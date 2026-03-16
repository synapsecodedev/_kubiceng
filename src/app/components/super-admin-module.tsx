import { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreVertical,
  ShieldCheck,
  AlertCircle,
  Clock,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { usePlan } from '@/app/components/plan-context';
import { getAdminDashboard, getAdminUsers, getAdminPlans, updateSubscriptionStatus } from '@/services/api';
import logo from '../../assets/kubiceng-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Interface de Dados ---
interface AdminKPIs {
  totalContas: number;
  totalPlanos: number;
  assinaturasAtivas: number;
  assinaturasTrial: number;
  mrr: number;
}

interface PlanDist {
  nome: string;
  slug: string;
  quantidade: number;
}

interface FinancialData {
  nome: string;
  receita: number;
  assinantes: number;
}

interface UserAccount {
  id: string;
  nome: string;
  email: string;
  documento: string;
  plano: string;
  status: 'active' | 'trial' | 'overdue' | 'cancelled';
  dataCriacao: string;
}

const COLORS = ['#4A9EFF', '#0A2E50', '#22C55E', '#EF4444'];
export function SuperAdminModule({ 
  activeTab: externalTab, 
  onTabChange 
}: { 
  activeTab?: 'overview' | 'accounts' | 'plans' | 'financial',
  onTabChange?: (tab: string) => void
} = {}) {
  const [internalTab, setInternalTab] = useState<'overview' | 'accounts' | 'plans' | 'financial'>('overview');
  
  const activeTab = externalTab || internalTab;
  const setActiveTab = (tab: any) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const { user: adminUser } = usePlan();
  const [plansDist, setPlansDist] = useState<PlanDist[]>([]);
  const [financials, setFinancials] = useState<FinancialData[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar dados reais da API
  useEffect(() => {
    async function fetchData() {
      if (!adminUser?.id) return;
      
      try {
        const [dashboardData, usersData] = await Promise.all([
          getAdminDashboard(adminUser.id),
          getAdminUsers(adminUser.id)
        ]);

        setKpis(dashboardData.kpis);
        setPlansDist(dashboardData.planos);
        setFinancials(dashboardData.financeiro);
        setUsers(usersData);
      } catch (error) {
        console.error("Erro ao carregar dados do admin:", error);
        setKpis({
          totalContas: 0,
          totalPlanos: 0,
          assinaturasAtivas: 0,
          assinaturasTrial: 0,
          mrr: 0
        });
      }
    }

    fetchData();
  }, [adminUser]);

  const handleUpdateUserStatus = async (userId: string, status: any) => {
    if (!adminUser?.id) return;
    try {
      await updateSubscriptionStatus(adminUser.id, userId, status);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header com estilo premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
              <img src={logo} alt="KubicEng" className="h-7 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4A9EFF]" />
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Super Admin</h1>
              </div>
              <p className="text-gray-500 text-sm">Visão completa da plataforma KubicEng</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {(['overview', 'accounts', 'plans', 'financial'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'accounts' && 'Contas'}
              {tab === 'plans' && 'Planos'}
              {tab === 'financial' && 'Financeiro'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Dashboard KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPIItem title="Construtoras" value={kpis?.totalContas || 0} icon={Users} trend="+8 este mês" />
            <KPIItem title="Assinaturas Ativas" value={kpis?.assinaturasAtivas || 0} icon={CreditCard} subtitle="Em todos os planos" color="#22C55E" />
            <KPIItem title="MRR (Mensal)" value={`R$ ${kpis?.mrr.toLocaleString()}`} icon={TrendingUp} subtitle="Receita Recorrente" color="#4A9EFF" />
            <KPIItem title="Novos Trials" value={kpis?.assinaturasTrial || 0} icon={AlertCircle} subtitle="Contas em teste" color="#0A2E50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Distribuição */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-base font-semibold">Distribuição de Planos</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={plansDist}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      {/* @ts-ignore */}
                      <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} {...({} as any)} />
                      {/* @ts-ignore */}
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} {...({} as any)} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        cursor={{fill: '#f9fafb'}}
                      />
                      <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                        {plansDist.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status das Assinaturas */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-base font-semibold">Status das Assinaturas</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col justify-center items-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Ativas', value: kpis?.assinaturasAtivas || 0 },
                          { name: 'Em Teste', value: kpis?.assinaturasTrial || 0 },
                          { name: 'Inadimplentes', value: 4 },
                          { name: 'Canceladas', value: 2 },
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {COLORS.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  <StatusBadge label="Ativas" count={kpis?.assinaturasAtivas || 0} color="#22C55E" />
                  <StatusBadge label="Trial" count={kpis?.assinaturasTrial || 0} color="#0A2E50" />
                  <StatusBadge label="Inadimplentes" count={4} color="#4A9EFF" />
                  <StatusBadge label="Canceladas" count={2} color="#EF4444" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <CardTitle className="text-lg">Gestão de Contas</CardTitle>
              <CardDescription>Gerencie as construtoras cadastradas no sistema</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Buscar por nome ou email..." 
                  className="pl-9 w-[280px] bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 bg-gray-50/50 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Construtora</th>
                    <th className="px-6 py-4 font-medium">Documento</th>
                    <th className="px-6 py-4 font-medium">Plano</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{user.nome}</span>
                          <span className="text-gray-500 text-xs">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.documento}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50/30">
                          {user.plano}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <SubscriptionStatus status={user.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownActions 
                          user={user} 
                          onUpdate={(status) => handleUpdateUserStatus(user.id, status)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outras tabs seguiriam lógica similar... */}
      {activeTab === 'plans' && <PlansTab adminId={adminUser?.id} />}
      {activeTab === 'financial' && <FinancialTab financials={financials} kpis={kpis} />}
    </div>
  );
}

// --- Novos Componentes de Aba ---

function PlansTab({ adminId }: { adminId?: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) return;
    getAdminPlans(adminId).then(data => {
      setPlans(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [adminId]);

  if (loading) return <div className="py-20 text-center text-gray-500">Carregando planos...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.length > 0 ? plans.map((plan: any) => (
        <Card key={plan.id} className="border-none shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.slug}</CardDescription>
            </div>
            <Badge className="bg-blue-100 text-blue-600 border-none">R$ {plan.price}/mês</Badge>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {plan.maxProjects} Projetos</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {plan.maxUsers} Usuários</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {plan.storage}GB Armazenamento</li>
            </ul>
          </CardContent>
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <Button variant="outline" className="w-full">Editar Limites</Button>
          </div>
        </Card>
      )) : (
        <div className="col-span-3 py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-500">
           Nenhum plano configurado.
        </div>
      )}
    </div>
  );
}

function FinancialTab({ financials, kpis }: { financials: FinancialData[], kpis: AdminKPIs | null }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm">
          <h4 className="text-gray-500 text-xs font-medium uppercase mb-1">MRR Atual</h4>
          <p className="text-3xl font-bold">R$ {kpis?.mrr.toLocaleString() || '0'}</p>
          <p className="text-xs text-green-600 mt-2">+12% vs mês anterior</p>
        </Card>
        <Card className="p-6 border-none shadow-sm">
          <h4 className="text-gray-500 text-xs font-medium uppercase mb-1">Churn Rate</h4>
          <p className="text-3xl font-bold">2.4%</p>
          <p className="text-xs text-blue-600 mt-2">Dentro da meta</p>
        </Card>
        <Card className="p-6 border-none shadow-sm">
          <h4 className="text-gray-500 text-xs font-medium uppercase mb-1">LTV Médio</h4>
          <p className="text-3xl font-bold">R$ 4.250</p>
          <p className="text-xs text-gray-500 mt-2">Tempo médio: 14 meses</p>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg">Receita por Plano</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 bg-gray-50/50 uppercase">
              <tr>
                <th className="px-6 py-4">Plano</th>
                <th className="px-6 py-4">Assinantes</th>
                <th className="px-6 py-4 text-right">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {financials.map((f) => (
                <tr key={f.nome} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold">{f.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{f.assinantes}</td>
                  <td className="px-6 py-4 text-right font-medium">R$ {f.receita.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function DropdownActions({ user: _user, onUpdate }: { user: UserAccount, onUpdate: (status: string) => Promise<void> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Ações da Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onUpdate('active')}>
          <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
          Ativar Planta
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdate('trial')}>
          <Clock className="w-4 h-4 mr-2 text-blue-500" />
          Mudar para Trial
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdate('overdue')}>
          <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
          Marcar Inadimplente
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onUpdate('cancelled')}>
          <Settings className="w-4 h-4 mr-2" />
          Cancelar Assinatura
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

// --- Componentes Auxiliares ---

function KPIItem({ title, value, icon: Icon, trend, subtitle, color = "#111827" }: any) {
  return (
    <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-gray-50 group-hover:bg-white" style={{color}}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
        </div>
        <div>
          <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-900" style={{color}}>{value}</div>
          {subtitle && <p className="text-gray-400 text-[10px] mt-1">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100/50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{backgroundColor: color}} />
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{count}</span>
    </div>
  );
}

function SubscriptionStatus({ status }: { status: UserAccount['status'] }) {
  const configs = {
    active: { label: 'Ativo', classes: 'bg-green-50 text-green-600 border-green-100' },
    trial: { label: 'Trial', classes: 'bg-blue-50 text-blue-600 border-blue-100' },
    overdue: { label: 'Atrasado', classes: 'bg-orange-50 text-orange-600 border-orange-100' },
    cancelled: { label: 'Cancelado', classes: 'bg-red-50 text-red-600 border-red-100' },
  };

  const config = configs[status];
  return (
    <Badge variant="outline" className={config.classes}>
      {config.label}
    </Badge>
  );
}
