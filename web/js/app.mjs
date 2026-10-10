import * as THREE from '../vendor/three/three.module.js';
import {defaults,validate,frame,messages,active} from './scenario.mjs';
const $=id=>document.getElementById(id);
let config={...defaults},time=0,playing=false,lastTick=null,lang='vi',views=[];
const tr=(vi,en)=>lang==='vi'?vi:en;
const point=p=>p?`(${p.x.toFixed(2)}, ${p.y.toFixed(2)}) m`:'—';
function text(id,value){$(id).textContent=value;}
function fill(){for(const key of ['dx','dy','start','end','delay','dropEvery'])$(key).value=config[key];}
function notice(vi,en){text('notice',tr(vi,en));}
function apply(value){config=validate(value);time=0;playing=false;fill();text('error','');notice('Đã áp dụng kịch bản tổng hợp.','Synthetic scenario applied.');draw();}
function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('config').addEventListener('submit',e=>{e.preventDefault();try{const next={...defaults};for(const key of ['dx','dy','start','end','delay','dropEvery'])next[key]=Number($(key).value);apply(next);}catch(err){text('error',tr('Cấu hình không hợp lệ: ','Invalid configuration: ')+err.message);}});
$('config').addEventListener('input',e=>{if(e.target.type!=='file')notice('Có thay đổi chưa áp dụng. Xuất JSON dùng cấu hình đã áp dụng.','Unapplied edits. JSON export uses the applied configuration.');});
$('defaults').onclick=()=>apply({...defaults});
$('export').onclick=()=>download('v2x-synthetic-scenario.json',config);
$('trace').onclick=()=>download('v2x-synthetic-trace.json',{version:1,kind:'synthetic-trace',generator:'linear-motion-v1',units:{position:'metres',time:'seconds'},scenario:config,messages:messages(config)});
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>8192)throw Error('File exceeds 8 KiB');apply(JSON.parse(await file.text()));}catch(err){text('error',tr('Không nhập được tệp: ','Cannot import file: ')+err.message);}finally{e.target.value='';}};
$('play').onclick=()=>{if(time>=config.duration)time=0;playing=!playing;lastTick=null;draw();};
$('reset').onclick=()=>{time=0;playing=false;draw();};
$('time').oninput=e=>{time=Number(e.target.value);playing=false;draw();};
$('language').onchange=e=>{lang=e.target.value;document.documentElement.lang=lang;translate();text('notice','');draw();};
function translate(){for(const el of document.querySelectorAll('[data-vi]'))el.textContent=el.dataset[lang];}
function createView(id,color){
 const target=$(id),scene=new THREE.Scene();scene.background=new THREE.Color('#0d1827');
 const camera=new THREE.PerspectiveCamera(43,1,0.1,400);camera.position.set(42,68,60);camera.lookAt(0,0,0);
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));target.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x233448,3));
 const grid=new THREE.GridHelper(100,20,0x334b60,0x203245);scene.add(grid);
 const roadMaterial=new THREE.MeshBasicMaterial({color:0x263849});
 for(const [x,z] of [[100,7],[7,100]]){const road=new THREE.Mesh(new THREE.PlaneGeometry(x,z),roadMaterial);road.rotation.x=-Math.PI/2;road.position.y=.02;scene.add(road);}
 function box(c,wire=false){const mesh=new THREE.Mesh(new THREE.BoxGeometry(4,1.8,2.2),new THREE.MeshStandardMaterial({color:c,wireframe:wire}));mesh.position.y=1.1;scene.add(mesh);return mesh;}
 const main=box(color),observer=box(0x7eafff),reference=box(0x67e8c3,true);observer.rotation.y=Math.PI/2;
 function resize(){const {width,height}=target.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();render(frame(config,time));}
 function render(f){const p=id==='truth'?f.physical:id==='reported'?f.claimed:f.last?.claimed;main.visible=Boolean(p);if(p)main.position.set(p.x,1.1,p.y);reference.visible=id!=='truth';reference.position.set(f.physical.x,1.1,f.physical.y);observer.position.set(f.receiver.x,1.1,f.receiver.y);renderer.render(scene,camera);}
 new ResizeObserver(resize).observe(target);resize();return render;
}
function draw(){
 const f=frame(config,time);$('time').value=time;text('time-value',`${time.toFixed(2)} s`);text('play',playing?tr('Tạm dừng','Pause'):tr('Phát','Play'));
 text('truth-value',`A: ${point(f.physical)}`);text('reported-value',`A′: ${point(f.claimed)}`);text('observed-value',f.last?`${point(f.last.claimed)} · ${tr('tuổi tiếp nhận','reception age')} ${f.age.toFixed(2)} s`:tr('Chưa nhận bản tin','No message received'));
 const lines=[`${tr('Độ lệch đang áp dụng','Applied offset')}: ${active(config,time)?point({x:config.dx,y:config.dy}):'(0, 0) m'}`,`${tr('Xe nhận B','Receiver B')}: ${point(f.receiver)}`];
 if(f.displacement){const d=f.displacement;lines.push(`Δp = ${point(d.physical)}; Δp′ = ${point(d.claimed)}`);lines.push(d.sameOffset?tr('Cùng đoạn: độ lệch triệt tiêu trong sai phân.','Same segment: offset cancels in position differences.'):tr('Biên bật/tắt: sai phân chứa bước nhảy độ lệch.','Onset/termination: differences include an offset jump.'));}else lines.push(tr('Cần hai bản tin đã phát để so sánh sai phân.','Two sent messages are needed to compare differences.'));
 $('checks').replaceChildren(...lines.map(line=>{const p=document.createElement('p');p.className='checks-row';p.textContent=line;return p;}));
 text('counts',`${tr('Đã phát','Sent')}: ${f.sent.length} · ${tr('Đã nhận','Received')}: ${f.received.length}`);
 $('messages').replaceChildren(...f.sent.slice(-6).reverse().map(m=>{const row=document.createElement('tr'),arrived=m.received!==null&&m.received<=time;const state=m.received===null?tr('Bỏ theo cấu hình','Omitted by configuration'):arrived?tr('Đã nhận','Received'):tr('Đang chờ','Pending');for(const value of [m.id,m.sent.toFixed(2),arrived?m.received.toFixed(2):'—',state]){const cell=document.createElement('td');cell.textContent=value;row.appendChild(cell);}return row;}));
 for(const render of views)render(f);
}
translate();fill();
try{views=[createView('truth',0x67e8c3),createView('reported',0xffc477),createView('observed',0xffc477)];}catch{for(const el of document.querySelectorAll('.viewport'))el.replaceChildren();text('render-status','WebGL unavailable. Coordinate readouts and message exploration remain usable.');}
draw();
function tick(now){if(playing){if(lastTick!==null)time=Math.min(config.duration,time+Math.min((now-lastTick)/1000,0.1));if(time>=config.duration)playing=false;draw();}lastTick=now;requestAnimationFrame(tick);}
requestAnimationFrame(tick);
