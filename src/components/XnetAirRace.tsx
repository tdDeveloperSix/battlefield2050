import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Xnet Air Race — Simple Flight (react Canvas + Ai That Learns)
 * Top-down dogfight. Denne version retter:
 *  - Missiler flyver LIGEUD og deaktiveres uden for rammen.
 *  - Guides er slukket som default (kan tændes).
 *  - Fly dør ved kant (ingen wrap).
 *  - Fly-fly kollision slår begge ihjel.
 * Bevarer ES-læring, score, og UI.
 */

/* =================== Konstanter =================== */
const W = 980;
const H = 560;
const DT_CAP = 1 / 30;

const MAX_SPEED = 220;
const MIN_SPEED = 28;
const ACCEL = 120;
const DRAG = 0.02;
const TURN_RATE = Math.PI;

const MISSILE_SPEED = 320;
const MISSILE_TTL = 7.0;           // stadig der, men udløb bruges kun som failsafe
const MISSILE_BLAST_R = 22;        // kill-radius for missiler
const MISSILE_LOCK_RANGE = 260;    // krav for at affyre
const MISSILE_COOLDOWN = 1.4;

const PLANE_COLLIDE_R = 18;        // ~flyets halve længde for fly-fly kollision

/* =================== Typer =================== */
type Vec = { x: number; y: number };
type Plane = { pos: Vec; a: number; v: number; color: string; trail: Vec[]; alive: boolean; cd: number; };
type Missile = { pos: Vec; a: number; v: number; owner: "player" | "ai"; ttl: number; active: boolean; };
type Policy = { attackR: number; fireBias: number; breakG: number; jinkAmp: number; jinkFreq: number; pnN: number; };
type Theme = ReturnType<typeof readTheme>;

/* =================== Utils =================== */
const clamp = (v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const lerp = (a:number,b:number,t:number)=>a+(b-a)*t;
const len = (dx:number,dy:number)=>Math.hypot(dx,dy);
const angWrap=(a:number)=>{a=(a+Math.PI)%(2*Math.PI); if(a<0)a+=2*Math.PI; return a-Math.PI;};
const dot=(ax:number,ay:number,bx:number,by:number)=>ax*bx+ay*by;

// Highscore persistence (lokal lagring)
const HIGHSCORE_KEY = "xnet-airrace-highscores-v1";
function loadHighscores(): number[] {
  try{
    const raw = localStorage.getItem(HIGHSCORE_KEY);
    if(!raw) return [];
    const arr = JSON.parse(raw) as number[];
    return Array.isArray(arr) ? arr.filter(n=>Number.isFinite(n)).slice(0,5) : [];
  }catch{ return []; }
}
function saveHighscores(list:number[]){
  try{ localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(list.slice(0,5))); }catch{}
}

function readTheme(){
  const root=getComputedStyle(document.documentElement);
  const get=(n:string,f:string)=>root.getPropertyValue(n).trim()||f;
  return {
    bg:get("--xnet-bg","#0b0f1a"),
    surface:get("--xnet-surface","#0f172a"),
    grid:get("--xnet-grid","rgba(255,255,255,0.06)"),
    accent:get("--xnet-accent","#00e5ff"),
    accent2:get("--xnet-accent2","#14b8a6"),
    danger:get("--xnet-danger","#ef4444"),
    text:get("--xnet-text","#e5e7eb"),
    muted:get("--xnet-muted","#9ca3af"),
  };
}

/* =================== Input =================== */
function useKeys(){
  const keys = useRef({ left:false,right:false,up:false,down:false,fire:false });
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      const k=e.key;
      if(k.startsWith("Arrow")||k===" ") e.preventDefault();
      if(k==="ArrowLeft") keys.current.left  = e.type==="keydown";
      else if(k==="ArrowRight") keys.current.right = e.type==="keydown";
      else if(k==="ArrowUp") keys.current.up    = e.type==="keydown";
      else if(k==="ArrowDown") keys.current.down  = e.type==="keydown";
      else if(k===" ") keys.current.fire = e.type==="keydown";
    };
    window.addEventListener("keydown",onKey,{passive:false});
    window.addEventListener("keyup",onKey);
    return ()=>{ window.removeEventListener("keydown",onKey); window.removeEventListener("keyup",onKey); };
  },[]);
  return keys;
}

