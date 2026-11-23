import {assetURL} from './asset.js?v=637716717d2250f0d96d961614bfe2ace0e7a403d7f201f26f134e685de2062c';

// A cache is a rendering of one node's current DOM, never another model of its
// appearance. Native buttons own layout, input, names and focus at every zoom.
export const TREE_RASTER_BYTES=16*1024*1024;
export function treeRasterDensity(scale,dpr,active=false){
 if(!Number.isFinite(scale)||!Number.isFinite(dpr)||scale<=0||dpr<=0||scale>(active?.8:.7))return 0;
 // Resolution buckets cover an entire zoom band, including its upper edge.
 return Math.max(.5,Math.ceil((scale<=.4?.4:.8)*dpr*1.25*2-1e-6)/2);
}
export function treeRasterBudget(limit=TREE_RASTER_BYTES){
 const items=new Map();let bytes=0;
 const remove=key=>{const item=items.get(key);if(item){items.delete(key);bytes-=item.bytes;item.release();}};
 return {
  get bytes(){return bytes;},get size(){return items.size;},has:key=>items.has(key),
  put(key,item,protectedKeys=new Set()){
   remove(key);if(item.bytes>limit)return false;
   for(const candidate of items.keys()){if(bytes+item.bytes<=limit)break;if(!protectedKeys.has(candidate))remove(candidate);}
   if(bytes+item.bytes>limit)return false;
   items.set(key,item);bytes+=item.bytes;return true;
  },remove,clear(){for(const key of items.keys())remove(key);}
 };
}

