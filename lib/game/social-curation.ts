import type {Evidence,GroupMembership,PublicRelationship,PublicRumor,SocialEvent,SocialHistory} from './knowledge-types';
// Historical statements are dated snapshots, never claims about today's private life.
const asOf='2026-10-09';
const evidence=(url:string):Evidence=>({sourceUrls:[url],asOf});
const group=(name:string,kind:GroupMembership['kind'],url:string,extra:Partial<GroupMembership>={}):GroupMembership=>({groupName:name,kind,status:'member',evidenceStatus:'verified',...evidence(url),...extra});
const relationship=(name:string,type:PublicRelationship['type'],url:string,extra:Partial<PublicRelationship>={}):PublicRelationship=>({personName:name,type,status:'verified',...evidence(url),...extra});
const event=(id:string,topic:SocialEvent['topic'],summary:string,url:string,extra:Partial<SocialEvent>={}):SocialEvent=>({id,topic,summary,status:'verified',...evidence(url),...extra});
const rumor=(id:string,summary:string,topic:PublicRumor['topic'],status:PublicRumor['status'],url:string,extra:Partial<PublicRumor>={}):PublicRumor=>({id,summary,topic,status,virality:'high',safeForGame:true,...evidence(url),...extra});
const profile=(mode:'solo'|'group'|'both',url:string,data:Partial<SocialHistory>):SocialHistory=>({groups:[],relationships:[],rumors:[],events:[],musicReview:{mode,...evidence(url)},...data});
const beyonce='https://live.grammy.com/news/beyonce-grammys-facts-renaissance-songs-albums-jay-z-kids-blue-ivy-destinys-child-collaborators-halo-queen-bey';
const museum='https://www.womenshistory.org/education-resources/biographies/beyonce-knowles-carter';
const queen='https://www.queenonline.com/freddie_mercury';
const lennon='https://www.johnlennon.com/about/';
const gaga='https://www.grammy.com/artists/lady-gaga/3611/';
const engagement='https://abcnews.com/Entertainment/lady-gaga-engaged-taylor-kinney/story?id=29005538';
const carino='https://abcnews.com/GMA/Culture/lady-gaga-fianc-christian-carino-reportedly-split/story?id=61186074';
const denial='https://abcnews.com/GMA/Culture/lady-gaga-responds-bradley-cooper-oscars-chemistry-wanted/story?id=61379978';
const shakira='https://www.grammy.com/artists/shakira/17393/';
const breakup='https://news.sky.com/story/shakira-and-barcelona-defender-gerard-pique-announce-separation-after-11-year-relationship-12627634';
const duet='https://www.officialcharts.com/songs/taylor-swift-ft-ed-sheeran-everything-has-changed/';
// Curated records replace raw partner claims for these subjects, including unreviewed future/current claims.
export const socialCuration:Record<string,SocialHistory>={
 'Beyonce':profile('both',museum,{
  groups:[group("Destiny's Child",'group',museum,{status:'solo_after_group',leftYear:2005,current:false,role:'lead vocalist'}),group('The Carters','duo',beyonce,{joinedYear:2018})],
  relationships:[relationship('Jay-Z','married',beyonce,{startYear:2008,famous:true,sameIndustry:true,notes:'Their marriage was documented in 2008; this record does not certify present status.'})],
  events:[event('solo','solo_career','They released their solo debut while their group was still together.',museum),event('reunion','reunion','They reunited with their former group at Coachella in 2018.',beyonce,{year:2018,subjects:["Destiny's Child"]}),event('duet','collaboration','They made a collaborative album with Jay-Z in 2018.',beyonce,{subjects:['Jay-Z']}),event('milestone','career_milestone','Their solo debut included Crazy in Love.',museum)]
 }),
 'Freddie Mercury':profile('both',queen,{
  groups:[group('Queen','band',queen,{role:'lead vocalist',current:false}),group('Wreckage','band',queen,{status:'former_member',current:false})],
  events:[event('solo','solo_career','They released solo records while still part of their famous band.',queen),event('opera','collaboration','They recorded with opera singer Montserrat Caballé.',queen,{subjects:['Montserrat Caballé']}),event('milestone','career_milestone','Their pop-and-opera partnership produced the album Barcelona.',queen)]
 }),
 'John Lennon':profile('both',lennon,{
  groups:[group('The Beatles','band',lennon,{status:'former_member',current:false,leftYear:1969}),group('Plastic Ono Band','collective','https://www.johnlennon.com/news/who-are-the-plastic-ono-band/',{status:'founder',current:false,joinedYear:1969}),group('The Quarrymen','band','https://www.beatlesbible.com/people/john-lennon/biography/',{status:'founder',current:false,joinedYear:1957})],
  events:[event('solo','solo_career','They built a solo career after their famous band split.',lennon),event('departure','departure','They left The Beatles in 1969. That does not mean they were fired.','https://www.biography.com/musicians/john-lennon',{subjects:['The Beatles'],year:1969}),event('duet','collaboration','They made recordings with Yoko Ono.',lennon,{subjects:['Yoko Ono']}),event('fallout','band_drama','A 1971 song took aim at former bandmate Paul McCartney.','https://www.johnlennon.com/music/albums/imagine-the-ultimate-collection/',{subjects:['Paul McCartney'],year:1971}),event('milestone','career_milestone','Their Imagine album arrived in 1971.',lennon)]
 }),
 'Lady Gaga':profile('solo',gaga,{
  relationships:[relationship('Taylor Kinney','dated',engagement,{startYear:2011,endYear:2016,famous:true,sameIndustry:false}),relationship('Taylor Kinney','engaged',engagement,{startYear:2015,endYear:2016,endReason:'breakup',famous:true}),relationship('Christian Carino','engaged',carino,{endYear:2019,endReason:'breakup',notes:'A representative confirmed the end of the engagement.'})],
  rumors:[rumor('oscars','They publicly denied a romance with Bradley Cooper after their 2019 Oscars duet.','dating','publicly_denied',denial,{subjects:['Bradley Cooper']}),rumor('engagement-end','Speculation about a missing engagement ring preceded confirmation that their engagement had ended in 2019.','breakup','later_confirmed',carino,{subjects:['Christian Carino']})],
  events:[event('duet','collaboration','They recorded two jazz albums with Tony Bennett.',gaga,{subjects:['Tony Bennett']}),event('oscars-duet','collaboration','They performed Shallow with Bradley Cooper at the 2019 Oscars.',denial,{subjects:['Bradley Cooper']}),event('milestone','career_milestone','Their jazz collaborations won Grammy awards.',gaga),event('split','public_breakup','Their representative confirmed the end of an engagement in 2019.',carino,{year:2019,subjects:['Christian Carino']})]
 }),
 'Shakira':profile('solo',shakira,{
  relationships:[relationship('Gerard Piqué','partner',breakup,{startYear:2011,endYear:2022,endReason:'breakup',famous:true,sameIndustry:false})],
  events:[event('split','public_breakup','They and their footballer partner announced their separation in 2022.',breakup,{year:2022,subjects:['Gerard Piqué']}),event('duet','collaboration','They recorded Hips Don’t Lie with Wyclef Jean.',shakira,{subjects:['Wyclef Jean']}),event('milestone','career_milestone','They performed that worldwide hit at the 2007 Grammy Awards.',shakira)]
 }),
 'Taylor Swift':profile('solo','https://www.taylorswift.com/read-my-letter/',{
  relationships:[relationship('Harry Styles','dated','https://au.rollingstone.com/music/music-news/harry-styles-new-direction-1749/',{startYear:2012,endYear:2013,famous:true,sameIndustry:true,status:'widely_reported',endReason:'breakup'})],
  events:[event('duet','collaboration','They recorded Everything Has Changed with Ed Sheeran.',duet,{subjects:['Ed Sheeran']}),event('masters','career_comeback','They announced buying back their earlier master recordings in 2025.','https://www.taylorswift.com/read-my-letter/',{year:2025}),event('milestone','career_milestone','They re-recorded four earlier albums before buying back the catalog.','https://www.taylorswift.com/read-my-letter/')]
 }),
 'Ed Sheeran':profile('solo','https://www.grammy.com/artists/ed-sheeran/6178/',{
  events:[event('duet','collaboration','They recorded Everything Has Changed with Taylor Swift.',duet,{subjects:['Taylor Swift']}),event('writing','collaboration','They co-wrote Love Yourself for Justin Bieber.','https://www.grammy.com/artists/ed-sheeran/6178/',{subjects:['Justin Bieber']}),event('milestone','career_milestone','Their songwriting credits include a hit for another major pop artist.','https://www.grammy.com/artists/ed-sheeran/6178/')]
 })
};

