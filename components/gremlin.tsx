'use client';
import {useEffect, useState, type CSSProperties} from 'react';

export type GremlinState = 'hidden'|'peek'|'idle'|'thinking'|'interested'|'judging'|'smug'|'shrug'|'laughing'|'shocked'|'celebrating'|'nervous'|'tea'|'clue';
export type GremlinPlacement = 'mystery-card-edge'|'feed-margin'|'question-counter-edge'|'clue-card-edge'|'tea-card-edge'|'bottom-corner'|'header-margin';
export type GremlinCue = {state:GremlinState; placement:GremlinPlacement; key:number; note?:string};

/** Original ink creature: asymmetrical paper ears, bean body and a very indiscreet mouth. */
export function Gremlin({cue, placement}: {cue:GremlinCue|null;placement:GremlinPlacement}) {
  if (!cue || cue.placement !== placement || cue.state === 'hidden') return null;
  return <Cameo key={cue.key} cue={cue}/>;
}
function Cameo({cue}:{cue:GremlinCue}) {
  const [visible,setVisible]=useState(true);
  const duration=cue.state==='tea'||cue.state==='clue'?820:cue.state==='celebrating'?600:480;
  useEffect(()=>{const timer=setTimeout(()=>setVisible(false),duration);return()=>clearTimeout(timer)},[duration]);
  if(!visible)return null;
  const wide=['shocked','celebrating','interested','nervous'].includes(cue.state);
  const judging=['judging','clue','smug'].includes(cue.state);
  return <span aria-hidden="true" data-gremlin={cue.state} className={'gremlin gremlin-'+cue.state} style={{'--cameo-time':duration+'ms'} as CSSProperties}>
    <svg viewBox="0 0 110 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path fill="var(--white)" d="M24 77C14 64 24 41 28 37L12 14 40 29Q48 19 63 27L91 8 83 42Q99 60 81 84L76 94 63 89 42 93 27 89Z"/>
      <path d="m20 22 15 15m47-17-8 17M34 77l-15 8m61-10 16 5"/>
      <ellipse cx="44" cy="47" rx="12" ry={wide?15:10} fill="var(--white)"/>
      <ellipse cx="68" cy="45" rx="11" ry={wide?14:9} fill="var(--white)"/>
      <path d={judging?'m32 34 22 6m6-1 19-9':'m32 28 16-3m16-3 14 4'}/>
      <circle cx={judging?48:44} cy="48" r="3" fill="currentColor"/><circle cx={judging?72:68} cy="46" r="3" fill="currentColor"/>
      {wide?<ellipse cx="57" cy="72" rx="12" ry="17" fill="currentColor"/>:<path d={cue.state==='shrug'?'M40 72q15-8 31 0':'M33 64q20 39 45-3Z'} fill={cue.state==='shrug'?'none':'currentColor'}/>}
      {!wide&&cue.state!=='shrug'&&<path d="m43 67 4 9 7-9" fill="var(--white)" stroke="var(--white)"/>}
      {['tea','clue','thinking'].includes(cue.state)&&<g><path fill="var(--lime)" d="m59 73 37-5 4 23-39 5Z"/><path d="m69 79 18-3m-17 10 14-2"/><path d="m55 85 12-3"/></g>}
    </svg>{cue.note&&<span className="gremlin-note">{cue.note}</span>}
  </span>;
}
