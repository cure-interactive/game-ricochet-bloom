// One parent transform moves fixed world coordinates. The SVG is a clipped window,
// never a world-sized surface; neither it nor the world is force-promoted to a bitmap.
export function treeLabelDetail(scale,previous={}){
 // CSS pixels decide legibility; DPR decides sampling, not the text's size.
 // Match tree.css's regular/base/cost type sizes. Half a pixel of hysteresis
 // prevents tiny pinch reversals from repeatedly fading labels in and out.
 const readable=(font,was)=>font*scale>=(was===undefined?8:was?7.5:8.5);
 const labels=readable(12,previous.labels===undefined?undefined:previous.labels==='all')?'all':readable(15,previous.labels===undefined?undefined:previous.labels!=='none')?'primary':'none';
 const costs=readable(11,previous.costs===undefined?undefined:previous.costs==='visible')?'visible':'hidden';
 return {labels,costs};
}
export function treeViewFrame(camera,viewport,previous){
 const {x,y,scale}=camera,width=Math.max(1,viewport.width),height=Math.max(1,viewport.height);
 const tile=24*scale,fade=Math.max(0,Math.min(1,(scale-.3)/.3)),gridOpacity=fade*fade*(3-2*fade);
 return {width,height,viewBox:[-x/scale,-y/scale,width/scale,height/scale],tile,gridOpacity,backgroundX:((x%tile)+tile)%tile,backgroundY:((y%tile)+tile)%tile,detail:scale<.3?'overview':scale<.55?'compact':'full',...treeLabelDetail(scale,previous)};
}
export function treeNodeVisible(point,camera,viewport){
 const x=point.x*camera.scale+camera.x,y=point.y*camera.scale+camera.y,pad=24;
 return x+90*camera.scale>=-pad&&x-90*camera.scale<=viewport.width+pad&&y+110*camera.scale>=-pad&&y-48*camera.scale<=viewport.height+pad;
}
export function treeViewPrepare(map,positions){
 return {world:map.querySelector('.tree-world'),links:map.querySelector('.tree-world-links'),nodes:[...map.querySelectorAll('[data-node],[data-player-node]')].map(button=>({button,point:positions[button.dataset.node||button.dataset.playerNode],culled:null})),previous:{}};
}
export function treeViewPaint(map,viewport,camera,positions,prepared=treeViewPrepare(map,positions)){
 const f=treeViewFrame(camera,viewport,prepared.previous);
 const previous=prepared.previous,changed=(key,value,write)=>{if(previous[key]!==value){previous[key]=value;write(value);}};
 for(const [key,value] of Object.entries({width:f.width+'px',height:f.height+'px',backgroundSize:`${f.tile}px ${f.tile}px`,backgroundPosition:`${f.backgroundX}px ${f.backgroundY}px`}))changed(key,value,v=>map.style[key]=v);
 changed('detail',f.detail,v=>map.dataset.detail=v);changed('grid',f.gridOpacity?'visible':'hidden',v=>map.dataset.grid=v);
 changed('labels',f.labels,v=>map.dataset.labels=v);changed('costs',f.costs,v=>map.dataset.costs=v);
 changed('opacity',f.gridOpacity,v=>map.style.setProperty('--map-grid-opacity',v));
 changed('transform',`translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`,v=>prepared.world.style.transform=v);
 if(prepared.links){
  const [left,top,width,height]=f.viewBox;
  for(const [key,value] of Object.entries({left,top,width,height}))changed('link-'+key,value,v=>prepared.links.style[key]=v+'px');
  changed('viewBox',f.viewBox.join(' '),v=>prepared.links.setAttribute('viewBox',v));changed('aspect','none',v=>prepared.links.setAttribute('preserveAspectRatio',v));}
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
export function treeViewMount(map,afterPaint=()=>{}){
 const win=map.ownerDocument.defaultView,artwork=treeArtworkCache(win);
 let prepared=null,positions={},pending=null,frame=0;
 const stop=()=>{win.cancelAnimationFrame(frame);frame=0;pending=null;};
 return {
  prepare(next){positions=next;prepared=treeViewPrepare(map,positions);artwork.prepare([...map.querySelectorAll('img[src]')].map(image=>image.src));},
  paint(camera,limits){pending={camera:{...camera},limits};if(!frame)frame=win.requestAnimationFrame(()=>{frame=0;const next=pending;pending=null;if(!next||!prepared)return;treeViewPaint(map,next.limits.viewport,next.camera,positions,prepared);afterPaint(next.camera,next.limits);});},
  stop
 };
}
