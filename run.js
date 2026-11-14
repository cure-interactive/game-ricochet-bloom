import { buildValidate } from './skill-effect.js?v=b5d23aae0cfa214b54af02d69a6757f09caf11297ba245a50bf8b94dbdd4b93e';
import { catalogueCreate, catalogueNode, STARTERS } from './catalogue.js?v=b2330060a946840e4caf0bd604dd4001893829861e077d21e980d225f355dbf8';
import { POWER_TREES } from './power-tree.js?v=9fda938ef3e82ce596579a6bd292edca93bb30ccd3efb174b1a25b7d418fa895';
import { profileCreate, profileValidate, profilePurchase, profileReward, profileCurrencyGrant, profileSummary, loadoutResolve, unlockedResolve } from './profile.js?v=89e8220f13dad09da78c045746c499d1a094fcfef7517e021b1a49b6cea6dc7e';
import { gameCreate, saveValidate, RULE } from './engine.js?v=eba9789151dfd115dde6337ef3ba1ae79a36e123a8be36be33cc37bf33b1b121';
import { bubbleRole, musicCreate, musicRunSection } from './music.js?v=f7242d62cbdb10208c01d67fbb890f8a3feebd44c08971b2dc574fe5d49ea9fb';

import { TRACKS, trackGet, trackEnvironment } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';

