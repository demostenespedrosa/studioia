import React, { useEffect, useState, useRef } from 'react';
import { getUserImages, deleteImage, type GalleryImageRecord } from '@/services/galleryService';
import { BottomSheet } from '@/components/BottomSheet';

type GalleryImage = GalleryImageRecord & { url: string };

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const abortRef = useRef<AbortController | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getUserImages();
      setImages(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Carrega blobs das imagens (pois a rota exige header Authorization)
  useEffect(() => {
    if (!images.length) return;
    // Limpa anteriores
  Object.values(previews).forEach((url: string) => URL.revokeObjectURL(url));
    setPreviews({});
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    (async () => {
      const token = localStorage.getItem('auth_token');
      for (const img of images) {
        try {
          const res = await fetch(img.url, { headers: token ? { Authorization: `Bearer ${token}` } : {}, signal: ctrl.signal });
          if (!res.ok) throw new Error('Falha ao carregar imagem');
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setPreviews(prev => ({ ...prev, [img.id]: url }));
        } catch (e) {
          if (ctrl.signal.aborted) return;
          console.warn('Erro ao obter preview', img.filename, e);
        }
      }
    })();
    return () => {
      ctrl.abort();
  Object.values(previews).forEach((url: string) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir imagem?')) return;
    try { setBusy(true); await deleteImage(id); setImages(prev => prev.filter(i => i.id !== id)); if (selected?.id === id) setSelected(null); } catch (e) { alert('Falha ao excluir'); } finally { setBusy(false); }
  };

  const handleDownload = async (img: GalleryImage) => {
    try {
      setBusy(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(img.url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Falha ao baixar');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = img.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Não foi possível baixar a imagem.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="text-center text-slate-500">Carregando galeria...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!images.length) return <div className="text-center text-slate-500">Nenhuma imagem gerada ainda.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Suas Imagens</h2>
  <div className="grid grid-cols-2 gap-4 sm:gap-5 gallery-grid-fallback">
        {images.map(img => {
          const preview = previews[img.id];
          const created = new Date(img.created_at).toLocaleString();
          return (
            <button
              key={img.id}
              onClick={() => preview && setSelected(img)}
              aria-label={`Abrir imagem ${img.filename}`}
              className="group relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-2xl transition"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm ring-1 ring-slate-200 group-hover:shadow-md group-hover:ring-violet-200 transition-all gallery-card-fallback">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt={img.filename}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="absolute bottom-1 left-1 right-1 flex justify-between items-end px-2 pb-1 text-[9px] font-medium text-white/80 opacity-0 group-hover:opacity-100 transition">
                      <span className="truncate max-w-[70%] drop-shadow">{img.filename.replace(/\.png$/,'')}</span>
                      <span className="text-[8px] font-normal tracking-wide bg-black/40 px-1.5 py-0.5 rounded-md">{created.split(' ')[0]}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[10px] text-slate-400 animate-pulse">
                    <div className="h-5 w-5 rounded-full bg-slate-300/40" />
                    <span className="tracking-wide uppercase">Carregando</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <BottomSheet open={!!selected} onClose={() => !busy && setSelected(null)} title={selected?.filename}>
        {selected && (
          <div className="space-y-6">
            <div className="w-full aspect-square bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
              {previews[selected.id] ? (
                <img src={previews[selected.id]} alt={selected.filename} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Carregando imagem...</div>
              )}
            </div>
            <div className="flex gap-3">
              <button disabled={busy} onClick={() => handleDownload(selected)} className="flex-1 bg-violet-600 text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-60">{busy ? 'Processando...' : 'Baixar'}</button>
              <button disabled={busy} onClick={() => handleDelete(selected.id)} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-60">Excluir</button>
            </div>
            <button disabled={busy} onClick={() => setSelected(null)} className="w-full py-2 text-slate-500 text-xs hover:text-slate-700">Fechar</button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
