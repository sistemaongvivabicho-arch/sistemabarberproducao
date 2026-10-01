import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Send,
  Plus,
  Calendar,
  X,
  Instagram,
  Check,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { ClientItem } from '../../types';

export default function BarberClients() {
  const { currentTenant, clients, addClient, addAppointment, showNotification } = useSaaS();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'ativos' | 'fidelidade'>('todos');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookingClient, setBookingClient] = useState<ClientItem | null>(null);

  // Form state for new client
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [favoriteService, setFavoriteService] = useState('Degradê');

  // Form state for quick booking modal
  const [bookingServiceId, setBookingServiceId] = useState(currentTenant.services[0]?.id || 'degrade');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingDay, setBookingDay] = useState('Hoje');

  const tenantClients = clients.filter((c) => c.tenantId === currentTenant.id);

  // Filter clients
  const filteredClients = useMemo(() => {
    return tenantClients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        c.phone.includes(searchTerm.trim()) ||
        (c.instagram && c.instagram.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        c.favoriteService.toLowerCase().includes(searchTerm.toLowerCase().trim());

      if (!matchSearch) return false;

      if (filterType === 'ativos') {
        return c.status !== 'inativo';
      }
      if (filterType === 'fidelidade') {
        return (c.fidelityPoints || c.totalVisits || 0) > 0;
      }
      return true;
    });
  }, [tenantClients, searchTerm, filterType]);

  // Compute initials like 'rg' for 'ruan gabriel'
  const getInitials = (clientName: string) => {
    const parts = clientName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toLowerCase();
    }
    return (clientName.slice(0, 2) || 'rg').toLowerCase();
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const formattedIg = instagram.trim()
      ? instagram.startsWith('@')
        ? instagram.trim()
        : `@${instagram.trim()}`
      : undefined;

    addClient({
      tenantId: currentTenant.id,
      name: name.trim(),
      phone: phone.trim(),
      totalVisits: 0,
      totalSpent: 0,
      lastVisit: 'Recente',
      favoriteService,
      instagram: formattedIg,
      status: 'ativo',
      fidelityPoints: 0,
    });

    setName('');
    setPhone('');
    setInstagram('');
    setIsAddModalOpen(false);
    showNotification(`Cliente ${name} cadastrado com sucesso!`, 'success');
  };

  const handleQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingClient) return;

    const serviceObj = currentTenant.services.find((s) => s.id === bookingServiceId);
    const price = serviceObj ? serviceObj.price : 50;

    addAppointment({
      tenantId: currentTenant.id,
      clientName: bookingClient.name,
      clientPhone: bookingClient.phone,
      services: [bookingServiceId],
      serviceNames: serviceObj ? serviceObj.name : 'Corte Agendado',
      professionalId: 'prof-main',
      professionalName: currentTenant.barbeiro,
      dayLabel: bookingDay,
      timeSlot: bookingTime,
      totalPrice: price,
      status: 'confirmado',
    });

    setBookingClient(null);
    showNotification(`Horário agendado para ${bookingClient.name} às ${bookingTime}!`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
            Gestão de Clientes
          </h2>
          <p className="text-xs text-zinc-400">
            Base completa de clientes, histórico de consumo, programa de fidelidade e agendamento rápido.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-display font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-[#0b0f17] border border-[#1b2535] p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, celular ou @instagram..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f141d] border border-[#1b2535] text-xs text-white placeholder-zinc-500 outline-none focus:border-[#2563eb] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
              filterType === 'todos'
                ? 'bg-[#152238] text-blue-400 border-[#2563eb]/50'
                : 'bg-[#0f141d] text-zinc-400 border-[#1b2535] hover:text-white'
            }`}
          >
            Todos ({tenantClients.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('ativos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
              filterType === 'ativos'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                : 'bg-[#0f141d] text-zinc-400 border-[#1b2535] hover:text-emerald-400'
            }`}
          >
            Ativos
          </button>

          <button
            type="button"
            onClick={() => setFilterType('fidelidade')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
              filterType === 'fidelidade'
                ? 'bg-amber-500/20 text-[#f8c105] border-[#f8c105]/50'
                : 'bg-[#0f141d] text-zinc-400 border-[#1b2535] hover:text-[#f8c105]'
            }`}
          >
            Fidelidade
          </button>
        </div>
      </div>

      {/* CLIENTS GRID (Cards exact match to screenshot) */}
      {filteredClients.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#0b0f17] border border-[#1b2535] text-center space-y-2 text-zinc-400 text-xs">
          <Users size={32} className="mx-auto text-zinc-600 mb-1" />
          <p className="font-bold text-white text-sm">Nenhum cliente encontrado</p>
          <p>Tente alterar os termos da busca ou cadastre um novo cliente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((cli) => {
            const initials = getInitials(cli.name);
            const rawPhone = cli.phone.replace(/\D/g, '');
            const points = cli.fidelityPoints ?? (cli.totalVisits % 10);
            const igHandle = cli.instagram || `@${cli.name.toLowerCase().replace(/\s+/g, '')}`;

            return (
              <div
                key={cli.id}
                className="p-5 rounded-2xl bg-[#0c1017] border border-[#1b2535] hover:border-[#2563eb]/50 transition-all duration-200 shadow-xl space-y-3.5 group text-left"
              >
                {/* TOP HEADER: Avatar + Name + ATIVO badge + Agendar button */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    {/* Circle Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#18397a] text-white flex items-center justify-center font-bold text-sm select-none shadow-md shrink-0">
                      {initials}
                    </div>

                    {/* Name & ATIVO pill */}
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm sm:text-base text-white leading-tight">
                        {cli.name}
                      </h4>
                      <div>
                        <span className="bg-[#062e20] text-[#10b981] border border-[#059669]/30 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase inline-block">
                          {cli.status === 'inativo' ? 'INATIVO' : 'ATIVO'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agendar Button (Top Right) */}
                  <button
                    type="button"
                    onClick={() => setBookingClient(cli)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#142239] hover:bg-[#2563eb] text-[#3b82f6] hover:text-white border border-[#2563eb]/50 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                  >
                    Agendar
                  </button>
                </div>

                {/* MIDDLE SECTION: Telephone + WhatsApp link + Instagram handle */}
                <div className="pt-2 border-t border-[#162030] space-y-1.5 text-xs">
                  {/* Phone + WhatsApp */}
                  <div className="flex items-center gap-3 text-zinc-300 font-mono text-[11px] sm:text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Phone size={13} className="text-zinc-400 shrink-0" />
                      <span>{cli.phone}</span>
                    </span>

                    <a
                      href={`https://wa.me/55${rawPhone}?text=${encodeURIComponent(
                        `Olá ${cli.name}, tudo bem? Passando para te convidar para agendar seu próximo corte na barbearia!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10b981] hover:underline flex items-center gap-1 font-sans font-semibold transition-colors"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={13} className="text-[#10b981]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Instagram handle */}
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs font-mono">
                    <Instagram size={13} className="text-zinc-500 shrink-0" />
                    <span className="hover:text-zinc-200 transition-colors">{igHandle}</span>
                  </div>
                </div>

                {/* BOTTOM METRICS: Total Gasto | Visitas | Fidelidade */}
                <div className="pt-3 border-t border-[#162030] grid grid-cols-3 gap-2 text-left">
                  <div>
                    <span className="text-[11px] text-zinc-400 block font-sans">Total Gasto</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono">
                      R$ {cli.totalSpent.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 block font-sans">Visitas</span>
                    <span className="text-xs sm:text-sm font-bold text-[#3b82f6] font-mono">
                      {cli.totalVisits}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 block font-sans">Fidelidade</span>
                    <span className="text-xs sm:text-sm font-bold text-[#f8c105] font-mono">
                      {points} pts
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CADASTRAR NOVO CLIENTE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0b0f17] border border-[#1b2535] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2535]">
              <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                Cadastrar Novo Cliente
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#0f141d] hover:bg-[#151c28] text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Nome do Cliente:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ruan Gabriel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">WhatsApp / Celular:</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 478847747488 ou (47) 99876-5432"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Instagram (Opcional):</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Ex: @ruahncat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Serviço Preferido:</label>
                <select
                  value={favoriteService}
                  onChange={(e) => setFavoriteService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                >
                  {currentTenant.services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f141d] hover:bg-[#151c28] text-zinc-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-lg"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGENDAMENTO RÁPIDO PARA O CLIENTE */}
      {bookingClient && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0b0f17] border border-[#1b2535] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2535]">
              <div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                  Agendar para {bookingClient.name}
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">{bookingClient.phone}</span>
              </div>
              <button
                type="button"
                onClick={() => setBookingClient(null)}
                className="w-7 h-7 rounded-lg bg-[#0f141d] hover:bg-[#151c28] text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleQuickBooking} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Serviço:</label>
                <select
                  value={bookingServiceId}
                  onChange={(e) => setBookingServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                >
                  {currentTenant.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — R$ {s.price.toFixed(2).replace('.', ',')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Dia:</label>
                  <select
                    value={bookingDay}
                    onChange={(e) => setBookingDay(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                  >
                    <option value="Hoje">Hoje</option>
                    <option value="Amanhã">Amanhã</option>
                    <option value="Sexta-feira">Sexta-feira</option>
                    <option value="Sábado">Sábado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Horário:</label>
                  <input
                    type="text"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="14:00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setBookingClient(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f141d] hover:bg-[#151c28] text-zinc-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-lg"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
