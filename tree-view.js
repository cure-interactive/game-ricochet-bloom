// Keep every paint surface viewport-sized; world coordinates are only data.
export function treeViewFrame(camera,viewport){
 const {x,y,scale}=camera,width=Math.max(1,viewport.width),height=Math.max(1,viewport.height);
 const tile=24*scale,fade=Math.max(0,Math.min(1,(scale-.3)/.3)),gridOpacity=fade*fade*(3-2*fade);
 return {width,height,viewBox:[-x/scale,-y/scale,width/scale,height/scale],tile,gridOpacity,backgroundX:((x%tile)+tile)%tile,backgroundY:((y%tile)+tile)%tile,detail:scale<.3?'overview':scale<.55?'compact':'full'};
}
export function treeNodeVisible(point,camera,viewport){
 const x=point.x*camera.scale+camera.x,y=point.y*camera.scale+camera.y,pad=24;
 return x+90*camera.scale>=-pad&&x-90*camera.scale<=viewport.width+pad&&y+110*camera.scale>=-pad&&y-48*camera.scale<=viewport.height+pad;
}
export function treeViewPrepare(map,positions){
 return {links:map.querySelector('.tree-world-links'),nodes:[...map.querySelectorAll('[data-node],[data-player-node]')].map(button=>({button,point:positions[button.dataset.node||button.dataset.playerNode],culled:null})),previous:{}};
}
export function treeViewPaint(map,surface,camera,positions,prepared=treeViewPrepare(map,positions)){
 const viewport={width:surface.clientWidth,height:surface.clientHeight},f=treeViewFrame(camera,viewport);
 const previous=prepared.previous,changed=(key,value,write)=>{if(previous[key]!==value){previous[key]=value;write(value);}};
 for(const [key,value] of Object.entries({width:f.width+'px',height:f.height+'px',backgroundSize:`${f.tile}px ${f.tile}px`,backgroundPosition:`${f.backgroundX}px ${f.backgroundY}px`}))changed(key,value,v=>map.style[key]=v);
 changed('detail',f.detail,v=>map.dataset.detail=v);changed('grid',f.gridOpacity?'visible':'hidden',v=>map.dataset.grid=v);
 for(const [key,value] of Object.entries({'--map-grid-opacity':f.gridOpacity,'--map-scale':camera.scale,'--map-x':camera.x+'px','--map-y':camera.y+'px'}))changed(key,value,v=>map.style.setProperty(key,v));
 if(prepared.links){changed('viewBox',f.viewBox.join(' '),v=>prepared.links.setAttribute('viewBox',v));changed('aspect','none',v=>prepared.links.setAttribute('preserveAspectRatio',v));}
 for(const entry of prepared.nodes){
  const culled=!!entry.point&&!treeNodeVisible(entry.point,camera,viewport);
  if(entry.culled!==culled){entry.culled=culled;entry.button.classList.toggle('is-culled',culled);}
 }
}

// Cache decoded vector sources, never a raster of the world. Two outstanding
// decodes and a bounded source cache keep preparation away from zoom handlers.
const artworkCaches=new WeakMap();
export function treeArtworkCache(win){
 if(artworkCaches.has(win))return artworkCaches.get(win);
 const cached=new Map(),queue=new Set();let scheduled=false,running=0;
 const schedule=()=>{if(scheduled||!queue.size||running>=2)return;scheduled=true;(win.requestIdleCallback||((fn)=>win.setTimeout(fn,32))).call(win,run);};
 function run(){
  scheduled=false;
  while(queue.size&&running<2){
   const url=queue.values().next().value;queue.delete(url);if(cached.has(url))continue;
   const image=new win.Image();image.decoding='async';cached.set(url,image);running++;
   const loaded=typeof image.decode==='function'?null:new Promise(resolve=>{image.onload=resolve;image.onerror=resolve;});
   image.src=url;
   Promise.resolve(loaded||image.decode()).catch(()=>{cached.delete(url);}).finally(()=>{running--;while(cached.size>160)cached.delete(cached.keys().next().value);schedule();});
  }
 }
 const cache={prepare(urls){if(!win.Image)return;for(const url of urls)if(url&&!cached.has(url))queue.add(url);schedule();}};
 artworkCaches.set(win,cache);return cache;
}

// Rebuild references only when the graph changes. Camera state remains immediate
// for input/keyboard math; all DOM projection is coalesced into one frame.
export function treeViewMount(map,surface,afterPaint=()=>{}){
 const win=map.ownerDocument.defaultView,artwork=treeArtworkCache(win);
 let prepared=null,positions={},pending=null,frame=0;
 const stop=()=>{win.cancelAnimationFrame(frame);frame=0;pending=null;};
 return {
  prepare(next){positions=next;prepared=treeViewPrepare(map,positions);artwork.prepare([...map.querySelectorAll('img[src]')].map(image=>image.src));},
  paint(camera,limits){pending={camera:{...camera},limits};if(!frame)frame=win.requestAnimationFrame(()=>{frame=0;const next=pending;pending=null;if(!next||!prepared)return;treeViewPaint(map,surface,next.camera,positions,prepared);afterPaint(next.camera,next.limits);});},
  stop
 };
}
