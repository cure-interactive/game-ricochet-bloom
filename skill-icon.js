import {iconHTML} from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';
import { RARITIES, SKILL_TYPES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { assetURL } from './asset.js?v=4a033879d71b1eddd370a80d7afdf3ea8124008623c9c74936a12526b13e3e9c';

// The same skill identity is shown on the map, its card and discovery rewards.
export function skillIconURL(node) {
  return assetURL(node.kind==='base' ? `icon/power/${node.power}.svg` : `icon/upgrade/${node.id}.svg`);
}
export const skillIconHTML = node => node.icon?iconHTML(node.icon): `<img draggable="false" src="${skillIconURL(node)}" alt="" width="32" height="32">`;

export const rarityIconHTML = rarity => `<img class="rarity-icon" draggable="false" src="${assetURL('icon/rarity/'+rarity+'.svg')}" alt="" width="20" height="20">`;
export const typeIconHTML = type => `<img class="type-icon" draggable="false" src="${assetURL('icon/type/'+SKILL_TYPES[type].icon+'.svg')}" alt="" width="20" height="20">`;
export const skillTraitsHTML = node => `<div class="skill-traits"><span class="skill-trait">${rarityIconHTML(node.rarity)}${RARITIES[node.rarity].name}</span><span class="skill-trait" title="${SKILL_TYPES[node.type].description}">${typeIconHTML(node.type)}${node.type} Type</span></div>`;
