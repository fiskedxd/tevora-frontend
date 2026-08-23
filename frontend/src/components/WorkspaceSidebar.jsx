import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Copy, Hash, Home, Link2, MessageSquare, MoreHorizontal, Plus, Search, Settings2, User, UserPlus, Users, Volume2 } from 'lucide-react';

const ServerIcon = ({ server }) => {
  const [failed, setFailed] = React.useState(false);
  const imageUrl = server?.avatarUrl;

  return imageUrl && !failed ? (
    <img src={imageUrl} alt="" className="h-full w-full rounded-xl object-cover" onError={() => setFailed(true)} />
  ) : (
    server?.name?.charAt(0)?.toUpperCase() || 'S'
  );
};

const Avatar = ({ person, size = 'h-9 w-9' }) => (
  <div className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#16161d] text-xs font-semibold text-white/50`}>
    {person?.avatarUrl ? <img src={person.avatarUrl} alt="" className="h-full w-full object-cover" /> : <User size={16} />}
  </div>
);

export default function WorkspaceSidebar({
  selectedServer,
  activeChannelId,
  isDmMode,
  friends,
  friendSearch,
  onFriendSearchChange,
  onOpenServer,
  onOpenHome,
  onOpenChannel,
  onOpenProfile,
  onOpenDirectMessage,
  user,
  onOpenSettings,
  isServerOwner,
  onOpenServerSettings,
  onOpenInvite,
  onJoinServer,
  onOpenFriendModal,
  incomingRequests = [],
  onFriendRequestDecision,
  canManageChannels = false,
  onCreateChannel,
  onEditChannel,
  onDeleteChannel,
  className = '',
}) {
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);
  const [channelMenu, setChannelMenu] = useState(null);
  const serverMenuRef = useRef(null);
  const categories = selectedServer?.structure?.categories || [];
  const filteredFriends = friends.filter((friend) => {
    const label = `${friend.displayName || ''} ${friend.username || ''}`.toLowerCase();
    return label.includes(friendSearch.toLowerCase());
  });

  useEffect(() => {
    setBannerFailed(false);
    setIsServerMenuOpen(false);
    setChannelMenu(null);
  }, [selectedServer?.id, selectedServer?.bannerUrl]);

  useEffect(() => {
    if (!channelMenu) return undefined;
    const close = () => setChannelMenu(null);
    document.addEventListener('mousedown', close);
    window.addEventListener('blur', close);
    return () => { document.removeEventListener('mousedown', close); window.removeEventListener('blur', close); };
  }, [channelMenu]);

  useEffect(() => {
    if (!isServerMenuOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (!serverMenuRef.current?.contains(event.target)) setIsServerMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isServerMenuOpen]);

  const copyServerId = async () => {
    if (!selectedServer?.id) return;
    try {
      await navigator.clipboard.writeText(String(selectedServer.id));
    } catch {
      // Clipboard access can be unavailable outside a secure browser context.
    }
    setIsServerMenuOpen(false);
  };

  return (
    <aside className={`tavora-navigation flex w-[272px] shrink-0 flex-col border-r ${className}`}>
      {selectedServer && !isDmMode ? (
        <>
          <button type="button" onClick={onOpenHome} className="flex items-center gap-3 border-b px-4 py-3 text-left text-sm text-white/55 transition hover:bg-white/[0.045] hover:text-white">
            <Home size={16} /> Accueil
          </button>
          {selectedServer.bannerUrl && !bannerFailed ? <img src={selectedServer.bannerUrl} alt={`Bannière de ${selectedServer.name}`} className="block h-24 w-full object-cover" onError={() => setBannerFailed(true)} /> : null}
          <div ref={serverMenuRef} className="tavora-sidebar-header relative border-b">
            <div role="button" tabIndex={0} onClick={() => setIsServerMenuOpen((open) => !open)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setIsServerMenuOpen((open) => !open); }} className="flex h-16 cursor-pointer items-center justify-between px-4 text-left transition hover:bg-white/[0.035]" aria-expanded={isServerMenuOpen}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#16161d] text-sm font-semibold text-white/70">
                <ServerIcon server={selectedServer} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{selectedServer.name}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">Espace communautaire</p>
              </div>
            </div>
            <span className="flex items-center gap-2 text-white/35">
              <ChevronDown size={16} className={`transition-transform ${isServerMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </span>
            </div>
            {isServerMenuOpen ? (
              <div className="absolute left-3 right-3 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border bg-[#08080a] p-1 shadow-2xl shadow-black/60">
                <button type="button" onClick={() => { setIsServerMenuOpen(false); onOpenInvite(); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white">
                  <Link2 size={15} /> Inviter
                </button>
                <button type="button" onClick={copyServerId} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white">
                  <Copy size={15} /> Copier l’identifiant
                </button>
                {isServerOwner ? (
                  <>
                    <div className="my-1 border-t" />
                    <button type="button" onClick={() => { setIsServerMenuOpen(false); onOpenServerSettings(); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white">
                      <Settings2 size={15} /> Paramètres du serveur
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-5">
            {categories.map((category) => (
              <section key={category.id} className="mb-6">
                <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                  <span>{category.name}</span>
                  {canManageChannels ? <button type="button" onClick={() => onCreateChannel?.(category.id)} className="rounded p-0.5 text-white/30 transition hover:bg-white/10 hover:text-white" title="Créer un salon"><Plus size={13} /></button> : null}
                </div>
                <div className="space-y-1">
                  {(category.channels || []).map((channel) => {
                    const active = String(activeChannelId) === String(channel.id);
                    return <div key={channel.id} className="relative"><button type="button" onClick={() => onOpenChannel(channel.id)} onContextMenu={(event) => { if (!canManageChannels) return; event.preventDefault(); setChannelMenu({ channel, categoryId, x: Math.min(event.clientX, window.innerWidth - 220), y: Math.min(event.clientY, window.innerHeight - 180) }); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${active ? 'bg-white/[0.10] text-white shadow-[inset_2px_0_0_#9bdcff]' : 'text-white/45 hover:bg-white/[0.045] hover:text-white/80'}`} title={canManageChannels ? 'Clic droit pour gérer le salon' : undefined}>
                      {channel.type === 'voice' ? <Volume2 size={16} /> : <Hash size={16} />}<span className="truncate">{channel.name}</span>{canManageChannels ? <MoreHorizontal size={14} className="ml-auto text-white/20" /> : null}
                    </button>{channelMenu?.channel.id === channel.id ? <div className="fixed z-[100] w-52 rounded-lg border border-white/10 bg-[#111118] p-1 shadow-2xl" style={{ left: channelMenu.x, top: channelMenu.y }} onMouseDown={(event) => event.stopPropagation()}><button type="button" onClick={() => { setChannelMenu(null); onEditChannel?.(channel, category.id); }} className="block w-full rounded-md px-3 py-2 text-left text-xs text-white/75 hover:bg-white/10">Modifier le salon</button><button type="button" onClick={() => { setChannelMenu(null); onCreateChannel?.(category.id, channel); }} className="block w-full rounded-md px-3 py-2 text-left text-xs text-white/75 hover:bg-white/10">Dupliquer le salon</button><button type="button" onClick={() => { setChannelMenu(null); onEditChannel?.(channel, category.id, true); }} className="block w-full rounded-md px-3 py-2 text-left text-xs text-white/75 hover:bg-white/10">Gérer les permissions</button><div className="my-1 border-t border-white/10" /><button type="button" onClick={() => { setChannelMenu(null); onDeleteChannel?.(channel); }} className="block w-full rounded-md px-3 py-2 text-left text-xs text-rose-200 hover:bg-rose-400/10">Supprimer le salon</button></div> : null}</div>;
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="border-b px-4 py-4">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input value={friendSearch} onChange={(event) => onFriendSearchChange(event.target.value)} placeholder="Rechercher" className="w-full rounded-lg border border-white/[0.07] bg-black/20 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-200/30" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <div className="mb-5 flex items-center justify-between px-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Messages privés</p>
              <button type="button" onClick={() => onOpenProfile(user, true)} className="text-white/30 transition hover:text-white"><Settings2 size={15} /></button>
            </div>
            <button type="button" onClick={onOpenHome} className="mb-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/55 transition hover:bg-white/[0.045] hover:text-white"><MessageSquare size={16} /> Accueil</button>
            <div className="space-y-1">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="group flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-white/[0.045]">
                  <button type="button" onClick={() => onOpenDirectMessage(friend.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Avatar person={friend} />
                    <span className="truncate text-sm text-white/60 group-hover:text-white">{friend.displayName || friend.username}</span>
                  </button>
                  <button type="button" onClick={() => onOpenProfile(friend, false)} className="text-white/20 opacity-0 transition group-hover:opacity-100 hover:text-white"><Users size={14} /></button>
                </div>
              ))}
              {!filteredFriends.length ? <p className="px-2 py-5 text-center text-xs text-white/25">Aucune conversation</p> : null}
            </div>
          </div>
        </>
      )}
      <div className="tavora-user-dock border-t p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <button type="button" onClick={() => onOpenProfile(user, true)}><Avatar person={user} size="h-9 w-9" /></button>
          <button type="button" onClick={() => onOpenProfile(user, true)} className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-white">{user?.displayName || user?.username || 'Utilisateur'}</p>
            <p className="truncate text-[11px] text-emerald-300/70">{user?.status || 'En ligne'}{user?.customStatus ? ` · ${user.customStatus}` : ''}</p>
          </button>
          <button type="button" onClick={onOpenSettings} className="text-white/25 hover:text-white"><Settings2 size={16} /></button>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 border-t border-white/[0.06] pt-2">
          <button type="button" onClick={onJoinServer} className="flex items-center justify-center rounded-lg p-2 text-white/45 transition hover:bg-white/[0.06] hover:text-white" title="Serveurs" aria-label="Serveurs">
            <Plus size={15} />
          </button>
          <button type="button" onClick={onOpenFriendModal} className="flex items-center justify-center rounded-lg p-2 text-white/45 transition hover:bg-white/[0.06] hover:text-white" title="Amis" aria-label="Amis">
            <UserPlus size={15} />
          </button>
          <button type="button" onClick={() => setIsNotificationsOpen((open) => !open)} className="relative flex items-center justify-center rounded-lg p-2 text-white/45 transition hover:bg-white/[0.06] hover:text-white" title="Alertes" aria-label="Alertes">
            <Bell size={15} />
            {incomingRequests.length ? <span className="absolute right-2 top-1 h-1.5 w-1.5 rounded-full bg-cyan-200" /> : null}
          </button>
        </div>
        {isNotificationsOpen ? (
          <div className="mt-2 border border-white/[0.08] bg-[#0d0d12] p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Demandes d’amis</p>
              <span className="text-[10px] text-white/25">{incomingRequests.length}</span>
            </div>
            {incomingRequests.length ? incomingRequests.map((request) => (
              <div key={request.id} className="border-t border-white/[0.06] py-2">
                <p className="truncate text-xs text-white/70">{request.displayName || request.username}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => onFriendRequestDecision?.(request.id, 'accept')} className="text-[10px] text-emerald-200/80 hover:text-emerald-100">Accepter</button>
                  <button type="button" onClick={() => onFriendRequestDecision?.(request.id, 'decline')} className="text-[10px] text-rose-200/70 hover:text-rose-100">Refuser</button>
                </div>
              </div>
            )) : <p className="py-2 text-xs text-white/30">Aucune nouvelle demande.</p>}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
