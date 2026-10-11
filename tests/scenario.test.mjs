import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,validate,messages,frame,claimed} from '../web/js/scenario.mjs';
test('offset is constant inside the interval, absent outside, and end is exclusive',()=>{
 const c={...defaults,dx:7,dy:-4};
 for(const t of [0,4.99,5,9,14.99,15,20]){const f=frame(c,t),on=t>=5&&t<15;assert.equal(f.claimed.x-f.physical.x,on?7:0);assert.equal(f.claimed.y-f.physical.y,on?-4:0);}
});
test('constant offset cancels within a segment, but onset and termination jump',()=>{
 assert.deepEqual(frame(defaults,8).displacement.physical,frame(defaults,8).displacement.claimed);
 for(const t of [5,15]){const d=frame(defaults,t).displacement;assert.equal(d.sameOffset,false);assert.notDeepEqual(d.physical,d.claimed);}
});
test('receiver cannot observe future or intentionally omitted messages',()=>{
 for(let t=0;t<=20;t+=0.25){const f=frame(defaults,t);assert.ok(f.received.every(m=>m.sent<=t&&m.received<=t));assert.ok(f.received.every(m=>Number(m.id.split('-')[1])%4!==0));}
 assert.equal(frame(defaults,0).last,null);
 assert.equal(frame(defaults,0.25).last.id,'demo-1');
 assert.equal(frame(defaults,3.5).last.id,'demo-3');
});
test('rewind and JSON round trip reproduce exactly, with zero offset supported',()=>{
 const c=validate(JSON.parse(JSON.stringify(defaults))),before=frame(c,6);frame(c,19);assert.deepEqual(frame(c,6),before);
 assert.deepEqual(messages(c),messages(defaults));
 const z={...c,dx:0,dy:0};assert.deepEqual(frame(z,6).claimed,frame(z,6).physical);assert.equal(frame(z,5).displacement.sameOffset,true);
});
test('untrusted configuration rejects extra fields, malformed types and unbounded work',()=>{
 for(const c of [null,[],{}, {...defaults,extra:1},{...defaults,dx:'8'},{...defaults,dy:Infinity},{...defaults,start:15,end:5},{...defaults,duration:100000},{...defaults,dropEvery:2.5},{...defaults,delay:-1}])assert.throws(()=>validate(c));
 assert.throws(()=>frame(defaults,-1));assert.throws(()=>frame(defaults,NaN));
});

import {presets} from '../web/js/presets.mjs';
test('guided presets reproduce the stated receiver observation gaps and boundary effects',()=>{
 for(const c of Object.values(presets))assert.deepEqual(validate(c),c);
 const baseline=frame(presets.baseline,6.5);
 assert.equal(baseline.last.sent,6);
 assert.notDeepEqual(baseline.physical,baseline.last.claimed);
 assert.equal(frame(presets.offset,5).displacement.claimed.x,11);
 assert.equal(frame(presets.offset,10).displacement.claimed.x,3);
 assert.equal(frame(presets.offset,15).displacement.claimed.x,-5);
 const impaired=presets.impaired;
 assert.equal(messages(impaired).find(m=>m.sent===5).received,null);
 assert.equal(frame(impaired,6.99).last.offsetActive,false);
 assert.equal(frame(impaired,7).last.sent,6);
 assert.equal(frame(impaired,7).last.offsetActive,true);
 assert.equal(frame(impaired,15).last.offsetActive,true);
 assert.equal(frame(impaired,16).last.offsetActive,false);
 const pair=frame(impaired,7).received.slice(-2);
 assert.equal(pair[1].sent-pair[0].sent,2);
 assert.equal(pair[1].claimed.x-pair[0].claimed.x,14);
});
