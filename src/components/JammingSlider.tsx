import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Nullable<T> = T | null;

function createNoiseBuffer(context: AudioContext, durationSeconds = 2): AudioBuffer {
  const sampleRate = context.sampleRate;
  const length = durationSeconds * sampleRate;
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6; // white noise -60% amplitude
  }
  return buffer;
}

const JammingSlider: React.FC = () => {
  const { t } = useTranslation();
  const [ratio, setRatio] = useState<number>(0); // 0..100 => J/S from 0..10
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioContextRef = useRef<Nullable<AudioContext>>(null);
  const signalOscRef = useRef<Nullable<OscillatorNode>>(null);
  const signalGainRef = useRef<Nullable<GainNode>>(null);
  const noiseSrcRef = useRef<Nullable<AudioBufferSourceNode>>(null);
  const noiseGainRef = useRef<Nullable<GainNode>>(null);
  const masterGainRef = useRef<Nullable<GainNode>>(null);
  const isStartingRef = useRef(false);
  const signalStartedRef = useRef(false);
  const noiseStartedRef = useRef(false);

  const jOverS = useMemo(() => 0.1 * ratio, [ratio]); // 0..10
  const jOverSdb = useMemo(() => (jOverS > 0 ? 10 * Math.log10(jOverS) : -Infinity), [jOverS]);

  const glitchIntensity = useMemo(() => Math.min(1, jOverS / 2), [jOverS]); // cap at 1

  function setupAudio() {
    if (audioContextRef.current) return;
    const Ctx: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // Signal: steady tone (represents desired signal)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440; // A4
    const signalGain = ctx.createGain();
    signalGain.gain.value = 0.2; // baseline amplitude
    osc.connect(signalGain).connect(master);

    // Noise
    const noiseBuffer = createNoiseBuffer(ctx, 4);
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0; // will be set by slider
    noiseSrc.connect(noiseGain).connect(master);

    audioContextRef.current = ctx;
    signalOscRef.current = osc;
    signalGainRef.current = signalGain;
    noiseSrcRef.current = noiseSrc;
    noiseGainRef.current = noiseGain;
    masterGainRef.current = master;
    signalStartedRef.current = false;
    noiseStartedRef.current = false;
  }

  const startAudio = async () => {
    if (isStartingRef.current) return;

    setupAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (signalStartedRef.current && noiseStartedRef.current) {
      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch (error) {
          console.error('Error resuming jamming audio context', error);
        }
      }
      setIsPlaying(true);
      return;
    }

    isStartingRef.current = true;
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (signalOscRef.current && !signalStartedRef.current) {
        signalOscRef.current.start();
        signalStartedRef.current = true;
      }
      if (noiseSrcRef.current && !noiseStartedRef.current) {
        noiseSrcRef.current.start();
        noiseStartedRef.current = true;
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting jamming audio', error);
      stopAudio();
    } finally {
      isStartingRef.current = false;
    }
  };

  function stopAudio() {
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
    signalStartedRef.current = false;
    noiseStartedRef.current = false;
    isStartingRef.current = false;
    setIsPlaying(false);
  }

  useEffect(() => {
    // Update noise gain based on ratio
    const signalGain = signalGainRef.current?.gain?.value ?? 0.2;
    const amp = Math.sqrt(jOverS) * signalGain; // amplitude proportional to sqrt(power)
    if (noiseGainRef.current) {
      noiseGainRef.current.gain.setTargetAtTime(amp, audioContextRef.current?.currentTime ?? 0, 0.05);
    }
  }, [jOverS]);

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          {t('jamming.title')}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={isPlaying ? stopAudio : startAudio}
            className="px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 text-white"
          >
            {isPlaying ? t('jamming.stop') : t('jamming.play')}
          </button>
        </div>
      </div>
      <p className="text-slate-300 text-sm sm:text-base mb-4">{t('jamming.subtitle')}</p>

      <div className="mb-6">
        <input
          type="range"
          min={0}
          max={100}
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
          className="w-full accent-emerald-400"
          aria-label={t('jamming.sliderAria')}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{t('jamming.clean')}</span>
          <span>{t('jamming.jammed')}</span>
        </div>
        <div className="mt-2 text-slate-300 text-sm">
          <span className="font-mono">J/S ≈ {jOverS.toFixed(2)}</span>
          <span className="mx-2">•</span>
          <span className="font-mono">{t('jamming.db')}: {Number.isFinite(jOverSdb) ? jOverSdb.toFixed(1) : '-∞'} dB</span>
        </div>
      </div>

      {/* Glitching text */}
      <div
        className="glitch-container"
        style={{ ['--glitch-intensity' as any]: String(glitchIntensity) }}
      >
        <p className="glitch-text text-lg text-slate-200 leading-relaxed">
          {t('jamming.sampleText')}
        </p>
      </div>
    </div>
  );
};

export default JammingSlider;

