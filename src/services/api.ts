import axios from 'axios';

const isProd = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProd ? '/api' : 'http://localhost:3333',
});

// Interceptor global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error?.response?.data?.message || error.message || 'Erro desconhecido';
    console.error(`[API Error] ${error?.config?.method?.toUpperCase()} ${error?.config?.url} → ${msg}`);
    return Promise.reject(new Error(msg));
  }
);


// ===== TIPOS =====

export interface Project {
  id: string;
  name: string;
  version: string;
  status: string;
  date: string;
  fileUrl?: string;
}

export interface ScheduleItem {
  id: string;
  projectId: string;
  stage: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
}

export interface BudgetItem {
  id: string;
  projectId: string;
  item: string;
  budgetedAmount: number;
  realizedAmount: number;
}

export interface Rdo {
  id: string;
  obra: string;
  data: string;
  climaManha: string;
  climaTarde: string;
  efetivoProprio: number;
  efetivoTerceiro: number;
  atividades: string; // JSON string
  fotos: number;
}

export interface FichaVerificacao {
  id: string;
  titulo: string;
  obra: string;
  responsavel: string;
  status: string;
  data: string;
}

export interface ItemEstoque {
  id: string;
  material: string;
  qtdAtual: number;
  qtdMinima: number;
  unidade: string;
  ultimaEntrada?: string;
}

export interface ContaPagar {
  id: string;
  fornecedor: string;
  valor: number;
  vencimento: string;
  status: string;
}

export interface Medicao {
  id: string;
  empreiteiro: string;
  servico: string;
  periodo: string;
  executado: string;
  valor: number;
  retencao: number;
  liquido: number;
  status: string;
}

export interface FluxoCaixa {
  mes: string;
  receita: number;
  despesa: number;
}

export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  obra: string;
  tipo: string;
  status: string;
  nr35?: string;
  nr10?: string;
}

export interface ItemEpi {
  id: string;
  item: string;
  qtdDisponivel: number;
  qtdMinima: number;
  ultimaDistribuicao?: string;
}

export interface RegistroPonto {
  id: string;
  funcionarioId: string;
  funcionario?: { nome: string };
  data: string;
  entrada?: string;
  saidaAlmoco?: string;
  voltaAlmoco?: string;
  saida?: string;
  totalHoras?: string;
}

export interface Requisicao {
  id: string;
  item: string;
  obra: string;
  solicitante: string;
  valor: number;
  status: string;
  cotacoes: Cotacao[];
  createdAt: string;
}

export interface Cotacao {
  id: string;
  requisicaoId: string;
  fornecedor: string;
  preco: number;
  prazo: string;
  condicao: string;
  selecionada: boolean;
}

export interface OrdemCompra {
  id: string;
  fornecedor: string;
  valor: number;
  status: string;
  createdAt: string;
}

export interface Cliente {
  id: string;
  nome: string;
  unidade: string;
  obra: string;
  status: string;
  progresso: number;
  entregaPrevista?: string;
  chamados?: Chamado[];
}

export interface Chamado {
  id: string;
  clienteId: string;
  cliente?: { nome: string; unidade: string };
  problema: string;
  prioridade: string;
  status: string;
  garantia: boolean;
  createdAt: string;
}

export interface Alerta {
  id: string;
  tipo: string;
  categoria: string;
  titulo: string;
  descricao: string;
  obra: string;
  data: string;
}

export interface DashboardKpis {
  obrasAtivas: number;
  saldoCaixa: number;
  alertasCriticos: number;
  comprasPendentes: number;
  medicoesPendentes: number;
  funcionariosAtivos: number;
}

// ===== ENGENHARIA =====

export const getProjects = () => api.get<Project[]>('/projects').then(r => r.data);
export const createProject = (data: Omit<Project, 'id'>) => api.post<Project>('/projects', data).then(r => r.data);
export const updateProject = (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);
export const getSchedule = (projectId: string) => api.get<ScheduleItem[]>(`/projects/${projectId}/schedule`).then(r => r.data);
export const createScheduleItem = (projectId: string, data: Omit<ScheduleItem, 'id' | 'projectId'>) => api.post<ScheduleItem>(`/projects/${projectId}/schedule`, data).then(r => r.data);
export const updateScheduleItem = (projectId: string, itemId: string, data: Partial<ScheduleItem>) => api.put<ScheduleItem>(`/projects/${projectId}/schedule/${itemId}`, data).then(r => r.data);
export const getBudget = (projectId: string) => api.get<BudgetItem[]>(`/projects/${projectId}/budget`).then(r => r.data);
export const createBudgetItem = (projectId: string, data: Omit<BudgetItem, 'id' | 'projectId'>) => api.post<BudgetItem>(`/projects/${projectId}/budget`, data).then(r => r.data);
export const updateBudgetItem = (projectId: string, itemId: string, data: Partial<BudgetItem>) => api.put<BudgetItem>(`/projects/${projectId}/budget/${itemId}`, data).then(r => r.data);

// ===== EXECUÇÃO =====

