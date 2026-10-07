#!/usr/bin/env python3
"""Rebuild the catalog from public Wikidata statements; cache source documents in work/.
No missing statement is converted to a negative assertion. Relationship dates retain
statement qualifiers. Citation status distinguishes references from uncited claims.
"""
import json,re,time,urllib.request,urllib.parse,concurrent.futures,pathlib,datetime
ROOT=pathlib.Path(__file__).resolve().parents[1]; CACHE=ROOT/'work/catalog'; CACHE.mkdir(parents=True,exist_ok=True)
HEADERS={'User-Agent':'WhoDisEducationalCatalog/1.0 (public factual data curation)'}
def fetch(url,key):
 p=CACHE/(key+'.json')
 if p.exists(): return json.loads(p.read_text())
 for attempt in range(5):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=70) as r: data=json.load(r)
   p.write_text(json.dumps(data)); return data
  except Exception as e:
   if attempt==4: raise
   time.sleep(max(30,int(e.headers.get('Retry-After','30'))) if getattr(e,'code',None)==429 else 1+attempt*2)
def api(host,params,key): return fetch('https://'+host+'/w/api.php?'+urllib.parse.urlencode(params),key)
old=[['Albert Einstein', 'German', '1879', 'scientist', 'Developed the theory of relativity', '1'], ['Marie Curie', 'Polish', '1867', 'scientist', 'Won Nobel Prizes in physics and chemistry', '1'], ['Isaac Newton', 'English', '1643', 'scientist', 'Formulated laws of motion and universal gravitation', '1'], ['Charles Darwin', 'English', '1809', 'scientist', 'Developed the theory of evolution by natural selection', '1'], ['Nikola Tesla', 'Serbian', '1856', 'inventor', 'Pioneered alternating-current electrical systems', '1'], ['Stephen Hawking', 'English', '1942', 'scientist', 'Explored black holes and wrote A Brief History of Time', '1'], ['Ada Lovelace', 'English', '1815', 'mathematician', 'Wrote an early algorithm for a proposed mechanical computer', '1'], ['Alan Turing', 'English', '1912', 'mathematician', 'Helped break wartime codes and developed foundations of computing', '1'], ['Katherine Johnson', 'American', '1918', 'mathematician', 'Calculated trajectories for NASA space missions', '1'], ['C. V. Raman', 'Indian', '1888', 'scientist', 'Won a Nobel Prize for work on the scattering of light', '1'], ['A. P. J. Abdul Kalam', 'Indian', '1931', 'scientist politician', 'Served as the eleventh president of India', '1'], ['Srinivasa Ramanujan', 'Indian', '1887', 'mathematician', 'Made extraordinary contributions to number theory', '1'], ['Shah Rukh Khan', 'Indian', '1965', 'actor', 'Starred in Dilwale Dulhania Le Jayenge and Pathaan', '0'], ['Amitabh Bachchan', 'Indian', '1942', 'actor', 'Starred in Sholay and hosted Kaun Banega Crorepati', '0'], ['Aamir Khan', 'Indian', '1965', 'actor', 'Starred in Lagaan and Dangal', '0'], ['Salman Khan', 'Indian', '1965', 'actor', 'Starred in Bajrangi Bhaijaan', '0'], ['Deepika Padukone', 'Indian', '1986', 'actor', 'Starred in Piku and Padmaavat', '0'], ['Priyanka Chopra', 'Indian', '1982', 'actor', 'Won Miss World in 2000 and starred in Quantico', '0'], ['Alia Bhatt', 'Indian', '1993', 'actor', 'Starred in Raazi and Gangubai Kathiawadi', '0'], ['Ranbir Kapoor', 'Indian', '1982', 'actor', 'Starred in Barfi and Rockstar', '0'], ['Ranveer Singh', 'Indian', '1985', 'actor', 'Starred in Gully Boy and Bajirao Mastani', '0'], ['Hrithik Roshan', 'Indian', '1974', 'actor', 'Played a superhero in the Krrish films', '0'], ['Rajinikanth', 'Indian', '1950', 'actor', 'Starred in Enthiran and Sivaji', '0'], ['Kamal Haasan', 'Indian', '1954', 'actor', 'Starred in Nayakan and Indian', '0'], ['Sridevi', 'Indian', '1963', 'actor', 'Starred in Mr. India and English Vinglish', '1'], ['Irrfan Khan', 'Indian', '1967', 'actor', 'Starred in The Lunchbox and Life of Pi', '1'], ['Madhuri Dixit', 'Indian', '1967', 'actor', 'Starred in Hum Aapke Hain Koun', '0'], ['Kareena Kapoor', 'Indian', '1980', 'actor', 'Played Geet in Jab We Met', '0'], ['Leonardo DiCaprio', 'American', '1974', 'actor', 'Starred in Titanic and The Revenant', '0'], ['Tom Hanks', 'American', '1956', 'actor', 'Starred in Forrest Gump and Cast Away', '0'], ['Meryl Streep', 'American', '1949', 'actor', 'Starred in The Devil Wears Prada', '0'], ['Tom Cruise', 'American', '1962', 'actor', 'Starred in Top Gun and Mission: Impossible', '0'], ['Dwayne Johnson', 'American', '1972', 'actor wrestler', 'Was a professional wrestler before a film career', '0'], ['Robert Downey Jr.', 'American', '1965', 'actor', 'Played Iron Man in Marvel films', '0'], ['Scarlett Johansson', 'American', '1984', 'actor', 'Played Black Widow in Marvel films', '0'], ['Emma Watson', 'English', '1990', 'actor', 'Played Hermione Granger in the Harry Potter films', '0'], ['Daniel Radcliffe', 'English', '1989', 'actor', 'Played the title character in the Harry Potter films', '0'], ['Charlie Chaplin', 'English', '1889', 'actor director', 'Created the silent-film character the Tramp', '1'], ['Marilyn Monroe', 'American', '1926', 'actor', 'Starred in Some Like It Hot', '1'], ['Audrey Hepburn', 'British', '1929', 'actor', "Starred in Breakfast at Tiffany's", '1'], ['Jackie Chan', 'Chinese', '1954', 'actor', 'Known for martial-arts comedy and performing stunts', '0'], ['Bruce Lee', 'American', '1940', 'actor martial artist', 'Starred in Enter the Dragon', '1'], ['Sachin Tendulkar', 'Indian', '1973', 'cricketer', 'Scored one hundred international cricket centuries', '0'], ['Virat Kohli', 'Indian', '1988', 'cricketer', 'Captained the Indian national cricket team', '0'], ['MS Dhoni', 'Indian', '1981', 'cricketer', 'Captained India to the 2011 Cricket World Cup title', '0'], ['Rohit Sharma', 'Indian', '1987', 'cricketer', "Scored 264 in a men's one-day international", '0'], ['Kapil Dev', 'Indian', '1959', 'cricketer', 'Captained India to the 1983 Cricket World Cup title', '0'], ['Rahul Dravid', 'Indian', '1973', 'cricketer', 'Was nicknamed The Wall', '0'], ['Mithali Raj', 'Indian', '1982', 'cricketer', "Captained India's women's cricket team", '0'], ['Shane Warne', 'Australian', '1969', 'cricketer', 'Was famous for leg-spin bowling', '1'], ['Don Bradman', 'Australian', '1908', 'cricketer', 'Finished his Test career with a batting average of 99.94', '1'], ['Lionel Messi', 'Argentinian', '1987', 'footballer', 'Captained Argentina to the 2022 World Cup title', '0'], ['Cristiano Ronaldo', 'Portuguese', '1985', 'footballer', 'Won the European championship with Portugal in 2016', '0'], ['Pele', 'Brazilian', '1940', 'footballer', 'Won three FIFA World Cups', '1'], ['Diego Maradona', 'Argentinian', '1960', 'footballer', 'Led Argentina to the 1986 World Cup title', '1'], ['Neymar', 'Brazilian', '1992', 'footballer', 'Played for Barcelona and Paris Saint-Germain', '0'], ['David Beckham', 'English', '1975', 'footballer', 'Known for free kicks and playing for Manchester United', '0'], ['Zinedine Zidane', 'French', '1972', 'footballer', 'Scored twice in the 1998 World Cup final', '0'], ['Serena Williams', 'American', '1981', 'tennis player', 'Won 23 Grand Slam singles titles', '0'], ['Roger Federer', 'Swiss', '1981', 'tennis player', 'Won 20 Grand Slam singles titles', '0'], ['Rafael Nadal', 'Spanish', '1986', 'tennis player', 'Won 14 French Open singles titles', '0'], ['Usain Bolt', 'Jamaican', '1986', 'athlete', 'Set world records in the 100 and 200 metres', '0'], ['Michael Jordan', 'American', '1963', 'basketball player', 'Won six NBA championships with Chicago', '0'], ['LeBron James', 'American', '1984', 'basketball player', 'Won NBA titles with three different franchises', '0'], ['Muhammad Ali', 'American', '1942', 'boxer', 'Was a three-time world heavyweight boxing champion', '1'], ['Mary Kom', 'Indian', '1982', 'boxer', 'Won six world amateur boxing championships', '0'], ['PV Sindhu', 'Indian', '1995', 'badminton player', 'Won Olympic badminton medals in 2016 and 2020', '0'], ['Neeraj Chopra', 'Indian', '1997', 'athlete', 'Won Olympic gold in the javelin at Tokyo', '0'], ['Taylor Swift', 'American', '1989', 'singer', 'Released the albums Fearless and Folklore', '0'], ['Beyonce', 'American', '1981', 'singer', "Began her recording career with Destiny's Child", '0'], ['Michael Jackson', 'American', '1958', 'singer', 'Released Thriller and popularized the moonwalk', '1'], ['Freddie Mercury', 'British', '1946', 'singer', 'Was the lead vocalist of Queen', '1'], ['Elvis Presley', 'American', '1935', 'singer', 'Known for Jailhouse Rock and his Graceland home', '1'], ['John Lennon', 'English', '1940', 'singer', 'Was a member of the Beatles', '1'], ['Bob Marley', 'Jamaican', '1945', 'singer', 'Brought reggae to an international audience', '1'], ['Adele', 'English', '1988', 'singer', 'Released Rolling in the Deep and Hello', '0'], ['Ed Sheeran', 'English', '1991', 'singer', 'Released Shape of You and Perfect', '0'], ['Rihanna', 'Barbadian', '1988', 'singer entrepreneur', 'Founded Fenty Beauty and released Umbrella', '0'], ['Lady Gaga', 'American', '1986', 'singer actor', 'Starred in A Star Is Born and released Bad Romance', '0'], ['A. R. Rahman', 'Indian', '1967', 'composer singer', 'Won two Oscars for Slumdog Millionaire', '0'], ['Lata Mangeshkar', 'Indian', '1929', 'singer', 'Recorded playback songs across many Indian languages', '1'], ['Kishore Kumar', 'Indian', '1929', 'singer actor', 'Sang Roop Tera Mastana', '1'], ['Arijit Singh', 'Indian', '1987', 'singer', 'Sang Tum Hi Ho', '0'], ['Shreya Ghoshal', 'Indian', '1984', 'singer', 'Made her Hindi film playback debut in Devdas', '0'], ['Ludwig van Beethoven', 'German', '1770', 'composer', 'Composed nine symphonies', '1'], ['Wolfgang Amadeus Mozart', 'Austrian', '1756', 'composer', 'Composed The Magic Flute', '1'], ['Steve Jobs', 'American', '1955', 'entrepreneur', 'Co-founded Apple', '1'], ['Bill Gates', 'American', '1955', 'entrepreneur', 'Co-founded Microsoft', '0'], ['Elon Musk', 'South African', '1971', 'entrepreneur', 'Founded SpaceX', '0'], ['Oprah Winfrey', 'American', '1954', 'television host entrepreneur', 'Hosted a long-running daytime talk show', '0'], ['Ratan Tata', 'Indian', '1937', 'entrepreneur', 'Led the Tata Group and supported philanthropy', '1'], ['Mukesh Ambani', 'Indian', '1957', 'entrepreneur', 'Led Reliance Industries', '0'], ['Walt Disney', 'American', '1901', 'entrepreneur animator', 'Co-founded a famous animation studio and theme parks', '1'], ['Mahatma Gandhi', 'Indian', '1869', 'political leader', 'Led nonviolent campaigns for Indian independence', '1'], ['Nelson Mandela', 'South African', '1918', 'politician', "Became South Africa's first Black president", '1'], ['Martin Luther King Jr.', 'American', '1929', 'activist', 'Delivered the I Have a Dream speech', '1'], ['Barack Obama', 'American', '1961', 'politician', 'Served as the 44th president of the United States', '0'], ['Abraham Lincoln', 'American', '1809', 'politician', 'Served as US president during the Civil War', '1'], ['Indira Gandhi', 'Indian', '1917', 'politician', "Was India's first woman prime minister", '1'], ['Jawaharlal Nehru', 'Indian', '1889', 'politician', "Was independent India's first prime minister", '1'], ['B. R. Ambedkar', 'Indian', '1891', 'politician jurist', "Chaired the drafting committee of India's Constitution", '1'], ['Queen Elizabeth II', 'British', '1926', 'monarch', 'Reigned for seventy years', '1'], ['Cleopatra', 'Egyptian', '-69', 'monarch', "Was a ruler of Egypt's Ptolemaic kingdom", '1'], ['Napoleon Bonaparte', 'French', '1769', 'military leader emperor', 'Became Emperor of the French', '1'], ['Leonardo da Vinci', 'Italian', '1452', 'artist inventor', 'Painted the Mona Lisa', '1'], ['Pablo Picasso', 'Spanish', '1881', 'artist', 'Painted Guernica and co-developed Cubism', '1'], ['Vincent van Gogh', 'Dutch', '1853', 'artist', 'Painted The Starry Night', '1'], ['Frida Kahlo', 'Mexican', '1907', 'artist', 'Known for self-portraits exploring identity', '1'], ['Salvador Dali', 'Spanish', '1904', 'artist', 'Painted melting clocks in The Persistence of Memory', '1'], ['William Shakespeare', 'English', '1564', 'writer', 'Wrote Hamlet and Macbeth', '1'], ['Jane Austen', 'English', '1775', 'writer', 'Wrote Pride and Prejudice', '1'], ['Rabindranath Tagore', 'Indian', '1861', 'writer', 'Won the Nobel Prize in Literature in 1913', '1'], ['Agatha Christie', 'English', '1890', 'writer', 'Created the detective Hercule Poirot', '1'], ['George Orwell', 'English', '1903', 'writer', 'Wrote Animal Farm and Nineteen Eighty-Four', '1'], ['J. K. Rowling', 'British', '1965', 'writer', 'Created the Harry Potter books', '0'], ['Malala Yousafzai', 'Pakistani', '1997', 'activist', 'Became the youngest Nobel Peace Prize laureate', '0'], ['Greta Thunberg', 'Swedish', 'activist', 'Started a school strike for the climate', '0']]
new={
'East Asia':['Hayao Miyazaki','Akira Kurosawa','Yoko Ono','Hokusai','Haruki Murakami','Yayoi Kusama','Naomi Osaka','Shohei Ohtani','Ichiro Suzuki','Yuzuru Hanyu','Hidetoshi Nakata','Ryuichi Sakamoto','Hikaru Utada','Yukio Mishima','Kenzaburo Oe','Yasunari Kawabata','Bong Joon-ho','Park Chan-wook','Song Kang-ho','Son Heung-min','Kim Yuna','IU (singer)','Psy','Jungkook','RM (musician)','Jin (singer)','Lisa (rapper)','Jennie (singer)','Michelle Yeoh','Ang Lee','Wong Kar-wai','Zhang Yimou','Gong Li','Zhang Ziyi','Jet Li','Donnie Yen','Yao Ming','Li Na','Liu Xiang (hurdler)','Ai Weiwei','Jack Ma','Tu Youyou','Mo Yan','Jackie Chan'],
'Middle East':['Omar Sharif','Umm Kulthum','Fairuz','Khalil Gibran','Naguib Mahfouz','Zaha Hadid','Shirin Ebadi','Marjane Satrapi','Asghar Farhadi','Abbas Kiarostami','Mohamed Salah','Rami Malek','Gal Gadot','Natalie Portman','Huda Kattan','Nancy Ajram','Elissa (singer)','Amr Diab','Nadine Labaki','Ahmed Zewail'],
'Africa':['Chinua Achebe','Wole Soyinka','Chimamanda Ngozi Adichie','Lupita Nyong\'o','Charlize Theron','Miriam Makeba','Fela Kuti','Burna Boy','Wizkid','Angelique Kidjo','Youssou N\'Dour','Sadio Mane','Didier Drogba','Samuel Eto\'o','George Weah','Eliud Kipchoge','Haile Gebrselassie','Caster Semenya','Wangari Maathai','Desmond Tutu','Kofi Annan','Ellen Johnson Sirleaf','Graça Machel','Trevor Noah','Mouna Hachim'],
'Latin America':['Shakira','Bad Bunny','Ricky Martin','Gloria Estefan','Celia Cruz','Mercedes Sosa','Caetano Veloso','Gilberto Gil','Anitta (singer)','Karol G','J Balvin','Luis Fonsi','Selena','Salma Hayek','Sofia Vergara','Penelope Cruz','Javier Bardem','Guillermo del Toro','Alfonso Cuaron','Alejandro Gonzalez Inarritu','Gabriel Garcia Marquez','Isabel Allende','Jorge Luis Borges','Pablo Neruda','Mario Vargas Llosa','Diego Rivera','Fernando Botero','Marta (footballer)','Ronaldinho','Ronaldo (Brazilian footballer)','Kaká','Luis Suárez (footballer, born 1987)','James Rodriguez','Juan Martin del Potro','Gabriela Sabatini','Cesar Cielo','Rebeca Andrade','Simone Biles'],
'Oceania':['Hugh Jackman','Nicole Kidman','Cate Blanchett','Margot Robbie','Heath Ledger','Chris Hemsworth','Russell Crowe','Taika Waititi','Lorde','Kylie Minogue','Sia','Keith Urban','Cathy Freeman','Ian Thorpe','Ashleigh Barty','Dylan Alcott','Jacinda Ardern','Peter Jackson','Steve Irwin','Bindi Irwin','Tim Cahill','Daniel Ricciardo','Pat Cummins','Meg Lanning'],
'South Asia':['Satyajit Ray','Amartya Sen','Mother Teresa','Viswanathan Anand','Sania Mirza','Saina Nehwal','Sunil Chhetri','Smriti Mandhana','Jasprit Bumrah','Rashid Khan','Kumar Sangakkara','Muttiah Muralitharan','Wasim Akram','Imran Khan','Nusrat Fateh Ali Khan','Atif Aslam','Fawad Khan','Mahira Khan','Shakib Al Hasan','Muhammad Yunus','M. S. Subbulakshmi','Zakir Hussain (musician)','Ravi Shankar','Anoushka Shankar']}
fix={'Beyonce':'Beyoncé','Pele':'Pelé','PV Sindhu':'P. V. Sindhu','Queen Elizabeth II':'Elizabeth II','Salvador Dali':'Salvador Dalí','C. V. Raman':'C. V. Raman','Greta Thunberg':'Greta Thunberg'}
entries=[{'name':r[0],'title':fix.get(r[0],r[0]),'old':r} for r in old]; seen={e['title'].casefold() for e in entries}
for region,names in new.items():
 for name in names:
  if name.casefold() not in seen: entries.append({'name':name.split(' (')[0],'title':name,'region':region});seen.add(name.casefold())
