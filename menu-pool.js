import { gameCreate, launch, physicsStep, RULE } from './engine.js?v=2d94bc3e3221c7e6c61b2dd311fe2e42f65f15db0a5dcc360a487c712cf2366f';

// An attract-mode pool owns its state; it never receives a player's saved run.
export function menuPoolCreate(){
  const game=gameCreate('MENU BLOOM','free');
  for(const body of game.bodies.slice(1)){body.vx*=5;body.vy*=5;}
  return {game,wait:1.4,elapsed:0};
}
export function menuPoolStep(pool,elapsed){
  pool.elapsed+=Math.min(.05,Math.max(0,elapsed));
  const events=[];
  while(pool.elapsed>=RULE.step){
    pool.elapsed-=RULE.step;
    if(!pool.game.isFlying){
      pool.wait-=RULE.step;
      if(pool.wait<=0){
        const seed=pool.game.bodies[0],targets=pool.game.bodies.slice(1);
        const target=targets[(pool.game.launches*5+2)%targets.length];
        launch(pool.game,Math.atan2(target.y-seed.y,target.x-seed.x),.65);
        // Quiet basic ricochets keep the menu readable; no power HUD is needed.
        pool.game.power.markers=[];pool.wait=2.4;
      }
    }
    events.push(...physicsStep(pool.game));
  }
  return events;
}
