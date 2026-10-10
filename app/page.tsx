'use client';
/* Private cookie-authorized portraits must bypass image optimization and shared caches. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, Zap, Trophy, HelpCircle, Volume2, VolumeX, X, Copy, Check, ArrowLeft, Coffee, Lightbulb, Eye, Shuffle, Skull, Star } from 'lucide-react';
import {teaLabel} from '../lib/tea-labels';
import {EditorialHome} from '../components/editorial-home';
import {Gremlin,type GremlinCue,type GremlinState,type GremlinPlacement} from '../components/gremlin';
import type {publicRoom} from '../lib/game/engine';
import type {GameInput} from '../lib/game/engine';
type Game=ReturnType<typeof publicRoom> & {portraitCredit?:{sourceUrl:string;artist:string;license:string}|null};
type GameResponse=Game & {error?:string};
type Leader={name:string;points:number;wins:number};
const categories = ['Surprise me', 'Bollywood', 'Hollywood', 'Cricket', 'Football', 'Music', 'Scientists', 'Entrepreneurs', 'Historical Figures', 'Artists', 'Writers', 'India', 'World Icons'];
function BrutalButton({ children, onClick, className = '', disabled = false, type = 'button' }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit';
}) { return <button type={type} className={'brutal-button ' + className} onClick={onClick} disabled={disabled}>{children}</button>; }
function StickerBadge({ children, className = '' }: {
    children: ReactNode;
    className?: string;
}) { return <span className={'sticker ' + className}>{children}</span>; }
function BrutalModal({ title, children, onClose }: {
    title: string;
    children: ReactNode;
    onClose: () => void;
}) { const ref = useRef<HTMLDialogElement>(null); useEffect(() => { const dialog=ref.current; dialog?.showModal(); return () => dialog?.close(); }, []); return <dialog ref={ref} className="modal" onCancel={onClose} onClick={e => { if (e.target === ref.current)
    onClose(); }}><div className="modal-head"><h2>{title}</h2><button aria-label="Close dialog" className="icon-button" onClick={onClose}><X /></button></div>{children}</dialog>; }
function MysteryCard({ small = false, stage = 0, code = '' }: {
    small?: boolean;
    stage?: number;
    code?: string;
}) { return <div className={'mystery-card ' + (small ? 'small' : '')}><div className="mystery-top"><span>IDENTITY: CLASSIFIED</span><span>FILE № ???</span></div><div className={"portrait reveal-stage-"+stage}>{small&&stage>0&&<img key={stage} className="progressive-photo" src={"/api/game?code="+encodeURIComponent(code)+"&portrait=1&stage="+stage} alt="Partially revealed mystery portrait" onError={e=>{e.currentTarget.style.display="none"}}/>}<div className="target-ring ring1"/><div className="target-ring ring2"/><span className="crosshair a">+</span><span className="crosshair b">+</span><div className="suspect-body"/><div className="suspect-head"><div className="redacted">?</div></div><span className="portrait-note">LOOKS FAMILIAR?</span></div><div className="mystery-bottom"><span>ONE FAMOUS FACE.<br />ZERO USEFUL CONTEXT.</span><span className="barcode">|||| ||| |||||| ||</span></div></div>; }
function PlayerAvatar({ name, index = 0 }: {
    name: string;
    index?: number;
}) { return <span className={'avatar color' + index % 4}>{name.slice(0, 2).toUpperCase()}</span>; }
export default function Home() {
    const [cameo,setCameo]=useState<GremlinCue|null>(null);
    const cameoIndex=useRef(0);
    function reactGremlin(state:GremlinState,placement:GremlinPlacement,note?:string){setCameo({state,placement,note,key:++cameoIndex.current})}
    useEffect(()=>{const timer=setTimeout(()=>{if(!document.querySelector('dialog[open]')&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName||''))setCameo({state:'peek',placement:'header-margin',key:-1})},14000);return()=>clearTimeout(timer)},[]);
    const [activeAction,setActiveAction]=useState(''),[wrongFlash,setWrongFlash]=useState(0),[scoreDelta,setScoreDelta]=useState<{value:number;key:number}|null>(null),[loadingCopy,setLoadingCopy]=useState(0);
    const [modal, setModal] = useState(''), [mode, setMode] = useState('solo'), [name, setName] = useState(''), [category, setCategory] = useState('Surprise me'), [difficulty, setDifficulty] = useState('Easy'), [rounds, setRounds] = useState('3'), [settings, setSettings] = useState<Record<string, boolean>>({}), [joinCode, setJoinCode] = useState(''), [join, setJoin] = useState(false), [room, setRoom] = useState<Game|null>(null), [busy, setBusy] = useState(false), [error, setError] = useState(''), [toast, setToast] = useState(''), [question, setQuestion] = useState(''), [guess, setGuess] = useState(''), [bet, setBet] = useState('safe'), [sound, setSound] = useState(false), [now, setNow] = useState(()=>Date.now()), [leaders, setLeaders] = useState<Leader[]>([]), [connected, setConnected] = useState(true), [ai, setAi] = useState(false), [catalogCount, setCatalogCount] = useState(0), [availableCategories,setAvailableCategories] = useState<string[]>(['Surprise me','World Icons']);
    const feedEnd = useRef<HTMLDivElement>(null), feedRef=useRef<HTMLDivElement>(null),nearBottom=useRef(true),previousScore=useRef<number|null>(null),previousRound=useRef<number|undefined>(undefined), audioRef = useRef<AudioContext | null>(null);
    function beep(win = false) { if (!sound)
        return; try {
        const ctx = audioRef.current ||= new AudioContext();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = win ? 740 : 330;
        g.gain.setValueAtTime(.06, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .16);
        o.start();
        o.stop(ctx.currentTime + .16);
    }
    catch { } }
    useEffect(() => { queueMicrotask(()=>{ setName(localStorage.getItem('who-name') || ''); fetch('/api/game').then(r => r.json()).then((d: unknown) => { const meta=d as {aiEnabled:boolean;catalogCount:number;availableCategories?:string[]};setAvailableCategories(['Surprise me','World Icons',...(meta.availableCategories||[])]);setAi(meta.aiEnabled); setCatalogCount(meta.catalogCount || 0); }).catch(()=>setConnected(false)); const code = new URLSearchParams(location.search).get('room'); if (code) {
        setJoinCode(code);
        setMode('friends');
        setJoin(true);
        setModal('setup');
    }
    else {
        const saved = sessionStorage.getItem('who-room');
        if (saved)
            fetch('/api/game?code=' + encodeURIComponent(saved)).then(r => r.json()).then((d: unknown) => { const value=d as GameResponse;if (!value.error)setRoom(value); }).catch(()=>setConnected(false));
    } }); }, []);
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
    const roomCode=room?.code;
    useEffect(() => { if (!roomCode)
        return; sessionStorage.setItem('who-room', roomCode); let stopped = false; let fetching = false; const t = setInterval(async () => { if (fetching)
        return; fetching = true; try {
        const r = await fetch('/api/game?code=' + encodeURIComponent(roomCode));
        const d = await r.json() as GameResponse;
        if (!stopped) {
            if (!d.error) {
                setRoom(d);
                setConnected(true);
            }
            else
                setConnected(false);
        }
    }
    catch {
        if (!stopped)
            setConnected(false);
    }
    finally {
        fetching = false;
    } }, 1200); return () => { stopped = true; clearInterval(t); }; }, [roomCode]);
    useEffect(()=>{const el=feedRef.current;if(el&&nearBottom.current)el.scrollTop=el.scrollHeight},[room?.questions?.length,room?.hints?.length,room?.tea?.length,room?.events?.length]);
    useEffect(()=>{if(!busy)return;const t=setInterval(()=>setLoadingCopy(v=>(v+1)%5),900);return()=>clearInterval(t)},[busy]);
    const scoreNow=room?.players.find((p)=>p.id===room.me)?.score;
    useEffect(()=>{const sameRound=previousRound.current===room?.round;previousRound.current=room?.round;const before=sameRound?previousScore.current:null;previousScore.current=scoreNow??null;if(before!==null&&scoreNow!==undefined&&scoreNow!==before)setScoreDelta({value:scoreNow-before,key:Date.now()})},[scoreNow,room?.round]);
    useEffect(()=>{if(!scoreDelta)return;const t=setTimeout(()=>setScoreDelta(null),650);return()=>clearTimeout(t)},[scoreDelta]);

    useEffect(() => { if (!toast)
        return; const t = setTimeout(() => setToast(''), 4000); return () => clearTimeout(t); }, [toast]);
    async function act(action: string, extra: GameInput = {}) { if (busy)
        return; setBusy(true); setActiveAction(action); setError(''); try {
        const res = await fetch('/api/game', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, code: room?.code, ...extra }) });
        const d = await res.json() as GameResponse;
        if (d.error)
            throw Error(d.error);
        setRoom(d);
        setConnected(true);
        if(action==='tea')reactGremlin('tea','tea-card-edge');
        if(action==='hint')reactGremlin('clue','clue-card-edge',d.hints.length===5?'I’m basically playing for you.':undefined);
        if(action==='ask'){
            const answer=d.questions.at(-1)?.answer;
            const left=d.limit-d.questions.length;
            reactGremlin(left<=3?'nervous':answer==='UNKNOWN'?'shrug':answer==='NO'?'judging':answer==='YES'?'smug':'interested',left<=3?'question-counter-edge':'feed-margin');
        }
        if (action === 'guess') {
            if (d.phase === 'ended')setModal('');
            if (d.phase === 'ended' && d.winner === d.me) {
                setGuess(''); reactGremlin('celebrating','bottom-corner',d.questions.length<3?'WAIT. WHAT?':undefined);
                setToast('OH. YOU ACTUALLY GOT IT.');
                beep(true);
            }
            else {
                reactGremlin('laughing','mystery-card-edge',d.players.find(p=>p.id===d.me)?.wrong===3?'you good?':undefined); setWrongFlash(v=>v+1); setError('CONFIDENTLY WRONG. Take another shot.');
                beep();
            }
        }
        if (action === 'ask') {
            setQuestion('');
            beep();
        }
        return d;
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false); setActiveAction('');
    } }
    function setup(m: string) { setMode(m); setJoin(false); setError(''); setModal('setup'); }
    async function launch() { localStorage.setItem('who-name', name || 'Detective'); const d = await act(join ? 'join' : 'create', { code: joinCode.trim().toUpperCase(), name: name || 'Detective', mode, category, difficulty, rounds, settings }); if (d)
        setModal(''); }
    async function copy(text: string) { try {
        await navigator.clipboard.writeText(text);
        setToast('COPIED. GO CAUSE TROUBLE.');
    }
    catch {
        setToast('Copy is unavailable in this browser.');
    } }
    async function leaderboard() { setModal('leaderboard'); try {
        const r = await fetch('/api/game?leaderboard=1');
        const d = await r.json() as GameResponse;
        setLeaders((d as unknown as {entries:Leader[]}).entries || []);
    }
    catch {
        setError('Leaderboard could not load. Try again.');
    } }
    function home() { setRoom(null); sessionStorage.removeItem('who-room'); history.replaceState({}, '', location.pathname); setError(''); }
    const me = room?.players.find((p) => p.id === room.me), isHost = room?.host === room?.me, isMaster = room?.gm === room?.me, timeLeft = room?.endsAt ? Math.max(0, Math.ceil((room.endsAt - now) / 1000)) : null;
    return <><header className="site-header"><button className="wordmark" onClick={home} aria-label="WHO DIS? home">WHO DIS<span>?</span></button><nav aria-label="Main navigation"><button onClick={()=>setup('solo')}>PLAY</button><button onClick={()=>{home();requestAnimationFrame(()=>document.getElementById('decks')?.scrollIntoView({behavior:'instant'}))}}>DECKS</button><button onClick={() => setup('daily')}><span className="tiny-dot"/> DAILY</button><button onClick={() => setModal('how')}>HOW IT WORKS</button><button onClick={leaderboard}>LEADERBOARD <Trophy size={15}/></button></nav><button className="sound-button" onClick={() => setSound(!sound)} aria-label={sound ? 'Mute sound' : 'Enable sound'}>{sound ? <Volume2 size={19}/> : <VolumeX size={19}/>}<span>SOUND {sound ? 'ON' : 'OFF'}</span></button></header>
        {!room ? <EditorialHome setup={setup} selectCategory={c=>{setCategory(c);setup('solo')}} count={catalogCount} availableCategories={availableCategories} name={name} cue={cameo}/> : <main className="game-main"><div className="game-topline"><button className="text-link" onClick={home}><ArrowLeft size={17}/> BACK TO HQ</button><span><span className={'tiny-dot ' + (!connected ? 'offline' : '')}/>{connected ? 'ROOM CONNECTED' : 'RECONNECTING…'}</span><span>{room.mode.toUpperCase()} / {room.difficulty.toUpperCase()}</span></div>
        {room.phase === 'lobby' ? <><div className="lobby-title"><span className="eyebrow">THE GROUP CHAT HAS ENTERED THE CHAT.</span><h1>ASSEMBLING<br />SUSPECTS<span>...</span></h1></div><div className="lobby-grid"><section className="panel lime"><span className="eyebrow">YOUR ROOM CODE</span><h2 className="room-code">{room.code}</h2><div className="button-row"><BrutalButton onClick={() => copy(room.code)}><Copy size={16}/> COPY CODE</BrutalButton><BrutalButton onClick={() => copy(location.origin + '/?room=' + room.code)}>INVITE LINK <ArrowUpRight size={16}/></BrutalButton></div><p>Send this to the people whose confidence you’d like to ruin.</p><hr /><div className="room-rules"><span>{room.category}</span><span>{room.rounds} rounds</span><span>{room.limit} questions</span><span>{room.mode === 'hotseat' ? 'Human Game Master' : 'Shared clues'}</span></div>{isHost ? <BrutalButton className="black full" disabled={busy} onClick={() => act('start')}>START CHAOS <ArrowRight /></BrutalButton> : <BrutalButton className="black full" onClick={() => act('ready')}>{me?.ready ? '✓ READY. ANNOYINGLY READY.' : 'I’M READY'}</BrutalButton>}<p className="small-print">{isHost ? 'At least 2 players. Everyone else must be ready.' : 'WAITING FOR THE HOST TO DO SOMETHING USEFUL.'}</p></section><section className="panel"><div className="section-heading"><h3>THE USUAL SUSPECTS</h3><span>{room.players.length}/12</span></div>{room.players.map((p, i: number) => <div className="player-card" key={p.id}><PlayerAvatar name={p.name} index={i}/><strong>{p.name}</strong><span>{p.id === room.host ? 'HOST' : p.ready ? 'READY ✓' : 'NOT READY'}</span></div>)}<div className="empty-seat">+ THIS COULD BE YOUR MOST ANNOYING FRIEND</div></section></div></> : room.phase === 'playing' ? <><div className="game-title"><div><span className="eyebrow">ROUND {room.round} / {room.rounds}</span><h1>EVERYONE’S A SUSPECT.</h1></div><div className="score-badge"><span>YOUR ROUND SCORE</span><strong key={me?.score} className="score-punch">{me?.score}<small> PTS</small></strong>{scoreDelta&&<span key={scoreDelta.key} className="score-delta" aria-live="polite">{scoreDelta.value>0?"+":""}{scoreDelta.value}</span>}</div></div><div className="play-layout"><aside className="game-dossier"><MysteryCard small code={room.code} stage={room.imageStage||0}/>{room.masterPerson && <div className="master-card"><Eye /><span>FOR YOUR EYES ONLY</span><h3>{room.masterPerson}</h3><p>You’re the Game Master. Answer honestly.</p></div>}<div className={"question-counter "+(!timeLeft&&room.limit-room.questions.length<=3?"few-left":"")}><Gremlin cue={cameo} placement="question-counter-edge"/><strong key={room.questions.length} className={room.limit-room.questions.length===1?"counter-punch final-question":"counter-punch"}>{timeLeft !== null ? <span className={timeLeft < 10 ? 'urgent' : ''}>{timeLeft}s</span> : Math.max(0, room.limit - room.questions.length)}</strong><span>{timeLeft !== null ? 'SECONDS TO GLORY' : 'QUESTIONS LEFT'}<small>{timeLeft !== null ? 'MOVE YOUR BRAIN.' : 'MAKE THEM COUNT.'}</small></span></div><BrutalButton className="lime full guess-access" disabled={busy || isMaster || (room.settings.oneShot && (me?.wrong ?? 0) > 0)} onClick={() => { setGuess(''); setError(''); setWrongFlash(0); setModal('guess'); }}>I KNOW WHO DIS IS <ArrowUpRight /></BrutalButton><div className="clue-actions"><BrutalButton className="full hint-button" disabled={busy || isMaster || room.settings.noHints || room.difficulty === 'Unhinged' || room.hints.length >= 6} onClick={() => act('hint')}><Lightbulb size={18}/> BUY A CLUE <span>−100 PTS</span></BrutalButton><BrutalButton className="full hint-button tea-button" disabled={busy||isMaster||room.settings.noHints||room.difficulty==='Unhinged'||(room.tea?.length||0)>=(room.teaAvailable??5)} onClick={()=>act('tea')}><Coffee size={18}/> SPILL THE TEA <span>−150 PTS</span></BrutalButton></div></aside><section className="question-panel"><div className="feed-header"><div><span className="eyebrow">THE CASE NOTES</span><h3>The interrogation.</h3></div><div className="margin-stage"><Gremlin cue={busy&&activeAction==='ask'?{state:'thinking',placement:'feed-margin',key:-2}:cameo} placement="feed-margin"/></div></div><div className="question-feed" ref={feedRef} onScroll={e=>{const el=e.currentTarget;nearBottom.current=el.scrollHeight-el.scrollTop-el.clientHeight<75}} aria-live="polite">{!room.questions.length && <div className="feed-empty"><HelpCircle size={44}/><h3>BIG MYSTERY.<br />SMALL QUESTION MARK.</h3><p>Start broad. Narrow it down.<br />Try “Were they in a band?”</p></div>}{room.questions.map((q, i: number) => <article className="question-item" key={q.id}><div><span className="question-index">{String(i + 1).padStart(2, '0')}</span><span className="eyebrow">{q.by}</span></div><p>{q.text}</p><div key={q.answer} className={'answer ' + q.answer.toLowerCase().replace(/[^a-z]+/g,'-')}><strong className="answer-label">{q.answer}</strong><span>{q.explanation}</span>{q.confidence&&q.confidence!=='verified'&&q.confidence!=='unknown'&&<small className="fact-status">{q.confidence.replace(/_/g,' ').toUpperCase()}</small>}</div>{isMaster && q.answer === 'WAITING' && <div className="answer-buttons">{['YES','NO','MOSTLY','SORT OF','COMPLICATED','REPORTEDLY','UNKNOWN'].map(a => <button key={a} onClick={() => act('answer', { text: a })}>{a}</button>)}</div>}</article>)}{room.hints.map((h: string, i: number) => <div className="hint-note clue-snap" key={i}>{i===room.hints.length-1&&<Gremlin cue={cameo} placement="clue-card-edge"/>}<Lightbulb size={18}/><div><strong>FINE. HERE’S A CLUE. #{i + 1}</strong><p>{h}</p></div></div>)}{(room.tea||[]).map((t,i:number)=><article className="tea-card" key={t.id}>{i===room.tea.length-1&&<Gremlin cue={cameo} placement="tea-card-edge"/>}<header><Coffee size={18}/><strong>SPILL THE TEA</strong><span>ISSUE № {i+1}</span></header><div className="tea-topic">{teaLabel(t.topic)}</div><p>{t.fact}</p><footer><span>{t.status.replace(/_/g,' ').toUpperCase()}</span><span>HEAT {'●'.repeat(t.clueStrength)}</span></footer></article>)}<div className="feed-reactions">{room.events.filter((e)=>/[🔥💀🧠🤨😭]/u.test(e.text)).slice(-4).map((e)=><span className="reaction-pop" key={e.time+e.text}>{e.text}</span>)}</div>{busy&&activeAction==='ask'&&<div className="loading-copy" role="status">{['DIGGING UP RECEIPTS…','VERIFYING THE TEA…','CONNECTING SUSPICIOUS DOTS…','CHECKING THE ARCHIVES…','FINDING THE RECEIPTS…'][loadingCopy]}</div>}<div ref={feedEnd}/></div><form className="ask-form" onSubmit={e => { e.preventDefault(); act('ask', { text: question }); }}><label className="sr-only" htmlFor="question">Ask about the mystery person</label><input id="question" value={question} onChange={e => setQuestion(e.target.value)} maxLength={200} placeholder={isMaster ? 'Your job is to answer. No pressure.' : 'Band, famous ex, collaboration…'} disabled={isMaster || (!timeLeft && timeLeft !== null)}/><button type="submit" disabled={busy || isMaster || question.trim().length < 4}>ASK <ArrowUpRight size={19}/></button></form><div className="feed-foot"><span>−25 PTS PER QUESTION</span><span>{ai ? 'CURATED FACTS · AI HOST' : 'CURATED FACTS · REAL RECEIPTS'}</span></div>{room.questions.length >= room.limit && timeLeft === null && <div className="limit-note">YOU HAD {room.limit} QUESTIONS. Make a guess or end the round.</div>}</section></div><div className="under-game"><div className="reaction-bar"><span>WORDS FAILED YOU?</span>{['🔥', '💀', '🧠', '🤨', '😭'].map(e => <button key={e} onClick={() => act('react', { text: e })} aria-label={'React ' + e}>{e}</button>)}</div>{isHost && <button className="text-link" onClick={() => setModal('giveup')}>END ROUND <Skull size={16}/></button>}</div><div className="live-events" aria-live="polite">{room.events.slice(-3).map((e, i: number) => <span key={e.time + '-' + i}>{e.text}</span>)}</div><div className="player-strip">{room.players.map((p, i: number) => <div className="player-mini" key={p.id}><PlayerAvatar name={p.name} index={i}/><div><strong>{p.name}{p.id === room.me ? ' (YOU)' : ''}</strong><small>{p.points} MATCH PTS · {p.wins} WINS</small></div></div>)}</div></> : <section className="results"><div className="result-margin"><Gremlin cue={cameo} placement="bottom-corner"/></div>{room.winner&&<div className="win-celebration" aria-label="Got them"><strong className="win-stamp">GOT ’EM.</strong><div className="geometric-confetti" aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div></div>}<StickerBadge>{room.winner ? 'OH. YOU ACTUALLY GOT IT.' : 'THE MYSTERY WON THIS ONE.'}</StickerBadge><h1>{room.winner ? room.players.find((p) => p.id === room.winner)?.name + ' WINS.' : 'EVERYONE LOSES.'}</h1><div className="result-layout"><div className="reveal-art"><span className="eyebrow">CASE CLOSED</span><img className="reveal-photo" src={"/api/game?code=" + encodeURIComponent(room.code) + "&portrait=1"} alt={room.reveal?.name} onError={e => { e.currentTarget.style.display = "none"; }}/><span className="reveal-symbol">!</span><span className="reveal-stamp">IDENTIFIED</span></div><div><span className="eyebrow">IT WAS…</span><h2>{room.reveal?.name}</h2><p className="biography">{room.reveal?.knownFor}.</p>{room.reveal?.source?.sourceUrl&&<a className="text-link source-link" href={room.reveal.source.sourceUrl} target="_blank" rel="noreferrer">CHECK THE RECEIPTS ↗</a>}{room.portraitCredit&&<p className="portrait-credit"><a href={room.portraitCredit.sourceUrl} target="_blank" rel="noreferrer">Photo: {room.portraitCredit.artist} · {room.portraitCredit.license}</a></p>}<div className="tags"><span>{room.reveal?.category}</span><span>{room.reveal?.nationality}</span><span>BORN {room.reveal?.birthYear}</span></div><div className="round-stats"><div><strong>{room.questions.length}</strong><span>QUESTIONS</span></div><div><strong>{room.hints.length}</strong><span>HINTS</span></div><div><strong>{me?.wrong}</strong><span>WRONG GUESSES</span></div><div><strong>{me?.points}</strong><span>MATCH POINTS</span></div></div><div className="button-row">{isHost && !room.finished && <BrutalButton className="lime" disabled={busy} onClick={() => act('start')}>NEXT ROUND <ArrowRight /></BrutalButton>}{(room.finished || room.mode === 'daily') && <BrutalButton className="lime" onClick={() => { home(); setup(room.mode === 'daily' ? 'solo' : room.mode); }}>PLAY AGAIN <Shuffle size={18}/></BrutalButton>}<BrutalButton onClick={() => copy(`WHO DIS? ${room.mode === 'daily' ? 'DAILY ' + new Date().toISOString().slice(0, 10) : 'ROUND ' + room.round}\n${room.winner ? '🟩' : '🟥'} ${room.questions.length} QUESTIONS\n${room.hints.length} HINTS · ${me?.score} PTS\nAsk smart. Guess early. Regret publicly.`)}>SHARE RESULT <Copy size={17}/></BrutalButton></div></div></div><div className="award-grid">{room.winner && <div className="award"><Star /><span>{room.questions.length <= 3 ? 'PSYCHIC' : room.hints.length === 0 ? 'BIG BRAIN' : 'CASE CRACKER'}</span><strong>{room.players.find((p) => p.id === room.winner)?.name}</strong></div>}{room.players.some((p) => p.wrong > 0) && <div className="award pink"><Skull /><span>CONFIDENTLY WRONG</span><strong>{[...room.players].sort((a, b) => b.wrong - a.wrong)[0].name}</strong></div>}{room.hints.length > 0 && <div className="award"><Lightbulb /><span>PROFESSIONAL HINTER</span><strong>{[...room.players].sort((a, b) => b.hints - a.hints)[0].name}</strong></div>}</div><h3 className="leader-title">THE PECKING ORDER.</h3>{[...room.players].sort((a, b) => b.points - a.points).map((p, i: number) => <div className="leader-row" key={p.id}><strong>#{i + 1}</strong><PlayerAvatar name={p.name} index={i}/><h3>{p.name}</h3><span>{p.wins} WINS · {p.streak} STREAK</span><strong>{p.points} PTS</strong></div>)}</section>}
        {error && <div className="error" role="alert">{error}</div>}</main>}
    {modal === 'setup' && <BrutalModal title={mode === 'daily' ? 'YOUR DAILY HUMBLING.' : mode === 'speed' ? '60 SECONDS. GO.' : mode === 'hotseat' ? 'TAKE THE HOT SEAT.' : mode === 'friends' ? 'ROUND UP THE SUSPECTS.' : 'LET’S TEST THAT BRAIN.'} onClose={() => { setModal(''); setError(''); }}><div className="modal-body">{['friends', 'hotseat'].includes(mode) && <div className="segmented"><button className={!join ? 'active' : ''} onClick={() => setJoin(false)}>CREATE ROOM</button><button className={join ? 'active' : ''} onClick={() => setJoin(true)}>JOIN ROOM</button></div>}<form onSubmit={e => { e.preventDefault(); launch(); }}><label>WHAT DO WE CALL YOU?<input autoFocus maxLength={24} value={name} onChange={e => setName(e.target.value)} placeholder="Your name (or a believable alias)"/></label>{join ? <label>ROOM CODE<input required value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="DIS-234567"/></label> : <>{mode === 'daily' ? <div className="hint-note"><Zap /><p>One mystery. One guess. The same person for everyone, changing at midnight UTC. Questions and clues cost points.</p></div> : <><label>PICK YOUR SUSPECT POOL<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c} disabled={!availableCategories.includes(c)}>{c}{availableCategories.includes(c)?'':' — coming soon'}</option>)}</select></label><label>HOW BRAVE ARE YOU?</label><div className="difficulty-grid">{[['Easy', '20'], ['Medium', '15'], ['Hard', '10'], ['Unhinged', '8']].map(([d, n]) => <button type="button" className={difficulty === d ? 'selected' : ''} key={d} onClick={() => setDifficulty(d)}><strong>{d}</strong><span>{n} QUESTIONS</span></button>)}</div><p className="small-print">{difficulty === 'Unhinged' ? 'No hints. You asked for this.' : 'Questions −25 · Clues −100 · Tea −150 · Wrong guesses −50'}</p><label>ROUNDS<select value={rounds} onChange={e => setRounds(e.target.value)}>{[1, 3, 5, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'round' : 'rounds'}</option>)}</select></label><details className="modifiers"><summary>SPICE THINGS UP <span>OPTIONAL MODIFIERS +</span></summary>{[['noHints', 'NO HINTS', 'Your brain is on its own.'], ['oneShot', 'ONE SHOT', 'One guess per player.'], ['speedrun', 'SPEEDRUN', '60 seconds. Unlimited questions.'], ['oneWord', 'ONE WORD', 'No explanations. Just answers.'], ['doubleTrouble', 'DOUBLE TROUBLE', 'Double wrong-guess penalties.'], ['anonymous', 'ANONYMOUS QUESTIONS', 'Hide who asked what.'], ['showWrong', 'PUBLIC SHAME', 'Everyone sees wrong guesses.']].map(([k, t, d]) => <label className="check-label" key={k}><input type="checkbox" checked={!!settings[k]} onChange={e => setSettings({ ...settings, [k]: e.target.checked })}/><span><strong>{t}</strong><small>{d}</small></span></label>)}</details></>}</>}{error && <div className="error" role="alert">{error}</div>}<BrutalButton type="submit" className="lime full" disabled={busy}>{busy ? 'ASSEMBLING THE CHAOS…' : join ? 'LET ME IN' : mode === 'friends' || mode === 'hotseat' ? 'CREATE ROOM' : 'LET’S PLAY'} <ArrowRight size={20}/></BrutalButton><p className="small-print center">NO ACCOUNT. NO EXCUSES.</p></form></div></BrutalModal>}
    {modal === 'guess' && <BrutalModal title="BIG CLAIM. SAY THE NAME." onClose={() => setModal('')}><form key={wrongFlash} className={"modal-body "+(wrongFlash?"wrong-guess-shake":"")} onSubmit={async (e) => { e.preventDefault(); await act('guess', { text: guess, bet }); }}><div className="guess-margin"><Gremlin cue={cameo} placement="mystery-card-edge"/></div><label>WHO DIS?<input autoFocus required value={guess} maxLength={100} onChange={e => setGuess(e.target.value)} placeholder="Full name. Full confidence."/></label><label>HOW SURE ARE YOU?</label><div className="bet-grid">{[['safe', 'SAFE', '1×'], ['risky', 'RISKY', '1.5×'], ['madman', 'ABSOLUTE MADMAN', '2×']].map(([b, t, m]) => <button type="button" className={bet === b ? 'selected' : ''} key={b} onClick={() => setBet(b)}><strong>{t}</strong><span>{m} REWARD & PENALTY</span></button>)}</div><p className="small-print">{room?.settings.showWrong ? 'Wrong guesses are public in this room. Choose wisely.' : 'Your wrong guesses stay private. Your embarrassment won’t.'}</p>{error && <div className="error" role="alert">{error}</div>}<BrutalButton type="submit" className="lime full" disabled={busy || !guess.trim()}>LOCK IT IN <ArrowUpRight /></BrutalButton></form></BrutalModal>}
    {modal === 'how' && <BrutalModal title="A QUICK INTERROGATION." onClose={() => setModal('')}><div className="modal-body how-steps">{[['01', 'ONE MYSTERY PERSON.', 'We pick someone famous. You bring the confidence.'], ['02', 'ASK SMART.', 'Ask about groups, relationships, collaborations, or their career. Rumors keep their labels; missing receipts stay UNKNOWN.'], ['03', 'MAKE YOUR ACCUSATION.', 'Guess the full name when you know. Wrong guesses cost points. In a room, the first correct guess wins.']].map(([n, t, p]) => <div key={n}><b>{n}</b><section><h3>{t}</h3><p>{p}</p></section></div>)}<div className="hint-note"><p>Start with 1,000 points. Each question costs everyone 25, each clue costs 100, tea costs 150, and a wrong guess costs only you 50. Confidence bets multiply both rewards and penalties. The round score never drops below zero.</p></div><p className="small-print">Hot Seat: the Game Master sees the name and answers manually. The role rotates each round. Questions at the limit? You can still guess, or the host can end the round. Daily attempts are remembered in this browser. Answers use curated public records. Missing facts stay UNKNOWN; reported facts stay labeled. Tea gets stronger with each purchase.</p><BrutalButton className="lime full" onClick={() => setup('solo')}>GOT IT. PROBABLY. <ArrowRight /></BrutalButton></div></BrutalModal>}
    {modal === 'leaderboard' && <BrutalModal title="THE HALL OF EGO." onClose={() => setModal('')}><div className="modal-body"><span className="eyebrow">TOP MATCH SCORES · LAST 100 FINISHED ROOMS</span>{!leaders.length ? <div className="feed-empty"><Trophy size={44}/><h3>NO GLORY YET.</h3><p>Finish a round. Give this wall a reason to exist.</p></div> : leaders.map((p, i) => <div className="leader-row" key={i}><strong>#{i + 1}</strong><h3>{p.name}</h3><strong>{p.points} PTS</strong></div>)}</div></BrutalModal>}
    {modal === 'giveup' && <BrutalModal title="CALLING IT?" onClose={() => setModal('')}><div className="modal-body"><p>This ends the round for everyone and reveals the mystery person.</p><div className="button-row"><BrutalButton onClick={() => setModal('')}>KEEP THINKING</BrutalButton><BrutalButton className="pink" disabled={busy} onClick={async () => { await act('giveup'); setModal(''); }}>REVEAL THE ANSWER</BrutalButton></div></div></BrutalModal>}
    {toast && <div className="toast" role="status"><Check size={20}/>{toast}</div>}</>;
}
