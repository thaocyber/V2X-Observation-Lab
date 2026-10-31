import {physical,claimed} from './scenario.mjs';
import {presets} from './presets.mjs';
// A separate, fixed teaching clip: the offset preset between seconds 9 and 10.
const host=document.getElementById('offset-animation');
let progress=0,playing=false,last=null,raf=null;
const words=()=>document.getElementById('language').value==='vi';
const tr=(vi,en)=>words()?vi:en;
const start=physical(9),end=physical(10),claimStart=claimed(presets.offset,9);
const step=end.x-start.x,gap=claimStart.x-start.x,scale=38,left=125;
function setup(){
 host.innerHTML=`<div class="clip-heading"><h3>${tr('Cùng tiến thêm. Vẫn khác chỗ.','Same movement. Different places.')}</h3><span>${tr('Ví dụ cố định · giây 9 → 10','Fixed example · seconds 9 → 10')}</span></div>
 <svg viewBox="0 0 760 330" role="img" aria-labelledby="clip-title clip-description">
 <title id="clip-title">${tr('Xe thật và dấu vị trí khai báo cùng tiến 3 mét, vẫn cách nhau 8 mét','True car and reported marker both advance 3 metres, remaining 8 metres apart')}</title>
 <desc id="clip-description">${tr('Một xe và một dấu khai báo trên cùng trục đường. Dấu mờ đánh dấu vị trí ban đầu.','One car and one reported-position marker on the same road axis. Faded marks show starting positions.')}</desc>
 <defs><marker id="clip-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="context-stroke"/></marker></defs>
 <rect x="35" y="150" width="690" height="80" rx="15" fill="#223747"/><path d="M35 190H725" stroke="#7792a0" stroke-dasharray="14 12"/>
 <g opacity=".3"><rect x="${left-23}" y="174" width="46" height="30" rx="8" fill="#67e8c3"/><circle cx="${left+gap*scale}" cy="190" r="23" fill="none" stroke="#ffc477" stroke-width="3" stroke-dasharray="4 4"/></g>
 <g id="clip-true"><rect x="-23" y="-16" width="46" height="32" rx="8" fill="#67e8c3"/><path d="M3 -11H15V11H3" fill="#0b2634"/><path d="M-14 -19H-3M-14 19H-3" stroke="#b9fff0" stroke-width="5"/><text y="-40" text-anchor="middle" fill="#67e8c3">${tr('Xe thật','True car')}</text></g>
 <g id="clip-claim"><circle r="23" fill="#172334" stroke="#ffc477" stroke-width="3"/><path d="M-12 0H12M0 -12V12" stroke="#ffc477" stroke-width="2"/><text y="-40" text-anchor="middle" fill="#ffc477">${tr('Vị trí xe báo','Reported position')}</text></g>
 <path id="clip-true-arrow" stroke="#67e8c3" stroke-width="4" marker-end="url(#clip-arrow)"/>
 <path id="clip-claim-arrow" stroke="#ffc477" stroke-width="4" marker-end="url(#clip-arrow)"/>
 <text id="clip-true-distance" y="94" fill="#67e8c3" text-anchor="middle"/>
 <text id="clip-claim-distance" y="94" fill="#ffc477" text-anchor="middle"/>
 <path id="clip-gap" fill="none" stroke="#e1eaf2" stroke-width="2"/>
 <text id="clip-gap-label" y="292" fill="#e1eaf2" text-anchor="middle"/>
 </svg><p id="clip-caption" class="clip-caption" aria-live="polite"></p>
 <div class="toolbar"><button id="clip-play" type="button"></button><button id="clip-next" type="button">${tr('Bước tiếp →','Next step →')}</button><button id="clip-reset" type="button">${tr('↺ Xem lại','↺ Replay')}</button></div>
 <small>${tr('Dấu vàng không phải xe thứ hai. Cảnh này đối chiếu vị trí thật và vị trí báo; chưa biểu diễn xe nhận B.','The gold marker is not a second car. This clip compares true and reported positions; receiver B is not shown.')}</small>`;
 document.getElementById('clip-play').onclick=()=>{if(progress>=1)progress=0;playing=!playing;last=null;render();schedule();};
 document.getElementById('clip-next').onclick=()=>{playing=false;progress=progress<.5?.5:1;render();};
 document.getElementById('clip-reset').onclick=()=>{progress=0;playing=true;last=null;render();schedule();};
 render();
}
function render(){
 const x=left+step*scale*progress,y=x+gap*scale;
 const el=id=>document.getElementById(id);
 el('clip-true').setAttribute('transform',`translate(${x} 190)`);el('clip-claim').setAttribute('transform',`translate(${y} 190)`);
 for(const [id,origin,now] of [['true',left,x],['claim',left+gap*scale,y]]){
  const arrow=el(`clip-${id}-arrow`);arrow.setAttribute('d',`M${origin} 115H${now}`);arrow.style.visibility=progress>.01?'visible':'hidden';
  const label=el(`clip-${id}-distance`);label.setAttribute('x',(origin+now)/2);label.textContent=`+${Number((step*progress).toFixed(1))} m`;
 }
 el('clip-gap').setAttribute('d',`M${x} 245v15H${y}v-15`);el('clip-gap-label').setAttribute('x',(x+y)/2);el('clip-gap-label').textContent=tr(`Vẫn cách nhau ${gap} m`,`Still ${gap} m apart`);
 const caption=progress===0?tr('Bắt đầu ở hai chỗ khác nhau.','Starting at different places.'):progress<1?tr('Cả hai cùng tiến về một phía…','Both advance in the same direction…'):tr('Cùng tiến 3 m. Vị trí báo vẫn lệch 8 m.','Both advance 3 m. The reported position is still 8 m off.');
 if(el('clip-caption').textContent!==caption)el('clip-caption').textContent=caption;
 el('clip-play').textContent=playing?tr('Ⅱ Tạm dừng','Ⅱ Pause'):tr('▶ Xem chuyển động','▶ Play movement');
}
function schedule(){if(raf===null&&playing&&!host.hidden)raf=requestAnimationFrame(tick);}
function tick(now){raf=null;if(!playing||host.hidden)return;if(last!==null)progress=Math.min(1,progress+(now-last)/2400);last=now;if(progress===1)playing=false;render();schedule();}
function show(on){host.hidden=!on;document.getElementById('story').classList.toggle('visual-offset',on);playing=false;last=null;if(on){progress=0;render();}}
setup();
for(const b of document.querySelectorAll('[data-story]'))b.addEventListener('click',()=>show(b.dataset.story==='offset'));
document.getElementById('start-story').addEventListener('click',()=>show(true));
document.getElementById('language').addEventListener('change',setup);
// Returning to the free simulator closes the independent teaching clip.
document.getElementById('config').addEventListener('submit',()=>show(false));
