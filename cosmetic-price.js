import {iconHTML} from './ui-icon.js?v=c034fd245b2540631902989670ffc7b2e11942d4f3456fce74a63c3ecaf6710f';

// Owned catalogue prices are inspection-only; ownership and equip actions remain separate.
// Free defaults and campaign rewards have no paid catalogue price to reveal.
export function cosmeticPriceHTML(item,owned,showPurchasedCosts=false){
 return owned&&showPurchasedCosts&&Number.isFinite(item.cost)&&item.cost>0
  ?`<span class="cosmetic-price">${iconHTML('coin')}<span>Cost: ${item.cost} Points</span></span>`:'';
}
