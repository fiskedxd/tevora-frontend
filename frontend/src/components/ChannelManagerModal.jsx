import { useEffect, useState } from 'react';
import { Hash, Volume2, X } from 'lucide-react';

const permissionOptions = [
  ['VIEW_CHANNELS', 'Voir le salon'],
  ['SEND_MESSAGES', 'Ecrire dans le salon'],
  ['READ_MESSAGE_HISTORY', 'Lire l’historique'],
  ['CONNECT', 'Se connecter en vocal'],
  ['SPEAK', 'Parler en vocal'],
];

export default function ChannelManagerModal({ open, mode = 'create', channel, categories = [], defaultCategoryId, onClose, onSubmit, onDelete, busy = false, error = '' }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!open) return;
    setName(channel?.name || '');
    setType(channel?.type === 'voice' ? 'voice' : 'text');
    setDescription(channel?.description || '');
    setCategoryId(channel?.categoryId || defaultCategoryId || categories[0]?.id || '');
    setPermissions(Array.isArray(channel?.permissions) ? channel.permissions : []);
  }, [channel, categories, defaultCategoryId, open]);

  if (!open) return null;
  const togglePermission = (permission) => setPermissions((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]);
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || busy) return;
    onSubmit({ name: name.trim(), type, description: description.trim(), categoryId, permissions });
  };

  if (mode === 'category') return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form onSubmit={submit} className="w-full max-w-md rounded-xl border border-white/10 bg-[#111118] p-5 text-white shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Créer une catégorie</h2><button type="button" onClick={onClose} aria-label="Fermer"><X size={17} /></button></div><label className="mt-5 block text-xs text-white/55">Nom de la catégorie<input autoFocus value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none" placeholder="Informations" /></label>{error ? <p className="mt-3 text-xs text-rose-200">{error}</p> : null}<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60">Annuler</button><button type="submit" disabled={busy || !name.trim()} className="rounded-lg bg-cyan-200/15 px-4 py-2 text-sm text-cyan-100 disabled:opacity-40">Créer</button></div></form></div>;

  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <form onSubmit={submit} className="w-full max-w-lg rounded-xl border border-white/10 bg-[#111118] p-5 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4"><div><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/60">Gestion des salons</p><h2 className="mt-1 text-lg font-semibold">{mode === 'edit' ? 'Modifier le salon' : 'Créer un salon'}</h2></div><button type="button" onClick={onClose} aria-label="Fermer" className="rounded-lg p-2 text-white/45 hover:bg-white/10 hover:text-white"><X size={17} /></button></div>
      <label className="mt-5 block text-xs text-white/55">Nom du salon<input autoFocus value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-200/40" placeholder="annonces" /></label>
      <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setType('text')} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${type === 'text' ? 'border-cyan-200/40 bg-cyan-200/10 text-cyan-100' : 'border-white/10 text-white/50'}`}><Hash size={15} />Textuel</button><button type="button" onClick={() => setType('voice')} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${type === 'voice' ? 'border-cyan-200/40 bg-cyan-200/10 text-cyan-100' : 'border-white/10 text-white/50'}`}><Volume2 size={15} />Vocal</button></div>
      <label className="mt-4 block text-xs text-white/55">Catégorie<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none"><option value="">Première catégorie</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label className="mt-4 block text-xs text-white/55">Description facultative<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none" /></label>
      <fieldset className="mt-4"><legend className="text-xs text-white/55">Permissions par défaut</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{permissionOptions.map(([permission, label]) => <label key={permission} className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/65"><input type="checkbox" checked={permissions.includes(permission)} onChange={() => togglePermission(permission)} className="accent-cyan-200" />{label}</label>)}</div></fieldset>
      {error ? <p className="mt-3 text-xs text-rose-200">{error}</p> : null}
      <div className="mt-5 flex items-center justify-between gap-2"><div>{mode === 'edit' ? <button type="button" disabled={busy} onClick={onDelete} className="rounded-lg px-3 py-2 text-sm text-rose-200 hover:bg-rose-400/10">Supprimer</button> : null}</div><div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/10">Annuler</button><button type="submit" disabled={busy || !name.trim()} className="rounded-lg bg-cyan-200/15 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-200/25 disabled:opacity-40">{busy ? 'Enregistrement…' : mode === 'edit' ? 'Enregistrer' : 'Créer'}</button></div></div>
    </form>
  </div>;
}
