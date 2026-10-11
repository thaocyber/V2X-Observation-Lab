import {validate,messages,frame} from './scenario.mjs';
export const toolVersion='0.1.0';
const difference=(a,b)=>({x:b.x-a.x,y:b.y-a.y});
export function createReport(input,time=0){
 const scenario=validate(input),snapshot=frame(scenario,time),trace=messages(scenario);
 const differences=trace.slice(1).map((b,i)=>{const a=trace[i];return {from:a.id,to:b.id,sentIntervalSeconds:b.sent-a.sent,physical:difference(a.physical,b.physical),reported:difference(a.claimed,b.claimed),offsetChanged:a.offsetActive!==b.offsetActive&&(scenario.dx!==0||scenario.dy!==0)};});
 const arrived=snapshot.received,pair=arrived.slice(-2);
 return {schemaVersion:1,kind:'v2x-observation-report',tool:{name:'V2X Observation Lab',version:toolVersion,generator:'linear-motion-v1'},provenance:'Authored synthetic data; no measured traces or model scores.',units:{position:'metres',time:'seconds'},scenario,snapshot:{time,heldMessage:snapshot.last,ageSinceReception:snapshot.age,ageSinceTransmission:snapshot.last?time-snapshot.last.sent:null,sentCount:snapshot.sent.length,receivedCount:arrived.length,receiverDifference:pair.length===2?{from:pair[0].id,to:pair[1].id,sentIntervalSeconds:pair[1].sent-pair[0].sent,reported:difference(pair[0].claimed,pair[1].claimed)}:null},trace,senderDifferences:differences,limitations:['Synthetic application-level messages only; no RF, GNSS, certificates, vehicle dynamics or collision model.','Ground truth is a teaching reference, not receiver knowledge.','Equal position differences do not establish absolute position correctness.','Sender and receiver differences may use different message pairs and time intervals.','Geometric checks are not attack detection, safety evaluation or benchmark results.'],reproduce:['Run this tool version using the release source.','Import the embedded scenario as a scenario JSON file.','Seek to snapshot.time; visual camera settings do not affect the report.']};
}
export function reportMarkdown(r){
 const point=p=>`(${p.x}, ${p.y})`;
 return `# V2X Observation Lab — reproduction report

Tool: ${r.tool.version}; generator: ${r.tool.generator}

${r.provenance}

## Applied scenario

\`\`\`json
${JSON.stringify(r.scenario,null,2)}
\`\`\`

## Receiver snapshot at ${r.snapshot.time} s

Sent: ${r.snapshot.sentCount}; received: ${r.snapshot.receivedCount}.

Held message: ${r.snapshot.heldMessage?.id??'none'}; data age: ${r.snapshot.ageSinceTransmission??'n/a'} s; age since reception: ${r.snapshot.ageSinceReception??'n/a'} s.

Receiver pair: ${r.snapshot.receiverDifference?`${r.snapshot.receiverDifference.from} → ${r.snapshot.receiverDifference.to}; Δp′ = ${point(r.snapshot.receiverDifference.reported)} m; send-time interval = ${r.snapshot.receiverDifference.sentIntervalSeconds} s`:'fewer than two arrived messages'}.

## Sender differences

| Pair | Δp (m) | Δp′ (m) | Offset changed |
|---|---|---|---|
${r.senderDifferences.map(d=>`| ${d.from} → ${d.to} | ${point(d.physical)} | ${point(d.reported)} | ${d.offsetChanged} |`).join('\n')}

## Reproduce

${r.reproduce.map((s,i)=>`${i+1}. ${s}`).join('\n')}

## Limitations

${r.limitations.map(s=>`- ${s}`).join('\n')}

The JSON report also contains the complete generated message trace.
`;
}
