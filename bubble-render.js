import {skinMaterial} from './skin-material.js?v=bc409b859052e7883761eae33f7bea11f825c26547437fd657dc4783cc291fbf';
export function bubblePath(points){
 const path=new Path2D(),first=points[0],last=points.at(-1);
 path.moveTo((first.x+last.x)/2,(first.y+last.y)/2);
 for(let index=0;index<points.length;index++){const a=points[index],b=points[(index+1)%points.length];path.quadraticCurveTo(a.x,a.y,(a.x+b.x)/2,(a.y+b.y)/2);}
 path.closePath();return path;
}
export function bubbleColor(from,to,amount){
  const t=Math.max(0,Math.min(1,amount)),a=from.slice(1).padEnd(8,'f'),b=to.slice(1).padEnd(8,'f');
  return '#'+[0,2,4,6].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
}
// Shared membrane material for gameplay and player representations.
export function bubbleRender(context, body, points, hue, {isSeed=true,isBubble=false,isPermeable=false,light=0,glowExtent=2.8,lowQuality=false,skinStyle='',skinRotation=0,skinTime=0}={}) {
  const radius=body.radius, permeability=Math.max(0,Math.min(1,Number(isPermeable)));
  const alpha=(normal,frozen)=>Math.round(parseInt(normal,16)+(parseInt(frozen,16)-parseInt(normal,16))*permeability).toString(16).padStart(2,'0');
  const glow = context.createRadialGradient(body.x, body.y, radius * .3, body.x, body.y, radius * glowExtent);
  glow.addColorStop(0, hue + alpha(light > .2 ? '70' : isSeed ? '40' : '33','0c')); glow.addColorStop(1, hue + '00');
  context.fillStyle = glow; context.beginPath(); context.arc(body.x, body.y, radius * glowExtent, 0, Math.PI * 2); context.fill();
  const skin = bubblePath(points);
  const fill = context.createRadialGradient(body.x - radius * .35, body.y - radius * .4, 0, body.x, body.y, radius * 1.1);
  fill.addColorStop(0, isSeed&&!isPermeable ? bubbleColor('#ffffed',hue+'60',Number(isBubble)) : hue + alpha(isBubble?'60':isSeed?'ff':'bb','18')); fill.addColorStop(.45, bubbleColor(hue + alpha(isSeed?'ee':'6c','0a'),hue + alpha('28','0a'),Number(isBubble))); fill.addColorStop(1, bubbleColor(hue + alpha('20','02'),hue + alpha('08','02'),Number(isBubble)));
  context.fillStyle = fill; context.strokeStyle = hue + alpha('c0','48'); context.lineWidth = isSeed ? 1.6 : 1.1; context.shadowColor = hue; context.shadowBlur = lowQuality ? 0 : ((isSeed ? 15 : 7) + light * 20)*(1-permeability)+2*permeability; context.fill(skin); context.stroke(skin); context.shadowBlur = 0;
  context.save(); context.clip(skin);
  if(isSeed&&!isPermeable)skinMaterial(context,body,points,skinStyle,skinRotation,skinTime,lowQuality);
  // Skin highlight follows the deformed upper-left rim instead of floating on a circle.
  context.beginPath();
  for (let index = 14; index <= 20; index++) { const point = points[index], x = body.x + (point.x - body.x) * .79, y = body.y + (point.y - body.y) * .79; if (index === 14) context.moveTo(x, y); else context.lineTo(x, y); }
  context.strokeStyle = '#ffffff'+alpha('70','25'); context.lineWidth = radius * .08; context.lineCap = 'round'; context.lineJoin = 'round'; context.stroke();
  context.restore();
  return skin;
}
