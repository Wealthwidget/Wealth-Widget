'use client';

import { useState } from 'react';
import LandingPage from '@/components/landing-page';
import WealthWidget from '@/components/wealth-widget-v2';

export default function Home() {
  const [showWidget, setShowWidget] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <main>
      {!showWidget ? (
        <LandingPage 
          onGetStarted={() => setShowWidget(true)} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <WealthWidget 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </main>
  );
}