/* =================== Fysik =================== */
function stepPlane(pl:Plane, turn:number, throttle:number, dt:number){
  pl.a += turn*TURN_RATE*dt;
  pl.v += throttle*ACCEL*dt;
  pl.v = clamp(pl.v*(1-DRAG*dt), MIN_SPEED, MAX_SPEED);
  pl.pos.x += Math.cos(pl.a)*pl.v*dt;
  pl.pos.y += Math.sin(pl.a)*pl.v*dt;
  // INGEN WRAP — kant = død
  if (pl.pos.x < 0 || pl.pos.x > W || pl.pos.y < 0 || pl.pos.y > H) {
    pl.alive = false;
  }
  // trail
  pl.trail.push({x:pl.pos.x,y:pl.pos.y}); if(pl.trail.length>120) pl.trail.shift();
  // cooldown
  if(pl.cd>0) pl.cd=Math.max(0,pl.cd-dt);
}

function spawnMissile(owner:"player"|"ai", from:Plane):Missile{
  return { pos:{x:from.pos.x+Math.cos(from.a)*14,y:from.pos.y+Math.sin(from.a)*14}, a:from.a, v:MISSILE_SPEED, owner, ttl:MISSILE_TTL, active:true };
}

/* ====== MISSILER: LIGEUD + OUT-OF-BOUNDS ====== */
function stepMissileStraight(m:Missile, dt:number){
  m.pos.x += Math.cos(m.a)*m.v*dt;
  m.pos.y += Math.sin(m.a)*m.v*dt;
  m.ttl -= dt; // failsafe
  // deaktiver hvis udenfor rammen eller udløbet
  if (m.pos.x < 0 || m.pos.x > W || m.pos.y < 0 || m.pos.y > H || m.ttl <= 0) {
    m.active = false;
  }
}

/* =================== AI taktik (uændret) =================== */
function aiTurnThrottle(pol:Policy,self:Plane,foe:Plane,t:number){
  const rx=foe.pos.x-self.pos.x, ry=foe.pos.y-self.pos.y;
  const d=len(rx,ry), angTo=Math.atan2(ry,rx);
  const err=angWrap(angTo-self.a);
  const orbitSign = d<pol.attackR*0.85 ? -1 : d>pol.attackR*1.15 ? 1 : 0;
  const baseTurn = clamp(err*1.2 + orbitSign*0.8, -1, 1);
  const jink = pol.jinkAmp * Math.sin(2*Math.PI*pol.jinkFreq*t);
  const turn = clamp(baseTurn + jink, -1, 1);
  const tgtSpeed = MAX_SPEED*0.78;
  const throttle = clamp((tgtSpeed-self.v)/MAX_SPEED,-1,1);
  return {turn,throttle};
}
function aiShouldFire(pol:Policy,self:Plane,foe:Plane){
  if(self.cd>0) return false;
  const rx=foe.pos.x-self.pos.x, ry=foe.pos.y-self.pos.y;
  const d=len(rx,ry); if(d>MISSILE_LOCK_RANGE) return false;
  const fwdx=Math.cos(self.a), fwdy=Math.sin(self.a);
  const rhatx=rx/(d||1), rhaty=ry/(d||1);
  const facing=dot(fwdx,fwdy,rhatx,rhaty);
  const need=lerp(0.92,0.65,pol.fireBias);
  return facing>=need;
}
function aiEvasion(pol:Policy,self:Plane,incoming:Missile|null,t:number){
  if(!incoming) return {evading:false,turnBias:0,throttleBias:0};
  const rx=incoming.pos.x-self.pos.x, ry=incoming.pos.y-self.pos.y;
  const d=len(rx,ry); if(d>MISSILE_LOCK_RANGE*0.9) return {evading:false,turnBias:0,throttleBias:0};
  const losA=Math.atan2(ry,rx);
  const tgtHeading=angWrap(losA+(Math.random()<0.5?Math.PI/2:-Math.PI/2));
  const err=angWrap(tgtHeading-self.a);
  const breakTurn=clamp(err*(1.2+1.2*pol.breakG),-1,1);
  const jink=pol.jinkAmp*1.2*Math.sin(2*Math.PI*(pol.jinkFreq*1.3)*t+1.7);
  return {evading:true, turnBias:clamp(breakTurn+jink,-1,1), throttleBias:0.3};
}

