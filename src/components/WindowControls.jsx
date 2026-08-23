import { Maximize2, Minimize2, X } from 'lucide-react';
import { useState } from 'react';

const noDrag = { WebkitAppRegion: 'no-drag' };

export default function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);
  const desktop = typeof window !== 'undefined' ? window.tevoraDesktop : null;
  if (!desktop?.isDesktop) return null;

  const toggleMaximize = async () => {
    const nextState = await desktop.toggleMaximize();
    setIsMaximized(Boolean(nextState));
  };

  return (
    <div className="tavora-window-controls flex shrink-0 items-center" style={noDrag}>
      <button type="button" title="Réduire" aria-label="Réduire la fenêtre" onClick={() => desktop.minimize()} className="flex h-10 w-10 items-center justify-center text-white/45 transition hover:bg-white/[0.08] hover:text-white"><Minimize2 size={14} /></button>
      <button type="button" title={isMaximized ? 'Restaurer' : 'Agrandir'} aria-label={isMaximized ? 'Restaurer la fenêtre' : 'Agrandir la fenêtre'} onClick={toggleMaximize} className="flex h-10 w-10 items-center justify-center text-white/45 transition hover:bg-white/[0.08] hover:text-white">{isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}</button>
      <button type="button" title="Fermer" aria-label="Fermer Tavora" onClick={() => desktop.close()} className="flex h-10 w-10 items-center justify-center text-white/45 transition hover:bg-rose-500/80 hover:text-white"><X size={15} /></button>
    </div>
  );
}
