import {iconHTML} from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';

// Owned catalogue prices are inspection-only; ownership and equip actions remain separate.
// Free defaults and campaign rewards have no paid catalogue price to reveal.
export function cosmeticPriceHTML(item,owned,showPurchasedCosts=false){
 return owned&&showPurchasedCosts&&Number.isFinite(item.cost)&&item.cost>0
  ?`<span class="cosmetic-price">${iconHTML('coin')}<span>Cost: ${item.cost} Points</span></span>`:'';
}
