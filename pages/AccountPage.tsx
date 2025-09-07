import React from 'react';

interface AccountPageProps { user: { id: number; name: string; email: string } | null; onLogout: () => void; }

export const AccountPage: React.FC<AccountPageProps> = ({ user, onLogout }) => {
  const first = user?.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="space-y-10">
      {/* Header / Perfil */}
      <section className="relative">
        <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 text-white rounded-3xl p-6 pt-7 shadow-lg overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shadow-inner ring-1 ring-white/30">
              {first}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold leading-tight truncate">{user?.name}</h1>
              <p className="text-white/80 text-sm truncate">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-xs bg-white/15 hover:bg-white/25 active:bg-white/30 transition-colors px-3 py-1.5 rounded-md font-medium backdrop-blur ring-1 ring-white/30"
            >Sair</button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
              <p className="text-xs uppercase tracking-wide text-white/70">Plano</p>
              <p className="font-semibold mt-1">Gratuito</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
              <p className="text-xs uppercase tracking-wide text-white/70">Uso</p>
              <p className="font-semibold mt-1">-- / 50</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
              <p className="text-xs uppercase tracking-wide text-white/70">Renova</p>
              <p className="font-semibold mt-1">30d</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plano & Upgrade */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-wide text-slate-700">Plano & Upgrade</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-semibold text-sm">P</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">Plano Gratuito</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">Gere até 50 imagens por mês. Ideal para explorar e validar seu produto.</p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl text-sm font-semibold shadow hover:brightness-110 active:scale-[.98] transition disabled:opacity-60" disabled>
            Ver planos avançados (em breve)
          </button>
        </div>
      </section>

      {/* Configurações */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-wide text-slate-700">Configurações</h2>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y overflow-hidden shadow-sm">
          <button disabled className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 disabled:cursor-not-allowed">
            <span className="text-sm font-medium text-slate-700">Alterar senha</span>
            <span className="text-xs text-slate-400">Em breve</span>
          </button>
          <button disabled className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 disabled:cursor-not-allowed">
            <span className="text-sm font-medium text-slate-700">Preferências de IA</span>
            <span className="text-xs text-slate-400">Em breve</span>
          </button>
          <button disabled className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 disabled:cursor-not-allowed">
            <span className="text-sm font-medium text-slate-700">Notificações</span>
            <span className="text-xs text-slate-400">Em breve</span>
          </button>
        </div>
      </section>

      {/* Sessão / Ações */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-wide text-slate-700">Sessão</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3">
          <button
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 rounded-xl text-sm font-semibold shadow-sm transition"
          >Sair da conta</button>
          <p className="text-[11px] text-slate-400 tracking-wide text-center">Encerrar sessão apenas neste dispositivo.</p>
        </div>
      </section>
    </div>
  );
};