lookup={}
for i in range(0,len(entries),40):
 batch=entries[i:i+40]; result=api('en.wikipedia.org',{'action':'query','format':'json','prop':'pageprops','redirects':1,'titles':'|'.join(e['title'] for e in batch)},'titles-'+__import__('hashlib').sha256('|'.join(e['title'] for e in batch).encode()).hexdigest()[:16])['query']
 trans={x['from']:x['to'] for x in result.get('normalized',[])+result.get('redirects',[])}
 pages={p['title']:p.get('pageprops',{}).get('wikibase_item') for p in result['pages'].values()}
 for e in batch:
  t=e['title']
  for _ in range(4): t=trans.get(t,t)
  e['qid']=pages.get(t)
  if not e['qid']: print('MISSING',e['title'],flush=True)
print('Resolved',sum(bool(e.get('qid')) for e in entries),'/',len(entries),flush=True)
def entity(e):
 if not e.get('qid'):return None
 data=fetch('https://www.wikidata.org/wiki/Special:EntityData/'+e['qid']+'.json',e['qid'])['entities'][e['qid']]
 assert any(c['mainsnak'].get('datavalue',{}).get('value',{}).get('id')=='Q5' for c in data['claims'].get('P31',[])), 'Person resolution is not a human: '+e['title']
 return e,data
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: pairs=[x for x in pool.map(entity,entries) if x]
print('Downloaded',len(pairs),'entities',flush=True)
props={'P569':'birthDate','P570':'deathDate','P27':'nationalities','P19':'birthplace','P106':'professions','P69':'education','P166':'awards','P800':'works','P26':'spouses','P451':'partners','P40':'children','P1971':'childCount','P22':'parents','P25':'parents','P3373':'siblings','P463':'memberships','P1412':'languages','P551':'residences','P21':'gender','P18':'image','P108':'employers','P54':'teams','P136':'genres','P1303':'instruments','P102':'politicalParties','P39':'positions','P1411':'awardNominations','P103':'nativeLanguages','P135':'movements'}
# Cap high-volume claims before label lookup; source files retain the full record.
limits={'P166':12,'P800':8,'P106':8,'P1411':4}
for entry,record in pairs:
 record['_truncated']={}
 for prop in props:
  valid=[c for c in record['claims'].get(prop,[]) if c.get('rank')!='deprecated' and c['mainsnak'].get('snaktype')=='value']
  valid.sort(key=lambda c:(c.get('rank')=='preferred',bool(c.get('references'))),reverse=True)
  limit=limits.get(prop,6)
  if len(valid)>limit:record['_truncated'][props[prop]]={'available':len(valid),'included':limit}
  record['claims'][prop]=valid[:limit]
