import React from 'react';
import SectionPage from './SectionPage';

export default function SupportPage() {
  return (
    <SectionPage
      eyebrow="Support"
      title="Help is here whenever you need it"
      description="From setup questions to account help, support is built to stay friendly, clear, and quick so you can get back to the good stuff faster."
      highlights={[
        'Fast answers for common setup and access issues',
        'Friendly support for account and community questions',
        'A simple path to get help without leaving the experience',
      ]}
      primaryCta={{ label: 'Back home', to: '/' }}
      secondaryCta={{ label: 'Contact support', to: '/login' }}
    />
  );
}
