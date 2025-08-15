import React, { useEffect, useRef, useState } from 'react';

// "Plat & Krone" — to søjlediagrammer, der afspiller kast løbende (udfalds-baseret)
// Tilpasset XNET-temaet: mørk baggrund, grøn/cyan accent, kort-layout som resten af siden.

export default function PlatOgKroneBars(): JSX.Element {
  // Mål (hvor mange spil vi vil nå)
  const [targetN, setTargetN] = useState<number>(50000);
  // Hastighed (kast pr. sekund)
  const [speed, setSpeed] = useState<number>(250);
  // Sandsynlighed for KRONE (0.5 = fair). Bruges kun til at generere udfald, ikke til beregning
  const [p, setP] = useState<number>(0.5);

  // Tællere
  const [heads, setHeads] = useState<number>(0);
  const [tails, setTails] = useState<number>(0);

  // Afspilning
  const [playing, setPlaying] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const fracRef = useRef<number>(0); // akkumulerer brøkdele af kast mellem frames

  const played = heads + tails;

  // --- Statistik: eksakt to-sidet binomialtest (små n) + z-approx (store n) ---
  function erf(x: number) {
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const a1 = 0.254829592,
      a2 = -0.284496736,
      a3 = 1.421413741,
      a4 = -1.453152027,
      a5 = 1.061405429,
      pp = 0.3275911;
    const t = 1 / (1 + pp * x);
    const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
    return sign * y;
  }
  function normCdf(z: number) {
    return 0.5 * (1 + erf(z / Math.SQRT2));
  }

  function binomPValueTwoSided(k: number, n: number, p0 = 0.5): number {
    if (n <= 0) return 1;
    if (k < 0 || k > n) return 1;
    // Hurtig normal-approx for store n (med kontinuitetskorrektion)
    if (n > 5000) {
      const den = Math.sqrt(n * p0 * (1 - p0));
      const z = (Math.abs(k - n * p0) - 0.5) / den;
      const p = 2 * (1 - normCdf(z));
      return Math.min(1, Math.max(0, p));
    }
    // Eksakt to-sidet i log-rum
    const logFact = new Float64Array(n + 1);
    logFact[0] = 0;
    for (let i = 1; i <= n; i++) logFact[i] = logFact[i - 1] + Math.log(i);

    const logp = Math.log(p0), logq = Math.log(1 - p0);
    function logBinom(i: number): number {
      return logFact[n] - logFact[i] - logFact[n - i] + i * logp + (n - i) * logq;
    }

    const t = logBinom(k);
    // log-sum-exp over alle i med pmf(i) <= pmf(k)
    let m = -Infinity;
    const logs: number[] = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
      const li = logBinom(i);
      logs[i] = li;
      if (li <= t && li > m) m = li;
    }
    let acc = 0;
    for (let i = 0; i <= n; i++) if (logs[i] <= t) acc += Math.exp(logs[i] - m);
    const p = Math.exp(Math.log(acc) + m);
    return Math.min(1, Math.max(0, p));
  }

  function wilsonCI(k: number, n: number, z = 1.96): { lo: number; hi: number } {
    if (n === 0) return { lo: 0, hi: 1 };
    const phat = k / n;
    const z2 = z * z;
    const denom = 1 + z2 / n;
    const center = (phat + z2 / (2 * n)) / denom;
    const half = (z * Math.sqrt((phat * (1 - phat) + z2 / (4 * n)) / n)) / denom;
    return { lo: Math.max(0, center - half), hi: Math.min(1, center + half) };
  }

  const pHat = played > 0 ? heads / played : 0;
  const pValue = played > 0 ? binomPValueTwoSided(heads, played, 0.5) : 1;
  const signif = played > 0 && pValue < 0.05;
  const ci = played > 0 ? wilsonCI(heads, played) : { lo: 0, hi: 1 };

  // --- Afspilnings-motor ---
  function step(k: number) {
    if (k <= 0) return;
    let h = 0;
    for (let i = 0; i < k; i++) if (Math.random() < p) h++;
    const t = k - h;
    setHeads((x) => x + h);
    setTails((x) => x + t);
  }

  function loop(ts: number) {
    if (!playing) return;
    const last = lastTsRef.current ?? ts;
    const dt = Math.max(0, ts - last); // ms
    lastTsRef.current = ts;

    // Hvor mange kast burde vi afvikle i denne frame?
    const castsFloat = (speed * dt) / 1000 + fracRef.current;
    let casts = Math.floor(castsFloat);
    fracRef.current = castsFloat - casts;

    // Begræns så vi ikke overskrider målet
    if (played + casts > targetN) casts = Math.max(0, targetN - played);

    if (casts > 0) step(casts);

    // Stop automatisk når målet er nået
    if (played + casts >= targetN) {
      setPlaying(false);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    if (playing) {
      lastTsRef.current = null; // start ny tidsmåling
      rafRef.current = requestAnimationFrame(loop);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      };
    }
  }, [playing, speed, p, targetN, played]);

  // Farver
  const txt = '#E6EEF8';
  const sub = '#9AB0C9';
  const accentFrom = '#22d3ee'; // cyan-400
  const accentTo = '#22c55e'; // emerald-500

  // Søjle-styles
  const barWrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 16,
    height: 220,
  };
  const barBase: React.CSSProperties = {
    width: 120,
    background: `linear-gradient(180deg, ${accentFrom}, ${accentTo})`,
    borderRadius: 10,
    transition: 'height 160ms ease',
    boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
  };

  const headsPct = played > 0 ? Math.round((heads / played) * 100) : 0;
  const tailsPct = 100 - headsPct;
  const pHatPct = Math.round(pHat * 100);

  // Kontrol-handlers
  const togglePlay = () => {
    if (played >= targetN) return; // nået målet
    setPlaying((s) => !s);
  };
  const resetAll = () => {
    setPlaying(false);
    setHeads(0);
    setTails(0);
    lastTsRef.current = null;
    fracRef.current = 0;
  };

  // Manuel step-knapper er fjernet for et renere UI

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Plat & Krone — udfald i realtid</h3>
          <div className="flex gap-2">
            <button
              onClick={togglePlay}
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`, color: '#061016' }}
              title={played >= targetN ? 'Mål nået' : playing ? 'Pause' : 'Afspil'}
            >
              {played >= targetN ? 'Færdig' : playing ? 'Pause' : 'Afspil'}
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: '#0A1220', color: '#fca5a5', border: '1px solid #46262a' }}
              title="Nulstil (sæt alt til 0)"
            >
              Nulstil
            </button>
          </div>
        </header>

        {/* Kontroller */}
        <section className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm" style={{ color: sub }}>Mål (antal spil)</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="range"
                min={1}
                max={50000}
                step={1}
                value={targetN}
                onChange={(e) => setTargetN(Math.max(1, Math.min(50000, parseInt(e.target.value || '1'))))}
                className="w-full slider"
              />
              <input
                type="number"
                className="w-28 rounded-lg px-2 py-1 bg-black/30 outline-none"
                value={targetN}
                min={1}
                max={50000}
                step={1}
                onChange={(e) => setTargetN(Math.max(1, Math.min(50000, parseInt(e.target.value || '1'))))}
              />
            </div>
            <div className="text-xs mt-1" style={{ color: sub }}>Spillet stopper automatisk ved målet.</div>
          </div>

          <div>
            <label className="text-sm" style={{ color: sub }}>Hastighed (kast/sek.)</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="range"
                min={1}
                max={5000}
                step={1}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full slider"
              />
              <input
                type="number"
                className="w-28 rounded-lg px-2 py-1 bg-black/30 outline-none"
                value={speed}
                min={1}
                max={5000}
                onChange={(e) => setSpeed(Math.max(1, Math.min(5000, parseInt(e.target.value || '1'))))}
              />
            </div>
          </div>

          <div>
            <label className="text-sm" style={{ color: sub }}>Sandsynlighed for krone (p)</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={p}
                onChange={(e) => setP(parseFloat(e.target.value))}
                className="w-full slider"
              />
              <input
                type="number"
                className="w-28 rounded-lg px-2 py-1 bg-black/30 outline-none"
                value={p}
                step={0.01}
                min={0}
                max={1}
                onChange={(e) => setP(Math.max(0, Math.min(1, parseFloat(e.target.value || '0'))))}
              />
            </div>
            <div className="text-xs mt-1" style={{ color: sub }}>Brug p til at lave en "rigged" mønt (fx 0.55).</div>
          </div>
        </section>

        {/* Statuslinje */}
        <section className="grid sm:grid-cols-4 gap-4">
          <Stat label="Kast spillet" value={`${played.toLocaleString()} / ${targetN.toLocaleString()}`} />
          <Stat label="Krone" value={`${heads.toLocaleString()}`} />
          <Stat label="Plat" value={`${tails.toLocaleString()}`} />
          <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: '#0A1220' }}>
            <div>
              <div className="opacity-80 text-xs">p-værdi (to-sidet, H₀: 50%)</div>
              <div className="font-medium tabular-nums text-lg">{played ? (pValue < 0.001 ? '< 0.001' : pValue.toFixed(3)) : '—'}</div>
              <div className="opacity-80 text-xs mt-1">{played ? `95% CI (Wilson): ${(ci.lo*100).toFixed(1)}–${(ci.hi*100).toFixed(1)}%` : ' '}</div>
            </div>
            <span
              className="px-2 py-1 rounded-md text-xs font-semibold"
              style={{ background: signif ? '#10b98120' : '#f59e0b20', color: signif ? '#34d399' : '#fbbf24' }}
            >
              {signif ? 'Signifikant' : 'Ikke signifikant'}
            </span>
          </div>
        </section>

        {/* Søjlediagram #1: Antal krone vs. plat */}
        <section>
          <h4 className="text-lg font-semibold mb-2">Fordeling: Krone vs. Plat</h4>
          <p className="text-sm mb-4" style={{ color: sub }}>
            Ved få sessioner ses tilfældige udsving — roligere, tydeligere
            mønstre ses først, når der er mange kast.
          </p>
          <div style={barWrap}>
            <div title={`Krone: ${heads} (${headsPct}%)`} style={{ ...barBase, height: `${Math.max(2, headsPct)}%` }} />
            <div
              title={`Plat: ${tails} (${tailsPct}%)`}
              style={{ ...barBase, height: `${Math.max(2, tailsPct)}%`, background: `linear-gradient(180deg, ${accentTo}, ${accentFrom})` }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <Stat label="Krone (andel)" value={`${played ? Math.round((heads / played) * 100) : 0}%`} />
            <Stat label="Plat (andel)" value={`${played ? Math.round((tails / played) * 100) : 0}%`} />
          </div>
        </section>

        {/* Sektion med andel vs. reference er bevidst fjernet for et mere fokuseret UI */}

        <footer className="text-xs" style={{ color: sub }}>
          Alt, du ser, er resultatet af <span className="font-semibold">faktiske kast</span> (tilfældige udfald). p-værdien er
          en praktisk indikator, ikke et bevis — Du ser at det kræver mange kast for at skelne signifikans fra tilfældighed.
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: '#0A1220' }}>
      <span className="opacity-80 text-xs">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}


