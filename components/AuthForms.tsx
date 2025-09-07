import React, { useState } from 'react';
import { login, register } from '../services/authService';

interface AuthFormsProps {
  onAuthenticated: () => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password);
      }
      await login(form.email, form.password);
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2 text-center">
        {mode === 'login' ? 'Entrar' : 'Criar Conta'}
      </h2>
      <p className="text-slate-500 text-center mb-6">
        {mode === 'login' ? 'Acesse sua conta para gerar fotos.' : 'Cadastre-se para começar a usar a plataforma.'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input name="name" required disabled={loading} value={form.name} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" name="email" required disabled={loading} value={form.email} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
          <input type="password" name="password" required disabled={loading} value={form.password} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white font-semibold py-3 rounded-lg hover:bg-violet-700 transition disabled:opacity-60">
          {loading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Registrar e Entrar')}
        </button>
      </form>
      <div className="text-center mt-6 text-sm text-slate-500">
        {mode === 'login' ? (
          <button onClick={() => setMode('register')} className="text-violet-600 hover:underline">Não tem conta? Cadastre-se</button>
        ) : (
          <button onClick={() => setMode('login')} className="text-violet-600 hover:underline">Já tem conta? Entrar</button>
        )}
      </div>
    </div>
  );
};
