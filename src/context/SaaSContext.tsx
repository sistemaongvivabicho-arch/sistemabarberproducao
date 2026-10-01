import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BarbeariaTenant,
  PlatformView,
  BarberTab,
  SuperAdminTab,
  AppointmentItem,
  ClientItem,
  FinanceEntry,
  AuditLogItem,
  ServiceItem,
  CutImage,
  ProfessionalItem,
} from '../types';
import { cutsImages, servicesList, barbeariaConfig } from '../data/barbeariaData';

// Seeded sample tenants for multi-tenant SaaS architecture
const initialTenants: BarbeariaTenant[] = [
  {
    ...barbeariaConfig,
    id: 'lupumba',
    slug: 'lupumba',
    tagline: 'Estilo & Precisão em Cordeiros',
    description: 'Central Digital Oficial. Cortes de cabelo e barba com alto padrão de acabamento, pontualidade e estilo.',
    ownerEmail: 'lupumba@barbearia.com',
    ownerName: 'Luan & Pumba Barbeiros',
    miniCentralAtiva: true,
    agendaAtiva: true,
    plan: 'Plano Pro',
    planPrice: 149.9,
    planStatus: 'ativo',
    memberSince: '15/01/2026',
    nextBillingDate: '15/10/2026',
    cuts: [...cutsImages],
    services: [...servicesList],
    professionals: [
      {
        id: 'prof-1',
        name: 'Luan Barbeiro',
        role: 'Master Barber / Sócio',
        phone: '(47) 99623-9122',
        commissionPercent: 60,
        isActive: true,
      },
      {
        id: 'prof-2',
        name: 'Pumba Pimentel',
        role: 'Barbeiro Especialista',
        phone: '(47) 99623-9122',
        commissionPercent: 55,
        isActive: true,
      },
    ],
  },
  {
    id: 'navalha-ouro',
    slug: 'navalha-ouro',
    name: 'NAVALHA DE OURO BARBERSHOP',
    barbeiro: 'Carlos Navalha',
    responsavel: 'Carlos Alberto',
    tagline: 'Tradição e Estilo Clássico',
    description: 'Ambiente climatizado, cerveja gelada e o melhor fade da região central.',
    phone: '(47) 98877-6655',
    phoneRaw: '47988776655',
    whatsappFormatted: '(47) 98877-6655',
    whatsappNumber: '5547988776655',
    instagram: 'navalhadouro_oficial',
    instagramUrl: 'https://instagram.com',
    googleMapsUrl: 'https://maps.google.com',
    address: 'Av. Brasil, 1200',
    neighborhood: 'Centro',
    city: 'Balneário Camboriú - SC',
    hours: 'Segunda a sábado, das 09h às 21h',
    ownerEmail: 'carlos@navalhaouro.com',
    ownerName: 'Carlos Alberto',
    miniCentralAtiva: true,
    agendaAtiva: true,
    plan: 'Plano Enterprise',
    planPrice: 249.9,
    planStatus: 'ativo',
    memberSince: '10/02/2026',
    nextBillingDate: '10/10/2026',
    cuts: [...cutsImages.slice(0, 6)],
    services: [...servicesList.slice(0, 5)],
    professionals: [
      {
        id: 'prof-nav-1',
        name: 'Carlos Navalha',
        role: 'Proprietário',
        phone: '(47) 98877-6655',
        commissionPercent: 70,
        isActive: true,
      },
    ],
  },
  {
    id: 'don-corleone',
    slug: 'don-corleone',
    name: 'DON CORLEONE BARBER CLUB',
    barbeiro: 'Vito & Enzo',
    responsavel: 'Vito Corleone',
    tagline: 'Experiência Mafiosa e Barboterapia',
    description: 'Cortes executivos, toalha quente e acabamento na navalha.',
    phone: '(47) 97766-5544',
    phoneRaw: '47977665544',
    whatsappFormatted: '(47) 97766-5544',
    whatsappNumber: '5547977665544',
    instagram: 'doncorleone_barber',
    instagramUrl: 'https://instagram.com',
    googleMapsUrl: 'https://maps.google.com',
    address: 'Rua Uruguai, 450',
    neighborhood: 'Fazenda',
    city: 'Itajaí - SC',
    hours: 'Segunda a sexta, das 10h às 20h',
    ownerEmail: 'vito@doncorleone.com',
    ownerName: 'Vito Corleone',
    // Example of independent rule: Mini Central paused for maintenance, internal agenda active
    miniCentralAtiva: false,
    agendaAtiva: true,
    plan: 'Plano Start',
    planPrice: 89.9,
    planStatus: 'ativo',
    memberSince: '05/03/2026',
    nextBillingDate: '05/10/2026',
    cuts: [...cutsImages.slice(0, 5)],
    services: [...servicesList.slice(0, 4)],
    professionals: [
      {
        id: 'prof-don-1',
        name: 'Vito Corleone',
        role: 'Master Barber',
        phone: '(47) 97766-5544',
        commissionPercent: 60,
        isActive: true,
      },
    ],
  },
  {
    id: 'kings-cut',
    slug: 'kings-cut',
    name: "KING'S CUT BARBEARIA",
    barbeiro: 'Felipe Reis',
    responsavel: 'Felipe Reis',
    tagline: 'Onde o homem moderno cuida do visual',
    description: 'Atendimento rápido e descomplicado.',
    phone: '(47) 96655-4433',
    phoneRaw: '47966554433',
    whatsappFormatted: '(47) 96655-4433',
    whatsappNumber: '5547966554433',
    instagram: 'kingscut_itj',
    instagramUrl: 'https://instagram.com',
    googleMapsUrl: 'https://maps.google.com',
    address: 'Rua Reinaldo Amâncio Cabral, 88',
    neighborhood: 'São Vicente',
    city: 'Itajaí - SC',
    hours: 'Terça a sábado, das 09h às 19h',
    ownerEmail: 'felipe@kingscut.com',
    ownerName: 'Felipe Reis',
    // Example of both false (suspended by Super Admin due to overdue subscription)
    miniCentralAtiva: false,
    agendaAtiva: false,
    plan: 'Plano Pro',
    planPrice: 149.9,
    planStatus: 'bloqueado',
    memberSince: '12/12/2025',
    nextBillingDate: '12/09/2026',
    cuts: [...cutsImages.slice(0, 4)],
    services: [...servicesList.slice(0, 3)],
    professionals: [
      {
        id: 'prof-king-1',
        name: 'Felipe Reis',
        role: 'Barbeiro',
        phone: '(47) 96655-4433',
        commissionPercent: 50,
        isActive: true,
      },
    ],
  },
];

