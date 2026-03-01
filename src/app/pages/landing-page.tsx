import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Check, ArrowRight, Building2, BarChart3, Users, Calculator,
  X, Menu, HardHat, Ruler, Layers, ClipboardList,
  Package, TrendingUp, Shield, Zap, Instagram, Linkedin, Youtube,
  Mail, Phone, HeadphonesIcon
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Switch } from '@/app/components/ui/switch';
import { cn } from '@/app/components/ui/utils';
import logo from '../../assets/8f30dd8152d74b306dc9f5214b67e2bfbf83636d.png';
import { FaWhatsapp } from 'react-icons/fa';

interface LandingPageProps {
  onLogin: () => void;
}

// ============================================================
// COMPONENTE: Blueprint Grid (fundo técnico decorativo)
// ============================================================
function BlueprintGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* grid perspectiva */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#4A9EFF" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="150" height="150" patternUnits="userSpaceOnUse">
            <rect width="150" height="150" fill="url(#smallGrid)"/>
            <path d="M 150 0 L 0 0 0 150" fill="none" stroke="#4A9EFF" strokeWidth="1.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* linhas horizontais decorativas */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
      <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
      {/* canto técnico */}
      <div className="absolute top-32 right-12 w-32 h-32 border border-blue-400/10 rounded-full" />
      <div className="absolute top-32 right-12 w-48 h-48 border border-blue-400/05 rounded-full -translate-x-8 -translate-y-8" />
    </div>
  );
}

