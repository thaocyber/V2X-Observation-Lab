// Pure display selection. Receiver geometry never uses unreceived claims or
// remote ground truth unless the explicit teaching overlay is enabled.
export function viewData(id,f,{trails=true,reference=false}={}){
 if(!['truth','reported','observed'].includes(id))throw Error('Unknown perspective');
 const sample=(m,key)=>({x:m[key].x,y:m[key].y});
 const truth=f.sent.map(m=>sample(m,'physical'));
 if(!f.sent.length||f.sent.at(-1).sent<f.time)truth.push({...f.physical});
 const reported=f.sent.map(m=>sample(m,'claimed'));
 if(!f.sent.length||f.sent.at(-1).sent<f.time)reported.push({...f.claimed});
 const received=f.received.map(m=>sample(m,'claimed'));
 const main=id==='truth'?{...f.physical}:id==='reported'?{...f.claimed}:f.last?sample(f.last,'claimed'):null;
 const showReference=id==='reported'||(id==='observed'&&reference);
 const referencePoint=showReference?{...f.physical}:null;
 const trail=trails?(id==='truth'?truth:id==='reported'?reported:received):[];
 const referenceTrail=trails&&showReference?truth:[];
 const observer={...f.receiver};
 return {main,observer,reference:referencePoint,trail,referenceTrail,
  framing:[observer,...(main?[main]:[]),...(referencePoint?[referencePoint]:[]),...trail,...referenceTrail]};
}

// Receiver mode is selected before reading any remote truth/current claim.
export function focusData(f,{receiverOnly=false,trails=false,focus='offset'}={}){
 const received=f.received.map(m=>({...m.claimed}));
 const main=f.last?{...f.last.claimed}:null,observer={...f.receiver};
 const reference=receiverOnly?null:{...f.physical};
 const claim=receiverOnly?null:{...f.claimed};
 const trail=trails?received:[];
 const endpoint=focus==='sampling'?main:claim;
 const measure=reference&&endpoint?{from:reference,to:endpoint,distance:Math.hypot(reference.x-endpoint.x,reference.y-endpoint.y),label:focus==='sampling'?'A ↔ R':'A ↔ A′'}:null;
 return {main,observer,reference,claim,trail,referenceTrail:[],measure,
  age:f.last?f.time-f.last.sent:null,id:f.last?.id??null,
  framing:[observer,...(main?[main]:[]),...(reference?[reference]:[]),...(claim?[claim]:[]),...trail]};
}
