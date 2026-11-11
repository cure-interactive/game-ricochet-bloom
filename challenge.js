import { buildValidate } from './skill-effect.js?v=495e5208ab85e2d73bf805e158844c6d848b4a0ccfeb2f2d9d50cd589ab4379c';
import { RULE, gameCreate } from './engine.js?v=56b76ef371ce8d9857fad17229b62f6ad346ac3b95774147bc024b9b3cf4d11e';
import { trackGet, trackEnvironment } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { POPULATIONS } from './run.js?v=691097a9072d6b323d2b1de0403ed23963100ce0658bc16878767f8b325faa9f';

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