const initialAppointments: AppointmentItem[] = [
  {
    id: 'apt-1',
    tenantId: 'lupumba',
    clientName: 'Mateus Oliveira',
    clientPhone: '(47) 99123-4567',
    services: ['degrade', 'barba'],
    serviceNames: 'Degradê + Barba',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '09:00',
    totalPrice: 65,
    status: 'concluido',
    createdAt: '2026-10-01 08:30',
  },
  {
    id: 'apt-2',
    tenantId: 'lupumba',
    clientName: 'Gabriel Santos',
    clientPhone: '(47) 99876-5432',
    services: ['corte-navalhado'],
    serviceNames: 'Corte Navalhado',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '10:00',
    totalPrice: 50,
    status: 'concluido',
    createdAt: '2026-10-01 09:15',
  },
  {
    id: 'apt-3',
    tenantId: 'lupumba',
    clientName: 'Lucas Ferreira',
    clientPhone: '(47) 99234-5678',
    services: ['degrade'],
    serviceNames: 'Degradê',
    professionalId: 'prof-2',
    professionalName: 'Pumba Pimentel',
    dayLabel: 'Hoje',
    timeSlot: '13:30',
    totalPrice: 50,
    status: 'confirmado',
    createdAt: '2026-10-01 10:20',
  },
  {
    id: 'apt-4',
    tenantId: 'lupumba',
    clientName: 'Rafael Andrade',
    clientPhone: '(47) 99765-4321',
    services: ['combo-completo'],
    serviceNames: 'Combo Lupumba Vip',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '15:30',
    totalPrice: 90,
    status: 'confirmado',
    createdAt: '2026-10-01 11:00',
  },
  {
    id: 'apt-5',
    tenantId: 'lupumba',
    clientName: 'Thiago Costa',
    clientPhone: '(47) 99345-6789',
    services: ['corte-normal'],
    serviceNames: 'Corte Normal',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '17:30',
    totalPrice: 40,
    status: 'pendente',
    createdAt: '2026-10-01 11:30',
  },
  {
    id: 'apt-6',
    tenantId: 'lupumba',
    clientName: 'Bruno Henrique',
    clientPhone: '(47) 99456-7890',
    services: ['degrade', 'sobrancelha'],
    serviceNames: 'Degradê + Sobrancelha',
    professionalId: 'prof-2',
    professionalName: 'Pumba Pimentel',
    dayLabel: 'Amanhã',
    timeSlot: '10:00',
    totalPrice: 60,
    status: 'confirmado',
    createdAt: '2026-10-01 11:45',
  },
];

