import { EXPERIMENT_CATALOGUE } from './experiment-catalogue.js?v=56f1341273f115a6d4ee047f94e17f2ec8cb50bf4c7b69bf3de6deffb0072763';
import { EXPERIMENT_MODES, experimentMode } from './experiment-mode.js?v=8691672ebafa0ee909e0adfbe1058bb7a29634ac3aef011c8c8a34ad0b9eb1bf';
import { EXPERIMENT_RECIPES, EXPERIMENT_DESTINATIONS } from './experiment.js?v=09c5c1a420167e74a8d503604cf362e056a4708773247dbe20745db8766748a0';
import { CAMPAIGN_NAME } from './run.js?v=e3fc5e08ab0c39705bfdd4d290e1761ea139fe39d29b006a8dab548acd2bdb38';

// One public card per game. Categories describe games; they are not destinations.
export const GAMEMODE_CARDS=Object.freeze([
  {id:'campaign',name:CAMPAIGN_NAME,description:'Build your song across five tracks. Chase a medal in every pool.',category:'original',art:'campaign',route:'legacy',playable:true},
  {id:'free',name:'Free Play',description:'An open pool for your unlocked powers.',category:'original',art:'free',route:'legacy',playable:true},
  {id:'waves',name:'Endless Waves',description:'Clear the pool before your shots run out.',category:'original',art:'waves',route:'legacy',playable:true},
  {id:'challenge',name:'Challenge',description:'Reach three blooms before your shots run out.',category:'original',art:'challenge',route:'legacy',playable:true},
  ...['reaction','cargo','outbreak'].map(id=>({id,name:EXPERIMENT_RECIPES[id].name,description:{reaction:'Trigger chains while protecting healthy cells.',cargo:'Push fragile cargo into safe receivers.',outbreak:'Seal vents and stop infection from reaching the central cell.'}[id],category:id,art:id,route:'setup',playable:true})),
  ...EXPERIMENT_CATALOGUE.map(e=>({...e,category:experimentMode(e.id).id,route:EXPERIMENT_DESTINATIONS[e.id]?'destination':EXPERIMENT_RECIPES[e.id]?'setup':'detail',playable:!!(EXPERIMENT_RECIPES[e.id]||EXPERIMENT_DESTINATIONS[e.id])}))
]);
export const GAMEMODE_CATEGORIES=[{id:'original',name:'Original Modes'},...EXPERIMENT_MODES];
export function gamemodeCards({query='',category='',status='all'}={}){
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return GAMEMODE_CARDS.filter(e=>(!category||e.category===category)&&(status==='all'||e.playable===(status==='playable'))&&words.every(word=>`${e.id} ${e.name} ${e.description}`.toLowerCase().includes(word))).sort((a,b)=>Number(b.playable)-Number(a.playable));
}
