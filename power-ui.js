import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=effdad3393e29949339e4f680eb50871d4dea3ee2a39ee5c96140de3b1404fee';
import { assetURL } from './asset.js?v=9aa4355875f47659bed1ca495b9cf522c1b1f52eafe4fb135b89de5f59214643';
import { iconHTML } from './ui-icon.js?v=e77c8634175296f7fa7b6ad85ade1b42bdf0d89af6f8099b5d6206fb97d7a067';

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
