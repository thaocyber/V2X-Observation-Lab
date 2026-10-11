import {defaults} from './scenario.mjs';
export const presets=Object.freeze({
 baseline:Object.freeze({...defaults,dx:0,dy:0,delay:0,dropEvery:0}),
 offset:Object.freeze({...defaults,dx:8,dy:0,delay:0,dropEvery:0}),
 impaired:Object.freeze({...defaults,dx:8,dy:0,delay:1,dropEvery:3})
});
