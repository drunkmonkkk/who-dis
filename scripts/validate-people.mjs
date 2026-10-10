import './compile-game.mjs';
import {createRequire} from 'node:module';
import {writeFileSync,mkdirSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {people,productionPeople}=require('../work/test-build/people.js');
const {safeFact}=require('../work/test-build/identity-guard.js');
const {answerQuestion}=require('../work/test-build/answer-engine.js');
const status=new Set(['verified','widely_reported','reported','disputed','publicly_denied','rumored','later_confirmed','false']);
const seen=new Set(),issues=[];let invalid=0;
const questions=['Were they in a band?','Did they go solo?','Which group were they part of?','Did they date someone famous?','Were they ever married?','Did they have a public breakup?','Were they ever engaged?','Was there a viral rumor about them?','Did they feud with a bandmate?','Did they reunite with their group?','Did they collaborate with someone famous?'];
for(const p of people){
 const errors=[];
 if(seen.has(p.source.wikidataId))errors.push('duplicate person');seen.add(p.source.wikidataId);
 if(p.facts.some(f=>!status.has(f.status)||!f.sourceUrls.length))errors.push('malformed fact status/source');
 if(p.tea.some(t=>!t.safeForGame||!safeFact(p,t.fact)||!status.has(t.status)||!t.sourceUrls.length))errors.push('unsafe tea');
 if(p.hints.some(h=>!safeFact(p,h)))errors.push('unsafe hint');
 for(const record of [...p.social.groups,...p.social.relationships,...p.social.rumors,...p.social.events])if(!record.sourceUrls.length||!record.asOf)errors.push('missing social provenance');
 if(p.social.groups.some(g=>g.joinedYear&&g.leftYear&&g.leftYear<g.joinedYear))errors.push('invalid membership dates');
 if(p.eligible&&(p.exclusionReasons.length||p.tea.length<3||p.hints.length<6||!p.coverage.majorAchievements))errors.push('production gate failed');
 if(p.social.groups.length&&answerQuestion(p,'Which group were they part of?').answer==='UNKNOWN')errors.push('group facts not retrievable');
 invalid+=errors.length;
 const reasons=[...p.exclusionReasons,...errors];
 issues.push({name:p.name,eligible:p.eligible,facts:p.facts.length,tea:p.tea.length,teaQuality:p.teaQuality,topTea:p.tea.slice(0,3).map(t=>({topic:t.topic,score:t.juiciness,text:t.fact})),relationships:p.social.relationships.length,groups:p.social.groups.length,rumors:p.social.rumors.length,events:p.social.events.length,reasons,questions:Object.fromEntries(questions.map(q=>[q,answerQuestion(p,q).answer]))});
}
const categoryCounts=Object.fromEntries([...new Set(productionPeople.flatMap(p=>p.categories))].sort().map(category=>[category,productionPeople.filter(p=>p.categories.includes(category)).length]));
const report={categoryCounts,catalog:people.length,eligible:productionPeople.length,excluded:people.length-productionPeople.length,facts:people.reduce((n,p)=>n+p.facts.length,0),tea:productionPeople.reduce((n,p)=>n+p.tea.length,0),reviewedMusic:productionPeople.filter(p=>p.social.musicReview).map(p=>p.name),rumorProfiles:productionPeople.filter(p=>p.social.rumors.length).map(p=>p.name),regions:Object.fromEntries([...new Set(productionPeople.map(p=>p.region))].map(region=>[region,productionPeople.filter(p=>p.region===region).length])),invalid,profiles:issues};
mkdirSync('work',{recursive:true});writeFileSync('work/people-validation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,profiles:`${issues.length} profiles audited; full reasons and question coverage in work/people-validation.json`},null,2));
// Quality requirements take precedence over the old arbitrary 200-person floor.
if(!productionPeople.length||invalid)process.exitCode=1;
