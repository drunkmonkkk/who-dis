import type {Evidence,FactStatus,PersonFact,SocialHistory,TeaFact} from './knowledge-types';
import {safeFact,normalize} from './identity-guard';
import {teaReviews} from './tea-reviews';

export const teaFields=['famousRelationships','marriages','divorces','engagements','famousExes','rumoredRelationships','publicBreakups','feuds','viralRumors','controversies','scandals','bandDrama','publicIncidents','famousCollaborations','iconicWorks','careerDrama','surprisingPersonalFacts'] as const;
export type TeaField=typeof teaFields[number];
export type TeaRecord=Evidence & {id:string;storyId:string;summary:string;teaText?:string;status:FactStatus;subjects?:string[];medium?:'movie'|'song'|'album'|'show'|'book'|'art'|'science'|'project';breakthrough?:boolean};
export type TeaKnowledge=Record<TeaField,TeaRecord[]>;
export type TeaReview={records:Partial<TeaKnowledge>;disclosures?:Record<string,string>;publicLifeReason?:Evidence & {reason:string};coverage:Evidence & {reason:string;relevantFields:TeaField[]}};
export const juiciness:Record<TeaField,number>={famousRelationships:100,marriages:98,divorces:99,engagements:98,publicBreakups:95,rumoredRelationships:94,famousExes:92,viralRumors:90,feuds:90,bandDrama:85,controversies:85,scandals:85,publicIncidents:84,famousCollaborations:75,iconicWorks:70,careerDrama:65,surprisingPersonalFacts:60};
const topics:Record<TeaField,string>={famousRelationships:'dating',marriages:'marriage',divorces:'divorce',engagements:'engagement',publicBreakups:'public_breakup',rumoredRelationships:'rumored_relationship',famousExes:'famous_ex',viralRumors:'rumor',feuds:'feud',bandDrama:'band_drama',controversies:'controversy',scandals:'scandal',publicIncidents:'public_incident',famousCollaborations:'collaboration',iconicWorks:'iconic_work',careerDrama:'career_comeback',surprisingPersonalFacts:'personal_story'};
export function buildTeaKnowledge(identity:{name:string;aliases:string[]},h:SocialHistory):TeaKnowledge{
 const k=Object.fromEntries(teaFields.map(f=>[f,[]])) as unknown as TeaKnowledge;
 // Empty arrays mean no reviewed entry, never that an event did not happen.
 const add=(field:TeaField,r:TeaRecord)=>k[field].push(r);
 h.relationships.forEach((r,i)=>{
  if(r.status==='reported')return; // Raw catalog links are not independently reviewed gossip.
  const id=`relationship${i}`,record:TeaRecord={id,storyId:id,summary:`They ${r.type==='engaged'?'were engaged to':['married','former_spouse'].includes(r.type)?'married':'had a public relationship with'} ${r.personName}${r.startYear?' in '+r.startYear:''}.`,status:r.type==='rumored'&&r.status==='verified'?'rumored':r.status,sourceUrls:r.sourceUrls,asOf:r.asOf,subjects:[r.personName]};
  if(['rumored','disputed','publicly_denied','false'].includes(r.status)||r.type==='rumored'){add('rumoredRelationships',record);return;}
  if(r.endReason==='breakup'&&r.endYear)record.summary=record.summary.replace(/\.$/,'')+`; the relationship ended in ${r.endYear}.`;
  if(r.type==='engaged')add('engagements',record);
  else if(['married','former_spouse'].includes(r.type))add('marriages',record);
  else if(r.famous)add('famousRelationships',record);
  if(r.endReason==='divorce')add('divorces',{...record,summary:`Their marriage to ${r.personName} ended in divorce${r.endYear?' in '+r.endYear:''}.`});
  if(r.endReason==='breakup')add('publicBreakups',{...record,summary:`Their ${r.type==='engaged'?'engagement':'relationship'} with ${r.personName} ended${r.endYear?' in '+r.endYear:''}.`});
  if(r.endYear&&r.famous&&['breakup','divorce'].includes(r.endReason||''))add('famousExes',{...record,summary:`${r.personName} is a famous ex; their relationship ended in ${r.endYear}.`});
 });
 h.rumors.filter(r=>r.safeForGame).forEach(r=>{const record={...r,id:'rumor-'+r.id,storyId:'rumor-'+r.id};if(r.topic==='dating')add('rumoredRelationships',record);if(r.virality==='high')add('viralRumors',record)});
 const events:Record<string,TeaField>={public_breakup:'publicBreakups',feud:'feuds',band_drama:'bandDrama',departure:'bandDrama',dismissal:'bandDrama',controversy:'controversies',public_incident:'publicIncidents',award_show:'publicIncidents',public_apology:'publicIncidents',philanthropy:'surprisingPersonalFacts',collaboration:'famousCollaborations',career_comeback:'careerDrama',fallout:'careerDrama',reunion:'careerDrama',solo_career:'careerDrama'};
 h.events.forEach(e=>{const field=events[e.topic];if(field)add(field,{...e,id:'event-'+e.id,storyId:'event-'+e.id})});
 for(const field of teaFields){const reviewed=teaReviews[identity.name]?.records[field];if(reviewed)k[field]=reviewed;}
 return k;
}
export function teaKnowledgeFacts(k:TeaKnowledge):PersonFact[]{return teaFields.flatMap(field=>k[field].map(r=>({id:`tea-${field}-${r.id}`,category:field==='iconicWorks'?'career':field==='famousCollaborations'?'collaboration':'public_life',topic:topics[field],fact:r.summary,value:r.summary,status:r.status,tags:[field],sourceUrls:r.sourceUrls,sensitivity:'careful'} as PersonFact)))}
export function rankedTea(identity:{name:string;aliases:string[]},k:TeaKnowledge,facts:PersonFact[]):TeaFact[]{
 const review=teaReviews[identity.name];
 const text=(r:TeaRecord)=>{let copy=r.teaText||r.summary;for(const [name,description] of Object.entries(review?.disclosures||{}))copy=copy.split(name).join(description);return copy};
 const candidates=teaFields.flatMap(field=>k[field].map(r=>({id:`tea-${field}-${r.id}`,storyId:r.storyId,topic:topics[field],priority:juiciness[field],juiciness:juiciness[field],fact:text(r),status:r.status,sourceUrls:r.sourceUrls,safeForGame:true,clueStrength:1 as 1|2|3}))).filter(t=>t.sourceUrls.length&&t.fact.length<=190&&safeFact(identity,t.fact));
 // A receipt, not an award-list filler. Generic facts are allowed only when no 70+ story exists.
 if(!candidates.some(t=>t.juiciness>=70))for(const f of facts.filter(f=>['instruments','education','works','awards','positions','nationalities','birthDate','professions'].includes(f.topic)&&safeFact(identity,f.fact))){const basic=['nationalities','birthDate','professions'].includes(f.topic);candidates.push({id:`fallback-${f.id}`,storyId:f.id,topic:'unexpected_fact',priority:basic?5:30,juiciness:basic?5:30,fact:f.fact,status:f.status,sourceUrls:f.sourceUrls,safeForGame:true,clueStrength:3})}
 candidates.sort((a,b)=>b.juiciness-a.juiciness);
 const ids=new Set<string>(),copies=new Set<string>();
 return candidates.filter(t=>{const key=normalize(t.fact);if(ids.has(t.storyId)||copies.has(key))return false;ids.add(t.storyId);copies.add(key);return true}).slice(0,10).map((t,i)=>({...t,clueStrength:Math.min(i+1,3) as 1|2|3,fact:t.status==='verified'?t.fact:`${t.status.replace(/_/g,' ').toUpperCase()}. ${t.fact}`}));
}
export function teaQuality(name:string,k:TeaKnowledge,tea:TeaFact[],musicRelevant:boolean,h:SocialHistory){
 const review=teaReviews[name];
 const sourced=(r:TeaRecord)=>r.sourceUrls.length>0&&!!r.asOf;
 const publicFields:TeaField[]=['famousRelationships','marriages','divorces','engagements','publicBreakups','famousExes','rumoredRelationships','feuds','viralRumors','controversies','scandals','bandDrama','publicIncidents','surprisingPersonalFacts'];
 const publicLife=publicFields.some(f=>k[f].some(sourced))||!!(review?.publicLifeReason?.reason&&review.publicLifeReason.sourceUrls.length);
 const iconic=k.iconicWorks.some(sourced),interesting=tea.some(t=>(t.juiciness||0)>=60&&t.topic!=='iconic_work');
 const groups=!musicRelevant||!!h.musicReview;
 const coverage=!!review?.coverage.reason&&!!review.coverage.sourceUrls.length&&review.coverage.relevantFields.every(f=>k[f].some(sourced));
 const checks={reviewed:!!review,publicLife,iconic,interesting,groups,coverage};
 const reasons=Object.entries(checks).filter(([,ok])=>!ok).map(([key])=>`Tea quality: missing ${key}`);
 return {score:(publicLife?25:0)+(iconic?25:0)+(interesting?25:0)+(groups?10:0)+(coverage?15:0),eligible:reasons.length===0,checks,reasons};
}
