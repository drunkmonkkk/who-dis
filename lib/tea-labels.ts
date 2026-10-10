// Presentation only: safe for the browser; never import the private catalog here.
export function teaLabel(topic:string){
 if(['dating','marriage','engagement','public_breakup'].includes(topic))return 'RELATIONSHIP TEA';
 if(topic==='rumor')return 'INTERNET RUMOR';
 if(['band_drama','departure','dismissal','reunion'].includes(topic))return 'BAND FILES';
 if(['feud','fallout','career_comeback'].includes(topic))return 'OLD DRAMA';
 if(['controversy','public_incident','award_show','public_apology'].includes(topic))return 'PUBLIC MESS';
 return 'HOT RECEIPT';
}
