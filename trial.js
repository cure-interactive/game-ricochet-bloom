import { earningId, earningValid } from './earning.js?v=e498e394b306ea0fe759f0e65e7ce683f4fd8b688ea12dc6b57fdd5d5467ac12';

// A trial has a frozen aiming phase and a finite physical shot. Campaign's
// continuously drifting pool is a different simulation contract.
export const TRIAL_SIZE = Object.freeze({width:900,height:600,step:1/120});
export const TRIAL_MODES = Object.freeze({
  reaction:{name:'Reaction Puzzle',summary:'Build a chain. Protect the healthy cells.',shots:6,goal:'Clear all eight hazards. Keep all three healthy cells intact.',legend:'Pink: hazard · Orange: blast · Flame: fire · Green: gas · Cross: healthy cell',layouts:['First Spark','Firebreak','Chain of Islands']},
  cargo:{name:'Cargo Rescue',summary:'Push fragile cargo into the safe receiver.',shots:8,goal:'Deliver two of three cargo bubbles in eight shots.',legend:'Blue: cargo · Mint: receiver · Arrows: current · Spikes: danger · Stripes: breakable wall',layouts:['Open Water','Narrow Passage','The Long Way']},
  outbreak:{name:'Outbreak Containment',summary:'Seal the vents before the infection spreads.',shots:8,goal:'Seal both vents and clear all infected motes. Protect the central cell.',legend:'Diamond: plug · Ring: vent · Purple: infection · Brown: mud · Cross: healthy cell',layouts:['First Response','Crossfire','Quarantine']}
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const live=b=>b.active;
const moving=b=>b.active&&!b.fixed;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const integer=n=>Number.isSafeInteger(n)&&n>=0;
function body(id,kind,x,y,options={}){return {id,kind,x,y,vx:0,vy:0,r:kind==='player'?16:kind==='cell'?24:20,active:true,fixed:!['player','cargo','plug','mote'].includes(kind),hp:kind==='cell'?3:1,...options};}
export function trialCreate(mode,layout=0,kind='normal',id=earningId()){
  if(!TRIAL_MODES[mode]||!Number.isInteger(layout)||layout<0||layout>2||!['normal','development'].includes(kind))throw new Error('Unknown trial');
  let next=1;const bodies=[body(0,'player',100,300)];
  const add=(type,x,y,options)=>bodies.push(body(next++,type,x,y,options));
  const walls=[];let receiver=null,current=null;
  if(mode==='reaction'){
    // Three pairs and a fire/gas pair reward a deliberate chain, while the
    // protected cells are shielded by solid cover from the nearest blast.
    const shift=layout*30;
    for(const [type,x,y] of [['blast',310,170+shift],['target',380,170+shift],['fire',580,160],['gas',650,160],['blast',310,430-shift],['target',380,430-shift],['blast',630,430],['target',700,430]])add(type,x,y);
    for(const [x,y] of [[460,110],[460,490],[760,300]])add('cell',x,y,{hp:1});
    walls.push({x:420,y:65,w:18,h:150,breakable:false,active:true},{x:420,y:385,w:18,h:150,breakable:false,active:true},{x:720,y:250,w:18,h:100,breakable:false,active:true});
    if(layout===1)walls.push({x:490,y:270,w:140,h:18,breakable:false,active:true});
    if(layout===2)walls.push({x:220,y:270,w:100,h:18,breakable:false,active:true});
  }else if(mode==='cargo'){
    for(const y of [180,300,420])add('cargo',290+layout*15,y);
    add('blast',465,300);add('spike',660,300,{r:25});
    receiver={x:795,y:70,w:85,h:460};current={x:535,y:70,w:250,h:460,vx:155,vy:0};
    walls.push({x:525,y:245,w:18,h:110,breakable:true,active:true});
    if(layout>0)walls.push({x:440,y:100,w:18,h:125,breakable:false,active:true});
    if(layout===2)walls.push({x:440,y:375,w:18,h:125,breakable:false,active:true});
  }else{
    add('cell',440,300);
    add('vent',735,135);add('vent',735,465);
    add('plug',600,170);add('plug',600,430);
    add('blast',600,300);add('mud',480,300);
    add('mote',790,95);add('mote',790,505);
    if(layout>0)walls.push({x:540,y:220,w:18,h:160,breakable:false,active:true});
    if(layout===2)walls.push({x:325,y:140,w:18,h:95,breakable:false,active:true});
  }
  return {version:1,mode,layout,kind,id,tick:0,age:0,phase:'aim',shots:0,hit:[],bodies,walls,receiver,current,zones:[],nextId:next,delivered:0,lost:0,popped:0,sealed:0,reason:'',events:[],log:[],
    earning:{version:1,id,kind,mode,contacts:0,blooms:0,waves:0,wins:0,shots:0,lastLaunch:0,mastery:{},owned:[],used:[]}};
}
function event(g,type,b,extra={}){g.events.push({type,x:b?.x??450,y:b?.y??300,id:b?.id??0,tick:g.tick,...extra});}
function explain(g,text){g.log.push(text);if(g.log.length>6)g.log.shift();}
function note(g,b){if(g.hit.includes(b.id))return;g.hit.push(b.id);event(g,'note',b,{tone:b.id%5,chain:g.hit.length,speed:450});}
function inside(b,r){return b.x>=r.x&&b.x<=r.x+r.w&&b.y>=r.y&&b.y<=r.y+r.h;}
function intersects(a,b,r){
  let lo=0,hi=1;
  for(const [p,d,min,max] of [[a.x,b.x-a.x,r.x,r.x+r.w],[a.y,b.y-a.y,r.y,r.y+r.h]]){
    if(Math.abs(d)<1e-9){if(p<min||p>max)return false;continue;}
    let u=(min-p)/d,v=(max-p)/d;if(u>v)[u,v]=[v,u];lo=Math.max(lo,u);hi=Math.min(hi,v);if(lo>hi)return false;
  }return true;
}
const covered=(g,a,b)=>g.walls.some(w=>w.active&&!w.breakable&&intersects(a,b,w));
function remove(g,b,cause){
  if(!b.active)return;b.active=false;note(g,b);event(g,'pop',b);
  if(b.kind==='cargo'){g.lost++;explain(g,'Cargo ruptured: '+cause);}
  else if(['target','blast','fire','gas','mote'].includes(b.kind))g.popped++;
}
export function trialBlast(g,source,radius=140){
  const queue=[{...source,radius}],seen=new Set();
  while(queue.length){
    const a=queue.shift();if(seen.has(a.id))continue;seen.add(a.id);event(g,'blast',a,{radius:a.radius});
    for(const w of g.walls)if(w.active&&w.breakable&&distance(a,{x:clamp(a.x,w.x,w.x+w.w),y:clamp(a.y,w.y,w.y+w.h)})<=a.radius){w.active=false;explain(g,'Blast opened a barrier.');}
    for(const b of g.bodies){
      if(!b.active||b.id===a.id||distance(a,b)>a.radius+b.r||covered(g,a,b))continue;
      if(['blast','gas'].includes(b.kind)){remove(g,b,'chain reaction');queue.push({...b,radius:b.kind==='gas'?160:140});}
      else if(['target','fire','mote','cargo'].includes(b.kind))remove(g,b,'blast');
      else if(b.kind==='cell'){b.hp=Math.max(0,b.hp-1);if(!b.hp)b.active=false;event(g,'damage',b);explain(g,'A blast damaged a healthy cell.');}
      else if(!b.fixed){const d=Math.max(1,distance(a,b));b.vx+=(b.x-a.x)/d*460;b.vy+=(b.y-a.y)/d*460;}
    }
  }
}
function touch(g,b){
  note(g,b);
  if(['target','mote'].includes(b.kind))remove(g,b,'contact');
  else if(b.kind==='blast'){remove(g,b,'contact');explain(g,'Contact triggered a blast.');trialBlast(g,b);}
  else if(b.kind==='fire'){
    remove(g,b,'contact');for(const gas of g.bodies)if(gas.active&&gas.kind==='gas'&&distance(b,gas)<110&&!covered(g,b,gas)){remove(g,gas,'ignition');explain(g,'Fire ignited gas.');trialBlast(g,gas,160);}
  }else if(b.kind==='gas'){remove(g,b,'venting');explain(g,'Gas vented safely without fire.');}
  else if(b.kind==='mud'){remove(g,b,'contact');g.zones.push({x:b.x,y:b.y,r:145});explain(g,'Mud slows infected motes inside its ring.');}
}
function wallCollide(b,w){
  const x=clamp(b.x,w.x,w.x+w.w),y=clamp(b.y,w.y,w.y+w.h);let dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy);
  if(d>=b.r)return;
  if(d<1e-9){const sides=[{v:b.x-w.x,nx:-1,ny:0},{v:w.x+w.w-b.x,nx:1,ny:0},{v:b.y-w.y,nx:0,ny:-1},{v:w.y+w.h-b.y,nx:0,ny:1}].sort((a,c)=>a.v-c.v);const s=sides[0];dx=s.nx;dy=s.ny;b.x+=dx*(s.v+b.r);b.y+=dy*(s.v+b.r);d=1;}
  else {b.x+=dx/d*(b.r-d);b.y+=dy/d*(b.r-d);}
  const nx=dx/d,ny=dy/d,v=b.vx*nx+b.vy*ny;if(v<0){b.vx-=1.65*v*nx;b.vy-=1.65*v*ny;}
}
function contain(g,b){
  for(const w of g.walls)if(w.active)wallCollide(b,w);
  for(const [p,v,max] of [['x','vx',900],['y','vy',600]]){if(b[p]<b.r){b[p]=b.r;b[v]=Math.abs(b[v])*.75;}if(b[p]>max-b.r){b[p]=max-b.r;b[v]=-Math.abs(b[v])*.75;}}
}
function destinations(g){
  for(const b of g.bodies){
    if(!b.active)continue;
    if(b.kind==='cargo'&&inside(b,g.receiver)){b.active=false;g.delivered++;note(g,b);event(g,'objective',b);explain(g,'Cargo delivered safely.');}
    if(b.kind==='plug')for(const vent of g.bodies)if(vent.active&&vent.kind==='vent'&&distance(b,vent)<30){vent.active=false;b.active=false;g.sealed++;note(g,vent);event(g,'objective',vent);explain(g,'Vent sealed.');break;}
  }
}
function outcome(g){
  if(g.mode==='reaction'){
    if(g.bodies.some(b=>b.kind==='cell'&&!b.active))return ['lost','A protected cell was destroyed.'];
    if(!g.bodies.some(b=>b.active&&['target','blast','fire','gas'].includes(b.kind)))return ['won','All hazards cleared. Every healthy cell survived.'];
  }else if(g.mode==='cargo'){
    if(g.lost>1)return ['lost','Too few intact cargo bubbles remain.'];
    if(g.delivered>=2)return ['won','Two cargo bubbles delivered safely.'];
  }else{
    if(!g.bodies.find(b=>b.kind==='cell').active)return ['lost','The central cell lost all integrity.'];
    if(g.sealed===2&&!g.bodies.some(b=>b.kind==='mote'&&b.active))return ['won','Both vents sealed. Infection contained.'];
  }
  return g.shots>=TRIAL_MODES[g.mode].shots?['lost','No shots remain. Try a different route.']:null;
}
function outbreakTurn(g){
  const cell=g.bodies.find(b=>b.kind==='cell');
  for(const b of g.bodies.filter(b=>b.active&&b.kind==='mote')){
    const slow=g.zones.some(z=>distance(b,z)<z.r),d=Math.max(1,distance(b,cell)),travel=Math.min(d,slow?22:52);
    for(let i=0;i<12;i++){b.x+=(cell.x-b.x)/Math.max(1,distance(b,cell))*travel/12;b.y+=(cell.y-b.y)/Math.max(1,distance(b,cell))*travel/12;contain(g,b);}
    if(distance(b,cell)<=b.r+cell.r+2){b.active=false;cell.hp=Math.max(0,cell.hp-1);cell.active=cell.hp>0;event(g,'damage',cell);explain(g,'An infected mote reached the cell.');}
  }
  for(const v of g.bodies.filter(b=>b.kind==='vent'&&b.active)){
    if(g.bodies.filter(b=>b.active&&b.kind==='mote').length>=6){explain(g,'Infection cap reached: vents paused.');break;}
    const toward=Math.atan2(cell.y-v.y,cell.x-v.x);g.bodies.push(body(g.nextId++,'mote',v.x+Math.cos(toward)*48,v.y+Math.sin(toward)*48,{r:17}));
  }
}
function settle(g){
  for(const b of g.bodies){b.vx=0;b.vy=0;}
  let result=outcome(g);
  if(!result&&g.mode==='outbreak'){outbreakTurn(g);result=outcome(g);}
  g.phase=result?result[0]:'aim';g.reason=result?.[1]||'Choose your next shot.';
  const e=g.earning;e.shots=g.shots;e.lastLaunch=g.shots;e.contacts+=Math.min(20,g.hit.length);if(g.hit.length>=5){e.blooms++;event(g,'bloom',g.bodies[0],{banks:0});}if(g.phase==='won')e.wins=1;
  event(g,g.phase==='won'?'win':g.phase==='lost'?'over':'rest',g.bodies[0]);
}
export function trialLaunch(g,angle,power=.7){
  if(g.phase!=='aim'||!Number.isFinite(angle)||!Number.isFinite(power))return false;
  const p=g.bodies[0],speed=300+clamp(power,0,1)*700;p.vx=Math.cos(angle)*speed;p.vy=Math.sin(angle)*speed;
  g.shots++;g.hit=[];g.age=0;g.phase='flight';g.events=[];g.reason='';event(g,'launch',p);return true;
}
export function trialStep(g){
  g.events=[];if(g.phase!=='flight')return g.events;
  const dt=TRIAL_SIZE.step;g.tick++;g.age+=dt;
  for(const b of g.bodies.filter(moving)){
    if(g.current&&b.kind==='cargo'&&inside(b,g.current)&&g.age<3){b.vx+=g.current.vx*dt;b.vy+=g.current.vy*dt;}
    const drag=Math.exp(-(g.age>3?3:1.05)*dt);b.vx=clamp(b.vx*drag,-1200,1200);b.vy=clamp(b.vy*drag,-1200,1200);b.x+=b.vx*dt;b.y+=b.vy*dt;contain(g,b);
  }
  const bodies=g.bodies;
  for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
    const a=bodies[i],b=bodies[j];if(!a.active||!b.active||a.fixed&&b.fixed||['vent','mud'].includes(a.kind)||['vent','mud'].includes(b.kind)&&a.kind!=='player')continue;
    let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>a.r+b.r)continue;
    if(a.kind==='player'){touch(g,b);if(!b.active)continue;}
    if(a.kind==='cargo'&&b.kind==='spike'||b.kind==='cargo'&&a.kind==='spike'){remove(g,a.kind==='cargo'?a:b,'sharp hazard');continue;}
    if(b.kind==='vent'||b.kind==='mud')continue;
    if(d<.001){dx=1;dy=0;d=1;}const nx=dx/d,ny=dy/d,invA=a.fixed?0:1,invB=b.fixed?0:1,sum=invA+invB;if(!sum)continue;
    const overlap=a.r+b.r-d;a.x-=nx*overlap*invA/sum;a.y-=ny*overlap*invA/sum;b.x+=nx*overlap*invB/sum;b.y+=ny*overlap*invB/sum;
    const relative=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(relative<0){const impulse=-1.8*relative/sum;a.vx-=impulse*nx*invA;a.vy-=impulse*ny*invA;b.vx+=impulse*nx*invB;b.vy+=impulse*ny*invB;}
  }
  for(const b of bodies.filter(moving))contain(g,b);
  destinations(g);
  if(g.age>.3&&g.bodies.filter(moving).every(b=>Math.hypot(b.vx,b.vy)<3))settle(g);
  return g.events;
}
export function trialStatus(g){
  if(g.mode==='reaction')return `${8-g.popped}/8 hazards · ${g.bodies.filter(b=>b.kind==='cell'&&b.active).length}/3 cells`;
  if(g.mode==='cargo')return `${g.delivered}/2 delivered · ${g.lost}/3 lost`;
  return `${g.sealed}/2 vents sealed · ${g.bodies.filter(b=>b.kind==='mote'&&b.active).length}/6 infected · Cell ${g.bodies.find(b=>b.kind==='cell').hp}/3`;
}
export function trialValidate(value){
  try{
    const g=structuredClone(value);if(!g||g.version!==1||!TRIAL_MODES[g.mode]||!['normal','development'].includes(g.kind)||!Number.isInteger(g.layout)||g.layout<0||g.layout>2)return null;
    if(!['aim','flight','won','lost'].includes(g.phase)||!['tick','shots','nextId','delivered','lost','popped','sealed'].every(k=>integer(g[k]))||g.shots>TRIAL_MODES[g.mode].shots||!Number.isFinite(g.age)||g.age<0||g.age>20||g.tick>20000||g.nextId>40||g.sealed>2||g.delivered+g.lost>3)return null;
    const base=trialCreate(g.mode,g.layout,g.kind,g.id);if(!Array.isArray(g.bodies)||g.bodies.length<base.bodies.length||g.bodies.length>40||new Set(g.bodies.map(b=>b.id)).size!==g.bodies.length)return null;
    for(const b of g.bodies){const original=base.bodies.find(a=>a.id===b.id);if(!integer(b.id)||b.id>=g.nextId||typeof b.active!=='boolean'||!integer(b.hp)||b.hp>3||!['x','y','vx','vy','r'].every(k=>Number.isFinite(b[k]))||b.x<0||b.x>900||b.y<0||b.y>600||Math.abs(b.vx)>1400||Math.abs(b.vy)>1400)return null;
      if(original){if(b.kind!==original.kind||b.r!==original.r||b.fixed!==original.fixed)return null;}else if(g.mode!=='outbreak'||b.kind!=='mote'||b.r!==17||b.fixed!==false)return null;
    }
    if(g.bodies[0].id!==0||g.bodies[0].kind!=='player'||!g.bodies[0].active||g.walls.length!==base.walls.length||g.walls.some((w,i)=>typeof w.active!=='boolean'||['x','y','w','h','breakable'].some(k=>w[k]!==base.walls[i][k]))||JSON.stringify(g.receiver)!==JSON.stringify(base.receiver)||JSON.stringify(g.current)!==JSON.stringify(base.current))return null;
    if(!Array.isArray(g.zones)||g.zones.length>1||g.zones.some(z=>g.mode!=='outbreak'||z.x!==480||z.y!==300||z.r!==145)||!Array.isArray(g.hit)||g.hit.length>40||g.hit.some(id=>!g.bodies.some(b=>b.id===id))||!Array.isArray(g.log)||g.log.length>6||g.log.some(s=>typeof s!=='string'||s.length>150)||typeof g.reason!=='string'||g.reason.length>150)return null;
    if(!earningValid(g.earning,[])||g.earning.id!==g.id||g.earning.mode!==g.mode||g.earning.kind!==g.kind||g.earning.shots!==g.shots-(g.phase==='flight'?1:0))return null;
    if(g.phase!=='flight'&&g.bodies.some(b=>b.vx||b.vy))return null;
    if(g.phase==='won'&&outcome(g)?.[0]!=='won'||g.phase==='lost'&&outcome(g)?.[0]!=='lost')return null;
    g.events=[];return g;
  }catch{return null;}
}
