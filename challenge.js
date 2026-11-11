import { buildValidate } from './skill-effect.js?v=ee4e0aab147bf42dd5cbe6eb6c4450e4a99b71bb2da4265306038ebfe050a29d';
import { RULE, gameCreate } from './engine.js?v=ff1b90cebfd24e6845e51dc92c4a434e7460b271df6473d5ee0164d71af79298';
import { trackGet, trackEnvironment } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { POPULATIONS } from './run.js?v=57215a5e8d761cdc20cd25f1333df0c2d173218df8777b3ad24b35f24e38928c';

// A code describes initial conditions, not a verified score or a global ranking.
export function challengeValidate(value) {
  if(!value||value.version!==1||value.rules!==RULE.version||!trackGet(value.track)||typeof value.seed!=='string'||!/^[A-Za-z0-9_-]{1,24}$/.test(value.seed)||typeof value.relaxed!=='boolean'||!buildValidate(value.build)||!Array.isArray(value.routes)||value.routes.length!==5||value.routes.some(n=>![0,1].includes(n)))return null;
  const tuning=value.build.reduce((n,p)=>n+Number(p.foundation)+p.variants.length+Number(p.capstone)*2,0);
  if(tuning>10)return null;
  return {version:1,rules:RULE.version,track:value.track,seed:value.seed,relaxed:value.relaxed,build:structuredClone(value.build),routes:[...value.routes]};
}
export function challengeEncode(value){const code=challengeValidate(value);if(!code)throw new TypeError('Invalid challenge');return 'RB1.'+btoa(JSON.stringify(code)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
export function challengeDecode(text){try{if(typeof text!=='string'||text.length>4096||!/^RB1\.[\w-]+$/.test(text.trim()))return null;return challengeValidate(JSON.parse(atob(text.trim().slice(4).replaceAll('-','+').replaceAll('_','/'))));}catch{return null;}}
export function challengePool(code,pool=0){const c=challengeValidate(code);if(!c||!Number.isInteger(pool)||pool<0||pool>4)throw new TypeError('Invalid challenge pool');return gameCreate(`${c.seed}-${pool}-${c.routes[pool]}`,'song-run',{build:c.build,population:POPULATIONS[pool],relaxed:c.relaxed,environment:trackEnvironment(c.track,pool,c.routes[pool])});}
