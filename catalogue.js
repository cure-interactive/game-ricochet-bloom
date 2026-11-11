import { POWER_TREES } from './power-tree.js?v=2ddf449ce328f8cc92262395a8ecacc7f5d7a653c9df225d5b7c296f7596bc3c';
// Progression definitions are not a claim that an engine behavior is implemented.
// The engine integration must explicitly advertise supported node IDs.
export const CURRENCIES = Object.freeze({ seeds: Object.freeze({ name: 'Points' }) });
export const TRACKS = Object.freeze(['first-light', 'crosscurrent', 'glasswater', 'afterimage', 'night-bloom']);
export const STARTERS = Object.freeze(['ripple', 'attract', 'comet']);
export const REWARD = Object.freeze({ tutorial: 4, pool: 2, bonus: 1, victory: 3, firstClear: 4, failure: 1 });
const kinds = ['base', 'foundation', 'a', 'b', 'capstone'];
const prices = [4, 3, 5, 5, 8], tuning = [0, 1, 1, 1, 2];
const modeReasons = { ripple: 'Choose one pressure shape: strong center or far shore.', attract: 'Choose one gathering shape: tight group or loose ring.' };
export function nodePrerequisitesMet(node, owns) {
  return node.requires.every(owns);
}
export function catalogueCreate(supportedNodes = []) {
  if (!Array.isArray(supportedNodes) || supportedNodes.some(id => typeof id !== 'string') || new Set(supportedNodes).size !== supportedNodes.length) throw new TypeError('Invalid supported nodes');
  const powers = {}, nodes = {};
  for (const [power, tree] of Object.entries(POWER_TREES)) {
    const { family, tier } = tree;
    powers[power] = Object.freeze({ id: power, family, tier, starter: STARTERS.includes(power) });
    kinds.forEach((kind, index) => {
      const id = `${power}.${kind}`;
      nodes[id] = Object.freeze({ id, power, kind, name: tree.nodes[index].name, description: tree.nodes[index].description,
        seedCost: prices[index], tuningCost: tuning[index], supported: supportedNodes.includes(id),
        requires: Object.freeze(kind === 'base' ? [] : [power + '.base']),
        // These select contradictory force shapes. Other researched upgrades
        // can coexist; choosing a shape never gates ownership or a capstone.
        conflicts: Object.freeze(!tree.compatible && ['a', 'b'].includes(kind)
          ? [power + (kind === 'a' ? '.b' : '.a')] : []),
        conflictReason: ['a', 'b'].includes(kind) ? modeReasons[power] || (!tree.compatible ? `Choose one ${tree.name} mode: ${tree.nodes[2].name} or ${tree.nodes[3].name}.` : null) : null,
        masteryPools: kind === 'capstone' ? 3 : 0 });
    });
  }
  for (const id of supportedNodes) {
    if (!Object.hasOwn(nodes, id) || !nodePrerequisitesMet(nodes[id], key => nodes[key].supported)) throw new TypeError('Unsupported prerequisite: ' + id);
  }
  return Object.freeze({ version: 2, powers: Object.freeze(powers), nodes: Object.freeze(nodes) });
}
// Consumers opt into implemented capabilities. run.js owns the shipping set.
export const CATALOGUE = catalogueCreate();

// Family experience is earned by using powers in successful pools. Earned family access is permanent.
export const FAMILIES = Object.freeze([...new Set(Object.values(POWER_TREES).map(p=>p.family))]);
export function legacyFamilyAccess(research,catalogue=CATALOGUE){
 return Object.fromEntries(FAMILIES.map(f=>{const nodes=Object.keys(research).map(id=>catalogue.nodes[id]).filter(n=>n&&catalogue.powers[n.power].family===f),upgrades=nodes.filter(n=>n.kind!=='base'),powers=new Set(upgrades.map(n=>n.power)).size,ownedTier=Math.max(1,...nodes.filter(n=>n.kind==='base').map(n=>catalogue.powers[n.power].tier));return [f,Math.max(ownedTier,upgrades.length>=5&&powers>=2?3:upgrades.length>=2?2:1)];}));
}
export function familyProgress(profile,family,catalogue=CATALOGUE){
 const research=profile.research,powers=new Set();let clears=0;
 for(const {event} of profile.rewards||[])if(event.type==='pool'){
  const used=event.activated.filter(p=>catalogue.powers[p]?.family===family);
  if(used.length){clears++;for(const p of used)powers.add(p);}
 }
 const upgrades=Object.keys(research).filter(id=>catalogue.nodes[id]?.kind!=='base'&&catalogue.powers[catalogue.nodes[id]?.power]?.family===family).length;
 const earned=clears>=5&&powers.size>=2?3:clears>=2?2:1;
 return {upgrades,clears,powers:powers.size,tier:Math.max(earned,profile.familyAccess?.[family]||1)};
}
export function familyGate(profile,power,catalogue=CATALOGUE){
 const definition=catalogue.powers[power];if(!definition)return {ok:false,required:0,clears:0,powers:0,tier:1};
 const progress=familyProgress(profile,definition.family,catalogue),required=definition.tier===3?5:definition.tier===2?2:0;
 return {...progress,required,ok:progress.tier>=definition.tier};
}