ids=set()
def collect(x):
 if isinstance(x,dict):
  if x.get('entity-type')=='item': ids.add(x['id'])
  for v in x.values():collect(v)
 elif isinstance(x,list):
  for v in x:collect(v)
for e,d in pairs:
 for p in props:
  for c in d['claims'].get(p,[]): collect(c['mainsnak'])
labels={}
for cached in CACHE.glob('labels-*.json'):
 try:
  result=json.loads(cached.read_text())
  labels.update({q:d.get('labels',{}).get('en',{}).get('value',q) for q,d in result['entities'].items()})
 except (ValueError,KeyError):pass
ids=sorted(ids-set(labels))
print('Remaining useful labels',len(ids),flush=True)
def get_labels(i):
 batch=ids[i:i+50]
 key='labels-'+__import__('hashlib').sha256('|'.join(batch).encode()).hexdigest()[:16]
 time.sleep(3)
 return api('www.wikidata.org',{'action':'wbgetentities','format':'json','ids':'|'.join(batch),'props':'labels','languages':'en','languagefallback':1},key)
with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
 for result in pool.map(get_labels,range(0,len(ids),50)):
  labels.update({q:d.get('labels',{}).get('en',{}).get('value',q) for q,d in result['entities'].items()})
print('Resolved labels',len(labels),flush=True)
def value(s):
 v=s.get('datavalue',{}).get('value')
 if isinstance(v,dict):
  if 'id' in v:return labels.get(v['id'],v['id'])
  if 'time' in v:return v['time'].replace('T00:00:00Z','').lstrip('+')
  if 'amount' in v:return int(float(v['amount']))
  if 'text' in v:return v['text']
 return v
