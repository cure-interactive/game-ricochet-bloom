import { assetURL } from './asset.js?v=3cbfab492cc37c59b11a7e7ee1809773bc384873f2e900d7d5fa6526e0af4b91';
import { MEDAL_NAMES, medalRank } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function medalIcon(name){return MEDAL_NAMES.includes(name)?`<img class="medal-icon" src="${assetURL(`icon/medal/${name.toLowerCase()}.svg`)}" width="40" height="48" alt="" aria-hidden="true">`:'';}
export function medalBadge(name){return name?`<span class="medal-badge">${medalIcon(name)}<strong>${escape(name)} Medal</strong></span>`:'';}
export function medalConditionsHTML(conditions,earned=null){
  return `<ul class="medal-conditions" aria-label="Medal conditions">${conditions.map(c=>`<li class="${medalRank(earned)>=medalRank(c.name)?'is-reached':''}">${medalIcon(c.name)}<span><strong>${c.name}${medalRank(earned)>=medalRank(c.name)?' ✓':''}</strong><small>${escape(c.text)}</small></span></li>`).join('')}</ul>`;
}
