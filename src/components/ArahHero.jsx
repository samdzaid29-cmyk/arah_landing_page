import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArahLogo from './ArahLogo';
import CanvasSequenceBackground from './CanvasSequenceBackground';

gsap.registerPlugin(ScrollTrigger);

/**
 * Predefined AutoBrowse AI Animated Greeting Messages
 */
const GREETINGS = [
  "What can I help you automate?",
  "What would you like me to browse?",
  "Give me a task. I'll handle the web.",
  "Where should we start?",
  "What should I take care of?",
  "Ready when you are. What's the goal?",
  "What would you like to accomplish?",
  "Tell me what you need. I'll navigate from there.",
];

/**
 * Curated Premium Color Themes for ARAH Hero Animation
 * Optimized for High-Impact Bold Visibility over video background.
 */
export const THEMES = {
  obsidian: {
    name: "Frost White & Platinum Glow (Ultra Bold)",
    bg: "bg-[#090a10]",
    logoColor: "url(#glassy-white-gradient)",
    cutoutColor: "#090a10",
    // Triple-stage shadow: Deep black outline + double white luminous halo glow
    logoShadow: "drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] drop-shadow-[0_0_80px_rgba(255,255,255,0.5)]",
    diamondFill: "#ffffff",
    diamondFillOpacity: 0.18,
    diamondStroke: "#ffffff",
    diamondStrokeOpacity: 0.65,
    diamondShadow: "drop-shadow-[0_20px_50px_rgba(255,255,255,0.35)]",
    greetingGradient: "from-white via-neutral-100 to-neutral-300",
    indicatorText: "text-neutral-200",
    indicatorLine: "bg-neutral-400",
    indicatorPulse: "bg-white",
  },
  pink: {
    name: "Glassy Rose Quartz Pink",
    bg: "bg-[#090a10]",
    logoColor: "url(#glassy-pink-gradient)",
    cutoutColor: "#090a10",
    logoShadow: "drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] drop-shadow-[0_0_40px_rgba(244,114,182,0.7)] drop-shadow-[0_0_80px_rgba(251,113,133,0.5)]",
    diamondFill: "#fb7185",
    diamondFillOpacity: 0.2,
    diamondStroke: "#f472b6",
    diamondStrokeOpacity: 0.6,
    diamondShadow: "drop-shadow-[0_20px_50px_rgba(244,114,182,0.35)]",
    greetingGradient: "from-[#fff1f2] via-[#f472b6] to-[#fb7185]",
    indicatorText: "text-rose-300/90",
    indicatorLine: "bg-rose-500/40",
    indicatorPulse: "bg-rose-400",
  },
  gold: {
    name: "Obsidian & Liquid Gold",
    bg: "bg-[#090a10]",
    logoColor: "url(#glassy-gold-gradient)",
    cutoutColor: "#090a10",
    logoShadow: "drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] drop-shadow-[0_0_40px_rgba(253,224,71,0.7)]",
    diamondFill: "#f59e0b",
    diamondFillOpacity: 0.2,
    diamondStroke: "#fbbf24",
    diamondStrokeOpacity: 0.6,
    diamondShadow: "drop-shadow-[0_20px_50px_rgba(245,158,11,0.35)]",
    greetingGradient: "from-[#fff7ed] via-[#fde047] to-[#eab308]",
    indicatorText: "text-amber-300/80",
    indicatorLine: "bg-amber-500/40",
    indicatorPulse: "bg-amber-400",
  },
  midnight: {
    name: "Deep Midnight Navy & Cyan (Cyber Tech)",
    bg: "bg-[#0b132b]",
    logoColor: "#38bdf8",
    cutoutColor: "#0b132b",
    logoShadow: "drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] drop-shadow-[0_0_40px_rgba(56,189,248,0.7)]",
    diamondFill: "#38bdf8",
    diamondFillOpacity: 0.2,
    diamondStroke: "#7dd3fc",
    diamondStrokeOpacity: 0.6,
    diamondShadow: "drop-shadow-[0_20px_50px_rgba(56,189,248,0.35)]",
    greetingGradient: "from-[#e0f2fe] via-[#38bdf8] to-[#0284c7]",
    indicatorText: "text-slate-300",
    indicatorLine: "bg-slate-500",
    indicatorPulse: "bg-sky-400",
  },
};

