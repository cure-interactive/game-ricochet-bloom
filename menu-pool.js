import { gameCreate, launch, physicsStep, powerActivate, RULE } from './engine.js?v=2dd0f771b37dc76497de4916b6a40d2267fe82b6096fb3b47ff898d77220ee69';
import {buildValidate} from './skill-effect.js?v=6bc123e911039183cb33d2d4d4f01b63c8a5fdf57cf46b5e716d86a347906c28';

// An attract-mode pool owns its state; it never receives a player's saved run.
export function menuPoolCreate(build=[]){
  if(build.length&&!buildValidate(build))throw new TypeError('Invalid menu power build');
  const game=gameCreate('MENU BLOOM','free',build.length?{build}:{});
  for(const body of game.bodies.slice(1)){body.vx*=5;body.vy*=5;}
  return {game,wait:1.4,elapsed:0,pressure:[],contacts:new Map(),build:structuredClone(build),hits:0,activations:0,lastPower:null};
}
export function menuPoolPowersSet(pool,build){
  if(JSON.stringify(pool.build)===JSON.stringify(build))return false;
  Object.assign(pool,menuPoolCreate(build));return true;
}
export function menuPoolPowers(pool,events,random=Math.random){
  const activated=[];
  for(const event of events){
    if(event.type!=='impact')continue;
    pool.hits++;
    if(pool.hits%5||!pool.build.length)continue;
    const kind=pool.build[Math.min(pool.build.length-1,Math.max(0,Math.floor(random()*pool.build.length)))].power;
    const target=pool.game.bodies.find(body=>body.id===(event.b>0?event.b:event.a)&&body.id>0);
    if(!target)continue;
    if(!pool.game.isFlying){const seed=pool.game.bodies[0];launch(pool.game,Math.atan2(target.y-seed.y,target.x-seed.x),.65);}
    const output=powerActivate(pool.game,kind,target.id);
    // Ordinary pickup markers must not introduce activations between fifth hits.
    pool.game.power.markers=[];
    if(output.some(e=>e.type==='power')){pool.activations++;pool.lastPower=kind;activated.push(...output);}
  }
  return activated;
}
export function menuPoolView(width,height){
  const portrait=height>width;
  return {portrait,scale:Math.max(width/(portrait?RULE.height:RULE.width),height/(portrait?RULE.width:RULE.height))};
}
export function menuPoolPoint(x,y,width,height){
  const {portrait,scale}=menuPoolView(width,height),dx=(x-width/2)/scale,dy=(y-height/2)/scale;
  return {x:RULE.width/2+(portrait?dy:dx),y:RULE.height/2+(portrait?-dx:dy)};
}
function repel(body,point,force){
  const dx=body.x-point.x,dy=body.y-point.y,d=Math.hypot(dx,dy),angle=body.id*2.39996;
  const nx=d>.01?dx/d:Math.cos(angle),ny=d>.01?dy/d:Math.sin(angle);
  body.vx+=nx*force;body.vy+=ny*force;
  const speed=Math.hypot(body.vx,body.vy);if(speed>1100){body.vx*=1100/speed;body.vy*=1100/speed;}
  return {id:body.id,nx,ny,speed:force};
}
export function menuPoolTap(pool,point){
  if(!Number.isFinite(point.x)||!Number.isFinite(point.y))return [];
  const hits=[];
  for(const body of pool.game.bodies){
    const d=Math.hypot(body.x-point.x,body.y-point.y),falloff=Math.max(0,1-d/280);
    if(falloff)hits.push(repel(body,point,420*falloff*falloff+(d<=body.radius?520:0)));
  }
  pool.pressure.push({...point,age:0});if(pool.pressure.length>8)pool.pressure.shift();
  return hits;
}
export function menuPoolHold(pool,id,point){
  if(Number.isFinite(point.x)&&Number.isFinite(point.y))pool.contacts.set(id,{x:point.x,y:point.y});
}
export function menuPoolRelease(pool,id){pool.contacts.delete(id);}
export function menuPoolStep(pool,elapsed,autoplay=true,random=Math.random){
  pool.elapsed+=Math.min(.05,Math.max(0,elapsed));
  const events=[];
  while(pool.elapsed>=RULE.step){
    pool.elapsed-=RULE.step;
    if(autoplay&&!pool.game.isFlying){
      pool.wait-=RULE.step;
      if(pool.wait<=0){
        const seed=pool.game.bodies[0],targets=pool.game.bodies.slice(1);
        const target=targets[(pool.game.launches*5+2)%targets.length];
        launch(pool.game,Math.atan2(target.y-seed.y,target.x-seed.x),.65);
        // Menu powers are triggered by the fifth impact, never ordinary pickups.
        pool.game.power.markers=[];pool.wait=2.4;
      }
    }
    for(const point of pool.contacts.values()){
      for(const body of pool.game.bodies){
        const falloff=Math.max(0,1-Math.hypot(body.x-point.x,body.y-point.y)/160);
        if(falloff)repel(body,point,1400*falloff*falloff*RULE.step);
      }
    }
    for(const point of pool.pressure){
      const fade=Math.max(0,1-point.age/1.25);
      for(const body of pool.game.bodies){const falloff=Math.max(0,1-Math.hypot(body.x-point.x,body.y-point.y)/320);if(falloff)repel(body,point,1000*falloff*falloff*fade*RULE.step);}
      point.age+=RULE.step;
    }
    pool.pressure=pool.pressure.filter(point=>point.age<1.25);
    const stepEvents=physicsStep(pool.game);
    events.push(...stepEvents,...menuPoolPowers(pool,stepEvents,random));
  }
  return events;
}
