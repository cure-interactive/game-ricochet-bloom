import { playerBuild, playerConfig, PLAYER_UPGRADES } from './player-upgrade.js?v=205999fde590d7ae1935c6f5a99938cc353989c1dae9cfab7129b62c0b60b55b';
import { profileSummary } from './profile.js?v=77a1f73de2dacc19c8256f48f0f24a7b11703d553aac6e8b8f90066c5a175e7b';
import { GAME_CATALOGUE, poolMedal } from './run.js?v=13cddd0791aa2c8ea509a45b8136591b3e0359519cf8ebb3be6fefb2c61961d8';
import { TRACKS } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { SCORE_BUDGETS, scoreMedal } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
import { scoreRead } from './score-attack-store.js?v=91c32040ebff52d0172d69c733500a09949982b068bf12d7060e225f58000a47';
import { experimentRead, experimentMedal, experimentLegacy } from './experiment-store.js?v=658b0aec41d1fe4ae79f658aa12427df10792cbf85e1ec34edda33f3b6205dd9';
import { experimentSetup } from './experiment.js?v=9e917253523cf3fb5c7073b9b981a58461add6544b08e68392ea2b00819d0e72';
import { trialMedal, MEDAL_NAMES } from './medal.js?v=97f2ce6ed69f5c8834ecd381128c29d366fdfc9390080f59a05049d77db5f006';
import { poolMedalRecords } from './storage.js?v=4035b7e0446de4065d5ac53c5f46f25627c8e6c6a37b634df4e17bb336db7992';

const counts=()=>Object.fromEntries(MEDAL_NAMES.map(name=>[name,0]));
// Read-only projection. Every total retains its original save/profile boundary.
export function playerStats({state,available=true,kind=state?.profile?.kind,storage,poolStore}){
 if(!available||!state?.profile||state.profile.kind!==kind)return {available:false,kind};
 const profile=state.profile,summary=profileSummary(profile,GAME_CATALOGUE);
 if(!summary)return {available:false,kind};
 const play={shots:0,contacts:0,blooms:0,waves:0,wins:0},medals=counts(),groups=[],issues=[];
 let earned=0,campaignClears=0,campaignWins=0;
 for(const receipt of profile.rewards){
  earned+=receipt.amount;
  const e=receipt.event;
  if(e.type==='play')for(const key of Object.keys(play))play[key]+=e.play[key];
  if(e.type==='pool')campaignClears++;
  if(e.type==='victory')campaignWins++;
 }
 play.wins+=campaignWins;
 function group(name,values,ok=true,icon='gamepad'){const tally=counts();for(const medal of values)if(MEDAL_NAMES.includes(medal)){tally[medal]++;medals[medal]++;}groups.push({name,icon,counts:tally,available:ok});}
 const campaign=[false,true].map(relaxed=>{
  const records=(state.poolRecords||[]).filter(r=>r.relaxed===relaxed);
  group('Melody Journey · '+(relaxed?'Relaxed':'Standard'),records.map(r=>poolMedal(r.pool,r.score)),true,'campaign');
  return {relaxed,cleared:records.length,total:TRACKS.length*5};
 });
 const scores=SCORE_BUDGETS.map(budget=>{const read=scoreRead(storage,kind,budget);if(!read.ok)issues.push(`${budget}-shot Score Attack`);return {budget,available:read.ok,best:read.best,medal:read.best===null?null:scoreMedal(read.best,budget)};});
 group('Score Attack',scores.map(r=>r.medal),scores.every(r=>r.available),'speedometer');
 const experiments=experimentRead(storage,kind);
 const records=experiments.library?.records??[];
 if(!experiments.ok)issues.push('Experiments');
 group('Experiments',records.map(r=>experimentMedal(experiments.library,r.setup)),experiments.ok,'flask');
 const legacyNames={reaction:'Reaction Puzzle',cargo:'Cargo Rescue',outbreak:'Outbreak Containment'};
 for(const read of experimentLegacy(storage,kind)){
  if(!read.ok)issues.push(legacyNames[read.mode]);
  group(legacyNames[read.mode]+' · Original Levels',Object.entries(read.entry?.medals??{}).map(([level,e])=>trialMedal(experimentSetup(read.mode,Number(level)),e)),read.ok,'flask');
 }
 for(const [mode,name] of [['free','Free Play'],['challenge','Challenge'],['waves','Endless Waves']])group(name,poolMedalRecords(poolStore,{kind,mode}).map(r=>r.medal),true,mode==='waves'?'wave':mode==='challenge'?'star':'gamepad');
 const research=Object.keys(GAME_CATALOGUE.nodes).filter(id=>!GAME_CATALOGUE.nodes[id].historical);
 return {available:true,kind,points:profile.wallet.seeds,earned,paid:[...Object.values(profile.research),...Object.values(profile.playerResearch??{}),...Object.values(profile.cosmetics?.owned??{})].reduce((sum,r)=>sum+r.paid,0),
  config:playerConfig(playerBuild(profile)),play,campaignClears,campaignWins,tracksCompleted:summary.completedTracks.length,tracksTotal:TRACKS.length,
  powers:Object.keys(GAME_CATALOGUE.powers).filter(id=>profile.research[id+'.base']).length,powersTotal:Object.keys(GAME_CATALOGUE.powers).length,
  research:research.filter(id=>profile.research[id]).length,researchTotal:research.length,playerUpgrades:Object.keys(profile.playerResearch??{}).length,playerUpgradeTotal:PLAYER_UPGRADES.length,
  campaign,scores,medals,groups,issues,experiments:{available:experiments.ok,attempts:records.reduce((sum,r)=>sum+r.attempts,0),wins:records.reduce((sum,r)=>sum+r.wins,0)}};
}
