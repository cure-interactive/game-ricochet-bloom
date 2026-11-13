import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=65c3aeb8b35d77545bb169d8304e4db059de3a0597f502e6e135c228e90a8ead';
import { assetURL } from './asset.js?v=ec2dbab27d123b5d86b7970ee597907a2d7edcdaa77c73cdbe84bf4414890fd0';
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
