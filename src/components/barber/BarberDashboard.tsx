import { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
  Share2,
  Sparkles,
  Scissors,
  Plus,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

interface BarberDashboardProps {
  onOpenNewAppointment?: () => void;
}

export default function BarberDashboard({ onOpenNewAppointment }: BarberDashboardProps) {
  const { currentTenant, appointments, updateAppointmentStatus, setBarberActiveTab, setCurrentView, showNotification } = useSaaS();

  const tenantAppointments = appointments.filter((a) => a.tenantId === currentTenant.id);
  const todayAppointments = tenantAppointments.filter((a) => a.dayLabel === 'Hoje');

  const todayRevenue = todayAppointments
    .filter((a) => a.status === 'concluido' || a.status === 'confirmado')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const completedToday = todayAppointments.filter((a) => a.status === 'concluido').length;

  const handleShareMiniCentral = () => {
    const url = window.location.origin;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showNotification('Link da Mini Central copiado para a área de transferência!', 'success');
    } else {
      showNotification(`Link público: ${url}`, 'info');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Alert / Status */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f8c105]">
              Sistema Operacional
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-zinc-400 font-mono">
              {currentTenant.plan} • {currentTenant.planStatus.toUpperCase()}
            </span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wide">
            {currentTenant.name}
          </h2>
          <p className="text-xs text-zinc-400">
            Painel do barbeiro: gerencie horários, clientes e mantenha sua Mini Central atualizada.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleShareMiniCentral}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
          >
            <Share2 size={13} className="text-[#f8c105]" />
            <span>Divulgar Link</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('mini-central')}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
          >
            <ExternalLink size={13} className="text-[#f8c105]" />
            <span>Ver Mini Central</span>
          </button>

          <button
            type="button"
            onClick={() => setBarberActiveTab('minicentral-editor')}
            className="px-4 py-2 rounded-xl bg-[#f8c105] hover:bg-[#ffd700] text-black text-xs font-display font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            <span>Editar Mini Central</span>
          </button>
        </div>
      </div>

      {/* Mini Central Status Banner if disabled */}
      {!currentTenant.miniCentralAtiva && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Atenção:</span>
            <span>A sua Mini Central pública está atualmente desativada pelo Super Admin. Novos agendamentos online estão pausados.</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold shrink-0">
            Modo Pausa
          </span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cortes Hoje</span>
            <div className="w-7 h-7 rounded-lg bg-[#f8c105]/10 text-[#f8c105] flex items-center justify-center">
              <Calendar size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-2xl sm:text-3xl text-white">
              {todayAppointments.length}
            </span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">
              {completedToday} atendidos
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Agendamentos marcados para o dia de hoje</p>
        </div>

        {/* Card 2 */}
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Faturamento Hoje</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-2xl sm:text-3xl text-emerald-400">
              R$ {todayRevenue.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Valor estimado e concluído do dia</p>
        </div>

        {/* Card 3 */}
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Ticket Médio</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-2xl sm:text-3xl text-white">
              R$ 52,50
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">+12% mês</span>
          </div>
          <p className="text-[11px] text-zinc-500">Média por atendimento na barbearia</p>
        </div>

        {/* Card 4 */}
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Status Mini Central</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${currentTenant.miniCentralAtiva ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <CheckCircle size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-display font-black text-xl sm:text-2xl ${currentTenant.miniCentralAtiva ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentTenant.miniCentralAtiva ? 'ONLINE' : 'PAUSADA'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            {currentTenant.miniCentralAtiva ? 'Aberta para agendamentos online' : 'Bloqueada para agendamentos'}
          </p>
        </div>
      </div>

      {/* Today's Queue & Action Section */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#f8c105]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wider">
              Fila de Clientes de Hoje
            </h3>
            <span className="text-[11px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              {todayAppointments.length} agendados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBarberActiveTab('agenda')}
              className="text-xs font-bold text-[#f8c105] hover:underline cursor-pointer"
            >
              Ver Agenda Completa →
            </button>
          </div>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            Nenhum cliente agendado para hoje ainda. Compartilhe sua Mini Central para receber agendamentos!
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex flex-col items-center justify-center font-mono shrink-0 border border-zinc-700">
                    <span className="text-xs font-black text-[#f8c105]">{apt.timeSlot}</span>
                    <span className="text-[9px] text-zinc-400">Hoje</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-white">{apt.clientName}</h4>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border ${
                          apt.status === 'concluido'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                            : apt.status === 'confirmado'
                            ? 'bg-blue-950/60 text-blue-400 border-blue-500/40'
                            : apt.status === 'cancelado'
                            ? 'bg-red-950/60 text-red-400 border-red-500/40'
                            : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      ✂️ {apt.serviceNames} • Barbeiro: {apt.professionalName}
                    </p>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      📞 {apt.clientPhone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="font-mono font-bold text-sm text-[#f8c105] mr-2">
                    R$ {apt.totalPrice.toFixed(2).replace('.', ',')}
                  </span>

                  {apt.status !== 'concluido' && apt.status !== 'cancelado' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, 'concluido')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
                    >
                      Concluir
                    </button>
                  )}

                  {apt.status === 'pendente' && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmado')}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 text-xs font-bold transition-all cursor-pointer"
                    >
                      Confirmar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
