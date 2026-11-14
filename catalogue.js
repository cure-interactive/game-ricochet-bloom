import { POWER_TREES } from './power-tree.js?v=9fda938ef3e82ce596579a6bd292edca93bb30ccd3efb174b1a25b7d418fa895';
// Progression definitions are not a claim that an engine behavior is implemented.
// The engine integration must explicitly advertise supported node IDs.
export const CURRENCIES = Object.freeze({ seeds: Object.freeze({ name: 'Points' }) });
export const TRACKS = Object.freeze(['first-light', 'crosscurrent', 'glasswater', 'afterimage', 'night-bloom']);
export const STARTERS = Object.freeze(['ripple']);
// One parent per power. Upgrade chains and these branches form one rooted tree.
export const POWER_PARENT = Object.freeze({
 ripple:null, comet:'ripple.foundation', attract:'ripple.foundation', stasis:'attract.a', pulse:'ripple.b',
 impact:'comet.foundation', spring:'comet.foundation', wake:'comet.capstone', drunk:'pulse.b',
 wrap:'spring.a', blaster:'impact.a',
 magnet:'attract.foundation', vortex:'attract.foundation', homing:'magnet.a',
 orbit:'vortex.a', slingshot:'orbit.capstone',
 bubble:'ripple.a', tether:'attract.a', relay:'impact.capstone',
 lightning:'relay.foundation', split:'blaster.b', echo:'split.foundation', rewind:'echo.capstone',
 swap:'wrap.a', portal:'swap.b'
});
export const REWARD = Object.freeze({ tutorial: 4, pool: 2, bonus: 1, victory: 3, firstClear: 4, failure: 1 });
export const FAMILY_UNLOCK = Object.freeze({Motion:null,Flow:null,Control:'ripple.foundation',Navigation:'comet.foundation',Propagation:'stasis.foundation'});
export function familyEntry(profile,family,catalogue=CATALOGUE){
 const via=FAMILY_UNLOCK[family];
 return {via,open:profile.kind==='development'||!via||profile.familyUnlocks?.includes(family)||!!profile.research[via]||Object.keys(profile.research).some(id=>catalogue.nodes[id]?.kind==='base'&&catalogue.powers[catalogue.nodes[id].power].type===family)};
}
// Research order does not invalidate old builds or independent temporary discoveries.
export const nodeActivationMet=(node,owns)=>node.kind==='base'||owns(node.power+'.base');
const modeReasons = { ripple: 'Choose one pressure shape: strong center or far shore.', attract: 'Choose one gathering shape: tight group or loose ring.' };
export function nodePrerequisitesMet(node, owns) {
  return node.requires.every(owns);
}
export const catalogueNode = (catalogue,id) => Object.hasOwn(catalogue.nodes,id) ? catalogue.nodes[id] : Object.hasOwn(catalogue.legacyNodes||{},id) ? catalogue.legacyNodes[id] : null;
export function catalogueCreate(supportedNodes = [], definitions = POWER_TREES, parents = POWER_PARENT) {
  if (!Array.isArray(supportedNodes) || supportedNodes.some(id => typeof id !== 'string') || new Set(supportedNodes).size !== supportedNodes.length) throw new TypeError('Invalid supported nodes');
  const powers = {}, nodes = {}, legacyNodes = {};
  for (const [power, tree] of Object.entries(definitions)) {
    const { type, tier } = tree;
    if(!tree.nodes.length || tree.nodes[0].key!=='base' || tree.nodes.slice(1).some(n=>n.kind==='base'))throw new TypeError('Invalid power chain: '+power);
    powers[power] = Object.freeze({ id: power, type, tier, starter: STARTERS.includes(power), included:Object.freeze([...(tree.included||[])]) });
    for(const [index,entry] of tree.nodes.entries()){
      const {key,kind,name,description,rarity,seedCost,tuningCost,masteryPools}=entry,id=`${power}.${key}`;
      if(nodes[id] || !key || !rarity || !Number.isSafeInteger(seedCost) || seedCost<0)throw new TypeError('Invalid research node: '+id);
      const conflicts=(entry.conflicts||[]).map(key=>power+'.'+key);
      nodes[id] = Object.freeze({ id,power,kind,type,rarity,name,description,seedCost,tuningCost,masteryPools,
        effects:Object.freeze([...(entry.effects||[])]),supported:supportedNodes.includes(id),
        requires:Object.freeze(index===0 ? (parents[power]?[parents[power]]:[]) : [power+'.'+tree.nodes[index-1].key]),
        unlocks:Object.freeze(Object.keys(parents).filter(p=>parents[p]===id)),conflicts:Object.freeze(conflicts),
        conflictReason:conflicts.length ? modeReasons[power] || `Choose one ${tree.name} mode: ${name} or ${tree.nodes.find(n=>n.key===entry.conflicts[0]).name}.` : null });
    }
    // Historical purchases remain valid receipts, not extra steps or new offers.
    for(const entry of tree.legacyNodes||[]){
      const id=power+'.'+entry.key;
      legacyNodes[id]=Object.freeze({...entry,id,power,type,supported:supportedNodes.includes(power+'.base'),requires:Object.freeze([power+'.base']),conflicts:Object.freeze([]),effects:Object.freeze(entry.effects),unlocks:Object.freeze([]),historical:true});
    }
  }
  for (const id of supportedNodes) {
    if (!Object.hasOwn(nodes,id) || (nodes[id].kind!=='base' && !nodes[id].requires.every(key=>nodes[key]?.supported)))throw new TypeError('Unsupported prerequisite: '+id);
  }
  return Object.freeze({version:6,powers:Object.freeze(powers),nodes:Object.freeze(nodes),legacyNodes:Object.freeze(legacyNodes)});
}
// Consumers opt into implemented capabilities. run.js owns the shipping set.
export const CATALOGUE = catalogueCreate();

