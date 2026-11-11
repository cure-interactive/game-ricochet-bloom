// Spatial presentation only: catalogue prerequisites and saved research stay authoritative.
export function treeLayout(powers,nodes,bridges) {
  // Power branches fan out from family entries; upgrades remain straight chains.
  const places={Motion:[70,50],Flow:[870,50],Navigation:[70,870],Control:[870,870],Propagation:[650,1690]};
  const result={width:1660,height:2520,nodes:{},families:{},edges:[],bridges:[]};
  for(const [family,[x,y]] of Object.entries(places)) {
    const members=Object.keys(powers).filter(p=>powers[p].family===family).sort((a,b)=>powers[a].tier-powers[b].tier);
    const width=members.length*124+40,center=x+width/2;
    const slots=members.map((_,i)=>i).sort((a,b)=>Math.abs(a-(members.length-1)/2)-Math.abs(b-(members.length-1)/2));
    result.families[family]={name:family,x,y,width,height:790,hub:{x:center,y:y+20},powers:members,starter:members[0]+'.base'};
    members.forEach((power,index)=>{
      const px=x+82+slots[index]*124,py=y+138+Math.abs(slots[index]-(members.length-1)/2)*44;
      ['base','foundation','a','b','capstone'].forEach((kind,i)=>{const id=power+'.'+kind;result.nodes[id]={id,power,kind,family,x:px,y:py+i*112};});
    });
  }
  for(const n of Object.values(nodes))for(const from of n.requires)result.edges.push({from,to:n.id});
  for(const [to,from] of Object.entries(bridges))if(from)result.bridges.push({from,to});
  return result;
}
export function researchRoute(nodes,powers,bridges,id) {
  const route=new Set();
  function visit(key){
    if(route.has(key)||!nodes[key])return;
    route.add(key);const node=nodes[key];
    for(const prior of node.requires)visit(prior);
    if(node.kind==='base'&&bridges[powers[node.power].family])visit(bridges[powers[node.power].family]);
  }
  visit(id);return route;
}
export function cameraClamp(camera,view,world) {
  const scale=Math.max(.1,Math.min(1.8,camera.scale)),axis=(offset,viewport,size)=>size*scale<viewport? (viewport-size*scale)/2:Math.max(viewport-size*scale-80,Math.min(80,offset));
  return {x:axis(camera.x,view.width,world.width),y:axis(camera.y,view.height,world.height),scale};
}
export function cameraZoom(camera,scale,anchor) {
  scale=Math.max(.1,Math.min(1.8,scale));const ratio=scale/camera.scale;
  return {x:anchor.x-(anchor.x-camera.x)*ratio,y:anchor.y-(anchor.y-camera.y)*ratio,scale};
}
export function cameraFit(bounds,view) {
  const scale=Math.max(.1,Math.min(1.2,(view.width-40)/bounds.width,(view.height-40)/bounds.height));
  return {x:(view.width-bounds.width*scale)/2-bounds.x*scale,y:(view.height-bounds.height*scale)/2-bounds.y*scale,scale};
}
export function nearestMapNode(nodes,id,dx,dy) {
  const from=nodes[id];if(!from)return null;
  return Object.values(nodes).filter(n=>n.id!==id).map(n=>{const x=n.x-from.x,y=n.y-from.y;return {id:n.id,forward:x*dx+y*dy,distance:Math.hypot(x,y)+Math.abs(x*dy-y*dx)*2};}).filter(n=>n.forward>1).sort((a,b)=>a.distance-b.distance)[0]?.id||null;
}
export function mapCameraMount(surface,world,change) {
  let camera={x:0,y:0,scale:1},points=new Map(),start=null,suppress=false;
  const size=()=>({width:surface.clientWidth,height:surface.clientHeight});
  const local=e=>{const r=surface.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
  const center=ps=>({x:ps.reduce((s,p)=>s+p.x,0)/ps.length,y:ps.reduce((s,p)=>s+p.y,0)/ps.length});
  function apply(next){camera=cameraClamp(next,size(),world);change(camera);}
  function baseline(){const ps=[...points.values()];start=ps.length?{camera:{...camera},center:center(ps),distance:ps.length>1?Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y):0}:null;}
  surface.addEventListener('pointerdown',e=>{if(e.button!==0)return;if(!points.size)suppress=false;points.set(e.pointerId,local(e));baseline();if(points.size>1)suppress=true;});
  surface.addEventListener('pointermove',e=>{
    if(!points.has(e.pointerId)||!start)return;points.set(e.pointerId,local(e));const ps=[...points.values()],mid=center(ps),dx=mid.x-start.center.x,dy=mid.y-start.center.y;
    if(ps.length===1&&!suppress&&Math.hypot(dx,dy)<6)return;
    suppress=true;e.preventDefault();surface.classList.add('is-panning');if(!surface.hasPointerCapture(e.pointerId))surface.setPointerCapture(e.pointerId);
    let next={...start.camera};if(ps.length>1&&start.distance>0)next=cameraZoom(next,next.scale*Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y)/start.distance,start.center);
    apply({...next,x:next.x+dx,y:next.y+dy});
  });
  const end=e=>{points.delete(e.pointerId);baseline();if(!points.size)surface.classList.remove('is-panning');};
  for(const event of ['pointerup','pointercancel'])surface.addEventListener(event,end);
  // Touch capture moves from the hit child to this surface when dragging starts.
  // The child's bubbling loss is a handoff, not the end of the active gesture.
  surface.addEventListener('lostpointercapture',e=>{if(e.target===surface)end(e);});
  surface.addEventListener('click',e=>{if(suppress&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();}},true);
  surface.addEventListener('wheel',e=>{e.preventDefault();suppress=true;if(e.shiftKey)apply({...camera,x:camera.x-e.deltaY,y:camera.y-e.deltaX});else apply(cameraZoom(camera,camera.scale*Math.exp(-Math.max(-150,Math.min(150,e.deltaY))*.003),local(e)));},{passive:false});
  surface.addEventListener('keydown',e=>{if(e.target!==surface)return;const move={ArrowLeft:[80,0],ArrowRight:[-80,0],ArrowUp:[0,80],ArrowDown:[0,-80]}[e.key];if(move){e.preventDefault();apply({...camera,x:camera.x+move[0],y:camera.y+move[1]});}});
  const observer=new ResizeObserver(()=>{if(surface.clientWidth&&surface.clientHeight)apply(camera);});observer.observe(surface);
  return {get value(){return {...camera};},zoom(factor){const v=size();apply(cameraZoom(camera,camera.scale*factor,{x:v.width/2,y:v.height/2}));},focus(point,scale=Math.max(.85,camera.scale),vertical=.25){const v=size();apply({x:v.width/2-point.x*scale,y:Math.min(140,v.height*vertical)-point.y*scale,scale});},fit(bounds={x:0,y:0,width:world.width,height:world.height}){apply(cameraFit(bounds,size()));},ensure(point){const v=size(),x=point.x*camera.scale+camera.x,y=point.y*camera.scale+camera.y;if(x<90||x>v.width-90||y<70||y>v.height-80)this.focus(point);},cancel(){points.clear();start=null;surface.classList.remove('is-panning');}};
}
