import type {Person} from './people';
import type {ResolvedAnswer,FactStatus,AnswerLabel,GroupMembership,PublicRelationship,SocialEvent} from './knowledge-types';
import {normalize,safeFact} from './identity-guard';
import {qualified} from './social-history';
export const socialIntents=new Set(['band_membership','group_membership','former_group','solo_career','relationship','dating_history','marriage','engagement','breakup','rumor','feud','collaboration','band_drama','reunion','public_incident']);
export function socialIntent(text:string):string|null{
 const s=text.toLowerCase().replace(/[’]/g,"'");
 const group=/\b(band|bands|boyband|girlgroup|group|groups|duo|collective|supergroup|bandmate|bandmates)\b/.test(s);
 if(/\b(rumou?rs?|rumou?red|speculation|speculate|denied|denial|linked to)\b/.test(s))return 'rumor';
 if(group&&/feud|fight|conflict|fallout|falling out|drama|kicked|fired|dismiss/.test(s))return 'band_drama';
 if(/reunit|reunion|back together/.test(s)&&(!/partner|ex|dating/.test(s)))return 'reunion';
 if(group&&/\bleft\b|\bleave\b|former|before|previous/.test(s))return 'former_group';
 if(/\bsolo\b/.test(s))return 'solo_career';
 if(group)return /\bband\b|\bbands\b/.test(s)?'band_membership':'group_membership';
 if(/engag|fianc/.test(s))return 'engagement';
 if(/break.?up|broke.?up|split|separat|relationship drama/.test(s))return 'breakup';
 if(/marri|marry|spouse|wife|husband|divorc|wedding|widow/.test(s))return 'marriage';
 if(/\b(date|dated|dating|ex|exes)\b/.test(s))return 'dating_history';
 if(/\b(relationship|relationships|partner|partners|boyfriend|girlfriend|romance)\b/.test(s))return 'relationship';
 if(/collaborat|duet|work(?:ed)? with|record(?:ed)? with|team(?:ed)? up|sang with|sing with|perform(?:ed)? with|shared a stage/.test(s))return 'collaboration';
 if(/feud|rival|fallout|falling out/.test(s))return 'feud';
 if(/public incident|viral moment|internet moment|award.show|apolog|interview moment|public friendship|comeback/.test(s))return 'public_incident';
 return null;
}
const labels:Partial<Record<FactStatus,AnswerLabel>>={reported:'REPORTEDLY',widely_reported:'WIDELY REPORTED',rumored:'RUMORED',publicly_denied:'PUBLICLY DENIED',disputed:'DISPUTED',later_confirmed:'LATER CONFIRMED',false:'FALSE'};
const uncertain=new Set<FactStatus>(['rumored','publicly_denied','disputed','false']);
function yearIn(s:string){return s.match(/\bin\s+(\d{4})\b/)?.[1]}
function matchesName(question:string,names:string[],verbs:string){
 const target=question.match(new RegExp(`(?:${verbs})\\s+(.+?)[?.!]*$`,'i'))?.[1]?.replace(/[?.!]+$/,'').trim();
 if(!target||/^(a |an |the |any|some|another |each |their |his |her |a-list|famous|major|ever|before|after|them|they|him|her)/i.test(target))return true;
 return names.some(name=>normalize(target).includes(normalize(name)));
}
export function answerSocial(p:Person,q:string,topic:string):ResolvedAnswer{
 const h=p.social,s=q.toLowerCase().replace(/[’]/g,"'");
 const unknown=():ResolvedAnswer=>({answer:'UNKNOWN',explanation:'No reviewed receipt for that specific question. Try another angle.',confidence:'unknown',validQuestion:true,factIds:[],topic});
 const reply=(text:string,status:FactStatus='verified',ids:string[]=[],label:AnswerLabel='YES'):ResolvedAnswer=>{
  if(!safeFact(p,text))text='A matching public record exists; the name would reveal too much.';
  let answer=labels[status]||label;
  if(/\bnot\b|\bnever\b|\b(?:isn't|aren't|wasn't|weren't|didn't|don't|doesn't)\b/.test(s)){
   if(status!=='verified'||!['YES','NO'].includes(answer))return unknown();
   answer=answer==='YES'?'NO':'YES';text='Answering the negative phrasing: '+text;
  }
  const explanation=qualified(text,status);
  return {answer,explanation:explanation.length<=200?explanation:qualified('A matching public record exists; details are kept off this clue.',status),confidence:status,validQuestion:true,factIds:ids,topic};
 };
 const safeName=(name:string)=>safeFact(p,name)?name:'a public figure whose name would give this away';
 const groupAnswer=(groups:GroupMembership[])=>{
  if(!groups.length)return unknown();
  const names=groups.map(g=>g.groupName).filter(n=>safeFact(p,n));
  const status=groups.some(g=>g.evidenceStatus!=='verified')?'reported':'verified';
  const former=groups.every(g=>g.current===false||['former_member','solo_after_group'].includes(g.status));
  return reply(names.length?`Their music-group history includes ${names.slice(0,3).join(', ')}${names.length>3?', among others':''}.`:'They have documented music-group history. The group name would give too much away.',status,groups.map(g=>'social-group'+h.groups.indexOf(g)),former?'FORMERLY':'YES');
 };
 if(['band_membership','group_membership','former_group'].includes(topic)){
  let groups=h.groups.filter(g=>g.status!=='collaborator');
  if(/duo/.test(s))groups=groups.filter(g=>g.kind==='duo');
  if(/girl group|boy band/.test(s))groups=groups.filter(g=>g.kind==='group');
  if(/\bcurrently\b|\bstill\b|\bnow\b/.test(s))groups=groups.filter(g=>g.current===true);
  if(topic==='former_group'){
   if(/kicked|fired|dismiss/.test(s))return unknown();
   groups=groups.filter(g=>g.current===false||g.status==='former_member'||g.status==='solo_after_group');
   if(/leave|left/.test(s)){const event=h.events.find(e=>e.topic==='departure');if(event)return reply(event.summary,event.status,['social-event'+h.events.indexOf(event)]);return unknown()}
  }
  if(!matchesName(s,groups.map(g=>g.groupName),'in|part of|member of'))return unknown();
  const namedGroups=groups.filter(g=>normalize(s).includes(normalize(g.groupName)));if(namedGroups.length)groups=namedGroups;
  const y=yearIn(s);if(y)groups=groups.filter(g=>g.joinedYear!==undefined&&g.leftYear!==undefined&&+y>=g.joinedYear&&+y<=g.leftYear);
  return groupAnswer(groups);
 }
 if(topic==='solo_career'){
  const event=h.events.find(e=>e.topic==='solo_career');
  if(event)return reply(event.summary,event.status,['social-event'+h.events.indexOf(event)]);
  if(/before|after|leave|left/.test(s))return unknown();
  return h.musicReview&&['solo','both'].includes(h.musicReview.mode)?reply('A solo recording career is documented. That does not establish whether they ever belonged to a group.'):unknown();
 }
 if(['marriage','relationship','dating_history','engagement','breakup'].includes(topic)){
  const namedRumor=h.rumors.find(r=>r.safeForGame&&r.topic==='dating'&&r.subjects?.some(n=>normalize(s).includes(normalize(n))));
  if(namedRumor&&['relationship','dating_history'].includes(topic))return reply(namedRumor.summary,namedRumor.status,['social-rumor'+h.rumors.indexOf(namedRumor)]);
  let relations=h.relationships.filter(r=>!uncertain.has(r.status)&&r.type!=='rumored');
  if(topic==='marriage')relations=relations.filter(r=>['married','former_spouse'].includes(r.type));
  if(topic==='engagement')relations=relations.filter(r=>r.type==='engaged');
  if(topic==='breakup')relations=relations.filter(r=>r.endReason==='breakup'||r.endReason==='divorce');
  if(/divorc/.test(s))relations=relations.filter(r=>r.endReason==='divorce');
  if(/widow/.test(s))relations=relations.filter(r=>r.endReason==='bereavement');
  if(/famous|celebrity|a-list/.test(s))relations=relations.filter(r=>r.famous===true);
  if(/\bex\b|\bexes\b/.test(s))relations=relations.filter(r=>r.endYear!==undefined&&r.endReason!=='bereavement');
  if(/same industry/.test(s))relations=relations.filter(r=>r.sameIndustry===true);
  if(!matchesName(s,relations.map(r=>r.personName),'dated|date|dating|married to|engaged to|relationship with|break up with'))return unknown();
  const namedRelations=relations.filter(r=>normalize(s).includes(normalize(r.personName)));if(namedRelations.length)relations=namedRelations;
  const y=yearIn(s);if(y)relations=relations.filter(r=>r.startYear!==undefined&&r.endYear!==undefined&&+y>=r.startYear&&+y<=r.endYear);
  const current=/\bcurrently\b|\bstill\b|\bnow\b|^are they married|^is (?:he|she) married/.test(s);
  if(current){const r=relations[0];return r?reply(`A ${topic==='marriage'?'marriage':'public relationship'} with ${safeName(r.personName)} is documented; this historical record does not certify today's status.`,r.status,['social-relationship'+h.relationships.indexOf(r)],'COMPLICATED'):unknown()}
  if(!relations.length){if(topic==='breakup'){const e=h.events.find(e=>e.topic==='public_breakup');if(e)return reply(e.summary,e.status,['social-event'+h.events.indexOf(e)])}return unknown()}
  const r=relations[0];
  const describe=(r:PublicRelationship)=>topic==='breakup'?`Their relationship with ${safeName(r.personName)} ended${r.endYear?' in '+r.endYear:''}.`:topic==='engagement'?`An engagement to ${safeName(r.personName)} is documented${r.startYear?' from '+r.startYear:''}.`:topic==='marriage'?`A marriage to ${safeName(r.personName)} is documented${r.startYear?' from '+r.startYear:''}.`:`Their public relationship history includes ${safeName(r.personName)}${r.startYear?' from '+r.startYear:''}.`;
  return reply(describe(r),r.status,['social-relationship'+h.relationships.indexOf(r)]);
 }
 if(topic==='rumor'){
  let rumors=h.rumors.filter(r=>r.safeForGame);
  if(/dating|date|romance|linked/.test(s))rumors=rumors.filter(r=>r.topic==='dating');
  if(/band|group|reunion/.test(s))rumors=rumors.filter(r=>r.topic==='band');
  if(/break|split/.test(s))rumors=rumors.filter(r=>r.topic==='breakup');
  if(/feud/.test(s))rumors=rumors.filter(r=>r.topic==='feud');
  const match=rumors.find(r=>matchesName(s,r.subjects||[],'with|linked to|date|dating|about'));
  return match?reply(match.summary,match.status,['social-rumor'+h.rumors.indexOf(match)]):unknown();
 }
 const eventTopics:Record<string,SocialEvent['topic'][]>={band_drama:/kicked|fired|dismiss/.test(s)?['dismissal']:['band_drama'],feud:['feud','band_drama'],collaboration:['collaboration'],reunion:['reunion'],public_incident:/friendship/.test(s)?['friendship']:/comeback/.test(s)?['career_comeback']:/apolog/.test(s)?['public_apology']:/interview/.test(s)?['interview']:/award/.test(s)?['award_show']:['public_incident','internet_moment','award_show','public_apology','interview']};
 const events=h.events.filter(e=>(eventTopics[topic]||[]).includes(e.topic));
 if(/secret|on mars/i.test(s))return unknown();
 const event=events.find(e=>matchesName(s,e.subjects||[],'with')&&(!yearIn(s)||e.year===Number(yearIn(s))));
 return event?reply(event.summary,event.status,['social-event'+h.events.indexOf(event)]):unknown();
}
