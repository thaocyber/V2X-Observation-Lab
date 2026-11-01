import {validateEvaluation,summarize,outcome,makeReport} from './model.mjs';
const $=id=>document.getElementById(id);let current=null,hash='',page=0,loadVersion=0;const pageSize=25;
const labels={dataset:'Dataset',model:'Model',split:'Data split',intendedUse:'Intended use',positiveClass:'Class 1 definition',labelSource:'Label source',thresholdPolicy:'Threshold policy',dataOrigin:'Source type'};
const countsLabels={TP:'Correct class 1',TN:'Correct class 0',FP:'False class 1 alarm',FN:'Missed class 1'};
function element(tag,text){const e=document.createElement(tag);e.textContent=text;return e;}
function drawRows(){
 const filter=$('filter').value,rows=current.records.filter(r=>filter==='ALL'||(filter==='ERROR'?['FP','FN'].includes(outcome(r)):outcome(r)===filter));
 const pages=Math.max(1,Math.ceil(rows.length/pageSize));page=Math.min(page,pages-1);
 $('rows').replaceChildren(...rows.slice(page*pageSize,(page+1)*pageSize).map(r=>{const tr=document.createElement('tr');for(const v of [r.id,r.expected,r.predicted,outcome(r)])tr.append(element('td',v));return tr;}));
 $('page-info').textContent=`${rows.length} cases · Page ${page+1}/${pages}`;$('prev').disabled=page===0;$('next').disabled=page===pages-1;
}
function render(){
 const s=summarize(current);$('workspace').hidden=false;$('metadata').replaceChildren(...Object.entries(current.metadata).flatMap(([k,v])=>[element('dt',labels[k]),element('dd',v)]));
 $('origin').textContent=current.metadata.dataOrigin==='synthetic'?'SYNTHETIC DATA — teaching fixture, not benchmark results.':'EXTERNAL DATA — provenance, labels and predictions are supplied by the importer; not verified.';
 $('hash').textContent=hash;
 $('counts').replaceChildren(...Object.entries(s.counts).map(([k,v])=>{const a=element('article','');a.append(element('h3',k),element('strong',v),element('p',countsLabels[k]));return a;}));
 $('metrics').replaceChildren(...Object.entries(s.metrics).map(([k,v])=>{const a=element('article','');a.append(element('h3',k),element('strong',v===null?'N/A':(v*100).toFixed(2)+'%'));return a;}));
 $('support').textContent=`${s.n} rows · ${s.positiveCount} class 1 · ${s.negativeCount} class 0. ${s.positiveCount===0||s.negativeCount===0?'One class is absent: both classes cannot be fully evaluated.':''}`;drawRows();$('export').disabled=false;
}
function mayReplace(){return !$('notes').value.trim()||window.confirm('Loading another dataset will discard unsaved notes. Continue?');}
async function install(input,version){
 const next=validateEvaluation(input),bytes=new TextEncoder().encode(JSON.stringify(next));
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 if(version!==loadVersion)return;
 current=next;hash=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');page=0;$('filter').value='ALL';$('notes').value='';$('error').textContent='';render();$('status').textContent='Loaded '+current.records.length+' rows. Metrics describe this dataset only.';
}
async function sample(){if(!mayReplace())return;const version=++loadVersion;try{const res=await fetch('sample.json');if(!res.ok)throw Error('Cannot load sample.');await install(await res.json(),version);}catch(e){if(version===loadVersion)$('error').textContent=e.message;}}
$('sample').onclick=sample;
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(!mayReplace()){e.target.value='';return;}const version=++loadVersion;try{if(file.size>2*1024*1024)throw Error('File exceeds 2 MiB.');await install(JSON.parse(await file.text()),version);}catch(err){if(version===loadVersion){$('error').textContent='Cannot open file: '+err.message;$('status').textContent=current?'The current dataset is unchanged.':'No valid dataset loaded.';}}finally{e.target.value='';}};
$('filter').onchange=()=>{page=0;drawRows();};$('prev').onclick=()=>{page--;drawRows();};$('next').onclick=()=>{page++;drawRows();};
$('export').onclick=()=>{if(!current)return;const report=makeReport(current,hash,$('notes').value);const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='v2x-evaluation-evidence.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='Report download requested with all data and notes. Review before sharing.';};
sample();