/* =================== ES (uændret) =================== */
function mutatePolicy(mu:Policy,sigma:Policy):Policy{
  const n=()=> (Math.random()*2-1)+(Math.random()*2-1);
  const clip=(v:number,a:number,b:number)=>clamp(v,a,b);
  return {
    attackR:clip(mu.attackR + sigma.attackR*n(), 90,340),
    fireBias:clip(mu.fireBias + sigma.fireBias*n(), 0,1),
    breakG:clip(mu.breakG + sigma.breakG*n(), 0,1),
    jinkAmp:clip(mu.jinkAmp + sigma.jinkAmp*n(), 0,1.8),
    jinkFreq:clip(mu.jinkFreq + sigma.jinkFreq*n(), 0.1,2),
    pnN:clip(mu.pnN + sigma.pnN*n(), 2.5,6),
  };
}
function evalPolicy(pol:Policy):number{
  // Offscreen eval (missil er stadig ligeud — sværere at ramme => tider kan stige)
  let ai:Plane={pos:{x:W*0.3,y:H*0.5},a:0,v:MIN_SPEED+10,color:"#f00",trail:[],alive:true,cd:0};
  let tgt:Plane={pos:{x:W*0.7,y:H*0.5},a:Math.PI,v:MIN_SPEED+30,color:"#0f0",trail:[],alive:true,cd:0};
  let miss:Missile|null=null;
  let t=0; const dt=1/120; const MAX_T=20;
  while(t<MAX_T){
    // bevæg mål i blød cirkel
    tgt.a+=0.4*dt; tgt.v=MIN_SPEED+40; stepPlane(tgt,0,0,dt); if(!tgt.alive) return t; // død ved kant
    const {turn,throttle}=aiTurnThrottle(pol,ai,tgt,t);
    if(!miss&&aiShouldFire(pol,ai,tgt)){ miss=spawnMissile("ai",ai); ai.cd=MISSILE_COOLDOWN; }
    stepPlane(ai,turn,throttle,dt); if(!ai.alive) return MAX_T+2; // fløj ud = dårligt
    if(miss){
      stepMissileStraight(miss,dt);
      if(!miss.active) miss=null;
      else if(len(miss.pos.x-tgt.pos.x, miss.pos.y-tgt.pos.y)<=MISSILE_BLAST_R) return t;
    }
    t+=dt;
  }
  return MAX_T+2;
}

/* =================== Score helper =================== */
function tallyScore(prevP:number, prevA:number, winner:"player"|"ai"): [number,number]{
  return winner==="player"? [prevP+1, prevA] : [prevP, prevA+1];
}

/* =================== Self tests =================== */
function selfTests(){
  console.assert(Math.abs(angWrap(Math.PI*3)+Math.PI)<1e-6,"angWrap wraps");
  // straight missile step + out-of-bounds
  let m:Missile={pos:{x:W-1,y:H/2},a:0,v:MISSILE_SPEED,owner:"ai",ttl:1,active:true};
  stepMissileStraight(m,0.1); console.assert(m.active===false,"missile deactivates out-of-bounds");
  m={pos:{x:100,y:100},a:0,v:100,owner:"ai",ttl:1,active:true};
  stepMissileStraight(m,0.5); console.assert(m.pos.x>100 && Math.abs(m.pos.y-100)<1e-6,"missile flies straight");
  // plane dies at edge
  const testPlane:Plane={pos:{x:0.5,y:10},a:Math.PI,v:50,color:"#fff",trail:[],alive:true,cd:0};
  stepPlane(testPlane,0,0,1); console.assert(!testPlane.alive,"plane dies on boundary");
  // eval returns number
  const score=evalPolicy({attackR:200,fireBias:0.4,breakG:0.5,jinkAmp:0.4,jinkFreq:0.8,pnN:3.5});
  console.assert(Number.isFinite(score),"evalPolicy number");
  // score helper
  const [s1p,s1a]=tallyScore(3,5,"player"); const [s2p,s2a]=tallyScore(4,5,"ai");
  console.assert(s1p===4&&s1a===5&&s2p===4&&s2a===6,"tallyScore");
}
if(typeof window!=="undefined" && !(window as any).__XNET_AIR_TESTED__){
  try{ selfTests(); (window as any).__XNET_AIR_TESTED__=true; } catch(e){ console.error(e); }
}

