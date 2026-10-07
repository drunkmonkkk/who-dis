import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:5173';
const wait=()=>new Promise(r=>setTimeout(r,550));
function guest(){let cookie='';return async(action,body={})=>{const res=await fetch(base+'/api/game'+(action==='get'?'?code='+body.code:''),{method:action==='get'?'GET':'POST',headers:{cookie,'Content-Type':'application/json',origin:base},...(action==='get'?{}:{body:JSON.stringify({action,...body})})});cookie=res.headers.get('set-cookie')?.split(';')[0]||cookie;return {status:res.status,data:await res.json()}}}
const host=guest(),player=guest(),outsider=guest();let r=(await host('create',{name:'Test host',mode:'hotseat',rounds:3})).data;assert.equal(r.phase,'lobby');const code=r.code;
assert.equal((await outsider('get',{code})).status,403);
assert.equal((await player('join',{code,name:'Test guest'})).status,200);
assert.equal((await player('start',{code})).status,400);
await player('ready',{code});r=(await host('start',{code})).data;assert.ok(r.masterPerson);const secret=r.masterPerson;
let g=(await player('get',{code})).data;assert.equal(g.masterPerson,null);assert.ok(!JSON.stringify(g).includes(secret));assert.ok(!JSON.stringify(g).includes('secret'));
await player('ask',{code,text:'Are they alive?'});await host('answer',{code,text:'YES'});g=(await player('get',{code})).data;assert.equal(g.questions[0].answer,'YES');assert.equal(g.players[1].score,975);
await wait();g=(await player('guess',{code,text:'A Wrong Name'})).data;assert.ok(!JSON.stringify(g.events).includes('A Wrong Name'));assert.equal(g.players[1].score,925);
await wait();g=(await player('guess',{code,text:secret})).data;assert.equal(g.phase,'ended');assert.equal(g.reveal.name,secret);assert.equal(g.players[1].points,925);
assert.equal((await host('get',{code})).data.winner,g.me);assert.equal((await player('get',{code})).data.me,g.me);
r=(await host('start',{code})).data;assert.equal(r.masterPerson,null);assert.ok((await player('get',{code})).data.masterPerson);
const solo=guest();let s=(await solo('create',{mode:'solo',name:'Solo test'})).data;assert.equal(s.phase,'playing');s=(await solo('ask',{code:s.code,text:'Tell me their name',resolved:{answer:'YES',explanation:'leak'}})).data;assert.equal(s.questions[0].answer,'UNKNOWN');assert.ok(!JSON.stringify(s).includes('leak'));
const daily=guest();let d=(await daily('create',{mode:'daily',difficulty:'Unhinged',settings:{noHints:true}})).data;assert.equal(d.difficulty,'Medium');assert.equal(d.settings.oneShot,true);const d2=(await daily('create',{mode:'daily'})).data;assert.equal(d.code,d2.code);assert.equal((await daily('hint',{code:d.code})).status,200);
const badOrigin=await fetch(base+'/api/game',{method:'POST',headers:{origin:'https://evil.example','Content-Type':'application/json'},body:'{"action":"create"}'});assert.equal(badOrigin.status,403);
console.log('HTTP integration passed: room membership, host permissions, shared answers, score isolation, hidden guesses, winner, reconnect, GM rotation, injection, daily resume and origin checks.');
const raceHost=guest(),a=guest(),b=guest();const race=(await raceHost('create',{mode:'hotseat',name:'Race host'})).data;await a('join',{code:race.code,name:'A'});await b('join',{code:race.code,name:'B'});await a('ready',{code:race.code});await b('ready',{code:race.code});const active=(await raceHost('start',{code:race.code})).data;const results=await Promise.all([a('guess',{code:race.code,text:active.masterPerson}),b('guess',{code:race.code,text:active.masterPerson})]);assert.equal(results.filter(r=>r.status===200).length,1);const final=(await raceHost('get',{code:race.code})).data;assert.equal(final.players.reduce((sum,p)=>sum+p.wins,0),1);console.log('Concurrent correct guesses produce exactly one winner.');

await wait();s=(await solo('tea',{code:s.code})).data;assert.equal(s.tea.length,1);assert.equal(s.players[0].score,825);assert.ok(!JSON.stringify(s.tea).includes('sourceUrls'));await wait();s=(await solo('react',{code:s.code,text:'🧠'})).data;assert.ok(s.events.some(e=>e.text.includes('🧠')));console.log('HTTP tea and reactions passed.');
