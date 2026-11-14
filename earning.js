// Cumulative, versioned play receipts. A snapshot replaces the same session's
// receipt, so restoring an older pool cannot pay for the same play twice.
export const PLAY_REWARD = Object.freeze({ contacts: 6, bloom: 1, wave: 2, win: 3 });
export const BONUS_TIERS = 5;
// Reward version 2: one bounded action award per productive settled shot.
// Rates are tuned offline; neither elapsed time nor frame count enters payment.
export const SHOT_POINTS = Object.freeze({free:5,waves:5,challenge:5,'song-run':5,'score-attack':5,reaction:3,cargo:3,outbreak:3,capture:4,precision:4,music:4});
export function earningId(crypto=globalThis.crypto){
  return crypto?.randomUUID?.()||`play-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const modes=['free','waves','challenge','song-run','reaction','cargo','outbreak','capture','precision','music','score-attack'];
const legacyAmount=e=>Math.floor(e.contacts/PLAY_REWARD.contacts)+e.blooms*PLAY_REWARD.bloom+e.waves*PLAY_REWARD.wave+e.wins*PLAY_REWARD.win+(e.bonusPoints??0);
export const earningAmount=e=>e.version===1?legacyAmount(e):(e.legacy?legacyAmount(e.legacy):0)+e.productiveShots*SHOT_POINTS[e.mode]+(e.bonusPoints??0)-(e.legacy?.bonusPoints??0);
export function earningUpgrade(e){
  if(e.version!==1)return;
  const {contacts,blooms,waves,wins,shots,bonusPoints=0}=e;
  e.legacy={contacts,blooms,waves,wins,shots,bonusPoints};e.productiveShots=0;e.version=2;
}
function economyValid(e){
  if(e.version===1)return e.productiveShots===undefined&&e.legacy===undefined;
  if(e.version!==2||!integer(e.productiveShots))return false;
  const old=e.legacy;
  if(old&&(!['contacts','blooms','waves','wins','shots','bonusPoints'].every(k=>integer(old[k])&&old[k]<=(e[k]??0))||old.contacts>old.shots*20||old.blooms>old.shots||old.waves>old.shots||old.wins>1||old.bonusPoints>old.shots*BONUS_TIERS))return false;
  return e.productiveShots<=e.shots-(old?.shots??0);
}
export function earningValid(e,powers){
  const list=a=>Array.isArray(a)&&new Set(a).size===a.length&&a.every(p=>powers.includes(p));
  return !!e&&economyValid(e)&&typeof e.id==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(e.id)&&['normal','development'].includes(e.kind)&&modes.includes(e.mode)&&
    ['contacts','blooms','waves','wins','shots','lastLaunch'].every(k=>integer(e[k]))&&e.contacts<=e.shots*20&&e.blooms<=e.shots&&e.waves<=e.shots&&e.wins<=1&&integer(e.bonusPoints??0)&&(e.bonusPoints??0)<=e.shots*BONUS_TIERS&&
    (e.mode==='waves'||e.waves===0)&&(['challenge','reaction','cargo','outbreak','capture','precision','music'].includes(e.mode)||e.wins===0)&&list(e.owned)&&list(e.used)&&e.used.every(p=>e.owned.includes(p))&&
    !!e.mastery&&typeof e.mastery==='object'&&!Array.isArray(e.mastery)&&Object.entries(e.mastery).every(([p,n])=>powers.includes(p)&&integer(n)&&n<=e.shots)&&integer(earningAmount(e));
}
export function earningPrepare(game,kind,owned,id){
  if(game.isFlying)return;
  if(!game.earning||game.earning.kind!==kind||game.earning.mode!==game.mode)game.earning={version:2,productiveShots:0,id,kind,mode:game.mode,contacts:0,blooms:0,waves:0,wins:0,shots:0,lastLaunch:game.launches,mastery:{},owned:[],used:[]};
  earningUpgrade(game.earning);
  game.earning.owned=[...owned];game.earning.used=[];
}
export function earningPower(game,power){
  const e=game.earning;if(e&&e.owned.includes(power)&&!e.used.includes(power))e.used.push(power);
}
export function earningSettle(game,{wave=false,win=false,bonus=0}={}){
  if(!integer(bonus)||bonus>BONUS_TIERS)throw new RangeError('Invalid bonus difficulty');
  const e=game.earning;if(!e||e.lastLaunch>=game.launches)return;
  earningUpgrade(e);
  if(game.chain.length||win)e.productiveShots++;
  e.lastLaunch=game.launches;e.shots++;e.contacts+=game.chain.length;
  if(game.chain.length>=5)e.blooms++;
  if(wave)e.waves++;if(win)e.wins++;
  if(bonus)e.bonusPoints=(e.bonusPoints??0)+bonus;
  if(game.chain.length>=3)for(const power of e.used)e.mastery[power]=(e.mastery[power]||0)+1;
  e.used=[];
}
export function earningSnapshot(e){
  // Flight bookkeeping is not part of the durable paid receipt.
  const {version,id,kind,mode,contacts,blooms,waves,wins,shots,mastery}=e;
  return {version,id,kind,mode,contacts,blooms,waves,wins,shots,mastery:{...mastery},...(e.bonusPoints!==undefined?{bonusPoints:e.bonusPoints}:{}),...(version===2?{productiveShots:e.productiveShots,...(e.legacy?{legacy:{...e.legacy}}:{})}:{})};
}
