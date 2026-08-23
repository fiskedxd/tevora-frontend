import React from 'react';
import { Link } from 'react-router-dom';

export default function SectionPage({ eyebrow, title, description, highlights, primaryCta, secondaryCta }) {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24 sm:px-8 lg:px-10">
        <div className="mb-10 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-indigo-300">
          {eyebrow}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">{description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta && (
                <Link
                  to={primaryCta.to}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  to={secondaryCta.to}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-950/70 via-[#08080d] to-purple-950/60 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <h2 className="text-xl font-semibold text-white">What you’ll find</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
