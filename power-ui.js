import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=27a29e6d2cba5ed4d8a714591cb6751bcf16bb1cea5790adfc71e5146d80876e';
import { assetURL } from './asset.js?v=088862b3a656c6f1107998eef742251f591f278feccffeabbe3a08e65a29731d';
import { iconHTML } from './ui-icon.js?v=23254d5124a1e10208687f81fc9971554edfeeb2b34e4c17b4d273dc2d5cad13';

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
