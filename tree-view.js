// Keep every paint surface viewport-sized; world coordinates are only data.
export function treeViewFrame(camera,viewport){
 const {x,y,scale}=camera,width=Math.max(1,viewport.width),height=Math.max(1,viewport.height);
 const tile=24*scale,fade=Math.max(0,Math.min(1,(scale-.3)/.3)),gridOpacity=fade*fade*(3-2*fade);
 return {width,height,viewBox:[-x/scale,-y/scale,width/scale,height/scale],tile,gridOpacity,backgroundX:((x%tile)+tile)%tile,backgroundY:((y%tile)+tile)%tile,detail:scale<.3?'overview':'full'};
}
export function treeNodeVisible(point,camera,viewport){
 const x=point.x*camera.scale+camera.x,y=point.y*camera.scale+camera.y,pad=24;
 return x+90*camera.scale>=-pad&&x-90*camera.scale<=viewport.width+pad&&y+110*camera.scale>=-pad&&y-48*camera.scale<=viewport.height+pad;
}
export function treeViewPaint(map,surface,camera,positions){
 const viewport={width:surface.clientWidth,height:surface.clientHeight},f=treeViewFrame(camera,viewport);
 map.style.width=f.width+'px';map.style.height=f.height+'px';map.dataset.detail=f.detail;map.dataset.grid=f.gridOpacity?'visible':'hidden';
 map.style.setProperty('--map-grid-opacity',f.gridOpacity);
 map.style.setProperty('--map-scale',camera.scale);map.style.setProperty('--map-x',camera.x+'px');map.style.setProperty('--map-y',camera.y+'px');
 map.style.backgroundSize=`${f.tile}px ${f.tile}px`;map.style.backgroundPosition=`${f.backgroundX}px ${f.backgroundY}px`;
 const links=map.querySelector('.tree-world-links');if(links){links.setAttribute('viewBox',f.viewBox.join(' '));links.setAttribute('preserveAspectRatio','none');}
 for(const button of map.querySelectorAll('[data-node],[data-player-node]')){
  const point=positions[button.dataset.node||button.dataset.playerNode];
  button.classList.toggle('is-culled',!!point&&!treeNodeVisible(point,camera,viewport));
 }
}