const initialClients: ClientItem[] = [
  {
    id: 'cli-0',
    tenantId: 'lupumba',
    name: 'ruan gabriel',
    phone: '478847747488',
    totalVisits: 0,
    totalSpent: 0,
    lastVisit: 'Recente',
    favoriteService: 'Degradê Navalhado',
    instagram: '@ruahncat',
    status: 'ativo',
    fidelityPoints: 0,
  },
  {
    id: 'cli-1',
    tenantId: 'lupumba',
    name: 'Mateus Oliveira',
    phone: '(47) 99123-4567',
    totalVisits: 14,
    totalSpent: 890,
    lastVisit: 'Hoje',
    favoriteService: 'Degradê + Barba',
    instagram: '@mateus.oli',
    status: 'ativo',
    fidelityPoints: 0,
  },
  {
    id: 'cli-2',
    tenantId: 'lupumba',
    name: 'Gabriel Santos',
    phone: '(47) 99876-5432',
    totalVisits: 8,
    totalSpent: 420,
    lastVisit: 'Hoje',
    favoriteService: 'Corte Navalhado',
    instagram: '@gabrielsantos.cut',
    status: 'ativo',
    fidelityPoints: 8,
  },
  {
    id: 'cli-3',
    tenantId: 'lupumba',
    name: 'Lucas Ferreira',
    phone: '(47) 99234-5678',
    totalVisits: 6,
    totalSpent: 300,
    lastVisit: 'Há 15 dias',
    favoriteService: 'Degradê',
    instagram: '@lucas_ferr',
    status: 'ativo',
    fidelityPoints: 7,
  },
  {
    id: 'cli-4',
    tenantId: 'lupumba',
    name: 'Rafael Andrade',
    phone: '(47) 99765-4321',
    totalVisits: 19,
    totalSpent: 1650,
    lastVisit: 'Há 7 dias',
    favoriteService: 'Combo Lupumba Vip',
    instagram: '@rafael_andrade',
    status: 'ativo',
    fidelityPoints: 9,
  },
  {
    id: 'cli-5',
    tenantId: 'lupumba',
    name: 'Carlos Eduardo Silva',
    phone: '(47) 99911-2233',
    totalVisits: 3,
    totalSpent: 135,
    lastVisit: 'Há 28 dias',
    favoriteService: 'Corte Normal',
    instagram: '@carlosedu_silva',
    status: 'ativo',
    fidelityPoints: 3,
  },
];

const initialFinance: FinanceEntry[] = [
  {
    id: 'fin-1',
    tenantId: 'lupumba',
    description: 'Corte + Barba (Mateus Oliveira)',
    type: 'receita',
    amount: 65,
    category: 'Serviço',
    date: '01/10/2026',
    method: 'Pix',
  },
  {
    id: 'fin-2',
    tenantId: 'lupumba',
    description: 'Corte Navalhado (Gabriel Santos)',
    type: 'receita',
    amount: 50,
    category: 'Serviço',
    date: '01/10/2026',
    method: 'Cartão',
  },
  {
    id: 'fin-3',
    tenantId: 'lupumba',
    description: 'Pomadas modeladoras e lâminas',
    type: 'despesa',
    amount: 180,
    category: 'Estoque / Produtos',
    date: '30/09/2026',
    method: 'Pix',
  },
  {
    id: 'fin-4',
    tenantId: 'lupumba',
    description: 'Internet Fibra Óptica',
    type: 'despesa',
    amount: 120,
    category: 'Custos Fixos',
    date: '28/09/2026',
    method: 'Pix',
  },
];

