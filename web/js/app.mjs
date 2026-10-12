import * as THREE from '../vendor/three/three.module.js';
import {defaults,validate,frame,messages,active} from './scenario.mjs';
import {createReport,reportMarkdown,toolVersion} from './report.mjs';
import {presets} from './presets.mjs';
import {viewData,focusData} from './view-data.mjs';
import {communication} from './communication.mjs';
const $=id=>document.getElementById(id);
let config={...presets.baseline},time=6.5,playing=false,lastTick=null,lang='vi',views=[],viewZoom=1,settleUntil=0,lastReadout=0;
let selectedPreset='baseline',focusTopic='sampling';
const tr=(vi,en)=>lang==='vi'?vi:en;
const point=p=>p?`(${p.x.toFixed(2)}, ${p.y.toFixed(2)}) m`:'—';
function text(id,value){$(id).textContent=value;}
function fill(){for(const key of ['dx','dy','start','end','delay','dropEvery'])$(key).value=config[key];}
function notice(vi,en){text('notice',tr(vi,en));}
function apply(value){config=validate(value);selectedPreset=Object.keys(presets).find(k=>Object.keys(config).every(field=>config[field]===presets[k][field]))??null;time=0;playing=false;fill();text('error','');notice('Đã áp dụng kịch bản tổng hợp.','Synthetic scenario applied.');draw();}
function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('config').addEventListener('submit',e=>{e.preventDefault();try{const next={...defaults};for(const key of ['dx','dy','start','end','delay','dropEvery'])next[key]=Number($(key).value);apply(next);}catch(err){text('error',tr('Cấu hình không hợp lệ: ','Invalid configuration: ')+err.message);}});
$('config').addEventListener('input',e=>{if(e.target.type!=='file')notice('Cảnh vẫn dùng cấu hình cũ. Bấm Áp dụng & về đầu để cập nhật.','The scene still uses the previous settings. Click Apply & reset to update it.');});
$('defaults').onclick=()=>apply({...defaults});
$('export').onclick=()=>download('v2x-synthetic-scenario.json',config);
$('report-json').onclick=()=>download('v2x-observation-report.json',createReport(config,time));
$('report-md').onclick=()=>{
 const url=URL.createObjectURL(new Blob([reportMarkdown(createReport(config,time))],{type:'text/markdown;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='v2x-observation-report.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
text('tool-version',`v${toolVersion}`);
$('trace').onclick=()=>download('v2x-synthetic-trace.json',{version:1,kind:'synthetic-trace',generator:'linear-motion-v1',units:{position:'metres',time:'seconds'},scenario:config,messages:messages(config)});
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>8192)throw Error('File exceeds 8 KiB');apply(JSON.parse(await file.text()));}catch(err){text('error',tr('Không nhập được tệp: ','Cannot import file: ')+err.message);}finally{e.target.value='';}};
$('play').onclick=()=>{if(time>=config.duration)time=0;playing=!playing;lastTick=null;draw();};
$('reset').onclick=()=>{time=0;playing=false;draw();};
$('time').oninput=e=>{time=Number(e.target.value);playing=false;draw();};
$('language').onchange=e=>{lang=e.target.value;document.documentElement.lang=lang;translate();text('notice','');draw();};
function translate(){for(const el of document.querySelectorAll('[data-vi]'))el.textContent=el.dataset[lang];}
function setZoom(value){viewZoom=Math.max(0.75,Math.min(4,value));text('zoom-value',`${viewZoom.toFixed(1)}×`);draw();}
$('zoom-in').onclick=()=>setZoom(viewZoom+0.25);
$('zoom-out').onclick=()=>setZoom(viewZoom-0.25);
$('fit-view').onclick=()=>setZoom(1);
$('camera-mode').onchange=()=>draw();
$('focus-mode').onchange=()=>draw();
$('detail-views').ontoggle=()=>draw();
$('show-trails').onchange=()=>draw();
for(const button of document.querySelectorAll('.expand-view'))button.onclick=()=>{
 const card=button.closest('article'),expand=!card.classList.contains('expanded');
 for(const other of document.querySelectorAll('.expand-view')){
  const selected=other===button&&expand;
  other.closest('article').classList.toggle('expanded',selected);
  other.setAttribute('aria-expanded',String(selected));
  other.dataset.vi=selected?'Thu gọn khung':'Mở rộng khung';other.dataset.en=selected?'Collapse view':'Expand view';
 }
 translate();
};
const guides={
 baseline:['Không lệch, không trễ, không bỏ: tại 6.5 s, vị trí thật tiếp tục chuyển động nhưng xe nhận vẫn giữ bản tin phát lúc 6 s. Một bản tin mỗi giây vẫn tạo khoảng trống quan sát.','No offset, delay or omissions: at 6.5 s ground truth keeps moving, but the receiver holds the message sent at 6 s. One message per second still leaves observation gaps.'],
 offset:['Xem 5 s → 10 s → 15 s: offset bật, giữ cố định rồi tắt. Giữa đoạn, Δp′ = Δp dù vị trí lệch 8 m; tại biên, sai phân có bước nhảy.','Inspect 5 s → 10 s → 15 s: the offset starts, stays constant, then ends. Inside the interval, Δp′ = Δp despite an 8 m position offset; boundaries introduce jumps.'],
 impaired:['Bản tin phát lúc 5 s bị bỏ; tới 7 s xe nhận mới nhận bản tin lệch phát lúc 6 s. Xem 15 s rồi 16 s để thấy xe nhận biết việc tắt offset muộn. So sánh thời điểm phát, thời điểm nhận và tuổi dữ liệu.','The message sent at 5 s is omitted; at 7 s the receiver first gets an offset message sent at 6 s. Inspect 15 s then 16 s to see late observation of offset removal. Compare send time, arrival time and data age.']
};
for(const button of document.querySelectorAll('[data-preset]'))button.onclick=()=>apply(presets[button.dataset.preset]);
$('show-reference').onchange=()=>draw();
function seek(t){time=t;playing=false;draw();}
$('jump-start').onclick=()=>seek(config.start);
$('jump-middle').onclick=()=>seek((config.start+config.end)/2);
$('jump-end').onclick=()=>seek(config.end);
const storyStops={sampling:['baseline',6.5],offset:['offset',10],delivery:['impaired',7]};
function storyStop(key){focusTopic=key;$('focus-mode').value=key==='delivery'?'receiver':'compare';const [preset,t]=storyStops[key];apply(presets[preset]);time=t;draw();$('story').scrollIntoView({block:'start'});}
$('start-story').onclick=()=>storyStop('offset');
for(const b of document.querySelectorAll('[data-story]'))b.onclick=()=>storyStop(b.dataset.story);
$('take-scenario').onclick=()=>download('v2x-synthetic-scenario.json',config);
$('take-guide').onclick=()=>{
 const report=createReport(config,time);
 const steps=tr('# Tái hiện tình huống\n\n1. Mở https://v2x.tcybertrust.id.vn/ hoặc bản local.\n2. Mở cấu hình nâng cao, nhập tệp kịch bản đã tải.\n3. Tua tới ', '# Reproduce the scenario\n\n1. Open https://v2x.tcybertrust.id.vn/ or the local bundle.\n2. Open advanced settings and import the downloaded scenario.\n3. Seek to ')+time.toFixed(2)+' s.\n4. '+tr('So sánh với kết quả bên dưới. Camera không ảnh hưởng số liệu.','Compare with the expected results below. Camera settings do not affect values.')+'\n\n'+reportMarkdown(report);
 const url=URL.createObjectURL(new Blob([steps],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='v2x-reproduction-guide.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
function storyInsight(f){
 const d=f.displacement,offset=active(config,time)?Math.hypot(config.dx,config.dy):0;
 let title;
 if(selectedPreset==='impaired'&&f.last)title=tr(`B đang dùng thông tin phát từ ${(time-f.last.sent).toFixed(2)} giây trước.`,`B is using information sent ${(time-f.last.sent).toFixed(2)} seconds ago.`);
 else if(d&&d.sameOffset&&offset>0)title=tr(`Lệch ${offset.toFixed(2)} m · sai phân vẫn bằng nhau.`,`Offset ${offset.toFixed(2)} m · position differences still match.`);
 else if(d&&!d.sameOffset)title=tr('Tại biên offset: sai phân có bước nhảy.','At the offset boundary: position differences jump.');
 else title=tr('B chỉ biết bản tin đã tới, không biết chuyển động liên tục.','B knows arrived messages, not continuous movement.');
 const evidence=d?`Δp = ${point(d.physical)} · Δp′ = ${point(d.claimed)}`:tr('Cần hai bản tin phát để tính sai phân.','Two sent messages are needed for differences.');
 const held=f.last?tr(`B giữ ${f.last.id}: phát ${f.last.sent.toFixed(2)} s, nhận ${f.last.received.toFixed(2)} s; dữ liệu đã ${ (time-f.last.sent).toFixed(2)} s tuổi.`,`B holds ${f.last.id}: sent ${f.last.sent.toFixed(2)} s, arrived ${f.last.received.toFixed(2)} s; data is ${(time-f.last.sent).toFixed(2)} s old.`):tr('B chưa nhận bản tin nào.','B has not received a message yet.');
 $('story-insight').replaceChildren(...[title,evidence,held,tr('Sai phân giống nhau không xác nhận vị trí đúng.','Matching differences do not establish position correctness.')].map((value,i)=>{const el=document.createElement(i===0?'strong':'span');el.textContent=value;return el;}));
 for(const b of document.querySelectorAll('[data-story]')){const [p,t]=storyStops[b.dataset.story];b.setAttribute('aria-pressed',String(selectedPreset===p&&time===t));}
}
function metricGroup(title,rows,note=''){
 const section=document.createElement('section');section.className='metric-group';
 const heading=document.createElement('h4');heading.textContent=title;section.appendChild(heading);
 const list=document.createElement('dl');list.className='metric-grid';
 for(const [label,value] of rows){const item=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;item.append(dt,dd);list.appendChild(item);}
 section.appendChild(list);
 if(note){const p=document.createElement('p');p.className='metric-note';p.textContent=note;section.appendChild(p);}
 return section;
}
function observationGuide(f){
 const guide=guides[selectedPreset];text('preset-guide',guide?guide[lang==='vi'?0:1]:tr('Tình huống tùy chỉnh: so sánh trước, trong và sau khoảng offset; kiểm tra bản tin nào thực sự đến xe nhận.','Custom scenario: compare before, inside and after the offset interval; check which messages actually reach the receiver.'));
 for(const b of document.querySelectorAll('[data-preset]'))b.setAttribute('aria-pressed',String(b.dataset.preset===selectedPreset));
 const nonzero=config.dx!==0||config.dy!==0;
 $('offset-band').style.left=`${config.start/config.duration*100}%`;
 $('offset-band').style.width=`${(config.end-config.start)/config.duration*100}%`;
 $('offset-band').style.opacity=nonzero?'1':'.2';
 $('timeline-cursor').style.left=`${time/config.duration*100}%`;
 text('jump-start',`${tr('Biên đầu','Start boundary')}: ${config.start} s`);text('jump-end',`${tr('Biên cuối','End boundary')}: ${config.end} s`);
 text('interval-state',!nonzero?tr('Offset bằng 0: hai mốc không tạo bước nhảy vị trí.','Zero offset: these boundaries cause no position jump.'):active(config,time)?tr('Đang trong khoảng offset [bắt đầu, kết thúc).','Inside the offset interval [start, end).'):tr('Đang ngoài khoảng offset.','Outside the offset interval.'));
 const held=f.last;
 const heldRows=held?[[tr('ID đang giữ','Held ID'),held.id],[tr('Tuổi từ lúc phát','Age since sent'),`${(time-held.sent).toFixed(2)} s`],[tr('Phát lúc','Sent at'),`${held.sent.toFixed(2)} s`],[tr('Nhận lúc','Arrived at'),`${held.received.toFixed(2)} s`]]:[];
 const pair=f.received.slice(-2),rows=[];let note=tr('Chưa đủ hai bản tin đã nhận.','Fewer than two messages have arrived.');
 if(pair.length===2){const [a,b]=pair;rows.push([tr('Cặp ID','Message pair'),`${a.id} → ${b.id}`],[tr('Mốc phát của cặp','Pair send times'),`${a.sent.toFixed(2)} → ${b.sent.toFixed(2)} s`],[tr('Sai phân khai báo Δp′','Claim difference Δp′'),point({x:b.claimed.x-a.claimed.x,y:b.claimed.y-a.claimed.y})],[tr('Khoảng phát Δt','Send-time gap Δt'),`${(b.sent-a.sent).toFixed(2)} s`]);note=b.sent-a.sent>1?tr('Cặp nhận cách nhau hơn 1 s do bỏ bản tin. Đây không phải cặp phát liên tiếp.','Received samples span more than 1 s due to omissions; this is not a consecutive sent pair.'):tr('Đối chiếu mốc phát trước khi so sánh hai phía.','Match send times before comparing the two sides.');}
 $('receiver-checks').replaceChildren(metricGroup(tr('Bản tin B đang giữ','Message held by B'),heldRows,held?'':tr('B chưa nhận bản tin.','B has not received a message.')),metricGroup(tr('Cặp dùng để so sánh','Comparison pair'),rows,note));
}
function drawCommunication(f){
 const c=communication(f),sent=c.latestSent,held=c.held;
 text('flow-sent',`${tr('Đã phát','Sent')}: ${c.sent} · ${sent?`${sent.id} @ ${sent.sent.toFixed(2)} s · A′ ${point(sent.claimed)}`:'—'}`);
 text('flow-channel',`${tr('Đang chờ','Pending')}: ${c.pending} · ${tr('Bỏ theo cấu hình','Configured omissions')}: ${c.omitted}`);
 text('flow-received',`${tr('Đã nhận','Received')}: ${c.received} · ${held?`${held.id} · A′ ${point(held.claimed)} · ${tr('tuổi dữ liệu','data age')} ${(f.time-held.sent).toFixed(2)} s`:tr('Chưa có bản tin','No message yet')}`);
 text('event-count',`${tr('Tổng sự kiện','Total events')}: ${c.events.length} · ${tr('Mới nhất trước','Newest first')}`);
 const labels={sent:tr('A phát','A sends'),omitted:tr('Bỏ theo cấu hình','Omitted by configuration'),received:tr('B nhận','B receives')};
 $('communication-events').replaceChildren(...c.events.slice().reverse().map(e=>{
  const row=document.createElement('tr');
  for(const value of [e.time.toFixed(2),e.id,labels[e.kind]]){const cell=document.createElement('td');cell.textContent=value;row.appendChild(cell);}
  return row;
 }));
}
function createView(id,color){
 const target=$(id),scene=new THREE.Scene();scene.background=new THREE.Color('#0d1827');
 const camera=new THREE.OrthographicCamera(-30,30,30,-30,0.1,500);let aspect=1,rig=null,previousRender=null,previousTime=null,previousConfig=null,previousScope=null;
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));target.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x233448,3));
 const grid=new THREE.GridHelper(100,20,0x334b60,0x203245);scene.add(grid);
 const roadMaterial=new THREE.MeshBasicMaterial({color:0x263849});
 for(const [x,z] of [[100,7],[7,100]]){const road=new THREE.Mesh(new THREE.PlaneGeometry(x,z),roadMaterial);road.rotation.x=-Math.PI/2;road.position.y=.02;scene.add(road);}
 function box(c,wire=false){const mesh=new THREE.Mesh(new THREE.BoxGeometry(4,1.8,2.2),new THREE.MeshStandardMaterial({color:c,wireframe:wire}));mesh.position.y=1.1;scene.add(mesh);return mesh;}
 const isFocus=id==='focus';
 const main=isFocus?new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.4,24),new THREE.MeshBasicMaterial({color})):box(color);if(isFocus)scene.add(main);
 const observer=box(0x7eafff),reference=box(0x67e8c3,!isFocus);
 const claimMesh=isFocus?box(0xffc477,true):null;observer.rotation.y=Math.PI/2;
 function marker(label,color,radius,offset){
  const ring=new THREE.Mesh(new THREE.RingGeometry(radius-.10,radius,64),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,depthWrite:false}));
  ring.rotation.x=-Math.PI/2;ring.position.y=.10;scene.add(ring);
  const tag=document.createElement('span');tag.className='position-tag';tag.textContent=label;tag.style.color='#'+color.toString(16).padStart(6,'0');target.appendChild(tag);
  return {ring,tag,offset};
 }
 const mainMark=marker(isFocus?'R':id==='truth'?'A':'A′',color,id==='truth'?2.8:3.5,isFocus?85:id==='truth'?-38:38);
 const referenceMark=marker('A',0x67e8c3,2.8,-38),observerMark=marker('B',0x7eafff,4.2,0);
 const claimMark=isFocus?marker('A′',0xffc477,4.8,60):null;
 const measureLine=isFocus?new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xe2edf5})):null;if(measureLine)scene.add(measureLine);
 function historyMark(color){
  const geometry=new THREE.BufferGeometry();
  const line=new THREE.Line(geometry,new THREE.LineDashedMaterial({color,dashSize:.65,gapSize:.45,transparent:true,opacity:.85}));
  const dots=new THREE.Points(geometry,new THREE.PointsMaterial({color,size:5,sizeAttenuation:false}));
  scene.add(line,dots);return {line,dots,key:null};
 }
 const trailMark=historyMark(color),referenceHistory=historyMark(0x67e8c3);
 function updateHistory(mark,points){
  const key=JSON.stringify(points);if(mark.key===key)return;mark.key=key;
  const geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(p.x,.20,p.y)));
  mark.line.geometry.dispose();mark.line.geometry=geometry;mark.dots.geometry=geometry;
  mark.line.visible=points.length>1;mark.dots.visible=points.length>0;
  if(points.length>1)mark.line.computeLineDistances();
 }
 function orient(x,z){
  if($('camera-mode').value==='top'){camera.up.set(0,0,-1);camera.position.set(x,90,z);}
  else{camera.up.set(0,1,0);camera.position.set(x+42,68,z+60);}
  camera.lookAt(x,0,z);camera.updateMatrixWorld();
 }
 function placeMark(mark,p){
  mark.ring.visible=Boolean(p);mark.tag.hidden=!p;if(!p)return;
  mark.ring.position.set(p.x,.10,p.y);
  const v=new THREE.Vector3(p.x,3,p.y).project(camera);
  mark.tag.hidden=Math.abs(v.x)>1||Math.abs(v.y)>1;
  mark.tag.style.left=`${Math.max(mark.tag.offsetWidth/2+4,Math.min(target.clientWidth-mark.tag.offsetWidth/2-4,(v.x+1)*target.clientWidth/2+mark.offset))}px`;
  mark.tag.style.top=`${(1-v.y)*target.clientHeight/2-(isFocus?(mark===observerMark?72:mark===mainMark?-38:mark===claimMark?38:8):(mark===observerMark?30:8))}px`;
 }
 function resize(){const {width,height}=target.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);aspect=width/height;settleUntil=performance.now()+1800;render(frame(config,time));}
 function render(f){
 if(!target.clientWidth||!target.clientHeight)return;
 const scope=[$('camera-mode').value,$('show-trails').checked,$('show-reference').checked,$('focus-mode').value,focusTopic].join(':');
 // Drop camera memory when the visible information changes or time rewinds.
 if(previousConfig!==config||previousScope!==scope||(previousTime!==null&&f.time<previousTime))rig=null;
 previousConfig=config;previousScope=scope;previousTime=f.time;
 const data=isFocus?focusData(f,{receiverOnly:$('focus-mode').value==='receiver',trails:$('show-trails').checked,focus:focusTopic}):viewData(id,f,{trails:$('show-trails').checked,reference:$('show-reference').checked});
 const points=data.framing;
 updateHistory(trailMark,data.trail);updateHistory(referenceHistory,data.referenceTrail);
 const xs=points.map(p=>p.x),zs=points.map(p=>p.y);
 const cx=(Math.min(...xs)+Math.max(...xs))/2,cz=(Math.min(...zs)+Math.max(...zs))/2;
 orient(cx,cz);
 let halfX=0,halfY=0;
 for(const p of points){const v=new THREE.Vector3(p.x,1.1,p.y).applyMatrix4(camera.matrixWorldInverse);halfX=Math.max(halfX,Math.abs(v.x)+5);halfY=Math.max(halfY,Math.abs(v.y)+5);}
 const desiredHalf=Math.max(13,halfY+2,(halfX+3)/aspect)/viewZoom;
 const now=performance.now(),dt=previousRender===null?0:Math.min((now-previousRender)/1000,.1);previousRender=now;
 if(!rig)rig={x:cx,z:cz,half:desiredHalf};
 const blend=window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt/0.22);
 rig.x+=(cx-rig.x)*blend;rig.z+=(cz-rig.z)*blend;rig.half+=(desiredHalf-rig.half)*blend;
 orient(rig.x,rig.z);
 const half=rig.half;
 camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();
 const p=data.main;main.visible=Boolean(p);if(p)main.position.set(p.x,1.1,p.y);
 reference.visible=Boolean(data.reference);if(data.reference)reference.position.set(data.reference.x,1.1,data.reference.y);
 observer.position.set(data.observer.x,1.1,data.observer.y);
 if(isFocus){
  mainMark.tag.textContent=data.main?`R · ${tr('tuổi','age')} ${data.age.toFixed(2)} s`: 'R';
  claimMesh.visible=Boolean(data.claim);if(data.claim)claimMesh.position.set(data.claim.x,1.1,data.claim.y);placeMark(claimMark,data.claim);
  measureLine.visible=Boolean(data.measure);if(data.measure){measureLine.geometry.dispose();measureLine.geometry=new THREE.BufferGeometry().setFromPoints([data.measure.from,data.measure.to].map(p=>new THREE.Vector3(p.x,.45,p.y)));}
 }
 placeMark(mainMark,p);placeMark(referenceMark,data.reference);placeMark(observerMark,data.observer);renderer.render(scene,camera);}

 new ResizeObserver(resize).observe(target);resize();return render;
}
function draw(renderViews=true){
 settleUntil=performance.now()+1800;
 const f=frame(config,time);observationGuide(f);storyInsight(f);drawCommunication(f);$('time').value=time;text('time-value',`${time.toFixed(2)} s`);text('play',playing?tr('Tạm dừng','Pause'):tr('Phát','Play'));
 const focused=focusData(f,{receiverOnly:$('focus-mode').value==='receiver',focus:focusTopic});
 text('focus-scope',$('focus-mode').value==='receiver'?tr('Chỉ B và bản tin đã tới; không dùng vị trí thật hay khai báo chưa nhận để căn camera.','Only B and arrived claims; framing excludes ground truth and unreceived claims.'):tr('Góc nhìn người phân tích — B không được cung cấp vị trí thật A. Đường nối chỉ đo khoảng cách, không phải đường xe chạy.','Analyst view — B is not supplied with true position A. The connector measures distance, not a driven route.'));
 text('focus-readout',`${focused.measure?`${focused.measure.label}: ${focused.measure.distance.toFixed(2)} m · `:''}${focused.main?`R: ${point(focused.main)} · ${focused.id} · ${tr('tuổi từ lúc phát','age since sent')} ${focused.age.toFixed(2)} s`:tr('Chưa có bản tin: chưa có dấu R.','No message yet: no R marker.')}`);
 text('truth-value',`A: ${point(f.physical)}`);text('reported-value',`A′: ${point(f.claimed)}`);text('observed-value',f.last?`${point(f.last.claimed)} · ${tr('từ lúc phát','since sent')} ${(time-f.last.sent).toFixed(2)} s · ${tr('từ lúc nhận','since arrival')} ${f.age.toFixed(2)} s`:tr('Chưa nhận bản tin','No message received'));
 const rows=[[tr('Độ lệch hiện tại','Current offset'),active(config,time)?point({x:config.dx,y:config.dy}):point({x:0,y:0})],[tr('Vị trí xe B','Vehicle B position'),point(f.receiver)]];
 let note=tr('Cần hai bản tin phát để tính sai phân.','Two sent messages are needed for differences.');
 if(f.displacement){const d=f.displacement;rows.push([tr('Cặp ID','Message pair'),`${f.sent.at(-2).id} → ${f.sent.at(-1).id}`],[tr('Mốc phát của cặp','Pair send times'),`${f.sent.at(-2).sent.toFixed(2)} → ${f.sent.at(-1).sent.toFixed(2)} s`],[tr('Sai phân thật Δp','True difference Δp'),point(d.physical)],[tr('Sai phân khai báo Δp′','Claim difference Δp′'),point(d.claimed)]);note=d.sameOffset?tr('Cùng đoạn: sai phân bằng nhau. Điều này không xác nhận vị trí đúng.','Same segment: differences match. This does not establish correct position.'):tr('Cặp qua biên offset: sai phân có bước nhảy.','Pair crosses an offset boundary: differences jump.');}
 $('checks').replaceChildren(metricGroup(tr('Cặp phát liên tiếp','Consecutive sent pair'),rows,note));
 text('counts',`${tr('Đã phát','Sent')}: ${f.sent.length} · ${tr('Đã nhận','Received')}: ${f.received.length}`);
 $('messages').replaceChildren(...f.sent.slice(-6).reverse().map(m=>{const row=document.createElement('tr'),arrived=m.received!==null&&m.received<=time;const state=m.received===null?tr('Bỏ theo cấu hình','Omitted by configuration'):arrived?tr('Đã nhận','Received'):tr('Đang chờ','Pending');for(const value of [m.id,m.sent.toFixed(2),arrived?m.received.toFixed(2):'—',state]){const cell=document.createElement('td');cell.textContent=value;row.appendChild(cell);}return row;}));
 if(renderViews)for(const render of views)render(f);
}
translate();fill();
try{views=[createView('focus',0xd7a8ff),createView('truth',0x67e8c3),createView('reported',0xffc477),createView('observed',0xffc477)];}catch{for(const el of document.querySelectorAll('.viewport'))el.replaceChildren();text('render-status','WebGL unavailable. Coordinate readouts and message exploration remain usable.');}
draw();
function tick(now){
 if(playing){
  if(lastTick!==null)time=Math.min(config.duration,time+Math.min((now-lastTick)/1000,0.1));
  if(time>=config.duration)playing=false;
  // Text/table updates need not rebuild the DOM at animation-frame frequency.
  if(now-lastReadout>=100||!playing){draw(false);lastReadout=now;}
 }
 if(playing||now<settleUntil){const f=frame(config,time);for(const render of views)render(f);}
 lastTick=now;requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
