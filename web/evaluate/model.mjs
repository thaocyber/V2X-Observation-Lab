// Binary, precomputed predictions only. No inference, threshold selection or assurance score.
export const MAX_RECORDS=10000;
function exact(o,keys,label){if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))throw Error(`${label}: unsupported or missing fields.`);}
function text(v,max,label){if(typeof v!=='string'||!v.trim()||v.length>max)throw Error(`${label}: nonempty text, max ${max} characters.`);return v;}
export function validateEvaluation(input){
 exact(input,['schemaVersion','kind','metadata','records'],'Evaluation');
 if(input.schemaVersion!==1||input.kind!=='v2x-binary-evaluation')throw Error('Unsupported evaluation schema. Evidence reports and lesson files are not evaluation inputs.');
 const keys=['dataset','model','split','intendedUse','positiveClass','labelSource','thresholdPolicy','dataOrigin'];
 exact(input.metadata,keys,'Metadata');
 const metadata=Object.fromEntries(keys.map(k=>[k,text(input.metadata[k],500,k)]));
 if(!['synthetic','external'].includes(metadata.dataOrigin))throw Error('dataOrigin must be synthetic or external.');
 if(!Array.isArray(input.records)||input.records.length<1||input.records.length>MAX_RECORDS)throw Error(`Expected 1–${MAX_RECORDS} records.`);
 const ids=new Set();
 const records=input.records.map(row=>{
  exact(row,['id','expected','predicted'],'Record');
  const id=text(row.id,120,'id');if(ids.has(id))throw Error('Duplicate record ID: '+id);ids.add(id);
  if(![0,1].includes(row.expected)||![0,1].includes(row.predicted))throw Error('expected and predicted must be numeric 0 or 1.');
  return {id,expected:row.expected,predicted:row.predicted};
 });
 return {schemaVersion:1,kind:input.kind,metadata,records};
}
export function outcome(row){return row.expected===1?(row.predicted===1?'TP':'FN'):(row.predicted===1?'FP':'TN');}
export function summarize(input){
 const e=validateEvaluation(input),counts={TP:0,TN:0,FP:0,FN:0};
 for(const row of e.records)counts[outcome(row)]++;
 const {TP,TN,FP,FN}=counts,n=e.records.length,ratio=(a,b)=>b?a/b:null;
 return {n,positiveCount:TP+FN,negativeCount:TN+FP,counts,metrics:{accuracy:(TP+TN)/n,precision:ratio(TP,TP+FP),recall:ratio(TP,TP+FN),f1:ratio(2*TP,2*TP+FP+FN)}};
}
export function makeReport(input,sha256,notes=''){
 const evaluation=validateEvaluation(input);
 if(typeof sha256!=='string'||!/^[a-f0-9]{64}$/.test(sha256))throw Error('Expected SHA-256 of canonical validated input.');
 if(typeof notes!=='string'||notes.length>3000)throw Error('Review notes exceed 3000 characters.');
 return {schemaVersion:1,kind:'v2x-evaluation-evidence',inspectorVersion:'0.1.0',inputHash:{algorithm:'SHA-256',scope:'UTF-8 JSON.stringify(validateEvaluation(input)), fixed key order; record order retained',value:sha256},input:evaluation,summary:summarize(evaluation),evidence:{supplied:'Labels, predictions and metadata are supplied by the importer; provenance is not independently verified.',derived:'Binary confusion counts and metrics computed from these rows only.',assumed:'Expected labels and the declared class, split and threshold policy correctly describe these predictions.',unknown:['Label correctness','Training/test leakage','Generalization to new settings','Calibration and adversarial robustness','Suitability for deployment']},review:{notes,attribution:'User-authored notes; not a tool recommendation or approval.'},limitations:['No inference, training, threshold selection or automatic deployment recommendation.','No assurance score, confidence probability, AUC, causal explanation or certification.','Aggregate metrics do not validate any individual prediction.','No automatic mapping of imported rows to the synthetic 3D scenes.','A hash identifies content; it does not authenticate its origin.']};
}