/* =================== Komponent =================== */
export default function XnetAirRace(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const theme = useMemo(()=>readTheme(),[]);
  const keys = useKeys();
  const { t } = useTranslation();

  // UI
  const [showRules,setShowRules]=useState(true);
  const [showGuides,setShowGuides]=useState(false); // OFF som default
  const [showExplain,setShowExplain]=useState(true);
  const [paused,setPaused]=useState(false);
  const [explainMsg,setExplainMsg]=useState<string|null>(null);

  // Score
  const [pScore,setPScore]=useState(0);
  const [aScore,setAScore]=useState(0);
  const awardedRef=useRef(false);
  const deathHandledRef=useRef(false);
  const [highscores,setHighscores]=useState<number[]>([]);
  const [showHigh,setShowHigh]=useState(false);

  // Entities
  const player=useRef<Plane>({pos:{x:W*0.3,y:H*0.5},a:0,v:MIN_SPEED+10,color:theme.accent2,trail:[],alive:true,cd:0});
  const ai=useRef<Plane>({pos:{x:W*0.7,y:H*0.5},a:Math.PI,v:MIN_SPEED+10,color:theme.danger,trail:[],alive:true,cd:0});
  const missiles=useRef<Missile[]>([]);

  // Learning visning
  const [gen,setGen]=useState(0);
  const [bestTime,setBestTime]=useState<number|null>(null);
  const [avgTime,setAvgTime]=useState<number|null>(null);
  const [improve,setImprove]=useState<number|null>(null);
  const bestRef=useRef<number|null>(null);
  const [learnDelay,setLearnDelay]=useState(900);
  const [learning,setLearning]=useState(true);

  // Start med en forholdsvis dårlig politik, så forbedringer kan ses tydeligt
  const muRef=useRef<Policy>({attackR:120,fireBias:0.9,breakG:0.1,jinkAmp:0.05,jinkFreq:0.2,pnN:3});
  const sigRef=useRef<Policy>({attackR:40,fireBias:0.15,breakG:0.2,jinkAmp:0.15,jinkFreq:0.25,pnN:0.4});

  function resetRound(){
    player.current={pos:{x:W*0.3,y:H*0.5},a:0,v:MIN_SPEED+10,color:theme.accent2,trail:[],alive:true,cd:0};
    ai.current={pos:{x:W*0.7,y:H*0.5},a:Math.PI,v:MIN_SPEED+10,color:theme.danger,trail:[],alive:true,cd:0};
    missiles.current=[]; awardedRef.current=false; deathHandledRef.current=false; setShowHigh(false);
  }

  // Game loop
  useEffect(()=>{
    const ctx = canvasRef.current?.getContext("2d");
    if(!ctx) return;
    let raf=0, last=performance.now();

    const loop=(ts:number)=>{
      const dt=Math.min((ts-last)/1000,DT_CAP); last=ts;

      if (!paused) {
        // Player
        const turnP=(keys.current.right?1:0)-(keys.current.left?1:0);
        const thrP =(keys.current.up?1:0)-(keys.current.down?1:0);
        if (player.current.alive) {
          stepPlane(player.current, turnP, thrP, dt);
        }

        // Fire fra spiller
        if(keys.current.fire && player.current.cd<=0 && player.current.alive){
          const d=len(player.current.pos.x-ai.current.pos.x, player.current.pos.y-ai.current.pos.y);
          if(d<=MISSILE_LOCK_RANGE){
            missiles.current.push(spawnMissile("player",player.current));
            player.current.cd=MISSILE_COOLDOWN;
          }
        }

        // AI
        let threat:Missile|null=null;
        for(const m of missiles.current){
          if(m.owner==="player" && m.active){
            const d=len(m.pos.x-ai.current.pos.x, m.pos.y-ai.current.pos.y);
            if(d<MISSILE_LOCK_RANGE){ threat=m; break; }
          }
        }
        if (ai.current.alive) {
          const nowSec = performance.now()/1000;
          const ev=aiEvasion(muRef.current, ai.current, threat, nowSec);
          const atk=aiTurnThrottle(muRef.current, ai.current, player.current, nowSec);
          const turnA=clamp(atk.turn+(ev.evading?ev.turnBias:0),-1,1);
          const thrA =clamp(atk.throttle+(ev.evading?ev.throttleBias:0),-1,1);
          stepPlane(ai.current, turnA, thrA, dt);
          if(aiShouldFire(muRef.current, ai.current, player.current)){
            missiles.current.push(spawnMissile("ai", ai.current));
            ai.current.cd=MISSILE_COOLDOWN;
          }
        }

        // MISSILER (ligeud)
        for(const m of missiles.current){
          if(!m.active) continue;
          stepMissileStraight(m,dt);
          // kollision med mål?
          const tgt = m.owner==="ai"? player.current : ai.current;
          if (tgt.alive && m.active && len(m.pos.x-tgt.pos.x, m.pos.y-tgt.pos.y) <= MISSILE_BLAST_R){
            tgt.alive=false; m.active=false;
            if(!awardedRef.current){
              if(tgt===ai.current && m.owner==="player") setPScore(s=>s+1);
              else if(tgt===player.current && m.owner==="ai") setAScore(s=>s+1);
              awardedRef.current=true;
            }
          }
        }
        missiles.current=missiles.current.filter(m=>m.active);

        // FLY-FLY KOLLISION ⇒ begge dør (ingen point tildeles her)
        if (player.current.alive && ai.current.alive) {
          const d = len(player.current.pos.x - ai.current.pos.x, player.current.pos.y - ai.current.pos.y);
          if (d <= PLANE_COLLIDE_R*2) {
            player.current.alive = false;
            ai.current.alive = false;
            awardedRef.current = true; // ingen point
          }
        }
      }

      // tegn
      const playerDead = !player.current.alive;
      const over = playerDead || !ai.current.alive;
      const strings = {
        playerLabel: t('dogfight.hud.player','Player'),
        aiLabel: t('dogfight.hud.ai','AI'),
        aliveText: t('dogfight.hud.alive','ALIVE'),
        hitText: t('dogfight.hud.hit','HIT'),
        highscoreTitle: t('dogfight.highscoreTitle','Highscore (Top 5)'),
        diedResetText: t('dogfight.diedReset','Player died – resetting round')
      };
      drawScene(ctx, theme, player.current, ai.current, missiles.current, showGuides, over, pScore, aScore, paused, showHigh? highscores : null, playerDead, strings);
      if(playerDead && !deathHandledRef.current){
        const newList=[...highscores, pScore].sort((a,b)=>b-a).slice(0,5);
        setHighscores(newList); saveHighscores(newList);
        setShowHigh(true);
        setPScore(0); setAScore(0);
        deathHandledRef.current=true;
      }
      if(over){
        const delay = playerDead ? 2200 : 600;
        setTimeout(()=>resetRound(),delay);
      }

      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(raf);
  },[theme,showGuides,keys,pScore,aScore,paused,highscores,showHigh,t]);

  // Learning loop (samme som før)
  useEffect(()=>{
    if(!learning) return; let stop=false;
    const tick=()=>{
      if (stop) return;
      const POP=24, ELITE=5;
      const cand:Policy[]=[]; const times:number[]=[];
      for(let i=0;i<POP;i++){ const pol=mutatePolicy(muRef.current,sigRef.current); cand.push(pol); times.push(evalPolicy(pol)); }
      const order=times.map((t,i)=>({t,i})).sort((a,b)=>a.t-b.t);
      const top=order.slice(0,ELITE); const best=top[0].t; const avg=top.reduce((s,o)=>s+o.t,0)/top.length;
      const av=(f:(p:Policy)=>number)=>top.reduce((s,o)=>s+f(cand[o.i]),0)/top.length;
      muRef.current={ attackR:av(p=>p.attackR), fireBias:av(p=>p.fireBias), breakG:av(p=>p.breakG), jinkAmp:av(p=>p.jinkAmp), jinkFreq:av(p=>p.jinkFreq), pnN:av(p=>p.pnN) };
      const prev=bestRef.current; bestRef.current=best;
      setBestTime(best); setAvgTime(avg); const delta = prev!=null? prev-best : null; setImprove(delta);
      if (showExplain && delta!=null && delta>0.05) {
        setExplainMsg(`AI blev bedre: -${delta.toFixed(1)}s (best ${best.toFixed(1)}s)`);
        setTimeout(()=>setExplainMsg(null), 3000);
      }
      sigRef.current={ attackR:sigRef.current.attackR*0.996, fireBias:sigRef.current.fireBias*0.996, breakG:sigRef.current.breakG*0.996, jinkAmp:sigRef.current.jinkAmp*0.996, jinkFreq:sigRef.current.jinkFreq*0.996, pnN:sigRef.current.pnN*0.996 };
      setGen(g=>g+1);
      setTimeout(tick, learnDelay);
    };
    tick();
    return ()=>{ stop=true; };
  },[learning,learnDelay]);

  // indlæs highscores ved mount
  useEffect(()=>{ setHighscores(loadHighscores()); },[]);

  return (
    <div className="mx-auto max-w-6xl p-6 text-gray-100">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900/80 p-4 shadow-xl ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-emerald-300 drop-shadow">{t('dogfight.title','AI Dogfight simulator')}</h2>
            <div className="text-xs text-zinc-400">{t('dogfight.gen','Gen')} {gen} · {t('dogfight.aiBest','AI best')} {bestTime?bestTime.toFixed(1):"–"} s · {t('dogfight.aiAvg','AI avg')} {avgTime?avgTime.toFixed(1):"–"} s</div>
          </div>

          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} className="mt-3 w-full rounded-xl bg-black" />
            {showRules && (
              <div className="pointer-events-auto absolute inset-0 grid place-items-center">
                <div className="max-w-xl rounded-2xl bg-zinc-900/95 p-4 text-sm ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold">{t('dogfight.rules.title','Rules')}</h4>
                    <button onClick={()=>setShowRules(false)} className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700">{t('dogfight.rules.start','Start')}</button>
                  </div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-300">
                    <li>{t('dogfight.rules.item1','Steer with ← → ↑ ↓, fire with Space.')}</li>
                    <li>{t('dogfight.rules.item2','Missiles fly straight and disappear off the field.')}</li>
                    <li>{t('dogfight.rules.item3','Edge = death. Plane-plane collision = both die.')}</li>
                    <li>{t('dogfight.rules.item4','Score shown top-right. AI learns continuously.')}</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <button onClick={()=>setPaused(v=>!v)} className={`rounded-xl border border-white/10 px-3 py-2 ${paused?"bg-yellow-600/40":"bg-zinc-800 hover:bg-zinc-700"}`}>{paused?t('dogfight.buttons.resume','Resume game'):t('dogfight.buttons.pause','Pause game')}</button>
            <button onClick={()=>setLearning(v=>!v)} className={`rounded-xl border border-white/10 px-3 py-2 ${learning?"bg-emerald-700/50":"bg-zinc-800 hover:bg-zinc-700"}`}>{learning?t('dogfight.buttons.pauseLearning','Pause learning'):t('dogfight.buttons.startLearning','Start learning')}</button>
            <button onClick={()=>{ setPScore(0); setAScore(0); resetRound(); }} className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 hover:bg-zinc-700">{t('dogfight.buttons.reset','Reset')}</button>
            <label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" className="accent-emerald-500" checked={showGuides} onChange={e=>setShowGuides(e.target.checked)} />{t('dogfight.labels.guides','Guides')}</label>
            <label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" className="accent-emerald-500" checked={showExplain} onChange={e=>setShowExplain(e.target.checked)} />{t('dogfight.labels.explainAI','Explain AI')}</label>
            <div className="ml-auto text-xs text-zinc-400">{t('dogfight.controls','Controls')}: ← → · ↑ · ↓ · Space</div>
          </div>

          {showExplain && (
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="rounded-xl bg-zinc-800/60 p-3 ring-1 ring-white/10">
                <div className="font-medium">{t('dogfight.aiProgress','AI progress')}</div>
                <div className="mt-1">{t('dogfight.generation','Generation')}: <span className="text-white">{gen}</span></div>
                <div>{t('dogfight.best','Best')}: <span className="text-white">{bestTime?bestTime.toFixed(1):"–"}s</span></div>
                <div>{t('dogfight.average','Average')}: <span className="text-white">{avgTime?avgTime.toFixed(1):"–"}s</span></div>
                <div>{t('dogfight.improvement','Improvement')}: <span className="text-white">{improve!=null ? (improve>=0? `-${improve.toFixed(1)}s` : `+${(-improve).toFixed(1)}s`) : "–"}</span></div>
              </div>
              <div className="rounded-xl bg-zinc-800/60 p-3 ring-1 ring-white/10">
                <div className="font-medium">{t('dogfight.strategyTitle','AI strategy (simplified)')}</div>
                {(()=>{
                  const mu=muRef.current;
                  const dist = mu.attackR<150?t('dogfight.distance.close','close'): mu.attackR<220?t('dogfight.distance.mid','mid-range'):t('dogfight.distance.far','far');
                  const shoot = mu.fireBias>0.7?t('dogfight.shoot.aggressive','aggressive'): mu.fireBias>0.4?t('dogfight.shoot.balanced','balanced'):t('dogfight.shoot.cautious','cautious');
                  const evade = mu.breakG>0.7?t('dogfight.evade.high','very hard'): mu.breakG>0.3?t('dogfight.evade.medium','moderate'):t('dogfight.evade.low','low');
                  const jAmp = mu.jinkAmp>1?t('dogfight.jinkAmp.strong','strong'): mu.jinkAmp>0.4?t('dogfight.jinkAmp.medium','medium'):t('dogfight.jinkAmp.weak','weak');
                  const jFreq = mu.jinkFreq>1.2?t('dogfight.jinkFreq.fast','fast'): mu.jinkFreq>0.6?t('dogfight.jinkFreq.medium','medium'):t('dogfight.jinkFreq.slow','slow');
                  return (
                    <ul className="mt-1 space-y-1 list-disc pl-5">
                      <li>{t('dogfight.labels.prefDistance','Preferred distance')}: <span className="text-white">{dist}</span></li>
                      <li>{t('dogfight.labels.shootWilling','Willingness to shoot')}: <span className="text-white">{shoot}</span></li>
                      <li>{t('dogfight.labels.evasion','Evasion')}: <span className="text-white">{evade}</span></li>
                      <li>{t('dogfight.labels.weave','Weave')}: <span className="text-white">{jAmp}</span> · {t('dogfight.labels.tempo','Tempo')}: <span className="text-white">{jFreq}</span></li>
                    </ul>
                  );
                })()}
              </div>
            </div>
          )}
          {showExplain && explainMsg && (
            <div className="mt-3 text-sm text-emerald-300">
              {explainMsg}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-zinc-900/80 p-4 shadow-xl ring-1 ring-white/10">
          <h3 className="text-lg font-semibold">{t('dogfight.sidebar.title','What’s happening?')}</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
            <li>{t('dogfight.sidebar.item1','Missiles fly straight; disappear when off screen.')}</li>
            <li>{t('dogfight.sidebar.item2','Edge = death. Plane-plane collision = both die.')}</li>
            <li>{t('dogfight.sidebar.item3','ES-learning runs in the background; UI shows progress.')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* =================== Rendering =================== */
function drawScene(
  ctx:CanvasRenderingContext2D,
  theme:Theme,
  player:Plane,
  ai:Plane,
  missiles:Missile[],
  guides:boolean,
  showOver:boolean,
  scoreP:number,
  scoreA:number,
  paused:boolean,
  highscores: number[] | null,
  playerDead:boolean,
  strings?: { playerLabel:string; aiLabel:string; aliveText:string; hitText:string; highscoreTitle:string; diedResetText:string; }
){
  // baggrund
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,theme.bg); g.addColorStop(1,theme.surface);
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  // grid
  ctx.strokeStyle=theme.grid; ctx.lineWidth=1;
  for(let y=40;y<H;y+=22){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // trails
  drawTrail(ctx, player.trail, theme.accent2);
  drawTrail(ctx, ai.trail, theme.danger);

  // guides (LOS-linjer)
  if(guides){
    ctx.setLineDash([6,6]);
    ctx.strokeStyle=theme.accent2; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(player.pos.x,player.pos.y); ctx.lineTo(ai.pos.x,ai.pos.y); ctx.stroke();
    ctx.strokeStyle=theme.danger; ctx.beginPath(); ctx.moveTo(ai.pos.x,ai.pos.y); ctx.lineTo(player.pos.x,player.pos.y); ctx.stroke();
    ctx.setLineDash([]);
  }

  // fly
  drawPlane(ctx, player, player.color);
  drawPlane(ctx, ai, ai.color);

  // missiler
  for(const m of missiles) drawMissile(ctx, m, m.owner==="ai"? theme.danger : theme.accent2);

  // HUD venstre
  ctx.fillStyle=theme.text; ctx.font="12px ui-sans-serif"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
  const p=player.alive?(strings?.aliveText||"ALIVE"):(strings?.hitText||"HIT");
  const a=ai.alive?(strings?.aliveText||"ALIVE"):(strings?.hitText||"HIT");
  ctx.fillText(`${strings?.playerLabel||'Player'}: ${p}   ${strings?.aiLabel||'AI'}: ${a}`, 12, 18);

  // SCORE højre top (canvas)
  ctx.save();
  ctx.font="bold 26px ui-sans-serif"; ctx.textBaseline="top";
  const pad=8, xRight=W-12, yTop=10;
  const pText=String(scoreP), aText=String(scoreA), colon=":";
  const pW=ctx.measureText(pText).width, cW=ctx.measureText(colon).width, aW=ctx.measureText(aText).width;
  const total=pW+cW+aW, boxW=total+pad*2, boxH=28+pad;
  ctx.fillStyle="rgba(0,0,0,0.60)"; ctx.fillRect(xRight-boxW, yTop, boxW, boxH);
  let cur=xRight-pad; ctx.textAlign="right";
  ctx.fillStyle=theme.danger; ctx.fillText(aText, cur, yTop+pad); cur-=aW;
  ctx.fillStyle="rgba(255,255,255,0.65)"; ctx.fillText(colon, cur, yTop+pad); cur-=cW;
  ctx.fillStyle=theme.accent2; ctx.fillText(pText, cur, yTop+pad);
  ctx.restore();

  if(showOver){ ctx.fillStyle="rgba(0,0,0,0.45)"; ctx.fillRect(0,0,W,H); }
  if(paused){ ctx.fillStyle="rgba(0,0,0,0.35)"; ctx.fillRect(0,0,W,H); }
  if(highscores && playerDead){
    const boxW=300, boxH=200; const x=(W-boxW)/2, y=(H-boxH)/2;
    ctx.fillStyle="rgba(0,0,0,0.75)"; ctx.fillRect(x,y,boxW,boxH);
    ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.strokeRect(x,y,boxW,boxH);
    ctx.fillStyle=theme.text; ctx.font="bold 18px ui-sans-serif"; ctx.textAlign="center";
    ctx.fillText(strings?.highscoreTitle || "Highscore (Top 5)", x+boxW/2, y+18);
    ctx.textAlign="left"; ctx.font="14px ui-sans-serif";
    const list = highscores.slice(0,5);
    for(let i=0;i<list.length;i++){
      const s=list[i];
      ctx.fillStyle=i===0? theme.accent2 : "#e5e7eb";
      ctx.fillText(`${i+1}. ${s}`, x+24, y+50+i*26);
    }
    ctx.fillStyle="rgba(255,255,255,0.7)"; ctx.font="12px ui-sans-serif"; ctx.textAlign="center";
    ctx.fillText(strings?.diedResetText || "Player died – resetting round", x+boxW/2, y+boxH-18);
  }
}

function drawTrail(ctx:CanvasRenderingContext2D, trail:Vec[], color:string){
  if(trail.length<2) return;
  ctx.strokeStyle=color; ctx.globalAlpha=0.28; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
  for(let i=1;i<trail.length;i++){ ctx.lineTo(trail[i].x, trail[i].y); }
  ctx.stroke(); ctx.globalAlpha=1;
}

function drawPlane(ctx:CanvasRenderingContext2D, pl:Plane, color:string){
  ctx.save();
  ctx.translate(pl.pos.x, pl.pos.y);
  ctx.rotate(pl.a);
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(16,0); ctx.lineTo(-10,-6); ctx.lineTo(-6,0); ctx.lineTo(-10,6); ctx.closePath();
  ctx.fill();
  if(!pl.alive){ ctx.fillStyle="rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.arc(0,0,20,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
}

function drawMissile(ctx:CanvasRenderingContext2D, m:Missile, color:string){
  ctx.save();
  ctx.translate(m.pos.x, m.pos.y);
  ctx.rotate(m.a);
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(10,0); ctx.lineTo(-6,-3); ctx.lineTo(-6,3); ctx.closePath();
  ctx.fill();
  ctx.restore();
}


