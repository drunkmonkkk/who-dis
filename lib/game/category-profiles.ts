import type {PublicRelationship,SocialHistory,SocialEvent} from './knowledge-types';
import type {TeaField,TeaRecord,TeaReview} from './tea-knowledge';

// Bounded editorial reviews, not exhaustive biographies. Empty arrays mean unreviewed.
// Dates below describe historical events; they do not certify a current relationship.
const asOf='2026-10-10';
const r=(id:string,summary:string,url:string,extra:Partial<TeaRecord>={}):TeaRecord=>({id,storyId:id,summary,status:'verified',sourceUrls:[url],asOf,...extra});
const relationship=(personName:string,type:PublicRelationship['type'],url:string,extra:Partial<PublicRelationship>={}):PublicRelationship=>({personName,type,status:'verified',sourceUrls:[url],asOf,...extra});
function profile(records:TeaReview['records'],relationships:PublicRelationship[],reason:string,disclosures:Record<string,string>={}):{review:TeaReview;social:SocialHistory}{
 const entries=Object.entries(records) as [TeaField,TeaRecord[]][];
 const sourceUrls=[...new Set(entries.flatMap(([,rs])=>rs.flatMap(r=>r.sourceUrls)))];
 // Reviewed milestones also supply safe progressive clues and catalog coverage.
 const events:SocialEvent[]=entries.filter(([f])=>['iconicWorks','surprisingPersonalFacts','publicIncidents'].includes(f)).flatMap(([f,rs])=>rs.map(r=>({id:r.id,topic:f==='iconicWorks'?'career_milestone':f==='surprisingPersonalFacts'?'interview':'public_incident',summary:r.summary,status:r.status,sourceUrls:r.sourceUrls,asOf:r.asOf})));
 return {review:{records,disclosures,coverage:{sourceUrls,asOf,reason,relevantFields:entries.map(([f])=>f)}},social:{groups:[],relationships,events,rumors:[]}};
}
const srk='https://chubbfellowship.yale.edu/fellow/shah-rukh-khan';
const srkMarriage='https://www.indiatoday.in/movies/celebrities/story/shah-rukh-khan-gauri-s-30th-wedding-anniversary-and-their-interfaith-marriage-all-you-need-to-know-1869192-2021-10-25';
const srkFeud='https://indianexpress.com/article/entertainment/bollywood/when-salman-khan-defended-shah-rukh-khan-on-bigg-boss-amid-feud-berated-contestant-who-took-credit-for-srks-success-8953865/';
const deepWedding='https://indianexpress.com/article/entertainment/bollywood/deepika-padukone-ranveer-singh-wedding-story-all-photos-5448616/';
const deepEx='https://indianexpress.com/article/entertainment/bollywood/i-share-a-special-equation-with-ranbir-deepika-padukone-on-former-boyfriend/';
const deepDebut='https://www.vogue.in/content/deepika-padukones-most-memorable-on-screen-moments';
const priyanka='https://www.biography.com/actors/priyanka-chopra';
const nick='https://www.vogue.com/article/priyanka-chopra-nick-jonas-interview';
const aamir='https://indianexpress.com/article/entertainment/bollywood/aamir-khan-kiran-rao-announce-divorce-to-co-parent-son-azad-7387164/';
const lagaan='https://www.oscars.org/oscars/ceremonies/2002/R';
const ranbirWedding='https://indianexpress.com/article/entertainment/bollywood/pandit-rajesh-sharma-officiated-alia-bhatt-ranbir-kapoor-wedding-reveals-details-7870720/';
const ranbirEx='https://indianexpress.com/article/entertainment/bollywood/exclusive-ranbir-kapoor-discusses-tamasha-deepika-padukone-and-marriage/';
const ranbirFilms='https://www.filmfare.com/features/birthday-special-8-ranbir-kapoor-performances-we-cant-get-enough-of-55524.html';
const sachinWedding='https://sports.ndtv.com/cricket/went-to-sachin-tendulkar-s-house-for-the-first-time-disguised-as-a-journalist-reveals-wife-anjali-1510124';
const sachinBook='https://books.google.com/books/about/Playing_It_My_Way.html?id=o4tmBAAAQBAJ';
const worldCup2011='https://www.icc-cricket.com/tournaments/cricketworldcup/news/mens-cricket-world-cup-2011-overview';
const viratWedding='https://indianexpress.com/article/entertainment/anushka-sharma-virat-kohli-wedding-and-its-official-4978467/';
const viratRecord='https://www.icc-cricket.com/tournaments/cricketworldcup/news/virat-kohli-breaks-sachin-tendulkars-landmark-record-for-most-odi-centuries';
const dhoniWedding='https://indianexpress.com/article/news-archive/print/dhoni-weds-sakshi-in-presence-of-teammates/';
const dhoniSix='https://www.icc-cricket.com/news/ms-dhoni-gifted-iconic-world-cup-digital-collectible';
const warneEngaged='https://www.abc.net.au/news/2011-10-03/warne-and-hurley-confirm-engagement/3206208';
const warneBall='https://www.abc.net.au/news/2022-03-05/shane-warne-dies-of-suspected-heart-attack/100884710';
const warneBan='https://www.abc.net.au/news/2003-02-26/warne-takes-it-on-the-chin/1221746';
const imranDivorce='https://www.abc.net.au/news/2004-06-23/pakistans-imran-khan-divorces-jemima/1997520';
const worldCup1992='https://www.icc-cricket.com/tournaments/cricketworldcup/news/mens-cricket-world-cup-1992-overview';
const hospital='https://shaukatkhanum.org.pk/about-us/our-story/';
const beckham='https://www.biography.com/athletes/david-beckham';
const beckhamDenial='https://www.theguardian.com/media/2004/apr/05/pressandpublishing.football';
const messi='https://www.biography.com/athletes/lionel-messi';
const messiRetired='https://www.theguardian.com/football/blog/2016/jun/27/argentina-messi';
const ronaldoWedding='https://apnews.com/article/bbe5bf3e5003e4dd663b7892c0a8f6d5';
const ronaldoEngaged='https://apnews.com/article/6fa540c9bdfed2083ac9ced10c3ddd7e';
const euro='https://www.uefa.com/uefaeuro/history/news/0253-0d81c1ad22fb-e697e083ebc0-1000--pepe-and-ronaldo-double-up-with-euro-triumph/';
const maradona='https://www.biography.com/athletes/diego-maradona';
const maradonaEx='https://www.abc.net.au/news/2004-04-23/maradona-off-the-critical-list/175070';
const neymarEx='https://espndeportes.espn.com/futbol/espana/nota/_/id/3341737/utils';
const neymarGold='https://www.uefa.com/uefachampionsleague/news/0230-0e94bd68d3b7-aa46e5284e07-1000--neymar-and-brazil-strike-olympic-gold-on-penalties/';
const neymarArgument='https://www.espn.com/soccer/story/_/id/37636327/neymar-confirms-clash-psg-sporting-director-questions-dressing-room-leak';
const rowling='https://stories.jkrowling.com/my-story/';
const rowlingDebate='https://abcnews.com/GMA/Culture/daniel-radcliffe-responds-jk-rowlings-tweets-transgender-women/story?id=71144964';
const christie='https://www.agathachristie.com/about-christie';
const orwell='https://www.orwellfoundation.com/the-orwell-foundation/orwell/articles/d-j-taylor-a-brief-life/';
const animalFarm='https://www.orwellfoundation.com/the-orwell-foundation/orwell/books-by-orwell/animal-farm/';
const tagore='https://www.nobelprize.org/prizes/literature/1913/tagore/article/?print=1';
const tagoreBio='https://www.nobelprize.org/prizes/literature/1913/tagore/biographical/?print=1';
const shakespeareWedding='https://www.shakespeare.org.uk/explore-shakespeare/shakespedia/william-shakespeare/shakespeares-wife-and-marriage/';
const bed='https://www.shakespeare.org.uk/explore-shakespeare/shakespedia/william-shakespeare/second-best-bed/';
const globe='https://www.shakespeare.org.uk/explore-shakespeare/shakespedia/shakespeares-globe-theatre/';

