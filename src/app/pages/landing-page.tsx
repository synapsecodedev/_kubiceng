import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Check, ArrowRight, Building2, BarChart3, Users, Calculator, Phone, Mail, X } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Switch } from '@/app/components/ui/switch';
import { cn } from '@/app/components/ui/utils';
import logo from '../../assets/8f30dd8152d74b306dc9f5214b67e2bfbf83636d.png';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [customUsers, setCustomUsers] = useState([10]);
  const [customProjects, setCustomProjects] = useState([5]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const calculateCustomPrice = () => {
    const basePrice = 299;
    const userCost = customUsers[0] * 15;
    const projectCost = customProjects[0] * 50;
    const total = basePrice + userCost + projectCost;
    return billingCycle === 'annual' ? (total * 0.9).toFixed(0) : total.toFixed(0);
  };

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'annual') {
      return (monthlyPrice * 0.9).toFixed(0);
    }
    return monthlyPrice.toFixed(0);
  };

  const handleRegister = (planName: string) => {
    setSelectedPlan(planName);
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleLogin = () => {
    // Aqui entra a validação futura com o backend
    // Por enquanto, aceita qualquer input que não esteja vazio (simulação)
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
      <Button className="w-full bg-[#0A2E50] mt-4" onClick={handleLogin}>
        Acessar Painel
      </Button>
      <div className="text-center text-sm pt-2">
        <span className="text-gray-500">Ainda não tem conta? </span>
        <button 
          className="text-[#0A2E50] font-semibold hover:underline"
          onClick={() => handleRegister('Cadastro Geral')}
        >
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
            <input 
              type="radio" 
              name="docType" 
              checked={documentType === 'cpf'} 
              onChange={() => setDocumentType('cpf')}
              className="accent-[#0A2E50]" 
            /> 
            CPF
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="docType" 
              checked={documentType === 'cnpj'} 
              onChange={() => setDocumentType('cnpj')}
              className="accent-[#0A2E50]" 
            /> 
            CNPJ
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-doc">{documentType === 'cpf' ? 'CPF' : 'CNPJ'} (Somente números)</Label>
          <Input 
            id="reg-doc" 
            placeholder={documentType === 'cpf' ? "000.000.000-00" : "00.000.000/0000-00"} 
          />
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
        <button 
          className="text-[#0A2E50] font-semibold hover:underline"
          onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
        >
          Fazer Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Acesse sua Conta</DialogTitle>
            <DialogDescription>
              Entre com suas credenciais para continuar.
            </DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Conta - Plano {selectedPlan}</DialogTitle>
            <DialogDescription>
              Preencha seus dados para acessar a plataforma.
            </DialogDescription>
          </DialogHeader>
          <RegistrationForm />
        </DialogContent>
      </Dialog>

      {/* Header/Nav */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="KubicEng Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-[#0A2E50]">KubicEng</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#funcionalidades" className="hover:text-[#0A2E50]">Funcionalidades</a>
            <a href="#planos" className="hover:text-[#0A2E50]">Planos</a>
            <a href="#contato" className="hover:text-[#0A2E50]">Contato</a>
          </nav>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setIsLoginOpen(true)}>Entrar</Button>
            <Button className="bg-[#0A2E50]" onClick={() => handleRegister('Cadastro Geral')}>
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">Gestão de Obras Inteligente</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0A2E50] mb-6 leading-tight">
            Transforme a Gestão da sua Construtora
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Uma plataforma completa para engenharia, financeiro, suprimentos e execução. 
            Controle total do orçamento ao canteiro de obras.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-[#0A2E50] h-12 px-8 text-lg" onClick={() => handleRegister('Pro')}>
              Teste Grátis por 7 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              Ver Vídeo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0A2E50] mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-gray-600">Módulos integrados para máxima eficiência</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <Building2 className="h-10 w-10 text-[#0A2E50] mb-2" />
                <CardTitle>Engenharia</CardTitle>
                <CardDescription>Gestão de projetos e documentação técnica</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Versionamento de Projetos</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Diário de Obras Digital</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Especificações Técnicas</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-[#0A2E50] mb-2" />
                <CardTitle>Financeiro</CardTitle>
                <CardDescription>Controle total de custos e orçamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Curva ABC</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Fluxo de Caixa Real</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Integração Bancária</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <Users className="h-10 w-10 text-[#0A2E50] mb-2" />
                <CardTitle>Gestão de Equipes</CardTitle>
                <CardDescription>Controle de efetivo e produtividade</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Controle de Ponto</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Gestão de Terceiros</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Avaliação de Desempenho</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2E50] mb-4">Planos que crescem com você</h2>
            <p className="text-gray-600 mb-8">Escolha a melhor opção para sua construtora</p>
            
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-medium", billingCycle === 'monthly' ? "text-[#0A2E50]" : "text-gray-500")}>
                Mensal
              </span>
              <Switch 
                checked={billingCycle === 'annual'} 
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')} 
              />
              <span className={cn("text-sm font-medium", billingCycle === 'annual' ? "text-[#0A2E50]" : "text-gray-500")}>
                Anual <span className="text-green-600 text-xs ml-1 font-bold">(10% OFF no PIX)</span>
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Plan 1 */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Start</CardTitle>
                <CardDescription>Para pequenas obras</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ {getPrice(199)}</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> 1 Usuário</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> 1 Obra Ativa</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Gestão Financeira Básica</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handleRegister('Start')}>Escolher Start</Button>
              </CardFooter>
            </Card>

            {/* Plan 2 */}
            <Card className="flex flex-col border-[#0A2E50] border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                <Badge className="bg-[#0A2E50] mb-1">Mais Popular</Badge>
                <Badge className="bg-green-600 text-xs">7 Dias Grátis</Badge>
              </div>
              <CardHeader>
                <CardTitle className="mt-4">Pro</CardTitle>
                <CardDescription>Para construtoras em crescimento</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ {getPrice(499)}</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> 5 Usuários</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> 3 Obras Ativas</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Financeiro + Suprimentos</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> App Diário de Obras</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#0A2E50]" onClick={() => handleRegister('Pro')}>Testar Grátis</Button>
              </CardFooter>
            </Card>

            {/* Plan 3 */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <CardDescription>Gestão completa</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$ {getPrice(999)}</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> 15 Usuários</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> 10 Obras Ativas</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Todos os Módulos</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Relatórios de BI</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handleRegister('Business')}>Escolher Business</Button>
              </CardFooter>
            </Card>

            {/* Plan 4 - Custom */}
            <Card className="flex flex-col bg-gray-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#0A2E50]" />
                  <CardTitle>Personalizado</CardTitle>
                </div>
                <CardDescription>Monte seu plano ideal</CardDescription>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">A partir de</span>
                  <div className="text-3xl font-bold text-[#0A2E50]">R$ {calculateCustomPrice()}</div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="space-y-2">
                  <Label>Número de Usuários: {customUsers}</Label>
                  <Slider 
                    value={customUsers} 
                    onValueChange={setCustomUsers} 
                    min={1} 
                    max={100} 
                    step={1} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Obras Simultâneas: {customProjects}</Label>
                  <Slider 
                    value={customProjects} 
                    onValueChange={setCustomProjects} 
                    min={1} 
                    max={50} 
                    step={1} 
                  />
                </div>
                <div className="text-xs text-gray-500">
                  *Inclui todos os módulos e suporte prioritário 24/7.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full border-[#0A2E50] text-[#0A2E50]" variant="outline" onClick={() => handleRegister('Personalizado')}>
                  Contatar Vendas
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-[#0A2E50] text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Fale com nosso time de vendas</h2>
              <p className="text-blue-100 mb-8 max-w-md">
                Estamos prontos para entender seu cenário e propor a melhor solução para sua construtora.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-300" />
                  <span>+55 (11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-300" />
                  <span>vendas@kubiceng.com.br</span>
                </div>
              </div>
            </div>
            
            <Card className="text-gray-900">
              <CardHeader>
                <CardTitle>Envie uma mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Corporativo</Label>
                  <Input id="email" type="email" placeholder="nome@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 99999-9999" />
                </div>
                <Button className="w-full bg-[#0A2E50]" onClick={() => setIsLoginOpen(true)}>Enviar Contato</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>&copy; 2026 KubicEng. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
