// Teaching view of the existing schedule; no transport or radio simulation.
export function communication(f){
 const events=[];
 for(const m of f.sent){
  events.push({time:m.sent,kind:'sent',id:m.id});
  if(m.received===null)events.push({time:m.sent,kind:'omitted',id:m.id});
  else if(m.received<=f.time)events.push({time:m.received,kind:'received',id:m.id});
 }
 // Stable ordering: sending precedes its outcome at the same instant.
 events.sort((a,b)=>a.time-b.time);
 return {sent:f.sent.length,pending:f.sent.filter(m=>m.received!==null&&m.received>f.time).length,
  omitted:f.sent.filter(m=>m.received===null).length,received:f.received.length,
  latestSent:f.sent.at(-1)??null,held:f.last,events};
}
