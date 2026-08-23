import { ArrowLeft, MessageCircle, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileBadges from '../components/ProfileBadges';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, getAuthHeaders } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/social/profile/${encodeURIComponent(userId || 'me')}`, { headers: getAuthHeaders(), signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Profil introuvable.');
        setProfile(data.user);
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Profil introuvable.');
      });
    return () => controller.abort();
  }, [getAuthHeaders, userId]);

  if (error) return <main className="flex min-h-screen items-center justify-center bg-[#08080b] p-6 text-center text-white"><div><p className="text-rose-200">{error}</p><Link to="/home" className="mt-4 inline-block text-sm text-cyan-200">Retour à l’accueil</Link></div></main>;
  if (!profile) return <main className="flex min-h-screen items-center justify-center bg-[#08080b] text-sm text-white/50">Chargement du profil...</main>;

  const isOwnProfile = String(profile.id || profile._id) === String(user?._id || user?.id) || userId === 'me';
  return (
    <main className="min-h-screen bg-[#08080b] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"><ArrowLeft size={16} /> Retour</button>
          <Link to="/home" className="text-sm font-semibold text-white/80">Tavora</Link>
        </div>
        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#111118]">
          <div className="h-40 bg-gradient-to-br from-cyan-300/20 via-fuchsia-300/10 to-transparent" style={profile.bannerUrl ? { backgroundImage: `url(${profile.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex items-end justify-between gap-4">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt={`Avatar de ${profile.displayName || profile.username}`} className="h-24 w-24 rounded-full border-4 border-[#111118] object-cover" /> : <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#111118] bg-cyan-200/10 text-white/50"><User size={32} /></div>}
              {!isOwnProfile ? <button type="button" onClick={() => navigate(`/dm/${profile.id || profile._id}`)} className="inline-flex items-center gap-2 rounded-lg bg-cyan-200/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-200/20"><MessageCircle size={14} /> Message</button> : null}
            </div>
            <h1 className="mt-5 inline-flex items-center gap-2 text-2xl font-semibold">{profile.displayName || profile.username}<ProfileBadges badges={profile.badges} /></h1>
            <p className="mt-1 text-sm text-white/40">@{profile.username}</p>
            {profile.isSuspect ? <p title="Ce compte fait actuellement l’objet d’une vérification suite à plusieurs signalements." className="mt-2 inline-block rounded bg-rose-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-200">Compte suspect</p> : null}
            {!profile.isOfficial ? <p className="mt-6 max-w-2xl text-sm leading-6 text-white/65">{profile.bio || 'Aucune bio pour le moment.'}</p> : null}
            {profile.isOfficial ? <p className="mt-6 text-sm text-cyan-100/70">Compte officiel de Tevora · Membre depuis toujours</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