export const getRdos = () => api.get<Rdo[]>('/rdos').then(r => r.data);
export const createRdo = (data: Omit<Rdo, 'id'>) => api.post<Rdo>('/rdos', data).then(r => r.data);
export const getFvs = () => api.get<FichaVerificacao[]>('/fvs').then(r => r.data);
export const createFvs = (data: Omit<FichaVerificacao, 'id' | 'status'>) => api.post<FichaVerificacao>('/fvs', data).then(r => r.data);
export const assinarFvs = (id: string) => api.patch<FichaVerificacao>(`/fvs/${id}/assinar`).then(r => r.data);
export const getEstoque = () => api.get<ItemEstoque[]>('/estoque').then(r => r.data);
export const createItemEstoque = (data: Omit<ItemEstoque, 'id'>) => api.post<ItemEstoque>('/estoque', data).then(r => r.data);
export const entradaEstoque = (itemEstoqueId: string, quantidade: number, observacao?: string) => api.post('/estoque/entrada', { itemEstoqueId, quantidade, observacao }).then(r => r.data);
export const saidaEstoque = (itemEstoqueId: string, quantidade: number, observacao?: string) => api.post('/estoque/saida', { itemEstoqueId, quantidade, observacao }).then(r => r.data);

// ===== FINANCEIRO =====

export const getContasPagar = () => api.get<ContaPagar[]>('/contas-pagar').then(r => r.data);
export const createContaPagar = (data: Omit<ContaPagar, 'id' | 'status'>) => api.post<ContaPagar>('/contas-pagar', data).then(r => r.data);
export const pagarConta = (id: string) => api.patch<ContaPagar>(`/contas-pagar/${id}/pagar`).then(r => r.data);
export const getMedicoes = () => api.get<Medicao[]>('/medicoes').then(r => r.data);
export const createMedicao = (data: Omit<Medicao, 'id' | 'retencao' | 'liquido' | 'status'>) => api.post<Medicao>('/medicoes', data).then(r => r.data);
export const aprovarMedicao = (id: string) => api.patch<Medicao>(`/medicoes/${id}/aprovar`).then(r => r.data);
export const getFluxoCaixa = () => api.get<FluxoCaixa[]>('/fluxo-caixa').then(r => r.data);

// ===== PESSOAS =====

export const getFuncionarios = () => api.get<Funcionario[]>('/funcionarios').then(r => r.data);
export const getFuncionario = (id: string) => api.get<Funcionario>(`/funcionarios/${id}`).then(r => r.data);
export const createFuncionario = (data: Omit<Funcionario, 'id' | 'status'>) => api.post<Funcionario>('/funcionarios', data).then(r => r.data);
export const updateFuncionario = (id: string, data: Partial<Funcionario>) => api.put<Funcionario>(`/funcionarios/${id}`, data).then(r => r.data);
export const getEpis = () => api.get<ItemEpi[]>('/epis').then(r => r.data);
export const createEpi = (data: Omit<ItemEpi, 'id'>) => api.post<ItemEpi>('/epis', data).then(r => r.data);
export const distribuirEpi = (epiId: string, quantidade: number) => api.post('/epis/distribuicao', { epiId, quantidade }).then(r => r.data);
export const getPonto = (data?: string) => api.get<RegistroPonto[]>('/ponto', { params: { data } }).then(r => r.data);
export const createRegistroPonto = (data: Omit<RegistroPonto, 'id'>) => api.post<RegistroPonto>('/ponto', data).then(r => r.data);

// ===== SUPRIMENTOS =====

export const getRequisicoes = () => api.get<Requisicao[]>('/requisicoes').then(r => r.data);
export const createRequisicao = (data: Omit<Requisicao, 'id' | 'status' | 'cotacoes' | 'createdAt'>) => api.post<Requisicao>('/requisicoes', data).then(r => r.data);
export const aprovarRequisicao = (id: string) => api.patch<Requisicao>(`/requisicoes/${id}/aprovar`).then(r => r.data);
export const getCotacoes = () => api.get<Cotacao[]>('/cotacoes').then(r => r.data);
export const createCotacao = (data: Omit<Cotacao, 'id' | 'selecionada'>) => api.post<Cotacao>('/cotacoes', data).then(r => r.data);
export const selecionarCotacao = (id: string) => api.patch<Cotacao>(`/cotacoes/${id}/selecionar`).then(r => r.data);
export const getOrdens = () => api.get<OrdemCompra[]>('/ordens-compra').then(r => r.data);
export const createOrdem = (data: Omit<OrdemCompra, 'id' | 'status' | 'createdAt'>) => api.post<OrdemCompra>('/ordens-compra', data).then(r => r.data);
export const atualizarStatusOrdem = (id: string, status: OrdemCompra['status']) => api.patch<OrdemCompra>(`/ordens-compra/${id}/status`, { status }).then(r => r.data);

// ===== COMERCIAL =====

export const getClientes = () => api.get<Cliente[]>('/clientes').then(r => r.data);
export const createCliente = (data: Omit<Cliente, 'id' | 'status' | 'chamados'>) => api.post<Cliente>('/clientes', data).then(r => r.data);
export const updateCliente = (id: string, data: Partial<Cliente>) => api.put<Cliente>(`/clientes/${id}`, data).then(r => r.data);
export const getChamados = () => api.get<Chamado[]>('/chamados').then(r => r.data);
export const createChamado = (data: Omit<Chamado, 'id' | 'status' | 'createdAt' | 'cliente'>) => api.post<Chamado>('/chamados', data).then(r => r.data);
export const agendarChamado = (id: string) => api.patch<Chamado>(`/chamados/${id}/agendar`).then(r => r.data);
export const concluirChamado = (id: string) => api.patch<Chamado>(`/chamados/${id}/concluir`).then(r => r.data);

// ===== DASHBOARD =====

export const getDashboardKpis = () => api.get<DashboardKpis>('/dashboard/kpis').then(r => r.data);
export const getAlertas = () => api.get<Alerta[]>('/alertas').then(r => r.data);
