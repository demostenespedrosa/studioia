import React from 'react';
import { NavLink } from 'react-router-dom';

interface IconProps { className?: string; }
const StudioIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const GalleryIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
);
const AccountIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>
);

export const BottomNav: React.FC = () => {
  const base = 'flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium';
  const active = 'text-violet-600';
  const inactive = 'text-slate-500';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-sm flex md:hidden z-40">
      <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}> <StudioIcon className="h-6 w-6"/> Estúdio</NavLink>
      <NavLink to="/galeria" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}> <GalleryIcon className="h-6 w-6"/> Galeria</NavLink>
      <NavLink to="/conta" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}> <AccountIcon className="h-6 w-6"/> Conta</NavLink>
    </nav>
  );
};
