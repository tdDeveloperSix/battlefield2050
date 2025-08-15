import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Nullable<T> = T | null;

function createNoiseBuffer(context: AudioContext, durationSeconds = 2): AudioBuffer {
  const sampleRate = context.sampleRate;
  const length = durationSeconds * sampleRate;
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6; // white noise amplitude
  }
  return buffer;
}

const JammingControl: React.FC = () => {
  const { t } = useTranslation();
  const [ratio, setRatio] = useState<number>(0); // 0..100 → J/S 0..10
  const [panelOpen, setPanelOpen] = useState(false);
  const [isZoneActive, setIsZoneActive] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [bottomOffset, setBottomOffset] = useState<number>(112);

  const audioContextRef = useRef<Nullable<AudioContext>>(null);
  const signalOscRef = useRef<Nullable<OscillatorNode>>(null);
  const signalGainRef = useRef<Nullable<GainNode>>(null);
  const noiseSrcRef = useRef<Nullable<AudioBufferSourceNode>>(null);
  const noiseGainRef = useRef<Nullable<GainNode>>(null);
  const masterGainRef = useRef<Nullable<GainNode>>(null);

  const jOverS = useMemo(() => 0.1 * ratio, [ratio]);
  const level = useMemo(() => {
    const x = ratio / 100;
    if (x < 0.20) return 0;
    if (x < 0.40) return 1;
    if (x < 0.65) return 2;
    if (x < 0.85) return 3;
    return 4;
  }, [ratio]);

  const enabled = isZoneActive && !manualPaused;

  // Match BackToTop bottom offset so the control hovers lige over den
  useEffect(() => {
    const updateOffset = () => {
      const bar = document.querySelector('[data-role="decision-weight-bar"]') as HTMLElement | null;
      const barHeight = bar ? bar.getBoundingClientRect().height : 0;
      // Fjern visualViewport kode der kan forårsage scroll-spring
      const base = 24; // px ekstra luft
      const backToTopGap = 64; // placer knappen tydeligt OVER "Til top"-knappen
      const off = Math.max(96, Math.ceil(barHeight) + base);
      setBottomOffset(off + backToTopGap);
    };
    updateOffset();
    // Throttle resize events for stabilitet
    let resizeTimeout: number | null = null;
    const throttledUpdate = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateOffset, 100);
    };
    window.addEventListener('resize', throttledUpdate);
    return () => {
      window.removeEventListener('resize', throttledUpdate);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  // Track when "Machine Superiority" section is in view and compute progress
  useEffect(() => {
    const section = document.getElementById('machine-superiority');
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Active when any part of section is visible
      const active = rect.bottom > 0 && rect.top < viewH;
      setIsZoneActive(active);
      // Progress (0 top -> 1 bottom) with small margins
      const docTop = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const start = sectionTop - viewH * 0.1;
      const end = sectionTop + sectionHeight - viewH * 0.1;
      const t = Math.min(1, Math.max(0, (docTop - start) / (end - start)));
      if (enabled && !panelOpen) {
        setRatio(Math.round(t * 100));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled, panelOpen]);

  // Auto-hide panelet efter inaktivitet, især på mobil
  useEffect(() => {
    if (!panelOpen) return;
    const timer = setTimeout(() => setPanelOpen(false), 4000);
    return () => clearTimeout(timer);
  }, [panelOpen]);

  function getRootEl(): HTMLElement | null {
    return document.querySelector('.matrix-theme');
  }

  function ensureAudio() {
    if (audioContextRef.current) return;
    const Ctx: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440;
    const signalGain = ctx.createGain();
    signalGain.gain.value = 0.2;
    osc.connect(signalGain).connect(master);

    const noiseBuffer = createNoiseBuffer(ctx, 4);
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    noiseSrc.connect(noiseGain).connect(master);

    audioContextRef.current = ctx;
    signalOscRef.current = osc;
    signalGainRef.current = signalGain;
    noiseSrcRef.current = noiseSrc;
    noiseGainRef.current = noiseGain;
    masterGainRef.current = master;
  }

  function start() {
    ensureAudio();
    const ctx = audioContextRef.current!;
    if (ctx.state === 'suspended') ctx.resume();
    try { signalOscRef.current!.start(); } catch {}
    try { noiseSrcRef.current!.start(); } catch {}
  }

  function stop() {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    try { signalOscRef.current?.stop(); } catch {}
    try { noiseSrcRef.current?.stop(); } catch {}
    ctx.close();
    audioContextRef.current = null;
    signalOscRef.current = null;
    signalGainRef.current = null;
    noiseSrcRef.current = null;
    noiseGainRef.current = null;
    masterGainRef.current = null;
  }

  useEffect(() => {
    const root = getRootEl();
    if (!root) return;
    root.classList.toggle('jamming-active', enabled);
    if (!enabled) {
      root.removeAttribute('data-jam-level');
      stop();
      return;
    }
    // When enabled set initial intensity and start audio
    root.setAttribute('data-jam-level', String(level));
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    const root = getRootEl();
    if (!root || !enabled) return;
    root.setAttribute('data-jam-level', String(level));
    const signalAmp = signalGainRef.current?.gain?.value ?? 0.2;
    const noiseScale = [0.0, 0.4, 0.9, 1.6, 2.2][level] ?? 0;
    const noiseAmp = noiseScale * signalAmp;
    if (noiseGainRef.current && audioContextRef.current) {
      noiseGainRef.current.gain.setTargetAtTime(noiseAmp, audioContextRef.current.currentTime, 0.05);
    }
  }, [level, enabled]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return (
    <div
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bottomOffset}px)` }}
      className={`fixed right-4 sm:right-6 z-[55] transition-opacity ${isZoneActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!isZoneActive}
    >
      {/* Toggle button */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => {
            setManualPaused(p => !p);
            setPanelOpen(true);
          }}
          title={t('jamming.title') ?? 'Jamming'}
          className={`jam-toggle w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-emerald-400 text-emerald-300 transition opacity-90 hover:opacity-100 focus:opacity-100 ${enabled ? 'bg-emerald-500/95 text-black' : 'bg-black/70'}`}
          aria-pressed={enabled}
        >
          {enabled ? (
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
          ) : (
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        {/* Small panel */}
        {isZoneActive && panelOpen && (
          <div className="bg-black/70 backdrop-blur-sm border border-emerald-400 rounded-md p-3 w-60 sm:w-64 shadow-lg mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300">{t('jamming.sliderAria')}</span>
              <button
                className="text-xs px-2 py-1 rounded border border-emerald-400 text-emerald-300 hover:bg-emerald-400 hover:text-black"
                onClick={() => setManualPaused(p => !p)}
                aria-pressed={manualPaused}
              >
                {manualPaused ? '▶' : '■'}
              </button>
            </div>
            <input
              type="range" min={0} max={100} value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full accent-emerald-400 h-1.5"
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-400">{t('jamming.clean')}</span>
              <span className="text-slate-400">{t('jamming.jammed')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JammingControl;


