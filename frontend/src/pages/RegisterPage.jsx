import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-tavora.fly.dev');

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Inscription impossible.');
      }

      login(data.user, data.token);
      navigate('/home');
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
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Inscription</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Crée ton espace Tavora.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">
            Ouvre un compte avec ton email et ton numéro pour rejoindre des salons, partager des moments et garder un accès sécurisé à tout ce que tu aimes.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="font-semibold text-white">Déjà membre ?</p>
            <p className="mt-2">Tu peux te connecter immédiatement pour reprendre les salons et paramètres que tu as déjà ouverts.</p>
            <Link to="/login" className="mt-4 inline-flex rounded-full bg-white/10 px-5 py-2.5 font-semibold text-white transition hover:bg-white/20">
              Se connecter
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#08080d] via-[#0b0b13] to-[#12121d] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/60">Nom d’utilisateur</label>
              <input name="username" value={formData.username} onChange={handleChange} placeholder="jeandupont" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Nom affiché</label>
              <input name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Jean Dupont" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="vous@exemple.com" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Téléphone</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+33 6 00 00 00 00" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Mot de passe</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Au moins 8 caractères" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Confirmer le mot de passe</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400" required />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <input name="acceptTerms" type="checkbox" checked={formData.acceptTerms} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" required />
              <span>
                J’accepte les <Link to="/terms" className="text-indigo-300 underline">conditions d’utilisation</Link> et la <Link to="/privacy-policy" className="text-indigo-300 underline">politique de confidentialité</Link>.
              </span>
            </label>

            {error && <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? 'Création du compte…' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