output=[]
for e,d in pairs:
 rec={'name':e['name'],'wikidataId':e['qid'],'aliases':list(dict.fromkeys([x['value'] for x in d.get('aliases',{}).get('en',[])]+[d.get('labels',{}).get('en',{}).get('value',e['name'])])),'sourceUrl':'https://www.wikidata.org/wiki/'+e['qid'],'verifiedAt':datetime.datetime.fromtimestamp((CACHE/(e['qid']+'.json')).stat().st_mtime,datetime.timezone.utc).isoformat(),'sourceRevision':d.get('lastrevid'),'description':d.get('descriptions',{}).get('en',{}).get('value',''),'facts':[],'truncatedFields':d.get('_truncated',{})}
 for field in ['nationalities','professions','education','awards','works','spouses','partners','children','parents','siblings','memberships','languages','residences','employers','teams','genres','instruments','politicalParties','positions','awardNominations','nativeLanguages','movements']:rec[field]=[]
 for prop,field in props.items():
  claims=[c for c in d['claims'].get(prop,[]) if c.get('rank')!='deprecated' and c['mainsnak'].get('snaktype')=='value']
  # Preferred ranks apply to scalar identity fields; all spouse statements retain date qualifiers.
  if field in ['birthDate','deathDate','birthplace','childCount','gender'] and any(c.get('rank')=='preferred' for c in claims):claims=[c for c in claims if c.get('rank')=='preferred']
  for c in claims:
   v=value(c['mainsnak'])
   if v is None or (isinstance(v,str) and re.fullmatch('Q[0-9]+',v)):continue
   qualifiers={p:[value(s) for s in snaks] for p,snaks in c.get('qualifiers',{}).items() if p in ['P580','P582','P585','P1545','P459']}
   refs=[]
   for ref in c.get('references',[]):
    for snak in ref.get('snaks',{}).get('P854',[]):
     if value(snak):refs.append(value(snak))
    for snak in ref.get('snaks',{}).get('P248',[]):
     q=snak.get('datavalue',{}).get('value',{}).get('id')
     if q:refs.append('https://www.wikidata.org/wiki/'+q)
   statement=rec['sourceUrl']+'#'+prop
   rec['facts'].append({'field':field,'value':v,'property':prop,'statementId':c.get('id'),'sourceUrls':list(dict.fromkeys([statement]+refs)),'status':'referenced' if c.get('references') else 'reported','qualifiers':qualifiers})
   if field in ['spouses','partners']:
    rel={'name':v}
    if qualifiers.get('P580'):rel['start']=qualifiers['P580'][0]
    if qualifiers.get('P582'):rel['end']=qualifiers['P582'][0]
    rel['sourceUrls']=list(dict.fromkeys([statement]+refs));rec[field].append(rel)
   elif isinstance(rec.get(field),list):
    if v not in rec[field]:rec[field].append(v)
   elif field not in rec:rec[field]=v
 rec['popularityScore']=min(100,round(len(d.get('sitelinks',{}))/2));rec['sitelinkCount']=len(d.get('sitelinks',{}))
 text=' '.join(rec['professions']).lower()
 rec['category']= 'Cricket' if 'cricket' in text else 'Football' if 'association football' in text else 'Music' if any(s in text for s in ['singer','musician','composer','rapper']) else 'Scientists' if any(s in text for s in ['scientist','physicist','mathematician','chemist']) else 'Hollywood' if 'actor' in text else 'Writers' if any(s in text for s in ['writer','poet','novelist']) else 'Artists' if any(s in text for s in ['painter','artist','architect']) else 'Entrepreneurs' if any(s in text for s in ['entrepreneur','business']) else 'Historical Figures' if any(s in text for s in ['politician','monarch']) else 'World Icons'
 rec['region']=e.get('region') or ('South Asia' if e['old'][1] in ['Indian','Pakistani'] else 'Africa' if e['old'][1] in ['South African','Egyptian'] else 'Latin America' if e['old'][1] in ['Argentinian','Brazilian','Mexican'] else 'East Asia' if e['old'][1]=='Chinese' else 'Oceania' if e['old'][1]=='Australian' else 'North America' if e['old'][1] in ['American','Jamaican','Barbadian'] else 'Europe')
 if e.get('old') and e['old'][1]=='Indian' and 'actor' in e['old'][3]:rec['category']='Bollywood'
 output.append(rec)
