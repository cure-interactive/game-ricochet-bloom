import { POWERS, powerAllowance, powerMarkers } from './engine.js?v=8f3aec315f5641fc3607ff24db94ba5aedb253a753d259fc501c3a6fe65cad8a';
import { assetURL } from './asset.js?v=6bd4d1d7502ba20bf95bc75985c2a8694fbab62f24ccc87e2722225697137195';
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
