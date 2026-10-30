import React, { useEffect, useRef } from 'react';

/**
 * ArahIntro Component
 * Faithful React port of logo.html standalone intro animation.
 * Features:
 * - Pure SVG vector rendering with 1:1 fidelity to logo.html
 * - requestAnimationFrame mathematical morphing & orbit engine
 * - Synthesized Web Audio API sound (optional, triggered only on user interaction)
 * - Completion trigger at t = 5.0s (peak logo reveal)
 * - Proper cleanup on unmount (cancels rAF, closes AudioContext, clears timers)
 * - Accessibility: respects prefers-reduced-motion
 */

const R = 190;
const S = 0.3;
const cx = [207, 497.5, 768, 1056];
const clamp = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a, b, m) => a + (b - a) * m;
const STEPS = [1.5, 2.25, 3.0];

// Hourglass -> diamond vertices for morphing
const HG = [
  [-0.72, -0.9],
  [0.72, -0.9],
  [0.1, 0],
  [0.72, 0.9],
  [-0.72, 0.9],
  [-0.1, 0],
];
const DM = [
  [0, -0.82],
  [0, -0.82],
  [0.5, 0],
  [0, 0.82],
  [0, 0.82],
  [-0.5, 0],
];

const P = [0.8, 1.7, 2.45, 3.2];
const WEND = 3.75;
const back = (x) => {
  const y = x - 1;
  return 1 + 2.70158 * y * y * y + 1.70158 * y * y;
};

const NOTE = [659, 784, 988, 1319];
const EV = [
  [0.12, 'power'],
  [0.8, 'pop0'],
  [1.5, 'slide'],
  [1.7, 'pop1'],
  [2.25, 'slide'],
  [2.45, 'pop2'],
  [3.0, 'slide'],
  [3.2, 'pop3'],
  [3.85, 'tilt'],
  [4.2, 'beam'],
  [4.5, 'reveal'],
];

