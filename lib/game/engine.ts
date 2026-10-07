import { people, productionPeople, type Person } from './people';
import {answerQuestion} from './answer-engine';
export {answerQuestion,isInjection} from './answer-engine';
import {safeFact} from './identity-guard';
import type {TeaFact} from './knowledge-types';
export type GameInput={action?:string;code?:string;name?:string;mode?:string;difficulty?:string;category?:string;rounds?:number|string;settings?:Record<string,boolean>;text?:string;bet?:string;resolved?:{answer:string;explanation?:string}};
export type Player = {
    id: string;
    secret: string;
    name: string;
    ready: boolean;
    points: number;
    wins: number;
    wrong: number;
    penalty: number;
    lastAction: number;
    streak: number;
    hints: number;
};
export type Room = {
    code: string;
    mode: string;
    phase: 'lobby' | 'playing' | 'ended';
    host: string;
    players: Player[];
    person: number;
    round: number;
    rounds: number;
    difficulty: string;
    category: string;
    limit: number;
    questions: {
        id: string;
        by: string;
        text: string;
        answer: string;
        explanation?: string;
        confidence?: string;
    }[];
    hints: string[];
    tea?: TeaFact[];
    events: {
        text: string;
        time: number;
    }[];
    winner: string | null;
    endsAt: number | null;
    startedAt: number;
    settings: Record<string, boolean>;
    gm: string | null;
    finished: boolean;
    used: number[];
};
export function normalize(s: string) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); }
export function correct(p: Person, guess: string) { return [p.name, ...p.aliases].some(n => normalize(n) === normalize(guess)); }
export function score(r: Room, p: Player) { return Math.max(0, 1000 - r.questions.length * 25 - r.hints.length * 100 - (r.tea?.length||0)*150 - p.penalty); }
const regionWeights:Record<string,number>={'USA / Canada':25,'UK / Ireland':15,'India':14,'Europe':15,'Latin America':8,'East / Southeast Asia':8,'Africa':5,'Middle East':4,'Australia / New Zealand':5,'Other':1};
export function selectPerson(category:string,used:number[]=[],difficulty='Medium',random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296){
 const matching=productionPeople.filter(p=>category==='Surprise me'||category==='World Icons'||p.categories.includes(category));
 const difficultyMatch=(p:Person)=>difficulty==='Easy'?p.popularityScore>=75:difficulty==='Medium'?p.popularityScore>=40:difficulty==='Hard'?p.popularityScore<85:p.popularityScore<60;
 let pool=matching.filter(p=>difficultyMatch(p)&&!used.includes(p.id));if(!pool.length)pool=matching.filter(p=>!used.includes(p.id));if(!pool.length)pool=matching;if(!pool.length)throw Error('No quality-approved profiles in this pack yet. Try World Icons.');
 const regionCounts:Record<string,number>={};for(const p of pool)regionCounts[p.region]=(regionCounts[p.region]||0)+1;
 const recent=used.slice(-2).map(id=>people[id]).filter(Boolean);const weights=pool.map(p=>(regionWeights[p.region]||1)/regionCounts[p.region]*(recent.length===2&&recent.every(v=>v.region===p.region)?.07:1)*(recent.length===2&&recent.every(v=>v.category===p.category)?.12:1));
 let pick=random()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<pool.length;i++){pick-=weights[i];if(pick<0)return pool[i].id}return pool[pool.length-1].id;
}
export function newPlayer(secret: string, name: string): Player { return { id: crypto.randomUUID(), secret, name: name.trim().slice(0, 24) || 'Suspect', ready: false, points: 0, wins: 0, wrong: 0, penalty: 0, lastAction: 0, streak: 0, hints: 0 }; }
export function newRoom(code: string, player: Player, input: GameInput): Room { const difficulty: string = ['Easy', 'Medium', 'Hard', 'Unhinged'].includes(input.difficulty||'') ? input.difficulty! : 'Easy'; const mode = ['solo', 'friends', 'hotseat', 'speed', 'daily'].includes(input.mode||'') ? input.mode! : 'solo'; return { code, mode, phase: 'lobby', host: player.id, players: [player], person: -1, round: 0, rounds: Math.min(10, Math.max(1, Number(input.rounds) || 3)), difficulty, category: input.category || 'Surprise me', limit: ({ Easy: 20, Medium: 15, Hard: 10, Unhinged: 8 } as Record<string, number>)[difficulty] || 20, questions: [], hints: [], events: [], winner: null, endsAt: null, startedAt: 0, settings: Object.fromEntries(['noHints', 'oneShot', 'speedrun', 'oneWord', 'doubleTrouble', 'anonymous', 'showWrong'].map(k => [k, !!input.settings?.[k]])), gm: null, finished: false, used: [] }; }
export function startRound(r: Room) { if (r.finished)
    throw Error('This match is finished. Create a new room for a rematch.'); r.round++; r.person = selectPerson(r.category, r.used, r.difficulty); r.used.push(r.person); r.phase = 'playing'; r.questions = []; r.hints = []; r.tea = []; r.winner = null; r.events = []; r.startedAt = Date.now(); r.endsAt = r.mode === 'speed' || r.settings.speedrun ? Date.now() + 60000 : null; r.gm = r.mode === 'hotseat' ? r.players[(r.round - 1) % r.players.length].id : null; for (const p of r.players) {
    p.wrong = 0;
    p.penalty = 0;
    p.hints = 0;
} }
export function finishRound(r: Room, winner: Player | null, multiplier = 1) { if (r.phase !== 'playing')
    throw Error('Round has already ended.'); r.phase = 'ended'; r.winner = winner?.id || null; r.finished = r.round >= r.rounds; for (const p of r.players) {
    if (p.id === winner?.id) {
        p.streak++;
        p.wins++;
        p.points += Math.round(score(r, p) * multiplier * (1 + Math.min(p.streak - 1, 5) * .05));
    }
    else
        p.streak = 0;
} }
export function expire(r: Room) { if (r.phase === 'playing' && r.endsAt && Date.now() >= r.endsAt)
    finishRound(r, null); }
