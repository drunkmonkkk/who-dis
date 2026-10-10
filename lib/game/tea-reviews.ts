import type {TeaField,TeaRecord,TeaReview} from './tea-knowledge';
import {categoryProfiles} from './category-profiles';
// Human-reviewed historical snapshots. No empty field is a claim of non-existence.
const asOf='2026-10-10';
const r=(id:string,summary:string,url:string,extra:Partial<TeaRecord>={}):TeaRecord=>({id,storyId:id,summary,status:'verified',sourceUrls:[url],asOf,...extra});
const review=(url:string,reason:string,records:TeaReview['records'],relevantFields:TeaField[]=[],disclosures:Record<string,string>={}):TeaReview=>({records,disclosures,coverage:{asOf,sourceUrls:[url],reason,relevantFields}});
const queen='https://www.queenonline.com/freddie_mercury';
const gaga='https://abcnews.com/GMA/Culture/lady-gaga-responds-bradley-cooper-oscars-chemistry-wanted/story?id=61379978';
const astronaut='https://www.coldplay.com/jin-of-bts-announced-as-special-guest-for-buenos-aires-broadcast/';
const unicef='https://www.unicef.org/press-releases/unicef-and-bts-celebrate-success-groundbreaking-love-myself-campaign';
const letter='https://www.taylorswift.com/read-my-letter/';
const shakira='https://www.grammy.com/artists/shakira/17393/';
const ed='https://www.pbs.org/newshour/arts/jury-finds-ed-sheeran-didnt-steal-from-marvin-gaye-classic';
const hanks='https://www.biography.com/actors/tom-hanks';
const leo='https://www.biography.com/actors/leonardo-dicaprio';
const cruise='https://www.biography.com/actors/tom-cruise';
const monroe='https://www.pbs.org/wnet/americanmasters/marilyn-monroe-career-timeline/62/';
const einstein='https://www.einstein-bern.ch/sites/default/files/spg_einsteinnobelpreis.pdf';
const jobs='https://book.stevejobsarchive.com/';
const mandela='https://www.nelsonmandela.org/biography';
const kahlo='https://www.moma.org/collection/works/78333';
const curie='https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/biographical/';
const chaplin='https://www.pbs.org/wnet/americanmasters/charlie-chaplin-biographical-timeline/14049/';
const dali='https://www.salvador-dali.org/en/dali-and-gala/dual-timeline/';
export const teaReviews:Record<string,TeaReview>={
 ...Object.fromEntries(Object.entries(categoryProfiles).map(([name,p])=>[name,p.review])),
 'Beyonce':review('https://www.womenshistory.org/education-resources/biographies/beyonce-knowles-carter','Reviewed group history, public marriage and reunion. No unsourced infidelity theories included.',{
  marriages:[r('jayz','They married Jay-Z in 2008; ten years later, the pair released a joint album.','https://live.grammy.com/news/beyonce-grammys-facts-renaissance-songs-albums-jay-z-kids-blue-ivy-destinys-child-collaborators-halo-queen-bey',{subjects:['Jay-Z']})],
  iconicWorks:[r('crazy','Their solo debut launched Crazy in Love, a collaboration with Jay-Z.','https://www.womenshistory.org/education-resources/biographies/beyonce-knowles-carter',{medium:'song',breakthrough:true})]
 },[],{'Jay-Z':'a superstar rapper'}),
 'Freddie Mercury':review(queen,'Reviewed solo/group history and Live Aid. This review contains no reliable relationship-rumor receipt; none is inferred.',{
  famousCollaborations:[r('opera','They recorded with opera singer Montserrat Caballé.',queen,{subjects:['Montserrat Caballé'],teaText:'A rock frontperson and an opera star made an unlikely recording partnership.'})],
  surprisingPersonalFacts:[r('live-aid','Their band turned a short Live Aid slot in 1985 into a show-stealing performance.',queen)],
  iconicWorks:[r('barcelona','Their Barcelona album paired a rock frontperson with opera singer Montserrat Caballé.',queen,{medium:'album'})]
 }),
 'John Lennon':review('https://www.johnlennon.com/music/albums/imagine-the-ultimate-collection/','Reviewed band departure and the documented McCartney song dispute; no breakup motives inferred.',{
  feuds:[r('mccartney','They aimed a 1971 song at former bandmate Paul McCartney. The band split had a musical aftershock.','https://www.johnlennon.com/music/albums/imagine-the-ultimate-collection/',{subjects:['Paul McCartney'],storyId:'event-fallout'})],
  iconicWorks:[r('imagine','Imagine became a signature solo song after their famous band split.','https://www.johnlennon.com/about/',{medium:'song'})]
 },['bandDrama','feuds'],{'Yoko Ono':'an avant-garde artist'}),
 'Lady Gaga':review(gaga,'Reviewed public engagements and the explicitly denied Oscars romance rumor.',{
  famousRelationships:[r('kinney','They dated actor Taylor Kinney for five years; the relationship reached an engagement before the split.','https://time.com/4413068/lady-gaga-taylor-kinney-break-up/',{subjects:['Taylor Kinney']})],
  iconicWorks:[r('shallow','Shallow took their screen partnership into an Oscars duet with Bradley Cooper.',gaga,{medium:'song'})]
 },['rumoredRelationships']),
 'Taylor Swift':review(letter,'Reviewed dating history, catalog dispute/recovery and the explicitly denied Argylle theory.',{
  iconicWorks:[r('eras','The Eras Tour helped fund their purchase of the original recordings after a years-long fight for ownership.',letter,{medium:'project'})]
 },['viralRumors','careerDrama']),
 'Shakira':review(shakira,'Reviewed announced breakup and dated tax-case outcomes; private motives are excluded.',{
  controversies:[r('tax','They settled a Spanish tax case in 2023. A separate tax case ended in acquittal in 2026.','https://www.gpb.org/news/2026/05/18/pop-star-shakira-acquitted-in-spanish-tax-fraud-case')],
  iconicWorks:[r('hips','Hips Don’t Lie teamed them with Wyclef Jean for a worldwide hit.',shakira,{medium:'song'})]
 },['publicBreakups','controversies'],{'Gerard Piqué':'a star footballer'}),
 'Ed Sheeran':review(ed,'Reviewed the copyright dispute and its jury outcome together; the allegation is never presented as a finding.',{
  controversies:[r('copyright','A jury rejected a claim that their hit copied Marvin Gaye. The copyright fight ended in their favor in 2023.',ed,{subjects:['Marvin Gaye']})],
  iconicWorks:[r('thinking','Thinking Out Loud became a signature hit—and the subject of a copyright trial they won.',ed,{medium:'song'})]
 },['controversies']),
 'Jin':review(unicef,'Reviewed group/solo history, philanthropy and the label’s explicit denial of disbanding. No dating speculation included.',{
  iconicWorks:[r('astronaut','The Astronaut paired their solo debut single with Coldplay’s songwriting.',astronaut,{medium:'song',breakthrough:true})]
 },['viralRumors']),
 'Jungkook':review(unicef,'Reviewed group/solo history, philanthropy and the label’s explicit denial of disbanding. No dating speculation included.',{
  iconicWorks:[r('golden','Their solo debut album Golden followed the Latto collaboration Seven.','https://bts.ibighit.com/eng/discography/jung-kook/detail/golden/',{medium:'album',breakthrough:true})]
 },['viralRumors']),
 'Tom Hanks':review(hanks,'Reviewed the public marriage/co-star connection. No sourced feud or rumor in this bounded review.',{
  marriages:[r('wilson','They married Rita Wilson in 1988 after co-starring in Volunteers.',hanks,{subjects:['Rita Wilson'],teaText:'They married a fellow actor after co-starring in Volunteers. The on-screen connection had an off-screen sequel.'})],
  famousCollaborations:[r('wilson-film','They co-starred with Rita Wilson in Volunteers before their marriage.',hanks,{subjects:['Rita Wilson']})],
  iconicWorks:[r('gump','Forrest Gump earned them a second consecutive Best Actor Oscar.','https://www.afi.com/laa/tom-hanks/',{medium:'movie'}),r('big','Big helped turn them into a major movie star.',hanks,{medium:'movie',breakthrough:true})]
 },[],{'Rita Wilson':'a fellow actor'}),
 'Leonardo DiCaprio':review(leo,'Reviewed publicly documented dating and repeat screen collaborations. No rumor inferred from co-starring.',{
  famousRelationships:[r('gisele','They dated supermodel Gisele Bündchen from 2000 to 2005.','https://www.biography.com/celebrities/gisele-bundchen',{subjects:['Gisele Bündchen']})],
  famousExes:[r('gisele-ex','Gisele Bündchen is a famous ex; their relationship ended in 2005.','https://www.biography.com/celebrities/gisele-bundchen',{subjects:['Gisele Bündchen'],storyId:'gisele'})],
  publicBreakups:[r('gisele-split','Their five-year relationship with Gisele Bündchen ended in 2005.','https://www.biography.com/celebrities/gisele-bundchen',{subjects:['Gisele Bündchen'],storyId:'gisele'})],
  famousCollaborations:[r('winslet','They reunited with Kate Winslet in Revolutionary Road after their blockbuster screen romance.',leo,{subjects:['Kate Winslet']})],
  iconicWorks:[r('titanic','Titanic made their doomed screen romance a worldwide phenomenon.',leo,{medium:'movie',breakthrough:true}),r('revenant','The Revenant finally brought them a Best Actor Oscar.',leo,{medium:'movie'})]
 }),
 'Tom Cruise':review(cruise,'Reviewed documented marriages and divorce. Scientology membership alone is not labeled a scandal.',{
  marriages:[r('kidman','They married Nicole Kidman after meeting on Days of Thunder.',cruise,{subjects:['Nicole Kidman']})],
  divorces:[r('kidman-divorce','Their marriage to Nicole Kidman ended in divorce in 2001.',cruise,{subjects:['Nicole Kidman'],storyId:'kidman'})],
  famousExes:[r('kidman-ex','Nicole Kidman is a famous ex; their marriage ended in 2001.',cruise,{subjects:['Nicole Kidman'],storyId:'kidman'})],
  iconicWorks:[r('top-gun','Top Gun turned their fighter-pilot role into an enduring screen identity.',cruise,{medium:'movie',breakthrough:true}),r('mission','Mission: Impossible became their long-running action franchise.',cruise,{medium:'movie'})],
  famousCollaborations:[r('days','They co-starred with future spouse Nicole Kidman in Days of Thunder.',cruise,{subjects:['Nicole Kidman']})]
 }),
 'Marilyn Monroe':review(monroe,'Reviewed marriages and divorce; unconfirmed presidential-affair claims are deliberately not treated as receipts.',{
  marriages:[r('miller','They married playwright Arthur Miller in 1956. Hollywood and the theatre became a real-life pairing.',monroe,{subjects:['Arthur Miller'],teaText:'They married a celebrated playwright in 1956. Hollywood and the theatre became a real-life pairing.'})],
  divorces:[r('dimaggio','Their marriage to Joe DiMaggio lasted less than a year.','https://www.joedimaggio.com/the-man/marriages/',{subjects:['Joe DiMaggio'],teaText:'Their marriage to a baseball legend lasted less than a year.'})],
  iconicWorks:[r('hot','Some Like It Hot paired them with Tony Curtis and Jack Lemmon.',monroe,{medium:'movie'})],
  famousCollaborations:[r('misfits','Their playwright husband wrote The Misfits, which became their final completed film.','https://www.biography.com/actors/marilyn-monroe-arthur-miller-relationship')]
 },[],{'Arthur Miller':'a celebrated playwright','Joe DiMaggio':'a baseball legend'}),
 'Albert Einstein':review(einstein,'Reviewed the divorce settlement; no speculative credit-sharing or private-life claims included.',{
  divorces:[r('nobel-divorce','Their divorce settlement promised future Nobel Prize money to their former spouse.',einstein,{subjects:['Mileva Marić']})],
  marriages:[r('mileva','They married Mileva Marić in Bern in 1903, against their families’ wishes.','https://www.old.einstein-bern.ch/index.php?lang=en&show=bern',{subjects:['Mileva Marić'],teaText:'They married a fellow physics student against their families’ wishes.'})],
  iconicWorks:[r('photoelectric','Their explanation of the photoelectric effect earned a Nobel Prize—not the relativity work they are famous for.',einstein,{medium:'science'})],
  careerDrama:[r('patent','They produced their breakthrough work while employed at a patent office.','https://www.einstein-bern.ch/einstein-and-bern/')]
 }),
 'Steve Jobs':review(jobs,'Reviewed the company power struggle and return using first-person archival material. No private-family allegations included.',{
  publicIncidents:[r('ousted','A leadership power struggle pushed them out of the company they co-founded in 1985.',jobs)],
  careerDrama:[r('return','They returned to the company they had left and became its leader again in 1997.',jobs)],
  iconicWorks:[r('iphone','They unveiled the first iPhone in 2007, combining a phone, music player and internet device.',jobs,{medium:'project'})],
  famousCollaborations:[r('wozniak','They co-founded Apple with Steve Wozniak before their famous boardroom fallout.',jobs,{subjects:['Steve Wozniak']})]
 }),
 'Nelson Mandela':review(mandela,'Reviewed public marriage, separation and imprisonment. Political imprisonment is a public incident, not celebrity scandal.',{
  marriages:[r('winnie','They married Winnie Madikizela in 1958, during a treason trial.',mandela,{subjects:['Winnie Madikizela'],teaText:'They married a fellow anti-apartheid campaigner during a treason trial.'})],
  divorces:[r('winnie-divorce','Their marriage ended in 1996, four years after a public separation.','https://tpy.nelsonmandela.org/peopleplacesevents/madikizela-mandela-nomzamo-winifred')],
  publicIncidents:[r('prison','They spent more than 27 years in prison under apartheid before becoming president.',mandela)],
  iconicWorks:[r('long-walk','Long Walk to Freedom told the story behind their journey from prison to the presidency.','https://www.nelsonmandela.org/learners-timeline',{medium:'book'})]
 }),
 'Frida Kahlo':review(kahlo,'Reviewed divorce and its documented artistic response. No unreviewed affair allegations included.',{
  divorces:[r('rivera','They divorced fellow artist Diego Rivera in 1939, then painted themselves with cropped hair.',kahlo,{subjects:['Diego Rivera'],teaText:'After divorcing a fellow artist, they cut their hair and made the breakup part of a self-portrait.'})],
  famousExes:[r('rivera-ex','Diego Rivera was both their spouse and, after the 1939 divorce, their ex.',kahlo,{subjects:['Diego Rivera'],storyId:'rivera'})],
  iconicWorks:[r('cropped','Self-Portrait with Cropped Hair traded the artist’s usual feminine dress for a man’s suit.',kahlo,{medium:'art'})],
  careerDrama:[r('autonomy','After the divorce, they vowed to support themselves through sales of their own paintings.',kahlo)]
 }),
 'Marie Curie':review(curie,'Reviewed scientific partnership, bereavement and the documented 1911 press scandal; the scandal is not proof of every press allegation.',{
  marriages:[r('pierre','They married their research partner; together they investigated the radiation that transformed physics.',curie,{subjects:['Pierre Curie']})],
  controversies:[r('press','A 1911 press scandal over their relationship with Paul Langevin erupted during their second Nobel Prize year.','https://www.nobelprize.org/prizes/themes/marie-and-pierre-curie-and-the-discovery-of-polonium-and-radium/',{subjects:['Paul Langevin']})],
  iconicWorks:[r('radium','Their research isolated polonium and radium, transforming the study of radioactivity.',curie,{medium:'science'})],
  careerDrama:[r('chair','After their husband’s death, they took over his Sorbonne professorship—the first woman in that post.',curie)]
 },['controversies']),
 'Charlie Chaplin':review(chaplin,'Reviewed public marriage and US re-entry dispute. Political accusations are not treated as established wrongdoing.',{
  marriages:[r('oona','They married Oona O’Neill, daughter of the playwright Eugene O’Neill, in 1943.',chaplin,{subjects:['Oona O’Neill'],teaText:'They married a famous playwright’s daughter in 1943; it was their fourth marriage.'})],
  controversies:[r('exile','US authorities revoked their re-entry permit in 1952 amid political accusations. They settled in Switzerland.',chaplin)],
  iconicWorks:[r('tramp','Their Tramp character made a bowler hat, cane and tiny moustache globally recognizable.','https://www.biography.com/actors/charlie-chaplin',{medium:'movie',breakthrough:true})],
  careerDrama:[r('return-oscar','They returned to the United States in 1972 to receive an honorary Oscar.',chaplin)]
 },['controversies']),
 'Salvador Dali':review(dali,'Reviewed marriage and expulsion from the Surrealist movement; an art movement is not a music band.',{
  marriages:[r('gala','They married Gala, who had previously been married to poet Paul Éluard.','https://www.daliparis.com/en/salvador-dali-en/gala-dali-en/',{subjects:['Gala'],teaText:'Their wife had previously been married to poet Paul Éluard. The artistic circles overlapped.'})],
  controversies:[r('surrealists','They were expelled from the Surrealist group despite becoming one of its most recognizable artists.',dali)],
  iconicWorks:[r('memory','The Persistence of Memory made melting clocks one of art’s most recognizable images.','https://www.moma.org/collection/works/79018',{medium:'art'})],
  careerDrama:[r('academy','They were expelled from the art academy before their international fame.',dali)]
 },['controversies'])
};

// One incident may answer two intents, but its story ID allows only one Tea purchase.
teaReviews['Marie Curie'].records.scandals=teaReviews['Marie Curie'].records.controversies;
teaReviews['Shakira'].records.scandals=teaReviews['Shakira'].records.controversies;
