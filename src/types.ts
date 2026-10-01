export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
  isPopular?: boolean;
  isActive?: boolean;
}

export interface CutVideo {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  youtubeId?: string;
  youtubeUrl?: string;
  wistiaId?: string;
}

export interface CutImage {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  alt: string;
  objectPosition?: string;
  scale?: number;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  avatarBg: string;
  comment: string;
  studentPhotoUrl?: string;
  serviceUsed: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProfessionalItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatarUrl?: string;
  commissionPercent: number;
  isActive: boolean;
}

export interface AppointmentItem {
  id: string;
  tenantId: string;
  clientName: string;
  clientPhone: string;
  services: string[];
  serviceNames: string;
  professionalId: string;
  professionalName: string;
  dayLabel: string;
  timeSlot: string;
  totalPrice: number;
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
}

export interface ClientItem {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  favoriteService: string;
  instagram?: string;
  status?: 'ativo' | 'inativo';
  fidelityPoints?: number;
  notes?: string;
}

export interface FinanceEntry {
  id: string;
  tenantId: string;
  description: string;
  type: 'receita' | 'despesa';
  amount: number;
  category: string;
  date: string;
  method: 'Pix' | 'Cartão' | 'Dinheiro';
}

export interface AuditLogItem {
  id: string;
  tenantId: string;
  tenantName: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface BarbeariaConfig {
  name: string;
  barbeiro: string;
  responsavel: string;
  phone: string;
  phoneRaw: string;
  whatsappFormatted: string;
  whatsappNumber: string;
  instagram: string;
  instagramUrl: string;
  googleMapsUrl: string;
  address: string;
  neighborhood: string;
  city: string;
  hours: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface BarbeariaTenant extends BarbeariaConfig {
  id: string;
  slug: string;
  tagline: string;
  ownerEmail: string;
  ownerName: string;
  // Super Admin independent controls
  miniCentralAtiva: boolean;
  agendaAtiva: boolean;
  // SaaS Plan details
  plan: 'Plano Start' | 'Plano Pro' | 'Plano Enterprise';
  planPrice: number;
  planStatus: 'ativo' | 'pendente' | 'bloqueado';
  memberSince: string;
  nextBillingDate: string;
  cuts: CutImage[];
  services: ServiceItem[];
  professionals: ProfessionalItem[];
}

export type PlatformView = 'mini-central' | 'barber-login' | 'barber-system' | 'super-admin-login' | 'super-admin';
export type BarberTab =
  | 'dashboard'
  | 'agenda'
  | 'clientes'
  | 'servicos'
  | 'funcionarios'
  | 'desempenho'
  | 'financeiro'
  | 'minicentral-editor'
  | 'marketing-ia'
  | 'fidelizacao'
  | 'consultor-ia'
  | 'plano';

export type SuperAdminTab = 'visao-geral' | 'barbearias' | 'planos' | 'inadimplencia' | 'auditoria';
