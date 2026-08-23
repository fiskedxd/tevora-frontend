import { BadgeCheck, Crown, Monitor, Sparkles } from 'lucide-react';

const fallbackBadges = {
  'first-hour': { name: 'Depuis la première heure', description: 'Membre de Tevora depuis juillet 2026', icon: Sparkles },
  official: { name: 'Compte officiel Tevora', description: 'Compte officiel de la plateforme', icon: BadgeCheck },
  admin: { name: 'Administrateur', description: 'Administrateur de Tevora', icon: BadgeCheck },
  developer: { name: 'Développeur', description: 'Développeur de Tevora', icon: BadgeCheck },
  creator: { name: 'Créateur du site', description: 'Créateur de Tevora', icon: Sparkles },
};

export default function ProfileBadges({ badges = [], compact = false }) {
  return <span className="inline-flex flex-wrap items-center gap-1" aria-label="Badges du profil">{badges.map((badge) => {
    const data = typeof badge === 'string' ? fallbackBadges[badge] : badge;
    if (!data) return null;
    const Icon = data.id === 'creator' ? Crown : data.id === 'developer' ? Monitor : data.id === 'official' || data.id === 'admin' ? BadgeCheck : Sparkles;
    return <span key={data.id || data.name} title={`${data.name} - ${data.description || ''}`} className={`profile-badge inline-flex items-center justify-center text-cyan-100 ${compact ? 'h-5 w-5' : 'h-7 w-7'}`}>{Icon ? <Icon size={compact ? 14 : 18} strokeWidth={1.8} /> : null}<span className="sr-only">{data.name}</span></span>;
  })}</span>;
}
