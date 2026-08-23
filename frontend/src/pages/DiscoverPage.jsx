import React from 'react';
import SectionPage from './SectionPage';

export default function DiscoverPage() {
  return (
    <SectionPage
      eyebrow="Discover"
      title="Find your next favorite space"
      description="Explore fresh ways to share energy, personality, and moments with your crew through immersive rooms, playful features, and intuitive discovery tools."
      highlights={[
        'Curated community spaces built for real conversations',
        'Custom themes, stickers, and reactions that feel personal',
        'A smooth experience for jumping into new rooms and activities',
      ]}
      primaryCta={{ label: 'Back home', to: '/' }}
      secondaryCta={{ label: 'Open Tavora', to: '/login' }}
    />
  );
}