const initialAudit: AuditLogItem[] = [
  {
    id: 'log-1',
    tenantId: 'lupumba',
    tenantName: 'LUPUMBA BARBEARIA',
    action: 'Criação da Mini Central',
    details: 'Mini Central pública ativada e pronta para compartilhamento.',
    performedBy: 'Sistema SaaS',
    timestamp: '01/10/2026 09:00',
  },
  {
    id: 'log-2',
    tenantId: 'don-corleone',
    tenantName: 'DON CORLEONE BARBER CLUB',
    action: 'Pausa da Mini Central',
    details: 'Mini central desativada temporariamente para reforma visual.',
    performedBy: 'Super Admin',
    timestamp: '01/10/2026 10:15',
  },
  {
    id: 'log-3',
    tenantId: 'kings-cut',
    tenantName: "KING'S CUT BARBEARIA",
    action: 'Bloqueio de Agenda e Mini Central',
    details: 'Suspensão aplicada por atraso de assinatura SaaS.',
    performedBy: 'Super Admin',
    timestamp: '01/10/2026 11:00',
  },
];

interface SaaSContextType {
  // Navigation & Views
  currentView: PlatformView;
  setCurrentView: (view: PlatformView) => void;
  barberActiveTab: BarberTab;
  setBarberActiveTab: (tab: BarberTab) => void;
  superAdminActiveTab: SuperAdminTab;
  setSuperAdminActiveTab: (tab: SuperAdminTab) => void;

  // Multi-tenancy
  tenants: BarbeariaTenant[];
  currentTenantId: string;
  currentTenant: BarbeariaTenant;
  switchTenant: (tenantId: string) => void;
  updateCurrentTenant: (updates: Partial<BarbeariaTenant>) => void;

  // Super Admin Controls
  toggleMiniCentral: (tenantId: string) => void;
  toggleAgenda: (tenantId: string) => void;
  setTenantControls: (tenantId: string, miniCentralAtiva: boolean, agendaAtiva: boolean) => void;

  // Auth States
  isBarberLoggedIn: boolean;
  barberEmail: string;
  loginBarber: (email: string, pass: string) => { success: boolean; error?: string };
  logoutBarber: () => void;

  isSuperAdminLoggedIn: boolean;
  loginSuperAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  logoutSuperAdmin: () => void;

  // Business Data
  appointments: AppointmentItem[];
  addAppointment: (apt: Omit<AppointmentItem, 'id' | 'createdAt'>) => AppointmentItem;
  updateAppointmentStatus: (id: string, status: AppointmentItem['status']) => void;

  clients: ClientItem[];
  addClient: (cli: Omit<ClientItem, 'id'>) => void;

  financeEntries: FinanceEntry[];
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id'>) => void;

  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string, tenantId?: string, tenantName?: string) => void;

  // Toast / feedback message
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

