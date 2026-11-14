import { playerBuild, playerConfig, PLAYER_UPGRADES } from './player-upgrade.js?v=fab6c92f134e88ebe641c4be9b87d9e46b857905b117a20831b164d5181c0c23';
import { profileSummary } from './profile.js?v=8b46ab3dd82c6cf494dd9495dde1302dd74763ae7b5a4f8a30664c783bd23497';
import { GAME_CATALOGUE, poolMedal } from './run.js?v=8c5cad259a936425799e4ab42a618197c5a72e81e38a2264e6d19508d67b43c4';
import { TRACKS } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { SCORE_BUDGETS, scoreMedal } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
import { scoreRead } from './score-attack-store.js?v=5ff229a31a77b92b75b6336e1bb1d7143a5c4a32922a4c4f10e12c8f11de9e18';
import { experimentRead, experimentMedal, experimentLegacy } from './experiment-store.js?v=810950b4b346e69891a07dd81ecce1e27b3b738cda9dd2f73f1d169fbf62576a';
import { experimentSetup } from './experiment.js?v=09c5c1a420167e74a8d503604cf362e056a4708773247dbe20745db8766748a0';
import { trialMedal, MEDAL_NAMES } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { poolMedalRecords } from './storage.js?v=0c1eaff4b15712ebe008629e3c6739de4f73c60d485809b164d27c63896a2d71';

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
 function group(name,values,ok=true){const tally=counts();for(const medal of values)if(MEDAL_NAMES.includes(medal)){tally[medal]++;medals[medal]++;}groups.push({name,counts:tally,available:ok});}
 const campaign=[false,true].map(relaxed=>{
  const records=(state.poolRecords||[]).filter(r=>r.relaxed===relaxed);
  group('Melody Journey · '+(relaxed?'Relaxed':'Standard'),records.map(r=>poolMedal(r.pool,r.score)));
  return {relaxed,cleared:records.length,total:TRACKS.length*5};
 });
 const scores=SCORE_BUDGETS.map(budget=>{const read=scoreRead(storage,kind,budget);if(!read.ok)issues.push(`${budget}-shot Score Attack`);return {budget,available:read.ok,best:read.best,medal:read.best===null?null:scoreMedal(read.best,budget)};});
 group('Score Attack',scores.map(r=>r.medal),scores.every(r=>r.available));
 const experiments=experimentRead(storage,kind);
 const records=experiments.library?.records??[];
 if(!experiments.ok)issues.push('Experiments');
 group('Experiments',records.map(r=>experimentMedal(experiments.library,r.setup)),experiments.ok);
 const legacyNames={reaction:'Reaction Puzzle',cargo:'Cargo Rescue',outbreak:'Outbreak Containment'};
 for(const read of experimentLegacy(storage,kind)){
  if(!read.ok)issues.push(legacyNames[read.mode]);
  group(legacyNames[read.mode]+' · Original Levels',Object.entries(read.entry?.medals??{}).map(([level,e])=>trialMedal(experimentSetup(read.mode,Number(level)),e)),read.ok);
 }
 for(const [mode,name] of [['free','Free Play'],['challenge','Challenge'],['waves','Endless Waves']])group(name,poolMedalRecords(poolStore,{kind,mode}).map(r=>r.medal));
 const research=Object.keys(GAME_CATALOGUE.nodes).filter(id=>!GAME_CATALOGUE.nodes[id].historical);
 return {available:true,kind,points:profile.wallet.seeds,earned,paid:[...Object.values(profile.research),...Object.values(profile.playerResearch??{})].reduce((sum,r)=>sum+r.paid,0),
  config:playerConfig(playerBuild(profile)),play,campaignClears,campaignWins,tracksCompleted:summary.completedTracks.length,tracksTotal:TRACKS.length,
  powers:Object.keys(GAME_CATALOGUE.powers).filter(id=>profile.research[id+'.base']).length,powersTotal:Object.keys(GAME_CATALOGUE.powers).length,
  research:research.filter(id=>profile.research[id]).length,researchTotal:research.length,playerUpgrades:Object.keys(profile.playerResearch??{}).length,playerUpgradeTotal:PLAYER_UPGRADES.length,
  campaign,scores,medals,groups,issues,experiments:{available:experiments.ok,attempts:records.reduce((sum,r)=>sum+r.attempts,0),wins:records.reduce((sum,r)=>sum+r.wins,0)}};
}
