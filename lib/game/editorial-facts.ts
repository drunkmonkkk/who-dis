import type {PersonFact} from './knowledge-types';
type Editorial=Omit<PersonFact,'id'|'tags'|'validTo'>;
const fact=(category:Editorial['category'],topic:string,text:string,source:string,status:Editorial['status']='verified'):Editorial=>({category,topic,fact:text,value:text,status,sourceUrls:[source],sensitivity:category==='controversy'||category==='relationship'?'careful':'normal'});
// Reviewed source-backed additions. Never extrapolate an allegation, motive or current relationship.
export const editorialFacts:Record<string,Editorial[]>={
'Taylor Swift':[fact('iconic_moment','career_drama','They announced the purchase of their earlier master recordings in 2025.','https://www.taylorswift.com/read-my-letter/'),fact('career','works','They re-recorded four earlier albums before buying back their catalog.','https://www.taylorswift.com/read-my-letter/')],
'Nelson Mandela':[fact('iconic_moment','arrest','They spent over 27 years in prison under apartheid before their release in 1990.','https://www.nelsonmandela.org/biography'),fact('award','awards','They shared the 1993 Nobel Peace Prize.','https://www.nelsonmandela.org/biography')],
'Martha Stewart':[fact('controversy','arrest','They were convicted of conspiracy, obstruction and false-statement charges in 2004.','https://www.justice.gov/archive/dag/cftf/2nd_yr_fraud_report.pdf')],
'Albert Einstein':[fact('relationship','career_drama','Their divorce agreement allocated future Nobel Prize money to their former spouse.','https://www.einstein-bern.ch/sites/default/files/spg_einsteinnobelpreis.pdf')],
'Steve Jobs':[fact('career','career_drama','They left the company they co-founded in 1985 after a leadership power struggle.','https://book.stevejobsarchive.com/'),fact('iconic_moment','works','They returned to that company in 1997.','https://book.stevejobsarchive.com/')],
'Marie Curie':[fact('award','awards','They became the first person to receive two Nobel Prizes.','https://www.nobelprize.org/prizes/physics/1903/marie-curie/facts/'),fact('career','positions','They became the first woman professor of general physics at the Sorbonne.','https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/biographical/')],
'Rihanna':[fact('wealth','wealth','Forbes reported billionaire status, attributing much of the wealth to a cosmetics business.','https://www.forbes.com/profile/rihanna/','reported')]
};
