import {iconHTML} from './ui-icon.js?v=fadb7aef991484dc9cb5ef25c3ee3ac0b493397ae011313552240e2310c6e308';
import { RARITIES, SKILL_TYPES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { assetURL } from './asset.js?v=637716717d2250f0d96d961614bfe2ace0e7a403d7f201f26f134e685de2062c';

// The same skill identity is shown on the map, its card and discovery rewards.
export function skillIconURL(node) {
  return assetURL(node.kind==='base' ? `icon/power/${node.power}.svg` : `icon/upgrade/${node.id}.svg`);
}
export const skillIconHTML = node => node.icon?iconHTML(node.icon): `<img draggable="false" src="${skillIconURL(node)}" alt="" width="32" height="32">`;

export const rarityIconHTML = rarity => `<img class="rarity-icon" draggable="false" src="${assetURL('icon/rarity/'+rarity+'.svg')}" alt="" width="20" height="20">`;
export const typeIconHTML = type => `<img class="type-icon" draggable="false" src="${assetURL('icon/type/'+SKILL_TYPES[type].icon+'.svg')}" alt="" width="20" height="20">`;
export const skillTraitsHTML = node => `<div class="skill-traits"><span class="skill-trait">${rarityIconHTML(node.rarity)}${RARITIES[node.rarity].name}</span><span class="skill-trait" title="${SKILL_TYPES[node.type].description}">${typeIconHTML(node.type)}${node.type} Type</span></div>`;
