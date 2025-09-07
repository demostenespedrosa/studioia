export interface GalleryImageRecord { id: number; filename: string; created_at: string; }

const API = '/api/images';

function authHeaders() {
  const t = localStorage.getItem('auth_token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = 'Erro';
    try { const j = await res.json(); msg = j.error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function saveGeneratedImages(base64List: string[]): Promise<void> {
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ images: base64List }) });
  await handle(res);
}

export async function getUserImages(): Promise<Array<GalleryImageRecord & { url: string }>> {
  const res = await fetch(API, { headers: { ...authHeaders() } });
  return handle(res);
}

export async function deleteImage(id: number): Promise<void> {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  await handle(res);
}
