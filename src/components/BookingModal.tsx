import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  Clock,
  Scissors,
  Sparkles,
  User,
  X,
  AlertTriangle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useSaaS } from '../context/SaaSContext';
import { ServiceItem } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { currentTenant, addAppointment } = useSaaS();

  const [selectedServices, setSelectedServices] = useState<string[]>(['degrade']);
  const [selectedDay, setSelectedDay] = useState<string>('Hoje');
  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  const [selectedProfessional, setSelectedProfessional] = useState<string>(
    currentTenant.professionals[0]?.name || currentTenant.barbeiro
  );
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [step, setStep] = useState<'service' | 'datetime' | 'confirm' | 'success'>('service');
  const [createdAptId, setCreatedAptId] = useState<string | null>(null);

  // Days list (Segunda a Sábado)
  const days = [
    { label: 'Hoje', sub: 'Mais Rápido' },
    { label: 'Amanhã', sub: 'Recomendado' },
    { label: 'Segunda-feira', sub: 'Seg' },
    { label: 'Terça-feira', sub: 'Ter' },
    { label: 'Quarta-feira', sub: 'Qua' },
    { label: 'Quinta-feira', sub: 'Qui' },
    { label: 'Sexta-feira', sub: 'Sex' },
    { label: 'Sábado', sub: 'Sáb' },
  ];

  // Available Time Slots
  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '13:30',
    '14:30',
    '15:30',
    '16:30',
    '17:30',
    '18:30',
    '19:30',
  ];

  const activeServices = currentTenant.services.filter((s) => s.isActive !== false);

  const toggleService = (id: string) => {
    if (id === 'combo-completo') {
      setSelectedServices(['combo-completo']);
      return;
    }

    if (selectedServices.includes('combo-completo')) {
      setSelectedServices([id]);
      return;
    }

    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const selectedItems: ServiceItem[] = activeServices.filter((s) =>
    selectedServices.includes(s.id)
  );

  const totalPrice = selectedItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleCreateAppointment = () => {
    const servicesNames = selectedItems.map((s) => s.name).join(' + ');

    // Register into SaaS appointments
    const newApt = addAppointment({
      tenantId: currentTenant.id,
      clientName: clientName.trim() || 'Cliente Presencial',
      clientPhone: clientPhone.trim() || currentTenant.phone,
      services: selectedServices,
      serviceNames: servicesNames,
      professionalId: 'prof-selected',
      professionalName: selectedProfessional,
      dayLabel: selectedDay,
      timeSlot: selectedTime,
      totalPrice,
      status: 'pendente',
    });

    setCreatedAptId(newApt.id);
    setStep('success');
  };

  const handleOpenWhatsApp = () => {
    const servicesNames = selectedItems.map((s) => s.name).join(' + ');
    const msg = `Olá! Gostaria de confirmar meu agendamento na *${currentTenant.name}*:

✂️ *Serviço:* ${servicesNames}
💰 *Valor Estimado:* R$ ${totalPrice.toFixed(2).replace('.', ',')}
📅 *Dia:* ${selectedDay}
⏰ *Horário:* ${selectedTime}
💈 *Barbeiro:* ${selectedProfessional}
👤 *Cliente:* ${clientName || 'Cliente'}
📱 *Contato:* ${clientPhone || currentTenant.phone}

Podemos confirmar esse horário?`;

    const url = `https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  const handleClose = () => {
    setStep('service');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 340 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-[#f8c105]/60 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-[#f8c105] p-3.5 sm:p-4 flex items-center justify-between text-black border-b border-[#f8c105]">
            <div className="flex items-center gap-2">
              {step !== 'service' && step !== 'success' && currentTenant.miniCentralAtiva && (
                <button
                  type="button"
                  onClick={() => setStep(step === 'confirm' ? 'datetime' : 'service')}
                  className="w-7 h-7 rounded-lg bg-black/15 hover:bg-black/30 text-black flex items-center justify-center transition-all cursor-pointer mr-1"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <div className="w-6 h-6 rounded-full bg-black text-[#f8c105] flex items-center justify-center font-black text-xs shrink-0">
                <Scissors size={13} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-wide leading-tight">
                  AGENDAR HORÁRIO — {currentTenant.name}
                </h3>
                <p className="text-[10px] text-black/80 font-medium">
                  {currentTenant.neighborhood} — {currentTenant.city}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/30 flex items-center justify-center transition-all text-black cursor-pointer font-bold"
            >
              <X size={18} />
            </button>
          </div>

          {/* RULE: If miniCentralAtiva is FALSE, block booking and show notice */}
          {!currentTenant.miniCentralAtiva ? (
            <div className="p-6 sm:p-8 space-y-5 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                <AlertTriangle size={28} />
              </div>

              <div className="space-y-2">
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Agendamentos Online Suspensos
                </span>
                <h4 className="font-display font-extrabold text-white text-base sm:text-lg">
                  Mini Central Temporariamente em Pausa
                </h4>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  A agenda online da <strong className="text-white">{currentTenant.name}</strong> está temporariamente desativada pela administração. Para agendamentos presenciais ou encaixes, fale conosco pelo WhatsApp:
                </p>
              </div>

              <div className="w-full pt-2 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(`Olá! Vi na Mini Central da ${currentTenant.name} que o agendamento online está pausado. Tem algum horário disponível para corte?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={15} />
                  <span>Consultar Horário no WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
                >
                  Voltar para a Página
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stepper Progress Bar */}
              {step !== 'success' && (
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span
                    className={`flex items-center gap-1 font-bold ${
                      step === 'service' ? 'text-[#f8c105]' : 'text-zinc-400'
                    }`}
                  >
                    1. Serviços
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span
                    className={`flex items-center gap-1 font-bold ${
                      step === 'datetime' ? 'text-[#f8c105]' : 'text-zinc-400'
                    }`}
                  >
                    2. Barbeiro & Horário
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span
                    className={`flex items-center gap-1 font-bold ${
                      step === 'confirm' ? 'text-[#f8c105]' : 'text-zinc-400'
                    }`}
                  >
                    3. Seus Dados
                  </span>
                </div>
              )}

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
                {/* STEP 1: SELECT SERVICES */}
                {step === 'service' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105]">
                        Escolha um ou mais serviços:
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Total: R$ {totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {activeServices.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#f8c105]/15 border-[#f8c105] shadow-[0_0_15px_rgba(248,193,5,0.2)]'
                                : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                                  isSelected
                                    ? 'bg-[#f8c105] text-black border-[#f8c105]'
                                    : 'border-zinc-700 bg-zinc-800 text-transparent'
                                }`}
                              >
                                <Check size={12} className="stroke-[3]" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display font-extrabold text-xs sm:text-sm text-white">
                                    {service.name}
                                  </h4>
                                  {service.isPopular && (
                                    <span className="bg-[#f8c105] text-black text-[9px] font-black uppercase px-1.5 py-0.2 rounded-sm inline-flex items-center gap-0.5">
                                      <Sparkles size={9} /> Destaque
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-1">
                                  {service.description}
                                </p>
                                <span className="text-[10px] text-zinc-500 font-mono mt-0.5 inline-block">
                                  ⏱ Duração aprox: {service.duration}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-black text-sm sm:text-base text-[#f8c105]">
                                R$ {service.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: PROFESSIONAL, DATE & TIME */}
                {step === 'datetime' && (
                  <div className="space-y-4">
                    {/* Professional Selection */}
                    <div>
                      <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block mb-2">
                        Escolha o Profissional / Barbeiro:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {currentTenant.professionals.map((prof) => (
                          <button
                            key={prof.id}
                            type="button"
                            onClick={() => setSelectedProfessional(prof.name)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                              selectedProfessional === prof.name
                                ? 'bg-[#f8c105] text-black border-[#f8c105] font-black shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                selectedProfessional === prof.name
                                  ? 'bg-black text-[#f8c105]'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              <User size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight">{prof.name}</p>
                              <p
                                className={`text-[10px] ${
                                  selectedProfessional === prof.name
                                    ? 'text-black/80 font-medium'
                                    : 'text-zinc-500'
                                }`}
                              >
                                {prof.role}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Day Selection */}
                    <div>
                      <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block mb-2">
                        Escolha o Dia do Atendimento:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {days.map((d) => (
                          <button
                            key={d.label}
                            type="button"
                            onClick={() => setSelectedDay(d.label)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              selectedDay === d.label
                                ? 'bg-[#f8c105] text-black border-[#f8c105] font-black shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 font-medium'
                            }`}
                          >
                            <p className="text-xs">{d.label}</p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                selectedDay === d.label ? 'text-black/80' : 'text-zinc-500'
                              }`}
                            >
                              {d.sub}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block mb-2">
                        Horário Disponível:
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-1 rounded-lg border text-center font-mono text-xs transition-all cursor-pointer ${
                              selectedTime === time
                                ? 'bg-[#f8c105] text-black border-[#f8c105] font-bold shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: CLIENT DATA (NO CPF REQUIRED!) */}
                {step === 'confirm' && (
                  <div className="space-y-4">
                    {/* Summary Card */}
                    <div className="p-4 rounded-xl bg-zinc-900 border border-[#f8c105]/40 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                          Resumo da Reserva
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {currentTenant.name}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Serviços:</span>
                          <span className="font-extrabold text-white text-right">
                            {selectedItems.map((s) => s.name).join(' + ')}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-zinc-400">Dia escolhido:</span>
                          <span className="font-bold text-[#f8c105]">{selectedDay}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-zinc-400">Horário:</span>
                          <span className="font-mono font-bold text-[#f8c105]">{selectedTime}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-zinc-400">Profissional:</span>
                          <span className="font-bold text-white">{selectedProfessional}</span>
                        </div>

                        <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm">
                          <span className="font-extrabold text-white uppercase">Valor Total:</span>
                          <span className="font-mono font-black text-[#f8c105] text-base">
                            R$ {totalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Client Input: NAME + PHONE ONLY (No CPF!) */}
                    <div className="space-y-2.5">
                      <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block">
                        Seus Dados para o Agendamento:
                      </label>

                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          required
                          placeholder="Seu nome completo"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="tel"
                          required
                          placeholder="Seu WhatsApp com DDD (ex: 47 99999-9999)"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                        />
                      </div>

                      <p className="text-[10px] text-zinc-500 font-sans">
                        🔒 Seus dados serão utilizados apenas para registrar seu horário no sistema da barbearia.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: SUCCESS / CONFIRMATION SCREEN */}
                {step === 'success' && (
                  <div className="space-y-4 py-2 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                      <CheckCircle2 size={36} />
                    </div>

                    <div className="space-y-1.5">
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        Agendamento Registrado!
                      </span>
                      <h4 className="font-display font-extrabold text-white text-lg">
                        Horário Reservado com Sucesso!
                      </h4>
                      <p className="text-xs text-zinc-300 max-w-sm">
                        Obrigado, <strong className="text-white">{clientName || 'Cliente'}</strong>! Seu horário está garantido na agenda da <strong className="text-[#f8c105]">{currentTenant.name}</strong>.
                      </p>
                    </div>

                    {/* Detailed Card */}
                    <div className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-left">
                      <div className="flex justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Dia & Horário:</span>
                        <span className="font-bold text-[#f8c105]">
                          {selectedDay} às {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Profissional:</span>
                        <span className="font-bold text-white">{selectedProfessional}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Serviço:</span>
                        <span className="font-bold text-white">
                          {selectedItems.map((s) => s.name).join(' + ')}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-sm font-bold">
                        <span className="text-zinc-400 uppercase">Total:</span>
                        <span className="font-mono text-[#f8c105]">
                          R$ {totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <div className="w-full pt-2 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={handleOpenWhatsApp}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Send size={15} />
                        <span>Enviar Confirmação pelo WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
                      >
                        Concluir e Voltar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              {step !== 'success' && (
                <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between gap-3">
                  {step === 'service' && (
                    <button
                      type="button"
                      onClick={() => setStep('datetime')}
                      disabled={selectedServices.length === 0}
                      className="w-full py-3 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffd700] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(248,193,5,0.3)] active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      Continuar para Barbeiro e Horário →
                    </button>
                  )}

                  {step === 'datetime' && (
                    <button
                      type="button"
                      onClick={() => setStep('confirm')}
                      className="w-full py-3 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffd700] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(248,193,5,0.3)] active:scale-95 cursor-pointer"
                    >
                      Continuar para Meus Dados →
                    </button>
                  )}

                  {step === 'confirm' && (
                    <button
                      type="button"
                      onClick={handleCreateAppointment}
                      disabled={!clientName.trim() || !clientPhone.trim()}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(248,193,5,0.3)] active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <Check size={16} className="stroke-[3]" />
                      <span>Confirmar Agendamento</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
