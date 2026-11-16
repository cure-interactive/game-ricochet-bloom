import {iconHTML} from './ui-icon.js?v=e7e1e0264b8d800aa16ee5e89ddb82b5bd4dfa68327d0cff8b81d788cb47de8c';

// Owned catalogue prices are inspection-only; ownership and equip actions remain separate.
// Free defaults and campaign rewards have no paid catalogue price to reveal.
export function cosmeticPriceHTML(item,owned,showPurchasedCosts=false){
 return owned&&showPurchasedCosts&&Number.isFinite(item.cost)&&item.cost>0
  ?`<span class="cosmetic-price">${iconHTML('coin')}<span>Cost: ${item.cost} Points</span></span>`:'';
}
