import {PLAYER_UPGRADES,playerBuild,playerConfig,playerLaunchSpeed,playerGuideLength} from './player-upgrade.js?v=2f8094123653e7654746e834352d2180922eb090ccd1d9e358a596ab2bcd37f9';
const maximum=playerConfig({version:1,sight:2,launch:2,rebound:2});
const specs=[
 {key:'guideExtra',branch:'Sight',label:'Extra Guide Length',description:'Additional aiming distance before walls or geometry limit the preview.',unit:' units'},
 {key:'bankGuide',branch:'Sight',label:'Reflected Guide Length',description:'Maximum preview distance after the first wall bounce, within the remaining guide budget.',unit:' units'},
 {key:'maxLaunch',branch:'Launch',label:'Maximum Launch Speed',description:'Full-power launch speed. Minimum-power shots stay at 280 units per second.',unit:' units/s'},
 {key:'wallRetention',branch:'Rebound',label:'Wall Speed Retained',description:'Perpendicular speed kept at ordinary walls. Stronger power effects still apply.',unit:'%',scale:100}
];
const rounded=n=>Math.round(n*100)/100;
// Preview prerequisites in a detached build, never in the profile or active run.
export function playerPurchaseComparison(profile,id){
 const node=PLAYER_UPGRADES.find(n=>n.id===id),research={...profile.playerResearch},owned=!!research[id];let prerequisites=false;
 function include(key){if(!key||research[key])return;const n=PLAYER_UPGRADES.find(n=>n.id===key);include(n.requires);research[key]={paid:0};prerequisites=true;}
 if(node&&!owned)include(node.requires);
 const before=playerBuild({...profile,playerResearch:research});
 if(node&&!owned)research[id]={paid:0};
 return {before,after:playerBuild({...profile,playerResearch:research}),compare:!!node&&!owned,beforeLabel:prerequisites?'With Prerequisites':'Current',afterLabel:'After Research'};
}
function responseCurve(branch,comparison){
 const {before,after,compare}=comparison,rebound=branch==='Rebound',sight=branch==='Sight';
 const response=(build,x)=>rebound?100*playerConfig(build).wallRetention**x:sight?playerGuideLength(build,x):playerLaunchSpeed(build,x);
 const points=build=>Array.from({length:rebound?11:21},(_,i)=>{const x=rebound?i:i/20;return [x,response(build,x)];});
 const previous=points(before),current=points(after),changed=compare&&current.some((p,i)=>p[1]!==previous[i][1]);
 return {points:current,previous:compare?previous:null,changed,xMax:rebound?10:1,yMin:0,yMax:rebound?100:sight?1120:1000,xEnd:rebound?'10':'100%',
  xLabel:rebound?'Ordinary wall rebounds':'Shot power',yLabel:rebound?'Speed retained (%)':sight?'Guide budget (units)':'Launch speed (units/s)',
  summary:rebound?'Perpendicular speed retained through ten ordinary wall rebounds.':sight?'Aiming guide budget as shot power increases.':'Launch speed as shot power increases.',
  note:rebound?'Isolated wall response for the player and Split seeds; excludes drag, other collisions and stronger power effects.':sight?'Walls and geometry can shorten the visible line. The first reflected segment has its own distance cap.':'Uses the same shot-power response as gameplay. Low-power shots remain available.'};
}
export function playerSkillStats(profile,id='player'){
 const node=PLAYER_UPGRADES.find(n=>n.id===id),comparison=playerPurchaseComparison(profile,id),before=playerConfig(comparison.before),after=playerConfig(comparison.after);
 const rows=specs.filter(s=>!node||s.branch===node.branch).map(s=>{
  const scale=s.scale||1,value=rounded(after[s.key]*scale),previous=rounded(before[s.key]*scale),best=rounded(maximum[s.key]*scale);
  return {label:s.label,description:s.description,kind:'bar',direction:'higher',value,previous,best,max:best,progress:value/best,previousProgress:previous/best,changed:comparison.compare&&value!==previous,before:previous+s.unit,after:value+s.unit};
 });
 if(node){const curve=responseCurve(node.branch,comparison);rows.push({label:node.branch==='Sight'?'Guide Response':node.branch==='Launch'?'Launch Response':'Rebound Response',description:'',kind:'text',changed:false,after:'',curve});}
 return {heading:comparison.compare?'Upgrade Preview':'Current Player Build',...comparison,rows};
}