// ============================================================
// RODAPÉ PADRÃO SYNAPSE CODE
// ============================================================
function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 border-t border-white/5">
      <div className="container mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Logo + descrição + social */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img src={logo} alt="KubicEng" className="h-7 w-auto" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">Kubic<span className="text-blue-400">Eng</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              A plataforma completa para gestão de construtoras. Controle total do orçamento ao canteiro de obras.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 — Produto */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Produto</h4>
            <ul className="space-y-3 text-sm">
              {['Funcionalidades', 'Preços', 'Atualizações', 'Roadmap'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Empresa */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm">
              {['Sobre Nós', 'Blog', 'Carreiras', 'Imprensa'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contato */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-500">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>contato.synapsecode@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>(11) 97167-4117</span>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors">
                  <HeadphonesIcon className="w-3.5 h-3.5 shrink-0" />
                  Central de Ajuda
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                <span className="text-gray-500 text-xs">Todos os sistemas operacionais</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span>© 2026 Synapse Code. Todos os direitos reservados.</span>
            <span className="bg-white/5 text-gray-500 px-2 py-0.5 rounded text-xs">v1.0.0</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-gray-400 transition-colors">LGPD</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// MÓDULOS GRID
// ============================================================
const modules = [
  { icon: Ruler, title: 'Engenharia', desc: 'GED, cronograma e orçamento executivo', items: ['Versionamento de Projetos', 'Curva S — Físico vs Financeiro', 'Orçamento com Curva ABC'] },
  { icon: ClipboardList, title: 'Execução', desc: 'Diário de obras e qualidade em campo', items: ['RDO Digital com fotos', 'Fichas de Verificação (FVS)', 'Almoxarifado e Estoque'] },
  { icon: BarChart3, title: 'Financeiro', desc: 'Controle de custos e medições', items: ['Contas a Pagar', 'Aprovação de Medições', 'Fluxo de Caixa Real'] },
  { icon: Users, title: 'Pessoas & SST', desc: 'Efetivo, EPIs e segurança do trabalho', items: ['Controle de Ponto', 'Gestão de EPIs', 'Validades NR-35, NR-10'] },
  { icon: Package, title: 'Suprimentos', desc: 'Compras e ordens de fornecimento', items: ['Mapa de Cotação', 'Aprovação de Requisição', 'Ordens de Compra'] },
  { icon: Building2, title: 'Comercial', desc: 'Portal do cliente e pós-venda', items: ['Acompanhamento de Obra', 'Chamados de Assistência', 'Manual do Usuário Digital'] },
];

// ============================================================
// STATS
// ============================================================
const stats = [
  { value: '98%', label: 'Redução de retrabalho' },
  { value: '40h', label: 'Economizadas por mês' },
  { value: '3x', label: 'Mais rápido no fechamento' },
  { value: '100%', label: 'Conformidade LGPD' },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export function LandingPage({ onLogin }: LandingPageProps) {
  const [customUsers, setCustomUsers] = useState([10]);
  const [customProjects, setCustomProjects] = useState([5]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const calculateCustomPrice = () => {
    const basePrice = 299;
    const userCost = customUsers[0] * 15;
    const projectCost = customProjects[0] * 50;
    const total = basePrice + userCost + projectCost;
    return billingCycle === 'annual' ? (total * 0.9).toFixed(0) : total.toFixed(0);
  };

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'annual') return (monthlyPrice * 0.9).toFixed(0);
    return monthlyPrice.toFixed(0);
  };

  const handleRegister = (planName: string) => {
    setSelectedPlan(planName);
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleLogin = () => {
    setIsLoginOpen(false);
    onLogin();
  };

  const LoginForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" placeholder="seu@email.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-pass">Senha</Label>
        <Input id="login-pass" type="password" />
      </div>
      <Button className="w-full bg-[#0A2E50] mt-4" onClick={handleLogin}>Acessar Painel</Button>
      <div className="text-center text-sm pt-2">
        <span className="text-gray-500">Ainda não tem conta? </span>
        <button className="text-[#0A2E50] font-semibold hover:underline" onClick={() => handleRegister('Cadastro Geral')}>
          Criar conta agora
        </button>
      </div>
    </div>
  );

  const RegistrationForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Nome Completo</Label>
        <Input id="reg-name" placeholder="Seu nome" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email Corporativo</Label>
        <Input id="reg-email" type="email" placeholder="nome@empresa.com" />
      </div>
      <div className="space-y-3">
        <Label>Tipo de Documento</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="docType" checked={documentType === 'cpf'} onChange={() => setDocumentType('cpf')} className="accent-[#0A2E50]" /> CPF
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="docType" checked={documentType === 'cnpj'} onChange={() => setDocumentType('cnpj')} className="accent-[#0A2E50]" /> CNPJ
          </label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-doc">{documentType === 'cpf' ? 'CPF' : 'CNPJ'} (Somente números)</Label>
          <Input id="reg-doc" placeholder={documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'} />
          {selectedPlan === 'Pro' && (
            <p className="text-xs text-blue-600 font-medium">
              *{documentType === 'cpf' ? 'CPF' : 'CNPJ'} necessário para liberar 7 dias grátis (Válido 1x por documento)
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-pass">Senha</Label>
        <Input id="reg-pass" type="password" />
      </div>
      <Button className="w-full bg-[#0A2E50] mt-4" onClick={() => { setIsRegisterOpen(false); onLogin(); }}>
        {selectedPlan === 'Pro' ? 'Iniciar Teste Grátis' : 'Criar Conta'}
      </Button>
      <div className="text-center text-sm pt-2">
        <span className="text-gray-500">Já tem conta? </span>
        <button className="text-[#0A2E50] font-semibold hover:underline" onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}>
          Fazer Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#04111e] text-white">

      {/* ===== MODAIS ===== */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Acessar sua Conta</DialogTitle>
            <DialogDescription>Entre com suas credenciais para continuar.</DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Vídeo de Apresentação</DialogTitle>
            <DialogDescription>Conheça o KubicEng em detalhes.</DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/93llrC1J5Lc?autoplay=1&rel=0"
              title="Apresentação KubicEng" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Conta — Plano {selectedPlan}</DialogTitle>
            <DialogDescription>Preencha seus dados para acessar a plataforma.</DialogDescription>
          </DialogHeader>
          <RegistrationForm />
        </DialogContent>
      </Dialog>

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 w-full bg-[#04111e]/90 backdrop-blur-md border-b border-white/5 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <img src={logo} alt="KubicEng Logo" className="h-6 w-auto" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">Kubic</span><span className="text-blue-400">Eng</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm text-gray-400">
            {['#funcionalidades', '#planos', '#contato'].map((href, i) => (
              <a key={i} href={href} className="hover:text-white transition-colors">
                {['Funcionalidades', 'Planos', 'Contato'][i]}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-3">
            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 text-sm" onClick={() => setIsLoginOpen(true)}>Entrar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 px-4" onClick={() => handleRegister('Pro')}>
              Começar Grátis
            </Button>
          </div>

          <button className="md:hidden text-gray-400 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#04111e] border-t border-white/5 absolute w-full left-0 top-16 p-5 flex flex-col gap-4 shadow-2xl">
            <a href="#funcionalidades" className="text-gray-400 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Funcionalidades</a>
            <a href="#planos" className="text-gray-400 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Planos</a>
            <a href="#contato" className="text-gray-400 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Contato</a>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <Button variant="ghost" className="text-gray-400 hover:text-white justify-start" onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}>Entrar</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { handleRegister('Pro'); setIsMobileMenuOpen(false); }}>Começar Grátis</Button>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        <BlueprintGrid />

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <HardHat className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Gestão de Obras Inteligente</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="text-white">A obra sob</span><br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              controle total
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Plataforma ERP para construtoras — do orçamento ao diário de obras,
            medições, suprimentos e gestão de equipe em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base font-semibold" onClick={() => handleRegister('Pro')}>
              Teste Grátis por 7 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border border-white/10 text-gray-300 bg-transparent hover:bg-white/5 hover:text-white" onClick={() => setIsVideoOpen(true)}>
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="funcionalidades" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/10">
              <Layers className="w-3 h-3 mr-1" />
              6 Módulos Integrados
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tudo que uma construtora precisa</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Do projeto à entrega das chaves, cada processo digitalizado e integrado</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod) => (
              <div key={mod.title}
                className="group bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-blue-500/20 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/15 transition-colors">
                  <mod.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{mod.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{mod.desc}</p>
                <ul className="space-y-2">
                  {mod.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIFERENCIAS ===== */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Implantação em 1 dia', desc: 'Configure sua construtora e comece a usar no mesmo dia. Sem treinamentos longos.' },
              { icon: Shield, title: 'Dados 100% seguros', desc: 'Infraestrutura em nuvem com backup automático e conformidade LGPD.' },
              { icon: TrendingUp, title: 'Relatórios em tempo real', desc: 'KPIs de obras, financeiro e equipe atualizados automaticamente.' },
            ].map((d) => (
              <div key={d.title} className="flex gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <d.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-500">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANOS ===== */}
      <section id="planos" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Planos que crescem com você</h2>
            <p className="text-gray-400 mb-8">Escolha a melhor opção para sua construtora</p>
            <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/5 w-fit mx-auto px-6 py-2 rounded-full">
              <span className={cn('text-sm font-medium transition-colors', billingCycle === 'monthly' ? 'text-white' : 'text-gray-500')}>Mensal</span>
              <Switch className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-white/10"
                checked={billingCycle === 'annual'} onCheckedChange={(c) => setBillingCycle(c ? 'annual' : 'monthly')} />
              <span className={cn('text-sm font-medium transition-colors', billingCycle === 'annual' ? 'text-white' : 'text-gray-500')}>
                Anual <span className="text-green-400 text-xs ml-1 font-bold">(10% OFF)</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {/* Start */}
            <Card className="flex flex-col bg-white/[0.03] border border-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Start</CardTitle>
                <CardDescription className="text-gray-500">Para pequenas obras</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ {getPrice(199)}</span>
                  <span className="text-gray-500 text-sm">/mês</span>
                  {billingCycle === 'annual' && <div className="text-xs text-green-400 mt-1">Total anual: R$ {(199 * 0.9 * 12).toFixed(0)}</div>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-gray-400">
                  {['1 Usuário', '1 Obra Ativa', 'Gestão Financeira Básica'].map(i => (
                    <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-blue-400" />{i}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full border-white/10 text-gray-300 hover:text-white hover:border-white/20 bg-transparent" variant="outline" onClick={() => handleRegister('Start')}>Escolher Start</Button>
              </CardFooter>
            </Card>

            {/* Pro */}
            <Card className="flex flex-col border-2 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative scale-105 z-10 bg-[#06192e]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3">Mais Popular</Badge>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-white">Pro</CardTitle>
                <CardDescription className="text-gray-400">Para construtoras em crescimento</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">R$ {getPrice(499)}</span>
                  <span className="text-gray-400 text-sm">/mês</span>
                  {billingCycle === 'annual' && <div className="text-xs text-green-400 mt-1">Total anual: R$ {(499 * 0.9 * 12).toFixed(0)}</div>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-2">
                <ul className="space-y-3 text-sm text-gray-300">
                  {['5 Usuários', '3 Obras Ativas', 'Financeiro + Suprimentos', 'App Diário de Obras'].map(i => (
                    <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-blue-400" />{i}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11" onClick={() => handleRegister('Pro')}>
                  Testar Grátis
                </Button>
              </CardFooter>
            </Card>

            {/* Business */}
            <Card className="flex flex-col bg-white/[0.03] border border-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Business</CardTitle>
                <CardDescription className="text-gray-500">Gestão completa</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ {getPrice(999)}</span>
                  <span className="text-gray-500 text-sm">/mês</span>
                  {billingCycle === 'annual' && <div className="text-xs text-green-400 mt-1">Total anual: R$ {(999 * 0.9 * 12).toFixed(0)}</div>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-gray-400">
                  {['15 Usuários', '10 Obras Ativas', 'Todos os Módulos', 'Relatórios de BI'].map(i => (
                    <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-blue-400" />{i}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full border-white/10 text-gray-300 hover:text-white hover:border-white/20 bg-transparent" variant="outline" onClick={() => handleRegister('Business')}>Escolher Business</Button>
              </CardFooter>
            </Card>

            {/* Personalizado */}
            <Card className="flex flex-col bg-white/[0.03] border border-white/5 text-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Personalizado</CardTitle>
                </div>
                <CardDescription className="text-gray-500">Monte seu plano ideal</CardDescription>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">A partir de</span>
                  <div className="text-3xl font-bold text-white">R$ {calculateCustomPrice()}</div>
                  {billingCycle === 'annual' && <div className="text-xs text-green-400 mt-1">Total anual: R$ {(parseInt(calculateCustomPrice()) * 12).toFixed(0)}</div>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-sm">Usuários: {customUsers}</Label>
                  <Slider value={customUsers} onValueChange={setCustomUsers} min={1} max={100} step={1} className="py-1" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-sm">Obras Simultâneas: {customProjects}</Label>
                  <Slider value={customProjects} onValueChange={setCustomProjects} min={1} max={50} step={1} className="py-1" />
                </div>
                <div className="text-xs text-gray-600">*Inclui todos os módulos e suporte 24/7.</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full border-white/10 text-gray-300 hover:text-white hover:border-white/20 bg-transparent" variant="outline" onClick={() => handleRegister('Personalizado')}>Contatar Vendas</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== CONTATO ===== */}
      <section id="contato" className="py-24 px-6 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Fale com nosso time</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                Estamos prontos para entender seu cenário e propor a melhor solução para sua construtora.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FaWhatsapp className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-gray-300">(11) 94248-8814</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">contato.synapsecode@gmail.com</span>
                </div>
              </div>
            </div>

            <Card className="bg-white/[0.03] border border-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Envie uma mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400" htmlFor="nome">Nome</Label>
                  <Input id="nome" placeholder="Seu nome" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400" htmlFor="email">Email Corporativo</Label>
                  <Input id="email" type="email" placeholder="nome@empresa.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400" htmlFor="tel">Telefone</Label>
                  <Input id="tel" placeholder="(11) 99999-9999" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsLoginOpen(true)}>Enviar Contato</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== RODAPÉ SYNAPSE CODE ===== */}
      <Footer />
    </div>
  );
}
