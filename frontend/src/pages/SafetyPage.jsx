import React from 'react';
import SectionPage from './SectionPage';

export default function SafetyPage() {
  return (
    <SectionPage
      eyebrow="Safety"
      title="Stay protected without losing the fun"
      description="Keep your conversations comfortable with thoughtful moderation, privacy controls, and a calmer, safer way to manage access to your rooms."
      highlights={[
        'Simple tools to welcome the right people and keep out the noise',
        'Clear controls for voice, text, and room access',
        'A safer experience that still feels warm and social',
      ]}
      primaryCta={{ label: 'Back home', to: '/' }}
      secondaryCta={{ label: 'Learn more', to: '/support' }}
    />
  );
}
