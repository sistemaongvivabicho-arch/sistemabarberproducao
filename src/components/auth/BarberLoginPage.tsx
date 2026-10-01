import { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Lock, Mail, ArrowLeft, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function BarberLoginPage() {
  const { currentTenant, loginBarber, setCurrentView } = useSaaS();
  const [email, setEmail] = useState('barbeiro@lupumba.com');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = loginBarber(email, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleDemoLogin = () => {
    setEmail(currentTenant.ownerEmail || 'barbeiro@lupumba.com');
    setPassword('123456');
    setErrorMessage(null);
    const res = loginBarber(currentTenant.ownerEmail || 'barbeiro@lupumba.com', '123456');
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col justify-between p-4 select-none relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#f8c105]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#f8c105]/5 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => setCurrentView('mini-central')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar para a Mini Central</span>
        </button>

        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          SaaS Barbearia v2.0
        </span>
      </header>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
        >
          {/* Brand & Badge */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f8c105]/15 border border-[#f8c105]/40 flex items-center justify-center text-[#f8c105] shadow-[0_0_25px_rgba(248,193,5,0.25)]">
              <Scissors size={26} className="stroke-[2.2]" />
            </div>

            <div className="pt-2">
              <span className="text-[10px] bg-[#f8c105]/15 text-[#f8c105] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#f8c105]/30">
                Área do Barbeiro & Proprietário
              </span>
              <h2 className="font-display font-black text-xl text-white tracking-wide uppercase mt-2">
                {currentTenant.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Acesse o painel operacional para gerenciar agenda, clientes e sua Mini Central.
              </p>
            </div>
          </div>

          {/* RULE WARNING: If agendaAtiva is FALSE */}
          {!currentTenant.agendaAtiva && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs space-y-2 text-left">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <ShieldAlert size={18} className="shrink-0" />
                <span>Acesso Suspenso pelo Administrador</span>
              </div>
              <p className="text-[11px] text-red-300/90 leading-relaxed">
                A agenda e o sistema operacional desta barbearia foram temporariamente suspensos pelo Super Administrador. Não é possível entrar no momento.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 text-left">
              <AlertCircle size={16} className="shrink-0 text-amber-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">E-mail de Acesso:</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@barbearia.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300">Senha:</label>
                <span className="text-[10px] text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  Esqueceu a senha?
                </span>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!currentTenant.agendaAtiva}
              className="w-full py-3.5 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] disabled:opacity-40 disabled:cursor-not-allowed text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer mt-2"
            >
              Entrar no Sistema Interno →
            </button>
          </form>

          {/* Demo Quick Button */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <p className="text-[11px] text-zinc-500 text-center font-mono">
              Ambiente de Demonstração SaaS
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-[#f8c105]" />
              <span>Entrar com 1 Clique (Demo do Barbeiro)</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer info */}
      <footer className="max-w-md mx-auto w-full text-center text-zinc-600 text-[11px] py-2">
        Plataforma SaaS para Barbearias • LUPUMBA Tech
      </footer>
    </div>
  );
}