export default function ArahIntro({ onComplete }) {
  const sceneRef = useRef(null);
  const beamRef = useRef(null);
  const discRef = useRef(null);
  const r1Ref = useRef(null);
  const r2Ref = useRef(null);
  const diaRef = useRef(null);
  const dpRef = useRef(null);
  const cppRef = useRef(null);
  const lettersRef = useRef(null);
  const logoRef = useRef(null);
  const nodesRef = useRef(null);
  const wordsRef = useRef(null);

  const rafIdRef = useRef(null);
  const completedRef = useRef(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const noiseBufRef = useRef(null);
  const soundUnlockedRef = useRef(false);

  // Web Audio Context initialization on user interaction
  const getAudioContext = () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    const ac = new AudioContextClass();
    const master = ac.createGain();
    master.gain.value = 0.5;
    const comp = ac.createDynamicsCompressor();
    master.connect(comp);
    comp.connect(ac.destination);

    const noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    audioCtxRef.current = ac;
    masterGainRef.current = master;
    noiseBufRef.current = noiseBuf;
    return ac;
  };

  const playTone = (f0, f1, dur, type, vol, delay) => {
    const ac = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ac || !master || ac.state !== 'running') return;
    const t = ac.currentTime + (delay || 0);
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  };

  const playNoise = (dur, f0, f1, vol, q) => {
    const ac = audioCtxRef.current;
    const master = masterGainRef.current;
    const noiseBuf = noiseBufRef.current;
    if (!ac || !master || !noiseBuf || ac.state !== 'running') return;
    const t = ac.currentTime;
    const s = ac.createBufferSource();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    s.buffer = noiseBuf;
    s.loop = true;
    f.type = 'bandpass';
    f.Q.value = q || 1;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f);
    f.connect(g);
    g.connect(master);
    s.start(t);
    s.stop(t + dur + 0.05);
  };

  const playSoundEvent = (n) => {
    if (!soundUnlockedRef.current) return;
    if (n === 'power') {
      playTone(110, 440, 0.8, 'sine', 0.32);
      playTone(220, 880, 0.8, 'triangle', 0.1);
      playNoise(0.7, 300, 2500, 0.1);
    } else if (n.indexOf('pop') === 0) {
      const idx = +n.slice(3);
      const f = NOTE[idx] || 659;
      playTone(f * 0.5, f, 0.08, 'sine', 0.25);
      playTone(f, f, 0.55, 'triangle', 0.2);
      playTone(f * 2, f * 2, 0.3, 'sine', 0.06);
    } else if (n === 'slide') {
      playNoise(0.28, 800, 2400, 0.08, 1.2);
    } else if (n === 'tilt') {
      playNoise(0.8, 300, 3000, 0.15, 0.8);
      playTone(180, 90, 0.8, 'sine', 0.18);
    } else if (n === 'beam') {
      playTone(300, 1100, 0.7, 'sine', 0.13);
      playTone(303, 1106, 0.7, 'sine', 0.09);
    } else if (n === 'reveal') {
      [880, 1318.5, 1760, 2217].forEach((f, i) => {
        playTone(f, f, 1.3, 'sine', 0.11, i * 0.06);
      });
    }
  };

  const unlockAudio = () => {
    const ac = getAudioContext();
    if (ac && ac.state !== 'running') {
      ac.resume().then(() => {
        soundUnlockedRef.current = true;
      }).catch(() => {});
    } else if (ac) {
      soundUnlockedRef.current = true;
    }
  };

  useEffect(() => {
    const scene = sceneRef.current;
    const beam = beamRef.current;
    const disc = discRef.current;
    const r1 = r1Ref.current;
    const r2 = r2Ref.current;
    const dia = diaRef.current;
    const dp = dpRef.current;
    const cpp = cppRef.current;
    const letters = lettersRef.current;
    const logo = logoRef.current;
    const nodes = nodesRef.current ? nodesRef.current.children : [];
    const lets = lettersRef.current ? lettersRef.current.children : [];
    const words_ = wordsRef.current ? wordsRef.current.children : [];

    const words = (t) => {
      if (!words_ || words_.length < 4) return;
      for (let i = 0; i < 4; i++) {
        const s = P[i];
        const e = i < 3 ? P[i + 1] : WEND;
        const el = words_[i];
        if (!el) continue;
        if (t < s || t >= e) {
          el.setAttribute('opacity', '0');
          continue;
        }
        const inP = clamp((t - s) / 0.35);
        const outP = clamp((e - t) / 0.2);
        const k = 0.7 + 0.3 * back(inP);
        el.setAttribute('opacity', (inP * outP).toFixed(3));
        el.setAttribute(
          'transform',
          'translate(500 820) scale(' +
            k.toFixed(3) +
            ') translate(0 ' +
            ((1 - inP) * 14).toFixed(1) +
            ')'
        );
      }
    };

    const frame = (t) => {
      if (!scene || !beam || !disc || !r1 || !r2 || !dia || !dp || !cpp || !letters || !logo) return;

      const g = ease(clamp(t / 0.8));
      const shrink = ease(clamp((t - 5.45) / 0.55));
      const sc = 0.45 + 0.55 * g * (1 - shrink);
      const tin = ease(clamp((t - 3.8) / 0.7));
      const tout = ease(clamp((t - 5.4) / 0.5));
      const tau = tin * (1 - tout);
      const c = 1 - 0.7 * tau;
      const cy = 500 + 120 * tau;

      scene.setAttribute('transform', 'translate(500 ' + cy.toFixed(1) + ') scale(' + sc.toFixed(4) + ')');

      // ring + disc flatten into a platform
      [disc, r1, r2].forEach((e, i) => {
        if (!e) return;
        const rr = i === 2 ? 178 : 190;
        e.setAttribute('ry', (rr * c).toFixed(2));
      });

      // diamond core
      const m = ease(clamp((t - 0.1) / 0.8)) * (1 - ease(clamp((t - 5.3) / 0.5)));
      const pts = HG.map((h, i) => {
        return (
          (lerp(h[0], DM[i][0], m) * R).toFixed(1) +
          ',' +
          (lerp(h[1], DM[i][1], m) * R).toFixed(1)
        );
      }).join(' ');
      dp.setAttribute('points', pts);
      cpp.setAttribute('points', pts);
      dia.setAttribute('transform', 'scale(1 ' + c.toFixed(3) + ')');

      // letters slide through the diamond
      let u = 0;
      STEPS.forEach((s) => {
        u += ease(clamp((t - s) / 0.4));
      });
      const lv = ease(clamp((t - 0.55) / 0.35)) * (1 - ease(clamp((t - 3.65) / 0.4)));
      letters.setAttribute('opacity', lv.toFixed(3));
      for (let i = 0; i < 4; i++) {
        if (lets[i]) {
          lets[i].setAttribute(
            'transform',
            'translate(' +
              ((i - u) * 150).toFixed(1) +
              ' 0) scale(' +
              S +
              ') translate(' +
              -cx[i] +
              ' -625.5)'
          );
        }
      }

      // light beam rises, ARAH appears inside it
      const b = ease(clamp((t - 4.2) / 0.5)) * (1 - ease(clamp((t - 5.3) / 0.4)));
      beam.setAttribute('transform', 'scale(1 ' + Math.max(b, 0.001).toFixed(3) + ')');
      const li = ease(clamp((t - 4.45) / 0.45));
      const lo = ease(clamp((t - 5.25) / 0.35));
      logo.setAttribute('opacity', (li * (1 - lo)).toFixed(3));
      logo.setAttribute('transform', 'translate(0 ' + ((1 - li) * 24 - lo * 20).toFixed(1) + ')');

      // four nodes orbit in quarter-turn steps
      let rot = ease(clamp((t - 0.45) / 0.7));
      STEPS.forEach((s) => {
        rot += ease(clamp((t - s) / 0.45));
      });
      rot *= Math.PI / 2;
      for (let k = 0; k < 4; k++) {
        if (nodes[k]) {
          const a = rot + (k * Math.PI) / 2 - Math.PI / 2;
          const rx = 16;
          nodes[k].setAttribute('cx', (R * Math.cos(a)).toFixed(1));
          nodes[k].setAttribute('cy', (R * c * Math.sin(a)).toFixed(1));
          nodes[k].setAttribute('rx', String(rx));
          nodes[k].setAttribute('ry', (rx * (0.4 + 0.6 * c)).toFixed(2));
        }
      }
      words(t);
    };

    // Accessibility: Respect prefers-reduced-motion
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      frame(4.9);
      const reducedTimer = setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }, 900);
      return () => clearTimeout(reducedTimer);
    }

    const TARGET_DURATION = 5.0; // Seconds to reach full logo reveal peak
    const t0 = performance.now();
    let prevT = 0;
    let lastTime = t0;

    const loop = (now) => {
      const t = (now - t0) / 1000;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Web Audio sound trigger check if user unlocked
      if (dt < 0.4 && soundUnlockedRef.current) {
        EV.forEach((e) => {
          const a = e[0];
          const hit = t >= prevT ? prevT < a && a <= t : a > prevT || a <= t;
          if (hit) playSoundEvent(e[1]);
        });
      }
      prevT = t;

      if (t >= TARGET_DURATION) {
        // Freeze at full logo reveal peak and trigger completion
        frame(TARGET_DURATION);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
        return;
      }

      frame(t);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    // Hard fallback safety timer to ensure loading screen never locks permanently
    const safetyTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    }, 5800);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      clearTimeout(safetyTimer);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [onComplete]);

  return (
    <div
      className="arah-intro-container"
      onPointerDown={unlockAudio}
      role="banner"
      aria-label="ARAH Loading Animation"
    >
      <svg
        viewBox="0 0 1000 1000"
        role="img"
        aria-label="ARAH loading"
        className="arah-intro-svg"
      >
        <defs>
          <linearGradient id="intro-bg" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0" stopColor="var(--beam)" stopOpacity="var(--beamA)" />
            <stop offset="1" stopColor="var(--beam)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="intro-cc">
            <circle r="156" />
          </clipPath>
          <clipPath id="intro-cp">
            <polygon id="cpp" ref={cppRef} points="0,0" />
          </clipPath>
          <path
            id="intro-gA1"
            fillRule="evenodd"
            d="M202 488H218L351 763H296L278 722H136L118 763H63Z M208 578L244 650L208 714L173 650Z"
          />
          <path
            id="intro-gR"
            d="M382 488H500C560 488 599 520 599 580C599 625 575 652 540 665L613 763H549L462 648V628H500C530 628 548 610 548 583C548 556 530 538 500 538H431V763H382Z"
          />
          <path
            id="intro-gA2"
            fillRule="evenodd"
            d="M762 488H778L907 763H852L834 722H702L685 763H629Z M768 580L802 650L768 714L736 650Z"
          />
          <path
            id="intro-gH"
            d="M939 490H990V600H1125V490H1173V763H1125V650H990V763H939Z"
          />
        </defs>

        <g id="scene" ref={sceneRef} className="arah-intro-glow">
          <polygon
            id="beam"
            ref={beamRef}
            points="-72,0 72,0 340,-380 -340,-380"
            fill="url(#intro-bg)"
          />
          <ellipse id="disc" ref={discRef} rx="190" ry="190" fill="var(--disc)" />
          <ellipse
            id="r1"
            ref={r1Ref}
            rx="190"
            ry="190"
            fill="none"
            stroke="var(--ring)"
            strokeWidth="14"
          />
          <ellipse
            id="r2"
            ref={r2Ref}
            rx="178"
            ry="178"
            fill="none"
            stroke="var(--ring2)"
            strokeWidth="3"
          />
          <g id="dia" ref={diaRef}>
            <polygon id="dp" ref={dpRef} fill="var(--dia)" clipPath="url(#intro-cc)" />
            <g id="letters" ref={lettersRef} clipPath="url(#intro-cp)" fill="var(--letter)">
              <use href="#intro-gA1" />
              <use href="#intro-gR" />
              <use href="#intro-gA2" />
              <use href="#intro-gH" />
            </g>
          </g>
          <g id="logo" ref={logoRef} fill="var(--logo)">
            <g transform="translate(-222.5 -475.2) scale(.36)">
              <use href="#intro-gA1" />
              <use href="#intro-gR" />
              <use href="#intro-gA2" />
              <use href="#intro-gH" />
            </g>
          </g>
          <g id="nodes" ref={nodesRef} fill="var(--node)">
            <ellipse />
            <ellipse />
            <ellipse />
            <ellipse />
          </g>
        </g>

        <g id="words" ref={wordsRef} className="arah-intro-glow">
          <text className="arah-intro-w" opacity="0">
            <tspan className="a">A</tspan>UTONOMOUS
          </text>
          <text className="arah-intro-w" opacity="0">
            <tspan className="a">R</tspan>EASONING
          </text>
          <text className="arah-intro-w" opacity="0">
            <tspan className="a">A</tspan>DAPTIVE
          </text>
          <text className="arah-intro-w" opacity="0">
            <tspan className="a">H</tspan>EURISTIC
          </text>
        </g>
      </svg>
    </div>
  );
}

