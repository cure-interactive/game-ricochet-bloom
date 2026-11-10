import { POWER_TREES } from './power-tree.js?v=0c4680185586233f800dc673edd2ea81dbf97fd60d02c3b6fbf3df81b4e49839';
// Progression definitions are not a claim that an engine behavior is implemented.
// The engine integration must explicitly advertise supported node IDs.
export const CURRENCIES = Object.freeze({ seeds: Object.freeze({ name: 'Seeds' }) });
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
// No v2 engine configuration is connected yet. Later engine work enables nodes.
export const CATALOGUE = catalogueCreate();

// Gates govern new base purchases only; owned descendants survive route refunds.
export function familyProgress(research, family, catalogue = CATALOGUE) {
  const nodes = Object.keys(research).map(id => catalogue.nodes[id]).filter(node => node && node.kind !== 'base' && catalogue.powers[node.power].family === family);
  return { upgrades: nodes.length, powers: new Set(nodes.map(node => node.power)).size };
}
export function familyGate(research, power, catalogue = CATALOGUE) {
  const definition = catalogue.powers[power];
  if (!definition) return { ok: false, required: 0, upgrades: 0, powers: 0 };
  const progress = familyProgress(research, definition.family, catalogue);
  const required = definition.tier === 3 ? 5 : definition.tier === 2 ? 2 : 0;
  return { ...progress, required, ok: progress.upgrades >= required && (definition.tier !== 3 || progress.powers >= 2) };
}
