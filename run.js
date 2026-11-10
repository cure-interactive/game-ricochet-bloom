import { catalogueCreate, STARTERS } from './catalogue.js?v=aa050901096f931303aa6d503b3253d402031f95163433b0c8cb1c5dbbe54371';
import { POWER_TREES } from './power-tree.js?v=5b9b9d757691fc9af4ff737a750704704af52db425b7ea2bac25894089f8e387';
import { profileCreate, profileValidate, profilePurchase, profileRefund, profileRefundPreview, profileReward, profileCurrencyGrant, loadoutResolve } from './profile.js?v=c703912292f7bab5f657f5c89991fda053a00d41848a6b0f92c3f14a35c56421';
import { gameCreate, saveValidate } from './engine.js?v=3866c817d261df98d09b8f4b537d91c3b9b0498907e606f8585acde8f0ddd411';
import { jellyRole, musicCreate } from './music.js?v=6ec72be4ad2664d5ad3ccad3e38ced59061c476e0fa523cde850ae21caa7b261';

// Shipping capability declaration. The disposable preview never supplies physics flags.
export const GAME_CATALOGUE=catalogueCreate(Object.keys(POWER_TREES).flatMap(p=>['base','foundation','a','b','capstone'].map(k=>p+'.'+k)));
export const POOL_NAMES=['Intro','Verse','Build','Bridge','Finale'];
export const POPULATIONS=[12,14,16,14,18];
export const GOALS=['Make one bloom','Bloom + all three musical roles','Make two blooms','Bloom after banking off a wall','Two blooms + all three roles'];
export function progressionCreate(kind='normal') {return {version:1,profile:profileCreate(kind),powers:[...STARTERS],equipped:['comet.foundation','ripple.foundation'],borrowed:['comet.foundation','ripple.foundation'],phase:'shop',pool:0,attempt:0,relaxed:false,bypass:false,run:null};}
export const progressionBudget=s=>s.phase==='shop'?2:Math.min(10,2+s.pool*2+(s.phase==='interlude'?2:0));
export const progressionLoadout=s=>loadoutResolve(s.profile,s,progressionBudget(s),GAME_CATALOGUE,{ignoreBudget:s.bypass});
export const progressionRefundPreview=(s,id)=>profileRefundPreview(s.profile,id,GAME_CATALOGUE);
function tidy(s){s.borrowed=s.borrowed.filter(id=>!s.profile.research[id]&&s.powers.includes(GAME_CATALOGUE.nodes[id].power));s.equipped=s.equipped.filter(id=>(s.profile.research[id]||s.borrowed.includes(id))&&s.powers.includes(GAME_CATALOGUE.nodes[id].power));while(!progressionLoadout(s).ok&&s.equipped.length)s.equipped.pop();}
export function progressionValidate(input,kind='normal') {
  if(!input||input.version!==1||!['shop','run','interlude'].includes(input.phase)||!Number.isSafeInteger(input.attempt)||input.attempt<0||!Number.isInteger(input.pool)||input.pool<0||input.pool>4||typeof input.relaxed!=='boolean'||typeof input.bypass!=='boolean'||input.bypass&&kind!=='development')return null;
  const s=structuredClone(input);s.profile=profileValidate(s.profile,GAME_CATALOGUE,kind);if(!s.profile||!progressionLoadout(s).ok)return null;
  if(s.phase==='shop'){if(s.run!==null||s.pool!==0)return null;}
  else {
    const r=s.run;if(!r||typeof r.id!=='string'||r.id!==`run-${s.attempt}`||typeof r.seed!=='string'||!Array.isArray(r.roles)||new Set(r.roles).size!==r.roles.length||r.roles.some(x=>!['melody','bass','rhythm'].includes(x))||!Array.isArray(r.activated)||new Set(r.activated).size!==r.activated.length||r.activated.some(x=>!s.powers.includes(x))||typeof r.bankBloom!=='boolean')return null;
    r.game=saveValidate(r.game);if(!r.game||r.game.mode!=='song-run'||r.game.bodies.length!==POPULATIONS[s.pool]+1||JSON.stringify(r.game.build)!==JSON.stringify(progressionLoadout(s).powers))return null;
    if(r.music!==null){r.music=musicCreate(r.music,r.music.blooms);}
  }
  return s;
}
function poolCreate(s,music=null){const build=progressionLoadout(s).powers;s.run={id:`run-${s.attempt}`,seed:s.run?.seed||`DAWN-${s.attempt}`,roles:[],activated:[],bankBloom:false,music,game:gameCreate(`${s.run?.seed||'DAWN-'+s.attempt}-${s.pool}`,'song-run',{build,population:POPULATIONS[s.pool],relaxed:s.relaxed})};s.phase='run';}
function reward(s,event){const result=profileReward(s.profile,{mode:'song-run',runId:s.run?.id,trackId:'first-light',poolCount:5,...event},GAME_CATALOGUE);if(!result.ok)throw new Error(result.reason);s.profile=result.profile;return result.receipt?.amount||0;}
function finish(s){s.phase='shop';s.pool=0;s.run=null;s.borrowed=[];tidy(s);}
export function progressionAct(input,action){
  const s=progressionValidate(input,input.profile?.kind);if(!s)return {ok:false,reason:'Invalid saved progression.'};
  const cat=GAME_CATALOGUE,node=cat.nodes[action.id];let r,message='Updated.';
  const fail=reason=>({ok:false,reason});
  if(s.phase==='run'&&!['abandon'].includes(action.type))return fail('Finish this pool before changing your build.');
  switch(action.type){
    case 'buy':case 'refund':
      if(s.phase!=='shop')return fail('Research is between runs.');
      r=action.type==='buy'?profilePurchase(s.profile,action.id,cat):profileRefund(s.profile,action.id,cat,action.revision);if(!r.ok)return r;s.profile=r.profile;
      s.powers=s.powers.filter(p=>s.profile.research[p+'.base']);for(const p of STARTERS)if(s.powers.length<3&&!s.powers.includes(p))s.powers.push(p);tidy(s);message=action.type==='buy'?`Researched ${node.name}.`:`Returned ${r.refunded} Seeds.`;break;
    case 'replace':
      if(s.phase!=='shop'||!s.profile.research[action.power+'.base']||!Number.isInteger(action.slot)||action.slot<0||action.slot>2||s.powers.includes(action.power))return fail('Choose an owned power and a different loadout slot.');s.powers[action.slot]=action.power;tidy(s);break;
    case 'borrow':
      if(!node||node.kind==='base'||!s.powers.includes(node.power)||s.profile.research[action.id])return fail('Choose an unowned upgrade for your loadout.');
      if(s.borrowed.includes(action.id)){if(s.phase!=='shop')return fail('Discoveries stay until this run ends.');s.borrowed=s.borrowed.filter(id=>id!==action.id);tidy(s);break;}
      if(node.kind==='capstone'&&(s.phase==='shop'||s.pool<2))return fail('Epic discoveries open after Build.');
      if(s.borrowed.length>=2+s.pool+(s.phase==='interlude'?1:0))return fail('No discovery slots left.');s.borrowed.push(action.id);message='Borrowed for this run. Equip it to activate its effect.';break;
    case 'equip':
      if(!node||node.kind==='base')return fail('Select an upgrade.');s.equipped=s.equipped.includes(action.id)?s.equipped.filter(x=>x!==action.id):[...s.equipped,action.id];r=progressionLoadout(s);if(!r.ok)return r;break;
    case 'relaxed':if(s.phase!=='shop')return fail('Choose pace before a run.');s.relaxed=!s.relaxed;break;
    case 'start':if(s.phase!=='shop')return fail('A run already exists.');s.attempt++;poolCreate(s);message='First Light Â· Intro';break;
    case 'continue':if(s.phase!=='interlude')return fail('Clear this pool first.');{const music=s.run.music;s.pool++;poolCreate(s,music);message=POOL_NAMES[s.pool];}break;
    case 'abandon':if(!s.run)return fail('No active run.');reward(s,{type:'failure',poolIndex:s.pool+(s.phase==='interlude'?1:0),blooms:0,abandoned:true});finish(s);message='Run ended. Earned Seeds and research remain.';break;
    case 'grant':r=profileCurrencyGrant(s.profile,'seeds',action.amount,cat);if(!r.ok)return r;s.profile=r.profile;message=`Added ${action.amount} development Seeds.`;break;
    case 'max':if(s.profile.kind!=='development')return fail('Development only.');for(const id of Object.keys(cat.nodes))s.profile.research[id]??={paid:0};s.profile.revision++;s.bypass=true;s.equipped=s.powers.flatMap(p=>['foundation','a',...(POWER_TREES[p].compatible?['b']:[]),'capstone'].map(k=>p+'.'+k));s.borrowed=[];message='All powers unlocked. Equipped powers maxed with tuning limit off.';break;
    case 'bypass':if(s.profile.kind!=='development')return fail('Development only.');s.bypass=!s.bypass;tidy(s);break;
    default:return fail('Unknown progression action.');
  }
  // Interlude equipment is applied when entering the next pool, not to old physics.
  if(s.phase==='interlude')s.run.game.build=progressionLoadout(s).powers;
  return {ok:true,state:s,message};
}
export function poolGoalMet(s){const r=s.run;if(!r)return false;const blooms=r.game.blooms,roles=r.roles.length===3;return s.pool===0?blooms>=1:s.pool===1?blooms>=1&&roles:s.pool===2?blooms>=2:s.pool===3?r.bankBloom:blooms>=2&&roles;}
export function progressionObserve(input,game,events,music=null){
  if(input.phase!=='run')return {state:input,message:null};
  const s=structuredClone(input),r=s.run;r.game=structuredClone(game);r.music=music;
  for(const e of events){if(e.type==='note'&&!r.roles.includes(jellyRole(e.id)))r.roles.push(jellyRole(e.id));if(e.type==='power'&&s.powers.includes(e.kind)&&!r.activated.includes(e.kind))r.activated.push(e.kind);if(e.type==='bloom'&&e.banks>0)r.bankBloom=true;}
  // Engine bloom events carry bank count; no wall teleport can satisfy this.
  let message=null,outcome=null;
  if(events.some(e=>['rest','over','win'].includes(e.type))){
    if(poolGoalMet(s)){
      let earned=reward(s,{type:'pool',poolIndex:s.pool,activated:r.activated,bonus:r.game.objective.completed>0});
      if(s.pool===4){earned+=reward(s,{type:'victory'});finish(s);outcome='victory';message=`First Light complete Â· +${earned} Seeds`;}else{s.phase='interlude';outcome='clear';message=`${POOL_NAMES[s.pool]} complete Â· +${earned} Seeds`;}
    }else if(game.isOver){const earned=reward(s,{type:'failure',poolIndex:s.pool,blooms:game.blooms,abandoned:false});finish(s);outcome='failure';message=`Run ended Â· +${earned} Seeds. Your research remains.`;}
  }
  return {state:s,message,outcome};
}
