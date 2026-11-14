import {iconHTML} from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';
import { RARITIES, SKILL_TYPES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { assetURL } from './asset.js?v=c168b1bf74896095e10ba96f5c9cfb00449414ce901de7993bd725e00a9bbfea';

// The same skill identity is shown on the map, its card and discovery rewards.
export function skillIconURL(node) {
  return assetURL(node.kind==='base' ? `icon/power/${node.power}.svg` : `icon/upgrade/${node.id}.svg`);
}
export const skillIconHTML = node => node.icon?iconHTML(node.icon): `<img draggable="false" src="${skillIconURL(node)}" alt="" width="32" height="32">`;

export const rarityIconHTML = rarity => `<img class="rarity-icon" draggable="false" src="${assetURL('icon/rarity/'+rarity+'.svg')}" alt="" width="20" height="20">`;
export const typeIconHTML = type => `<img class="type-icon" draggable="false" src="${assetURL('icon/type/'+SKILL_TYPES[type].icon+'.svg')}" alt="" width="20" height="20">`;
export const skillTraitsHTML = node => `<div class="skill-traits"><span class="skill-trait">${rarityIconHTML(node.rarity)}${RARITIES[node.rarity].name}</span><span class="skill-trait" title="${SKILL_TYPES[node.type].description}">${typeIconHTML(node.type)}${node.type} Type</span></div>`;
