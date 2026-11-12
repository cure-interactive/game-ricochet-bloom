// Authored campaign data, shared by previews and the deterministic engine.
export const TRACKS = Object.freeze([
  {id:'first-light',name:'First Light',color:'#f6d58b',palette:'velvet',mechanic:'Open pools and clear bank lanes',music:'Warm, sparse tones'},
  {id:'crosscurrent',name:'Crosscurrent',color:'#73f5dc',palette:'glass',mechanic:'Alternating current lanes gently move the pool',music:'Syncopated replies'},
  {id:'glasswater',name:'Glasswater',color:'#a4e8ff',palette:'glass',mechanic:'Frosted regions slow jellies; hit frost becomes permeable',music:'Crisp notes with space to breathe'},
  {id:'afterimage',name:'Afterimage',color:'#c4a7ff',palette:'wood',mechanic:'Paired gates connect separated groups',music:'A Quiet call and response'},
  {id:'night-bloom',name:'Night Bloom',color:'#ffa9d8',palette:'velvet',mechanic:'Currents, frost and gates return together',music:'A full song with quiet bridges'}
]);
export const trackGet = id => TRACKS.find(t=>t.id===id);
export const LAYOUTS=['Central garden','Role islands','Twin clusters','Bank lanes','Bloom constellation'];
export function trackEnvironment(id,pool,route=0) {
  return {track:id,pool,route,gateCooldown:0};
}
export function environmentValid(e) {
  return !!e&&!!trackGet(e.track)&&Number.isInteger(e.pool)&&e.pool>=0&&e.pool<5&&[0,1].includes(e.route)&&Number.isFinite(e.gateCooldown)&&e.gateCooldown>=0&&e.gateCooldown<=.5;
}
export const hasCurrent=s=>['crosscurrent','night-bloom'].includes(s.environment?.track);
export const hasFrost=s=>['glasswater','night-bloom'].includes(s.environment?.track);
export const hasGates=s=>['afterimage','night-bloom'].includes(s.environment?.track);
export const frostRegion=b=>Math.hypot((b.x-480)/210,(b.y-305)/115)<1;
export const regionFrozen=(s,id)=>id>0&&hasFrost(s)&&frostRegion(s.bodies[id]);
export function trackLayout(game,pool,route=0) {
  const bodies=game.bodies.slice(1),count=bodies.length;
  // Bounded jitter cannot close the authored wall lanes. Roles alternate by ID.
  const jitter=i=>Math.sin((game.rng%1000)+i*2.4)*7;
  for(const [i,b] of bodies.entries()) {
    let x,y;
    if(pool===0){const a=i/count*Math.PI*2,r=i%2?145:205;x=480+Math.cos(a)*r;y=300+Math.sin(a)*r*.72;}
    else if(pool===1){const group=route?i%2:i%3,n=Math.floor(i/(route?2:3)),a=n*2.399;x=(route?315+group*330:250+group*230)+Math.cos(a)*68;y=280+Math.sin(a)*105;}
    else if(pool===2){const group=i%2,a=Math.floor(i/2)/(count/2)*Math.PI*2;x=295+group*370+Math.cos(a)*110;y=300+Math.sin(a)*145;}
    else if(pool===3){const side=i%2,row=Math.floor(i/2);x=(route?190:145)+side*(route?580:670)+Math.sin(row*1.7)*28;y=110+row*58;}
    else {const a=i*2.399,r=90+Math.sqrt(i/count)*190;x=480+Math.cos(a)*r;y=300+Math.sin(a)*r*.7;}
    b.radius=28+(i%3)*2;b.x=x+jitter(i);b.y=y+jitter(i+9);b.vx=0;b.vy=0;
  }
  // Resolve any small authored overlap without shrinking targets on phones.
  for(let pass=0;pass<12;pass++)for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){
    const a=bodies[i],b=bodies[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,need=a.radius+b.radius+8;
    if(d<need){const move=(need-d)/2;a.x-=dx/d*move;a.y-=dy/d*move;b.x+=dx/d*move;b.y+=dy/d*move;}
  }
  for(const b of bodies){b.x=Math.max(70,Math.min(890,b.x));b.y=Math.max(75,Math.min(480,b.y));}
}
export function environmentStep(state,dt,teleport,events) {
  const env=state.environment;if(!env)return;
  env.gateCooldown=Math.max(0,env.gateCooldown-dt);
  if(hasCurrent(state))for(const b of state.bodies){
    if(b.id===0&&!state.isFlying)continue;
    const lane=Math.floor((b.y-30)/145),force=(lane%2?1:-1)*35;
    b.vx+=force*dt;
  }
  if(hasFrost(state))for(const b of state.bodies.slice(1))if(frostRegion(b)){
    const speed=Math.hypot(b.vx,b.vy),limit=100;if(speed>limit){b.vx*=limit/speed;b.vy*=limit/speed;}
  }
  if(hasGates(state)&&state.isFlying&&!env.gateCooldown){
    const player=state.bodies[0],gates=[{x:110,y:220},{x:850,y:420}];
    const entry=gates.findIndex(p=>Math.hypot(p.x-player.x,p.y-player.y)<34);
    if(entry>=0){const from={x:player.x,y:player.y},exit=gates[1-entry],speed=Math.hypot(player.vx,player.vy)||1;
      player.x=exit.x+player.vx/speed*48;player.y=exit.y+player.vy/speed*48;env.gateCooldown=.5;teleport(state,from.x,from.y,player.x,player.y,'gate');
      events.push({type:'teleport',id:0,x:player.x,y:player.y,from});
    }
  }
}
export function environmentRender(ctx,state,gentle=false) {
  if(!state.environment)return;
  ctx.save();
  if(hasCurrent(state))for(let lane=0;lane<4;lane++){
    const y=30+lane*145,dir=lane%2?1:-1;ctx.fillStyle=lane%2?'#73f5dc0b':'#8bd8ff0b';ctx.fillRect(30,y,900,145);
    ctx.strokeStyle='#73f5dc44';ctx.lineWidth=1.5;
    for(let x=90;x<900;x+=150){const offset=gentle?0:state.tick/120*dir*12%150;ctx.beginPath();ctx.moveTo(x+offset-dir*14,y+72-7);ctx.lineTo(x+offset,y+72);ctx.lineTo(x+offset-dir*14,y+72+7);ctx.stroke();}
  }
  if(hasFrost(state)){ctx.fillStyle='#a4e8ff12';ctx.strokeStyle='#a4e8ff77';ctx.setLineDash([5,8]);ctx.beginPath();ctx.ellipse(480,305,210,115,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);}
  if(hasGates(state))for(const p of [{x:110,y:220},{x:850,y:420}]){ctx.strokeStyle='#c4a7ff99';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,34,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,24,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}
