import { escapeHTML as escape } from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
import { assetURL } from './asset.js?v=637716717d2250f0d96d961614bfe2ace0e7a403d7f201f26f134e685de2062c';
import { MEDAL_NAMES, medalRank } from './medal.js?v=97f2ce6ed69f5c8834ecd381128c29d366fdfc9390080f59a05049d77db5f006';
export function medalIcon(name){return MEDAL_NAMES.includes(name)?`<img class="medal-icon" src="${assetURL(`icon/medal/${name.toLowerCase()}.svg`)}" width="40" height="48" alt="" aria-hidden="true">`:'';}
export function medalBadge(name){return name?`<span class="medal-badge">${medalIcon(name)}<strong>${escape(name)} Medal</strong></span>`:'';}
export function medalConditionsHTML(conditions,earned=null){
  return `<ul class="medal-conditions" aria-label="Medal Conditions">${conditions.map(c=>`<li class="${medalRank(earned)>=medalRank(c.name)?'is-reached':''}">${medalIcon(c.name)}<span><strong>${c.name}${medalRank(earned)>=medalRank(c.name)?' ✓':''}</strong><small>${escape(c.text)}</small></span></li>`).join('')}</ul>`;
}
