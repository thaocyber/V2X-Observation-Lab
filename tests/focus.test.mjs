import test from 'node:test';
import assert from 'node:assert/strict';
import {focusData} from '../web/js/view-data.mjs';
import {frame} from '../web/js/scenario.mjs';
import {presets} from '../web/js/presets.mjs';
import {createReport} from '../web/js/report.mjs';
test('focus: receiver-only excludes hidden truth, unreceived claims and measurement',()=>{
 const f=frame(presets.impaired,7),v=focusData(f,{receiverOnly:true,trails:true});
 const changed=structuredClone(f);changed.physical={x:999,y:999};changed.claimed={x:-999,y:999};changed.sent=[];
 assert.deepEqual(focusData(changed,{receiverOnly:true,trails:true}),v);
 assert.equal(v.reference,null);assert.equal(v.claim,null);assert.equal(v.measure,null);
 assert.equal(v.age,1);assert.deepEqual(v.main,{x:-4,y:0});
});
test('focus: story measurements, no arrival, rewind, and immutable exports',()=>{
 const f=frame(presets.baseline,6.5),before=createReport(presets.baseline,6.5);
 assert.equal(focusData(f,{focus:'sampling'}).measure.distance,1.5);
 assert.equal(focusData(frame(presets.offset,10)).measure.distance,8);
 const empty=focusData(frame(presets.impaired,0),{receiverOnly:true});
 assert.equal(empty.main,null);assert.equal(empty.age,null);assert.deepEqual(empty.framing,[{x:0,y:-20}]);
 focusData(frame(presets.impaired,20));assert.deepEqual(focusData(frame(presets.impaired,0),{receiverOnly:true}),empty);
 for(const receiverOnly of [true,false])for(const trails of [true,false])focusData(f,{receiverOnly,trails});
 assert.deepEqual(createReport(presets.baseline,6.5),before);
});
