import { skillConfig } from './skill-effect.js?v=7832dd7c58ba0da9a3d69a6424a04dc4734479b27b6f3ea1f0810fcb589d59d5';
import { DRUNK_SECONDS, waveFalloff, waveRadial, overlapResponse, magnetResponse, drunkSway } from './power-response.js?v=53b3f123d0f0c05341a1eb30cbf1c20f19b251c6a7e30ff0cc4921ddfff73338';

// One explanatory graph per power, replacing only the relevant stat's meter.
// Axes describe inputs and responses, never an upgrade score or a predicted route.
function specification(power) {
 const distance={xLabel:'Distance From Center',xMax:528,xEnd:'528',yMin:0,yMax:125,yLabel:'Strength (% of Base)',note:'Distance in pool units; strength before the speed cap.'};
 switch(power){
 case 'ripple':return {...distance,label:'Falloff',yLabel:'Outward Push (% of Base)'};
 case 'attract':return {...distance,label:'Gathering Shape',yMin:-125,yLabel:'Out + / In − (% of Base)',note:'Example: a bubble of radius 24. Tight Group stops pulling near its center; Loose Ring reverses direction.'};
 case 'vortex':return {...distance,label:'Swirl Strength',yLabel:'Swirl (% of Base)',note:'Tangential push with distance; inward/outward drift is separate.'};
 case 'magnet':return {...distance,label:'Pull Strength',xMax:570,xEnd:'570',yMax:140,yLabel:'Pull (% of Base)',note:'Unhit bubble, radius 24; player radius 14. Pull stops on overlap and outside reach.'};
 case 'bubble':return {label:'Pressure',xLabel:'Shell Overlap',xMax:1,xEnd:'100%',yMin:0,yMax:140,yLabel:'Bubble Push (% of Base)',note:'Deeper overlap pushes harder. Without Impact; the player receives an 18% reaction.'};
 case 'stasis':return {label:'Player Pressure',xLabel:'Overlap With Frozen Bubble',xMax:1,xEnd:'100%',yMin:0,yMax:100,yLabel:'Pressure (% of Base)',note:'After the frozen bubble is hit. Lower pressure bends your path less; speed is preserved.'};
 case 'tether':return {label:'Playerward Pull',xLabel:'Gap From Player Surface',xMax:240,xEnd:'240',yMin:0,yMax:150,yLabel:'Pull (% of Base)',note:'Gap in pool units. Pull eases in, then levels off at a gap of 180.'};
 case 'drunk':return {label:'Sway Width',xLabel:'Time Since Activation',xMax:DRUNK_SECONDS,xEnd:DRUNK_SECONDS+' s',yMin:-70,yMax:70,yLabel:'Heading Offset (°)',note:'Side-to-side heading offset, not a predicted flight path. Speed stays unchanged.'};
 default:return null;
 }
}
export function skillCurveValue(power,c,x){
 if(['ripple','attract','vortex'].includes(power)){
  if(x>=c.reach)return 0;
  if(power==='attract'&&c.a&&x<54)return 0; // Labelled representative bubble radius 24 + 30.
  const force=c.force/640*100*waveFalloff(x,c.reach,c);
  return power==='attract'?force*waveRadial(power,x,c.reach,c):force;
 }
 if(power==='magnet')return x<=38||x>=c.reach?0:c.force/1300*100*magnetResponse(x,c.reach);
 if(power==='bubble'||power==='stasis')return c.pressure*100*overlapResponse(x);
 if(power==='tether')return c.pull/240*100*overlapResponse(Math.min(1,x/180));
 if(power==='drunk')return drunkSway(x,c)*180/Math.PI;
 return 0;
}
export function skillCurve(power,beforeBuild,afterBuild,labels={before:'Current',after:'With Upgrade'}){
 const spec=specification(power);if(!spec)return null;
 const after=skillConfig({build:afterBuild},power),before=beforeBuild?.some(p=>p.power===power)?skillConfig({build:beforeBuild},power):null;
 // Include both sides of discontinuities instead of rounding a ring reversal or range cutoff.
 const xs=new Set(Array.from({length:161},(_,i)=>i/160*spec.xMax));
 for(const c of [before,after].filter(Boolean))for(const x of [c.reach,c.reach*.48,54,38,180])if(x>0&&x<=spec.xMax){xs.add(x);xs.add(Math.max(0,x-.0001));xs.add(Math.min(spec.xMax,x+.0001));}
 const sample=c=>[...xs].sort((a,b)=>a-b).map(x=>[x,skillCurveValue(power,c,x)]);
 const points=sample(after),prior=before?sample(before):null,changed=!!prior&&points.some((p,i)=>Math.abs(p[1]-prior[i][1])>1e-8);
 const describe=p=>[0,.25,.5,.75,1].map(f=>{const x=f*spec.xMax;return `${Number(x.toFixed(2))}: ${Number(skillCurveValue(power,p,x).toFixed(1))}`;}).join('; ');
 return {...spec,points,previous:changed?prior:null,changed,summary:`${spec.xLabel} → ${spec.yLabel}. ${before&&changed?labels.before+': '+describe(before)+'. '+labels.after+': ':''}${describe(after)}. ${spec.note}`};
}
