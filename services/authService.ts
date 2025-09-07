export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

const API_BASE = '/api/auth';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let msg = 'Erro de rede';
    try { const data = await res.json(); msg = data.error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function register(name: string, email: string, password: string): Promise<void> {
  await request(`${API_BASE}/register`, { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await request<{ token: string; user: AuthUser }>(`${API_BASE}/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem('auth_token', data.token);
  return data.user;
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await request<{ user: AuthUser }>(`${API_BASE}/me`);
    return data.user;
  } catch {
    return null;
  }
}
