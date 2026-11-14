import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=2dd0f771b37dc76497de4916b6a40d2267fe82b6096fb3b47ff898d77220ee69';
import { assetURL } from './asset.js?v=8c04905bdd9fdbc9633713a7f383c8b55d201f5ca4695ab70460c3942b93956c';
import { iconHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';

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
