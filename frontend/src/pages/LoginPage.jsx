import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Connexion impossible.');
      }

      login(data.user, data.token);
      const redirect = new URLSearchParams(location.search).get('redirect');
      navigate(redirect || '/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] px-6 py-24 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Connexion</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Rejoins la conversation.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">
            Connecte-toi à Tavora pour accéder à tes espaces, gérer tes salons et reprendre la discussion là où tu l’avais laissée.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="font-semibold text-white">Pas encore membre ?</p>
            <p className="mt-2">Crée un compte en moins d’une minute, avec votre email, votre numéro, et une vérification simple.</p>
            <Link to="/register" className="mt-4 inline-flex rounded-full bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-500">
              Créer un compte
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#08080d] via-[#0b0b13] to-[#12121d] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/60">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Mot de passe</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                required
              />
            </div>

            {error && <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
