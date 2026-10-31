import {example,validateLesson,lessonFrame} from './model.mjs';
const $=id=>document.getElementById(id);
let lesson={...example},time=0,revealed=false,selected=null;
const number=n=>Number(n.toFixed(2)).toString();
const fields={title:'title',objective:'goal',question:'question',offset:'offset',speed:'speed',explanation:'explanation'};
function fill(){for(const [k,id] of Object.entries(fields))$(id).value=lesson[k];$('dirty').textContent='';}
function reset(){time=0;revealed=false;selected=null;render();}
function svgWorld(id,w,index){
 // Shared fixed metres-to-pixels mapping; same reported position always aligns.
 const x=p=>34+(p+16)*8.5,truth=x(w.truth),reported=x(w.reported);
 const marks=[-16,-8,0,8,16,24,32].map(v=>`<path d="M${x(v)} 164v6" stroke="#73899b"/><text class="axis-label" x="${x(v)}" y="189" text-anchor="middle">${v}</text>`).join('');
 $(id).innerHTML=`<title>Thế giới ${index+1}: ${revealed?'vị trí thật '+number(w.truth)+' mét; ':''}vị trí báo ${number(w.reported)} mét</title><rect x="16" y="83" width="448" height="63" rx="10" fill="#243a4b"/><path d="M16 115H464" stroke="#6b8292" stroke-dasharray="12 10"/><path d="M20 164H464" stroke="#73899b"/>${marks}<text class="axis-label" x="459" y="210" text-anchor="end">X (m) · cùng trục đường</text><circle cx="${reported}" cy="115" r="17" fill="#132332" stroke="#ffc477" stroke-width="3"/><path d="M${reported-9} 115h18M${reported} 106v18" stroke="#ffc477" stroke-width="2"/><text x="${reported}" y="57" text-anchor="middle">Vị trí báo</text>${revealed?`<path d="M${truth} 78V69H${reported}V78" fill="none" stroke="#c4d7e2"/><text x="${(truth+reported)/2}" y="29" text-anchor="middle">Lệch ${number(w.reported-w.truth)} m</text><rect x="${truth-17}" y="103" width="34" height="24" rx="6" fill="#67e8c3"/><rect x="${truth+6}" y="107" width="7" height="16" rx="2" fill="#12303b"/><text x="${truth}" y="157" text-anchor="middle" style="fill:#67e8c3">Xe thật</text>`:''}`;
}
function render(){
 const f=lessonFrame(lesson,time);
 $('lesson-title').textContent=lesson.title;$('objective').textContent=lesson.objective;$('question-heading').textContent=lesson.question;
 $('time').textContent=`${time} s`;$('phase').textContent=revealed?'02 / MỞ SỰ THẬT ĐỂ ĐỐI CHIẾU':'01 / CHỈ NHÌN TIN B NHẬN';
 f.worlds.forEach((w,i)=>{svgWorld(`world-${i+1}`,w,i);$(`packet-${i+1}`).textContent=`x = ${number(w.reported)} m · gửi ${time} s · nhận ${time} s`;$(`result-${i+1}`).textContent=revealed?(i===0?'Báo đúng vị trí':'Báo lệch '+number(lesson.offset)+' m'):'Chưa mở sự thật';});
 $('comparison').textContent=time===0?'Hai tin giống nhau.':'Cả hai chuỗi tin cùng tăng '+number(lesson.speed)+' m mỗi giây.';
 $('prev').disabled=time===0;$('next').disabled=time===5;$('solution').hidden=!revealed;$('reveal').hidden=revealed;
 $('mechanism').textContent=`Thế giới 1 báo đúng. Thế giới 2 báo lệch ${number(lesson.offset)} m. Cả hai vẫn gửi đúng cùng chuỗi tin vị trí tới B; chuỗi tin đang xem không phân biệt được chúng.`;
 $('author-explanation').textContent=lesson.explanation;
 $('answer').textContent=selected===null?'Chọn một câu trả lời, hoặc mở sự thật để khám phá.':selected==='unknown'?'Đúng với mô hình này: chuỗi tin chưa đủ để phân biệt.':'Chưa thể kết luận chỉ từ tin B nhận. Hãy mở vị trí thật để đối chiếu.';
 for(const b of document.querySelectorAll('[data-answer]'))b.setAttribute('aria-pressed',String(b.dataset.answer===selected));
 $('messages').replaceChildren(...f.worlds[0].messages.map(m=>{const tr=document.createElement('tr');for(const value of [m.id,m.sent,m.received,m.x,m.y]){const td=document.createElement('td');td.textContent=value;tr.append(td);}return tr;}));
}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('fresh').onclick=reset;$('prev').onclick=()=>{time--;render();};$('next').onclick=()=>{time++;render();};
$('reveal').onclick=()=>{revealed=true;render();};$('hide').onclick=()=>{revealed=false;render();};
$('edit').onclick=()=>{$('editor').open=true;$('editor').scrollIntoView({block:'start'});$('title').focus();};
for(const b of document.querySelectorAll('[data-answer]'))b.onclick=()=>{selected=b.dataset.answer;render();};
$('lesson-form').oninput=()=>{$('dirty').textContent='Chưa áp dụng: bài đang học và tệp xuất vẫn dùng cấu hình cũ.';};
$('lesson-form').onsubmit=e=>{e.preventDefault();try{const next={...lesson};for(const [key,id] of Object.entries(fields))next[key]=['offset','speed'].includes(key)?Number($(id).value):$(id).value;lesson=validateLesson(next);fill();reset();$('editor').open=false;$('error').textContent='';$('status').textContent='Đã áp dụng bài học. Có thể tải JSON để chia sẻ.';}catch(e){$('error').textContent=e.message;}};
$('export').onclick=()=>download('v2x-lesson.json',lesson);
$('evidence-export').onclick=()=>download('v2x-lesson-evidence.json',{kind:'v2x-lesson-evidence',schemaVersion:1,lesson,currentTime:time,frame:lessonFrame(lesson,time),scope:'Synthetic position-message fields only; ground truth is not receiver input.'});
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>16384)throw Error('Tệp bài học phải nhỏ hơn 16 KiB.');const next=validateLesson(JSON.parse(await file.text()));lesson=next;fill();reset();$('error').textContent='';$('status').textContent='Đã mở bài học. Bắt đầu ở giây 0, chưa mở vị trí thật.';}catch(err){$('error').textContent='Không mở được bài học: '+err.message;}finally{e.target.value='';}};
fill();render();
