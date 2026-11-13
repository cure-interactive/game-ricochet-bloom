import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=3edc2fac5b45d04025b867cc6557d36846c4255efb1c387a4163c5d1fb595b69';
import { assetURL } from './asset.js?v=b3d67cd59b1fb1de0bb8b884bdbe9342d63123b048ea238da59ff590cd8dd959';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

// An earned slot is a capacity, not a promise that another offer exists.
// Waves can have fewer live bubbles or distinct unlocked powers than slots.
export function powerSlots(game) {
  const used=game.isFlying?game.power.used:0,markers=powerMarkers(game),capacity=powerAllowance(game);
  return Array.from({length:3},(_,index)=>{
    const marker=markers[index-used];
    const status=index<used?'used':marker?'ready':index<capacity?'unavailable':'locked';
    const name=status==='ready'?POWERS[marker.kind].name:status==='used'?'Used':status==='locked'?'Locked':'No Offer';
    const label=status==='ready'?`${name} · Ready`:name;
    const image=status==='ready'?`<img src="${assetURL(`icon/power/${marker.kind}.svg`)}" alt="" width="24" height="24">`:iconHTML(status==='used'?'check':status==='locked'?'lock':'radio-off');
    return {status,title:status==='ready'?name:label,label:status==='ready'?label:status==='unavailable'?'No available power for this slot':label,html:`${image}<span>${label}</span>`};
  });
}
