import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ServerBannerEditor from '../components/ServerBannerEditor';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-tavora.fly.dev');

export default function ServerStudioPage() {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [server, setServer] = useState(null);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(() => window.matchMedia?.('(max-width: 640px)').matches ?? false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/social/servers/${serverId}/summary`, { headers: getAuthHeaders() })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Impossible de charger le serveur.');
        if (!cancelled) setServer(data.server);
      })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); });
    return () => { cancelled = true; };
  }, [getAuthHeaders, serverId]);

  const saveBanner = async (bannerUrl) => {
    const response = await fetch(`${API_URL}/api/social/servers/${serverId}`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ bannerUrl }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Impossible de sauvegarder la bannière.');
    setServer((current) => ({ ...current, ...data.server }));
  };

  if (error) return <main className="flex min-h-screen items-center justify-center bg-[#070709] p-6 text-sm text-rose-200"><div><p>{error}</p><button type="button" onClick={() => navigate(`/server/${serverId}`)} className="mt-4 text-teal-200">Retour au serveur</button></div></main>;
  if (isMobile) return <main className="flex min-h-screen items-center justify-center bg-[#070709] p-6 text-center text-white"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200/70">Studio indisponible sur mobile</p><p className="mt-3 text-sm leading-6 text-white/50">L’éditeur de bannière nécessite un écran plus large.</p><button type="button" onClick={() => navigate(`/server/${serverId}`)} className="mt-6 rounded-lg bg-teal-300/15 px-4 py-2.5 text-sm text-teal-100 hover:bg-teal-300/25">Retour aux paramètres</button></div></main>;
  if (!server) return <main className="flex min-h-screen items-center justify-center bg-[#070709] text-white/50"><LoaderCircle className="animate-spin" size={20} /></main>;

  return <main className="min-h-screen bg-[#070709]"><div className="flex items-center gap-3 border-b border-white/10 bg-[#0d0d14] px-4 py-3 text-white"><button type="button" onClick={() => navigate(`/server/${serverId}`)} title="Retour aux paramètres du serveur" className="p-2 text-white/60 hover:bg-white/10"><ArrowLeft size={17} /></button><div><p className="text-[10px] uppercase tracking-[.25em] text-teal-300/70">Tavora Studio</p><h1 className="text-sm font-semibold">Bannière de {server.name}</h1></div></div><ServerBannerEditor standalone source={server.bannerUrl || ''} serverId={serverId} onClose={() => navigate(`/server/${serverId}`)} onSave={saveBanner} onExport={saveBanner} /></main>;
}
