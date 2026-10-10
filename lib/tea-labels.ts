// Presentation only: safe for the browser; never import the private catalog here.
export function teaLabel(topic:string){
 if(['dating','marriage','engagement','public_breakup','divorce','famous_ex'].includes(topic))return 'RELATIONSHIP TEA';
 if(['rumor','rumored_relationship'].includes(topic))return 'RUMOR MILL';
 if(['band_drama','departure','dismissal','reunion'].includes(topic))return 'BAND DRAMA';
 if(['feud','fallout','career_comeback'].includes(topic))return 'OLD DRAMA';
 if(['controversy','scandal','public_incident','award_show','public_apology'].includes(topic))return 'PUBLIC MESS';
 if(topic==='iconic_work')return 'ICONIC ERA';
 if(topic==='collaboration')return 'FAMOUS COLLAB';
 if(topic==='personal_story')return 'OFFSTAGE';
 return 'HOT RECEIPT';
}
