import React, { useEffect, useRef } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, children, title }) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Suporte simples a swipe down para fechar (mobile)
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || !open) return;
    let startY = 0; let currentY = 0; let dragging = false;
    const threshold = 80;
    function onTouchStart(e: TouchEvent) { startY = e.touches[0].clientY; dragging = true; el.style.transition = 'none'; }
    function onTouchMove(e: TouchEvent) { if (!dragging) return; currentY = e.touches[0].clientY - startY; if (currentY > 0) { el.style.transform = `translateY(${currentY}px)`; el.style.opacity = `${Math.max(0.4, 1 - currentY/500)}`; } }
    function onTouchEnd() { if (!dragging) return; el.style.transition = ''; if (currentY > threshold) { onClose(); } else { el.style.transform = ''; el.style.opacity = '1'; } dragging = false; }
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
        style={{ zIndex: 0 }}
      />
      {/* Sheet container */}
      <div
        ref={sheetRef}
        className="relative pointer-events-auto w-full bg-white rounded-t-3xl shadow-xl p-6 pt-4 max-h-[88vh] overflow-y-auto animate-[fadeUp_.35s_ease] z-10
        sm:max-w-lg sm:mx-auto sm:w-full sm:rounded-3xl sm:pb-8 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 touch-none" />
        {title && <h3 className="text-lg font-semibold mb-4 text-slate-800 text-center">{title}</h3>}
        {children}
      </div>
      <style>{`
        @keyframes fadeUp {0%{transform:translateY(30px);opacity:0}100%{transform:translateY(0);opacity:1}}
        @media (min-width:640px){
          /* Em telas maiores centralizamos verticalmente se desejar (opcional) */
        }
      `}</style>
    </div>
  );
};
