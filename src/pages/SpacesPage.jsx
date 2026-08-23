import React from 'react';
import SectionPage from './SectionPage';

export default function SpacesPage() {
  return (
    <SectionPage
      eyebrow="Spaces"
      title="Create rooms that match every mood"
      description="Whether you want a relaxed hangout, a gaming lounge, or a study channel, Tavora helps you build a space that feels exactly right for your people."
      highlights={[
        'Flexible rooms for games, chats, events, and downtime',
        'Quick customization with layout, presence, and vibe controls',
        'Easy sharing so friends can join without friction',
      ]}
      primaryCta={{ label: 'Back home', to: '/' }}
      secondaryCta={{ label: 'Join a room', to: '/login' }}
    />
  );
}
