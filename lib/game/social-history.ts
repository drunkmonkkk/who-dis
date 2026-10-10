import type {FactStatus,PersonFact,SourcePerson,SocialHistory,TeaFact,PublicRelationship,GroupMembership} from './knowledge-types';
import {socialCuration} from './social-curation';
import {safeFact} from './identity-guard';
// An academy, union, sports team, or political party is not a music group.
const musicalGroups:Record<string,GroupMembership['kind']>={
 "Destiny's Child":'group','The Carters':'duo','The Jackson 5':'band','Queen':'band','The Beatles':'band','Plastic Ono Band':'collective','The Dirty Mac':'supergroup','The Quarrymen':'band','The Beat Brothers':'band','Bob Marley & The Wailers':'band','The Upsetters':'backing_group','John Lennon and Yoko Ono':'duo','Yellow Magic Orchestra':'band','Alva Noto + Ryuichi Sakamoto':'duo','U³':'band','BTS':'group','Blackpink':'group','Star Band':'band','Super Étoile':'band','Menudo':'group','Miami Sound Machine':'band','La Sonora Matancera':'band','Selena y Los Dinos':'band','LSD':'supergroup','Shakti':'band'
};
const year=(s?:string|number)=>s?Number(String(s).slice(0,4)):undefined;
const reputable=(url:string)=>{try{return /(^|\.)(people\.com|bbc\.(com|co\.uk)|apnews\.com|reuters\.com|theguardian\.com|nytimes\.com|britannica\.com|biography\.com|abcnews\.com|cnn\.com|rollingstone\.com|grammy\.com|eonline\.com|usatoday\.com|vogue\.com|vanityfair\.com|harpersbazaar\.com)$/.test(new URL(url).hostname)}catch{return false}};
export function buildSocialHistory(s:SourcePerson,catalog:SourcePerson[]):SocialHistory{
 const curated=socialCuration[s.name];
 const groups:GroupMembership[]=s.facts.filter(f=>f.field==='memberships'&&musicalGroups[String(f.value)]).map(f=>({groupName:String(f.value),kind:musicalGroups[String(f.value)],status:f.qualifiers.P582?.[0]?'former_member':'member',evidenceStatus:'reported',joinedYear:year(f.qualifiers.P580?.[0]),leftYear:year(f.qualifiers.P582?.[0]),...(f.qualifiers.P582?.[0]?{current:false}:{}),sourceUrls:f.sourceUrls,asOf:s.verifiedAt.slice(0,10)}));
 const relationships:PublicRelationship[]=s.facts.filter(f=>((f.field==='spouses'&&f.sourceUrls.length>0)||(f.field==='partners'&&f.sourceUrls.some(reputable)))).map(f=>{
  const other=catalog.find(p=>p.name===f.value||p.aliases.includes(String(f.value)));
  return {personName:String(f.value),type:f.field==='spouses'?(f.qualifiers.P582?.[0]?'former_spouse':'married'):'partner',status:'reported',startYear:year(f.qualifiers.P580?.[0]),endYear:year(f.qualifiers.P582?.[0]),famous:other?true:undefined,sameIndustry:other?other.professions.some(job=>s.professions.includes(job)):undefined,sourceUrls:f.field==='spouses'?f.sourceUrls:f.sourceUrls.filter(reputable),asOf:s.verifiedAt.slice(0,10)};
 });
 return {groups:curated?.groups.length?curated.groups:groups,relationships:curated?.relationships.length?curated.relationships:relationships,events:curated?.events||[],rumors:curated?.rumors||[],musicReview:curated?.musicReview};
}
export const statusLabel=(status:FactStatus)=>status.replace(/_/g,' ').toUpperCase();
export function qualified(text:string,status:FactStatus){return status==='verified'?text:`${statusLabel(status)}. ${text}`}
export function socialFacts(h:SocialHistory):PersonFact[]{
 const base=(id:string,category:PersonFact['category'],topic:string,fact:string,value:string,status:FactStatus,sourceUrls:string[]):PersonFact=>({id,category,topic,fact,value,status,sourceUrls,tags:[topic],sensitivity:category==='relationship'||category==='rumor'?'careful':'normal'});
 return [
  ...h.groups.map((g,i)=>base(`social-group${i}`,'music_group','group_membership',`A documented music group is ${g.groupName}.`,g.groupName,g.evidenceStatus,g.sourceUrls)),
  ...h.relationships.map((r,i)=>base(`social-relationship${i}`,'relationship',r.type==='married'||r.type==='former_spouse'?'marriage':r.type==='engaged'?'engagement':'dating_history',`A public ${r.type.replace(/_/g,' ')} relationship with ${r.personName} is recorded.`,r.personName,r.status,r.sourceUrls)),
  ...h.rumors.filter(r=>r.safeForGame).map((r,i)=>base(`social-rumor${i}`,'rumor','rumor',qualified(r.summary,r.status),r.summary,r.status,r.sourceUrls)),
  ...h.events.map((e,i)=>base(`social-event${i}`,e.topic==='collaboration'?'collaboration':'public_life',e.topic,e.summary,e.summary,e.status,e.sourceUrls))
 ];
}
type Story={id:string;topic:string;priority:number;status:FactStatus;sourceUrls:string[];copies:[string,string,string]};
export function buildTea(identity:{name:string;aliases:string[]},history:SocialHistory,facts:PersonFact[]):TeaFact[]{
 const stories:Story[]=[];
 const add=(s:Story)=>{if(s.sourceUrls.length&&s.copies.every(t=>t.length<=190&&safeFact(identity,t)))stories.push(s)};
 const named=(name:string)=>safeFact(identity,name)?name:'another public figure';
 history.relationships.forEach((r,i)=>{
  if(['rumored','disputed','publicly_denied','false'].includes(r.status)||r.type==='rumored')return;
  const marriage=['married','former_spouse'].includes(r.type),engaged=r.type==='engaged';
  const detail=marriage?`A marriage to ${named(r.personName)} is documented${r.startYear?' from '+r.startYear:''}.`:engaged?`They were engaged to ${named(r.personName)}${r.startYear?' in '+r.startYear:''}.`:`Their public relationship history includes ${named(r.personName)}${r.startYear?' from '+r.startYear:''}.`;
  add({id:`relationship${i}`,topic:marriage?'marriage':engaged?'engagement':'dating',priority:marriage||engaged?2:1,status:r.status,sourceUrls:r.sourceUrls,copies:[marriage?'A marriage is part of their public story.':engaged?'An engagement is part of their public story.':r.famous?'Their relationship history includes another famous person.':'A past relationship is documented in public sources.',detail,r.endReason==='divorce'?`A marriage to ${named(r.personName)} ended in divorce${r.endYear?' in '+r.endYear:''}.`:r.endReason==='breakup'?`Their relationship with ${named(r.personName)} ended${r.endYear?' in '+r.endYear:''}.`:detail]});
 });
 history.rumors.filter(r=>r.safeForGame).forEach((r,i)=>add({id:`rumor${i}`,topic:'rumor',priority:3,status:r.status,sourceUrls:r.sourceUrls,copies:[r.summary,r.summary,r.summary]}));
 history.groups.forEach((g,i)=>add({id:`group${i}`,topic:'band_drama',priority:5,status:g.evidenceStatus,sourceUrls:g.sourceUrls,copies:[`Their music history includes a ${g.kind.replace(/_/g,' ')}.`,`Their group history includes ${named(g.groupName)}.`,`They were part of ${named(g.groupName)}${g.leftYear?', with membership ending in '+g.leftYear:''}.`]}));
 const ranks:Record<string,number>={public_breakup:2,feud:4,band_drama:5,departure:5,dismissal:5,reunion:5,collaboration_drama:6,controversy:7,public_incident:8,award_show:8,public_apology:8,interview:8,internet_moment:8,fallout:9,career_comeback:9,solo_career:9,collaboration:10,friendship:10,career_milestone:10};
 history.events.forEach((e,i)=>add({id:`event${i}`,topic:e.topic,priority:ranks[e.topic]??10,status:e.status,sourceUrls:e.sourceUrls,copies:[e.summary,e.summary,e.summary]}));
 // Sourced unexpected facts are fallback material, after public/social history.
 facts.filter(f=>['career_drama','arrest','wealth','instruments','education','languages','teams','works','awards','positions','genres'].includes(f.topic)).forEach((f,i)=>add({id:`fallback${i}`,topic:f.topic==='arrest'?'controversy':f.topic==='career_drama'?'career_comeback':'unexpected_fact',priority:f.topic==='arrest'?7:f.topic==='career_drama'?9:10,status:f.status,sourceUrls:f.sourceUrls,copies:[f.fact,f.fact,f.fact]}));
 stories.sort((a,b)=>a.priority-b.priority);
 const selected:Story[]=[];const seen=new Set<string>();
 for(const story of stories){if(!seen.has(story.topic)){selected.push(story);seen.add(story.topic)}}
 for(const story of stories)if(!selected.includes(story)&&!selected.some(s=>s.copies[2]===story.copies[2]))selected.push(story);
 return selected.slice(0,10).map((s,i)=>{const strength=(i===0?1:i===1?2:3) as 1|2|3;return {id:`social-tea-${s.id}`,storyId:s.id,topic:s.topic,priority:s.priority,fact:qualified(s.copies[strength-1],s.status),status:s.status,clueStrength:strength,safeForGame:true,sourceUrls:s.sourceUrls}});
}