const unicef='https://www.unicef.org/press-releases/unicef-and-bts-celebrate-success-groundbreaking-love-myself-campaign';
const astronaut='https://www.coldplay.com/jin-of-bts-announced-as-special-guest-for-buenos-aires-broadcast/';
const seven='https://www.youtube.com/watch?v=QU9c0053UAU';
socialCuration['Jin']=profile('both',astronaut,{
 groups:[group('BTS','group',unicef)],
 events:[event('solo','solo_career','They released a solo single without a documented departure from their group.',astronaut),event('duet','collaboration','They co-wrote The Astronaut with Coldplay.',astronaut,{subjects:['Coldplay']}),event('milestone','career_milestone','Their solo single The Astronaut was announced in 2022.',astronaut,{year:2022}),event('unicef','philanthropy','Their group helped raise millions for a UNICEF anti-violence campaign.',unicef)]
});
socialCuration['Jungkook']=profile('both',seven,{
 groups:[group('BTS','group',unicef)],
 events:[event('solo','solo_career','They released solo music; that alone does not mean they left their group.',seven),event('duet','collaboration','Their solo single Seven features Latto.',seven,{subjects:['Latto']}),event('milestone','career_milestone','Their solo debut album is Golden.','https://bts.ibighit.com/eng/discography/jung-kook/detail/golden/'),event('unicef','philanthropy','Their group helped raise millions for a UNICEF anti-violence campaign.',unicef)]
});
for(const name of ['Jin','Jungkook'])socialCuration[name].rumors.push(rumor('group-breakup','In 2022, their label publicly denied that their group was disbanding.','band','publicly_denied','https://en.yna.co.kr/view/AEN20220616003400315',{subjects:['BTS']}));
socialCuration['Taylor Swift'].rumors.push(rumor('novel','The director of Argylle publicly denied the online theory that they secretly wrote its novel.','career','publicly_denied','https://news.sky.com/story/director-matthew-vaughn-responds-to-rumours-taylor-swift-was-secret-author-behind-argylle-13063129',{subjects:['Argylle']}));
