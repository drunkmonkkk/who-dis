// Server-only catalog. Never import this module from a client component.
export type Person = {
    id: number;
    name: string;
    aliases: string[];
    gender: 'male' | 'female';
    nationality: string;
    birthYear: number;
    profession: string;
    knownFor: string;
    dead: boolean;
    category: string;
    hints: string[];
};
const data = `Albert Einstein|German|1879|scientist|Developed the theory of relativity|1
Marie Curie|Polish|1867|scientist|Won Nobel Prizes in physics and chemistry|1
Isaac Newton|English|1643|scientist|Formulated laws of motion and universal gravitation|1
Charles Darwin|English|1809|scientist|Developed the theory of evolution by natural selection|1
Nikola Tesla|Serbian|1856|inventor|Pioneered alternating-current electrical systems|1
Stephen Hawking|English|1942|scientist|Explored black holes and wrote A Brief History of Time|1
Ada Lovelace|English|1815|mathematician|Wrote an early algorithm for a proposed mechanical computer|1
Alan Turing|English|1912|mathematician|Helped break wartime codes and developed foundations of computing|1
Katherine Johnson|American|1918|mathematician|Calculated trajectories for NASA space missions|1
C. V. Raman|Indian|1888|scientist|Won a Nobel Prize for work on the scattering of light|1
A. P. J. Abdul Kalam|Indian|1931|scientist politician|Served as the eleventh president of India|1
Srinivasa Ramanujan|Indian|1887|mathematician|Made extraordinary contributions to number theory|1
Shah Rukh Khan|Indian|1965|actor|Starred in Dilwale Dulhania Le Jayenge and Pathaan|0
Amitabh Bachchan|Indian|1942|actor|Starred in Sholay and hosted Kaun Banega Crorepati|0
Aamir Khan|Indian|1965|actor|Starred in Lagaan and Dangal|0
Salman Khan|Indian|1965|actor|Starred in Bajrangi Bhaijaan|0
Deepika Padukone|Indian|1986|actor|Starred in Piku and Padmaavat|0
Priyanka Chopra|Indian|1982|actor|Won Miss World in 2000 and starred in Quantico|0
Alia Bhatt|Indian|1993|actor|Starred in Raazi and Gangubai Kathiawadi|0
Ranbir Kapoor|Indian|1982|actor|Starred in Barfi and Rockstar|0
Ranveer Singh|Indian|1985|actor|Starred in Gully Boy and Bajirao Mastani|0
Hrithik Roshan|Indian|1974|actor|Played a superhero in the Krrish films|0
Rajinikanth|Indian|1950|actor|Starred in Enthiran and Sivaji|0
Kamal Haasan|Indian|1954|actor|Starred in Nayakan and Indian|0
Sridevi|Indian|1963|actor|Starred in Mr. India and English Vinglish|1
Irrfan Khan|Indian|1967|actor|Starred in The Lunchbox and Life of Pi|1
Madhuri Dixit|Indian|1967|actor|Starred in Hum Aapke Hain Koun|0
Kareena Kapoor|Indian|1980|actor|Played Geet in Jab We Met|0
Leonardo DiCaprio|American|1974|actor|Starred in Titanic and The Revenant|0
Tom Hanks|American|1956|actor|Starred in Forrest Gump and Cast Away|0
Meryl Streep|American|1949|actor|Starred in The Devil Wears Prada|0
Tom Cruise|American|1962|actor|Starred in Top Gun and Mission: Impossible|0
Dwayne Johnson|American|1972|actor wrestler|Was a professional wrestler before a film career|0
Robert Downey Jr.|American|1965|actor|Played Iron Man in Marvel films|0
Scarlett Johansson|American|1984|actor|Played Black Widow in Marvel films|0
Emma Watson|English|1990|actor|Played Hermione Granger in the Harry Potter films|0
Daniel Radcliffe|English|1989|actor|Played the title character in the Harry Potter films|0
Charlie Chaplin|English|1889|actor director|Created the silent-film character the Tramp|1
Marilyn Monroe|American|1926|actor|Starred in Some Like It Hot|1
Audrey Hepburn|British|1929|actor|Starred in Breakfast at Tiffany's|1
Jackie Chan|Chinese|1954|actor|Known for martial-arts comedy and performing stunts|0
Bruce Lee|American|1940|actor martial artist|Starred in Enter the Dragon|1
Sachin Tendulkar|Indian|1973|cricketer|Scored one hundred international cricket centuries|0
Virat Kohli|Indian|1988|cricketer|Captained the Indian national cricket team|0
MS Dhoni|Indian|1981|cricketer|Captained India to the 2011 Cricket World Cup title|0
Rohit Sharma|Indian|1987|cricketer|Scored 264 in a men's one-day international|0
Kapil Dev|Indian|1959|cricketer|Captained India to the 1983 Cricket World Cup title|0
Rahul Dravid|Indian|1973|cricketer|Was nicknamed The Wall|0
Mithali Raj|Indian|1982|cricketer|Captained India's women's cricket team|0
Shane Warne|Australian|1969|cricketer|Was famous for leg-spin bowling|1
Don Bradman|Australian|1908|cricketer|Finished his Test career with a batting average of 99.94|1
Lionel Messi|Argentinian|1987|footballer|Captained Argentina to the 2022 World Cup title|0
Cristiano Ronaldo|Portuguese|1985|footballer|Won the European championship with Portugal in 2016|0
Pele|Brazilian|1940|footballer|Won three FIFA World Cups|1
Diego Maradona|Argentinian|1960|footballer|Led Argentina to the 1986 World Cup title|1
Neymar|Brazilian|1992|footballer|Played for Barcelona and Paris Saint-Germain|0
David Beckham|English|1975|footballer|Known for free kicks and playing for Manchester United|0
Zinedine Zidane|French|1972|footballer|Scored twice in the 1998 World Cup final|0
Serena Williams|American|1981|tennis player|Won 23 Grand Slam singles titles|0
Roger Federer|Swiss|1981|tennis player|Won 20 Grand Slam singles titles|0
Rafael Nadal|Spanish|1986|tennis player|Won 14 French Open singles titles|0
Usain Bolt|Jamaican|1986|athlete|Set world records in the 100 and 200 metres|0
Michael Jordan|American|1963|basketball player|Won six NBA championships with Chicago|0
LeBron James|American|1984|basketball player|Won NBA titles with three different franchises|0
Muhammad Ali|American|1942|boxer|Was a three-time world heavyweight boxing champion|1
Mary Kom|Indian|1982|boxer|Won six world amateur boxing championships|0
PV Sindhu|Indian|1995|badminton player|Won Olympic badminton medals in 2016 and 2020|0
Neeraj Chopra|Indian|1997|athlete|Won Olympic gold in the javelin at Tokyo|0
Taylor Swift|American|1989|singer|Released the albums Fearless and Folklore|0
Beyonce|American|1981|singer|Began her recording career with Destiny's Child|0
Michael Jackson|American|1958|singer|Released Thriller and popularized the moonwalk|1
Freddie Mercury|British|1946|singer|Was the lead vocalist of Queen|1
Elvis Presley|American|1935|singer|Known for Jailhouse Rock and his Graceland home|1
John Lennon|English|1940|singer|Was a member of the Beatles|1
Bob Marley|Jamaican|1945|singer|Brought reggae to an international audience|1
Adele|English|1988|singer|Released Rolling in the Deep and Hello|0
Ed Sheeran|English|1991|singer|Released Shape of You and Perfect|0
Rihanna|Barbadian|1988|singer entrepreneur|Founded Fenty Beauty and released Umbrella|0
Lady Gaga|American|1986|singer actor|Starred in A Star Is Born and released Bad Romance|0
A. R. Rahman|Indian|1967|composer singer|Won two Oscars for Slumdog Millionaire|0
Lata Mangeshkar|Indian|1929|singer|Recorded playback songs across many Indian languages|1
Kishore Kumar|Indian|1929|singer actor|Sang Roop Tera Mastana|1
Arijit Singh|Indian|1987|singer|Sang Tum Hi Ho|0
Shreya Ghoshal|Indian|1984|singer|Made her Hindi film playback debut in Devdas|0
Ludwig van Beethoven|German|1770|composer|Composed nine symphonies|1
Wolfgang Amadeus Mozart|Austrian|1756|composer|Composed The Magic Flute|1
Steve Jobs|American|1955|entrepreneur|Co-founded Apple|1
Bill Gates|American|1955|entrepreneur|Co-founded Microsoft|0
Elon Musk|South African|1971|entrepreneur|Founded SpaceX|0
Oprah Winfrey|American|1954|television host entrepreneur|Hosted a long-running daytime talk show|0
Ratan Tata|Indian|1937|entrepreneur|Led the Tata Group and supported philanthropy|1
Mukesh Ambani|Indian|1957|entrepreneur|Led Reliance Industries|0
Walt Disney|American|1901|entrepreneur animator|Co-founded a famous animation studio and theme parks|1
Mahatma Gandhi|Indian|1869|political leader|Led nonviolent campaigns for Indian independence|1
Nelson Mandela|South African|1918|politician|Became South Africa's first Black president|1
Martin Luther King Jr.|American|1929|activist|Delivered the I Have a Dream speech|1
Barack Obama|American|1961|politician|Served as the 44th president of the United States|0
Abraham Lincoln|American|1809|politician|Served as US president during the Civil War|1
Indira Gandhi|Indian|1917|politician|Was India's first woman prime minister|1
Jawaharlal Nehru|Indian|1889|politician|Was independent India's first prime minister|1
B. R. Ambedkar|Indian|1891|politician jurist|Chaired the drafting committee of India's Constitution|1
Queen Elizabeth II|British|1926|monarch|Reigned for seventy years|1
Cleopatra|Egyptian|-69|monarch|Was a ruler of Egypt's Ptolemaic kingdom|1
Napoleon Bonaparte|French|1769|military leader emperor|Became Emperor of the French|1
Leonardo da Vinci|Italian|1452|artist inventor|Painted the Mona Lisa|1
Pablo Picasso|Spanish|1881|artist|Painted Guernica and co-developed Cubism|1
Vincent van Gogh|Dutch|1853|artist|Painted The Starry Night|1
Frida Kahlo|Mexican|1907|artist|Known for self-portraits exploring identity|1
Salvador Dali|Spanish|1904|artist|Painted melting clocks in The Persistence of Memory|1
William Shakespeare|English|1564|writer|Wrote Hamlet and Macbeth|1
Jane Austen|English|1775|writer|Wrote Pride and Prejudice|1
Rabindranath Tagore|Indian|1861|writer|Won the Nobel Prize in Literature in 1913|1
Agatha Christie|English|1890|writer|Created the detective Hercule Poirot|1
George Orwell|English|1903|writer|Wrote Animal Farm and Nineteen Eighty-Four|1
J. K. Rowling|British|1965|writer|Created the Harry Potter books|0
Malala Yousafzai|Pakistani|1997|activist|Became the youngest Nobel Peace Prize laureate|0
Greta Thunberg|Swedish|activist|Started a school strike for the climate|0`;
// Repair explicit rows with no birth year before construction.
const aliases: Record<string, string[]> = { 'Shah Rukh Khan': ['srk', 'shahrukh khan'], 'MS Dhoni': ['mahendra singh dhoni', 'dhoni'], 'A. P. J. Abdul Kalam': ['abdul kalam', 'apj abdul kalam'], 'A. R. Rahman': ['ar rahman'], 'Beyonce': ['beyoncé'], 'Pele': ['pelé'], 'B. R. Ambedkar': ['br ambedkar', 'babasaheb ambedkar'], 'PV Sindhu': ['p v sindhu'], 'J. K. Rowling': ['jk rowling'] };
const women = new Set(['Marie Curie','Ada Lovelace','Katherine Johnson','Deepika Padukone','Priyanka Chopra','Alia Bhatt','Sridevi','Madhuri Dixit','Kareena Kapoor','Meryl Streep','Scarlett Johansson','Emma Watson','Marilyn Monroe','Audrey Hepburn','Mithali Raj','Serena Williams','Mary Kom','PV Sindhu','Taylor Swift','Beyonce','Adele','Rihanna','Lady Gaga','Lata Mangeshkar','Shreya Ghoshal','Oprah Winfrey','Indira Gandhi','Queen Elizabeth II','Cleopatra','Frida Kahlo','Jane Austen','Agatha Christie','J. K. Rowling','Malala Yousafzai','Greta Thunberg']);
export const people: Person[] = data.replace('Swedish|activist', 'Swedish|2003|activist').split('\n').map((row, id) => { const [name, nationality, year, profession, knownFor, dead] = row.split('|'); const category = /cricketer/.test(profession) ? 'Cricket' : /footballer/.test(profession) ? 'Football' : /singer|composer/.test(profession) ? 'Music' : /scientist|mathematician|inventor/.test(profession) ? 'Scientists' : /actor/.test(profession) ? nationality === 'Indian' ? 'Bollywood' : 'Hollywood' : /entrepreneur/.test(profession) ? 'Entrepreneurs' : /writer/.test(profession) ? 'Writers' : /artist/.test(profession) ? 'Artists' : /politician|monarch|leader|emperor/.test(profession) ? 'Historical Figures' : 'World Icons'; return { id, name, gender: women.has(name) ? 'female' : 'male', aliases: aliases[name] || [], nationality, birthYear: +year, profession, knownFor, dead: dead === '1', category, hints: [`Their work involves ${profession.split(' ')[0]}.`, `Their nationality is ${nationality}.`, `They were born ${+year < 1900 ? 'before 1900' : +year < 1950 ? 'in the first half of the 20th century' : 'after 1949'}.`, knownFor] }; });
