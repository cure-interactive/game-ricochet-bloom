import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=22d89394af99da05710e30583f742f7d86a2cf848172bee65c6f573a179a0574';
import { assetURL } from './asset.js?v=d550b28d96684af605439d08505831edfd982d0886527d4831cff7ecdf4d0e66';
import { iconHTML } from './ui-icon.js?v=6ec8a4ba31addd578a8b719304a1ec4bd9a40353abff6d30f299787bf0d2481c';

// An earned slot is a capacity, not a promise that another offer exists.
// Waves can have fewer live bubbles or distinct unlocked powers than slots.
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
