import assets from './portrait-data.json';
type Portrait={stages:string[];artist:string;license:string;licenseUrl:string;sourceUrl:string};
const portraits=assets as Record<string,Portrait>;
export function portraitResponse(id:number,stage:number){if(stage<1)return new Response(null,{status:403,headers:{'Cache-Control':'no-store'}});const p=portraits[String(id)];const data=p?.stages[Math.min(4,stage)-1];if(!data)return new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));return new Response(bytes,{headers:{'Content-Type':'image/webp','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline; filename="mystery.webp"'}})}
export function portraitCredit(id:number){const p=portraits[String(id)];return p?{artist:p.artist,license:p.license,licenseUrl:p.licenseUrl,sourceUrl:p.sourceUrl}:null}
