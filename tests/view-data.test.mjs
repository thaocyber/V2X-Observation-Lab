import test from 'node:test';
import assert from 'node:assert/strict';
import {viewData} from '../web/js/view-data.mjs';
import {frame} from '../web/js/scenario.mjs';
import {presets} from '../web/js/presets.mjs';
import {createReport} from '../web/js/report.mjs';

test('receiver trails contain only arrived claims, including omissions and delay boundaries',()=>{
 for(const t of [0,.5,5,6.99,7,15,16,20]){
  const f=frame(presets.impaired,t),v=viewData('observed',f);
  assert.deepEqual(v.trail,f.received.map(m=>m.claimed));
  assert.equal(v.reference,null);assert.deepEqual(v.referenceTrail,[]);
  assert.deepEqual(v.main,f.last?.claimed??null);
 }
 assert.deepEqual(viewData('observed',frame(presets.impaired,0)).framing,[{x:0,y:-20}]);
});
test('hidden truth and unreceived claims cannot influence receiver geometry or framing',()=>{
 const f=frame(presets.impaired,7),before=viewData('observed',f);
 const changed=structuredClone(f);changed.physical={x:9999,y:9999};changed.claimed={x:-9999,y:9999};
 for(const m of changed.sent){m.physical={x:9999,y:9999};if(m.received===null||m.received>7)m.claimed={x:9999,y:9999};}
 assert.deepEqual(viewData('observed',changed),before);
 assert.deepEqual(viewData('observed',f,{reference:true}).reference,f.physical);
 assert.ok(viewData('observed',f,{reference:true}).referenceTrail.length>0);
});
test('seek/reset rebuild histories without retaining future points; toggles do not change exports',()=>{
 const f=frame(presets.impaired,7),report=createReport(presets.impaired,7);
 const first=viewData('observed',f);viewData('observed',frame(presets.impaired,20));
 assert.deepEqual(viewData('observed',frame(presets.impaired,7)),first);
 assert.deepEqual(viewData('observed',frame(presets.impaired,0)).trail,[]);
 for(const trails of [true,false])for(const reference of [true,false])for(const id of ['truth','reported','observed']){
  const data=viewData(id,f,{trails,reference});if(!trails){assert.deepEqual(data.trail,[]);assert.deepEqual(data.referenceTrail,[]);}
 }
 assert.deepEqual(createReport(presets.impaired,7),report);
 assert.deepEqual(frame(presets.impaired,7),f);
});
test('teaching histories stop at current time, while receiver holds its last sample',()=>{
 const f=frame(presets.baseline,6.5);
 assert.deepEqual(viewData('truth',f).trail.at(-1),{x:-10.5,y:0});
 assert.deepEqual(viewData('observed',f).trail.at(-1),{x:-12,y:0});
 assert.equal(viewData('observed',f).trail.length,7);
 assert.throws(()=>viewData('unknown',f));
});
