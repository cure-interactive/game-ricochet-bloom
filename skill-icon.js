import { assetURL } from './asset.js?v=44f07bd9886229b4c1add0a997ee5abbda938e15cc9bcd29a124a4c5b92753b8';

// The same skill identity is shown on the map, its card and discovery rewards.
export function skillIconURL(node) {
  return assetURL(node.kind==='base' ? `icon/power/${node.power}.svg` : `icon/upgrade/${node.id}.svg`);
}
export const skillIconHTML = node => `<img draggable="false" src="${skillIconURL(node)}" alt="" width="32" height="32">`;
