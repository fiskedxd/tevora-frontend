import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const reasonLabels = { harassment: 'Harcèlement', threats: 'Menaces', impersonation: 'Usurpation d’identité', spam: 'Spam', scam: 'Arnaque', dangerous: 'Contenu dangereux', hate: 'Discours haineux', abuse: 'Comportement abusif', other: 'Autre' };

export default function ModerationReviewPage() {
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { fetch(`${API_URL}/api/social/moderation/reports/${reportId}/review?token=${encodeURIComponent(searchParams.get('token') || '')}`, { headers: getAuthHeaders() }).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.message); setData(result); }).catch((requestError) => setError(requestError.message || 'Lien invalide.')); }, [getAuthHeaders, reportId, searchParams]);
  if (error) return <main className="flex min-h-screen items-center justify-center bg-[#08080b] p-6 text-center text-white"><div><ShieldAlert className="mx-auto text-rose-200/70" /><p className="mt-4 text-rose-200">{error}</p><button type="button" onClick={() => navigate('/moderation')} className="mt-5 text-sm text-cyan-100">Retour à la modération</button></div></main>;
  if (!data) return <main className="flex min-h-screen items-center justify-center bg-[#08080b] text-sm text-white/50">Chargement du dossier...</main>;
  const target = data.report.targetId;
  return <main className="min-h-screen bg-[#08080b] px-4 py-8 text-white sm:px-8"><div className="mx-auto max-w-3xl"><Link to="/moderation" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"><ArrowLeft size={16} /> Modération</Link><section className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.03] p-5 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.25em] text-rose-200/70">Fiche de vérification</p><h1 className="mt-2 text-2xl font-semibold">@{target.username}</h1><p className="mt-1 text-sm text-white/45">{target.displayName} · créé le {new Date(target.createdAt).toLocaleDateString('fr-FR')}</p></div>{target.isSuspect ? <span className="rounded bg-rose-950 px-2 py-1 text-[10px] uppercase tracking-[.14em] text-rose-200">Compte suspect</span> : null}</div><p className="mt-8 text-xs font-semibold uppercase tracking-[.2em] text-white/35">Signalements ({data.reports.length})</p><div className="mt-3 space-y-2">{data.reports.map((report) => <article key={report._id} className="rounded-lg border border-white/[.06] bg-black/20 p-3"><p className="text-sm text-white/80">{reasonLabels[report.reason] || report.reason}</p><p className="mt-1 text-xs text-white/40">Par @{report.reporterId?.username || 'utilisateur'} · {new Date(report.createdAt).toLocaleString('fr-FR')}</p>{report.details ? <p className="mt-2 text-sm text-white/55">{report.details}</p> : null}</article>)}</div><button type="button" onClick={() => navigate(`/profile/${target._id}`)} className="mt-6 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/10">Voir le compte comme aperçu public</button></section></div></main>;
}
