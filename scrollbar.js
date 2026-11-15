// Native scroll positions are the only state; indicators never move the content.
export const SCROLL_SURFACES='dialog,.dialog-body,#main-menu,.overlay,.skin-scroll,.song-list,.tree-detail-body,.campaign-scroll,.track-strip,.reward-scroll,#upgrade-preview,.tree-legend,.skill-tooltip-body,.trial-scroll,.wiki-article,.wave-medal-summary,textarea';
export function scrollbarGeometry(view,total,position,visible=view){
 const track=Math.max(0,visible-8),max=Math.max(0,total-view);
 if(!max||track<16)return null;
 const length=Math.min(track,Math.max(24,track*view/total)),travel=track-length;
 return {length,travel,max,offset:travel*Math.max(0,Math.min(max,position))/max};
}
export function scrollbarsMount(doc=document,win=window){
 const records=new Map();let frame=0,disposed=false;
 const schedule=()=>{if(!disposed&&!frame)frame=win.requestAnimationFrame(refresh);};
 const resize=new win.ResizeObserver(schedule);
 function active(item){win.clearTimeout(item.timer);item.track.dataset.active='true';item.timer=win.setTimeout(()=>{delete item.track.dataset.active;},750);}
 function create(el,axis,layer){
  const track=doc.createElement('div'),thumb=doc.createElement('span');track.className='scroll-indicator';track.dataset.axis=axis;track.setAttribute('aria-hidden','true');track.append(thumb);layer.append(track);
  const item={track,thumb,geometry:null,timer:0};let drag=null;
  const position=()=>axis==='y'?el.scrollTop:Math.abs(el.scrollLeft),point=e=>axis==='y'?e.clientY:e.clientX;
  const move=value=>{const next=Math.max(0,Math.min(item.geometry.max,value));if(axis==='y')el.scrollTop=next;else el.scrollLeft=win.getComputedStyle(el).direction==='rtl'?-next:next;active(item);schedule();};
  track.addEventListener('pointerdown',e=>{
   if(e.button!==0||e.pointerType==='touch'||!item.geometry?.travel)return;
   e.preventDefault();e.stopPropagation();track.setPointerCapture(e.pointerId);
   if(e.target!==thumb){const rect=track.getBoundingClientRect(),start=axis==='y'?rect.top:rect.left;move((point(e)-start-4-item.geometry.length/2)/item.geometry.travel*item.geometry.max);}
   drag={id:e.pointerId,start:point(e),position:position()};active(item);
  });
  track.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId&&item.geometry?.travel){e.preventDefault();move(drag.position+(point(e)-drag.start)/item.geometry.travel*item.geometry.max);}});
  const end=e=>{if(drag?.id===e.pointerId){drag=null;active(item);}};
  track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);track.addEventListener('lostpointercapture',end);
  return item;
 }
 function refresh(){
  frame=0;
  for(const [el,r] of records)if(!el.isConnected||r.items.some(item=>!item.track.isConnected)){resize.unobserve(el);for(const item of r.items){win.clearTimeout(item.timer);item.track.remove();}records.delete(el);}
  for(const el of doc.querySelectorAll(SCROLL_SURFACES))if(!records.has(el)){
   const layer=el.closest('dialog')||doc.body;records.set(el,{items:[create(el,'y',layer),create(el,'x',layer)]});el.dataset.scrollbar='custom';resize.observe(el);
  }
  for(const [el,r] of records){
   const style=win.getComputedStyle(el),rect=el.getBoundingClientRect();
   const visible=rect.width>0&&rect.height>0&&style.visibility!=='hidden'&&!el.closest('[hidden]');
   const clip={left:Math.max(0,rect.left+el.clientLeft),top:Math.max(0,rect.top+el.clientTop),right:Math.min(win.innerWidth,rect.left+el.clientLeft+el.clientWidth),bottom:Math.min(win.innerHeight,rect.top+el.clientTop+el.clientHeight)};
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
    Object.assign(item.track.style,{left:`${vertical?clip.right-14:clip.left}px`,top:`${vertical?clip.top:clip.bottom-14}px`,width:`${vertical?14:clip.right-clip.left}px`,height:`${vertical?clip.bottom-clip.top:14}px`});
    item.thumb.style[vertical?'height':'width']=`${geometry.length}px`;item.thumb.style.transform=`translate${vertical?'Y':'X'}(${geometry.offset}px)`;
   }
  }
 }
 const observer=new win.MutationObserver(changes=>{if(changes.some(r=>!r.target.closest?.('.scroll-indicator')&&(r.type==='attributes'||[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1))))schedule();});
 observer.observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open','hidden','data-screen']});
 const scroll=e=>{const r=records.get(e.target);if(r)for(const item of r.items)if(!item.track.hidden)active(item);schedule();};
 doc.addEventListener('scroll',scroll,true);win.addEventListener('resize',schedule);doc.fonts?.addEventListener('loadingdone',schedule);schedule();
 return ()=>{disposed=true;win.cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();doc.removeEventListener('scroll',scroll,true);win.removeEventListener('resize',schedule);doc.fonts?.removeEventListener('loadingdone',schedule);for(const [el,r] of records){delete el.dataset.scrollbar;for(const item of r.items){win.clearTimeout(item.timer);item.track.remove();}}records.clear();};
}
