import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080b] px-6 text-white">
      <section className="w-full max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/60">Erreur 404</p>
        <h1 className="mt-4 text-5xl font-semibold">Page introuvable</h1>
        <p className="mt-4 text-sm leading-6 text-white/50">Cette adresse n’existe pas ou le contenu a été déplacé.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
            <ArrowLeft size={16} /> Retour
          </button>
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#091016] transition hover:bg-white">
            <Home size={16} /> Accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
