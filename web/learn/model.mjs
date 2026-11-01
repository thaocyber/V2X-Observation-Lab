// Authored educational model, not CAM/BSM encoding or detector evaluation.
export const example=Object.freeze({schemaVersion:1,kind:'v2x-two-worlds-lesson',title:'Two worlds. Identical messages.',objective:'Distinguish true position from the information a receiver gets.',question:'Can B tell which world reports an incorrect position from these messages alone?',offset:8,speed:3,explanation:'There is not enough information. Both worlds send identical positions at identical times. B needs independent evidence to confirm the true position.'});
export function validateLesson(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('The lesson must be a JSON object.');
 const keys=Object.keys(example);
 if(Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw Error('The lesson has missing or unsupported fields.');
 if(input.schemaVersion!==1||input.kind!==example.kind)throw Error('Unsupported lesson version.');
 for(const [key,max] of [['title',100],['objective',240],['question',300],['explanation',800]])if(typeof input[key]!=='string'||!input[key].trim()||input[key].length>max)throw Error(`Field ${key} is empty or too long.`);
 if(!Number.isFinite(input.offset)||input.offset<2||input.offset>16)throw Error('Offset must be between 2 and 16 metres.');
 if(!Number.isFinite(input.speed)||input.speed<1||input.speed>5)throw Error('Speed must be between 1 and 5 m/s.');
 return Object.fromEntries(keys.map(k=>[k,input[k]]));
}
export function lessonFrame(input,time){
 const lesson=validateLesson(input);
 if(!Number.isInteger(time)||time<0||time>5)throw Error('Time must be an integer from 0 to 5.');
 const messages=Array.from({length:time+1},(_,t)=>({id:`lesson-${t}`,sent:t,received:t,x:4+lesson.speed*t,y:0}));
 const reported=messages.at(-1).x;
 return {time,worlds:[{truth:reported,reported,messages:messages.map(m=>({...m}))},{truth:reported-lesson.offset,reported,messages:messages.map(m=>({...m}))}],delta:time>0?lesson.speed:null};
}
