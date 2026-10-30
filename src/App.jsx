import React, { useState, useEffect, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArahHero from './components/ArahHero';
import ArahIntro from './components/ArahIntro';
import './App.css';

export default function App() {
  // Intro states: 'active' | 'fading' | 'hidden'
  const [introState, setIntroState] = useState('active');

  // Prevent background scrolling while intro is visible
  useEffect(() => {
    if (introState !== 'hidden') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      ScrollTrigger.refresh();
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [introState]);

  const handleIntroComplete = useCallback(() => {
    setIntroState('fading');
    const timer = setTimeout(() => {
      setIntroState('hidden');
    }, 600); // 600ms fade duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-wrapper">
      {/* Fixed Full-Screen Intro Overlay */}
      {introState !== 'hidden' && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[#090a10] ${
            introState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            willChange: 'opacity',
            transition: 'opacity 600ms ease-out',
          }}
        >
          <ArahIntro onComplete={handleIntroComplete} />
        </div>
      )}

      {/* Option 1 Active Default: "obsidian" | Can also be "champagne", "midnight", or "sedona" */}
      <ArahHero theme="obsidian" isReady={introState !== 'active'} />
      
      {/* Simple Black Placeholder Section for ScrollTrigger Pin Testing */}
      <section className="w-full h-screen min-h-[100dvh] bg-[#090a10] text-white flex items-center justify-center border-t border-white/10">
        <h2 className="text-2xl md:text-3xl font-mono uppercase tracking-widest text-neutral-400">
          NEXT SECTION
        </h2>
      </section>
    </div>
  );
}
