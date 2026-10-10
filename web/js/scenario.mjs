// Authored deterministic teaching model. Units: seconds and metres.
export const defaults = Object.freeze({version:1,kind:'synthetic-constant-offset',duration:20,dx:8,dy:0,start:5,end:15,delay:0.25,dropEvery:4});
export function validate(input) {
 if (!input || typeof input!=='object' || Array.isArray(input)) throw Error('Expected a scenario object');
 const keys=Object.keys(defaults);
 if(Object.keys(input).length!==keys.length || keys.some(k=>!Object.hasOwn(input,k))) throw Error('Unknown or missing scenario fields');
 if(input.version!==1 || input.kind!==defaults.kind || input.duration!==20) throw Error('Unsupported scenario format');
 for(const k of ['dx','dy','start','end','delay','dropEvery']) if(typeof input[k]!=='number'||!Number.isFinite(input[k])) throw Error('All parameters must be finite numbers');
 if(Math.abs(input.dx)>20||Math.abs(input.dy)>20) throw Error('Offset must be within ±20 metres');
 if(input.start<0||input.end>20||input.start>=input.end) throw Error('Require 0 ≤ start < end ≤ 20');
 if(input.delay<0||input.delay>2) throw Error('Delay must be between 0 and 2 seconds');
 if(!Number.isInteger(input.dropEvery)||input.dropEvery<0||input.dropEvery>10) throw Error('Omit interval must be an integer from 0 to 10');
 return Object.fromEntries(keys.map(k=>[k,input[k]]));
}
export function physical(t){return {x:-30+3*t,y:0};}
export function receiver(t){return {x:0,y:-20+2*t};}
export function active(c,t){return t>=c.start&&t<c.end;}
export function claimed(c,t){const p=physical(t);return {x:p.x+(active(c,t)?c.dx:0),y:p.y+(active(c,t)?c.dy:0)};}
export function messages(config){
 const c=validate(config);
 return Array.from({length:c.duration+1},(_,i)=>({id:`demo-${i+1}`,sent:i,received:c.dropEvery && (i+1)%c.dropEvery===0?null:i+c.delay,physical:physical(i),claimed:claimed(c,i),offsetActive:active(c,i)}));
}
export function frame(config,t){
 const c=validate(config);
 if(!Number.isFinite(t)||t<0||t>c.duration)throw Error('Time out of range');
 const sent=messages(c).filter(m=>m.sent<=t);
 const received=sent.filter(m=>m.received!==null&&m.received<=t);
 const last=received.at(-1)??null;
 const pair=sent.slice(-2);
 let displacement=null;
 if(pair.length===2){const [a,b]=pair;displacement={sameOffset:a.offsetActive===b.offsetActive||(c.dx===0&&c.dy===0),physical:{x:b.physical.x-a.physical.x,y:b.physical.y-a.physical.y},claimed:{x:b.claimed.x-a.claimed.x,y:b.claimed.y-a.claimed.y}};}
 return {time:t,physical:physical(t),claimed:claimed(c,t),receiver:receiver(t),sent,received,last,age:last?t-last.received:null,displacement};
}
