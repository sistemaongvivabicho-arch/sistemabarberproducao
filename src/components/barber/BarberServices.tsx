import { useState } from 'react';
import { Scissors, Plus, Check, X, Sparkles, DollarSign, Clock } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { ServiceItem } from '../../types';

export default function BarberServices() {
  const { currentTenant, updateCurrentTenant, showNotification } = useSaaS();
  const [services, setServices] = useState<ServiceItem[]>([...currentTenant.services]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('45');
  const [duration, setDuration] = useState('35 min');
  const [description, setDescription] = useState('');

  const toggleActive = (id: string) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, isActive: s.isActive === false ? true : false } : s
    );
    setServices(updated);
    updateCurrentTenant({ services: updated });
    showNotification('Status do serviço atualizado na Mini Central!', 'info');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name,
      price: parseFloat(price) || 40,
      duration: duration || '30 min',
      description: description || 'Serviço com padrão de qualidade Lupumba.',
      isActive: true,
    };
    const updated = [...services, newService];
    setServices(updated);
    updateCurrentTenant({ services: updated });
    setIsModalOpen(false);
    setName('');
    setDescription('');
    showNotification('Novo serviço adicionado com sucesso!', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
            Serviços & Preços
          </h2>
          <p className="text-xs text-zinc-400">
            Configure os serviços oferecidos pela barbearia e escolha quais aparecem na Mini Central online.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Novo Serviço</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {services.map((srv) => {
          const isActive = srv.isActive !== false;
          return (
            <div
              key={srv.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isActive
                  ? 'bg-zinc-950 border-zinc-800'
                  : 'bg-zinc-950/50 border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-black text-sm sm:text-base text-white">
                      {srv.name}
                    </h4>
                    {srv.isPopular && (
                      <span className="bg-[#f8c105] text-black text-[9px] font-black uppercase px-1.5 py-0.2 rounded-sm inline-flex items-center gap-0.5">
                        <Sparkles size={9} /> Destaque
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{srv.description}</p>
                  <span className="text-[11px] text-zinc-500 font-mono inline-block">
                    ⏱ Duração estimada: {srv.duration}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-lg text-[#f8c105] block">
                    R$ {srv.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  Status na Mini Central:{' '}
                  <strong className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                    {isActive ? 'ATIVO' : 'OCULTO'}
                  </strong>
                </span>

                <button
                  type="button"
                  onClick={() => toggleActive(srv.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                      : 'bg-[#f8c105]/20 border-[#f8c105]/40 text-[#f8c105]'
                  }`}
                >
                  {isActive ? 'Ocultar da Mini Central' : 'Ativar na Mini Central'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-display font-black text-sm uppercase text-white">Adicionar Serviço</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Nome do Serviço:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Corte na Tesoura Especial"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Preço (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105] font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Duração:</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="35 min"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Descrição:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição dos diferenciais do serviço..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-900 text-zinc-400 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#f8c105] text-black font-black uppercase tracking-wider"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
