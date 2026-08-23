import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WindowControls from '../components/WindowControls';

const HomePage = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const Icons = {
    chat: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    user: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    login: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
    menu: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    download: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z" />
        <path d="M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z" />
      </svg>
    ),
    play: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    check: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    mic: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
      </svg>
    ),
    message: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    video: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    headphones: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    gamepad: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="11" x2="10" y2="11" />
        <line x1="8" y1="9" x2="8" y2="13" />
        <line x1="15" y1="12" x2="15.01" y2="12" />
        <line x1="18" y1="10" x2="18.01" y2="10" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      </svg>
    ),
    zap: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    monitor: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    phone: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    console: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="6" cy="12" r="1" />
        <circle cx="18" cy="12" r="1" />
        <path d="M8 12h8" />
      </svg>
    ),
    star: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    arrowRight: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    shield: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    server: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    smile: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    music: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-hidden">
              <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/[0.06] bg-[#030303]/85 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-5">
                  <div className="absolute inset-0 overflow-hidden rounded-[28px] pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_40%)]" />
                  </div>
                  <div className="relative flex items-center gap-3">
                    <Link to="/" className="group flex items-center gap-3">
                      <div className="relative h-10 w-10">
                        <div className="absolute inset-0 rounded-2xl bg-white/[0.06] border border-white/[0.06] transition-all duration-300 group-hover:bg-white/[0.10] group-hover:border-white/[0.10]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="leading-none">
                        <div className="text-base font-semibold tracking-[0.02em] text-white/90">Tavora</div>
                        <div className="text-[10px] uppercase tracking-[0.34em] text-white/25">signal • play • connect</div>
                      </div>
                    </Link>
                  </div>

                  <nav className="relative hidden items-center gap-1 lg:flex">
                    {[
                      { label: 'Discover', path: '/discover' },
                      { label: 'Spaces', path: '/spaces' },
                      { label: 'Safety', path: '/safety' },
                      { label: 'Support', path: '/support' },
                    ].map((item) => (
                        <Link
                        key={item.path}
                          to={item.path}
                        className="group relative rounded-full px-4 py-2 text-sm text-white/40 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/80"
                      >
                        <span>{item.label}</span>
                        <span className="absolute bottom-1 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-white/40 transition-all duration-300 group-hover:w-[60%]" />
                        </Link>
                    ))}
                  </nav>

                  <div className="relative flex items-center gap-3">
                    {user ? (
                        <Link
                        to={user?.id ? `/${user.id}/home` : '/home'}
                        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-white/80 transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.08] hover:text-white hover:border-white/[0.14]"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Ouvrir Tavora
                      </Link>
                    ) : (
                      <Link to="/register" className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-white/55 transition hover:bg-white/[0.05] hover:text-white sm:inline-flex">
                        {Icons.user}
                        Inscription
                      </Link>
                    )}
                    {!user ? <Link to="/login" className="hidden items-center gap-2 rounded-full border border-white/[0.10] bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 sm:inline-flex">{Icons.login} Connexion</Link> : null}
                    <button
                      onClick={() => setMobileMenuOpen((prev) => !prev)}
                      className="rounded-full border border-white/[0.06] bg-white/[0.02] p-2.5 text-white/50 transition hover:bg-white/[0.06] hover:text-white/80 lg:hidden"
                      aria-label="Toggle menu"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </button>
                    <WindowControls />
                  </div>
                </div>

                {mobileMenuOpen && (
                  <div className="mx-auto mt-3 max-w-7xl rounded-[24px] border border-white/[0.06] bg-[#030303]/95 px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:hidden">
                    <div className="flex flex-col gap-1">
                      {[
                        { label: 'Discover', path: '/discover' },
                        { label: 'Spaces', path: '/spaces' },
                        { label: 'Safety', path: '/safety' },
                        { label: 'Support', path: '/support' },
                      ].map((item) => (
                        <Link
                          key={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          to={item.path}
                          className="rounded-2xl px-4 py-2.5 text-left text-sm text-white/40 transition hover:bg-white/[0.04] hover:text-white/80"
                        >
                          {item.label}
                        </Link>
                      ))}
                      {user ? (
                        <Link
                          to="/profile"
                          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80"
                        >
                          Ouvrir Tavora
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.10] bg-white px-5 py-2.5 text-sm font-medium text-black"
                        >
                          Connexion
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </header>
      <section id="discover" className="relative pt-40 pb-36 px-6 sm:pt-48 md:pt-52 scroll-mt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-r from-indigo-500/[0.08] to-purple-500/[0.08] blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-40 right-[15%] w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-30" />
        <div className="absolute top-56 left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-20" />
        <div className="absolute bottom-40 right-[20%] w-4 h-4 bg-indigo-300/20 rounded-full animate-bounce opacity-10" />
        <div className="absolute top-1/3 left-[25%] w-1.5 h-1.5 bg-white/10 rounded-full animate-ping" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-extrabold leading-none tracking-tight mb-8">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Group chat</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">that's all fun</span>
            <br />
            <span className="bg-gradient-to-r from-white/50 to-white/20 bg-clip-text text-transparent">& games</span>
          </h1>

          <p className="text-lg text-white/30 max-w-xl mx-auto leading-relaxed font-light">
            Tavora is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
            <Link to="/register" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-semibold text-base hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-white/5">{Icons.user} Créer mon compte</Link>
            <Link to="/login" className="relative inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-base hover:bg-indigo-500 transition-all duration-300 hover:scale-105 active:scale-95">{Icons.login} Me connecter</Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-white/15">
            {Icons.check}
            No credit card required
          </div>
        </div>
      </section>

      <section id="spaces" className="py-36 px-6 relative scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="relative bg-[#08080d] rounded-3xl border border-white/[0.04] p-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/[0.04] blur-2xl rounded-full" />
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0">A</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-indigo-300">Alex</span>
                        <span className="text-[10px] text-white/15">Today at 2:30 PM</span>
                      </div>
                      <div className="text-sm text-white/50">Ready for tonight? The server is up</div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-xs text-white/40">
                          {Icons.star}
                          <span>Hype</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-xs text-white/40">
                          {Icons.zap}
                          <span>Let's go</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0">S</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-purple-300">Sarah</span>
                        <span className="text-[10px] text-white/15">Today at 2:31 PM</span>
                      </div>
                      <div className="text-sm text-white/50">I'm bringing the new loadout</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    {Icons.mic}
                    Soundboard active
                    <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4 block">Discover</span>
              <h2 className="text-5xl font-bold leading-tight mb-6">Build spaces that feel made for your crew</h2>
              <p className="text-white/30 text-lg leading-relaxed font-light">
                Discover new ways to personalize your rooms with stickers, custom status, soundboards, and playful energy that makes every conversation feel alive.
              </p>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-xs text-white/25">
                  <div className="w-8 h-8 bg-white/[0.03] rounded-xl flex items-center justify-center">{Icons.smile}</div>
                  Stickers
                </div>
                <div className="flex items-center gap-2 text-xs text-white/25">
                  <div className="w-8 h-8 bg-white/[0.03] rounded-xl flex items-center justify-center">{Icons.music}</div>
                  Soundboard
                </div>
                <div className="flex items-center gap-2 text-xs text-white/25">
                  <div className="w-8 h-8 bg-white/[0.03] rounded-xl flex items-center justify-center">{Icons.message}</div>
                  Custom status
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="safety" className="py-36 px-6 relative scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4 block">Spaces</span>
              <h2 className="text-5xl font-bold leading-tight mb-6">Create rooms for every kind of hangout</h2>
              <p className="text-white/30 text-lg leading-relaxed font-light">
                From casual games to study sessions and late-night chillouts, your spaces can adapt to the vibe, the people, and the moment.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  {Icons.video}
                  <div>
                    <div className="text-xs text-white/60 font-medium">1080p 60fps</div>
                    <div className="text-[10px] text-white/20">Crystal clear</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  {Icons.zap}
                  <div>
                    <div className="text-xs text-white/60 font-medium">Ultra low latency</div>
                    <div className="text-[10px] text-white/20">No delay</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative bg-[#08080d] rounded-3xl border border-white/[0.04] p-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/[0.04] blur-2xl rounded-full" />
                <div className="aspect-video bg-gradient-to-br from-[#0a0a14] to-[#060610] rounded-2xl flex items-center justify-center border border-white/[0.04]">
                  <div className="w-20 h-20 bg-white/[0.04] rounded-full flex items-center justify-center hover:bg-white/[0.08] transition-all duration-300 hover:scale-110 cursor-pointer group">
                    <div className="text-white/60 group-hover:text-white transition-colors">{Icons.play}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-36 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="relative bg-[#08080d] rounded-3xl border border-white/[0.04] p-10 overflow-hidden">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/[0.04] blur-2xl rounded-full" />
                <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                    {Icons.headphones}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80">Voice Connected</div>
                    <div className="text-xs text-white/25 mt-0.5">3 friends in channel</div>
                  </div>
                  <div className="ml-auto flex -space-x-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full border-2 border-[#08080d] flex items-center justify-center text-[10px] font-bold">A</div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-[#08080d] flex items-center justify-center text-[10px] font-bold">S</div>
                    <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-[#08080d] flex items-center justify-center text-[10px] font-bold">M</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4 block">Safety</span>
              <h2 className="text-5xl font-bold leading-tight mb-6">Stay protected while your crew gathers</h2>
              <p className="text-white/30 text-lg leading-relaxed font-light">
                Keep voice and text channels secure with privacy-first controls, calm moderation tools, and a smoother way to manage who joins the room.
              </p>
              <div className="mt-8 flex items-center gap-3 text-xs text-white/25">
                {Icons.shield}
                End-to-end encrypted voice channels
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-36 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4 block">Activities</span>
              <h2 className="text-5xl font-bold leading-tight mb-6">Always have something to do together</h2>
              <p className="text-white/30 text-lg leading-relaxed font-light">
                Watch videos, play built-in games, listen to music, or just scroll together. Seamlessly text, call, video chat, and play games, all in one group chat.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Icons.gamepad, label: 'Games', color: 'from-indigo-400 to-purple-500' },
                  { icon: Icons.video, label: 'Watch', color: 'from-purple-400 to-pink-500' },
                  { icon: Icons.music, label: 'Listen', color: 'from-pink-400 to-red-500' },
                  { icon: Icons.zap, label: 'Play', color: 'from-amber-400 to-orange-500' },
                  { icon: Icons.message, label: 'Chat', color: 'from-green-400 to-emerald-500' },
                  { icon: Icons.server, label: 'Hang out', color: 'from-cyan-400 to-blue-500' },
                ].map((item, i) => (
                  <div key={i} className="aspect-square bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/[0.04] transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <div className="text-white/30 group-hover:text-white/60 transition-colors">{item.icon}</div>
                    <span className="text-[10px] text-white/20 group-hover:text-white/40 transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-12 text-2xl font-bold tracking-wider animate-scroll">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-4">talk</span>
              <span className="mx-4 opacity-40">•</span>
              <span className="mx-4">play</span>
              <span className="mx-4 opacity-40">•</span>
              <span className="mx-4">chat</span>
              <span className="mx-4 opacity-40">•</span>
              <span className="mx-4">hang out</span>
              <span className="mx-4 opacity-40">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <section className="py-36 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4 block">Platforms</span>
              <h2 className="text-5xl font-bold leading-tight mb-6">Wherever you game, hang out here</h2>
              <p className="text-white/30 text-lg leading-relaxed font-light">
                On your PC, phone, or console, you can still hang out on Tavora. Easily switch between devices and use tools to manage multiple group chats with friends.
              </p>
            </div>
            <div className="flex justify-center gap-6">
              {[
                { icon: Icons.monitor, label: 'Desktop' },
                { icon: Icons.phone, label: 'Mobile' },
                { icon: Icons.console, label: 'Console' },
              ].map((device, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center justify-center text-white/30 hover:bg-white/[0.04] hover:text-white/60 transition-all duration-300 hover:scale-110">
                    {device.icon}
                  </div>
                  <span className="text-[10px] text-white/20">{device.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="py-44 px-6 relative bg-[#060608] scroll-mt-28">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4 block">Support</span>
          <h2 className="text-6xl font-extrabold leading-tight mb-8">
            <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              Need a hand?
              <br />
              We’re here for the vibe
              <br />
              and the fixes.
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/30">
            From onboarding help to account questions, our support flow is built to stay quick, clear, and friendly whenever you need it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-500 transition-all duration-300 hover:scale-105 active:scale-95">
              {Icons.download}
              Get help now
            </a>
            <a href="#" className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white/70 font-semibold text-lg hover:bg-white/[0.06] transition-all duration-300">
              {Icons.chat}
              Contact support
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#050508] border-t border-white/[0.04] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">{Icons.chat}</div>
                <span className="font-bold text-sm">Tavora</span>
              </Link>
              <div className="flex gap-3">
                {[Icons.star, Icons.star, Icons.star, Icons.star, Icons.star].map((icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 bg-white/[0.03] rounded-lg flex items-center justify-center text-white/20 hover:bg-white/[0.06] hover:text-white/50 transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Musiques', 'Playlists', 'Status', 'App Directory'] },
              { title: 'Company', links: ['About', 'Jobs', 'Brand', 'Newsroom'] },
              { title: 'Resources', links: ['Support', 'Safety', 'Blog', 'Developers'] },
              { title: 'Policies', links: ['Terms', 'Privacy', 'Guidelines', 'Licenses'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-indigo-400 text-xs font-semibold mb-4 tracking-wider uppercase">{col.title}</h4>
                <div className="flex flex-col gap-3 text-sm text-white/30">
                  {col.links.map((link, j) => (
                    <a key={j} href="#" className="hover:text-white/60 transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes nav-bounce {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          45% { transform: translateY(5px) scale(0.99); opacity: 0.95; }
          70% { transform: translateY(-2px) scale(1.005); opacity: 1; }
          100% { transform: translateY(-10px) scale(0.97); opacity: 0.7; }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;