export function publicRoom(r: Room, secret: string) { const me = r.players.find(p => p.secret === secret); if (!me)
    throw Error('You are not in this room.'); const p = people[r.person]; return { code: r.code, mode: r.mode, phase: r.phase, host: r.host, me: me.id, round: r.round, rounds: r.rounds, difficulty: r.difficulty, category: r.category, limit: r.limit, questions: r.questions, hints: r.hints, teaAvailable: p?.tea.length||0, tea: (r.tea||[]).map(({sourceUrls,...v})=>v), imageStage: r.phase==='ended'?4:r.difficulty==='Unhinged'?0:r.difficulty==='Hard'?Math.min(1,Math.floor(r.questions.length/4)):Math.min(3,Math.floor((r.questions.length+r.hints.length*2+(r.tea?.length||0)*2)/4)), events: r.events.slice(-10), winner: r.winner, endsAt: r.endsAt, startedAt: r.startedAt, settings: r.settings, gm: r.gm, finished: r.finished, players: r.players.map(({ secret, lastAction, ...v }) => ({ ...v, score: score(r, { ...v, secret: '', lastAction: 0 }) })), reveal: r.phase === 'ended' ? p : null, masterPerson: r.phase === 'playing' && me.id === r.gm ? p.name : null }; }
export function apply(r: Room, secret: string, action: string, input: GameInput) {
    expire(r);
    const p = r.players.find(p => p.secret === secret);
    if (!p)
        throw Error('You are not in this room.');
    if (action === 'ready') {
        p.ready = !p.ready;
        return;
    }
    if (action === 'start') {
        if (p.id !== r.host)
            throw Error('Only the host can start.');
        if (r.phase === 'playing')
            throw Error('Round already started.');
        if (['friends', 'hotseat'].includes(r.mode) && (r.players.length < 2 || r.players.some(v => v.id !== r.host && !v.ready)))
            throw Error('At least two players are needed, and guests must be ready.');
        startRound(r);
        return;
    }
    if (action === 'react') {
        if (!['🔥', '💀', '🧠', '🤨', '😭'].includes(input.text||''))
            throw Error('Unknown reaction');
        if (Date.now() - p.lastAction < 700)
            throw Error('One reaction at a time.');
        p.lastAction = Date.now();
        r.events.push({ text: `${p.name} ${input.text}`, time: Date.now() });
        r.events = r.events.slice(-20);
        return;
    }
    if (r.phase !== 'playing')
        throw Error('This round is not active.');
    if (p.id === r.gm && action !== 'answer')
        throw Error('The Game Master answers questions this round.');
    if (Date.now() - p.lastAction < 500)
        throw Error('Give that thought half a second.');
    p.lastAction = Date.now();
    if (action === 'ask') {
        const text = String(input.text || '').trim();
        if (text.length < 4 || text.length > 200)
            throw Error('Ask a question between 4 and 200 characters.');
        if (!r.endsAt && r.questions.length >= r.limit)
            throw Error('You had your questions. Make a final guess.');
        if (r.questions.some(q => q.answer === 'WAITING'))
            throw Error('Wait for the Game Master to answer.');
        const answer = r.mode === 'hotseat' ? { answer: 'WAITING' } : input.resolved || answerQuestion(people[r.person], text);
        r.questions.push({ id: crypto.randomUUID(), by: r.settings.anonymous ? 'Anonymous' : p.name, text, answer: answer.answer, ...(!r.settings.oneWord && answer.explanation ? { explanation: answer.explanation } : {}) });
        return;
    }
    if (action === 'answer') {
        if (p.id !== r.gm)
            throw Error('Only the Game Master can answer.');
        const q = r.questions.find(q => q.answer === 'WAITING');
        if (!q || !['YES','NO','PARTLY','MOSTLY','SORT OF','TECHNICALLY...','COMPLICATED','REPORTEDLY','NOT QUITE','UNKNOWN'].includes(input.text||''))
            throw Error('No pending question or invalid answer.');
        q.answer = input.text!;
        return;
    }
    if (action === 'hint') {
        if (r.settings.noHints || r.difficulty === 'Unhinged')
            throw Error('Hints are disabled.');
        if (r.hints.length >= Math.min(6,people[r.person].hints.length))
            throw Error('No clues left. Trust your brain.');
        r.hints.push(people[r.person].hints[r.hints.length]);
        p.hints++;
        return;
    }
    if (action === 'tea') {
        if(r.settings.noHints||r.difficulty==='Unhinged')throw Error('Clues and tea are disabled in this round.');
        r.tea ||= [];
        const fact=people[r.person].tea.filter(t=>t.safeForGame&&safeFact(people[r.person],t.fact)&&!r.tea!.some(v=>v.id===t.id)).sort((a,b)=>a.clueStrength-b.clueStrength)[0];
        if(!fact)throw Error('The teapot is empty. No invented refills.');
        r.tea.push(fact);return;
    }
    if (action === 'giveup') {
        if (p.id !== r.host)
            throw Error('Only the host can end the round.');
        finishRound(r, null);
        return;
    }
    if (action === 'guess') {
        if (r.settings.oneShot && p.wrong)
            throw Error('Your one shot has been used.');
        const guess = String(input.text || '').trim();
        if (!guess || guess.length > 100)
            throw Error('Enter a name up to 100 characters.');
        const mult = input.bet === 'madman' ? 2 : input.bet === 'risky' ? 1.5 : 1;
        if (correct(people[r.person], guess)) {
            finishRound(r, p, mult);
            return;
        }
        p.wrong++;
        p.penalty += 50 * mult * (r.settings.doubleTrouble ? 2 : 1);
        r.events.push({ text: `${p.name}: CONFIDENT. WRONG.${r.settings.showWrong ? ` Guessed ${guess}.` : ''}`, time: Date.now() });
        r.events = r.events.slice(-20);
        if (r.settings.oneShot && r.players.filter(v => v.id !== r.gm).every(v => v.wrong > 0))
            finishRound(r, null);
        return;
    }
    throw Error('Unknown action.');
}
