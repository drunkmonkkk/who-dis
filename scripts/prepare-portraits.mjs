// Build-time only. Originals and derivatives never live in public/.
import sharp from 'sharp';import fs from 'node:fs/promises';
const people=JSON.parse(await fs.readFile('lib/game/catalog-data.json','utf8'));
await fs.mkdir('work/portraits',{recursive:true});const output={};
let next=0,failures=0;const strip=s=>String(s||'').replace(/<[^>]+>/g,'').replace(/&[^;]+;/g,' ').slice(0,160);
async function processPerson(p,id){const meta=p.imageMetadata;if(!meta?.thumbnailUrl||!meta?.license||!/CC|Public domain|PD|Creative Commons/i.test(meta.license)||meta.restrictions&&!/personality/i.test(meta.restrictions))return;
const cache=`work/portraits/${id}.webp`;let bytes;try{bytes=await fs.readFile(cache)}catch{const res=await fetch(meta.thumbnailUrl,{headers:{'User-Agent':'WhoDisGame/1.0 (licensed educational portrait processing)'},signal:AbortSignal.timeout(18000)});if(!res.ok)throw Error(String(res.status));const input=Buffer.from(await res.arrayBuffer());bytes=await sharp(input).rotate().resize(240,280,{fit:'cover'}).greyscale().webp({quality:68}).toBuffer();await fs.writeFile(cache,bytes)}
const mask=Buffer.from('<svg width="240" height="280"><rect x="33" y="0" width="174" height="280" fill="#20211d"/><rect x="0" y="180" width="240" height="100" fill="#20211d"/></svg>');
const background=await sharp(bytes).resize(12,14).resize(240,280,{kernel:'nearest'}).composite([{input:mask}]).webp({quality:65}).toBuffer();
const clothesMask=Buffer.from('<svg width="240" height="280"><rect width="240" height="185" fill="#20211d"/><text x="120" y="115" font-size="70" fill="#ddf568" text-anchor="middle">?</text></svg>');
const clothing=await sharp(bytes).composite([{input:clothesMask}]).webp({quality:65}).toBuffer();
const partial=await sharp(bytes).resize(30,35).resize(240,280,{kernel:'nearest'}).composite([{input:Buffer.from('<svg width="240" height="280"><rect x="0" y="70" width="240" height="70" fill="#20211d"/></svg>')}]).webp({quality:65}).toBuffer();
output[id]={stages:[background,clothing,partial,bytes].map(b=>b.toString('base64')),artist:strip(meta.artist)||'Wikimedia Commons contributor',license:strip(meta.license),licenseUrl:meta.licenseUrl||'',sourceUrl:meta.sourceUrl};}
async function worker(){while(next<people.length){const id=next++;try{await processPerson(people[id],id)}catch{failures++}if(next%40===0)console.log(`Processed ${next}/${people.length}; ${Object.keys(output).length} licensed portraits`);await new Promise(r=>setTimeout(r,180))}}
await Promise.all([worker(),worker()]);await fs.writeFile('lib/game/portrait-data.json',JSON.stringify(output));console.log(`Prepared ${Object.keys(output).length} portraits; ${failures} fetch failures. Missing photos use the non-identifying graphic.`);
