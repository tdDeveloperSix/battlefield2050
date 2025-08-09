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
  const [enabled, setEnabled] = useState(false);
  const [ratio, setRatio] = useState<number>(0); // 0..100 → J/S 0..10
  const [panelOpen, setPanelOpen] = useState(false);

  const audioContextRef = useRef<Nullable<AudioContext>>(null);
  const signalOscRef = useRef<Nullable<OscillatorNode>>(null);
  const signalGainRef = useRef<Nullable<GainNode>>(null);
  const noiseSrcRef = useRef<Nullable<AudioBufferSourceNode>>(null);
  const noiseGainRef = useRef<Nullable<GainNode>>(null);
  const masterGainRef = useRef<Nullable<GainNode>>(null);

  const jOverS = useMemo(() => 0.1 * ratio, [ratio]);

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
      root.style.removeProperty('--jamming-intensity');
      root.style.removeProperty('--jamming-eased');
      stop();
      return;
    }
    // When enabled set initial intensity and start audio
    // Visual intensity scaled to full range only near slider end
    // jOverS in [0,10] -> intensity in [0,1]
    const intensity = Math.min(1, jOverS / 10);
    const eased = Math.pow(intensity, 1.6); // gradvis start, men tydelig slut
    root.style.setProperty('--jamming-intensity', String(eased));
    root.style.setProperty('--jamming-eased', String(eased));
    root.classList.toggle('jamming-max', eased > 0.9);
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    const root = getRootEl();
    if (!root || !enabled) return;
    const intensity = Math.min(1, jOverS / 10);
    const eased = Math.pow(intensity, 1.6);
    root.style.setProperty('--jamming-intensity', String(eased));
    root.style.setProperty('--jamming-eased', String(eased));
    root.classList.toggle('jamming-max', eased > 0.9);
    const signalAmp = signalGainRef.current?.gain?.value ?? 0.2;
    const noiseAmp = Math.sqrt(jOverS) * signalAmp;
    if (noiseGainRef.current && audioContextRef.current) {
      noiseGainRef.current.gain.setTargetAtTime(noiseAmp, audioContextRef.current.currentTime, 0.05);
    }
  }, [jOverS, enabled]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40">
      {/* Toggle button */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => setEnabled(v => !v)}
          title={t('jamming.title') ?? 'Jamming'}
          className={`w-12 h-12 rounded-full border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition ${enabled ? 'bg-emerald-400 text-black' : 'bg-transparent'}`}
        >
          JS
        </button>
        {/* Small panel */}
        {enabled && (
          <div className="bg-black/70 border border-emerald-400 rounded-md p-3 w-56 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300">{t('jamming.sliderAria')}</span>
              <button
                className="text-xs text-slate-400 hover:text-white"
                onClick={() => setPanelOpen(p => !p)}
              >
                {panelOpen ? '−' : '+'}
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            {panelOpen && (
              <div className="mt-2 text-xs text-slate-300 font-mono">
                J/S≈{jOverS.toFixed(2)} • {t('jamming.db')}: {jOverS > 0 ? (10 * Math.log10(jOverS)).toFixed(1) : '-∞'} dB
              </div>
            )}
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


