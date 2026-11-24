import {treeViewMount} from './tree-view.js?v=cf4a83d5e9bfee5a1cc6f7cbe3396039f6bd5b3e6236e3b7698e083f46dd7400';
import {mapCameraMount,nearestMapNode} from './tree-map.js?v=7ec02d1e9cd146b9e061b453c9b7b2376be706aed2d2d0ad8b925ca88451890f';
import {skillLegendHTML} from './skill-card.js?v=2ffb51d51272071e2e51321296585cd0a1e5926c1210d0317f7b874baa04f5fd';
import {screenHeader} from './screen-header.js?v=99cfd402003799b85eaeb2a5afd90ecc1eb626d4b6e0806dd786051e8bc42dae';
import {buttonHTML} from './ui-icon.js?v=324dce74106ed866c8abbd0837e0785412b1fc777eeca643ac6a1aa351f837c4';

const button=(action,label,icon)=>buttonHTML(label,icon,{'aria-label':label,'data-tree-action':action});
// Both skill domains provide graph/state/actions; this owner supplies the map UI.
export function skillTreeHTML(kind){
 const player=kind==='player',legend=player?'player-legend-content':'tree-legend-content',tooltip=player?'player-skill-tooltip':'skill-tooltip',title=player?'player-skill-title':'skill-tooltip-title';
 return screenHeader({icon:'skill-tree',className:'tree-heading',title:'Skills',back:button('back','Back','arrow-left'),actions:'<div class="tree-wallet-summary"></div>'})+
 `<p class="tree-status sr-only" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected ${player?'player':'power'} tree"><div class="tree-map-stage">${skillLegendHTML(legend)}<div class="tree-map-scroll" tabindex="0" aria-label="${player?'Player skill':'Skills'} map. Drag to pan; pinch or scroll to zoom. Arrow keys move between skills."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map Controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom Out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map Zoom"></output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div></div></section></div><footer class="tree-map-hint">Tap a skill for details · Drag to move · Pinch or scroll to zoom</footer><section id="${tooltip}" class="skill-tooltip" role="dialog" aria-modal="false" aria-labelledby="${title}" hidden></section>`;
}
export function skillTreeMount(dialog,world,{selected,onMove}){
 const surface=dialog.querySelector('.tree-map-scroll'),map=dialog.querySelector('.tree-map');
 let positions={},lastView=null;
 const projection=treeViewMount(map,(view,limits)=>{
  dialog.querySelector('.tree-zoom').textContent=Math.round(view.scale*100)+'%';
  dialog.querySelector('[data-tree-action=zoom-out]').disabled=view.scale<=limits.minScale+1e-6;
  dialog.querySelector('[data-tree-action=zoom-in]').disabled=view.scale>=1.799;
 });
 const camera=mapCameraMount(surface,world,(view,limits)=>{
  if(lastView&&(view.x!==lastView.x||view.y!==lastView.y||view.scale!==lastView.scale))onMove();
  lastView={...view};projection.paint(view,limits);
 });
 const node=event=>event.target.closest('[data-node],[data-player-node]'),id=button=>button.dataset.node||button.dataset.playerNode;
 const find=key=>[...map.querySelectorAll('.skill-node')].find(button=>id(button)===key);
 surface.addEventListener('focusin',event=>{const button=node(event);if(button?.matches(':focus-visible')&&positions[id(button)])camera.ensure(positions[id(button)]);});
 surface.addEventListener('keydown',event=>{
  const from=node(event),direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(!from||!direction)return;
  const next=nearestMapNode(positions,id(from),...direction);
  if(next){event.preventDefault();camera.ensure(positions[next]);find(next)?.focus({preventScroll:true});}
 });
 dialog.addEventListener('click',event=>{
  const action=event.target.closest('[data-tree-action]')?.dataset.treeAction;
  if(action==='zoom-in'||action==='zoom-out')camera.zoom(action==='zoom-in'?1.25:.8);
  else if(action==='fit')camera.fit();
  else if(action==='focus'&&positions[selected()])camera.focus(positions[selected()],1);
 });
 dialog.addEventListener('close',()=>{onMove();camera.cancel();projection.stop();});
 const win=dialog.ownerDocument.defaultView;let viewport={width:win.innerWidth,height:win.innerHeight};
 win.addEventListener('resize',()=>{if(viewport.width!==win.innerWidth||viewport.height!==win.innerHeight)onMove();viewport={width:win.innerWidth,height:win.innerHeight};});
 dialog.ownerDocument.addEventListener('visibilitychange',()=>{if(dialog.ownerDocument.hidden)onMove();});
 return {camera,
  render(next,nodes,links){
   positions=next;
   map.innerHTML=`<div class="tree-world"><svg class="tree-world-links" aria-hidden="true">${links}</svg>${nodes}</div>`;
   projection.prepare(positions);
  },
  select(key,route){
   for(const button of map.querySelectorAll('.skill-node')){button.classList.toggle('is-route',route.has(id(button)));button.setAttribute('aria-pressed',String(id(button)===key));}
   for(const path of map.querySelectorAll('.tree-world-links path'))path.classList.toggle('is-route',route.has(path.dataset.from)&&route.has(path.dataset.to));
  }
 };
}
