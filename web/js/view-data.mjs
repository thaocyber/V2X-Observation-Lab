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
