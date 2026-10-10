const {test}=require('node:test');
const assert=require('node:assert/strict');
const {people,productionPeople}=require('../work/test-build/people.js');
const {answerQuestion,detectIntent,retrieveFacts}=require('../work/test-build/answer-engine.js');
const {validateModelAnswer}=require('../work/test-build/ai.js');
const {safeFact}=require('../work/test-build/identity-guard.js');
const {buildTea}=require('../work/test-build/social-history.js');
const {newPlayer,newRoom,startRound,apply,publicRoom,score}=require('../work/test-build/engine.js');
const get=n=>people.find(p=>p.name===n);
const answer=(n,q)=>answerQuestion(get(n),q);
test('natural phrases route to the specific social intent',()=>{
 for(const [q,t] of Object.entries({'band?':'band_membership','music group?':'group_membership','were they in a group?':'group_membership','did they go solo?':'solo_career','famous ex?':'famous_ex','relationship drama?':'breakup','any rumors?':'rumor','who were they linked to?':'rumor','did they leave a group?':'former_group','Did they feud with a bandmate?':'band_drama','Were they ever engaged?':'engagement','Did they reunite with their group?':'reunion','Did they collaborate with someone famous?':'collaboration','Were they ever married?':'marriage'}))assert.equal(detectIntent(q),t,q);
});
test('real musicians return group names, multiple groups, solos, duos and collaborators',()=>{
 const fixtures=[['Beyonce','Were they in a band?',"Destiny's Child"],['Beyonce','Which group were they part of?',"Destiny's Child"],['Beyonce','Were they in a duo?','The Carters'],['Beyonce','Did they go solo?','solo'],['John Lennon','Which band were they in?','The Beatles'],['Freddie Mercury','Were they part of a band?','Queen'],['Jungkook','music group?','BTS'],['Jin','Did they collaborate with someone famous?','Coldplay'],['Beyonce','Did they reunite with their group?','2018'],['Lady Gaga','Did they collaborate with someone famous?','Tony Bennett'],['John Lennon','Did they feud with a bandmate?','Paul McCartney'],['John Lennon','Did they leave a band?','1969']];
 for(const [n,q,receipt] of fixtures){const r=answer(n,q);assert.notEqual(r.answer,'UNKNOWN',n+': '+q);assert.ok(r.explanation.includes(receipt),JSON.stringify(r));assert.ok(safeFact(get(n),r.explanation));}
 assert.ok(answer('John Lennon','Which group were they part of?').explanation.includes('Plastic Ono Band'));
});
test('documented public relationships, engagements and breakups resolve separately',()=>{
 for(const [n,q,receipt] of [['Taylor Swift','Did they date someone famous?','Harry Styles'],['Taylor Swift','Who did they date?','Harry Styles'],['Lady Gaga','Were they ever engaged?','Taylor Kinney'],['Beyonce','Were they ever married?','rapper'],['Shakira','Did they have a public breakup?','2022'],['Taylor Swift','Did they date someone from the same industry?','Harry Styles']]){const r=answer(n,q);assert.notEqual(r.answer,'UNKNOWN');assert.ok(r.explanation.includes(receipt),JSON.stringify(r));}
 assert.equal(answer('Taylor Swift','Who did they date?').answer,'WIDELY REPORTED');
 assert.equal(answer('Beyonce','Are they married?').answer,'COMPLICATED');
 assert.equal(answer('Lady Gaga','Were they divorced?').answer,'UNKNOWN');
});
test('uncertainty survives retrieval and model-copy validation',()=>{
 const r=answer('Lady Gaga','Was there a viral rumor about them?');assert.equal(r.answer,'PUBLICLY DENIED');assert.match(r.explanation,/denied/i);
 assert.equal(answer('Lady Gaga','Were they rumored to date someone famous?').answer,'PUBLICLY DENIED');
 const confirmed=answer('Lady Gaga','Any breakup rumors?');assert.equal(confirmed.answer,'LATER CONFIRMED');
 const p=get('Lady Gaga');assert.equal(validateModelAnswer(p,r,{label:'YES',confidence:'verified',answer:'They definitely dated Bradley Cooper.'}),false);
 for(const status of ['rumored','disputed','publicly_denied','later_confirmed','false','widely_reported']){const clone={...p,social:{...p.social,rumors:[{...p.social.rumors[0],status}]}};const a=answerQuestion(clone,'any rumors?');assert.equal(a.confidence,status);assert.equal(a.answer,status.replace(/_/g,' ').toUpperCase());assert.notEqual(a.answer,'YES');}
});
test('retrieval never infers membership, dating, dismissals, divorce or current status from absence',()=>{
 for(const [n,q] of [['Taylor Swift','Were they in a band?'],['Beyonce','Were they kicked out of a band?'],['Jin','Did they leave a group?'],['Lady Gaga','Did they date Batman?'],['Lady Gaga','Did they collaborate with Metallica?'],['Shakira','Were they ever married?'],['John Lennon','Did they reunite with their group?'],['Lady Gaga','Any band rumors?']])assert.equal(answer(n,q).answer,'UNKNOWN',n+': '+q);
 assert.equal(answer('Lady Gaga','Were they dating Bradley Cooper?').answer,'PUBLICLY DENIED');
 assert.equal(answer('Tom Hanks','Were they in a band?').answer,'UNKNOWN');
 assert.ok(retrieveFacts(get('Beyonce'),'marriage').every(f=>f.topic==='marriage'));
});
test('priority Tea exposes public stories, preserves rumors, progresses and never reveals the subject',()=>{
 for(const n of ['Lady Gaga','Beyonce','John Lennon','Shakira','Taylor Swift']){const p=get(n);assert.ok(p.tea.length>=3);assert.notEqual(p.tea[0].topic,'unexpected_fact');let strength=0;for(const t of p.tea){assert.ok(t.clueStrength>=strength);strength=t.clueStrength;assert.ok(safeFact(p,t.fact));assert.ok(t.sourceUrls.length);}}
 const p=get('Lady Gaga');assert.ok(p.tea.some(t=>t.status==='publicly_denied'&&t.topic==='rumored_relationship'));assert.ok(p.tea.some(t=>t.status==='later_confirmed'));assert.ok(!p.tea.some(t=>t.topic==='unexpected_fact'));
 const a=newPlayer('tea-test','A'),r=newRoom('TEA-TEST',a,{mode:'solo'});startRound(r);r.person=p.id;
 for(let i=0;i<5;i++){a.lastAction=0;apply(r,a.secret,'tea',{});assert.equal(score(r,a),1000-150*(i+1));}
 const out=publicRoom(r,a.secret);assert.ok(out.tea.some(t=>t.status==='publicly_denied'));assert.ok(!JSON.stringify(out.tea).includes('sourceUrls'));assert.ok(!JSON.stringify(out.tea).includes(p.name));
 const unsafe={...p.social,rumors:[{...p.social.rumors[0],safeForGame:false}]};assert.ok(!buildTea(p,unsafe,p.facts).some(t=>t.status==='publicly_denied'));
});
test('quality gating excludes incomplete relevant music coverage and preserves IDs of existing rooms',()=>{
 for(const p of productionPeople){assert.ok(p.coverage.majorAchievements);assert.ok(p.tea.length>=3);assert.ok(p.hints.length>=6);assert.equal(people[p.id],p);}
 for(const n of ['Beyonce','John Lennon','Freddie Mercury','Lady Gaga','Taylor Swift','Shakira','Jin','Jungkook'])assert.ok(get(n).eligible,n+': '+get(n).exclusionReasons);
 for(const p of people.filter(p=>p.category==='Music'&&!p.social.musicReview&&/singer|musician|composer|rapper/.test(p.profession)))assert.equal(p.eligible,false,p.name);
});
