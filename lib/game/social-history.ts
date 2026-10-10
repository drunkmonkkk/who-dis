import {rankedTea,buildTeaKnowledge} from './tea-knowledge';
import type {FactStatus,PersonFact,SourcePerson,SocialHistory,TeaFact,PublicRelationship,GroupMembership} from './knowledge-types';
import {socialCuration} from './social-curation';
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
// Compatibility entry point; ranking and structured coverage live in one place.
export function buildTea(identity:{name:string;aliases:string[]},history:SocialHistory,facts:PersonFact[]):TeaFact[]{
 return rankedTea(identity,buildTeaKnowledge(identity,history),facts);
}
