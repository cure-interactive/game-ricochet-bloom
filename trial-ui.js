import { TRIAL_MODES,TRIAL_SIZE,trialCreate,trialLaunch,trialStep,trialStatus } from './trial.js?v=36063d9e90fd1a4bf71a10bd815952cddadaf55bcd32dfa41c64f0a3aa0f6ffc';
import { trialRead,trialWrite } from './trial-store.js?v=28ef7976613c8d814c03e8d6b0a6b04824fb995108611cc6eaff7be1088e1610';
import { earningAmount } from './earning.js?v=1afa4d4bcc5833ee186a45acb741cf69d6b41a916791779352cdfa39c28efea4';
import { assetURL } from './asset.js?v=2735d6e4791659059212031525dc3ab0a7b33fac6602b1be6fd2fc97c6e90ff6';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

export const MODE_CARDS=Object.freeze([
  {id:'campaign',name:'Campaign',summary:'Restore five tracks. Build your song.',art:'campaign'},
  {id:'free',name:'Free Play',summary:'An open pool for your unlocked powers.',art:'free'},
  {id:'waves',name:'Endless Waves',summary:'Clear the pool before your shots run out.',art:'waves'},
  {id:'challenge',name:'Challenge',summary:'Chase a score with a limited supply of shots.',art:'challenge'},
  ...Object.entries(TRIAL_MODES).map(([id,m])=>({id,name:m.name,summary:m.summary,art:id}))
]);
const art=mode=>assetURL(`artwork/mode/${mode}.svg`);
const button=(id,label,icon='arrow-left')=>`<button type="button" id="${id}">${iconHTML(icon)}<span>${label}</span></button>`;
const color={player:'#f6f5cf',target:'#ed82bd',blast:'#ffb56e',fire:'#ff765f',gas:'#cadb78',cell:'#a4f4cf',cargo:'#8edbff',plug:'#c6b4ff',vent:'#bf89e8',mote:'#ec8ed7',mud:'#bba18c',spike:'#fa8c91'};
export function trialMount(host){
  const menu=document.createElement('dialog');menu.id='gamemodes-dialog';menu.className='standard-dialog';menu.setAttribute('aria-labelledby','gamemodes-title');
  menu.innerHTML=`<div class="dialog-heading">${button('gamemodes-back','Back')}<h2 id="gamemodes-title">Gamemodes</h2></div><div class="dialog-body mode-body"></div>`;
  const play=document.createElement('dialog');play.id='trial-dialog';play.setAttribute('aria-labelledby','trial-title');
  play.innerHTML=`<div class="trial-heading">${button('trial-back','Modes')}<div><small id="trial-layout"></small><h2 id="trial-title"></h2></div>${button('trial-pause','Pause','pause')}</div><div class="trial-scroll"><p id="trial-goal"></p><div class="trial-stats"><strong id="trial-shots"></strong><span id="trial-status"></span><span id="trial-points"></span></div><div class="trial-board"><canvas id="trial-canvas" width="900" height="600" tabindex="0" aria-label="Trial board. Drag backward and release to launch. Arrow keys aim, Space launches. Escape pauses."></canvas><div id="trial-overlay" hidden><strong id="trial-outcome"></strong><p id="trial-reason"></p>${button('trial-resume','Resume','play')}${button('trial-retry','Retry Layout','reset')}</div></div><p id="trial-alert" role="status" aria-live="polite"></p><button id="trial-save-retry" type="button" hidden>Retry Save</button><div class="trial-controls"><label>Aim <input id="trial-angle" type="range" min="-180" max="180" value="0"><output id="trial-angle-value">0°</output></label><label>Power <input id="trial-power" type="range" min="0" max="100" value="70"><output id="trial-power-value">70%</output></label>${button('trial-launch','Launch','play')}</div><p id="trial-legend" class="trial-legend"></p><details class="trial-help"><summary>Controls and Reaction Log</summary><p>Drag anywhere on the board, pull back, then release. Arrow keys aim; Up/Down change power; Space launches. The board waits while you aim. Escape pauses. Starting another layout replaces only this mode's trial.</p><ol id="trial-log"></ol><p>These experiments use fixed environmental tools. Earn Points from contacts, chains and completion; permanent power mastery is trained in the original modes.</p></details></div>`;
  document.body.append(menu,play);
  const $=id=>document.getElementById(id),canvas=$('trial-canvas'),ctx=canvas.getContext('2d'),content=menu.querySelector('.mode-body');
  let game=null,selected='reaction',paused=false,blocked=false,angle=0,power=.7,drag=null,oldMusic=null,frame=0,last=0,accumulator=0,lastSaved=0,flashes=[];
  const active=()=>!!game&&play.open;
  function showMenu(){if(!menu.open)menu.showModal();$('gamemodes-back').focus({preventScroll:true});}
  function gallery(){host.screen('gamemodes');$('gamemodes-title').textContent='Gamemodes';content.innerHTML='<p class="mode-intro">Choose how you want to play.</p><div class="mode-grid">'+MODE_CARDS.map(m=>`<button type="button" class="mode-card" data-mode="${m.id}"><img src="${art(m.art)}" alt="" width="480" height="240"><span><strong>${m.name}</strong><small>${m.summary}</small>${TRIAL_MODES[m.id]?'<em>Experiment · Three Layouts</em>':''}</span></button>`).join('')+'</div>';
    for(const b of content.querySelectorAll('[data-mode]'))b.onclick=()=>{menu.close();if(TRIAL_MODES[b.dataset.mode])setup(b.dataset.mode);else host.legacy(b.dataset.mode);};showMenu();
  }
  function setup(mode=selected){selected=mode;host.screen('trial-setup');const m=TRIAL_MODES[mode],saved=trialRead(localStorage,host.kind(),mode);$('gamemodes-title').textContent=m.name;
    content.innerHTML=`<div class="mode-overview"><img src="${art(mode)}" alt="" width="480" height="240"><div><p>${m.goal}</p><small>${m.shots} shots · No countdown · Fixed starting tools</small></div></div>`;
    if(saved.ok&&saved.entry){const b=document.createElement('button');b.className='primary trial-continue';b.textContent=`Continue ${m.layouts[saved.entry.game.layout]} · ${saved.entry.game.shots}/${m.shots} shots used`;b.onclick=()=>enter(saved.entry.game,saved.entry.music);content.append(b);}
    if(!saved.ok){const p=document.createElement('p');p.className='trial-warning';p.textContent='This trial save could not be read. It has been left untouched. Choose a layout only if you want to replace it.';content.append(p);}
    const layouts=document.createElement('div');layouts.className='layout-grid';m.layouts.forEach((name,i)=>{const b=document.createElement('button');b.className='layout-card';b.innerHTML=`<span>0${i+1}</span><strong>${name}</strong><small>Start Layout</small>`;b.onclick=()=>enter(trialCreate(mode,i,host.kind()));layouts.append(b);});content.append(layouts);
    const p=document.createElement('p');p.className='trial-legend';p.textContent=m.legend;content.append(p);showMenu();
  }
  function effects(events){for(const e of events){host.sound.eventPlay({...e,id:e.type==='note'?(e.id-1)%20+1:e.id});if(['blast','pop','damage','objective'].includes(e.type))flashes.push({...e,life:e.type==='blast'?.55:.3});}}
  function save(){if(!game)return true;const stored=trialWrite(localStorage,game,host.sound.musicSave());const paid=stored&&host.reward(game.earning);blocked=!paid;if(blocked){paused=true;host.sound.pauseSet(true);$('trial-alert').textContent='Progress could not be saved. Play is paused; retry saving before leaving.';}return paid;}
  function enter(next,music=null){host.save();menu.close();host.screen('trial');oldMusic=host.sound.musicSave();game=next;selected=game.mode;paused=game.phase==='flight';blocked=false;drag=null;flashes=[];angle=0;power=.7;accumulator=0;last=performance.now();lastSaved=game.tick;
    host.sound.musicRestore(music,game.earning.blooms,game.shots);host.sound.portrait=false;host.sound.media.describe(TRIAL_MODES[game.mode].name);host.sound.pauseSet(paused);host.sound.musicStart();host.unlock();play.showModal();save();renderUI();draw();canvas.focus({preventScroll:true});if(!frame)frame=requestAnimationFrame(loop);
  }
  function leave(){if(!save()){renderUI();return;}host.sound.pauseSet(true);play.close();game=null;drag=null;host.sound.musicRestore(oldMusic,oldMusic?.blooms,oldMusic?.plucks);oldMusic=null;host.back();}
  function pause(value=true){if(!active())return;paused=value;drag=null;accumulator=0;host.sound.pauseSet(value);save();renderUI();if(!paused){host.unlock();canvas.focus({preventScroll:true});}}
  function launch(){if(!active()||paused||blocked||game.phase!=='aim')return;if(trialLaunch(game,angle,power)){effects(game.events);save();renderUI();}}
  function retry(){if(!save()){renderUI();return;}const mode=game.mode,layout=game.layout,kind=game.kind;host.sound.pauseSet(true);game=trialCreate(mode,layout,kind);paused=false;flashes=[];angle=0;accumulator=0;host.sound.musicRestore(null,0,0);host.sound.pauseSet(false);save();renderUI();draw();canvas.focus({preventScroll:true});}
  function renderUI(){if(!game)return;const m=TRIAL_MODES[game.mode],ended=['won','lost'].includes(game.phase);$('trial-title').textContent=m.name;$('trial-layout').textContent=m.layouts[game.layout];$('trial-goal').textContent=m.goal;$('trial-shots').textContent=`${m.shots-game.shots} Shots Left`;$('trial-status').textContent=trialStatus(game);$('trial-points').textContent=`${earningAmount(game.earning)} Points Earned`;$('trial-legend').textContent=m.legend;
    $('trial-overlay').hidden=!(paused||ended);$('trial-outcome').textContent=ended?(game.phase==='won'?'Well Played':'Try Another Route'):'Paused';$('trial-reason').textContent=ended?game.reason:'Your board and song are saved.';$('trial-resume').hidden=ended;$('trial-resume').disabled=blocked;$('trial-retry').hidden=!ended;$('trial-retry').disabled=blocked;$('trial-pause').disabled=ended||blocked;$('trial-pause').lastElementChild.textContent=paused?'Resume':'Pause';$('trial-launch').disabled=paused||blocked||game.phase!=='aim';$('trial-save-retry').hidden=!blocked;
    for(const id of ['trial-angle','trial-power'])$(id).disabled=paused||game.phase!=='aim';$('trial-angle').value=Math.round(angle*180/Math.PI);$('trial-power').value=Math.round(power*100);$('trial-angle-value').textContent=`${Math.round(angle*180/Math.PI)}°`;$('trial-power-value').textContent=`${Math.round(power*100)}%`;
    if(!blocked)$('trial-alert').textContent=paused?'Paused. Resume when you are ready.':game.phase==='flight'?'Reaction in motion…':ended?game.reason:game.mode==='outbreak'?'Next: each infected mote advances; each open vent adds one, up to six.':'Drag backward and release, or set your aim and press Launch.';
    $('trial-log').replaceChildren(...game.log.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));canvas.dataset.phase=game.phase;canvas.dataset.tick=game.tick;canvas.dataset.layout=game.layout;canvas.dataset.mode=game.mode;canvas.dataset.shots=game.shots;
  }
  function loop(now){frame=0;if(!active())return;const dt=Math.min(.05,(now-last)/1000);last=now;
    if(!paused&&!blocked&&!document.hidden){host.sound.musicUpdate(.35);accumulator+=dt;while(accumulator>=TRIAL_SIZE.step){const before=game.phase;effects(trialStep(game));accumulator-=TRIAL_SIZE.step;if(before!==game.phase){save();renderUI();}if(blocked)break;}
      if(game.tick-lastSaved>=60){save();lastSaved=game.tick;if(blocked)renderUI();}flashes=flashes.filter(f=>(f.life-=dt)>0);
    }else accumulator=0;
    draw();frame=requestAnimationFrame(loop);
  }
  function draw(){if(!game)return;ctx.clearRect(0,0,900,600);const gradient=ctx.createLinearGradient(0,0,900,600);gradient.addColorStop(0,'#112c36');gradient.addColorStop(1,'#090f22');ctx.fillStyle=gradient;ctx.fillRect(0,0,900,600);
    ctx.fillStyle='#b5e4e512';for(let i=0;i<70;i++){ctx.beginPath();ctx.arc((i*137+40)%900,(i*83+30)%600,1.5,0,Math.PI*2);ctx.fill();}
    if(game.current){const r=game.current;ctx.fillStyle='#7ad7ef12';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle='#74d7ec55';ctx.lineWidth=2;for(let y=r.y+25;y<r.y+r.h;y+=50)for(let x=r.x+20;x<r.x+r.w;x+=55){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+22,y);ctx.lineTo(x+14,y-6);ctx.moveTo(x+22,y);ctx.lineTo(x+14,y+6);ctx.stroke();}}
    if(game.receiver){const r=game.receiver;ctx.fillStyle='#9cf1c92a';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle='#a4f4cf';ctx.lineWidth=3;ctx.strokeRect(r.x,r.y,r.w,r.h);ctx.fillStyle='#a4f4cf';ctx.font='bold 14px sans-serif';ctx.fillText('SAFE',r.x+22,r.y+28);}
    for(const z of game.zones){ctx.fillStyle='#bba18c25';ctx.strokeStyle='#bba18c88';ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();ctx.stroke();}
    for(const w of game.walls)if(w.active){ctx.fillStyle=w.breakable?'#a88760':'#375364';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.strokeStyle=w.breakable?'#f1c698':'#92c4d0';ctx.lineWidth=2;ctx.strokeRect(w.x,w.y,w.w,w.h);if(w.breakable){ctx.strokeStyle='#493a34';for(let y=w.y+8;y<w.y+w.h;y+=12){ctx.beginPath();ctx.moveTo(w.x,y);ctx.lineTo(w.x+w.w,Math.min(y+8,w.y+w.h));ctx.stroke();}}}
    for(const b of game.bodies.filter(b=>b.active)){
      ctx.save();ctx.translate(b.x,b.y);ctx.strokeStyle=color[b.kind];ctx.fillStyle=color[b.kind]+'35';ctx.lineWidth=2.5;
      if(['blast','gas'].includes(b.kind)){ctx.setLineDash([3,9]);ctx.globalAlpha=.15;ctx.beginPath();ctx.arc(0,0,b.kind==='gas'?160:140,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.setLineDash([]);}
      ctx.beginPath();if(b.kind==='spike'||b.kind==='mote'){for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?b.r*.65:b.r;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();}else if(b.kind==='plug'){ctx.moveTo(0,-b.r);ctx.lineTo(b.r,0);ctx.lineTo(0,b.r);ctx.lineTo(-b.r,0);ctx.closePath();}else ctx.arc(0,0,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();
      if(b.kind==='player'){ctx.fillStyle='#fff4d4';ctx.shadowColor='#e8f6c5';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.fill();}
      if(b.kind==='cell'){ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.moveTo(0,-9);ctx.lineTo(0,9);ctx.stroke();if(game.mode==='outbreak'){ctx.fillStyle=color.cell;ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(String(b.hp),0,b.r+19);}}
      if(b.kind==='vent'){ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(0,0,b.r+9,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=color.vent;ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText(game.bodies.filter(b=>b.kind==='mote'&&b.active).length>=6?'CAPPED':'+1',0,5);}
      if(b.kind==='fire'){ctx.beginPath();ctx.moveTo(0,-12);ctx.quadraticCurveTo(16,6,0,12);ctx.quadraticCurveTo(-16,6,0,-12);ctx.stroke();}
      if(b.kind==='blast'){for(let a=0;a<Math.PI*2;a+=Math.PI/4){ctx.beginPath();ctx.moveTo(Math.cos(a)*5,Math.sin(a)*5);ctx.lineTo(Math.cos(a)*12,Math.sin(a)*12);ctx.stroke();}}
      if(b.kind==='cargo'||b.kind==='gas'||b.kind==='mud'){ctx.beginPath();ctx.arc(-5,-4,4,0,Math.PI*2);ctx.arc(6,5,5,0,Math.PI*2);ctx.stroke();}
      ctx.restore();
    }
    for(const f of flashes){ctx.strokeStyle=f.type==='damage'?'#ff8899':'#ffe2aa';ctx.lineWidth=2;ctx.globalAlpha=Math.min(1,f.life*2);ctx.beginPath();ctx.arc(f.x,f.y,f.radius?f.radius*(1-f.life/.6):30*(1-f.life/.4),0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
    if(game.phase==='aim'&&!paused){const p=game.bodies[0],length=70+power*120;ctx.strokeStyle='#fff0b7';ctx.lineWidth=3;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(angle)*length,p.y+Math.sin(angle)*length);ctx.stroke();ctx.setLineDash([]);}
  }
  const point=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*900/r.width,y:(e.clientY-r.top)*600/r.height};};
  canvas.onpointerdown=e=>{if(e.button!==0||paused||blocked||game?.phase!=='aim')return;drag={...point(e),id:e.pointerId};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});};
  canvas.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e),dx=drag.x-p.x,dy=drag.y-p.y;if(Math.hypot(dx,dy)>4){angle=Math.atan2(dy,dx);power=Math.min(1,Math.hypot(dx,dy)/180);renderUI();}};
  canvas.onpointerup=e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e),distance=Math.hypot(p.x-drag.x,p.y-drag.y);drag=null;if(distance>8)launch();};canvas.onpointercancel=canvas.onlostpointercapture=()=>{drag=null;};
  canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){e.preventDefault();if(e.key===' ')launch();else {if(game.phase!=='aim'||paused)return;if(e.key==='ArrowLeft')angle-=Math.PI/36;if(e.key==='ArrowRight')angle+=Math.PI/36;if(e.key==='ArrowUp')power=Math.min(1,power+.05);if(e.key==='ArrowDown')power=Math.max(0,power-.05);angle=Math.atan2(Math.sin(angle),Math.cos(angle));renderUI();}}};
  $('trial-angle').oninput=e=>{angle=Number(e.target.value)*Math.PI/180;renderUI();};$('trial-power').oninput=e=>{power=Number(e.target.value)/100;renderUI();};$('trial-launch').onclick=launch;$('trial-back').onclick=leave;$('trial-pause').onclick=()=>pause(!paused);$('trial-resume').onclick=()=>pause(false);$('trial-retry').onclick=retry;$('trial-save-retry').onclick=()=>{save();renderUI();};$('gamemodes-back').onclick=()=>{menu.close();host.back();};
  menu.addEventListener('cancel',e=>{e.preventDefault();menu.close();host.back();});play.addEventListener('cancel',e=>{e.preventDefault();pause();});
  for(const event of ['pagehide','freeze'])window.addEventListener(event,()=>pause());document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  return {gallery,setup,save,pause,get active(){return active();}};
}