export const GAME_CATALOGUE=catalogueCreate(Object.entries(POWER_TREES).flatMap(([power,tree])=>tree.nodes.map(node=>power+'.'+node.key)));
export const CAMPAIGN_NAME='Melody Journey';
export const POOL_NAMES=['Intro','Verse','Build','Bridge','Finale'];
export const POPULATIONS=[12,14,16,14,18];
export const GOALS=['Make one bloom','Bloom + all three musical roles','Make two blooms','Bloom after banking off a wall','Two blooms + all three roles'];
export const MEDALS={silverBonuses:3,goldBonuses:5,goldLaunches:20};
// All five tracks use the same targets for the same goal. Environmental
// difficulty changes the shot, not the meaning of its score or medal.
export const POOL_MEDALS=Object.freeze([
  [875,1100,1400], [875,1250,1600], [1750,2500,3500],
  [900,1250,1600], [1750,2750,4000]
].map(values=>Object.freeze(Object.fromEntries(['Bronze','Silver','Gold'].map((name,i)=>[name,values[i]])))));
export function poolMedal(pool,score){return ['Gold','Silver','Bronze'].find(name=>score>=POOL_MEDALS[pool]?.[name])||null;}
export function campaignPoolBest(s,track,pool){return (s.poolRecords||[]).find(r=>r.track===track&&r.pool===pool&&r.relaxed===s.relaxed)||null;}
export function campaignPoolAccess(state,pool) {
  const next=state.phase==='shop'?0:state.pool+(state.phase==='interlude'?1:0);
  const valid=Number.isInteger(pool)&&pool>=0&&pool<POOL_NAMES.length;
  const cleared=valid&&(campaignRestoration(state,state.track)>pool||state.phase!=='shop'&&pool<next);
  return {next,play:valid&&pool===next,cleared,replay:cleared};
}
export function campaignRestoration(state,track) {
  if(state.profile.kind==='development'&&state.developmentProgress)return 5;
  let pools=0;
  for(const {event} of state.profile.rewards)if(event.trackId===track){if(event.type==='victory')return 5;if(event.type==='pool')pools=Math.max(pools,event.poolIndex+1);}
  return Math.min(5,pools);
}
const unique=a=>Array.isArray(a)&&new Set(a).size===a.length;
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const seedValid=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,24}$/.test(s);
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
export function musicValid(m){return m===null||!!m&&m.version===4&&canonical(m)===canonical(musicCreate(m,m.blooms));}
export function progressionCreate(kind='normal') {
  return {version:1,powerMode:'unlocked',profile:profileCreate(kind),powers:[...STARTERS],equipped:[],borrowed:[],phase:'shop',pool:0,attempt:0,relaxed:false,bypass:false,run:null,track:'first-light',route:0,seed:'DAWN-1',records:[],poolRecords:[],latest:null,retry:null,skin:'original'};
}
export const progressionBudget=s=>s.phase==='shop'?2:Math.min(10,2+s.pool*2+(s.phase==='interlude'?2:0));
export const progressionLoadout=s=>s.powerMode==='unlocked'?unlockedResolve(s.profile,s,GAME_CATALOGUE):s.powerMode==='shared'?{ok:buildValidate(s.fixedBuild),tuning:0,powers:structuredClone(s.fixedBuild)}:loadoutResolve(s.profile,s,progressionBudget(s),GAME_CATALOGUE,{ignoreBudget:s.bypass});
function syncUnlocked(s){s.powerMode='unlocked';s.equipped=s.equipped.filter(id=>s.profile.research[id]||s.borrowed.includes(id));const resolved=progressionLoadout(s);if(!resolved.ok)return;s.powers=resolved.powers.map(p=>p.power);s.equipped=resolved.equipped;}
export const completedTracks=s=>s.profile.kind==='development'&&s.developmentProgress?TRACKS.map(t=>t.id):profileSummary(s.profile,GAME_CATALOGUE).completedTracks;
export const unlockedTracks=s=>{const complete=completedTracks(s);return TRACKS.filter((t,i)=>i===0||complete.includes(TRACKS[i-1].id));};
export function researchTarget(s,id=s.target) {
  const n=GAME_CATALOGUE.nodes[id];if(!n)return null;
  const owned=!!s.profile.research[id],mastery=profileSummary(s.profile,GAME_CATALOGUE).mastery[n.power],needs=[];
  if(!owned){
    const seeds=Math.max(0,n.seedCost-s.profile.wallet.seeds);if(seeds)needs.push(`${seeds} more Points`);
    for(const prerequisite of n.requires)if(!s.profile.research[prerequisite])needs.push(`Research ${GAME_CATALOGUE.nodes[prerequisite].name} first`);
    if(n.masteryPools>mastery)needs.push(`${n.masteryPools-mastery} more mastery uses of ${POWER_TREES[n.power].name}`);
  }
  return {id,name:n.name,owned,needs,text:owned?'Researched':needs.join(' · ')||'Ready to research'};
}
// Preview and commit use the same transaction. No loan or equipment changes leak on failure.
export function discoveryUse(input,id,remove=[]) {
  const s=progressionValidate(input,input.profile?.kind),node=catalogueNode(GAME_CATALOGUE,id);
  if(!s||s.phase!=='interlude'||s.run.discovered||!s.run.offers.includes(id)||!node||node.kind==='base')return {ok:false,reason:'Choose one of the saved discovery offers.'};
  if(!unique(remove)||remove.some(x=>!s.equipped.includes(x)))return {ok:false,reason:'Choose equipped upgrades to replace.'};
  s.borrowed.push(id);if(s.powerMode==='unlocked')remove=[...new Set([...remove,...node.conflicts.filter(x=>s.equipped.includes(x))])];s.equipped=s.equipped.filter(x=>!remove.includes(x));s.equipped.push(id);
  if(s.powerMode==='unlocked')syncUnlocked(s);
  const loadout=progressionLoadout(s);
  if(!loadout.ok)return {...loadout,reason:loadout.reason==='over-budget'?'Choose upgrades to replace until the discovery fits.':loadout.reason==='incompatible-upgrades'?'Choose the conflicting upgrade to replace.':loadout.reason};
  s.run.discovered=true;s.run.game.build=loadout.powers;
  return {ok:true,state:s,message:`${node.name} is active for the next pool.`};
}
function tidy(s){if(s.powerMode==='unlocked'){s.borrowed=s.borrowed.filter(id=>!s.profile.research[id]);syncUnlocked(s);return;}s.borrowed=s.borrowed.filter(id=>!s.profile.research[id]&&s.powers.includes(catalogueNode(GAME_CATALOGUE,id).power));s.equipped=s.equipped.filter(id=>(s.profile.research[id]||s.borrowed.includes(id))&&s.powers.includes(catalogueNode(GAME_CATALOGUE,id).power));while(!progressionLoadout(s).ok&&s.equipped.length)s.equipped.pop();}
function setupValid(r){return !!r&&seedValid(r.seed)&&!!trackGet(r.track)&&typeof r.relaxed==='boolean'&&unique(r.powers)&&r.powers.length>=1&&r.powers.length<=25&&r.powers.every(p=>!!GAME_CATALOGUE.powers[p])&&unique(r.equipped)&&unique(r.borrowed)&&[...r.equipped,...r.borrowed].every(id=>catalogueNode(GAME_CATALOGUE,id)?.kind!=='base'&&r.powers.includes(catalogueNode(GAME_CATALOGUE,id)?.power));}
function recordValid(r){return !!r&&typeof r.id==='string'&&/^run-[0-9]+$/.test(r.id)&&(r.outcome==='failure'?r.medal===null:['Bronze','Silver','Gold'].includes(r.medal))&&!!trackGet(r.track)&&seedValid(r.seed)&&['victory','failure'].includes(r.outcome)&&typeof r.relaxed==='boolean'&&integer(r.launches)&&integer(r.score)&&integer(r.bonuses)&&r.bonuses<=5&&integer(r.rules)&&['normal','development'].includes(r.kind)&&musicValid(r.music)&&buildValidate(r.build)&&Array.isArray(r.routes)&&r.routes.every(n=>[0,1].includes(n));}
export function progressionValidate(input,kind='normal') {
  if(!input||input.version!==1||!['shop','run','interlude'].includes(input.phase)||!integer(input.attempt)||!Number.isInteger(input.pool)||input.pool<0||input.pool>4||typeof input.relaxed!=='boolean'||typeof input.bypass!=='boolean'||input.bypass&&kind!=='development')return null;
  if(input.powerMode!==undefined&&!['unlocked','shared'].includes(input.powerMode)||input.developmentProgress!==undefined&&(kind!=='development'||typeof input.developmentProgress!=='boolean'))return null;
  const s=structuredClone(input);s.profile=profileValidate(s.profile,GAME_CATALOGUE,kind);if(!s.profile||!progressionLoadout(s).ok)return null;
  if(s.powerMode==='shared'&&(kind!=='development'||![1,2].includes(s.sharedVersion)||canonical(s.powers)!==canonical(s.fixedBuild.map(p=>p.power))))return null;
  if(s.powerMode==='unlocked'){const resolved=progressionLoadout(s);if(!unique(s.powers)||canonical([...s.powers].sort())!==canonical(resolved.powers.map(p=>p.power).sort()))return null;s.equipped=resolved.equipped;}
  s.target??=null;if(GAME_CATALOGUE.legacyNodes[s.target])s.target=GAME_CATALOGUE.legacyNodes[s.target].power+'.base';if(s.target!==null&&!GAME_CATALOGUE.nodes[s.target])return null;
  // Compatible addition of campaign fields to the original v2 preview envelope.
  s.track??='first-light';s.route??=0;s.seed??=`DAWN-${s.attempt||1}`;s.records??=[];s.latest??=null;s.retry??=null;s.skin??='original';
  // Historical track totals cannot reconstruct individual pool scores.
  s.poolRecords??=[];
  if(!Array.isArray(s.poolRecords)||s.poolRecords.length>50||!s.poolRecords.every(r=>r&&!!trackGet(r.track)&&Number.isInteger(r.pool)&&r.pool>=0&&r.pool<5&&typeof r.relaxed==='boolean'&&integer(r.score)&&integer(r.shots)&&r.shots<=9&&seedValid(r.seed))||!unique(s.poolRecords.map(r=>`${r.track}/${r.pool}/${r.relaxed}`)))return null;
  if(!trackGet(s.track)||!seedValid(s.seed)||![0,1].includes(s.route)||!Array.isArray(s.records)||s.records.length>500||!s.records.every(recordValid)||!unique(s.records.map(r=>r.id))||s.latest!==null&&!recordValid(s.latest)||s.skin!=='original'&&!trackGet(s.skin))return null;
  if(s.retry!==null&&!setupValid(s.retry))return null;
  if(s.phase==='shop'){if(s.run!==null||s.pool!==0)return null;}
  else {
    const r=s.run;if(!r||r.id!==`run-${s.attempt}`||!seedValid(r.seed)||!unique(r.roles)||r.roles.some(x=>!['melody','bass','rhythm'].includes(x))||!unique(r.activated)||r.activated.some(x=>!s.powers.includes(x))||typeof r.bankBloom!=='boolean')return null;
    r.track??=s.track;r.launches??=0;r.score??=0;r.bonuses??=0;r.routes??=[0];r.offers??=[];r.discovered??=false;r.initial??={seed:r.seed,track:s.track,relaxed:s.relaxed,powers:[...s.powers],equipped:[...s.equipped],borrowed:[...s.borrowed]};
    if(!setupValid(r.initial)||r.track!==s.track||![r.launches,r.score,r.bonuses].every(integer)||r.bonuses>5||!unique(r.offers)||r.offers.length>3||r.offers.some(id=>!catalogueNode(GAME_CATALOGUE,id)||!s.powers.includes(catalogueNode(GAME_CATALOGUE,id).power))||typeof r.discovered!=='boolean'||!Array.isArray(r.routes)||r.routes.length>5||r.routes.some(n=>![0,1].includes(n)))return null;
    r.game=saveValidate(r.game);if(!r.game||r.game.mode!=='song-run'||r.game.bodies.length!==POPULATIONS[s.pool]+1||!savedBuildMatches(s,r.game.build)||!musicValid(r.music))return null;
  }
  if(s.powerMode==='unlocked'&&s.run)s.run.offers=s.run.offers.filter(id=>!GAME_CATALOGUE.legacyNodes[id]);
  if(s.phase==='shop'&&!s.powerMode)syncUnlocked(s);
  return s;
}
function poolCreate(s,music=null){
  const previous=s.run,build=progressionLoadout(s).powers,seed=previous?.seed||s.seed;
  const environment=trackEnvironment(s.track,s.pool,s.route);
  const game=gameCreate(`${seed}-${s.pool}-${s.route}`,'song-run',{build,randomPowers:s.powerMode==='unlocked'||s.powerMode==='shared'&&s.sharedVersion===2,population:POPULATIONS[s.pool],relaxed:s.relaxed,environment});
  game.power.capacity=previous?.game.power.capacity||1;
  music=musicCreate(music,music?.blooms||0);musicRunSection(music,s.pool,s.track);
  s.run={id:`run-${s.attempt}`,seed,track:s.track,roles:[],activated:[],bankBloom:false,music,game,launches:previous?.launches||0,score:previous?.score||0,bonuses:previous?.bonuses||0,routes:[...(previous?.routes||[]),s.route],offers:[],discovered:false,initial:previous?.initial||{seed,track:s.track,relaxed:s.relaxed,powers:[...s.powers],equipped:[...s.equipped],borrowed:[...s.borrowed]}};s.phase='run';
}
function reward(s,event){const result=profileReward(s.profile,{mode:'song-run',runId:s.run?.id,trackId:s.track,poolCount:5,...event},GAME_CATALOGUE);if(!result.ok)throw new Error(result.reason);s.profile=result.profile;return result.receipt?.amount||0;}
function finish(s){s.phase='shop';s.pool=0;s.run=null;s.borrowed=[];s.route=0;if(s.powerMode!=='shared')syncUnlocked(s);tidy(s);}
export function progressionAct(input,action){
  const s=progressionValidate(input,input.profile?.kind);if(!s)return {ok:false,reason:'Invalid saved progression.'};
  const cat=GAME_CATALOGUE,node=cat.nodes[action.id];let r,message='Updated.';
  const fail=reason=>({ok:false,reason});
  if(s.profile.kind==='development'&&action.type==='reset-progress')return {ok:true,state:progressionCreate('development'),message:'Development progress reset. Normal progress is unchanged.'};
  if(s.phase==='run'&&!['abandon','pin','buy'].includes(action.type))return fail('Finish this pool before changing your build.');
  switch(action.type){
    case 'pin':if(action.id!==null&&!node)return fail('Choose a research target.');s.target=action.id;message=action.id?'Research goal pinned.':'Research goal cleared.';break;
    case 'discover':return discoveryUse(s,action.id,action.remove||[]);
    case 'refund':return fail('Research purchases are permanent.');
    case 'buy':
      if(s.powerMode==='shared')return fail('Shared challenges use the fixed supplied build.');
      r=profilePurchase(s.profile,action.id,cat);if(!r.ok)return r;s.profile=r.profile;
      if(s.powerMode==='unlocked'){if(s.run)s.run.buildBeforeResearch??=structuredClone(s.run.game.build);s.equipped=s.equipped.filter(id=>id!==action.id&&!node.conflicts.includes(id));if(node.kind!=='base')s.equipped.unshift(action.id);tidy(s);message=s.run?`${node.name} unlocked. Applies from the next pool.`:`${node.name} unlocked and active.`;break;}
      s.powers=s.powers.filter(p=>s.profile.research[p+'.base']);for(const p of STARTERS)if(s.powers.length<3&&!s.powers.includes(p))s.powers.push(p);tidy(s);message=`Researched ${node.name}.`;break;
    case 'replace':
      if(s.powerMode==='unlocked')return fail('All unlocked powers appear automatically.');
      if(s.phase!=='shop'||!s.profile.research[action.power+'.base']||!Number.isInteger(action.slot)||action.slot<0||action.slot>2||s.powers.includes(action.power))return fail('Choose an owned power and a different loadout slot.');s.powers[action.slot]=action.power;tidy(s);break;
    case 'borrow':
      if(!node||node.kind==='base'||!s.powers.includes(node.power)||s.profile.research[action.id])return fail('Choose an unowned upgrade for your loadout.');
      if(s.borrowed.includes(action.id)){if(s.phase!=='shop')return fail('Discoveries stay until this run ends.');s.borrowed=s.borrowed.filter(id=>id!==action.id);tidy(s);break;}
      if(s.phase==='interlude'&&(s.run.discovered||!s.run.offers.includes(action.id)))return fail('Choose one of the saved discovery offers.');
      if(node.kind==='capstone'&&(s.phase==='shop'||s.pool<2))return fail('Final-upgrade discoveries open after Build.');
      if(s.phase==='shop'&&s.borrowed.length>=2)return fail('Choose up to two starting loans.');
      s.borrowed.push(action.id);if(s.run)s.run.discovered=true;message='Borrowed for this run. Equip it to activate its effect.';break;
    case 'equip':
      if(!node||node.kind==='base')return fail('Select an upgrade.');
      if(s.powerMode==='unlocked'){if(!s.profile.research[action.id]&&!s.borrowed.includes(action.id))return fail('Unlock this upgrade first.');if(!node.conflicts.length)return fail('This upgrade is always active.');s.equipped=s.equipped.filter(id=>!node.conflicts.includes(id)&&id!==action.id);s.equipped.unshift(action.id);tidy(s);message='Power style changed.';break;}
      if(s.equipped.includes(action.id))s.equipped=s.equipped.filter(x=>x!==action.id);
      else {if(['a','b'].includes(node.kind)&&!POWER_TREES[node.power].compatible)s.equipped=s.equipped.filter(id=>id!==node.power+'.'+(node.kind==='a'?'b':'a'));s.equipped.push(action.id);}
      r=progressionLoadout(s);if(!r.ok)return r;break;
    case 'track':if(s.phase!=='shop'||!unlockedTracks(s).some(t=>t.id===action.track))return fail('Complete the preceding track to unlock this one.');if(!trackGet(action.track))return fail('Unknown track.');s.track=action.track;break;
    case 'seed':if(s.phase!=='shop'||!seedValid(action.seed))return fail('Use 1–24 letters, numbers, underscores or hyphens.');s.seed=action.seed;break;
    case 'route':if(s.phase!=='interlude'||![0,2].includes(s.pool)||![0,1].includes(action.route))return fail('Route choice opens before Verse and Bridge.');s.route=action.route;break;
    case 'relaxed':if(s.phase!=='shop')return fail('Choose pace before a run.');s.relaxed=!s.relaxed;break;
    case 'retry':
      if(s.phase!=='shop'||!s.retry)return fail('No previous attempt.');Object.assign(s,structuredClone(s.retry));if(s.powerMode==='unlocked')syncUnlocked(s);if(!progressionLoadout(s).ok)return fail('Research changed; choose a new build.');s.attempt++;poolCreate(s);message='Same seed and starting build.';break;
    case 'start':if(s.phase!=='shop')return fail('A run already exists.');s.attempt++;poolCreate(s);message=trackGet(s.track).name+' · Intro';break;
    case 'continue':if(s.phase!=='interlude')return fail('Clear this pool first.');{const music=s.run.music;s.pool++;poolCreate(s,music);message=POOL_NAMES[s.pool];}break;
    case 'abandon':if(!s.run)return fail('No active run.');reward(s,{type:'failure',poolIndex:s.pool+(s.phase==='interlude'?1:0),blooms:0,abandoned:true});s.retry=s.run.initial;finish(s);message='Run ended. Earned Points and research remain.';break;
    case 'skin':if(action.skin!=='original'&&!completedTracks(s).includes(action.skin))return fail('Complete that track to unlock its skin.');s.skin=action.skin;break;
    case 'grant':r=profileCurrencyGrant(s.profile,'seeds',action.amount,cat);if(!r.ok)return r;s.profile=r.profile;message=`Added ${action.amount} development Points.`;break;
    case 'max':if(s.profile.kind!=='development')return fail('Development only.');for(const id of Object.keys(cat.nodes))s.profile.research[id]??={paid:0};s.profile.revision++;s.profile.familyAccess=Object.fromEntries(Object.keys(s.profile.familyAccess).map(f=>[f,3]));s.bypass=true;s.equipped=Object.values(cat.nodes).filter(n=>n.kind!=='base'&&s.powers.includes(n.power)&&(!n.conflicts.length||n.effects.includes('a'))).map(n=>n.id);s.borrowed=[];syncUnlocked(s);if(s.phase==='interlude'){s.run.offers=[];s.run.discovered=true;}message=`All ${Object.keys(cat.powers).length} powers and ${Object.keys(cat.nodes).length} research nodes unlocked. Upgrades are active automatically.`;break;
    case 'max-progress':if(s.profile.kind!=='development')return fail('Development only.');s.developmentProgress=true;s.profile.wallet.seeds=Math.max(10000,s.profile.wallet.seeds);s.profile.revision++;message='All levels and skins open. 10,000 Points available. Songs and clear rewards are not fabricated.';break;
    case 'bypass':if(s.profile.kind!=='development')return fail('Development only.');s.bypass=!s.bypass;tidy(s);break;
    default:return fail('Unknown progression action.');
  }
  if(s.powerMode==='unlocked')syncUnlocked(s);
  if(s.phase==='interlude'){s.run.game.build=progressionLoadout(s).powers;delete s.run.buildBeforeResearch;}
  return {ok:true,state:s,message};
}
export function poolGoalMet(s){const r=s.run;if(!r)return false;const blooms=r.game.blooms,roles=r.roles.length===3;return s.pool===0?blooms>=1:s.pool===1?blooms>=1&&roles:s.pool===2?blooms>=2:s.pool===3?r.bankBloom:blooms>=2&&roles;}
export function goalRemaining(s){if(!s.run)return '';const r=s.run,need=[1,1,2,1,2][s.pool],parts=[];if(r.game.blooms<need)parts.push(`${need-r.game.blooms} more bloom${need-r.game.blooms>1?'s':''}`);if([1,4].includes(s.pool)&&r.roles.length<3)parts.push('contact '+['melody','bass','rhythm'].filter(x=>!r.roles.includes(x)).join(' & '));if(s.pool===3&&!r.bankBloom)parts.push('a wall bank before the fifth contact of a bloom');return parts.join(' · ')||'Goal met · let this pluck finish';}
function resultRecord(s,outcome){
  const r=s.run,music=r.music;if(music&&outcome==='victory')musicRunSection(music,5,s.track);
  const record={id:r.id,kind:s.profile.kind,track:s.track,seed:r.seed,relaxed:s.relaxed,rules:RULE.version,build:structuredClone(r.game.build),routes:[...r.routes],outcome,launches:r.launches,score:r.score,bonuses:r.bonuses,music:structuredClone(music),medal:outcome==='failure'?null:r.bonuses>=MEDALS.goldBonuses&&r.launches<=MEDALS.goldLaunches?'Gold':r.bonuses>=MEDALS.silverBonuses?'Silver':'Bronze'};
  const playback=structuredClone(record);
  if(record.music?.run&&outcome==='victory')record.music.run.cadenceDone=true;
  s.latest=record;s.retry=r.initial;
  // One best song per track and difficulty, plus the recoverable latest attempt.
  if(outcome==='victory'){const index=s.records.findIndex(x=>x.track===record.track&&x.relaxed===record.relaxed);if(index<0)s.records.push(record);else {const rank=x=>({Gold:3,Silver:2,Bronze:1}[x.medal]||0);if(rank(record)>rank(s.records[index])||rank(record)===rank(s.records[index])&&record.launches<s.records[index].launches)s.records[index]=record;}}
  return playback;
}
export function progressionObserve(input,game,events,music=null){
  if(input.phase!=='run')return {state:input,message:null};
  const s=structuredClone(input),r=s.run;r.game=structuredClone(game);r.music=music;
  for(const e of events){if(e.type==='note'&&!r.roles.includes(bubbleRole(e.id)))r.roles.push(bubbleRole(e.id));if(e.type==='power'&&s.powers.includes(e.kind)&&!r.activated.includes(e.kind))r.activated.push(e.kind);if(e.type==='bloom'&&e.banks>0)r.bankBloom=true;}
  let message=null,outcome=null,record=null,poolResult=null;
  if(!game.isFlying&&events.some(e=>['rest','over','win'].includes(e.type))){
    if(poolGoalMet(s)){
      poolResult={track:s.track,pool:s.pool,relaxed:s.relaxed,seed:r.seed,score:game.score,shots:game.launches};
      s.poolRecords??=[];
      const best=campaignPoolBest(s,s.track,s.pool);
      if(!best)s.poolRecords.push(poolResult);
      else if(poolResult.score>best.score||poolResult.score===best.score&&poolResult.shots<best.shots)s.poolRecords[s.poolRecords.indexOf(best)]=poolResult;
      r.launches+=game.launches;r.score+=game.score;r.bonuses+=game.objective.completed>0?1:0;
      // Old saved bonuses retain their historical pool reward. New bonuses are
      // already banked by the shared play receipt when their shot settles.
      let earned=reward(s,{type:'pool',poolIndex:s.pool,activated:r.activated,bonus:r.game.objective.completed>0&&!r.game.objective.rewardPoints});
      if(s.pool===4){earned+=reward(s,{type:'victory'});record=resultRecord(s,'victory');finish(s);outcome='victory';message=`${trackGet(s.track).name} complete · +${earned} Points`;}
      else{s.phase='interlude';r.offers=[];r.discovered=false;s.route=0;outcome='clear';message=`${POOL_NAMES[s.pool]} complete · +${earned} Points`;}
    }else if(game.isOver){r.launches+=game.launches;r.score+=game.score;const missing=goalRemaining(s),earned=reward(s,{type:'failure',poolIndex:s.pool,blooms:game.blooms,abandoned:false});record=resultRecord(s,'failure');finish(s);outcome='failure';message=`${missing} · +${earned} Points`;}
  }
  return {state:s,message,outcome,record,poolResult};
}

// A saved pool keeps its exact configuration when new research is purchased.
// Older saves without a purchase snapshot retain the original strict build check.
function savedBuildMatches(state,build){
 if(!Array.isArray(build))return false;
 if(state.run?.buildBeforeResearch!==undefined){
  const saved=state.run.buildBeforeResearch;
  if(state.powerMode!=='unlocked'||!buildValidate(saved)||canonical(build)!==canonical(saved))return false;
  // Research is permanent, while the pool already in progress keeps its exact build.
  const owned=id=>!!state.profile.research[id]||state.borrowed.includes(id);
  return saved.every(p=>owned(p.power+'.base')&&(!p.foundation||GAME_CATALOGUE.powers[p.power].included.includes('foundation')||owned(p.power+'.foundation'))&&p.variants.every(v=>owned(p.power+'.'+v))&&(!p.capstone||owned(p.power+'.capstone')));
 }
 const expected=progressionLoadout(state).powers;
 if(state.powerMode!=='unlocked')return canonical(build)===canonical(expected);
 const normalized=build.map(p=>({...p,foundation:GAME_CATALOGUE.powers[p.power].included.includes('foundation')||p.foundation}));
 return canonical(normalized)===canonical(expected);
}
