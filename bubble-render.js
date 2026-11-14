// Shared membrane material for gameplay and player representations.
export function bubbleRender(context, body, points, hue, {isSeed=true,isBubble=false,isPermeable=false,light=0,glowExtent=2.8}={}) {
  const radius=body.radius;
  const glow = context.createRadialGradient(body.x, body.y, radius * .3, body.x, body.y, radius * glowExtent);
  glow.addColorStop(0, hue + (isPermeable ? '0c' : light > .2 ? '70' : isSeed ? '40' : '33')); glow.addColorStop(1, hue + '00');
  context.fillStyle = glow; context.beginPath(); context.arc(body.x, body.y, radius * glowExtent, 0, Math.PI * 2); context.fill();
  const skin = new Path2D();
  const first = points[0], last = points.at(-1); skin.moveTo((first.x + last.x) / 2, (first.y + last.y) / 2);
  for (let index = 0; index < points.length; index++) { const a = points[index], b = points[(index + 1) % points.length]; skin.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2); }
  skin.closePath();
  const fill = context.createRadialGradient(body.x - radius * .35, body.y - radius * .4, 0, body.x, body.y, radius * 1.1);
  fill.addColorStop(0, isPermeable ? hue + '18' : isBubble ? hue + '60' : isSeed ? '#ffffed' : hue + 'bb'); fill.addColorStop(.45, hue + (isPermeable ? '0a' : isBubble ? '28' : isSeed ? 'ee' : '6c')); fill.addColorStop(1, hue + (isPermeable ? '02' : isBubble ? '08' : '20'));
  context.fillStyle = fill; context.strokeStyle = hue + (isPermeable ? '48' : 'c0'); context.lineWidth = isSeed ? 1.6 : 1.1; context.shadowColor = hue; context.shadowBlur = isPermeable ? 2 : (isSeed ? 15 : 7) + light * 20; context.fill(skin); context.stroke(skin); context.shadowBlur = 0;
  context.save(); context.clip(skin);
  // Skin highlight follows the deformed upper-left rim instead of floating on a circle.
  context.beginPath();
  for (let index = 14; index <= 20; index++) { const point = points[index], x = body.x + (point.x - body.x) * .79, y = body.y + (point.y - body.y) * .79; if (index === 14) context.moveTo(x, y); else context.lineTo(x, y); }
  context.strokeStyle = isPermeable ? '#ffffff25' : '#ffffff70'; context.lineWidth = radius * .08; context.lineCap = 'round'; context.lineJoin = 'round'; context.stroke();
  context.restore();
  return skin;
}
