const {test}=require('node:test');const assert=require('node:assert/strict');
const {people,productionPeople}=require('../work/test-build/people.js');
const {teaFields,rankedTea,buildTeaKnowledge,teaQuality}=require('../work/test-build/tea-knowledge.js');
const {teaReviews}=require('../work/test-build/tea-reviews.js');
const {answerQuestion}=require('../work/test-build/answer-engine.js');
const {newPlayer,newRoom,startRound,apply,publicRoom}=require('../work/test-build/engine.js');
const {safeFact}=require('../work/test-build/identity-guard.js');
const fixtures={
 'Albert Einstein':/divorce.*Nobel/i,'Marie Curie':/research partner|scandal/i,'Tom Hanks':/Volunteers/,'Leonardo DiCaprio':/Gisele Bündchen/,'Tom Cruise':/Nicole Kidman.*divorce|marriage.*Nicole Kidman/i,'Marilyn Monroe':/baseball legend/,'Charlie Chaplin':/playwright.*fourth marriage/,'Taylor Swift':/Harry Styles/,'Beyonce':/joint album/,'Freddie Mercury':/rock frontperson.*opera star/,'John Lennon':/Paul McCartney/,'Ed Sheeran':/jury.*Marvin Gaye/i,'Lady Gaga':/Taylor Kinney.*engagement/,'Steve Jobs':/power struggle/,'Nelson Mandela':/marriage ended.*1996/i,'Frida Kahlo':/divorcing.*self-portrait/,'Salvador Dali':/Paul Éluard/,'Jin':/denied.*disbanding/,'Jungkook':/denied.*disbanding/,'Shakira':/footballer.*ended.*2022/
};
for(const [name,receipt] of Object.entries(fixtures))test(`real Tea purchases: ${name}`,()=>{
 const p=people.find(p=>p.name===name);assert.ok(p.eligible,JSON.stringify(p.exclusionReasons));assert.equal(p.teaQuality.score,100);assert.match(p.tea[0].fact,receipt);
 const player=newPlayer('tea-fixture','Detective'),room=newRoom('TEAFIXTURE',player,{mode:'solo'});startRound(room);room.person=p.id;
 for(let i=0;i<p.tea.length;i++){player.lastAction=0;apply(room,player.secret,'tea',{});const t=room.tea.at(-1);assert.ok(t.juiciness>=60);assert.ok(safeFact(p,t.fact));if(i)assert.ok(room.tea[i-1].juiciness>=t.juiciness);}
 assert.equal(new Set(room.tea.map(t=>t.storyId)).size,room.tea.length);assert.throws(()=>{player.lastAction=0;apply(room,player.secret,'tea',{})},/empty/);
 assert.ok(!JSON.stringify(publicRoom(room,player.secret).tea).includes('sourceUrls'));
 const answer=answerQuestion(p,'What are they most famous for?');assert.notEqual(answer.answer,'UNKNOWN');assert.notEqual(answerQuestion(p,'What are they best known for?').answer,'UNKNOWN');assert.ok(answer.factIds.every(id=>id.startsWith('tea-iconicWorks-')));assert.doesNotMatch(answer.explanation,/record exists|work includes|profession/);
});
test('all eligible profiles have dedicated structured fields and evidence, never generic Tea',()=>{
 assert.ok(productionPeople.length>=20);
 for(const p of productionPeople){for(const field of teaFields){assert.ok(Array.isArray(p.teaKnowledge[field]));for(const record of p.teaKnowledge[field]){assert.ok(record.sourceUrls.length);assert.ok(record.asOf);}}
  assert.ok(p.teaQuality.eligible);assert.ok(p.tea.every(t=>t.juiciness>=60));assert.ok(p.teaKnowledge.iconicWorks.length);
 }
 assert.ok(people.some(p=>!p.eligible&&p.exclusionReasons.includes('Tea quality: missing reviewed')));
});
test('strict descending score beats topic variety, and high quality suppresses trivia',()=>{
 const p=people.find(p=>p.name==='Lady Gaga');const k=buildTeaKnowledge(p,p.social);
 const result=rankedTea(p,k,[{id:'basic',topic:'nationalities',fact:'They are American.',status:'verified',sourceUrls:['https://example.org']}]);
 assert.equal(result.filter(t=>t.topic==='engagement').length,2);assert.ok(!result.some(t=>t.juiciness===5));assert.ok(result.findIndex(t=>t.topic==='engagement')<result.findIndex(t=>t.topic==='collaboration'));
});
test('specific question intents retrieve their own receipts',()=>{
 const examples=[['Taylor Swift','Who did they date?',/Harry Styles/],['Leonardo DiCaprio','Did they date anyone famous?',/Gisele/],['Tom Cruise','Who was their famous ex?',/Nicole Kidman/],['Tom Cruise','Did they get divorced?',/2001/],['Tom Hanks','Were they married?',/Volunteers/],['Marie Curie','Any scandals?',/1911/],['Shakira','Were they ever in a controversy?',/2023.*2026/],['John Lennon','Did they feud with anyone?',/McCartney/],['Beyonce','Were they part of a band?',/Destiny/],['John Lennon','Did they leave a group?',/1969/],['Tom Hanks','What movie made them famous?',/Big/]];
 for(const [name,q,receipt] of examples){const answer=answerQuestion(people.find(p=>p.name===name),q);assert.notEqual(answer.answer,'UNKNOWN',name+q);assert.match(answer.explanation,receipt);}
 assert.equal(answerQuestion(people.find(p=>p.name==='Tom Cruise'),'Did they get divorced from Batman?').answer,'UNKNOWN');
});
test('denials, reports and rumors cannot become verified, and names are disclosed deliberately',()=>{
 const gaga=people.find(p=>p.name==='Lady Gaga');assert.ok(gaga.tea.some(t=>t.status==='publicly_denied'&&/PUBLICLY DENIED.*Bradley Cooper/.test(t.fact)));
 const swift=people.find(p=>p.name==='Taylor Swift');assert.equal(swift.tea[0].status,'widely_reported');assert.match(swift.tea[0].fact,/Harry Styles/);
 const beyonce=people.find(p=>p.name==='Beyonce');assert.ok(!beyonce.tea.some(t=>t.fact.includes('Jay-Z')));
 for(const status of ['rumored','disputed','publicly_denied','widely_reported']){const k=buildTeaKnowledge(gaga,gaga.social);k.rumoredRelationships=[{...k.rumoredRelationships[0],status}];const t=rankedTea(gaga,k,[]).find(t=>t.topic==='rumored_relationship');assert.equal(t.status,status);assert.ok(t.fact.startsWith(status.replace(/_/g,' ').toUpperCase()));}
});
test('quality gate requires reviewed public life, iconic work, interesting stories and relevant coverage',()=>{
 const p=people.find(p=>p.name==='Shakira'),empty=Object.fromEntries(teaFields.map(f=>[f,[]]));assert.equal(teaQuality(p.name,empty,[],true,p.social).eligible,false);
 const k={...p.teaKnowledge,controversies:[]};assert.equal(teaQuality(p.name,k,p.tea,true,p.social).eligible,false);
 assert.ok(teaReviews[p.name].coverage.relevantFields.includes('controversies'));
 const h={...p.social,relationships:[{personName:'A Public Person',type:'former_spouse',status:'verified',endYear:2020,famous:true,sourceUrls:['https://example.org'],asOf:'2026-10-10'}]};assert.equal(buildTeaKnowledge({name:'Fixture',aliases:[]},h).famousExes.length,0);
});
