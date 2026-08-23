import { ListMusic, Music2, Play, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GlobalTopBar from '../components/GlobalTopBar';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const titleFor = (track) => track.title || track.filename?.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Musique';

export default function MusicLibraryPage({ mode = 'music' }) {
  const { getAuthHeaders, user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetch(`${API_URL}/api/music/tracks`), fetch(`${API_URL}/api/music/playlists`)]).then(async ([trackResponse, playlistResponse]) => {
      const trackData = await trackResponse.json();
      const playlistData = await playlistResponse.json();
      if (!trackResponse.ok) throw new Error(trackData.message || 'Bibliothèque indisponible.');
      setTracks(trackData.tracks || []);
      setPlaylists(playlistData.playlists || []);
    }).catch((requestError) => setError(requestError.message || 'Bibliothèque indisponible.')).finally(() => setLoading(false));
  }, []);

  const filteredTracks = tracks.filter((track) => titleFor(track).toLowerCase().includes(query.toLowerCase()));
  const playTrack = (track) => window.dispatchEvent(new CustomEvent('tavora:play-track', { detail: track }));

  return (
    <div className="min-h-screen bg-[#08080b] text-white">
      {user ? <GlobalTopBar getAuthHeaders={getAuthHeaders} user={user} userId={user._id || user.id} /> : null}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/60">Tavora Music</p><h1 className="mt-2 text-3xl font-semibold">{mode === 'playlists' ? 'Playlists' : 'Musiques'}</h1><p className="mt-2 text-sm text-white/45">Une bibliothèque reliée au lecteur et partageable par URL.</p></div>
          <nav className="flex gap-1 rounded-lg border border-white/10 bg-white/[.03] p-1" aria-label="Navigation musicale">
            <NavLink to="/music" className={({ isActive }) => `rounded-md px-3 py-2 text-xs ${isActive ? 'bg-cyan-200/15 text-cyan-100' : 'text-white/45 hover:text-white'}`}>Musiques</NavLink>
            <NavLink to="/playlists" className={({ isActive }) => `rounded-md px-3 py-2 text-xs ${isActive ? 'bg-cyan-200/15 text-cyan-100' : 'text-white/45 hover:text-white'}`}>Playlists</NavLink>
          </nav>
        </div>
        {mode === 'music' ? <section className="mt-8"><label className="flex max-w-lg items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white/40"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une musique" className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/30" /></label><div className="mt-4 grid gap-2">{loading ? <p className="py-12 text-center text-sm text-white/40">Chargement des musiques...</p> : error ? <p className="py-12 text-center text-sm text-rose-200">{error}</p> : filteredTracks.map((track) => <button key={track.filename} type="button" onClick={() => playTrack(track)} className="flex items-center gap-3 rounded-xl border border-white/[.06] bg-white/[.025] p-3 text-left transition hover:bg-white/[.07]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-200/10 text-cyan-100"><Music2 size={17} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-white/85">{titleFor(track)}</strong><small className="text-xs text-white/35">{track.artist || 'Artiste inconnu'}</small></span><Play size={16} className="text-white/40" /></button>)}{!loading && !error && !filteredTracks.length ? <p className="py-12 text-center text-sm text-white/40">Aucune musique trouvée.</p> : null}</div></section> : <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{loading ? <p className="py-12 text-sm text-white/40">Chargement des playlists...</p> : error ? <p className="py-12 text-sm text-rose-200">{error}</p> : playlists.map((playlist) => <Link key={playlist._id || playlist.id} to={`/playlist/${playlist._id || playlist.id}`} className="group rounded-2xl border border-white/[.07] bg-white/[.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[.07]"><div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-300/20 to-fuchsia-300/10">{playlist.cover ? <img src={playlist.cover} alt="" className="h-full w-full object-cover" /> : <ListMusic size={30} className="text-cyan-100/70" />}</div><h2 className="mt-4 truncate font-semibold text-white/85">{playlist.title}</h2><p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">{playlist.description || 'Playlist publique Tavora.'}</p></Link>)}</section>}
      </main>
    </div>
  );
}