export function SaaSProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<BarbeariaTenant[]>(() => {
    const saved = localStorage.getItem('saas_tenants_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialTenants;
      }
    }
    return initialTenants;
  });

  const [currentTenantId, setCurrentTenantId] = useState<string>('lupumba');
  const [currentView, setCurrentView] = useState<PlatformView>('mini-central');
  const [barberActiveTab, setBarberActiveTab] = useState<BarberTab>('dashboard');
  const [superAdminActiveTab, setSuperAdminActiveTab] = useState<SuperAdminTab>('visao-geral');

  const [isBarberLoggedIn, setIsBarberLoggedIn] = useState<boolean>(false);
  const [barberEmail, setBarberEmail] = useState<string>('barbeiro@lupumba.com');
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    const saved = localStorage.getItem('saas_appointments_v1');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [clients, setClients] = useState<ClientItem[]>(() => {
    const saved = localStorage.getItem('saas_clients_v1');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(() => {
    const saved = localStorage.getItem('saas_finance_v1');
    return saved ? JSON.parse(saved) : initialFinance;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('saas_audit_v1');
    return saved ? JSON.parse(saved) : initialAudit;
  });

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('saas_tenants_v1', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('saas_appointments_v1', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('saas_clients_v1', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('saas_finance_v1', JSON.stringify(financeEntries));
  }, [financeEntries]);

  useEffect(() => {
    localStorage.setItem('saas_audit_v1', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const currentTenant =
    tenants.find((t) => t.id === currentTenantId) || tenants[0] || initialTenants[0];

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    showNotification(`Barbearia alternada para: ${tenants.find((t) => t.id === tenantId)?.name || tenantId}`, 'info');
  };

  const addAuditLog = (
    action: string,
    details: string,
    tId: string = currentTenant.id,
    tName: string = currentTenant.name
  ) => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      tenantId: tId,
      tenantName: tName,
      action,
      details,
      performedBy: isSuperAdminLoggedIn ? 'Super Admin' : 'Barbeiro / Proprietário',
      timestamp: formatted,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // SUPER ADMIN INDEPENDENT CONTROLS
  const toggleMiniCentral = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextState = !t.miniCentralAtiva;
          addAuditLog(
            nextState ? 'Ativação de Mini Central' : 'Desativação de Mini Central',
            nextState
              ? 'Mini Central pública reativada para aceitar agendamentos.'
              : 'Mini Central pública pausada. Agendamentos suspensos.',
            t.id,
            t.name
          );
          showNotification(
            `${t.name}: Mini Central agora está ${nextState ? 'ONLINE e aceitando agendamentos' : 'PAUSADA (agendamentos suspensos)'}`,
            nextState ? 'success' : 'error'
          );
          return { ...t, miniCentralAtiva: nextState };
        }
        return t;
      })
    );
  };

  const toggleAgenda = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextState = !t.agendaAtiva;
          addAuditLog(
            nextState ? 'Ativação de Agenda e Sistema' : 'Bloqueio de Agenda e Sistema',
            nextState
              ? 'Acesso ao sistema interno do barbeiro liberado.'
              : 'Acesso ao sistema interno do barbeiro bloqueado pelo Super Admin.',
            t.id,
            t.name
          );
          showNotification(
            `${t.name}: Acesso ao sistema interno agora está ${nextState ? 'LIBERADO' : 'SUSPENSO / BLOQUEADO'}`,
            nextState ? 'success' : 'error'
          );

          // If current logged in barber belongs to this tenant and agenda was suspended, force kick
          if (!nextState && isBarberLoggedIn && currentTenantId === tenantId) {
            setIsBarberLoggedIn(false);
            setCurrentView('barber-login');
            showNotification('Seu acesso foi suspenso pela administração da plataforma.', 'error');
          }

          return { ...t, agendaAtiva: nextState };
        }
        return t;
      })
    );
  };

  const setTenantControls = (
    tenantId: string,
    miniCentralAtiva: boolean,
    agendaAtiva: boolean
  ) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          addAuditLog(
            'Atualização de Permissões da Barbearia',
            `Mini Central: ${miniCentralAtiva ? 'Ativa' : 'Inativa'} | Agenda: ${agendaAtiva ? 'Ativa' : 'Inativa'}`,
            t.id,
            t.name
          );
          return { ...t, miniCentralAtiva, agendaAtiva };
        }
        return t;
      })
    );
    showNotification('Status da barbearia atualizado com sucesso!', 'success');
  };

  // BARBER MINI CENTRAL EDITOR ACTION
  const updateCurrentTenant = (updates: Partial<BarbeariaTenant>) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          const updated = { ...t, ...updates };
          addAuditLog('Edição da Mini Central', 'Dados cadastrais ou visuais alterados pelo proprietário.', t.id, t.name);
          return updated;
        }
        return t;
      })
    );
    showNotification('Mini Central atualizada com sucesso!', 'success');
  };

  // AUTHENTICATION
  const loginBarber = (email: string, pass: string): { success: boolean; error?: string } => {
    // Find target tenant by owner email or fallback to currentTenant
    const target =
      tenants.find((t) => t.ownerEmail.toLowerCase() === email.toLowerCase()) || currentTenant;

    // RULE 1: If agendaAtiva is false, deny entry!
    if (!target.agendaAtiva) {
      const errorMsg =
        'Acesso suspenso: A agenda e o sistema operacional desta barbearia foram bloqueados pela administração. Entre em contato com o suporte da plataforma.';
      return { success: false, error: errorMsg };
    }

    // Demo password check: accepts any password for demo ease or '123456'
    if (!email) {
      return { success: false, error: 'Por favor, informe seu e-mail cadastrado.' };
    }

    setIsBarberLoggedIn(true);
    setBarberEmail(email);
    setCurrentTenantId(target.id);
    setCurrentView('barber-system');
    showNotification(`Bem-vindo ao Sistema Interno, ${target.barbeiro}!`, 'success');
    return { success: true };
  };

  const logoutBarber = () => {
    setIsBarberLoggedIn(false);
    setCurrentView('mini-central');
    showNotification('Você saiu do sistema operacional.', 'info');
  };

  const loginSuperAdmin = (email: string, pass: string): { success: boolean; error?: string } => {
    if (!email || !pass) {
      return { success: false, error: 'Informe e-mail e senha de administrador.' };
    }
    setIsSuperAdminLoggedIn(true);
    setCurrentView('super-admin');
    showNotification('Painel do Super Administrador acessado com sucesso!', 'success');
    return { success: true };
  };

  const logoutSuperAdmin = () => {
    setIsSuperAdminLoggedIn(false);
    setCurrentView('mini-central');
    showNotification('Sessão de Super Admin finalizada.', 'info');
  };

  // BUSINESS LOGIC: APPOINTMENTS
  const addAppointment = (aptData: Omit<AppointmentItem, 'id' | 'createdAt'>): AppointmentItem => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const newApt: AppointmentItem = {
      ...aptData,
      id: `apt-${Date.now()}`,
      createdAt: formatted,
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Also register or update client record
    setClients((prev) => {
      const existing = prev.find(
        (c) => c.tenantId === aptData.tenantId && c.phone === aptData.clientPhone
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpent: c.totalSpent + aptData.totalPrice,
                lastVisit: 'Hoje',
              }
            : c
        );
      } else {
        const newClient: ClientItem = {
          id: `cli-${Date.now()}`,
          tenantId: aptData.tenantId,
          name: aptData.clientName,
          phone: aptData.clientPhone,
          totalVisits: 1,
          totalSpent: aptData.totalPrice,
          lastVisit: 'Hoje',
          favoriteService: aptData.serviceNames,
        };
        return [newClient, ...prev];
      }
    });

    addAuditLog('Novo Agendamento', `Cliente: ${aptData.clientName} | Horário: ${aptData.timeSlot} | Valor: R$ ${aptData.totalPrice}`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentItem['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          // If concluded, register in finance
          if (status === 'concluido' && apt.status !== 'concluido') {
            addFinanceEntry({
              tenantId: apt.tenantId,
              description: `Corte finalizado: ${apt.clientName} (${apt.serviceNames})`,
              type: 'receita',
              amount: apt.totalPrice,
              category: 'Serviço',
              date: new Date().toLocaleDateString('pt-BR'),
              method: 'Pix',
            });
          }
          return { ...apt, status };
        }
        return apt;
      })
    );
    showNotification(`Status do agendamento alterado para: ${status.toUpperCase()}`, 'info');
  };

  const addClient = (cliData: Omit<ClientItem, 'id'>) => {
    const newClient: ClientItem = {
      ...cliData,
      id: `cli-${Date.now()}`,
    };
    setClients((prev) => [newClient, ...prev]);
    showNotification(`Cliente ${cliData.name} cadastrado com sucesso!`, 'success');
  };

  const addFinanceEntry = (entryData: Omit<FinanceEntry, 'id'>) => {
    const newEntry: FinanceEntry = {
      ...entryData,
      id: `fin-${Date.now()}`,
    };
    setFinanceEntries((prev) => [newEntry, ...prev]);
    showNotification('Lançamento financeiro registrado com sucesso!', 'success');
  };

  return (
    <SaaSContext.Provider
      value={{
        currentView,
        setCurrentView,
        barberActiveTab,
        setBarberActiveTab,
        superAdminActiveTab,
        setSuperAdminActiveTab,
        tenants,
        currentTenantId,
        currentTenant,
        switchTenant,
        updateCurrentTenant,
        toggleMiniCentral,
        toggleAgenda,
        setTenantControls,
        isBarberLoggedIn,
        barberEmail,
        loginBarber,
        logoutBarber,
        isSuperAdminLoggedIn,
        loginSuperAdmin,
        logoutSuperAdmin,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        clients,
        addClient,
        financeEntries,
        addFinanceEntry,
        auditLogs,
        addAuditLog,
        notification,
        showNotification,
      }}
    >
      {children}
    </SaaSContext.Provider>
  );
}

export function useSaaS() {
  const context = useContext(SaaSContext);
  if (!context) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
}