export default function ArahHero({
  theme = "obsidian",
  scrollDistance = 2200,
  assembledLogoScale = 1.22,
  isReady = true,
}) {
  const currentTheme = THEMES[theme] || THEMES.obsidian;

  const heroRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const diamondRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const greetingRef = useRef(null);

  // Random Greeting Selected on Mount
  const [greeting] = useState(() => {
    const randomIndex = Math.floor(Math.random() * GREETINGS.length);
    return GREETINGS[randomIndex];
  });

  // Dynamic Entrance Animation for Greeting Header (triggers when isReady is true)
  useEffect(() => {
    if (!isReady) return;
    if (greetingRef.current) {
      gsap.fromTo(
        greetingRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    }
  }, [isReady]);

  // GSAP ScrollTrigger Timeline for ARAH Logo & Background Diamond
  useEffect(() => {
    // Accessibility check: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (diamondRef.current) {
        gsap.set(diamondRef.current, { scale: 1.0, rotation: 0, opacity: 0.35 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      }, (context) => {
        const { isMobile } = context.conditions;
        const offsetMult = isMobile ? 0.45 : 1;

        // 1. INITIAL STATE: Letters separated around center (100% Solid Opacity)
        gsap.set(".letter-a", {
          x: -75 * offsetMult,
          y: -50 * offsetMult,
          rotation: -6,
          scale: 0.94,
          opacity: 1,
          transformOrigin: "center center",
        });

        gsap.set(".letter-r", {
          x: -60 * offsetMult,
          y: 45 * offsetMult,
          rotation: 4,
          scale: 0.94,
          opacity: 1,
          transformOrigin: "center center",
        });

        gsap.set(".letter-a2", {
          x: 65 * offsetMult,
          y: -45 * offsetMult,
          rotation: 8,
          scale: 0.94,
          opacity: 1,
          transformOrigin: "center center",
        });

        gsap.set(".letter-h", {
          x: 75 * offsetMult,
          y: 50 * offsetMult,
          rotation: -5,
          scale: 0.94,
          opacity: 1,
          transformOrigin: "center center",
        });

        // Diamond Cutout Initial State inside 2nd A
        gsap.set(".diamond-cutout", {
          scale: 0.65,
          rotation: 35,
          opacity: 0.85,
          transformOrigin: "517.5px 98px",
        });

        // Background Diamond Initial State
        if (diamondRef.current) {
          gsap.set(diamondRef.current, {
            scale: isMobile ? 0.7 : 0.8,
            rotation: 12,
            opacity: 0.25,
            transformOrigin: "center center",
          });
        }

        // 2. MASTER SCROLLTRIGGER TIMELINE
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Step A (0 -> 0.15): Scroll indicator fades out on initial scroll
        tl.to(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            y: -15,
            duration: 0.15,
            ease: "power1.out",
          },
          0
        );

        // Step B (0 -> 0.42): Letters assemble into ARAH logo
        tl.to(
          [".letter-a", ".letter-r", ".letter-a2", ".letter-h"],
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.42,
            ease: "power2.out",
          },
          0
        );

        // Step C (0 -> 0.42): Background Diamond smoothly scales up, rotates to 0 & settles behind logo
        if (diamondRef.current) {
          tl.to(
            diamondRef.current,
            {
              scale: isMobile ? 0.9 : 1.0,
              rotation: 0,
              opacity: 0.4,
              duration: 0.42,
              ease: "power2.out",
            },
            0
          );
        }

        // Step D (0.15 -> 0.42): Second A diamond cutout micro-settles
        tl.to(
          ".diamond-cutout",
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.27,
            ease: "back.out(1.4)",
          },
          0.15
        );

        // Step E (0.52 -> 0.78): Cinematic Scale-Up
        const targetScale = isMobile ? Math.min(assembledLogoScale, 1.15) : assembledLogoScale;

        tl.to(
          logoWrapperRef.current,
          {
            scale: targetScale,
            y: -30,
            duration: 0.26,
            ease: "power1.inOut",
          },
          0.52
        );

        if (diamondRef.current) {
          tl.to(
            diamondRef.current,
            {
              scale: isMobile ? 1.05 : 1.18,
              y: -30,
              duration: 0.26,
              ease: "power1.inOut",
            },
            0.52
          );
        }

        // Step F (0.78 -> 1.0): Exit Transition (Greeting & Logo fade out cleanly near the end)
        tl.to(
          [logoWrapperRef.current, greetingRef.current],
          {
            y: -75,
            opacity: 0,
            duration: 0.22,
            ease: "power2.in",
          },
          0.78
        );

        if (diamondRef.current) {
          tl.to(
            diamondRef.current,
            {
              y: -75,
              opacity: 0,
              duration: 0.22,
              ease: "power2.in",
            },
            0.78
          );
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, [scrollDistance, assembledLogoScale, theme]);

  return (
    <section
      ref={heroRef}
      className={`relative w-full h-screen min-h-[100dvh] flex flex-col items-center justify-between py-8 overflow-hidden transition-colors duration-500`}
    >
      {/* Bottom Layer (z-0): Crystal-Clear 270-Frame Canvas Scroll Video Background */}
      <CanvasSequenceBackground
        triggerRef={heroRef}
        scrollDistance={scrollDistance}
      />

      {/* Frost Glass White Greeting Header (z-20 Top Layer, Stays Visible During Scroll Assembly) */}
      <header
        ref={greetingRef}
        style={{ opacity: isReady ? undefined : 0 }}
        className="relative z-20 pt-8 px-6 text-center max-w-3xl mx-auto select-none"
      >
        <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans font-normal tracking-tight leading-snug text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.greetingGradient} drop-shadow-[0_4px_20px_rgba(0,0,0,1)]`}>
          {greeting}
        </h1>
      </header>

      {/* Main Stage Container (Centers Diamond & ARAH Logo directly over clean Canvas Video) */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-6 max-w-4xl mx-auto">
        
        {/* Layer 1: Background Geometric Diamond (z-0 in stage, behind logo) */}
        <div
          ref={diamondRef}
          className={`diamond-background absolute z-0 pointer-events-none w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[520px] md:h-[520px] ${currentTheme.diamondShadow}`}
        >
          <svg
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Outer Geometric Diamond Frame */}
            <polygon
              points="150,15 285,150 150,285 15,150"
              fill={currentTheme.diamondFill}
              fillOpacity={currentTheme.diamondFillOpacity}
              stroke={currentTheme.diamondStroke}
              strokeOpacity={currentTheme.diamondStrokeOpacity}
              strokeWidth="2.5"
            />
            {/* Inner Concentric Accent Line */}
            <polygon
              points="150,42 258,150 150,258 42,150"
              fill="none"
              stroke={currentTheme.diamondStroke}
              strokeOpacity={currentTheme.diamondStrokeOpacity * 0.5}
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
          </svg>
        </div>

        {/* Layer 2: Ultra-Bold Strongly Visible ARAH Logo (z-10 in stage) */}
        <div
          ref={logoWrapperRef}
          className={`arah-logo relative z-10 w-full flex items-center justify-center pointer-events-none ${currentTheme.logoShadow}`}
        >
          <ArahLogo
            color={currentTheme.logoColor}
            cutoutColor={currentTheme.cutoutColor}
            className="w-full max-w-md sm:max-w-xl lg:max-w-2xl h-auto"
          />
        </div>

      </div>

      {/* Layer 3: Minimal Scroll Indicator (z-20, foreground UI) */}
      <div
        ref={scrollIndicatorRef}
        className="scroll-indicator relative z-20 pb-6 pt-2 flex flex-col items-center gap-3 select-none pointer-events-none"
      >
        <span className={`text-[10px] font-mono uppercase tracking-[0.3em] ${currentTheme.indicatorText} font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}>
          SCROLL
        </span>
        <div className={`w-px h-7 ${currentTheme.indicatorLine} relative overflow-hidden`}>
          <div className={`w-full h-full ${currentTheme.indicatorPulse} animate-pulse`} />
        </div>
      </div>
    </section>
  );
}
