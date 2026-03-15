import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { User, Building, Lock, Save, Camera } from 'lucide-react';
import { usePlan } from './plan-context';

export function SettingsModule() {
  const { user } = usePlan();
  const [loading, setLoading] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: ''
  });

  // Company data
  const [company, setCompany] = useState({
    name: 'Kubic Engenharia LTDA',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    logo: ''
  });

  // Password data
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement API call
    setTimeout(() => setLoading(false), 1000);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement API call
    setTimeout(() => setLoading(false), 1000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('As senhas não coincidem');
      return;
    }
    setLoading(true);
    // TODO: Implement API call
    setTimeout(() => {
      setLoading(false);
      setPasswords({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="text-gray-600">Gerencie seu perfil, dados da construtora e segurança</p>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="perfil">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="construtora">
            <Building className="w-4 h-4 mr-2" />
            Construtora
          </TabsTrigger>
          <TabsTrigger value="seguranca">
            <Lock className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Perfil Tab */}
        <TabsContent value="perfil" className="mt-6">
          <Card className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-white border rounded-full shadow-sm hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium">Foto do Perfil</h4>
                  <p className="text-sm text-gray-500">JPG ou PNG, máximo 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500"
                    value={profile.email}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Construtora Tab */}
        <TabsContent value="construtora" className="mt-6">
          <Card className="p-6">
            <form onSubmit={handleSaveCompany} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white border rounded-lg flex items-center justify-center p-4">
                  <Building className="w-12 h-12 text-[#0A2E50]" />
                </div>
                <div>
                  <h4 className="font-medium">Logo da Construtora</h4>
                  <p className="text-sm text-gray-500">Aparecerá nos relatórios e RDOs</p>
                  <Button variant="outline" size="sm" className="mt-2" type="button">
                    Trocar Logo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Razão Social</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNPJ</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={company.cnpj}
                    onChange={(e) => setCompany({ ...company, cnpj: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Endereço Sede</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Dados'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Segurança Tab */}
        <TabsContent value="seguranca" className="mt-6">
          <Card className="p-6">
            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha Atual</label>
                  <input
                    type="password"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nova Senha</label>
                  <input
                    type="password"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-[#0A2E50]" disabled={loading}>
                  <Lock className="w-4 h-4 mr-2" />
                  {loading ? 'Atualizando...' : 'Mudar Senha'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
