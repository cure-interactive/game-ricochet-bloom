import { EXPERIMENT_CATALOGUE } from './experiment-catalogue.js?v=46fd868b7899d3825edca249ee222d0822e27a53f260e03d7069491bca53ea1e';
import { EXPERIMENT_MODES, experimentMode } from './experiment-mode.js?v=8691672ebafa0ee909e0adfbe1058bb7a29634ac3aef011c8c8a34ad0b9eb1bf';
import { EXPERIMENT_RECIPES, EXPERIMENT_DESTINATIONS } from './experiment.js?v=9e917253523cf3fb5c7073b9b981a58461add6544b08e68392ea2b00819d0e72';
import { CAMPAIGN_NAME } from './run.js?v=761d66a7f48a89837bd270e75d2f2fc05b570ad32da442ce146863b3344310db';

// Stable individual destinations remain searchable beneath curated collections.
export const GAMEMODE_CARDS=Object.freeze([
  {id:'campaign',name:CAMPAIGN_NAME,description:'Build your song across five tracks. Chase a medal in every pool.',category:'original',art:'campaign',route:'legacy',playable:true},
  {id:'drift',name:'Drift',description:'A self-playing bubble pool. Tap to stir the bubbles and enjoy your unlocked powers. No Points or medals.',category:'original',art:'drift',route:'casual',playable:true},
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

const range=(first,last)=>Array.from({length:last-first+1},(_,i)=>String(first+i).padStart(3,'0'));
export const GAMEMODE_GROUPS=Object.freeze([
  {id:'precision',name:'Trick Shots',description:'Precision challenges: plan rebounds, call targets and control your finish.',art:'001',members:range(1,10)},
  {id:'music',name:'Melody Trials',description:'Musical challenges: match phrases, rhythms and complementary voices.',art:'081',members:range(81,90)},
  {id:'reaction',name:'Reaction Puzzle',description:'Trigger and control reactions while protecting fragile cells.',art:'reaction',members:['reaction',...range(11,20)]},
  {id:'cargo',name:'Cargo Rescue',description:'Push and guide fragile cargo into safe receivers.',art:'cargo',members:['cargo',...range(21,30)]},
  {id:'outbreak',name:'Outbreak Containment',description:'Seal sources and contain infection while protecting living cells.',art:'outbreak',members:['outbreak',...range(31,40)]}
]);
export function gamemodePage({view='',query='',category='',favourites=[]}={}){
  const group=GAMEMODE_GROUPS.find(g=>view===`group:${g.id}`);
  const filtered=gamemodeCards({query,category:query.trim()?'':category});
  if(query.trim())return {title:'Search Results',groups:[],entries:filtered};
  if(view==='favourites')return {title:'Favourites',groups:[],entries:filtered.filter(e=>favourites.includes(e.id))};
  if(view==='development')return {title:'In Development',groups:[],entries:filtered.filter(e=>!e.playable)};
  if(group)return {title:group.name,description:group.description,groups:[],entries:filtered.filter(e=>e.playable&&group.members.includes(e.id)),planned:GAMEMODE_CARDS.filter(e=>!e.playable&&group.members.includes(e.id)).length};
  const grouped=new Set(GAMEMODE_GROUPS.flatMap(g=>g.members));
  return {title:'Gamemodes',groups:GAMEMODE_GROUPS.map(g=>({...g,count:GAMEMODE_CARDS.filter(e=>e.playable&&g.members.includes(e.id)).length})).filter(g=>g.count),entries:filtered.filter(e=>e.playable&&!grouped.has(e.id))};
}
