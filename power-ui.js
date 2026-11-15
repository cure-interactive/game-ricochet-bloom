import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=514a1bb2de32041b9d992eb1f14445cdb6d4cc4b4eadf2008a4ff26627a5f26d';
import { assetURL } from './asset.js?v=743039c3405a2515f971f201afe1964500b749ddd36b5142733c78e2ae16bc29';
import { iconHTML } from './ui-icon.js?v=8551bed13f7a48d36a919c6b5d9290c16f3a19271f3ead8585eb9fdb1abdae6b';

// An earned slot is a capacity, not a promise that another offer exists.
// Waves can have fewer live bubbles than slots; small power pools can repeat.
export function powerSlots(game) {
  const used=game.isFlying?game.power.used:0,markers=powerMarkers(game),capacity=powerAllowance(game);
  return Array.from({length:3},(_,index)=>{
    const marker=markers[index-used];
    const status=index<used?'used':marker?'ready':index<capacity?'unavailable':'locked';
    const kind=status==='ready'?marker.kind:status==='used'?game.power.collected?.[index]:null;
    const name=kind?POWERS[kind].name:status==='used'?'Power':status==='locked'?'Locked':'No Offer';
    const label=status==='ready'?`${name} · Ready`:status==='used'?`${name} · Collected`:name;
    const image=kind?`<img src="${assetURL(`icon/power/${kind}.svg`)}" alt="" width="24" height="24">`:iconHTML(status==='used'?'power':status==='locked'?'lock':'radio-off');
    const badge=status==='used'?`<i class="power-collected" aria-hidden="true">${iconHTML('check')}</i>`:'';
    return {status,title:status==='ready'?name:label,label:status==='unavailable'?'No available power for this slot':label,html:`${image}${badge}<span>${label}</span>`};
  });
}
