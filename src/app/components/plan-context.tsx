import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'user' | 'admin' | 'superadmin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string;
  companyCnpj?: string;
  companyAddress?: string;
  companyLogoUrl?: string;
}

interface Subscription {
  status: string;
  plan: string;
  slug: string;
  features: Record<string, boolean>;
}

interface PlanContextType {
  user: User | null;
  subscription: Subscription | null;
  login: (userData: User, subData: Subscription) => void;
  logout: () => void;
  canAccessModule: (module: string) => boolean;
  isSuperAdmin: () => boolean;
  isLoading: boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tenta recuperar do localStorage ao carregar
    const savedUser = localStorage.getItem('kubic_user');
    const savedSub = localStorage.getItem('kubic_subscription');

    if (savedUser && savedSub && savedUser !== 'undefined' && savedSub !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
        setSubscription(JSON.parse(savedSub));
      } catch (err) {
        console.error('Falha ao carregar sessão salva:', err);
        localStorage.removeItem('kubic_user');
        localStorage.removeItem('kubic_subscription');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, subData: Subscription) => {
    setUser(userData);
    setSubscription(subData);
    localStorage.setItem('kubic_user', JSON.stringify(userData));
    localStorage.setItem('kubic_subscription', JSON.stringify(subData));
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('kubic_user');
    localStorage.removeItem('kubic_subscription');
  };

  const canAccessModule = (module: string) => {
    if (user?.role === 'superadmin') return true;
    return subscription?.features[module] ?? false;
  };

  const isSuperAdmin = () => user?.role === 'superadmin';

  return (
    <PlanContext.Provider value={{
      user,
      subscription,
      login,
      logout,
      canAccessModule,
      isSuperAdmin,
      isLoading
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
