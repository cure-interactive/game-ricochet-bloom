import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=adc6d69546723ce9f5131bf144815dc0a4f6fc6682ee59318309f9f62ca6bed0';
import { assetURL } from './asset.js?v=637716717d2250f0d96d961614bfe2ace0e7a403d7f201f26f134e685de2062c';
import { iconHTML } from './ui-icon.js?v=68bbe4420b1782da4ec5a87ab925a840c21d5d87a2c31ca133867a512c8d3a0b';

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
