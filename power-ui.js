import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=f4899d3bd5ff9863ae40a80efbf8165a13d901cd4597a6be6d3d36e65255cd3b';
import { assetURL } from './asset.js?v=c22292ae9d0ee12d86a26c8723cc5379143c4c5bd035aa93a344b84200318ef1';
import { iconHTML } from './ui-icon.js?v=0bef764d102dc0e159800242f682b3d49abfbf27a976ab9ca47f0d10b1c82188';

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
