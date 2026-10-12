import test from 'node:test';
import assert from 'node:assert/strict';
import {communication} from '../web/js/communication.mjs';
import {frame,defaults} from '../web/js/scenario.mjs';
import {presets} from '../web/js/presets.mjs';
import {createReport} from '../web/js/report.mjs';

test('communication counts partition sent messages and omit future arrivals',()=>{
 for(const config of [presets.baseline,presets.impaired,{...defaults,dropEvery:1},{...defaults,delay:2}]){
  for(const t of [0,.5,5,6.99,7,20]){
   const f=frame(config,t),c=communication(f);
   assert.equal(c.sent,c.pending+c.omitted+c.received);
   assert.ok(c.events.every(e=>e.time<=t));
   assert.equal(c.events.filter(e=>e.kind==='received').length,f.received.length);
   assert.equal(c.events.filter(e=>e.kind==='omitted').length,c.omitted);
  }
 }
 const c=communication(frame(presets.impaired,7));
 assert.deepEqual([c.sent,c.pending,c.omitted,c.received],[8,1,2,5]);
 assert.equal(c.held.id,'demo-7');assert.equal(c.latestSent.id,'demo-8');
 assert.ok(!c.events.some(e=>e.kind==='received'&&e.id==='demo-6'));
});
test('zero-delay send precedes receive; rewind is stateless and reports are untouched',()=>{
 const config=presets.baseline,before=createReport(config,0),f=frame(config,0);
 assert.deepEqual(communication(f).events,[{time:0,kind:'sent',id:'demo-1'},{time:0,kind:'received',id:'demo-1'}]);
 communication(frame(config,20));assert.deepEqual(communication(frame(config,0)),communication(f));
 assert.deepEqual(createReport(config,0),before);
});
