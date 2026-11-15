// Native scroll positions remain authoritative, including thumb drag and fling.
export const SCROLL_SURFACES='dialog,.dialog-body,#main-menu,.overlay,.skin-scroll,.cosmetic-choice-scroll,.song-list,.tree-detail-body,.campaign-scroll,.track-strip,.reward-scroll,#upgrade-preview,.tree-legend,.skill-tooltip-body,.trial-scroll,.wiki-article,.wave-medal-summary,textarea';
export function scrollbarGeometry(view,total,position,visible=view){
 const track=Math.max(0,visible-8),max=Math.max(0,total-view);
 if(!max||track<16)return null;
 const length=Math.min(track,Math.max(24,track*view/total)),travel=track-length;
 return {length,travel,max,offset:travel*Math.max(0,Math.min(max,position))/max};
}
export function scrollbarInput(track,thumb,{geometry,position,move,active,view},win=window){
 let drag=null,momentum=0,lastTime=0,velocity=0;
 const point=e=>track.dataset.axis==='y'?e.clientY:e.clientX;
 const stop=()=>{win.cancelAnimationFrame(momentum);momentum=0;velocity=0;};
 function coast(time){
  momentum=0;const g=geometry();if(!g||track.hidden)return;
  const dt=Math.min(32,Math.max(0,time-lastTime));lastTime=time;
  const before=position();move(before+velocity*dt);velocity*=Math.exp(-dt/240);
  if(Math.abs(velocity)>.015&&Math.abs(position()-before)>.01)momentum=win.requestAnimationFrame(coast);
 }
 const down=e=>{
  if(e.button!==0||drag||!geometry()?.travel)return;
  stop();e.preventDefault();e.stopPropagation();track.setPointerCapture(e.pointerId);
  const g=geometry(),rect=track.getBoundingClientRect(),start=track.dataset.axis==='y'?rect.top:rect.left;
  const local=point(e)-start-4;
  const onThumb=local>=g.offset&&local<=g.offset+g.length;
  if(!onThumb)move((local-g.length/2)/g.travel*g.max);
  drag={id:e.pointerId,start:point(e),position:position(),last:point(e),time:e.timeStamp,velocity:0,moved:false};track.dataset.held='true';active();
 };
 const moving=e=>{
  const g=geometry();if(drag?.id!==e.pointerId||!g?.travel)return;
  e.preventDefault();e.stopPropagation();const p=point(e),dt=e.timeStamp-drag.time;
  if(dt>0){const limit=Math.max(1,view()/180);drag.velocity=Math.max(-limit,Math.min(limit,(p-drag.last)/dt/g.travel*g.max));}
  drag.moved||=Math.abs(p-drag.start)>3;drag.last=p;drag.time=e.timeStamp;
  move(drag.position+(p-drag.start)/g.travel*g.max);
 };
 const end=e=>{
  if(drag?.id!==e.pointerId)return;
  const fling=e.type==='pointerup'&&drag.moved&&e.timeStamp-drag.time<100;
  velocity=fling?drag.velocity:0;drag=null;delete track.dataset.held;active();
  if(track.hasPointerCapture?.(e.pointerId))track.releasePointerCapture(e.pointerId);
  if(fling&&Math.abs(velocity)>.015){lastTime=win.performance.now();momentum=win.requestAnimationFrame(coast);}
 };
 const cancel=()=>{const id=drag?.id;drag=null;delete track.dataset.held;if(id!==undefined&&track.hasPointerCapture?.(id))track.releasePointerCapture(id);stop();};
 const interrupt=e=>{if(!track.contains(e.target))cancel();};
 track.addEventListener('pointerdown',down);track.addEventListener('pointermove',moving);
 for(const name of ['pointerup','pointercancel','lostpointercapture'])track.addEventListener(name,end);
 track.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});
 const doc=track.ownerDocument;doc.addEventListener('pointerdown',interrupt,true);doc.addEventListener('wheel',cancel,{passive:true});doc.addEventListener('visibilitychange',cancel);win.addEventListener('blur',cancel);
 return ()=>{cancel();doc.removeEventListener('pointerdown',interrupt,true);doc.removeEventListener('wheel',cancel);doc.removeEventListener('visibilitychange',cancel);win.removeEventListener('blur',cancel);};
}
export function scrollbarsMount(doc=document,win=window){
 const records=new Map();let frame=0,disposed=false;
 const schedule=()=>{if(!disposed&&!frame)frame=win.requestAnimationFrame(refresh);};
 const resize=new win.ResizeObserver(schedule);
 function active(item){win.clearTimeout(item.timer);item.track.dataset.active='true';item.timer=win.setTimeout(()=>{delete item.track.dataset.active;},750);}
 function create(el,axis,layer){
  const track=doc.createElement('div'),thumb=doc.createElement('span');track.className='scroll-indicator';track.dataset.axis=axis;track.setAttribute('aria-hidden','true');track.append(thumb);layer.append(track);
  const item={track,thumb,geometry:null,timer:0};
  const position=()=>axis==='y'?el.scrollTop:Math.abs(el.scrollLeft);
  const move=value=>{const next=Math.max(0,Math.min(item.geometry.max,value));if(axis==='y')el.scrollTop=next;else el.scrollLeft=win.getComputedStyle(el).direction==='rtl'?-next:next;active(item);schedule();};
  item.dispose=scrollbarInput(track,thumb,{geometry:()=>item.geometry,position,move,active:()=>active(item),view:()=>axis==='y'?el.clientHeight:el.clientWidth},win);
  return item;
 }
 function refresh(){
  frame=0;
  for(const [el,r] of records)if(!el.isConnected||r.items.some(item=>!item.track.isConnected)){resize.unobserve(el);for(const item of r.items){item.dispose();win.clearTimeout(item.timer);item.track.remove();}records.delete(el);}
  for(const el of doc.querySelectorAll(SCROLL_SURFACES))if(!records.has(el)){
   const layer=el.closest('dialog')||doc.body;records.set(el,{items:[create(el,'y',layer),create(el,'x',layer)]});el.dataset.scrollbar='custom';resize.observe(el);
  }
  for(const [el,r] of records){
   const style=win.getComputedStyle(el),rect=el.getBoundingClientRect();
   const visible=rect.width>0&&rect.height>0&&style.visibility!=='hidden'&&!el.closest('[hidden]');
   const viewport=win.visualViewport,bounds={left:viewport?.offsetLeft||0,top:viewport?.offsetTop||0,right:(viewport?.offsetLeft||0)+(viewport?.width||win.innerWidth),bottom:(viewport?.offsetTop||0)+(viewport?.height||win.innerHeight)};
   const clip={left:Math.max(bounds.left,rect.left+el.clientLeft),top:Math.max(bounds.top,rect.top+el.clientTop),right:Math.min(bounds.right,rect.left+el.clientLeft+el.clientWidth),bottom:Math.min(bounds.bottom,rect.top+el.clientTop+el.clientHeight)};
   for(let parent=el.parentElement;visible&&parent&&parent!==doc.body;parent=parent.parentElement){
    const ps=win.getComputedStyle(parent),pr=parent.getBoundingClientRect();
    if(/auto|scroll|hidden|clip/.test(ps.overflowX)){clip.left=Math.max(clip.left,pr.left+parent.clientLeft);clip.right=Math.min(clip.right,pr.left+parent.clientLeft+parent.clientWidth);}
    if(/auto|scroll|hidden|clip/.test(ps.overflowY)){clip.top=Math.max(clip.top,pr.top+parent.clientTop);clip.bottom=Math.min(clip.bottom,pr.top+parent.clientTop+parent.clientHeight);}
   }
   for(const [index,axis] of ['y','x'].entries()){
    const item=r.items[index],vertical=axis==='y',view=vertical?el.clientHeight:el.clientWidth,total=vertical?el.scrollHeight:el.scrollWidth;
    const geometry=scrollbarGeometry(view,total,vertical?el.scrollTop:Math.abs(el.scrollLeft),vertical?clip.bottom-clip.top:clip.right-clip.left);item.geometry=geometry;
    item.track.hidden=!visible||!/auto|scroll/.test(vertical?style.overflowY:style.overflowX)||!geometry||clip.right<=clip.left||clip.bottom<=clip.top;
    if(item.track.hidden)continue;
    // Dialog children stay in the same top layer as their scroll surface.
    // Use existing blank padding. Some cards put padding on the parent shell,
    // while their scrolling body has none: paint outside that body's content.
    let edge=vertical?clip.right:clip.bottom,lane=Math.min(20,parseFloat(vertical?style.paddingRight:style.paddingBottom)||0);
    if(lane<9)for(let parent=el.parentElement;parent&&parent!==doc.body;parent=parent.parentElement){
     const ps=win.getComputedStyle(parent),pr=parent.getBoundingClientRect();
     const end=(vertical?pr.right:pr.bottom)-(parseFloat(vertical?ps.borderRightWidth:ps.borderBottomWidth)||0),gap=end-(vertical?rect.right:rect.bottom);
     if(gap>=9&&gap<=40){edge=Math.min(vertical?bounds.right:bounds.bottom,end);lane=Math.min(20,gap);break;}
     if(gap>40)break;
    }
    // Reserve both the doubled 6px thumb and its constant 3px edge inset.
    lane=Math.max(9,lane);
    Object.assign(item.track.style,{left:`${vertical?edge-lane:clip.left}px`,top:`${vertical?clip.top:edge-lane}px`,width:`${vertical?lane:clip.right-clip.left}px`,height:`${vertical?clip.bottom-clip.top:lane}px`});
    item.thumb.style[vertical?'height':'width']=`${geometry.length}px`;item.thumb.style.transform=`translate${vertical?'Y':'X'}(${geometry.offset}px)`;
   }
  }
 }
 const observer=new win.MutationObserver(changes=>{if(changes.some(r=>!r.target.closest?.('.scroll-indicator')&&(r.type==='attributes'||[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1))))schedule();});
 observer.observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open','hidden','data-screen']});
 const scroll=e=>{const r=records.get(e.target);if(r)for(const item of r.items)if(!item.track.hidden)active(item);schedule();};
 doc.addEventListener('scroll',scroll,true);win.addEventListener('resize',schedule);win.visualViewport?.addEventListener('resize',schedule);win.visualViewport?.addEventListener('scroll',schedule);doc.fonts?.addEventListener('loadingdone',schedule);schedule();
 return ()=>{disposed=true;win.cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();doc.removeEventListener('scroll',scroll,true);win.removeEventListener('resize',schedule);win.visualViewport?.removeEventListener('resize',schedule);win.visualViewport?.removeEventListener('scroll',schedule);doc.fonts?.removeEventListener('loadingdone',schedule);for(const [el,r] of records){delete el.dataset.scrollbar;for(const item of r.items){item.dispose();win.clearTimeout(item.timer);item.track.remove();}}records.clear();};
}
