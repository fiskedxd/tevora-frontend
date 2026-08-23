import { useEffect, useRef, useState } from 'react';
import { AppWindow, Ban, CalendarDays, Camera, Code2, Flag, Gamepad2, Globe2, MessageCircle, MoreHorizontal, Music2, User, UserMinus, UserPlus, X } from 'lucide-react';
import ProfileBadges from './ProfileBadges';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProfileModal({
  profileTarget,
  profileDraft,
  setProfileDraft,
  profileMessage,
  isOpen,
  onClose,
  onSave,
  onImageChange,
  onMessage,
  onSendMessage,
  onAddFriend,
  onRemoveFriend,
  onBlockUser,
  onReport,
  serverContext,
  serverMembers = [],
  serverRoles = [],
  onToggleMemberRole,
  currentUserId,
  getAuthHeaders,
}) {
  const profileUserId = profileTarget?.id || profileTarget?._id || profileTarget?.userId;
  const isOwnProfile = Boolean(profileUserId && currentUserId && String(profileUserId) === String(currentUserId));
  const isOfficialProfile = Boolean(profileTarget?.isOfficial);
  const [editingField, setEditingField] = useState(null);
  const [bannerFailed, setBannerFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [activeTab, setActiveTab] = useState('tableau');
  const [commonData, setCommonData] = useState({ friends: [], servers: [] });
  const [isCommonDataLoading, setIsCommonDataLoading] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportBusy, setReportBusy] = useState(false);
  const initialDraftRef = useRef(profileDraft);

  useEffect(() => {
    if (!isOpen) return;
    initialDraftRef.current = profileDraft;
    setEditingField(null);
    setBannerFailed(false);
    setAvatarFailed(false);
    setIsActionMenuOpen(false);
    setIsReportOpen(false);
    setReportReason('');
    setReportDetails('');
    setActionMessage('');
    setActiveTab(isOwnProfile ? 'tableau' : 'friends');
    setCommonData({ friends: [], servers: [] });
    setIsCommonDataLoading(!isOwnProfile);
    if (!isOwnProfile && profileUserId && getAuthHeaders) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      fetch(`${API_URL}/api/social/profile/${profileUserId}/common`, { headers: getAuthHeaders(), signal: controller.signal })
        .then((response) => response.ok ? response.json() : { friends: [], servers: [] })
        .then((data) => setCommonData({ friends: data.friends || [], servers: data.servers || [] }))
        .catch(() => setCommonData({ friends: [], servers: [] }))
        .finally(() => {
          window.clearTimeout(timeout);
          setIsCommonDataLoading(false);
        });
      return () => {
        window.clearTimeout(timeout);
        controller.abort();
      };
    }
    setIsCommonDataLoading(false);
  }, [getAuthHeaders, isOpen, profileTarget?.id, profileTarget?._id]);

  if (!isOpen) return null;

  const displayName = profileDraft.displayName || profileTarget?.displayName || profileTarget?.username || 'Utilisateur';
  const username = profileDraft.username || profileTarget?.username || 'user';
  const currentServerHasBothUsers = Boolean(
    !isOwnProfile
      && serverContext?.id
      && serverMembers.some((member) => String(member.id || member._id) === String(currentUserId))
      && serverMembers.some((member) => String(member.id || member._id) === String(profileUserId)),
  );
  const commonServers = currentServerHasBothUsers && !commonData.servers.some((server) => String(server.id || server._id) === String(serverContext.id))
    ? [{ ...serverContext, memberCount: serverMembers.length }, ...commonData.servers]
    : commonData.servers;
  const saveField = async (field) => {
    setEditingField(null);
    await onSave(null, profileDraft);
    if (field) onMessage('Profil mis à jour.');
  };
  const cancelField = () => {
    setProfileDraft((current) => ({ ...current, [editingField]: initialDraftRef.current?.[editingField] || '' }));
    setEditingField(null);
  };

  const runAction = async (action, successMessage) => {
    setIsActionMenuOpen(false);
    const result = await action?.(profileTarget?.id || profileTarget?._id);
    setActionMessage(result || successMessage);
  };
  const memberRoles = profileTarget?.roles || [];
  const canManageRoles = Boolean(serverContext && profileTarget?.canManageRoles);
  const submitReport = async (event) => {
    event.preventDefault();
    if (!reportReason || (reportReason === 'other' && !reportDetails.trim())) return;
    setReportBusy(true);
    const result = await onReport?.(profileUserId, reportReason, reportDetails);
    setReportBusy(false);
    if (result?.ok) { setIsReportOpen(false); setActionMessage('Signalement envoyé.'); } else setActionMessage(result?.message || 'Signalement impossible.');
  };
  const activity = profileTarget?.activity;
  const activityDuration = activity?.startedAt ? Math.max(0, Math.floor((Date.now() - new Date(activity.startedAt).getTime()) / 60000)) : 0;
  const activityPreferences = profileTarget?.privacy?.activity || {};
  const ActivityIcon = activity?.applicationType === 'editor' ? Code2 : activity?.applicationType === 'music' ? Music2 : activity?.applicationType === 'browser' ? Globe2 : activity?.applicationType === 'game' ? Gamepad2 : AppWindow;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Fermer le profil" onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <section className="tavora-profile-modal relative z-10 max-h-[min(820px,94vh)] w-full max-w-[720px] overflow-y-auto rounded-2xl bg-[#08080b] shadow-2xl shadow-black/70">
        <div className="relative h-52 overflow-hidden bg-[#101014]">
          {profileDraft.bannerUrl && !bannerFailed ? <img src={profileDraft.bannerUrl} alt="" className="h-full w-full object-cover" onError={() => setBannerFailed(true)} /> : <div className="h-full w-full bg-[linear-gradient(135deg,#111118,#070709)]" />}
          {isOwnProfile ? (
            <label className="absolute right-4 top-4 cursor-pointer rounded-lg bg-black/60 p-2 text-white/70 transition hover:bg-black/80 hover:text-white" title="Modifier la bannière">
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={(event) => onImageChange(event, 'bannerUrl')} />
            </label>
          ) : null}
          <button type="button" onClick={onClose} className="absolute left-4 top-4 rounded-lg bg-black/60 p-2 text-white/60 transition hover:bg-black/80 hover:text-white" aria-label="Fermer"><X size={16} /></button>
          {!isOwnProfile ? <div className="absolute right-4 top-4">
            <button type="button" onClick={() => setIsActionMenuOpen((open) => !open)} className="rounded-lg bg-black/60 p-2 text-white/65 transition hover:bg-black/80 hover:text-white" aria-label="Options du profil" title="Options"><MoreHorizontal size={17} /></button>
            {isActionMenuOpen ? <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-lg border border-white/10 bg-[#111116] p-1 shadow-2xl">
              <button type="button" onClick={() => runAction(() => onAddFriend?.(profileTarget), 'Demande envoyée.')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-white/70 hover:bg-white/[0.07] hover:text-white"><UserPlus size={14} />Ajouter en ami</button>
              <button type="button" onClick={() => runAction(() => onRemoveFriend?.(profileUserId), 'Ami supprimé.')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-white/70 hover:bg-white/[0.07] hover:text-white"><UserMinus size={14} />Supprimer des amis</button>
              <div className="my-1 border-t border-white/[0.07]" />
              <button type="button" onClick={() => runAction(() => onBlockUser?.(profileUserId), 'Utilisateur bloqué.')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-rose-200/80 hover:bg-rose-400/10 hover:text-rose-100"><Ban size={14} />Bloquer</button>
              <button type="button" onClick={() => { setIsActionMenuOpen(false); setIsReportOpen(true); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-white/70 hover:bg-white/[0.07] hover:text-white"><Flag size={14} />Signaler</button>
            </div> : null}
          </div> : null}
        </div>

        <div className="px-8 pb-8">
          <div className="-mt-14 flex items-end justify-between">
            <label className={`relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#08080b] bg-[#15151b] text-white/45 shadow-xl shadow-black/50 ${isOwnProfile ? 'cursor-pointer' : ''}`}>
              {profileDraft.avatarUrl && !avatarFailed ? <img src={profileDraft.avatarUrl} alt={`Avatar de ${displayName}`} className="h-full w-full object-cover" onError={() => setAvatarFailed(true)} /> : <User size={30} />}
              {isOwnProfile ? <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition hover:opacity-100"><Camera size={18} /></span> : null}
              {isOwnProfile ? <input type="file" accept="image/*" className="hidden" onChange={(event) => onImageChange(event, 'avatarUrl')} /> : null}
            </label>
            {isOwnProfile ? <button type="button" onClick={() => onSave(null, profileDraft)} className="rounded-lg bg-cyan-200/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-200/20">Enregistrer</button> : <button type="button" onClick={() => onSendMessage(profileTarget?.id || profileTarget?._id)} className="flex items-center gap-2 rounded-lg bg-cyan-200/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-200/20"><MessageCircle size={14} /> Message</button>}
          </div>

          <div className="mt-4">
            {isOwnProfile && editingField === 'displayName' ? (
              <input autoFocus value={profileDraft.displayName} onChange={(event) => setProfileDraft((current) => ({ ...current, displayName: event.target.value }))} onKeyDown={(event) => { if (event.key === 'Enter') saveField('displayName'); if (event.key === 'Escape') cancelField(); }} onBlur={() => saveField('displayName')} className="w-full bg-transparent text-2xl font-semibold text-white outline-none" />
            ) : (
              <button type="button" disabled={!isOwnProfile} onClick={() => setEditingField('displayName')} className="text-left text-2xl font-semibold text-white disabled:cursor-default">{displayName}</button>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2"><p className="text-sm text-white/40">@{username}</p><ProfileBadges badges={profileTarget?.badges} compact />{profileTarget?.isSuspect ? <span title="Ce compte fait actuellement l’objet d’une vérification suite à plusieurs signalements." className="rounded bg-rose-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-200">Compte suspect</span> : null}</div>
          </div>

          {!isOfficialProfile ? <div className="my-6 border-t border-[#111114]" /> : null}
          {!isOfficialProfile ? <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">À propos de moi</p>
            {isOwnProfile && editingField === 'bio' ? (
              <textarea autoFocus value={profileDraft.bio} onChange={(event) => setProfileDraft((current) => ({ ...current, bio: event.target.value }))} onKeyDown={(event) => { if (event.key === 'Escape') cancelField(); if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveField('bio'); }} onBlur={() => saveField('bio')} rows={3} className="mt-3 w-full resize-none bg-transparent text-sm leading-6 text-white/75 outline-none" />
            ) : (
              <button type="button" disabled={!isOwnProfile} onClick={() => setEditingField('bio')} className="mt-3 block w-full text-left text-sm leading-6 text-white/65 disabled:cursor-default">{profileDraft.bio || 'Aucune bio pour le moment.'}</button>
            )}
          </section> : null}

          {!isOfficialProfile ? <div className="my-6 border-t border-[#111114]" /> : null}
          {!isOfficialProfile ? <section className="mt-6 border-t border-[#111114] pt-5">
            <div className="flex gap-1 border-b border-white/[0.06]">
              {(isOwnProfile ? [['tableau', 'Tableau']] : [['friends', 'Amis en commun'], ['servers', 'Serveurs en commun']]).map(([tab, label]) => (
                <button type="button" key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-3 py-2 text-xs transition ${activeTab === tab ? 'border-cyan-200 text-white' : 'border-transparent text-white/40 hover:text-white/75'}`}>{label}</button>
              ))}
            </div>
            {!isOwnProfile && activeTab === 'friends' ? <div className="space-y-2 pt-4">{isCommonDataLoading ? <p className="py-3 text-sm text-white/40">Chargement...</p> : commonData.friends.length ? commonData.friends.map((friend) => <div key={friend.id || friend._id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.04]"><div className="h-8 w-8 overflow-hidden rounded-full bg-white/[0.06]">{friend.avatarUrl ? <img src={friend.avatarUrl} alt="" className="h-full w-full object-cover" /> : null}</div><div><p className="text-sm text-white/75">{friend.displayName || friend.username}</p><p className="text-xs text-white/35">@{friend.username}</p></div></div>) : <p className="py-3 text-sm text-white/40">Aucun ami en commun</p>}</div> : null}
            {!isOwnProfile && activeTab === 'servers' ? <div className="space-y-2 pt-4">{isCommonDataLoading && !commonServers.length ? <p className="py-3 text-sm text-white/40">Chargement...</p> : commonServers.length ? commonServers.map((server) => <div key={server.id || server._id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.04]"><div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white/[0.06]">{server.avatarUrl ? <img src={server.avatarUrl} alt="" className="h-full w-full object-cover" /> : server.name?.charAt(0)}</div><div><p className="text-sm text-white/75">{server.name}</p><p className="text-xs text-white/35">{server.memberCount} membre(s)</p></div></div>) : <p className="py-3 text-sm text-white/40">Aucun serveur en commun</p>}</div> : null}
          </section> : null}
          {activity ? <section className="mt-6 border-t border-[#111114] pt-5"><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Activité</p><div className="mt-3 flex items-center gap-3 rounded-xl border border-cyan-200/10 bg-cyan-200/[0.04] px-3 py-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.08] text-cyan-100">{activity.applicationIcon ? <img src={activity.applicationIcon} alt="" className="h-full w-full object-cover" /> : <ActivityIcon size={17} />}</div><div className="min-w-0">{activityPreferences.showName !== false ? <p className="truncate text-sm font-medium text-white">{activity.applicationName}</p> : <p className="text-sm font-medium text-white">Activité en cours</p>}{activityPreferences.showDuration !== false ? <p className="text-xs text-white/40">{activityDuration ? `En cours depuis ${activityDuration} min` : 'À l’instant'}</p> : null}</div></div></section> : null}
          <div className="mt-5 flex items-center gap-3 text-xs text-white/40">
            <CalendarDays size={15} />
            <span>{isOfficialProfile ? 'Compte officiel Tevora' : (profileTarget?.status || 'Statut indisponible')}{!isOfficialProfile && profileTarget?.customStatus ? ` · ${profileTarget.customStatus}` : ''}</span>
            {isOfficialProfile ? <span>· Membre depuis toujours</span> : profileTarget?.createdAt ? <span>· Membre depuis {new Date(profileTarget.createdAt).toLocaleDateString()}</span> : null}
          </div>
          {serverContext ? <section className="mt-5 border-t border-[#111114] pt-5"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Rôles dans {serverContext.name}</p>{canManageRoles ? <button type="button" onClick={() => setIsActionMenuOpen((open) => !open)} className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06] text-white/60 hover:bg-white/10" title="Gérer les rôles">+</button> : null}</div><div className="mt-3 flex flex-wrap gap-2">{memberRoles.map((role) => <span key={role._id} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-xs" style={{ color: role.color }}>{role.iconUrl ? <img src={role.iconUrl} alt="" className="h-3 w-3 rounded object-cover" /> : null}{role.name}</span>)}{!memberRoles.length ? <span className="text-xs text-white/30">@everyone</span> : null}</div>{canManageRoles && isActionMenuOpen ? <div className="mt-3 space-y-1 rounded-lg border border-white/10 bg-[#111116] p-2">{serverRoles.filter((role) => !role.isEveryone).map((role) => { const assigned = memberRoles.some((item) => String(item._id) === String(role._id)); return <button key={role._id} type="button" onClick={() => runAction(() => onToggleMemberRole?.(profileUserId, role), assigned ? 'Rôle retiré.' : 'Rôle attribué.')} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs text-white/70 hover:bg-white/[0.07]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: role.color }} />{role.name}<span className="ml-auto">{assigned ? 'Retirer' : 'Ajouter'}</span></button>; })}</div> : null}</section> : null}
          {profileMessage || actionMessage ? <p className="mt-5 text-xs text-cyan-100/75">{actionMessage || profileMessage}</p> : null}
        </div>
      </section>
      {isReportOpen ? <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"><button type="button" aria-label="Fermer le signalement" onClick={() => setIsReportOpen(false)} className="absolute inset-0 bg-black/70" /><form onSubmit={submitReport} className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#111118] p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-base font-semibold text-white">Signaler cet utilisateur</h2><button type="button" onClick={() => setIsReportOpen(false)} className="text-white/40 hover:text-white"><X size={17} /></button></div><p className="mt-2 text-sm text-white/45">Une raison est obligatoire.</p><div className="mt-4 grid gap-1">{[['harassment', 'Harcèlement'], ['threats', 'Menaces'], ['impersonation', 'Usurpation d’identité'], ['spam', 'Spam'], ['scam', 'Arnaque'], ['dangerous', 'Contenu dangereux ou inapproprié'], ['hate', 'Discours haineux'], ['abuse', 'Comportement abusif'], ['other', 'Autre']].map(([value, label]) => <label key={value} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-white/65 hover:bg-white/[0.05]"><input type="radio" name="report-reason" value={value} checked={reportReason === value} onChange={(event) => setReportReason(event.target.value)} required />{label}</label>)}</div>{reportReason === 'other' ? <textarea required value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} placeholder="Décrivez la raison..." rows={3} className="mt-3 w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white outline-none" /> : null}<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setIsReportOpen(false)} className="rounded-lg px-3 py-2 text-sm text-white/50">Annuler</button><button disabled={reportBusy || !reportReason || (reportReason === 'other' && !reportDetails.trim())} className="rounded-lg bg-rose-400/15 px-3 py-2 text-sm font-semibold text-rose-100 disabled:opacity-40">{reportBusy ? 'Envoi...' : 'Envoyer le signalement'}</button></div></form></div> : null}
    </div>
  );
}
