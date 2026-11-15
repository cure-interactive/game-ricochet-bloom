// Device sensors feed decorative player membranes only, never gameplay input.
const controllers=new WeakMap(),key='ricochet-bloom-player-motion-v1';
const clamp=(n,limit)=>Math.max(-limit,Math.min(limit,n));
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function motionVector(x,y,angle=0){
 const a=angle*Math.PI/180;
 return {x:clamp(x*Math.cos(a)-y*Math.sin(a),100),y:clamp(x*Math.sin(a)+y*Math.cos(a),100)};
}
export function playerMotion(win){
 if(controllers.has(win))return controllers.get(win);
 const doc=win.document,types=[win.DeviceOrientationEvent,win.DeviceMotionEvent].filter(Boolean);
 const supported=!!types.length&&win.isSecureContext!==false,permission=types.some(t=>typeof t.requestPermission==='function');
 let stored;try{stored=win.localStorage?.getItem(key);}catch{}
 let enabled=supported&&stored!=='off'&&!permission,baseline=null,tilt={x:0,y:0},movement={x:0,y:0},lastTilt=0,lastMove=0,received=false,denied=false,pending=false;
 const now=()=>win.performance?.now?.()??Date.now();
 const angle=()=>win.screen?.orientation?.angle??win.orientation??0;
 const clear=()=>{baseline=null;tilt={x:0,y:0};movement={x:0,y:0};lastTilt=lastMove=0;};
 const toggle=doc?.getElementById?.('player-motion'),status=doc?.getElementById?.('player-motion-status');
 function render(){
  if(toggle){toggle.checked=enabled;toggle.disabled=!supported||pending;}
  if(status)status.textContent=!supported?'Motion sensors are unavailable in this browser. Touch and scroll still move your player.':denied?'Motion access was not allowed. You can try again or keep using touch and scroll.':enabled?(received?'Tilt or move your device to nudge player icons and previews. Gameplay controls stay the same.':'Motion is enabled. Waiting for sensor data; touch and scroll still work.'):'Turn on to let device tilt and movement nudge player icons and previews. Your browser may ask for motion access.';
 }
 const orientation=e=>{
  if(!enabled||doc?.hidden||!finite(e.beta)||!finite(e.gamma))return;
  if(!baseline)baseline={beta:e.beta,gamma:e.gamma};
  const delta=n=>((n+540)%360)-180;
  tilt=motionVector(clamp(delta(e.gamma-baseline.gamma),35)*1.6,-clamp(delta(e.beta-baseline.beta),35)*1.6,angle());lastTilt=now();
  if(!received){received=true;render();}
 };
 let gravity=null;
 const motion=e=>{
  if(!enabled||doc?.hidden)return;
  let a=e.acceleration;
  if(!finite(a?.x)||!finite(a?.y)){
   const g=e.accelerationIncludingGravity;
   if(finite(g?.x)&&finite(g?.y)){
    if(!gravity)gravity={x:g.x,y:g.y};
    gravity.x+=(g.x-gravity.x)*.08;gravity.y+=(g.y-gravity.y)*.08;
    a={x:g.x-gravity.x,y:g.y-gravity.y};
   }
  }
  const rotation=e.rotationRate;
  if(!finite(a?.x)&&!finite(rotation?.beta)&&!finite(rotation?.gamma))return;
  movement=motionVector(-clamp(finite(a?.x)?a.x:0,12)*7+clamp(finite(rotation?.beta)?rotation.beta:0,180)*.18,clamp(finite(a?.y)?a.y:0,12)*7-clamp(finite(rotation?.gamma)?rotation.gamma:0,180)*.18,angle());lastMove=now();
  if(!received){received=true;render();}
 };
 async function setEnabled(value){
  if(pending)return;
  denied=false;clear();gravity=null;
  if(!value){enabled=false;try{win.localStorage?.setItem(key,'off');}catch{}render();return;}
  if(!supported)return;
  pending=true;render();
  // Invoke both APIs directly in the click/change gesture, before any await.
  const requests=types.map(type=>{try{return typeof type.requestPermission==='function'?type.requestPermission():Promise.resolve('granted');}catch{return Promise.resolve('denied');}});
  const results=await Promise.allSettled(requests);
  enabled=results.some(r=>r.status==='fulfilled'&&r.value==='granted');denied=!enabled;pending=false;
  try{win.localStorage?.setItem(key,enabled?'on':'off');}catch{}render();
 }
 if(toggle)toggle.addEventListener('change',()=>setEnabled(toggle.checked));
 win.addEventListener('deviceorientation',orientation,{passive:true});win.addEventListener('devicemotion',motion,{passive:true});
 const reset=()=>{clear();gravity=null;};
 win.addEventListener('orientationchange',reset);win.screen?.orientation?.addEventListener?.('change',reset);
 doc?.addEventListener('visibilitychange',reset);
 const api={setEnabled,sample(){
  if(!enabled||doc?.hidden)return {x:0,y:0};
  const t=now(),fade=Math.max(0,1-(t-lastMove)/250),held=lastTilt&&t-lastTilt<2000?1:0;
  return {x:clamp(tilt.x*held+movement.x*fade,100),y:clamp(tilt.y*held+movement.y*fade,100)};
 }};
 controllers.set(win,api);render();return api;
}
