import test from 'node:test';
import assert from 'node:assert/strict';
import {createReport,reportMarkdown,toolVersion} from '../web/js/report.mjs';
import {presets} from '../web/js/presets.mjs';
import {frame,validate} from '../web/js/scenario.mjs';
test('report round trip reproduces held message, counts, ages and unequal sender/receiver pairs',()=>{
 const r=JSON.parse(JSON.stringify(createReport(presets.impaired,7)));
 assert.deepEqual(validate(r.scenario),presets.impaired);
 const f=frame(r.scenario,r.snapshot.time);
 assert.deepEqual(r.snapshot.heldMessage,f.last);
 assert.equal(r.snapshot.receivedCount,5);
 assert.equal(r.snapshot.ageSinceTransmission,1);
 assert.equal(r.snapshot.ageSinceReception,0);
 assert.equal(r.snapshot.receiverDifference.sentIntervalSeconds,2);
 assert.equal(r.snapshot.receiverDifference.reported.x,14);
 assert.equal(r.senderDifferences.find(d=>d.to==='demo-8').reported.x,3);
 assert.equal(r.trace.length,21);
 assert.equal(r.tool.version,toolVersion);
});
test('reports are deterministic, distinguish no arrival and reject untrusted configurations',()=>{
 assert.deepEqual(createReport(presets.impaired,7),createReport(presets.impaired,7));
 const r=createReport(presets.impaired,0);
 assert.equal(r.snapshot.heldMessage,null);
 assert.equal(r.snapshot.receiverDifference,null);
 assert.equal(r.snapshot.ageSinceTransmission,null);
 assert.throws(()=>createReport({...presets.offset,privateNote:'not permitted'},5));
 assert.throws(()=>createReport(presets.offset,21));
});
test('Markdown summary includes scenario, paired observations and explicit limitations',()=>{
 const text=reportMarkdown(createReport(presets.offset,5));
 assert.match(text,/```json\n/);
 assert.match(text,/demo-5 → demo-6/);
 assert.match(text,/\(11, 0\)/);
 assert.match(text,/not attack detection/);
 assert.equal(text.includes('\\n'),false);
});
