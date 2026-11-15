import {bubblePressure} from './bubble-pressure.js?v=b5bc5af7a6c96099ebff8ebb3bdb5e8bd38cd0780e699102086111db5779588b';
import {gameCreate,launch,physicsStep,powerMarkers,seedBodies,RULE} from './engine.js?v=effdad3393e29949339e4f680eb50871d4dea3ee2a39ee5c96140de3b1404fee';

// Only the aiming decision and delay are menu-specific. The detached session
// uses the normal Free Play launch, pickup, effect and collision rules.
export function menuPoolCreate(game=gameCreate('MENU BLOOM','free')){
 return {game,wait:1.4,elapsed:0,pressure:[],contacts:new Map(),hits:0,activations:0,lastPower:null};
}
export function menuPoolView(width,height){
  const portrait=height>width;
  // Expand the physical long axis instead of letterboxing or cropping walls.
  const scale=Math.min(width/(portrait?RULE.height:RULE.width),height/(portrait?RULE.width:RULE.height));
  return {portrait,scale,worldWidth:(portrait?height:width)/scale,worldHeight:(portrait?width:height)/scale};
}
export function menuPoolResize(pool,width,height){
 if(!(width>0&&height>0))return;
 const view=menuPoolView(width,height),old=pool.game.viewportBounds||RULE;
 if(old.width===view.worldWidth&&old.height===view.worldHeight&&old.inset===0)return;
 const sx=view.worldWidth/old.width,sy=view.worldHeight/old.height;
 for(const body of [...seedBodies(pool.game),...pool.game.bodies.slice(1)]){body.x*=sx;body.y*=sy;}
 pool.game.viewportBounds={width:view.worldWidth,height:view.worldHeight,inset:0};
 pool.contacts.clear();pool.pressure=[];
}
export function menuPoolPoint(x,y,width,height){
  const {portrait,scale,worldWidth,worldHeight}=menuPoolView(width,height),dx=(x-width/2)/scale,dy=(y-height/2)/scale;
  return {x:worldWidth/2+(portrait?dy:dx),y:worldHeight/2+(portrait?-dx:dy)};
}
function repel(body,point,kind,seconds=1,age=0){
  const hit=bubblePressure(body,point,kind,seconds,age);if(!hit)return null;
  body.vx+=hit.vx;body.vy+=hit.vy;
  const speed=Math.hypot(body.vx,body.vy);if(speed>1100){body.vx*=1100/speed;body.vy*=1100/speed;}
  return {id:body.id,nx:hit.nx,ny:hit.ny,speed:hit.speed};
}
export function menuPoolTap(pool,point){
  if(!Number.isFinite(point.x)||!Number.isFinite(point.y))return [];
  const hits=[];
  for(const body of pool.game.bodies){
    const hit=repel(body,point,'tap');if(hit)hits.push(hit);
  }
  pool.pressure.push({...point,age:0});if(pool.pressure.length>8)pool.pressure.shift();
  return hits;
}
export function menuPoolHold(pool,id,point){
  if(Number.isFinite(point.x)&&Number.isFinite(point.y))pool.contacts.set(id,{x:point.x,y:point.y});
}
export function menuPoolRelease(pool,id){pool.contacts.delete(id);}
export function menuPoolStep(pool,elapsed,autoplay=true){
  pool.elapsed+=Math.min(.05,Math.max(0,elapsed));
  const events=[];
  while(pool.elapsed>=RULE.step){
    pool.elapsed-=RULE.step;
    if(autoplay&&!pool.game.isFlying){
      pool.wait-=RULE.step;
      if(pool.wait<=0){
        const seed=pool.game.bodies[0],targets=pool.game.bodies.slice(1);
        const marker=powerMarkers(pool.game)[0];
        const target=targets.find(body=>body.id===marker?.target)||targets[(pool.game.launches*5+2)%targets.length];
        if(launch(pool.game,Math.atan2(target.y-seed.y,target.x-seed.x),.65))events.push({type:'launch',tick:pool.game.tick,x:seed.x,y:seed.y});
        pool.wait=2.4;
      }
    }
    for(const point of pool.contacts.values()){
      for(const body of pool.game.bodies){
        repel(body,point,'hold',RULE.step);
      }
    }
    for(const point of pool.pressure){
      for(const body of pool.game.bodies)repel(body,point,'pulse',RULE.step,point.age);
      point.age+=RULE.step;
    }
    pool.pressure=pool.pressure.filter(point=>point.age<1.25);
    const stepEvents=physicsStep(pool.game);
    for(const event of stepEvents){event.tick=pool.game.tick;if(event.type==='impact')pool.hits++;if(event.type==='power'){pool.activations++;pool.lastPower=event.kind;}}
    events.push(...stepEvents);
  }
  return events;
}
