import {iconHTML} from './ui-icon.js?v=abfd9b2167cf305a4cba7dbd63aa1fc6464aae57aecc6ffe6b6432448a773031';

// Owned catalogue prices are inspection-only; ownership and equip actions remain separate.
// Free defaults and campaign rewards have no paid catalogue price to reveal.
export function cosmeticPriceHTML(item,owned,showPurchasedCosts=false){
 return owned&&showPurchasedCosts&&Number.isFinite(item.cost)&&item.cost>0
  ?`<span class="cosmetic-price">${iconHTML('coin')}<span>Cost: ${item.cost} Points</span></span>`:'';
}
