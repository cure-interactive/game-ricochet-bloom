// Layout is derived from the same single-parent research graph as purchases.
export function treeLayout(powers,nodes) {
 const children=Object.fromEntries(Object.keys(nodes).map(id=>[id,[]]));
 for(const n of Object.values(nodes))for(const parent of n.requires)children[parent].push(n.id);
 const roots=Object.values(nodes).filter(n=>!n.requires.length);
 if(roots.length!==1)throw new Error('Research must have exactly one root');
 const placed=[],queue=[{power:roots[0].power,x:0,y:0}],seen=new Set();
 // Place near branches first, then grow outward. Deep descendants must not
 // pull the first unlock choices off-screen. Reserve each vertical power chain.
 while(queue.length){
  const entry=queue.shift();if(seen.has(entry.power))throw new Error('Research is not a tree');seen.add(entry.power);
  const chain=['base','foundation','a','b','capstone'].map((kind,i)=>({id:entry.power+'.'+kind,power:entry.power,kind,family:powers[entry.power].family,x:entry.x,y:entry.y+i*140}));
  let offset=0,step=0;
  while(chain.some(b=>placed.some(a=>Math.abs(a.y-b.y)<130&&Math.abs(a.x-(b.x+offset))<179))){step++;offset=Math.ceil(step/2)*180*(step%2?-1:1);}
  chain.forEach(n=>{n.x+=offset;placed.push(n);});
  for(const n of chain)for(const child of children[n.id])if(nodes[child].power!==n.power)queue.push({power:nodes[child].power,x:n.x,y:n.y+140});
 }
 if(placed.length!==Object.keys(nodes).length)throw new Error('Disconnected research');
 const left=Math.min(...placed.map(n=>n.x))-100,right=Math.max(...placed.map(n=>n.x))+100;
 const result={width:right-left,height:Math.max(...placed.map(n=>n.y))+240,nodes:{},families:{},edges:[],bridges:[],root:roots[0].id};
 for(const n of placed){n.x-=left;n.y+=90;result.nodes[n.id]=n;}
 for(const n of Object.values(nodes))for(const from of n.requires)result.edges.push({from,to:n.id});
 for(const family of new Set(Object.values(powers).map(p=>p.family))){
  const members=Object.keys(powers).filter(p=>powers[p].family===family),points=placed.filter(n=>n.family===family),x=Math.min(...points.map(n=>n.x))-70,y=Math.min(...points.map(n=>n.y))-60;
  result.families[family]={name:family,powers:members,starter:members[0]+'.base',x,y,width:Math.max(...points.map(n=>n.x))-x+70,height:Math.max(...points.map(n=>n.y))-y+100};
 }
 return result;
}
export function researchRoute(nodes,powers,bridges,id) {
 const route=new Set();
 function visit(key){if(route.has(key)||!nodes[key])return;route.add(key);for(const parent of nodes[key].requires)visit(parent);}
 visit(id);return route;
}
export function cameraClamp(camera,view,world) {
  const scale=Math.max(.05,Math.min(1.8,camera.scale)),axis=(offset,viewport,size)=>size*scale<viewport? (viewport-size*scale)/2:Math.max(viewport-size*scale-80,Math.min(80,offset));
  return {x:axis(camera.x,view.width,world.width),y:axis(camera.y,view.height,world.height),scale};
}
export function cameraZoom(camera,scale,anchor) {
  scale=Math.max(.05,Math.min(1.8,scale));const ratio=scale/camera.scale;
  return {x:anchor.x-(anchor.x-camera.x)*ratio,y:anchor.y-(anchor.y-camera.y)*ratio,scale};
}
export function cameraFit(bounds,view) {
  const scale=Math.max(.05,Math.min(1.2,(view.width-40)/bounds.width,(view.height-40)/bounds.height));
  return {x:(view.width-bounds.width*scale)/2-bounds.x*scale,y:(view.height-bounds.height*scale)/2-bounds.y*scale,scale};
}
export function nearestMapNode(nodes,id,dx,dy) {
  const from=nodes[id];if(!from)return null;
  return Object.values(nodes).filter(n=>n.id!==id).map(n=>{const x=n.x-from.x,y=n.y-from.y;return {id:n.id,forward:x*dx+y*dy,distance:Math.hypot(x,y)+Math.abs(x*dy-y*dx)*2};}).filter(n=>n.forward>1).sort((a,b)=>a.distance-b.distance)[0]?.id||null;
}
export function mapCameraMount(surface,world,change) {
  let camera={x:0,y:0,scale:1},points=new Map(),start=null,suppress=false,animation=null;
  const size=()=>({width:surface.clientWidth,height:surface.clientHeight});
  const local=e=>{const r=surface.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
  const center=ps=>({x:ps.reduce((s,p)=>s+p.x,0)/ps.length,y:ps.reduce((s,p)=>s+p.y,0)/ps.length});
  function apply(next){camera=cameraClamp(next,size(),world);change(camera);}
  function stopAnimation(){if(!animation)return;const current=animation;animation=null;win.cancelAnimationFrame(current.frame);current.resolve(false);}
  function focusTarget(point,scale,vertical){const v=size();return cameraClamp({x:v.width/2-point.x*scale,y:Math.min(140,v.height*vertical)-point.y*scale,scale},v,world);}
  function focusAnimated(point,scale=Math.max(.85,camera.scale),vertical=.25,duration=450){
    cancel();const from={...camera},to=focusTarget(point,scale,vertical);
    if(duration<=0){apply(to);return Promise.resolve(true);}
    return new Promise(resolve=>{
      const motion={resolve,frame:0,started:null};animation=motion;
      const tick=time=>{if(animation!==motion)return;motion.started??=time;const t=Math.min(1,(time-motion.started)/duration),ease=t*t*(3-2*t);
        apply({x:from.x+(to.x-from.x)*ease,y:from.y+(to.y-from.y)*ease,scale:from.scale+(to.scale-from.scale)*ease});
        if(t===1){animation=null;resolve(true);}else motion.frame=win.requestAnimationFrame(tick);
      };
      motion.frame=win.requestAnimationFrame(tick);
    });
  }
  function baseline(){const ps=[...points.values()];start=ps.length?{camera:{...camera},center:center(ps),distance:ps.length>1?Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y):0}:null;}
  function cancel(){stopAnimation();const ids=[...points.keys()];points.clear();start=null;surface.classList.remove('is-panning');for(const id of ids)if(surface.hasPointerCapture(id))surface.releasePointerCapture(id);}
  const end=e=>{if(!points.delete(e.pointerId))return;baseline();if(!points.size)surface.classList.remove('is-panning');};
  surface.addEventListener('pointerdown',e=>{if(e.button!==0)return;stopAnimation();
    // A new primary touch starts a fresh contact sequence, even if an earlier
    // release was swallowed by browser UI or an interrupted capture.
    if(e.pointerType==='touch'&&e.isPrimary)cancel();
    if(!points.size)suppress=false;points.set(e.pointerId,local(e));baseline();if(points.size>1)suppress=true;
  });
  surface.addEventListener('pointermove',e=>{
    if(e.buttons===0){end(e);return;}
    if(!points.has(e.pointerId)||!start)return;points.set(e.pointerId,local(e));const ps=[...points.values()],mid=center(ps),dx=mid.x-start.center.x,dy=mid.y-start.center.y;
    if(ps.length===1&&!suppress&&Math.hypot(dx,dy)<6)return;
    suppress=true;e.preventDefault();surface.classList.add('is-panning');if(!surface.hasPointerCapture(e.pointerId))surface.setPointerCapture(e.pointerId);
    let next={...start.camera};if(ps.length>1&&start.distance>0)next=cameraZoom(next,next.scale*Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y)/start.distance,start.center);
    apply({...next,x:next.x+dx,y:next.y+dy});
  });
  for(const event of ['pointerup','pointercancel'])surface.addEventListener(event,end);
  // Touch capture moves from the hit child to this surface when dragging starts.
  // The child's bubbling loss is a handoff, not the end of the active gesture.
  surface.addEventListener('lostpointercapture',e=>{if(e.target===surface||!surface.hasPointerCapture(e.pointerId))end(e);});
  const doc=surface.ownerDocument,win=doc.defaultView;
  // Observe releases even before the drag threshold transfers capture to the
  // surface. Ignore unrelated releases so they cannot rebase an active pinch.
  for(const event of ['pointerup','pointercancel'])win.addEventListener(event,end,true);
  for(const event of ['blur','pagehide'])win.addEventListener(event,cancel);
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)cancel();});
  // Safari's touch list also lets us recover a missed pointer-end notification.
  for(const event of ['touchend','touchcancel'])win.addEventListener(event,e=>{if(e.touches.length===0)cancel();},{capture:true,passive:true});
  surface.addEventListener('click',e=>{if(suppress&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();}},true);
  surface.addEventListener('wheel',e=>{stopAnimation();e.preventDefault();suppress=true;if(e.shiftKey)apply({...camera,x:camera.x-e.deltaY,y:camera.y-e.deltaX});else apply(cameraZoom(camera,camera.scale*Math.exp(-Math.max(-150,Math.min(150,e.deltaY))*.003),local(e)));},{passive:false});
  surface.addEventListener('keydown',e=>{if(e.target!==surface)return;const move={ArrowLeft:[80,0],ArrowRight:[-80,0],ArrowUp:[0,80],ArrowDown:[0,-80]}[e.key];if(move){stopAnimation();e.preventDefault();apply({...camera,x:camera.x+move[0],y:camera.y+move[1]});}});
  const observer=new ResizeObserver(()=>{if(surface.clientWidth&&surface.clientHeight){stopAnimation();apply(camera);}});observer.observe(surface);
  return {get value(){return {...camera};},zoom(factor){stopAnimation();const v=size();apply(cameraZoom(camera,camera.scale*factor,{x:v.width/2,y:v.height/2}));},focus(point,scale=Math.max(.85,camera.scale),vertical=.25){stopAnimation();apply(focusTarget(point,scale,vertical));},focusAnimated,fit(bounds={x:0,y:0,width:world.width,height:world.height}){stopAnimation();apply(cameraFit(bounds,size()));},ensure(point){const v=size(),x=point.x*camera.scale+camera.x,y=point.y*camera.scale+camera.y;if(x<90||x>v.width-90||y<70||y>v.height-80)this.focus(point);},cancel};
}