export const categoryProfiles:Record<string,{review:TeaReview;social:SocialHistory}>={
 'Shah Rukh Khan':profile({
  marriages:[r('gauri','They married Gauri in 1991, before their movie-star breakthrough.',srkMarriage,{subjects:['Gauri Khan']})],
  feuds:[r('salman','A reported five-year rift with another Bollywood superstar led to a headline-making public hug in 2013.',srkFeud,{status:'widely_reported',subjects:['Salman Khan']})],
  iconicWorks:[r('ddlj','Dilwale Dulhania Le Jayenge became a defining romantic role in their career.',srk,{medium:'movie'})]
 },[relationship('Gauri Khan','married',srkMarriage,{startYear:1991})],'Reviewed public marriage, defining films and reported industry rift. No affair speculation; acting is not music-band membership.'),
 'Deepika Padukone':profile({
  famousRelationships:[r('ranbir','They dated Ranbir Kapoor; they later shared the screen again after their relationship ended.',deepEx,{subjects:['Ranbir Kapoor']})],
  famousExes:[r('ranbir-ex','Ranbir Kapoor is a publicly acknowledged former boyfriend.',deepEx,{storyId:'ranbir',subjects:['Ranbir Kapoor']})],
  marriages:[r('ranveer','They married Ranveer Singh at Lake Como in 2018, with two wedding ceremonies.',deepWedding,{subjects:['Ranveer Singh']})],
  iconicWorks:[r('om-shanti','Om Shanti Om launched their Hindi-film career in 2007.',deepDebut,{medium:'movie',breakthrough:true})],
  surprisingPersonalFacts:[r('video','Before their Bollywood debut, they appeared in Himesh Reshammiya’s Naam Hai Tera music video.','https://www.vogue.in/culture-and-living/content/deepika-padukone-interesting-unknown-facts-bollywood-actor')]
 },[relationship('Ranbir Kapoor','dated',deepEx,{famous:true}),relationship('Ranveer Singh','married',deepWedding,{startYear:2018,famous:true})],'Reviewed acknowledged ex, marriage and pre-film music video; no cheating motives or unconfirmed romance claims.',{'Ranbir Kapoor':'a fellow Bollywood star','Ranveer Singh':'a fellow Bollywood star'}),
 'Priyanka Chopra':profile({
  marriages:[r('nick-wedding','They married Nick Jonas in 2018, bringing a Bollywood career and a pop dynasty together.',priyanka,{subjects:['Nick Jonas']})],
  surprisingPersonalFacts:[r('first-message','Their future pop-star husband first reached out through a co-star, then sent a Twitter message.',nick)],
  iconicWorks:[r('quantico','Quantico gave them a lead role on American network television after their Bollywood career.',priyanka,{medium:'show'})],
  publicIncidents:[r('crossover','Their wedding joined Hindu and Christian traditions in two ceremonies.','https://www.vogue.com/article/priyanka-chopra-nick-jonas-vogue-first-digital-cover',{storyId:'nick-wedding'})]
 },[relationship('Nick Jonas','married',priyanka,{startYear:2018,famous:true})],'Reviewed public marriage and crossover role. Their spouse’s Jonas Brothers membership is not their own band history.',{'Nick Jonas':'a famous pop singer'}),
 'Aamir Khan':profile({
  divorces:[r('kiran','They and Kiran Rao announced their divorce in 2021, while saying they would keep collaborating.',aamir,{subjects:['Kiran Rao']})],
  marriages:[r('kiran-marriage','They married filmmaker Kiran Rao in 2005 after meeting during Lagaan’s production.',aamir,{subjects:['Kiran Rao'],storyId:'kiran'})],
  famousExes:[r('kiran-ex','Filmmaker Kiran Rao is a former spouse; their divorce was announced in 2021.',aamir,{subjects:['Kiran Rao'],storyId:'kiran'})],
  iconicWorks:[r('lagaan','Lagaan’s underdog cricket story earned India an Oscar nomination in 2002.',lagaan,{medium:'movie'})],
  famousCollaborations:[r('paani','After announcing their divorce, they said their work on films and the Paani Foundation would continue.',aamir)]
 },[relationship('Kiran Rao','former_spouse',aamir,{startYear:2005,endYear:2021,endReason:'divorce',famous:true})],'Reviewed joint divorce statement and continuing public work, not speculative reasons for separation. No musical group attributed.'),
 'Ranbir Kapoor':profile({
  famousRelationships:[r('deepika','They dated Deepika Padukone, then reunited on screen in Tamasha after the split.',ranbirEx,{subjects:['Deepika Padukone']})],
  famousExes:[r('deepika-ex','Deepika Padukone is a publicly documented former girlfriend.',ranbirEx,{subjects:['Deepika Padukone'],storyId:'deepika'})],
  marriages:[r('alia','They married Alia Bhatt at their Mumbai home in 2022, rather than a distant destination wedding.',ranbirWedding,{subjects:['Alia Bhatt']})],
  iconicWorks:[r('rockstar','Rockstar’s troubled musician role became one of their defining performances.',ranbirFilms,{medium:'movie'}),r('barfi','In Barfi!, their acclaimed performance told its story without spoken dialogue.',ranbirFilms,{medium:'movie'})]
 },[relationship('Deepika Padukone','dated',ranbirEx,{famous:true}),relationship('Alia Bhatt','married',ranbirWedding,{startYear:2022,famous:true})],'Reviewed ex/co-star reunion and public wedding. A fictional musician role does not establish real band membership.',{'Deepika Padukone':'a fellow Bollywood star','Alia Bhatt':'a fellow Bollywood star'}),
 'Sachin Tendulkar':profile({
  marriages:[r('anjali','They married Anjali in 1995; she later revealed she posed as a journalist during their courtship.',sachinWedding,{subjects:['Anjali Tendulkar']})],
  iconicWorks:[r('hundreds','Their career reached 100 international centuries—an extraordinary batting landmark.',sachinBook,{medium:'project'}),r('cup2011','They were part of India’s 2011 World Cup-winning side, after the team lost them early in the final.',worldCup2011,{medium:'project'})],
  careerDrama:[r('memoir','Their autobiography Playing It My Way took fans behind a 24-year international cricket career.',sachinBook,{medium:'book'})]
 },[relationship('Anjali Tendulkar','married',sachinWedding,{startYear:1995})],'Reviewed spouse’s public courtship account, autobiography and World Cup. Team membership is sporting, not a music group.'),
 'Virat Kohli':profile({
  marriages:[r('anushka','They married Anushka Sharma privately in Italy in 2017, then announced it together online.',viratWedding,{subjects:['Anushka Sharma']})],
  surprisingPersonalFacts:[r('shampoo','They met their future movie-star spouse while filming a shampoo commercial in 2013.',viratWedding)],
  iconicWorks:[r('fifty','Their 50th ODI century broke a legendary batting record during the 2023 World Cup semifinal.',viratRecord,{medium:'project'})],
  careerDrama:[r('praise','Sachin Tendulkar publicly celebrated the day they overtook his ODI century record.','https://www.icc-cricket.com/tournaments/cricketworldcup/news/tendulkar-leads-kohli-praise-as-reactions-pour-in-to-record-breaking-century',{subjects:['Sachin Tendulkar'],storyId:'fifty'})]
 },[relationship('Anushka Sharma','married',viratWedding,{startYear:2017,famous:true})],'Reviewed couple’s wedding announcement, commercial meeting and ICC milestone. No speculative marriage-crisis rumors included.',{'Anushka Sharma':'a Bollywood star'}),
 'MS Dhoni':profile({
  marriages:[r('sakshi','They married Sakshi in 2010 in a private ceremony that kept the media outside the resort.',dhoniWedding,{subjects:['Sakshi Singh Rawat']})],
  iconicWorks:[r('six','They sealed India’s 2011 World Cup victory with a six that became an iconic sporting image.',dhoniSix,{medium:'project'})],
  surprisingPersonalFacts:[r('train','After their World Cup win, the team was offered free first-class rail travel for life.','https://www.icc-cricket.com/news/india-rushes-to-reward-world-cup-heroes')]
 },[relationship('Sakshi Singh Rawat','married',dhoniWedding,{startYear:2010})],'Reviewed wedding and ICC final/rewards. An IPL franchise is not a band; no unsupported private-life rumors.'),
 'Shane Warne':profile({
  engagements:[r('hurley','They confirmed their engagement to actress Elizabeth Hurley in 2011.',warneEngaged,{subjects:['Elizabeth Hurley']})],
  famousRelationships:[r('hurley-dated','They had a public romance with Elizabeth Hurley before confirming their engagement.',warneEngaged,{subjects:['Elizabeth Hurley'],storyId:'hurley'})],
  controversies:[r('ban','They accepted a 12-month cricket ban in 2003 after testing positive for a banned diuretic.',warneBan)],
  iconicWorks:[r('ball','Their first Ashes delivery in 1993 became known as the Ball of the Century.',warneBall,{medium:'project',breakthrough:true})]
 },[relationship('Elizabeth Hurley','engaged',warneEngaged,{startYear:2011,famous:true})],'Reviewed confirmed engagement and anti-doping sanction. The ban does not prove steroid use; no unsourced affair allegations.'),
 'Imran Khan':profile({
  divorces:[r('jemima','Their nine-year marriage to Jemima Goldsmith ended in divorce in 2004.',imranDivorce,{subjects:['Jemima Goldsmith']})],
  marriages:[r('jemima-marriage','They married Jemima Goldsmith in 1995.',imranDivorce,{subjects:['Jemima Goldsmith'],storyId:'jemima'})],
  famousExes:[r('jemima-ex','Jemima Goldsmith is a former spouse.',imranDivorce,{subjects:['Jemima Goldsmith'],storyId:'jemima'})],
  iconicWorks:[r('cup1992','They captained Pakistan’s comeback campaign to its first Cricket World Cup title in 1992.',worldCup1992,{medium:'project'})],
  surprisingPersonalFacts:[r('hospital','Their mother’s cancer inspired them to establish a cancer hospital supported by public donations.',hospital)]
 },[relationship('Jemima Goldsmith','former_spouse',imranDivorce,{startYear:1995,endYear:2004,endReason:'divorce',famous:true})],'Bounded cricket-era and public-family review. No claim about the merits or current outcomes of later political prosecutions.'),
 'David Beckham':profile({
  marriages:[r('victoria','They married Victoria, a Spice Girls star, in 1999. Sport and pop became a celebrity power couple.',beckham,{subjects:['Victoria Beckham'],teaText:'They married a pop superstar in 1999. Sport and music became a celebrity power couple.'})],
  rumoredRelationships:[r('denial','They publicly denied a former assistant’s affair allegation in 2004.',beckhamDenial,{status:'publicly_denied'})],
  iconicWorks:[r('treble','They helped Manchester United win the Premier League, FA Cup and Champions League in 1999.',beckham,{medium:'project'})],
  careerDrama:[r('red-card','A red card at the 1998 World Cup brought fierce public backlash before their later comeback.','https://www.manutd.com/en/news/should-dwight-yorke-have-been-in-the-frame-for-1999-ballon-dor')]
 },[relationship('Victoria Beckham','married',beckham,{startYear:1999,famous:true})],'Reviewed marriage and football comeback. Affair allegation remains PUBLICLY DENIED. Their spouse’s band is not their band.'),
 'Lionel Messi':profile({
  marriages:[r('antonela','They married longtime partner Antonela Roccuzzo in Rosario in 2017, with celebrity guests at the ceremony.',messi,{subjects:['Antonela Roccuzzo'],teaText:'Their 2017 hometown wedding brought football stars and a famous pop singer onto the guest list.'})],
  iconicWorks:[r('cup2022','They led Argentina to the 2022 World Cup title after years of international heartbreak.',messi,{medium:'project'})],
  publicIncidents:[r('retirement','After losing the 2016 Copa América final, they announced they were leaving international football.',messiRetired)],
  famousCollaborations:[r('miami','Their 2023 move joined a Miami club partly owned by David Beckham.',messi,{subjects:['David Beckham']})]
 },[relationship('Antonela Roccuzzo','married',messi,{startYear:2017})],'Reviewed wedding, dated retirement announcement and World Cup comeback. Sports clubs are not bands.'),
 'Cristiano Ronaldo':profile({
  marriages:[r('georgina-wedding','They married longtime partner Georgina Rodríguez in a private civil ceremony in Portugal in August 2026.',ronaldoWedding,{subjects:['Georgina Rodríguez'],teaText:'They married their longtime partner in a private civil ceremony in Portugal in August 2026.'})],
  engagements:[r('georgina-engagement','Georgina Rodríguez publicly announced their engagement in August 2025.',ronaldoEngaged,{subjects:['Georgina Rodríguez'],storyId:'georgina-wedding'})],
  surprisingPersonalFacts:[r('gucci','They met their future spouse in 2016 while she worked at a Gucci store in Madrid.',ronaldoEngaged)],
  iconicWorks:[r('euro','In 2016 they won the Champions League with Real Madrid and the European Championship with Portugal.',euro,{medium:'project'})],
  careerDrama:[r('injury','Injury forced them out of the Euro 2016 final early, but they still celebrated Portugal’s first major title.',euro)]
 },[relationship('Georgina Rodríguez','married',ronaldoWedding,{startYear:2026,famous:true})],'Reviewed AP wedding announcement updates the historical 2025 engagement. No current private-life speculation; sports teams are not bands.',{'Georgina Rodríguez':'their longtime partner'}),
 'Diego Maradona':profile({
  marriages:[r('claudia','Claudia Villafañe is a documented former spouse; reports identified her as their ex-wife by 2004.',maradonaEx,{subjects:['Claudia Villafañe'],status:'widely_reported'})],
  iconicWorks:[r('god','Their 1986 World Cup run included both the Hand of God goal and an extraordinary solo goal against England.',maradona,{medium:'project'})],
  controversies:[r('ban','A failed drug test ended their participation in the 1994 World Cup.','https://www.abc.net.au/news/2004-04-19/maradona-the-wayward-genius/173040')]
 },[relationship('Claudia Villafañe','former_spouse',maradonaEx,{status:'widely_reported'})],'Reviewed former spouse and dated sporting incidents; inconsistent retrospective marriage dates are omitted. Sports clubs are not music bands.'),
 'Neymar':profile({
  famousRelationships:[r('bruna','They publicly announced a breakup with actress Bruna Marquezine in 2017.',neymarEx,{subjects:['Bruna Marquezine']})],
  publicBreakups:[r('bruna-breakup','Their renewed romance with Bruna Marquezine ended publicly in 2017.',neymarEx,{subjects:['Bruna Marquezine'],storyId:'bruna'})],
  famousExes:[r('bruna-ex','Actress Bruna Marquezine is a publicly documented famous ex.',neymarEx,{subjects:['Bruna Marquezine'],storyId:'bruna'})],
  iconicWorks:[r('gold','Their decisive penalty secured Brazil’s first men’s Olympic football gold in 2016.',neymarGold,{medium:'project'})],
  publicIncidents:[r('psg','They acknowledged a dressing-room argument with PSG sporting director Luis Campos in 2023.',neymarArgument,{subjects:['Luis Campos']})]
 },[relationship('Bruna Marquezine','dated',neymarEx,{endYear:2017,endReason:'breakup',famous:true})],'Reviewed the dated breakup announcement, Olympic final and acknowledged dressing-room argument. No unconfirmed allegations included.'),
 'J. K. Rowling':profile({
  marriages:[r('first-marriage','Their first marriage ended; they moved to Edinburgh with their daughter and three chapters of a future bestseller.',rowling),r('neil','They married Neil Murray after their first marriage ended.','https://stories.jkrowling.com/faqs/',{subjects:['Neil Murray']})],
  iconicWorks:[r('potter','Harry Potter and the Philosopher’s Stone launched a worldwide publishing phenomenon in 1997.',rowling,{medium:'book',breakthrough:true})],
  careerDrama:[r('galbraith','Their attempt to publish crime fiction anonymously ended when the Robert Galbraith pen name was exposed.',rowling)],
  controversies:[r('gender','Their 2020 comments on sex and gender prompted public criticism from Daniel Radcliffe.',rowlingDebate,{subjects:['Daniel Radcliffe']})]
 },[relationship('Neil Murray','married','https://stories.jkrowling.com/faqs/')],'Reviewed first-person marriage/career account and documented public disagreement. No invented affair or claim that every disputed opinion is fact.',{'Daniel Radcliffe':'a star of their film adaptations'}),
 'Agatha Christie':profile({
  divorces:[r('archie','Their first marriage ended in divorce in 1928; they later married archaeologist Max Mallowan.',christie,{subjects:['Archibald Christie']})],
  marriages:[r('max','They met their second husband Max Mallowan on an archaeological dig; travel with him fed their fiction.',christie,{subjects:['Max Mallowan']})],
  iconicWorks:[r('orient','Murder on the Orient Express turned a train journey into an enduring locked-room mystery.',christie,{medium:'book'})],
  publicIncidents:[r('disappearance','They disappeared for eleven days in 1926, sparking a huge search. The reason remains uncertain.',christie)]
 },[relationship('Archibald Christie','former_spouse',christie,{endYear:1928,endReason:'divorce'}),relationship('Max Mallowan','married',christie,{startYear:1930})],'Reviewed estate biography. The disappearance is documented; explanations for it are not promoted from speculation to fact.'),
 'George Orwell':profile({
  marriages:[r('eileen','They married Eileen O’Shaughnessy while building a writing career; she died before their major satire was published.',orwell,{subjects:['Eileen O’Shaughnessy']})],
  iconicWorks:[r('1984','Nineteen Eighty-Four made Big Brother and thoughtcrime enduring images of state control.',orwell,{medium:'book'}),r('farm','Animal Farm turned a farmyard rebellion into a political satire.',animalFarm,{medium:'book'})],
  careerDrama:[r('rejected','Several publishers rejected their animal fable before it became a celebrated book.',animalFarm)],
  surprisingPersonalFacts:[r('bbc','They worked on wartime BBC broadcasts, but came to dislike the job.',orwell)]
 },[relationship('Eileen O’Shaughnessy','married',orwell,{startYear:1936,endYear:1945,endReason:'bereavement'})],'Reviewed foundation biography and publishing history. Bereavement is not divorce; no speculative affairs included.'),
 'Rabindranath Tagore':profile({
  marriages:[r('mrinalini','In a letter to their wife Mrinalini, they wished the two could be companions in all their work and thoughts.',tagore,{subjects:['Mrinalini Devi']})],
  iconicWorks:[r('gitanjali','Gitanjali’s English poems helped bring their writing to a worldwide audience.',tagoreBio,{medium:'book'})],
  publicIncidents:[r('knighthood','They renounced their British knighthood after the 1919 Amritsar massacre.',tagore)],
  famousCollaborations:[r('yeats','W. B. Yeats wrote the introduction to the English edition of Gitanjali.',tagore,{subjects:['W. B. Yeats']})]
 },[relationship('Mrinalini Devi','married',tagore)],'Reviewed Nobel biography and historical essay. Public protest is not a scandal; uncertain private relationships are not inferred.'),
 'William Shakespeare':profile({
  marriages:[r('anne','They married Anne Hathaway in 1582, remaining married until their death.',shakespeareWedding,{subjects:['Anne Hathaway'],teaText:'They married in 1582; centuries later, the curious bed bequest to their spouse still gets debated.'})],
  surprisingPersonalFacts:[r('bed','Their will left their wife the second-best bed. The bequest is real; whether it was an insult is uncertain.',bed)],
  iconicWorks:[r('hamlet','Hamlet was among the plays performed at the Globe, alongside Macbeth and King Lear.',globe,{medium:'project'})],
  careerDrama:[r('globe','Their acting company built the Globe Theatre, making them a performer, playwright and theatre shareholder.',globe)]
 },[relationship('Anne Hathaway','married',shakespeareWedding,{startYear:1582})],'Reviewed trust’s archival marriage, will and theatre history. Their acting company is not a musical band; will motives remain uncertain.',{'Anne Hathaway':'their spouse'})
};
