import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { assetURL } from './asset.js?v=d550b28d96684af605439d08505831edfd982d0886527d4831cff7ecdf4d0e66';
import { MEDAL_NAMES, medalRank } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
export function medalIcon(name){return MEDAL_NAMES.includes(name)?`<img class="medal-icon" src="${assetURL(`icon/medal/${name.toLowerCase()}.svg`)}" width="40" height="48" alt="" aria-hidden="true">`:'';}
export function medalBadge(name){return name?`<span class="medal-badge">${medalIcon(name)}<strong>${escape(name)} Medal</strong></span>`:'';}
export function medalConditionsHTML(conditions,earned=null){
  return `<ul class="medal-conditions" aria-label="Medal conditions">${conditions.map(c=>`<li class="${medalRank(earned)>=medalRank(c.name)?'is-reached':''}">${medalIcon(c.name)}<span><strong>${c.name}${medalRank(earned)>=medalRank(c.name)?' ✓':''}</strong><small>${escape(c.text)}</small></span></li>`).join('')}</ul>`;
}