// Legacy profile compatibility only. Research is gated by node prerequisites, never types.
export const TYPES = Object.freeze([...new Set(Object.values(POWER_TREES).map(p=>p.type))]);
export const FAMILIES = TYPES; // Legacy save/API vocabulary; new UI uses types.
export function legacyFamilyAccess(research,catalogue=CATALOGUE){
 return Object.fromEntries(FAMILIES.map(f=>{const nodes=Object.keys(research).map(id=>catalogue.nodes[id]).filter(n=>n&&catalogue.powers[n.power].type===f),upgrades=nodes.filter(n=>n.kind!=='base'),powers=new Set(upgrades.map(n=>n.power)).size,ownedTier=Math.max(1,...nodes.filter(n=>n.kind==='base').map(n=>catalogue.powers[n.power].tier));return [f,Math.max(ownedTier,upgrades.length>=5&&powers>=2?3:upgrades.length>=2?2:1)];}));
}
export function familyProgress(profile,family,catalogue=CATALOGUE){
 const research=profile.research,powers=new Set();let clears=0;
 for(const {event} of profile.rewards||[])if(event.type==='pool'){
  const used=event.activated.filter(p=>catalogue.powers[p]?.type===family);
  if(used.length){clears++;for(const p of used)powers.add(p);}
 }
 const upgrades=Object.keys(research).filter(id=>catalogue.nodes[id]?.kind!=='base'&&catalogue.powers[catalogue.nodes[id]?.power]?.type===family).length;
 const earned=clears>=5&&powers.size>=2?3:clears>=2?2:1;
 return {upgrades,clears,powers:powers.size,tier:Math.max(earned,profile.familyAccess?.[family]||1)};
}
export function familyGate(profile,power,catalogue=CATALOGUE){
 const definition=catalogue.powers[power];if(!definition)return {ok:false,required:0,clears:0,powers:0,tier:1};
 const progress=familyProgress(profile,definition.type,catalogue),required=definition.tier===3?5:definition.tier===2?2:0;
 const entry=familyEntry(profile,definition.type,catalogue);
 return {...progress,required,entry,ok:entry.open&&progress.tier>=definition.tier};
}
