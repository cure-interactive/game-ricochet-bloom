import {iconHTML} from './ui-icon.js?v=39eb050cf76d9779d76850df47e75b90e6ea768ba6efccbabc5ce0590715fe46';

// Owned catalogue prices are inspection-only; ownership and equip actions remain separate.
// Free defaults and campaign rewards have no paid catalogue price to reveal.
export function cosmeticPriceHTML(item,owned,showPurchasedCosts=false){
 return owned&&showPurchasedCosts&&Number.isFinite(item.cost)&&item.cost>0
  ?`<span class="cosmetic-price">${iconHTML('coin')}<span>Cost: ${item.cost} Points</span></span>`:'';
}
