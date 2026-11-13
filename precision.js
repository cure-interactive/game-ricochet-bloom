// Precision goals share the trial's physical shot, not its reaction objectives.
// These hooks own calls, contact order, forbidden contact and landing evidence.
export const PRECISION_RULES=Object.freeze({
  '001':{name:'One-Pluck Clear',shots:1,goal:'Clear every numbered target in one launch. A miss ends the attempt; Retry repeats the same board.'},
  '002':{name:'Bank Shot Only',shots:6,goal:'Clear all three targets in six shots. A target counts only after a wall bank in that same shot.'},
  '003':{name:'Called Shot',shots:7,goal:'Choose your first target before each launch. Make five correct first-contact calls in seven shots. Later contacts do not score calls.'},
  '004':{name:'Exact Chain',shots:1,goal:'Touch exactly three distinct targets in one shot. A fourth contact fails immediately; fewer than three also fails.'},
  '005':{name:'Last Bubble Standing',shots:6,goal:'Clear the four numbered targets. Never touch the red keeper, even after clearing the other targets.'},
  '006':{name:'Power Order',shots:1,goal:'Collect Comet, Wrap and Stasis in that order in one shot. A wrong-order power fails. Comet boosts speed; Wrap crosses edges; Stasis slows the finish.'},
  '007':{name:'Corner Tour',shots:1,goal:'Visit all four corner gates in one long-gliding shot, then stop in the central finish region. The first ten seconds have low drag.'},
  '008':{name:'Ricochet Golf',shots:12,goal:'Stop inside the cup. Play the three difficulty pools in order as a course; compare the total launches used.'},
  '009':{name:'Landing Zone',shots:6,goal:'Collect both targets, then stop fully inside the mint landing zone. Crossing the zone in motion does not finish the level.'},
  '010':{name:'Narrow Escape',shots:8,goal:'Pass the three gates in order. Touching a red wall or the arena boundary loses the level. Use several controlled shots.'}
});
const id=g=>g.setup.experimentId;
const rect=(x,y,w,h)=>({x,y,w,h,active:true,breakable:false});
const body=(n,kind,x,y,r=20,label=String(n))=>({id:n,kind,x,y,r,label,vx:0,vy:0,hp:1,active:true,fixed:n!==0});
const inZone=(p,z)=>p.x-p.r>=z.x&&p.x+p.r<=z.x+z.w&&p.y-p.r>=z.y&&p.y+p.r<=z.y+z.h;
export function precisionCreate(g){
  const n=g.layout,rule=id(g);g.bodies=[body(0,'player',100,300,16,'')];g.walls=[];g.receiver=null;g.current=null;
  g.precision={banks:0,progress:0,call:1,first:0,failed:'',visited:[],power:0};
  const add=(kind,x,y,r,label)=>g.bodies.push(body(g.bodies.length,kind,x,y,r,label));
  if(rule==='001'){
    // Three genuinely authored routes: direct, wall bank, then a narrower bank.
    const points=n===0?[[300,300],[440,300],[580,300]]:n===1?[[300,100],[480,112],[620,252]]:[[270,130],[480,112],[650,282]];
    for(const [x,y] of points)add('target',x,y,n===2?18:24);
    if(n===2)g.walls.push(rect(340,250,18,250));
  }else if(rule==='002'){
    for(const [x,y] of (n===0?[[220,300],[340,300],[460,300]]:n===1?[[260,160],[440,200],[620,360]]:[[260,160],[440,200],[620,360]]))add('target',x,y,25);
    if(n===2)g.walls.push(rect(340,320,24,180));
  }else if(rule==='003'){
    for(const [x,y] of [[290,150],[500,150],[710,180],[350,450],[650,430]])add('target',x,y,26-n*3);
    if(n>0)g.walls.push(rect(420,230,20,140));
    if(n===2)g.walls.push(rect(600,290,150,20));
  }else if(rule==='004'){
    for(const [x,y] of (n===0?[[260,300],[400,300],[540,300],[740,300]]:n===1?[[250,200],[400,100],[550,80],[700,180]]:[[240,160],[380,40],[520,140],[670,280]]))add('target',x,y,22);
  }else if(rule==='005'){
    for(const [x,y] of [[270,140],[550,140],[270,460],[550,460]])add('target',x,y,24);
    add('keeper',n===2?460:430,300,25+n*8,'×');
    if(n>0)g.walls.push(rect(690,220,20,160));
    if(n===2)g.walls.push(rect(360,60,18,120));
  }else if(rule==='006'){
    for(const [i,[x,y]] of (n===0?[[270,300],[450,300],[650,300]]:n===1?[[270,130],[460,92],[650,282]]:[[270,130],[460,92],[650,282]]) .entries())add('power',x,y,24,['Comet','Wrap','Stasis'][i]);
    if(n===2)g.walls.push(rect(340,230,18,230));
  }else if(rule==='007'){
    g.bodies[0].x=450;g.bodies[0].y=300;
    for(const [x,y] of [[85,75],[815,75],[815,525],[85,525]])add('gate',x,y,100-n*12);
    g.receiver={x:180+n*20,y:145+n*12,w:540-n*40,h:310-n*24};
  }else if(rule==='008'){
    g.receiver=n===0?{x:640,y:240,w:160,h:120}:n===1?{x:700,y:90,w:130,h:110}:{x:690,y:420,w:110,h:100};
    g.walls=n===0?[rect(430,60,20,190)]:n===1?[rect(390,160,20,360)]:[rect(330,70,20,370),rect(550,240,20,290)];
  }else if(rule==='009'){
    for(const [x,y] of (n===0?[[300,300],[480,300]]:n===1?[[270,130],[480,112]]:[[270,130],[480,112]]))add('target',x,y,24);
    g.receiver=n===0?{x:620,y:220,w:220,h:160}:n===1?{x:590,y:200,w:220,h:160}:{x:610,y:230,w:160,h:120};
    if(n===2)g.walls.push(rect(350,250,20,240));
  }else if(rule==='010'){
    const points=n===0?[[270,300],[480,300],[700,300]]:n===1?[[290,130],[500,130],[730,400]]:[[270,120],[520,460],[760,130]];
    for(const [x,y] of points)add('gate',x,y,40-n*5);
    g.walls=n===0?[rect(220,80,560,20),rect(220,500,560,20)]:n===1?[rect(390,230,20,320)]:[rect(360,40,20,330),rect(620,250,20,300)];
  }
  g.nextId=g.bodies.length;g.precision.call=Math.min(1,g.nextId-1);
}
export function precisionLaunch(g){g.precision.banks=0;g.precision.first=0;g.precision.power=0;}
export function precisionAction(g,action,value){
  if(g.mode!=='precision'||g.phase!=='aim'||id(g)!=='003'||action!=='call'||!g.bodies.some(b=>b.id===value&&b.kind==='target'&&b.active))return false;
  g.precision.call=value;return true;
}
export function precisionBank(g){
  g.precision.banks++;
  if(id(g)==='010')g.precision.failed='A forbidden wall was touched.';
}
export function precisionTouch(g,b){
  const p=g.precision,rule=id(g);if(b.kind==='keeper'){p.failed='The keeper was touched.';return;}
  if(rule==='002'&&!p.banks)return;
  if(rule==='003'){
    if(p.first)return;p.first=b.id;
    if(b.id!==p.call){g.log.push('Wrong first contact. Choose the next call.');g.log=g.log.slice(-6);return;}
  }
  if(rule==='006'||rule==='010'){
    if(b.id!==p.progress+1){p.failed=rule==='006'?'Powers were collected out of order.':'Gates were crossed out of order.';return;}
    if(rule==='006'){
      p.power=b.id;
      if(b.id===1){g.bodies[0].vx*=1.15;g.bodies[0].vy*=1.15;}
    }
  }
  if(!p.visited.includes(b.id)){p.visited.push(b.id);p.progress++;b.active=false;g.popped++;g.hit.push(b.id);g.events.push({type:'note',id:b.id,x:b.x,y:b.y,tone:b.id%5,chain:g.hit.length,speed:450,tick:g.tick});}
  if(rule==='004'&&p.progress>3)p.failed='More than three distinct targets were touched.';
}
export function precisionDrag(g){
  if(id(g)==='007'&&g.age<10)return .12;
  if(id(g)==='006'&&g.precision.power===3)return 2;
  return g.age>3?3:1.05;
}
export function precisionWrap(g,b){
  if(id(g)!=='006'||g.precision.power<2||b.kind!=='player')return false;
  if(b.x<b.r)b.x=900-b.r;if(b.x>900-b.r)b.x=b.r;
  if(b.y<b.r)b.y=600-b.r;if(b.y>600-b.r)b.y=b.r;return true;
}
export function precisionOutcome(g){
  const p=g.precision,rule=id(g),count=p.progress;
  if(p.failed)return ['lost',p.failed];
  if(rule==='004')return [count===3?'won':'lost',count===3?'Exactly three distinct contacts.':'The shot needed exactly three distinct contacts.'];
  if(rule==='001'||rule==='006')return [count===3?'won':'lost',count===3?'The complete sequence cleared in one shot.':'The one-shot sequence was not completed.'];
  if(rule==='007')return [count===4&&inZone(g.bodies[0],g.receiver)?'won':'lost',count<4?'Not all four corner gates were visited.':inZone(g.bodies[0],g.receiver)?'Four corners visited and a controlled central finish.':'All gates visited, but the seed stopped outside the finish.'];
  if(rule==='008'&&inZone(g.bodies[0],g.receiver))return ['won','The seed stopped inside the cup.'];
  if(rule==='009'&&count===2&&inZone(g.bodies[0],g.receiver))return ['won','Both targets collected and the landing controlled.'];
  const quota={'002':3,'003':5,'005':4,'010':3}[rule];
  if(quota&&count===quota)return ['won',rule==='003'?'Five correct first-target calls.':'Every required target reached safely.'];
  if(g.shots>=g.setup.settings.shots)return ['lost','The shot budget ran out before the objective was complete.'];
  return null;
}
export function precisionSettle(g){
  if(id(g)==='003')g.precision.call=g.bodies.find(b=>b.kind==='target'&&b.active)?.id??g.precision.call;
}
export function precisionStatus(g){const p=g.precision,r=id(g);return `${p.progress} ${r==='003'?'correct calls':r==='007'||r==='010'?'gates visited':'targets reached'} · ${p.banks} banks this shot${r==='003'?' · Calling target '+p.call:''}`;}
export function precisionValid(g,base){
  const p=g.precision;
  return !!p&&['banks','progress','call','first','power'].every(k=>Number.isInteger(p[k])&&p[k]>=0&&p[k]<=100)&&p.power<=3&&p.call<g.nextId&&p.first<g.nextId&&
    ['','A forbidden wall was touched.','The keeper was touched.','Powers were collected out of order.','Gates were crossed out of order.','More than three distinct targets were touched.'].includes(p.failed)&&
    Array.isArray(p.visited)&&p.progress===p.visited.length&&new Set(p.visited).size===p.visited.length&&p.visited.every(n=>n>0&&base.bodies.some(b=>b.id===n&&b.kind!=='keeper'))&&
    g.bodies.every((b,i)=>b.label===base.bodies[i]?.label&&(b.id===0||b.kind==='keeper'||b.active===!p.visited.includes(b.id)));
}
