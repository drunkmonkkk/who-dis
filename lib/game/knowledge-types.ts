export type FactStatus='verified'|'widely_reported'|'reported'|'disputed'|'publicly_denied'|'rumored'|'later_confirmed'|'false';
export type FactCategory='identity'|'career'|'relationship'|'family'|'controversy'|'rivalry'|'friendship'|'wealth'|'award'|'public_image'|'iconic_moment'|'early_life'|'death'|'fun_fact'|'location'|'education'|'music_group'|'collaboration'|'rumor'|'public_life';
export type PersonFact={id:string;category:FactCategory;topic:string;fact:string;value:string|number;status:FactStatus;tags:string[];sourceUrls:string[];validFrom?:string;validTo?:string;sensitivity:'normal'|'careful'};
export type TeaFact={id:string;fact:string;topic:string;status:FactStatus;clueStrength:1|2|3;safeForGame:boolean;sourceUrls:string[];storyId?:string;priority?:number;juiciness?:number};
export type SourceFact={field:string;value:string|number;property:string;sourceUrls:string[];status:string;qualifiers:Record<string,(string|number)[]>};
export type SourcePerson={name:string;wikidataId:string;aliases:string[];sourceUrl:string;verifiedAt:string;description:string;facts:SourceFact[];nationalities:string[];professions:string[];education:string[];awards:string[];works:string[];spouses:{name:string;start?:string;end?:string;sourceUrls:string[]}[];partners:{name:string;start?:string;end?:string;sourceUrls:string[]}[];children:string[];childCount?:number;parents:string[];siblings:string[];memberships:string[];languages:string[];residences:string[];employers:string[];teams:string[];genres:string[];instruments:string[];positions:string[];birthDate?:string;deathDate?:string;birthplace?:string;gender?:string;image?:string;popularityScore:number;category:string;region:string;sitelinkCount:number};
export type AnswerLabel='YES'|'NO'|'MOSTLY'|'SORT OF'|'TECHNICALLY...'|'COMPLICATED'|'REPORTEDLY'|'NOT QUITE'|'UNKNOWN'|'PARTLY'|'DISPUTED'|'PUBLICLY DENIED'|'RUMORED'|'WIDELY REPORTED'|'LATER CONFIRMED'|'FALSE'|'FORMERLY';
export type ResolvedAnswer={answer:AnswerLabel;explanation:string;confidence:FactStatus|'unknown';validQuestion:boolean;factIds:string[];topic:string};

export type Evidence = {sourceUrls:string[];asOf:string};
export type GroupMembership = Evidence & {
  groupName:string; kind:'band'|'group'|'duo'|'collective'|'supergroup'|'backing_group';
  role?:string;joinedYear?:number;leftYear?:number;current?:boolean;
  status:'member'|'former_member'|'founder'|'solo_after_group'|'temporary_member'|'collaborator';
  evidenceStatus:FactStatus; notes?:string;
};
export type PublicRelationship = Evidence & {
  personName:string;type:'dated'|'married'|'engaged'|'rumored'|'former_spouse'|'partner';
  startYear?:number;endYear?:number;current?:boolean;status:FactStatus;
  famous?:boolean;sameIndustry?:boolean;endReason?:'breakup'|'divorce'|'bereavement';notes?:string;
};
export type PublicRumor = Evidence & {
  id:string;summary:string;topic:'dating'|'feud'|'career'|'band'|'breakup'|'public_incident'|'collaboration'|'identity'|'other';
  status:'widely_reported'|'rumored'|'publicly_denied'|'disputed'|'later_confirmed'|'false';
  virality:'low'|'medium'|'high';safeForGame:boolean;subjects?:string[];
};
export type SocialEvent = Evidence & {
  id:string;topic:'solo_career'|'departure'|'dismissal'|'reunion'|'feud'|'band_drama'|'collaboration'|'collaboration_drama'|'public_incident'|'controversy'|'friendship'|'career_comeback'|'fallout'|'award_show'|'public_apology'|'interview'|'internet_moment'|'career_milestone'|'public_breakup'|'philanthropy';
  summary:string;status:FactStatus;year?:number;subjects?:string[];
};
export type SocialHistory = {
  groups:GroupMembership[];relationships:PublicRelationship[];rumors:PublicRumor[];events:SocialEvent[];
  musicReview?:{mode:'solo'|'group'|'both';asOf:string;sourceUrls:string[]};
};
