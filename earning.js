// Cumulative, versioned play receipts. A snapshot replaces the same session's
// receipt, so restoring an older pool cannot pay for the same play twice.
export const PLAY_REWARD = Object.freeze({ contacts: 6, bloom: 1, wave: 2, win: 3 });
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const modes=['free','waves','challenge','song-run'];
export const earningAmount=e=>Math.floor(e.contacts/PLAY_REWARD.contacts)+e.blooms*PLAY_REWARD.bloom+e.waves*PLAY_REWARD.wave+e.wins*PLAY_REWARD.win;
export function earningValid(e,powers){
  const list=a=>Array.isArray(a)&&new Set(a).size===a.length&&a.every(p=>powers.includes(p));
  return !!e&&e.version===1&&typeof e.id==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(e.id)&&['normal','development'].includes(e.kind)&&modes.includes(e.mode)&&
    ['contacts','blooms','waves','wins','shots','lastLaunch'].every(k=>integer(e[k]))&&e.contacts<=e.shots*20&&e.blooms<=e.shots&&e.waves<=e.shots&&e.wins<=1&&
    (e.mode==='waves'||e.waves===0)&&(e.mode==='challenge'||e.wins===0)&&list(e.owned)&&list(e.used)&&e.used.every(p=>e.owned.includes(p))&&
    !!e.mastery&&typeof e.mastery==='object'&&!Array.isArray(e.mastery)&&Object.entries(e.mastery).every(([p,n])=>powers.includes(p)&&integer(n)&&n<=e.shots)&&integer(earningAmount(e));
}
export function earningPrepare(game,kind,owned,id){
  if(game.isFlying)return;
  if(!game.earning||game.earning.kind!==kind||game.earning.mode!==game.mode)game.earning={version:1,id,kind,mode:game.mode,contacts:0,blooms:0,waves:0,wins:0,shots:0,lastLaunch:game.launches,mastery:{},owned:[],used:[]};
  game.earning.owned=[...owned];game.earning.used=[];
}
export function earningPower(game,power){
  const e=game.earning;if(e&&e.owned.includes(power)&&!e.used.includes(power))e.used.push(power);
}
export function earningSettle(game,{wave=false,win=false}={}){
  const e=game.earning;if(!e||e.lastLaunch>=game.launches)return;
  e.lastLaunch=game.launches;e.shots++;e.contacts+=game.chain.length;
  if(game.chain.length>=5)e.blooms++;
  if(wave)e.waves++;if(win)e.wins++;
  if(game.chain.length>=3)for(const power of e.used)e.mastery[power]=(e.mastery[power]||0)+1;
  e.used=[];
}
export function earningSnapshot(e){
  // Flight bookkeeping is not part of the durable paid receipt.
  const {version,id,kind,mode,contacts,blooms,waves,wins,shots,mastery}=e;
  return {version,id,kind,mode,contacts,blooms,waves,wins,shots,mastery:{...mastery}};
}