(ROOT/'lib/game/catalog-data.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print('WROTE',len(output),'profiles;',sum(len(r['facts']) for r in output),'facts',flush=True)

# Public image metadata; URLs are kept server-side and must not be exposed before reveal.
# Commons attribution strings are stored as plain text, never trusted HTML.
import html

def image_metadata(records):
 filenames=list(dict.fromkeys('File:'+r['image'] for r in records if r.get('image')))
 batches=[filenames[i:i+20] for i in range(0,len(filenames),20)]
 def batch_meta(batch):
  import hashlib
  key='commons-'+hashlib.sha256('|'.join(batch).encode()).hexdigest()[:16]
  return api('commons.wikimedia.org',{'action':'query','format':'json','prop':'imageinfo','iiprop':'extmetadata|url','iiurlwidth':360,'titles':'|'.join(batch)},key)
 metadata={}
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for result in pool.map(batch_meta,batches):
   for page in result.get('query',{}).get('pages',{}).values():
    info=next(iter(page.get('imageinfo',[])),None)
    if not info:continue
    ext=info.get('extmetadata',{})
    def plain(k):return html.unescape(re.sub('<[^>]+>','',ext.get(k,{}).get('value',''))).strip()
    license_name=plain('LicenseShortName')
    if not license_name:continue
    metadata[page['title'].replace('_',' ')]=dict(filename=page['title'][5:],url=info.get('url'),thumbnailUrl=info.get('thumburl'),sourceUrl=info.get('descriptionurl'),artist=plain('Artist'),credit=plain('Credit'),license=license_name,licenseUrl=plain('LicenseUrl'),attributionRequired=plain('AttributionRequired'),restrictions=plain('Restrictions'))
 for record in records:
  key=('File:'+record.get('image','')).replace('_',' ')
  if key in metadata:record['imageMetadata']=metadata[key]
 return records
output=image_metadata(output)
(ROOT/'lib/game/catalog-data.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print('Image license metadata:',sum('imageMetadata' in r for r in output),flush=True)
