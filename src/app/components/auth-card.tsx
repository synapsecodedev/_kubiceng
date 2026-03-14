import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/app/components/ui/utils';

interface AuthCardProps {
  onLogin: (data: any) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
  isLoading: boolean;
  defaultPlan?: string;
}

export function AuthCard({ onLogin, onRegister, isLoading, defaultPlan = 'Pro' }: AuthCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regDoc, setRegDoc] = useState('');
  const [docType, setDocType] = useState<'cpf' | 'cnpj'>('cpf');

  const handleToggle = () => setIsFlipped(!isFlipped);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email: loginEmail, password: loginPass });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({
      name: regName,
      email: regEmail,
      password: regPass,
      document: regDoc,
      documentType: docType,
      planSlug: defaultPlan.toLowerCase()
    });
  };

  return (
    <div className="w-full max-w-[850px] h-[550px] perspective-1000">
      <motion.div
        className="relative w-full h-full duration-700 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* --- FRONT: LOGIN --- */}
        <div className="absolute inset-0 w-full h-full backface-hidden flex bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
          {/* Form Section */}
          <div className="flex-[1.2] p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0A2E50] mb-2">Bem-vindo de volta!</h2>
              <p className="text-gray-500">Acesse sua conta para gerenciar suas obras.</p>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="ex@empresa.com" 
                    className="pl-10 h-12 bg-gray-50 border-gray-200"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="login-pass">Senha</Label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">Esqueceu a senha?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="login-pass" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 bg-gray-50 border-gray-200"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#0A2E50] hover:bg-[#0A2E50]/90 text-white font-bold rounded-xl mt-4 shadow-lg shadow-blue-900/10"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "ENTRAR NO PAINEL"}
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="flex-[0.8] bg-gradient-to-br from-[#f27121] via-[#e94057] to-[#8a2387] p-12 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Novo aqui?</h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Crie sua conta agora e comece a digitalizar seus canteiros de obra.
              </p>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#e94057] rounded-full px-10 h-12 font-bold transition-all duration-300"
                onClick={handleToggle}
              >
                CRIAR CONTA
              </Button>
            </div>
          </div>
        </div>

        {/* --- BACK: REGISTER --- */}
        <div className="absolute inset-0 w-full h-full backface-hidden flex bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 rotate-y-180">
          {/* Info Section (Left on back) */}
          <div className="flex-[0.8] bg-gradient-to-br from-[#8a2387] via-[#e94057] to-[#f27121] p-12 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Seja bem-vindo!</h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Para manter-se conectado, faça login com suas informações pessoais.
              </p>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#e94057] rounded-full px-10 h-12 font-bold transition-all duration-300"
                onClick={handleToggle}
              >
                Acessar Painel
              </Button>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-[1.2] p-10 flex flex-col justify-center overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0A2E50] mb-1">Criar Nova Conta</h2>
              <p className="text-xs text-gray-500">Comece seu teste grátis no plano <strong>{defaultPlan}</strong>.</p>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="reg-name" className="text-xs">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input 
                      id="reg-name" 
                      placeholder="Nome" 
                      className="pl-9 h-10 text-sm bg-gray-50"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-email" className="text-xs">Email Corp.</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="nome@empresa.com" 
                      className="pl-9 h-10 text-sm bg-gray-50"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-xs">Documento</Label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setDocType('cpf')} className={cn("text-[10px] uppercase font-bold", docType === 'cpf' ? "text-blue-600" : "text-gray-400")}>CPF</button>
                    <button type="button" onClick={() => setDocType('cnpj')} className={cn("text-[10px] uppercase font-bold", docType === 'cnpj' ? "text-blue-600" : "text-gray-400")}>CNPJ</button>
                  </div>
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input 
                    id="reg-doc" 
                    placeholder={docType === 'cpf' ? "000.000.000-00" : "00.000.000/0000-00"} 
                    className="pl-9 h-10 text-sm bg-gray-50"
                    value={regDoc}
                    onChange={(e) => setRegDoc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-pass" className="text-xs">Escolha uma Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input 
                    id="reg-pass" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9 h-10 text-sm bg-gray-50"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-gray-400 leading-tight mb-3">
                  Ao se cadastrar, você concorda com nossos termos de uso e política de privacidade.
                </p>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-[#e94057] to-[#f27121] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando..." : "CADASTRAR E COMEÇAR"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
