import {bubbleRender} from './bubble-render.js?v=997e50dee1966fa389f1522907cc5fcd744d3bb3525669d3e306cec729fe9b34';
import {bubbleStep,bubbleOutline,bubbleFlow} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {RULE,COLORS,POWERS,effectGet,frozenHit,powerMarkers} from './engine.js?v=458c79aff3093649ea2afe0eb37b7e12985acd4da09001bc1a5dcaa8a869557d';
import {regionFrozen} from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import {BUBBLE_ROLES,bubbleRole} from './music.js?v=f7242d62cbdb10208c01d67fbb890f8a3feebd44c08971b2dc574fe5d49ea9fb';
import {assetURL} from './asset.js?v=c168b1bf74896095e10ba96f5c9cfb00449414ce901de7993bd725e00a9bbfea';
let sharedIcons;
export function poolBubbleIcons(){
 return sharedIcons??=Object.fromEntries([['powerIcons','power',Object.keys(POWERS)],['roleIcons','ui',Object.keys(BUBBLE_ROLES)]].map(([name,folder,kinds])=>[name,Object.fromEntries(kinds.map(kind=>{const icon=new Image();icon.src=new URL(assetURL(`./icon/${folder}/${kind}.svg`),import.meta.url).href;return [kind,icon];}))]));
}
// Frost is attached to the actual membrane and clipped inside its surface.
function frostRender(context,body, points, skin, frost,isGentle) {
  const radius = body.radius;
  context.save(); context.globalAlpha = frost * (isGentle ? .8 : 1);
  const rim = context.createLinearGradient(body.x - radius, body.y - radius, body.x + radius, body.y + radius);
  rim.addColorStop(0, '#f1fcffdd'); rim.addColorStop(.45, '#c5eeff99'); rim.addColorStop(1, '#83c9e875');
  context.strokeStyle = rim; context.lineWidth = radius * .34; context.stroke(skin);
  context.strokeStyle = '#f0fcffe0'; context.lineWidth = radius * .065; context.stroke(skin);
  // Stable fine grains and short branching crystals, never flickering particles.
  for (let index = 0; index < 72; index++) {
    const segment = index % points.length, point = points[segment], next = points[(segment + 1) % points.length];
    const fraction = ((index * 37 + body.id * 11) % 97) / 97, depth = .82 + ((index * 19 + body.id * 7) % 23) / 150;
    const x = body.x + ((point.x + (next.x - point.x) * fraction) - body.x) * depth;
    const y = body.y + ((point.y + (next.y - point.y) * fraction) - body.y) * depth;
    context.fillStyle = index % 3 ? '#edfbff90' : '#ffffffd0';
    context.beginPath(); context.arc(x, y, radius * (index % 4 ? .012 : .022), 0, Math.PI * 2); context.fill();
  }
  context.strokeStyle = '#e4f8ffb0'; context.lineWidth = radius * .018; context.lineCap = 'round';
  for (let index = 0; index < points.length; index += 3) {
    const point = points[index], dx = point.x - body.x, dy = point.y - body.y;
    const x = body.x + dx * .94, y = body.y + dy * .94;
    context.beginPath(); context.moveTo(x, y); context.lineTo(body.x + dx * .77, body.y + dy * .77);
    context.moveTo(body.x + dx * .85, body.y + dy * .85); context.lineTo(x - dy * .06, y + dx * .06);
    context.moveTo(body.x + dx * .85, body.y + dy * .85); context.lineTo(x + dy * .06, y - dx * .06); context.stroke();
  }
  context.restore();
}
export function poolBubbleRender(context,game,body,membrane,dt,time,{gentle:isGentle=false,skinColor='#f1f9d7',portrait:portraitView=false,replayGlow=0,markings=true,icons=null}={}) {
  const {powerIcons,roleIcons}=markings?(icons||poolBubbleIcons()):{};
  const isSeed = body.id <= 0, isBubble = body.id === 0 && !!effectGet(game, 'bubble'), hue = isSeed ? body.id === -3 ? POWERS.echo.color : body.id < 0 ? POWERS.split.color : isBubble ? POWERS.bubble.color : (skinColor||'#f1f9d7') : COLORS[body.tone], radius = body.radius;
  const isPermeable = !isSeed && frozenHit(game, body.id);
  membrane.glow = Math.max(0, membrane.glow - dt * 1.4);
  const light = Math.max(membrane.glow, replayGlow);
  bubbleStep(membrane, body, dt, isGentle, isGentle ? undefined : bubbleFlow(body, game.bodies), !isSeed && (!!effectGet(game, 'stasis')?.targets.includes(body.id)||regionFrozen(game,body.id)));
  const points = bubbleOutline(membrane, body).map(point => ({ x: Math.max(RULE.inset, Math.min(RULE.width - RULE.inset, point.x)), y: Math.max(RULE.inset, Math.min(RULE.height - RULE.inset, point.y)) }));
  const skin = bubbleRender(context, body, points, hue, {isSeed,isBubble,isPermeable,light});
  context.save(); context.clip(skin);
  if (!isSeed) {
    // A pearly nucleus and drifting flecks make each bubble feel inhabited.
    const x = body.x + membrane.core[0], y = body.y + radius * .1 + membrane.core[1];
    const nucleus = context.createRadialGradient(x, y, 0, x, y, radius * .34); nucleus.addColorStop(0, hue + (isPermeable ? '20' : 'd0')); nucleus.addColorStop(1, hue + '00'); context.fillStyle = nucleus; context.beginPath(); context.arc(x, y, radius * .34, 0, Math.PI * 2); context.fill();
    for (let index = 0; index < 5; index++) { const point = points[(index * 5 + body.id) % points.length]; context.beginPath(); context.arc(x + (point.x - body.x) * .45, y + (point.y - body.y) * .4, 1.4, 0, Math.PI * 2); context.fillStyle = hue + (isPermeable ? '25' : 'a0'); context.fill(); }
  }
  if (!isSeed && membrane.frost > .01) frostRender(context,body, points, skin, membrane.frost,isGentle);
  if (isBubble) {
    // Keep overlapping bubbles visible through the pressure shell and its small core.
    const coreRadius = effectGet(game, 'split') ? 10 : RULE.seedRadius;
    const core = context.createRadialGradient(body.x, body.y, 0, body.x, body.y, coreRadius * 1.5);
    core.addColorStop(0, '#ffffede0'); core.addColorStop(.5, '#ddfff4a0'); core.addColorStop(1, '#aaeaff00');
    context.fillStyle = core; context.beginPath(); context.arc(body.x, body.y, coreRadius * 1.5, 0, Math.PI * 2); context.fill();
    // Pearly bands follow the existing soft-body outline, including impact flattening.
    const pearl = context.createLinearGradient(body.x - radius, body.y - radius, body.x + radius, body.y + radius);
    for (const [stop, color] of [[0, '#ffe4fd'], [.3, '#c4b2ff'], [.6, '#9ff9ee'], [1, '#fff4c0']]) pearl.addColorStop(stop, color);
    context.strokeStyle = pearl; context.lineWidth = isGentle ? 2.5 : 4; context.globalAlpha = isGentle ? .55 : .85; context.stroke(skin);
    context.lineWidth = 1.5; context.globalAlpha = .5;
    for (const [start, end] of [[1, 8], [12, 18]]) {
      context.beginPath();
      for (let i = start; i <= end; i++) { const point = points[i], x = body.x + (point.x - body.x) * .88, y = body.y + (point.y - body.y) * .88; if (i === start) context.moveTo(x, y); else context.lineTo(x, y); }
      context.stroke();
    }
  }
  context.restore();
  if (!isSeed && membrane.frost > .03 && (!effectGet(game, 'stasis') || effectGet(game, 'stasis').seconds < 1)) {
    context.save(); context.fillStyle = '#d5f5ff';
    for (let i = 0; i < (isGentle ? 2 : 6); i++) {
      const phase = isGentle ? .3 : (time * .8 + i * .17 + body.id * .11) % 1, angle = i * Math.PI / 3 + body.id;
      const distance = radius + 3 + phase * (isGentle ? 3 : 18);
      context.globalAlpha = membrane.frost * (1 - phase) * (isGentle ? .3 : .65);
      context.beginPath(); context.arc(body.x + Math.cos(angle) * distance, body.y + Math.sin(angle) * distance + phase * 8, 1.6 * (1 - phase) + .4, 0, Math.PI * 2); context.fill();
    }
    context.restore();
  }
  const marker = powerMarkers(game).find(marker => marker.target === body.id);
  if(markings&&!isSeed) {
    const role=bubbleRole(body.id),icon=roleIcons[role],size=marker?18:Math.min(32,body.radius*1.25),y=marker?Math.min(body.radius*.68,body.radius-size*.5):0;
    context.save();if(isPermeable)context.globalAlpha=.35;context.translate(body.x,body.y);if(portraitView)context.rotate(-Math.PI/2);
    if(icon.complete&&icon.naturalWidth)context.drawImage(icon,-size/2,y-size/2,size,size);
    else {context.fillStyle='#e9ffed';context.font=`${size*.7}px Fredoka,sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(BUBBLE_ROLES[role].name[0],0,y);}
    context.restore();
  }
  if (markings&&marker) {
    const p = POWERS[marker.kind], icon = powerIcons[marker.kind], size = Math.min(52, body.radius * 1.25);
    context.save(); context.translate(body.x,body.y);if(portraitView)context.rotate(-Math.PI/2);context.shadowColor = p.color; context.shadowBlur = isGentle ? 0 : 12;
    if (icon.complete && icon.naturalWidth) context.drawImage(icon, -size / 2, -size / 2, size, size);
    else { context.fillStyle = '#f3fff5'; context.font = '32px Arial'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(p.symbol, 0, 0); }
    context.restore();
  }
  if (!isSeed && game.chain.includes(body.id)) { context.strokeStyle = hue + (isPermeable ? '28' : '88'); context.lineWidth = 1; context.beginPath(); for (const [index, point] of points.entries()) { const x = body.x + (point.x - body.x) * 1.1, y = body.y + (point.y - body.y) * 1.1; if (!index) context.moveTo(x, y); else context.lineTo(x, y); } context.closePath(); context.stroke(); }
}