// Embedded sources are shared by the two trees and bounded independently of
// pixel storage. A failed fetch is retryable on the next tree opening.
const sourceCaches=new WeakMap();
function rasterSources(win){
 if(sourceCaches.has(win))return sourceCaches.get(win);
 const sources=new Map();let bytes=0;
 async function get(url){
  if(sources.has(url))return sources.get(url);
  const response=await win.fetch(url);if(!response.ok)throw Error('Tree artwork unavailable');
  const blob=await response.blob();
  const data=await new Promise((resolve,reject)=>{const reader=new win.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
  // UTF-16 upper bound, including the base64 expansion; no pending request map.
  const size=data.length*2,limit=8*1024*1024;
  if(size<=limit){while(bytes+size>limit&&sources.size){const first=sources.keys().next().value;bytes-=sources.get(first).length*2;sources.delete(first);}if(!sources.has(url)){sources.set(url,data);bytes+=size;}}
  return data;
 }
 sourceCaches.set(win,get);return get;
}

// Copy only properties used by a skill node. This keeps serialization bounded
// and avoids embedding hundreds of unrelated computed properties per child.
const properties=('display position left right top bottom width height min-width min-height max-width max-height box-sizing margin-top margin-right margin-bottom margin-left padding-top padding-right padding-bottom padding-left flex-direction flex-wrap flex-grow flex-shrink flex-basis align-items align-self justify-content justify-self gap grid-column grid-row place-items border-top border-right border-bottom border-left border-radius outline outline-offset background color box-shadow opacity overflow font-family font-size font-style font-weight font-stretch line-height letter-spacing text-align text-transform white-space word-break overflow-wrap vertical-align object-fit filter mask-image mask-size mask-position mask-repeat -webkit-mask-image -webkit-mask-size -webkit-mask-position -webkit-mask-repeat').split(' ');
async function snapshot(button,density,win,sources){
 const doc=button.ownerDocument,pad=32,width=button.offsetWidth+pad*2,height=button.offsetHeight+pad*2;
 const inline=async value=>{for(const match of [...value.matchAll(/url\(["']?([^"')]+)["']?\)/g)])if(!match[1].startsWith('data:'))value=value.replace(match[0],`url("${await sources(new URL(match[1],doc.baseURI).href)}")`);return value;};
 async function copy(element){
  const clone=element.cloneNode(false),style=win.getComputedStyle(element);
  clone.removeAttribute('id');clone.removeAttribute('style');
  for(const name of properties)clone.style.setProperty(name,await inline(style.getPropertyValue(name)));
  clone.style.setProperty('transition','none');clone.style.setProperty('animation','none');
  if(element.tagName==='IMG')clone.setAttribute('src',await sources(element.src));
  for(const child of element.childNodes)if(child.nodeType!==1||!child.classList.contains('tree-node-raster'))clone.append(child.nodeType===1?await copy(child):child.cloneNode());
  return clone;
 }
 await doc.fonts.ready;
 const font=await sources(new URL(assetURL('font/fredoka/Fredoka.ttf'),import.meta.url).href),clone=await copy(button);
 Object.assign(clone.style,{position:'absolute',left:pad+'px',top:pad+'px',right:'auto',bottom:'auto',transform:'none',margin:'0',visibility:'visible',opacity:'1',filter:'none',outline:'none'});
 const xml=new win.XMLSerializer().serializeToString(clone);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(width*density)}" height="${Math.ceil(height*density)}" viewBox="0 0 ${width} ${height}"><foreignObject width="${width}" height="${height}"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:${width}px;height:${height}px"><style>@font-face{font-family:Fredoka;src:url('${font}');font-weight:300 700;font-stretch:75% 125%}</style>${xml}</div></foreignObject></svg>`;
 const image=new win.Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await image.decode();
 const canvas=doc.createElement('canvas');canvas.width=Math.ceil(width*density);canvas.height=Math.ceil(height*density);
 const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)throw Error('Tree canvas unavailable');context.drawImage(image,0,0,canvas.width,canvas.height);
 // Materialize pixels once: do not retain SVG/font display lists in each canvas.
 const pixels=context.getImageData(0,0,canvas.width,canvas.height);canvas.width=canvas.width;context.putImageData(pixels,0,0);image.src='';
 canvas.className='tree-node-raster';canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText=`left:${-pad}px;top:${-pad}px;width:${width}px;height:${height}px`;
 return {canvas,height:height-pad*2,bytes:canvas.width*canvas.height*4};
}

export function treeRasterMount(map,requestPaint){
 const doc=map.ownerDocument,win=doc.defaultView;
 if(!doc.createElement||!doc.fonts||!win.MutationObserver||!win.Image?.prototype.decode)return {prepare(){},paint(){},stop(){}};
 const budget=treeRasterBudget(),sources=rasterSources(win),records=new Map();
 let nodes=[],generation=0,idle=0,timer=0,running=false,active=false,density=0,lastPaint=0,observer=null,densityQuery=null,dpr=win.devicePixelRatio||1;
 const key=button=>button.className.split(/\s+/).filter(name=>name&&name!=='is-culled').join(' ')+'|'+button.getAttribute('style')+'|'+button.getAttribute('aria-pressed');
 // Animated custom artwork (notably the equipped Player bubble) owns live pixels.
 const live=button=>button.matches(':hover,:focus,[aria-pressed=true]')||!!button.querySelector('player-bubble,cosmetic-icon,canvas:not(.tree-node-raster)');
 function discard(button){budget.remove(button);button.removeAttribute('data-raster');}
 function cancel(){win.clearTimeout(timer);timer=0;if(idle){if(win.cancelIdleCallback)win.cancelIdleCallback(idle);else win.clearTimeout(idle);idle=0;}}
 function invalidate(){generation++;cancel();budget.clear();for(const record of records.values()){record.failed=false;record.density=0;}if(active)requestPaint();}
 function watchDensity(){densityQuery?.removeEventListener('change',densityChanged);densityQuery=win.matchMedia?.(`(resolution: ${dpr}dppx)`);densityQuery?.addEventListener('change',densityChanged,{once:true});}
 function densityChanged(){dpr=win.devicePixelRatio||1;watchDensity();invalidate();}
 function schedule(){
  if(!active||!density||idle||timer||running||doc.hidden)return;
  timer=win.setTimeout(()=>{timer=0;if(active&&density&&!doc.hidden)idle=(win.requestIdleCallback||((fn)=>win.setTimeout(()=>fn({timeRemaining:()=>8}),32))).call(win,work);},Math.max(16,100-(win.performance.now()-lastPaint)));
 }
 async function work(deadline){
  idle=0;if(!active||!density||doc.hidden)return;
  // Input takes precedence; no DOM measurement/serialization in a camera frame.
  if(win.performance.now()-lastPaint<100||deadline.timeRemaining()<6){schedule();return;}
  const candidate=nodes.find(n=>!n.culled&&!live(n.button)&&!records.get(n.button)?.failed&&!budget.has(n.button));
  if(!candidate)return;
  const button=candidate.button,record=records.get(button),stamp=generation,state=key(button),resolution=density;
  const protectedKeys=new Set(nodes.filter(n=>!n.culled).map(n=>n.button));
  // Do not churn visible caches when a view cannot fit the budget.
  const estimate=Math.ceil((button.offsetWidth+64)*resolution)*Math.ceil((button.offsetHeight+64)*resolution)*4;
  if(estimate>TREE_RASTER_BYTES||budget.bytes+estimate>TREE_RASTER_BYTES&&[...records.keys()].every(b=>!budget.has(b)||protectedKeys.has(b)))return;
  running=true;
  try{
   const item=await snapshot(button,resolution,win,sources);
   if(!active||doc.hidden||generation!==stamp||density!==resolution||!button.isConnected||state!==key(button)||live(button)||candidate.culled){item.canvas.width=item.canvas.height=0;return;}
   const release=()=>{button.removeAttribute('data-raster');button.style.removeProperty('--tree-raster-height');item.canvas.remove();item.canvas.width=item.canvas.height=0;};
   if(budget.put(button,{bytes:item.bytes,release},protectedKeys)){record.density=resolution;button.style.setProperty('--tree-raster-height',item.height+'px');record.state=key(button);button.append(item.canvas);button.setAttribute('data-raster','');}
   else item.canvas.width=item.canvas.height=0;
  }catch{if(generation===stamp)record.failed=true;} // Keep the original visible on unsupported renderers/assets.
  finally{running=false;schedule();}
 }
 function prepare(next){
  stop();nodes=next;active=true;
  for(const {button} of nodes)records.set(button,{state:key(button),density:0,failed:false});
  observer=new win.MutationObserver(changes=>{
   for(const {target} of changes){const record=records.get(target);if(record&&record.state!==key(target)){record.state=key(target);record.failed=false;discard(target);}}
   schedule();
  });
  for(const {button} of nodes)observer.observe(button,{attributes:true,attributeFilter:['class','style','aria-pressed']});
  watchDensity();
 }
 function paint(next,camera){
  if(!active)prepare(next);
  lastPaint=win.performance.now();
  const nextDpr=win.devicePixelRatio||1;if(nextDpr!==dpr)densityChanged();
  const nextDensity=treeRasterDensity(camera.scale,dpr,!!density);
  if(nextDensity!==density){density=nextDensity;generation++;cancel();map.dataset.raster=density?'cached':'live';for(const {button} of nodes)if(density&&records.get(button).density<density)discard(button);}
  // The cache stays attached to the native button; only the parent moves.
  schedule();
 }
 function stop(){active=false;generation++;cancel();observer?.disconnect();observer=null;densityQuery?.removeEventListener('change',densityChanged);densityQuery=null;budget.clear();records.clear();nodes=[];density=0;delete map.dataset.raster;}
 doc.fonts.addEventListener?.('loadingdone',invalidate);
 win.addEventListener('resize',()=>{if(active&&(win.devicePixelRatio||1)!==dpr)densityChanged();});
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden){cancel();}else if(active){requestPaint();schedule();}});
 return {prepare,paint,stop,get bytes(){return budget.bytes;}};
}
