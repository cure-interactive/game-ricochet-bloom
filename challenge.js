import { buildValidate } from './skill-effect.js?v=6783470d52e0982bd5d187dc8b0d26a9815b787acc3c581f5c2bd0321ccc393d';
import { RULE, gameCreate } from './engine.js?v=ee2ad99d5c6262d550458a805ece6f85e3ed035e8547beb369aa6a1128985f22';
import { trackGet, trackEnvironment } from './track.js?v=57009a338150b0399594597f6a834d703dafefeb8088046d9e587aa1896fb5ed';
import { POPULATIONS } from './run.js?v=4a6b36c1f1f885e0e63739e7ebfec31ec2f164543efa29e2eada2632f613b604';

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
