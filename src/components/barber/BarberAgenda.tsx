import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Check,
  X,
  User,
  Filter,
  Phone,
  Send,
  Sparkles,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { AppointmentItem } from '../../types';

interface WeekDayItem {
  key: string;
  dayShort: string; // DOM, SEG, TER, QUA, QUI, SEX, SÁB
  dayNumber: number;
  fullDateLabel: string; // Quinta-Feira, 1 De Outubro
  isToday?: boolean;
}

export default function BarberAgenda() {
  const { currentTenant, appointments, addAppointment, updateAppointmentStatus, showNotification } = useSaaS();

  // Days strip matching screenshot: DOM 27, SEG 28, TER 29, QUA 30, QUI 1, SEX 2, SÁB 3
  const weekDays: WeekDayItem[] = useMemo(() => [
    { key: 'dom-27', dayShort: 'DOM', dayNumber: 27, fullDateLabel: 'Domingo, 27 De Setembro' },
    { key: 'seg-28', dayShort: 'SEG', dayNumber: 28, fullDateLabel: 'Segunda-Feira, 28 De Setembro' },
    { key: 'ter-29', dayShort: 'TER', dayNumber: 29, fullDateLabel: 'Terça-Feira, 29 De Setembro' },
    { key: 'qua-30', dayShort: 'QUA', dayNumber: 30, fullDateLabel: 'Quarta-Feira, 30 De Setembro' },
    { key: 'qui-1', dayShort: 'QUI', dayNumber: 1, fullDateLabel: 'Quinta-Feira, 1 De Outubro', isToday: true },
    { key: 'sex-2', dayShort: 'SEX', dayNumber: 2, fullDateLabel: 'Sexta-Feira, 2 De Outubro' },
    { key: 'sab-3', dayShort: 'SÁB', dayNumber: 3, fullDateLabel: 'Sábado, 3 De Outubro' },
  ], []);

  const [selectedDayKey, setSelectedDayKey] = useState<string>('qui-1');
  const selectedDayObj = weekDays.find((d) => d.key === selectedDayKey) || weekDays[4];

  // Standard hours list from 09:00 to 19:00 as shown in the screenshot
  const timeSlots = useMemo(() => [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ], []);

  // Blocked slots map (e.g. lunch / pausa)
  const [blockedSlots, setBlockedSlots] = useState<Record<string, string>>({
    'qui-1_12:00': 'Horário de Almoço',
  });

  // Selected Barber / Professional
  const [selectedProfessionalName, setSelectedProfessionalName] = useState<string>(() => {
    return currentTenant.barbeiro || 'Ruan Santos';
  });

  // Modal states
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Form states for new booking
  const [targetTimeSlot, setTargetTimeSlot] = useState('09:00');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newServiceId, setNewServiceId] = useState(currentTenant.services[0]?.id || 'degrade');

  // Form state for block modal
  const [blockTimeSlot, setBlockTimeSlot] = useState('13:00');
  const [blockReason, setBlockReason] = useState('Intervalo / Almoço');

  // Appointments for current tenant
  const tenantAppointments = appointments.filter((a) => a.tenantId === currentTenant.id);

  // Day filter logic: map 'qui-1' to 'Hoje' or check match
  const dayAppointments = useMemo(() => {
    return tenantAppointments.filter((apt) => {
      if (selectedDayKey === 'qui-1') {
        return apt.dayLabel === 'Hoje' || apt.dayLabel === 'Quinta-feira' || apt.dayLabel.includes('1');
      }
      if (selectedDayKey === 'sex-2') {
        return apt.dayLabel === 'Amanhã' || apt.dayLabel === 'Sexta-feira';
      }
      return apt.dayLabel.toLowerCase().includes(selectedDayObj.dayShort.toLowerCase());
    });
  }, [tenantAppointments, selectedDayKey, selectedDayObj]);

  const initials = useMemo(() => {
    const parts = selectedProfessionalName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (selectedProfessionalName.slice(0, 2) || 'RS').toUpperCase();
  }, [selectedProfessionalName]);

  // Open booking modal for a specific slot
  const handleOpenSlotBooking = (slot: string) => {
    setTargetTimeSlot(slot);
    setIsNewBookingModalOpen(true);
  };

  // Submit new booking
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = currentTenant.services.find((s) => s.id === newServiceId);
    const price = serviceObj ? serviceObj.price : 50;

    addAppointment({
      tenantId: currentTenant.id,
      clientName: newClientName.trim() || 'Cliente Agendado',
      clientPhone: newClientPhone.trim() || currentTenant.phone,
      services: [newServiceId],
      serviceNames: serviceObj ? serviceObj.name : 'Corte & Barba',
      professionalId: 'prof-main',
      professionalName: selectedProfessionalName,
      dayLabel: selectedDayObj.isToday ? 'Hoje' : selectedDayObj.dayShort,
      timeSlot: targetTimeSlot,
      totalPrice: price,
      status: 'confirmado',
    });

    setIsNewBookingModalOpen(false);
    setNewClientName('');
    setNewClientPhone('');
    showNotification(`Agendamento confirmado para as ${targetTimeSlot}!`, 'success');
  };

  // Block slot submit
  const handleBlockSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${selectedDayKey}_${blockTimeSlot}`;
    setBlockedSlots((prev) => ({ ...prev, [key]: blockReason }));
    setIsBlockModalOpen(false);
    showNotification(`Horário ${blockTimeSlot} bloqueado com sucesso (${blockReason})!`, 'info');
  };

  const handleUnblockSlot = (slot: string) => {
    const key = `${selectedDayKey}_${slot}`;
    setBlockedSlots((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    showNotification(`Horário ${slot} desbloqueado para agendamentos!`, 'success');
  };

  return (
    <div className="space-y-4 text-left">
      {/* MAIN AGENDA CARD CONTAINER (Exact match to screenshot) */}
      <div className="bg-[#0b0f17] border border-[#1b2535] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarIcon size={20} className="text-[#3b82f6]" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide">
                Agenda
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              <span className="text-zinc-200 font-medium">{selectedDayObj.fullDateLabel}</span>
              <span className="mx-1.5 text-zinc-600">·</span>
              <span className="text-[#3b82f6] font-semibold">
                {dayAppointments.length} Agendamentos
              </span>
            </p>
          </div>

          {/* Action Buttons: Bloquear (Dark) & Novo Agendamento (Blue) */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsBlockModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0f1520] hover:bg-[#161f30] border border-[#1f2c42] text-zinc-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Lock size={14} className="text-[#f8c105]" />
              <span>Bloquear</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTargetTimeSlot('09:00');
                setIsNewBookingModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Plus size={16} className="stroke-[3]" />
              <span>Novo agendamento</span>
            </button>
          </div>
        </div>

        {/* DATE STRIP BAR (7 Days + Hoje button) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 select-none">
          {weekDays.map((d) => {
            const isActive = selectedDayKey === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDayKey(d.key)}
                className={`flex-1 min-w-[72px] sm:min-w-[85px] py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    : 'bg-[#0f141d] hover:bg-[#151c28] text-zinc-300 border-[#1c2637]'
                }`}
              >
                <span
                  className={`text-[11px] font-mono tracking-wider font-extrabold uppercase ${
                    isActive ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {d.dayShort}
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold leading-none font-mono ${
                    isActive ? 'text-white font-black' : 'text-zinc-200'
                  }`}
                >
                  {d.dayNumber}
                </span>
              </button>
            );
          })}

          {/* "Hoje" Shortcut Button */}
          <button
            type="button"
            onClick={() => setSelectedDayKey('qui-1')}
            className={`px-4 py-4 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all cursor-pointer border shrink-0 ${
              selectedDayKey === 'qui-1'
                ? 'bg-[#1e293b] text-[#3b82f6] border-[#3b82f6]/40'
                : 'bg-[#0f141d] hover:bg-[#151c28] text-zinc-300 border-[#1c2637]'
            }`}
          >
            Hoje
          </button>
        </div>

        {/* SCHEDULE TIMELINE TABLE */}
        <div className="border border-[#1b2535] rounded-xl overflow-hidden bg-[#090d14]">
          {/* TABLE HEADER (Hora | Barber & Hours) */}
          <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] border-b border-[#1b2535] bg-[#0c111a] px-4 py-3 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono font-bold tracking-wider uppercase">
              <Clock size={13} className="text-zinc-500" />
              <span>HORA</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Barber Avatar Initials */}
                <div className="w-6 h-6 rounded-full bg-[#1e293b] border border-[#3b82f6]/40 text-[#60a5fa] font-mono font-black text-[11px] flex items-center justify-center">
                  {initials}
                </div>
                <span className="font-display font-black text-white text-xs sm:text-sm tracking-wider uppercase">
                  {selectedProfessionalName}
                </span>
              </div>

              <span className="text-[11px] font-mono text-zinc-400">
                09:00 às 19:00
              </span>
            </div>
          </div>

          {/* TABLE BODY (Rows for each time slot) */}
          <div className="divide-y divide-[#161f2d]">
            {timeSlots.map((slot) => {
              const blockKey = `${selectedDayKey}_${slot}`;
              const isBlocked = Boolean(blockedSlots[blockKey]);
              const blockMsg = blockedSlots[blockKey];

              // Find appointment at this slot
              const apt = dayAppointments.find((a) => a.timeSlot === slot);

              return (
                <div
                  key={slot}
                  className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] min-h-[58px] hover:bg-[#0d121c]/70 transition-colors"
                >
                  {/* Left Column: Time */}
                  <div className="flex items-center px-4 font-mono font-bold text-xs text-zinc-400 border-r border-[#1b2535]">
                    {slot}
                  </div>

                  {/* Right Column: Slot Content (Available / Booked / Blocked) */}
                  <div className="p-2 sm:p-2.5 flex items-center">
                    {/* CASE 1: BLOCKED */}
                    {isBlocked ? (
                      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs">
                        <div className="flex items-center gap-2 font-medium">
                          <Lock size={13} className="text-amber-400" />
                          <span>Horário Bloqueado ({blockMsg || 'Pausa'})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnblockSlot(slot)}
                          className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
                        >
                          Desbloquear
                        </button>
                      </div>
                    ) : apt ? (
                      /* CASE 2: BOOKED APPOINTMENT */
                      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#1f2937] hover:border-[#3b82f6]/50 transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse shrink-0" />
                          <div className="text-left space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                                {apt.clientName}
                              </h4>
                              <span
                                className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                                  apt.status === 'concluido'
                                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                                    : apt.status === 'confirmado'
                                    ? 'bg-blue-950/80 text-blue-400 border-blue-500/40'
                                    : apt.status === 'cancelado'
                                    ? 'bg-red-950/80 text-red-400 border-red-500/40'
                                    : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-sans">
                              ✂️ <span className="text-zinc-200 font-semibold">{apt.serviceNames}</span>
                              <span className="mx-1.5 text-zinc-600">•</span>
                              <span className="text-[#f8c105] font-mono font-bold">
                                R$ {apt.totalPrice.toFixed(2).replace('.', ',')}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <a
                            href={`https://wa.me/55${apt.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Olá ${apt.clientName}! Confirmando seu horário na barbearia às ${apt.timeSlot}. Te aguardamos!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                            title="Conversar no WhatsApp"
                          >
                            <Send size={11} />
                            <span>Whats</span>
                          </a>

                          {apt.status !== 'concluido' && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, 'concluido')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Concluir e lançar no caixa"
                            >
                              <Check size={12} className="stroke-[3]" />
                              <span>Concluir</span>
                            </button>
                          )}

                          {apt.status !== 'cancelado' && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelado')}
                              className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                              title="Cancelar agendamento"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* CASE 3: AVAILABLE SLOT (+ Disponível · Agendar às HH:MM) */
                      <button
                        type="button"
                        onClick={() => handleOpenSlotBooking(slot)}
                        className="w-full h-full min-h-[38px] rounded-lg border border-dashed border-[#1a2538] hover:border-[#3b82f6]/60 hover:bg-[#3b82f6]/5 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
                      >
                        <span className="text-[#3b82f6] group-hover:scale-125 transition-transform">+</span>
                        <span>Disponível · Agendar às {slot}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: NOVO AGENDAMENTO */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0b0f17] border border-[#1b2535] rounded-2xl p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2535]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2563eb]/20 text-[#60a5fa] flex items-center justify-center">
                  <Plus size={16} className="stroke-[3]" />
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                  Novo Agendamento
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#0f141d] hover:bg-[#151c28] text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] text-[11px] text-zinc-300 font-mono flex items-center justify-between">
                <span>Data: <strong className="text-white">{selectedDayObj.fullDateLabel}</strong></span>
                <span>Horário: <strong className="text-[#3b82f6]">{targetTimeSlot}</strong></span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Nome do Cliente:</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Nome completo do cliente"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#3b82f6] text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">WhatsApp / Celular:</label>
                <input
                  type="text"
                  required
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="(47) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#3b82f6] text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Serviço Desejado:</label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#3b82f6] text-white outline-none"
                >
                  {currentTenant.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — R$ {s.price.toFixed(2).replace('.', ',')} ({s.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f141d] hover:bg-[#161f30] text-zinc-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-display font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BLOQUEAR HORÁRIO */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0b0f17] border border-[#1b2535] rounded-2xl p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2535]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-[#f8c105] flex items-center justify-center">
                  <Lock size={15} />
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                  Bloquear Horário
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBlockModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#0f141d] hover:bg-[#151c28] text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBlockSlot} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Horário para Bloquear:</label>
                <select
                  value={blockTimeSlot}
                  onChange={(e) => setBlockTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#f8c105] text-white outline-none font-mono"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Motivo do Bloqueio:</label>
                <input
                  type="text"
                  required
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex: Horário de Almoço / Pausa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#f8c105] text-white outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f141d] hover:bg-[#161f30] text-zinc-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black font-display font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Bloquear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
