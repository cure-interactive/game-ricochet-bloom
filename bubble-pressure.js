// Pressure is measured in pool units, independent of the rendering surface.
export function bubblePressure(body,point,kind,seconds=1,age=0){
 const dx=body.x-point.x,dy=body.y-point.y,d=Math.hypot(dx,dy);
 if(!Number.isFinite(d))return null;
 const reach=kind==='tap'?280:kind==='hold'?160:320;
 const falloff=Math.max(0,1-d/reach);
 if(!falloff)return null;
 const force=kind==='tap'?420*falloff**2+(d<=body.radius?520:0):
  (kind==='hold'?1400:1000*Math.max(0,1-age/1.25))*falloff**2*seconds;
 if(!force)return null;
 const angle=(body.id||0)*2.39996,nx=d>.01?dx/d:Math.cos(angle),ny=d>.01?dy/d:Math.sin(angle);
 return {nx:-nx,ny:-ny,speed:force,vx:nx*force,vy:ny*force};
}

// Passive observation leaves buttons, scrolling and drag owners in control.
export function bubbleContactMount(target,doc,win){
 const options={capture:true,passive:true},listeners=[];
 const on=(node,name,fn)=>{const listener=e=>{if(e?.target?.closest?.('.scroll-indicator')){target.clear();return;}fn(e);};node.addEventListener(name,listener,options);listeners.push([node,name,listener]);};
 on(doc,'touchstart',e=>{for(const t of e.changedTouches)target.contact(`touch:${t.identifier}`,t.clientX,t.clientY,true);});
 on(doc,'touchmove',e=>{for(const t of e.touches)target.contact(`touch:${t.identifier}`,t.clientX,t.clientY);});
 const releaseTouches=e=>{for(const t of e.changedTouches)target.release(`touch:${t.identifier}`);};
 for(const name of ['touchend','touchcancel'])on(doc,name,releaseTouches);
 on(doc,'pointerdown',e=>{if(e.pointerType!=='touch'&&e.button===0)target.contact(e.pointerId,e.clientX,e.clientY,true);});
 on(doc,'pointermove',e=>{if(e.pointerType==='touch')return;if(e.buttons&1)target.contact(e.pointerId,e.clientX,e.clientY);else target.release(e.pointerId);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])on(doc,name,e=>{if(e.pointerType!=='touch')target.release(e.pointerId);});
 on(win,'blur',()=>target.clear());
 return ()=>{for(const [node,name,fn] of listeners)node.removeEventListener(name,fn,options);target.clear();};
}
