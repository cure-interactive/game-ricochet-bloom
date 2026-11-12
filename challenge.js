import { buildValidate } from './skill-effect.js?v=5ff4cafca9c6bb8adee62961b5c6e07969e5a02e614b94bac8b4873b068d1e23';
import { RULE, gameCreate } from './engine.js?v=53c12a3b8ec5b7bda0625a1e527cb498490b7df27796c02c3c3d133a93b14c7c';
import { trackGet, trackEnvironment } from './track.js?v=57009a338150b0399594597f6a834d703dafefeb8088046d9e587aa1896fb5ed';
import { POPULATIONS } from './run.js?v=6a19c662694ec547e86de13f3dce16b78524a1f4c32b95ee0a901850675bb8e3';

// A code describes initial conditions, not a verified score or a global ranking.
export function challengeValidate(value) {
  if(!value||![1,2].includes(value.version)||value.rules!==RULE.version||!trackGet(value.track)||typeof value.seed!=='string'||!/^[A-Za-z0-9_-]{1,24}$/.test(value.seed)||typeof value.relaxed!=='boolean'||!buildValidate(value.build)||!Array.isArray(value.routes)||value.routes.length!==5||value.routes.some(n=>![0,1].includes(n)))return null;
  const tuning=value.build.reduce((n,p)=>n+Number(p.foundation)+p.variants.length+Number(p.capstone)*2,0);
  if(value.version===1&&(tuning>10||value.build.length!==3))return null;
  return {version:value.version,rules:RULE.version,track:value.track,seed:value.seed,relaxed:value.relaxed,build:structuredClone(value.build),routes:[...value.routes]};
}
export function challengeEncode(value){const code=challengeValidate(value);if(!code)throw new TypeError('Invalid challenge');return 'RB'+code.version+'.'+btoa(JSON.stringify(code)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
export function challengeDecode(text){try{if(typeof text!=='string'||text.length>8192||!/^RB[12]\.[\w-]+$/.test(text.trim()))return null;const code=challengeValidate(JSON.parse(atob(text.trim().slice(4).replaceAll('-','+').replaceAll('_','/'))));return code&&Number(text.trim()[2])===code.version?code:null;}catch{return null;}}
export function challengePool(code,pool=0){const c=challengeValidate(code);if(!c||!Number.isInteger(pool)||pool<0||pool>4)throw new TypeError('Invalid challenge pool');return gameCreate(`${c.seed}-${pool}-${c.routes[pool]}`,'song-run',{build:c.build,randomPowers:c.version===2,population:POPULATIONS[pool],relaxed:c.relaxed,environment:trackEnvironment(c.track,pool,c.routes[pool])});}
