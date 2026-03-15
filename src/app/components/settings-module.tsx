import { useState, useEffect, useRef } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { User, Building, Lock, Save, Camera, Upload } from 'lucide-react';
import { usePlan } from './plan-context';
import { api } from '@/services/api';
import { toast } from 'sonner';

export function SettingsModule() {
  const { user, login } = usePlan();
  const [loading, setLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Profile data
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || ''
  });

  // Company data
  const [company, setCompany] = useState({
    name: user?.companyName || 'Kubic Engenharia LTDA',
    cnpj: user?.companyCnpj || '12.345.678/0001-90',
    address: user?.companyAddress || 'Av. Paulista, 1000 - São Paulo, SP',
    logoUrl: user?.companyLogoUrl || ''
  });

  // Password data
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/${user?.id}`);
      const data = response.data;
      setProfile({
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl || ''
      });
      setCompany({
        name: data.companyName || '',
        cnpj: data.companyCnpj || '',
        address: data.companyAddress || '',
        logoUrl: data.companyLogoUrl || ''
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post(`/profile/upload?type=${type}&userId=${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const publicUrl = response.data.publicUrl;
      if (type === 'avatar') {
        setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
      } else {
        setCompany(prev => ({ ...prev, logoUrl: publicUrl }));
      }
      toast.success('Imagem enviada com sucesso!');
      fetchProfile(); // Refresh context/state
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
      await api.put(`/profile/${user.id}`, {
        name: profile.name,
        avatarUrl: profile.avatarUrl
      });
      toast.success('Perfil atualizado!');
      fetchProfile();
    } catch (error) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
      await api.put(`/profile/${user.id}/company`, {
        companyName: company.name,
        companyCnpj: company.cnpj,
        companyAddress: company.address,
        companyLogoUrl: company.logoUrl
      });
      toast.success('Dados da construtora salvos!');
      fetchProfile();
    } catch (error) {
      toast.error('Erro ao salvar dados da construtora');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    setLoading(true);
    // TODO: Implement password update in backend
    setTimeout(() => {
      setLoading(false);
      setPasswords({ current: '', new: '', confirm: '' });
      toast.success('Senha atualizada!');
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
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={avatarInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                  />
                  <button 
                    type="button" 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-white border rounded-full shadow-sm hover:bg-gray-50"
                  >
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
                <div className="w-32 h-32 bg-white border rounded-lg flex items-center justify-center p-2 overflow-hidden">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Building className="w-12 h-12 text-[#0A2E50]" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Logo da Construtora</h4>
                  <p className="text-sm text-gray-500 mb-2">Aparecerá nos relatórios e RDOs</p>
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
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
