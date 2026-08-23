import React from 'react';
import { Link } from 'react-router-dom';

export default function LegalPage({ title, intro, sections }) {
  return (
    <div className="min-h-screen bg-[#050508] px-6 py-24 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#08080d] via-[#0b0b13] to-[#12121d] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <Link to="/" className="text-sm text-indigo-300 transition hover:text-indigo-200">← Retour à l’accueil</Link>
        <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-8 text-white/60">{intro}</p>
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-white/60">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
