// Authored educational model, not CAM/BSM encoding or detector evaluation.
export const example=Object.freeze({schemaVersion:1,kind:'v2x-two-worlds-lesson',title:'Hai thế giới. Cùng một bản tin.',objective:'Phân biệt vị trí thật với thông tin xe nhận được.',question:'Chỉ từ các tin vị trí này, B có phân biệt được thế giới nào báo sai không?',offset:8,speed:3,explanation:'Chưa đủ thông tin. Hai thế giới gửi cùng vị trí vào cùng thời điểm. Muốn xác nhận vị trí thật, B cần thêm bằng chứng độc lập.'});
export function validateLesson(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Bài học phải là một đối tượng JSON.');
 const keys=Object.keys(example);
 if(Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw Error('Bài học có trường thiếu hoặc không được hỗ trợ.');
 if(input.schemaVersion!==1||input.kind!==example.kind)throw Error('Phiên bản bài học chưa được hỗ trợ.');
 for(const [key,max] of [['title',100],['objective',240],['question',300],['explanation',800]])if(typeof input[key]!=='string'||!input[key].trim()||input[key].length>max)throw Error(`Nội dung ${key} trống hoặc quá dài.`);
 if(!Number.isFinite(input.offset)||input.offset<2||input.offset>16)throw Error('Độ lệch phải từ 2 đến 16 mét.');
 if(!Number.isFinite(input.speed)||input.speed<1||input.speed>5)throw Error('Tốc độ phải từ 1 đến 5 m/s.');
 return Object.fromEntries(keys.map(k=>[k,input[k]]));
}
export function lessonFrame(input,time){
 const lesson=validateLesson(input);
 if(!Number.isInteger(time)||time<0||time>5)throw Error('Mốc thời gian phải là số nguyên từ 0 đến 5.');
 const messages=Array.from({length:time+1},(_,t)=>({id:`lesson-${t}`,sent:t,received:t,x:4+lesson.speed*t,y:0}));
 const reported=messages.at(-1).x;
 return {time,worlds:[{truth:reported,reported,messages:messages.map(m=>({...m}))},{truth:reported-lesson.offset,reported,messages:messages.map(m=>({...m}))}],delta:time>0?lesson.speed:null};
}
