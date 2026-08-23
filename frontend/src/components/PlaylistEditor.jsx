import { useState } from 'react';
import { ImagePlus, Save, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const authHeaders = (getAuthHeaders) => { const headers = getAuthHeaders?.() || {}; delete headers['Content-Type']; return headers; };

export default function PlaylistEditor({ open, playlist, tracks, getAuthHeaders, onClose, onSaved }) {
  const [title, setTitle] = useState(playlist?.title || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [selectedTracks, setSelectedTracks] = useState(playlist?.tracks || []);
  const [cover, setCover] = useState(null);
  const [banner, setBanner] = useState(null);
  const [coverPreview, setCoverPreview] = useState(playlist?.cover || '');
  const [bannerPreview, setBannerPreview] = useState(playlist?.banner || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;
  const chooseImage = (file, setter, previewSetter) => { if (!file) return; setter(file); previewSetter(URL.createObjectURL(file)); };
  const toggleTrack = (filename) => setSelectedTracks((current) => current.includes(filename) ? current.filter((item) => item !== filename) : [...current, filename]);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    const data = new FormData(); data.append('title', title); data.append('description', description); selectedTracks.forEach((filename) => data.append('tracks', filename)); if (cover) data.append('cover', cover); if (banner) data.append('banner', banner);
    try {
      const response = await fetch(`${API_URL}/api/music/playlists${playlist?.id ? `/${playlist.id}` : ''}`, { method: playlist?.id ? 'PATCH' : 'POST', headers: authHeaders(getAuthHeaders), body: data });
      const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Enregistrement impossible.'); onSaved?.(result.playlist); onClose();
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  };
  return <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/65 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}><form onSubmit={submit} className="mt-4 w-full max-w-lg rounded-2xl border border-white/10 bg-[#111118] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-200/60">Playlist publique</p><h2 className="mt-1 text-lg font-semibold text-white">{playlist ? 'Modifier la playlist' : 'Créer une playlist'}</h2></div><button type="button" title="Fermer" onClick={onClose} className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"><X size={17} /></button></div><input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titre de la playlist" className="mt-5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-200/50" /><textarea maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="mt-2 min-h-20 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-200/50" /><div className="mt-4 grid grid-cols-2 gap-3"><label className="cursor-pointer rounded-xl border border-dashed border-white/15 p-3 text-center hover:border-cyan-200/50"><span className="block text-xs text-white/55"><ImagePlus size={15} className="mr-1 inline" />Pochette / PDP</span>{coverPreview ? <img src={coverPreview} alt="Aperçu de la pochette" className="mx-auto mt-2 h-20 w-20 rounded-xl object-cover" /> : <span className="mt-3 block text-[11px] text-white/30">Ajouter une image</span>}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => chooseImage(event.target.files?.[0], setCover, setCoverPreview)} /></label><label className="cursor-pointer rounded-xl border border-dashed border-white/15 p-3 text-center hover:border-cyan-200/50"><span className="block text-xs text-white/55"><ImagePlus size={15} className="mr-1 inline" />Bannière</span>{bannerPreview ? <img src={bannerPreview} alt="Aperçu de la bannière" className="mt-2 h-20 w-full rounded-xl object-cover" /> : <span className="mt-3 block text-[11px] text-white/30">Ajouter une image</span>}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => chooseImage(event.target.files?.[0], setBanner, setBannerPreview)} /></label></div><div className="mt-4"><p className="mb-2 text-xs font-semibold text-white/60">Musiques ({selectedTracks.length})</p><div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-white/10 p-2">{tracks.map((track) => <label key={track.filename} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-white/70 hover:bg-white/8"><input type="checkbox" checked={selectedTracks.includes(track.filename)} onChange={() => toggleTrack(track.filename)} className="accent-cyan-200" />{track.title || track.filename}</label>)}{!tracks.length ? <p className="p-3 text-center text-xs text-white/35">Aucune musique disponible.</p> : null}</div></div>{error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}<div className="mt-5 flex justify-end gap-2"><button type="button" disabled={busy} onClick={onClose} className="rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/8">Annuler</button><button disabled={busy} className="rounded-lg bg-cyan-200 px-3 py-2 text-xs font-semibold text-[#091016] hover:bg-white"><Save size={14} className="mr-1 inline" />{busy ? 'Enregistrement...' : 'Enregistrer'}</button></div></form></div>;
}
