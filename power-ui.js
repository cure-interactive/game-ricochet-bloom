import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=458c79aff3093649ea2afe0eb37b7e12985acd4da09001bc1a5dcaa8a869557d';
import { assetURL } from './asset.js?v=c168b1bf74896095e10ba96f5c9cfb00449414ce901de7993bd725e00a9bbfea';
import { iconHTML } from './ui-icon.js?v=6ec8a4ba31addd578a8b719304a1ec4bd9a40353abff6d30f299787bf0d2481c';

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
