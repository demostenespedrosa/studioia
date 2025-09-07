import React from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

export const Layout: React.FC<{ children: React.ReactNode; userName?: string; onLogout?: () => void; }>= ({ children, userName, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 flex flex-col">
      <Header />
      <div className="hidden md:flex justify-end px-6 pt-4 gap-3">
        {userName && <span className="text-sm text-slate-600">Olá, {userName.split(' ')[0]}</span>}
        {onLogout && <button onClick={onLogout} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-md">Sair</button>}
      </div>
      <main className="w-full mx-auto px-4 pt-4 pb-4 md:py-12 max-w-5xl flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
