import PlaylistDetailPanel from './PlaylistDetailPanel';

export default function PlaylistDetailOverlay({ playlist, tracks, onBack }) {
  if (!playlist) return null;
  return <div className="fixed inset-0 z-[55] bg-[#08080b]/95"><PlaylistDetailPanel playlist={playlist} tracks={tracks} onBack={onBack} /></div>;
}
