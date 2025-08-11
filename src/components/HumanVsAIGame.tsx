import React, { useEffect } from 'react';

function defineHumanVsAIGame(): void {
  if (typeof window === 'undefined') return;
  if (customElements.get('human-vs-ai-game')) return;

  const TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML = `
  <style>
    :host { --bg:#070a16; --panel:#0e1533; --muted:#9fb2d0; --ok:#66ffad; --warn:#ffd26b; --bad:#ff6d8a; --blue:#69b3ff; --edge:#1b244a; --green:#18cc75; font-family: inherit; position:relative; display:block; }
    *,*::before,*::after { box-sizing: border-box; }
    .game { background: linear-gradient(180deg, #0a1026 0%, #070a16 100%); border:1px solid rgba(255,255,255,.06); border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.35); }
    header { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:rgba(255,255,255,.03); gap:8px; }
    .brand { display:flex; align-items:center; gap:10px; }
    .logo { width:38px; height:38px; border-radius:12px; background: radial-gradient(circle at 30% 30%, #69b3ff, #2c5ea8 70%); display:grid; place-items:center; color:#051024; font-weight:900; }
    h1 { margin:0; font-size:16px; font-weight:700; }
    .small { margin:0; font-size:12px; color:var(--muted); }
    .chip { font-size:12px; background:#0e1533; border:1px solid rgba(255,255,255,.07); color:#cfe6ff; padding:6px 10px; border-radius:999px; white-space:nowrap; }

    .content { padding:14px; display:grid; gap:12px; }
    .score { display:flex; gap:8px; flex-wrap:wrap; }
    .modes { display:flex; gap:8px; }
    .mode { appearance:none; border:1px solid rgba(255,255,255,.1); background:#0e1533; color:#e9eef6; border-radius:999px; padding:6px 10px; font-size:12px; cursor:pointer; }
    .mode[aria-pressed="true"]{ outline:2px solid #69b3ff; }

    .arena { position:relative; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,.08); height:56vh; min-height:320px; display:grid; place-items:center; user-select:none; touch-action:manipulation; }
    .arena.wait { background:#2b1530; }
    .arena.ready { background:#2a1d43; }
    .arena.go { background:#0f2f26; }
    .arena .msg { text-align:center; padding:12px; }
    .arena .msg h2 { margin:0 0 6px 0; font-size:24px; }
    .arena .msg p { margin:0; color:var(--muted); }

    .controls { display:flex; gap:8px; }
    .btn { appearance:none; border:none; background:#162257; color:#e9eef6; padding:10px 14px; border-radius:12px; font-weight:600; cursor:pointer; font-family: inherit; }
    .btn.secondary { background:#0e1533; border:1px solid rgba(255,255,255,.08); font-weight:600; }
    .btn:disabled { opacity:.6; cursor:not-allowed; }

    .roundbar { position:relative; height:10px; border-radius:999px; overflow:hidden; background:#0b1431; border:1px solid rgba(255,255,255,.06); }
    .roundbar i { position:absolute; inset:0; width:var(--w,0%); background:linear-gradient(90deg,#2f9fff,#69b3ff); }

    .result { display:grid; gap:6px; background:#0e1533; border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:10px; font-size:14px; }

    .overlay { position:absolute; inset:0; background:rgba(6,9,20,.82); display:none; place-items:center; padding:14px; z-index:40; }
    .overlay.show { display:grid; }
    .card { width:100%; max-width:440px; border-radius:18px; background:#0e1533; border:1px solid rgba(255,255,255,.1); padding:14px; display:grid; gap:10px; text-align:center; }
    .card h3{ margin:0; font-size:20px; }
    .times { display:flex; justify-content:space-between; gap:8px; }
    .times .box { flex:1; background:#0b1431; border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:10px; }
    .times h4 { margin:0 0 4px 0; font-size:13px; color:var(--muted); }
    .times .val { font-size:22px; font-weight:800; }

    .winner { font-weight:800; }
    .win { color:var(--ok); }
    .lose { color:var(--bad); }

    @media (min-width:520px){ .arena{ height:60vh; } }
  </style>

  <div class="game" role="region" aria-label="Human vs AI – Reaction Duel">
    <header>
      <div class="brand">
        <div class="logo">⚡</div>
        <div>
          <h1>Human vs AI</h1>
          <p class="small">Reaktionstest – bedst af 5</p>
        </div>
      </div>
      <div class="score">
        <span class="chip js-round">Runde 1/5</span>
        <span class="chip js-humanPB" title="Din bedste tid">PB: –</span>
        <span class="chip js-aimu" title="AI-reaktion (μ)">AI μ: –</span>
      </div>
    </header>

    <section class="content">
      <div class="modes" role="group" aria-label="Sværhedsgrad">
        <button class="mode js-mode" data-k="easy" aria-pressed="false">Let</button>
        <button class="mode js-mode" data-k="med" aria-pressed="true">Mellem</button>
        <button class="mode js-mode" data-k="hard" aria-pressed="false">Svær</button>
      </div>

      <div class="arena wait" aria-live="polite">
        <div class="msg js-msg">
          <h2>Vent til GRØN</h2>
          <p>Tryk så hurtigt du kan. For tidlig tap = fejlstart.</p>
        </div>
      </div>

      <div class="controls">
        <button class="btn js-start">Start match</button>
        <button class="btn secondary js-reset">Nulstil</button>
      </div>

      <div class="roundbar"><i class="js-roundbar"></i></div>

      <div class="result js-result" aria-live="polite"></div>
    </section>
  </div>

  <div class="overlay js-ov" role="dialog" aria-modal="true">
    <div class="card">
      <h3 class="js-ov-title">Runde 1</h3>
      <div class="times">
        <div class="box"><h4>Menneske</h4><div class="val js-ht">–</div></div>
        <div class="box"><h4>AI</h4><div class="val js-at">–</div></div>
      </div>
      <div class="winner js-winner"></div>
      <div style="display:flex; gap:8px; justify-content:center;">
        <button class="btn js-next">Næste runde</button>
        <button class="btn secondary js-end">Afslut</button>
      </div>
    </div>
  </div>
  `;

  const DIFFS: Record<string, { name: string; aiMu: number; aiSigma: number; targetFactor: number }>= {
    easy: { name:'Let',     aiMu: 310, aiSigma: 45, targetFactor: 1.05 },
    med:  { name:'Mellem',  aiMu: 270, aiSigma: 40, targetFactor: 0.95 },
    hard: { name:'Svær',    aiMu: 240, aiSigma: 35, targetFactor: 0.88 },
  };

  class HumanVsAIGame extends HTMLElement{
    private $!: (s: string) => any;
    private ui!: any;
    private state: any;
    constructor(){
      super();
      this.attachShadow({mode:'open'});
      this.shadowRoot!.appendChild(TEMPLATE.content.cloneNode(true));
      const $ = (s: string) => this.shadowRoot!.querySelector(s as any);
      this.$ = $;
      this.ui = {
        arena: $('.arena'), msg: $('.js-msg'), round: $('.js-round'),
        start: $('.js-start'), reset: $('.js-reset'), result: $('.js-result'),
        roundbar: $('.js-roundbar'), modes: this.shadowRoot!.querySelectorAll('.js-mode'),
        humanPB: $('.js-humanPB'), aimu: $('.js-aimu'),
        ov: $('.js-ov'), ovTitle: $('.js-ov-title'), ht: $('.js-ht'), at: $('.js-at'), winner: $('.js-winner'), next: $('.js-next'), end: $('.js-end')
      };

      this.state = {
        round: 1, bestOf: 5,
        waiting: true, goAt: 0, goTimer: 0 as any, early: false,
        humanTimes: [] as number[], aiTimes: [] as number[],
        difficulty: 'med',
        aiMu: DIFFS.med.aiMu, aiSigma: DIFFS.med.aiSigma,
        humanPB: null as number | null
      };

      this.load();
      this.renderHeader();
      this.bind();
    }

    bind(){
      const { arena, start, reset, modes, next, end } = this.ui;
      start.addEventListener('click', ()=> this.startMatch());
      reset.addEventListener('click', ()=> this.fullReset());

      modes.forEach((btn: any)=>{
        btn.addEventListener('click', ()=> this.setDifficulty(btn.dataset.k));
      });

      arena.addEventListener('pointerdown', (e: PointerEvent)=> this.onPointer(e));

      next.addEventListener('click', ()=> {
        this.hideOverlay();
        if (this.state.round > this.state.bestOf) { this.endMatch(); return; }
        this.scheduleRound();
      });
      end.addEventListener('click', ()=> { this.hideOverlay(); this.endMatch(); });
    }

    vibrate(ms:number){ try { if ((navigator as any).vibrate) (navigator as any).vibrate(ms); } catch(_){} }

    save(){ try { localStorage.setItem('hvai-v1', JSON.stringify(this.state, (k,v)=> (k==='goTimer'?undefined:v))); } catch(_){} }
    load(){ try { const raw = localStorage.getItem('hvai-v1'); if (raw){ const d = JSON.parse(raw); Object.assign(this.state, d); } } catch(_){}
      if (!DIFFS[this.state.difficulty]) this.state.difficulty = 'med';
    }

    setDifficulty(k:string){
      if (!DIFFS[k]) return;
      this.state.difficulty = k;
      this.state.aiMu = DIFFS[k].aiMu;
      this.state.aiSigma = DIFFS[k].aiSigma;
      this.ui.modes.forEach((b: any)=> b.setAttribute('aria-pressed', String(b.dataset.k===k)));
      this.renderHeader();
      this.save();
    }

    startMatch(){
      this.state.round = 1;
      this.state.humanTimes = [];
      this.state.aiTimes = [];
      this.ui.result.textContent = '';
      this.scheduleRound();
    }

    endMatch(){
      const humanWins = this.state.humanTimes.filter((t:number,i:number)=> t < this.state.aiTimes[i]).length;
      const aiWins = this.state.aiTimes.length - humanWins;
      const sum = (arr:number[]) => arr.reduce((a,b)=>a+b,0);
      const humanAvg = this.state.humanTimes.length ? Math.round(sum(this.state.humanTimes)/this.state.humanTimes.length) : 0;
      const aiAvg = this.state.aiTimes.length ? Math.round(sum(this.state.aiTimes)/this.state.aiTimes.length) : 0;
      const msg = humanWins>aiWins? `Du vandt ${humanWins}-${aiWins}!` : humanWins<aiWins? `AI vandt ${aiWins}-${humanWins}.` : 'Uafgjort!';
      this.ui.result.innerHTML = `
        <div><strong>${msg}</strong> Gennemsnit: Menneske ${humanAvg} ms · AI ${aiAvg} ms</div>
      `;
      this.resetArena();
    }

    scheduleRound(){
      this.resetArena();
      const jitter = 700 + Math.random()*1300;
      this.state.waiting = true; this.state.early = false;
      this.ui.arena.classList.remove('go');
      this.ui.arena.classList.add('wait');
      this.ui.msg.innerHTML = `<h2>Vent til GRØN</h2><p>For tidlig tap = fejlstart</p>`;
      clearTimeout(this.state.goTimer);
      this.state.goTimer = window.setTimeout(()=> this.goSignal(), jitter);
    }

    goSignal(){
      this.state.waiting = false; this.state.early = false;
      this.state.goAt = performance.now();
      this.ui.arena.classList.remove('wait');
      this.ui.arena.classList.add('go');
      this.ui.msg.innerHTML = `<h2>TAP NU!</h2><p>Reagér så hurtigt du kan</p>`;
      this.vibrate(20);
    }

    resetArena(){
      this.ui.arena.classList.remove('go','wait');
      this.ui.arena.classList.add('ready');
      this.ui.msg.innerHTML = `<h2>Klar?</h2><p>Tryk på "Start match"</p>`;
      clearTimeout(this.state.goTimer);
    }

    onPointer(){
      if (this.state.waiting){
        this.state.early = true;
        this.showRoundResult(400 + Math.floor(Math.random()*80), this.sampleAI());
        return;
      }
      if (!this.state.goAt){ return; }
      const t = Math.max(0, Math.round(performance.now() - this.state.goAt));
      this.showRoundResult(t, this.sampleAI());
    }

    sampleAI(){
      const { difficulty } = this.state;
      const targetFactor = DIFFS[difficulty].targetFactor;
      const hAvg = this.state.humanTimes.length ? this.state.humanTimes.reduce((a:number,b:number)=>a+b,0)/this.state.humanTimes.length : null;
      if (hAvg){
        const target = Math.max(150, hAvg * targetFactor);
        this.state.aiMu = 0.7*this.state.aiMu + 0.3*target;
        this.state.aiSigma = Math.max(18, this.state.aiSigma*0.98);
      }
      const v = Math.round(this.randn(this.state.aiMu, this.state.aiSigma));
      return Math.max(120, v);
    }

    randn(mu=0, sigma=1){
      let u=0, v=0; while(u===0) u=Math.random(); while(v===0) v=Math.random();
      const z = Math.sqrt(-2.0*Math.log(u))*Math.cos(2*Math.PI*v);
      return mu + z*sigma;
    }

    showRoundResult(humanMs:number, aiMs:number){
      this.state.humanTimes.push(humanMs);
      this.state.aiTimes.push(aiMs);
      if (!this.state.humanPB || humanMs < this.state.humanPB){ this.state.humanPB = humanMs; }
      this.renderHeader();
      const humanWin = humanMs < aiMs;
      this.ui.ovTitle.textContent = `Runde ${this.state.round}`;
      this.ui.ht.textContent = humanMs + ' ms';
      this.ui.at.textContent = aiMs + ' ms';
      this.ui.winner.innerHTML = humanWin ? `<span class="win">Du vinder runden!</span>` : `<span class="lose">AI vinder runden.</span>`;
      this.ui.ov.classList.add('show');
      this.state.round += 1;
      this.ui.round.textContent = `Runde ${Math.min(this.state.round, this.state.bestOf)}/${this.state.bestOf}`;
      const w = Math.min(100, ((this.state.round-1)/this.state.bestOf)*100);
      (this.ui.roundbar as HTMLElement).style.setProperty('--w', w+'%');
      this.save();
      this.ui.next.textContent = this.state.round > this.state.bestOf ? 'Se resultat' : 'Næste runde';
    }

    hideOverlay(){ this.ui.ov.classList.remove('show'); }

    renderHeader(){
      this.ui.round.textContent = `Runde ${this.state.round}/${this.state.bestOf}`;
      this.ui.humanPB.textContent = 'PB: ' + (this.state.humanPB ? this.state.humanPB + ' ms' : '–');
      this.ui.aimu.textContent = 'AI μ: ' + Math.round(this.state.aiMu) + ' ms';
    }

    fullReset(){
      clearTimeout(this.state.goTimer);
      const diff = this.state.difficulty;
      Object.assign(this.state, { round:1, bestOf:5, waiting:true, goAt:0, goTimer:0, early:false, humanTimes:[], aiTimes:[], difficulty:diff, aiMu:DIFFS[diff].aiMu, aiSigma:DIFFS[diff].aiSigma });
      this.ui.result.textContent = '';
      (this.ui.roundbar as HTMLElement).style.setProperty('--w','0%');
      this.renderHeader();
      this.resetArena();
      this.save();
    }
  }

  customElements.define('human-vs-ai-game', HumanVsAIGame);
}

export default function HumanVsAIGame(): JSX.Element {
  useEffect(()=>{ defineHumanVsAIGame(); },[]);
  return (
    <div className="relative rounded-xl overflow-hidden ring-1 ring-white/10">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <human-vs-ai-game style={{display:'block'}} />
    </div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'human-vs-ai-game': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}


