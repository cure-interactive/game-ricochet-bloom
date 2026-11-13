import { screenHeader } from './screen-header.js?v=b3d9b07c196b969e345063358159bcabb90c6ae99410d49934cf4b23eb185c73';
import { GAMEMODE_CARDS, GAMEMODE_CATEGORIES, GAMEMODE_GROUPS, gamemodePage } from './gamemode-catalogue.js?v=99e41d0b4b8898299b938a128fa13bfefa127190e72f8c9ab61461141c001004';
import { songKeep } from './song.js?v=f967d4f585d3d5300be734f4ed6a4870e0de8c85450ff8f6bd9ad5fb49f1ae60';
import { melodyDraw } from './melody-trial.js?v=5e546567b46445c986bbf1d941f8e10f4a9a07413c2822cd9af4cfda8fe0b363';
import { experimentArt } from './experiment-art.js?v=3122a3a41bebb8d9124ce486b6eac7fcbcbee35a9041fcd15de114d423abc0a1';
import { experimentMount } from './experiment-ui.js?v=20bb3cd1d0446f538878a8cf4f6f7ca866089629915d86fd49fd00b2614ec24b';
import { experimentRewarded, experimentGoal, EXPERIMENT_RECIPES } from './experiment.js?v=09c5c1a420167e74a8d503604cf362e056a4708773247dbe20745db8766748a0';
import { experimentRead, experimentFavourite, experimentSave, experimentWrite, experimentEmpty, experimentExport } from './experiment-store.js?v=46e3d9a9ca8fe076b8f7236c25ea854f8e95b89628f352cbe0ae41ec56c83a81';
import { SCORE_BUDGETS, SCORE_DEFAULT, scoreTargets, scoreMedal } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
import { scoreRead } from './score-attack-store.js?v=818806d3208b92737e856f74449dbd9f0421e26d62587d05493451302c7ca822';
import { TRIAL_MODES,TRIAL_SIZE,trialCreate,trialLaunch,trialStep,trialStatus,trialShots,trialRelease,trialAction,trialPlayer } from './trial.js?v=1142334db4d9446b27b412cbc5ad6d9c93bebb7180ae6b645ebcc92c561dd824';
import { trialRead,trialWrite } from './trial-store.js?v=24ceed76d9888cbd13210f5716988b7adb37492ad0ff3aa6b2157afccdeb98fa';
import { earningAmount } from './earning.js?v=408b9cb571894b109f7df2643c488476ddad89967db77e8d677dfcca3957c9f0';
import { assetURL } from './asset.js?v=b3d67cd59b1fb1de0bb8b884bdbe9342d63123b048ea238da59ff590cd8dd959';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';


const art=mode=>assetURL(`artwork/mode/${mode}.svg`);
const button=(id,label,icon='arrow-left')=>`<button type="button" id="${id}">${iconHTML(icon)}<span>${label}</span></button>`;
const color={'music-note':'#a4f4cf','beat-gate':'#eb9bcd','sound-hazard':'#ff8b91',instrument:'#f2d279',keeper:'#ff8b91',gate:'#9ce6cf',power:'#c4a7ff',payload:'#ffb56e',player:'#f6f5cf',target:'#ed82bd',blast:'#ffb56e',fire:'#ff765f',gas:'#cadb78',cell:'#a4f4cf',cargo:'#8edbff',plug:'#c6b4ff',vent:'#bf89e8',mote:'#ec8ed7',mud:'#bba18c',spike:'#fa8c91'};
export function trialMount(host){
  const menu=document.createElement('dialog');menu.id='gamemodes-dialog';menu.className='standard-dialog';menu.setAttribute('aria-labelledby','gamemodes-title');
  menu.innerHTML=`${screenHeader({className:'dialog-heading',title:'Gamemodes',titleId:'gamemodes-title',back:button('gamemodes-back','Back')})}<div class="dialog-body mode-body"></div>`;
  const play=document.createElement('dialog');play.id='trial-dialog';play.setAttribute('aria-labelledby','trial-title');
  play.innerHTML=`${screenHeader({className:'trial-heading',titleId:'trial-title',metaId:'trial-layout',back:button('trial-back','Back'),actions:button('trial-pause','Pause','pause')})}<div class="trial-scroll"><p id="trial-goal"></p><div id="trial-actions" class="trial-actions"></div><div class="trial-stats"><span class="trial-wallet" aria-label="Available Points for the Skill Tree">Points <strong id="trial-wallet">0</strong></span><strong id="trial-shots"></strong><span id="trial-status"></span><span id="trial-points"></span></div><div class="trial-board"><canvas id="trial-canvas" width="900" height="600" tabindex="0" aria-label="Trial board. Drag backward and release to launch. Arrow keys aim, Space launches. Escape pauses."></canvas><div id="trial-overlay" hidden><strong id="trial-outcome"></strong><p id="trial-reason"></p>${button('trial-resume','Resume','play')}${button('trial-retry','Retry Same Setup','reset')}<button id="trial-review">Review / Change Setup</button>${button('trial-home','Main Menu','grid')}</div></div><p id="trial-alert" role="status" aria-live="polite"></p><button id="trial-save-retry" type="button" hidden>Retry Save</button><button id="trial-export" type="button" hidden>Export Pending Run</button><div class="trial-controls"><label>Aim <input id="trial-angle" type="range" min="-180" max="180" value="0"><output id="trial-angle-value">0°</output></label><label>Power <input id="trial-power" type="range" min="0" max="100" value="70"><output id="trial-power-value">70%</output></label>${button('trial-launch','Launch','play')}<button id="trial-release" hidden>Release Payload</button></div><p id="trial-legend" class="trial-legend"></p><details class="trial-help"><summary>Controls and Reaction Log</summary><p>Drag anywhere on the board, pull back, then release. Arrow keys aim; Up/Down change power; Space launches. The board waits while you aim. Escape pauses. Each experiment setup keeps a separate save. Retry uses the same layout and settings.</p><ol id="trial-log"></ol><p>These experiments use fixed environmental tools. Standard original trials earn Points; variations record results separately. Permanent power mastery is trained in the original modes.</p></details></div>`;
  document.body.append(menu,play);
  const $=id=>document.getElementById(id),canvas=$('trial-canvas'),ctx=canvas.getContext('2d'),content=menu.querySelector('.mode-body');
  let game=null,selected='reaction',paused=false,blocked=false,angle=0,power=.7,drag=null,oldMusic=null,frame=0,last=0,accumulator=0,lastSaved=0,flashes=[];
  const active=()=>!!game&&play.open;
  function showMenu(){if(!menu.open)menu.showModal();$('gamemodes-back').focus({preventScroll:true});}
  const galleryState=new Map();
  let rememberGallery=()=>{};
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const starArt='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2L3.2 9.6l6.3-.9Z"/></svg>';
  function gallery(view=''){
    rememberGallery();
    if(!['','favourites','development',...GAMEMODE_GROUPS.map(g=>'group:'+g.id)].includes(view))view='';
    const state=galleryState.get(view)??{query:'',category:'',scroll:0};galleryState.set(view,state);
    host.screen(view?'gamemodes:'+view:'gamemodes');
    const group=GAMEMODE_GROUPS.find(g=>view==='group:'+g.id),title=group?.name??(view==='favourites'?'Favourites':view==='development'?'In Development':'Gamemodes');
    $('gamemodes-title').textContent=title;
    content.innerHTML=`<nav class="gamemode-navigation" aria-label="Gamemode navigation">${view?'<button id="gamemode-root">Gamemodes</button>':''}<button id="gamemode-favourites" aria-pressed="${view==='favourites'}">${starArt} Favourites</button><button id="gamemode-development" aria-pressed="${view==='development'}">In Development</button><button id="gamemode-notebook">Saved Runs & Notes</button></nav><p class="mode-intro">${group?escape(group.description):view==='favourites'?'Your starred games, ready to open directly.':view==='development'?'Explore ideas whose gameplay is still being built.':'Choose a game or explore a collection of related challenges.'}</p><div class="gamemode-filter"><label>Search All Gamemodes<input id="gamemode-search" type="search" placeholder="Name, mechanic or idea number" value="${escape(state.query)}"></label>${view==='development'?`<label>Category<select id="gamemode-category"><option value="">All categories</option>${GAMEMODE_CATEGORIES.map(m=>`<option value="${m.id}"${state.category===m.id?' selected':''}>${m.name}</option>`).join('')}</select></label>`:''}</div><p id="gamemode-count" class="gamemode-count" role="status" aria-live="polite"></p><div id="gamemode-list"></div><p id="gamemode-save-status" role="status"></p>`;
    function card(e,favourites,readable){
      const starred=favourites.includes(e.id),label=`${starred?'Unstar':'Star'} ${e.name}`;
      return `<article class="mode-card-shell"><button type="button" class="mode-card" data-gamemode="${e.id}">${e.art?`<img src="${art(e.art)}" alt="" width="480" height="240">`:experimentArt(e.id)}<span><small class="mode-category">${GAMEMODE_CATEGORIES.find(c=>c.id===e.category)?.name??''}${/^\d/.test(e.id)?' · #'+e.id:''}</small><strong>${escape(e.name)}</strong><small>${escape(e.description)}</small><em>${e.playable?(e.route==='setup'?'Three Difficulty Levels':'Play & Settings'):'In Development · View Idea'}</em></span></button><button type="button" class="mode-star" data-favourite="${e.id}" aria-label="${escape(label)}" aria-pressed="${starred}" title="${escape(label)}" ${readable?'':'disabled'}>${starArt}</button></article>`;
    }
    function cards(){
      const read=experimentRead(localStorage,host.kind()),favourites=read.library?.favourites??[],page=gamemodePage({view,query:state.query,category:state.category,favourites});
      $('gamemode-count').textContent=state.query.trim()?`${page.entries.length} search result${page.entries.length===1?'':'s'} across all gamemodes`:page.groups.length?`${page.entries.length} games · ${page.groups.length} collections`:`${page.entries.length} ${view==='development'?'idea':'game'}${page.entries.length===1?'':'s'}`;
      $('gamemode-save-status').textContent=read.ok?'':'Favourites could not be read. Your existing notebook is preserved.';
      const sections=[true,false].map(playable=>{const entries=page.entries.filter(e=>e.playable===playable);return entries.length?`<section class="gamemode-group"><h3>${playable?'Play Now':'In Development'}</h3><div class="mode-grid">${entries.map(e=>card(e,favourites,read.ok)).join('')}</div></section>`:'';}).join('');
      const collections=page.groups.length?`<section class="gamemode-group"><h3>Collections</h3><div class="mode-grid">${page.groups.map(g=>`<button type="button" class="mode-card" data-group="${g.id}">${experimentArt(g.art)}<span><strong>${g.name}</strong><small>${g.description}</small><em>${g.count} Playable Games · Explore</em></span></button>`).join('')}</div></section>`:'';
      $('gamemode-list').innerHTML=sections+collections||`<p class="gamemode-empty">${view==='favourites'&&!state.query?'No favourites yet. Star a game using the button in the top-right corner of its card.':'No games match. Try another search or category.'}</p>`;
      if(page.planned)$('gamemode-list').insertAdjacentHTML('beforeend',`<p>${page.planned} related ideas are still in development.</p>`);
      for(const b of content.querySelectorAll('[data-gamemode]'))b.onclick=()=>{rememberGallery();const e=GAMEMODE_CARDS.find(e=>e.id===b.dataset.gamemode);if(e.route==='legacy'){menu.close();host.legacy(e.id);}else if(e.route==='destination')scoreSetup();else if(e.route==='setup')hub.setup(e.id);else hub.detail(e.id);};
      for(const b of content.querySelectorAll('[data-group]'))b.onclick=()=>navigate('group:'+b.dataset.group);
      for(const b of content.querySelectorAll('[data-favourite]'))b.onclick=()=>{
        const id=b.dataset.favourite,scroll=content.scrollTop,result=experimentFavourite(localStorage,host.kind(),id);
        if(!result.ok){$('gamemode-save-status').textContent='Could not save this favourite. Your existing notebook is preserved. Please try again.';return;}
        cards();content.scrollTop=scroll;(content.querySelector(`[data-favourite="${id}"]`)??content.querySelector('[data-favourite]')??$('gamemode-favourites')).focus({preventScroll:true});
        $('gamemode-save-status').textContent=result.active?'Added to Favourites.':'Removed from Favourites.';
      };
    }
    function navigate(next){state.scroll=content.scrollTop;gallery(next);}
    $('gamemode-root')?.addEventListener('click',()=>navigate(''));
    $('gamemode-favourites').onclick=()=>navigate('favourites');
    $('gamemode-development').onclick=()=>navigate('development');
    $('gamemode-notebook').onclick=()=>{rememberGallery();hub.hub();};
    $('gamemode-search').oninput=e=>{state.query=e.target.value;state.scroll=0;cards();};
    $('gamemode-category')?.addEventListener('change',e=>{state.category=e.target.value;state.scroll=0;cards();});
    cards();showMenu();content.scrollTop=state.scroll;
    rememberGallery=()=>{state.scroll=content.scrollTop;rememberGallery=()=>{};};
  }
  let budget=SCORE_DEFAULT;
  function scoreSetup(){
    host.screen('score-setup');$('gamemodes-title').textContent='Score Attack';
    content.innerHTML=`<div class="mode-overview"><img src="${art('score-attack')}" alt="" width="480" height="240"><div><p>Build chains, bank off walls and trigger blooms. Use every shot to chase your best score.</p><small>No countdown · No extra shots · Final shot finishes before scoring</small></div></div><div class="layout-grid" role="group" aria-label="Shot budget">${SCORE_BUDGETS.map(n=>`<button class="layout-card" data-budget="${n}" aria-pressed="${n===budget}"><strong>${n} Shots</strong><small>${n===5?'Quick Run':n===10?'Standard Run':'Long Run'}</small></button>`).join('')}</div><div id="score-setup-detail"></div>`;
    for(const b of content.querySelectorAll('[data-budget]'))b.onclick=()=>{budget=Number(b.dataset.budget);scoreSetup();content.querySelector(`[data-budget="${budget}"]`).focus();};
    const saved=scoreRead(localStorage,host.kind(),budget),targets=scoreTargets(budget),detail=$('score-setup-detail');
    const medal=saved.best===null?null:scoreMedal(saved.best,budget);
    detail.innerHTML=`<p><strong>Bronze ${targets.Bronze.toLocaleString('en-US')}</strong> · Silver ${targets.Silver.toLocaleString('en-US')} · Gold ${targets.Gold.toLocaleString('en-US')}</p><p>${saved.best===null?'No completed best yet':`Personal Best: ${saved.best.toLocaleString('en-US')}${medal?' · '+medal:''}`}</p><p>Points earned here are usable in the Skill Tree. Your researched skills are fixed when a run starts; new purchases apply to your next run. Each budget and profile keeps its own save and completed best. Runs begin with the same layout; bubbles drift while you aim.</p>`;
    if(!saved.ok){const warning=document.createElement('p');warning.className='trial-warning';warning.textContent='This save could not be read. It is preserved until you explicitly replace it.';detail.append(warning);}
    if(saved.entry&&!saved.entry.game.isOver){const b=document.createElement('button');b.className='primary';b.textContent=`Continue · ${saved.entry.game.plucks} Shots Left`;b.onclick=()=>{menu.close();host.scorePlay(budget,false);};detail.append(b);}
    const start=document.createElement('button');start.className='primary';start.textContent=saved.entry&&!saved.entry.game.isOver?'Replace Saved Run':!saved.ok?'Replace Unreadable Save':`Start ${budget} Shots`;start.onclick=()=>{if((!saved.ok||saved.entry&&!saved.entry.game.isOver)&&!confirm(saved.ok?'Replace this budget’s saved run? Completed personal bests and earned Points are kept.':'Replace this unreadable save? Its personal best cannot be recovered. Your Skill Tree Points are kept.'))return;menu.close();host.scorePlay(budget,true);};detail.append(start);showMenu();
  }
  const hub=experimentMount({content,title:$('gamemodes-title'),show:showMenu,screen:host.screen,kind:host.kind,start:enter,destination:()=>{menu.close();scoreSetup();},modes:gallery,wiki:id=>{menu.close();host.wiki(id);}});
  const setup=(id)=>hub.setup(id);
  function effects(events){for(const e of events){host.sound.eventPlay({...e,id:e.type==='note'?(e.id-1)%20+1:e.id});if(['blast','pop','damage','objective'].includes(e.type))flashes.push({...e,life:e.type==='blast'?.55:.3});}}
  function save(){
    if(!game)return true;let stored=false;
    if(game.setup){const read=experimentRead(localStorage,game.kind);try{stored=read.ok&&experimentWrite(localStorage,game.kind,experimentSave(read.library,game,host.sound.musicSave()));}catch{stored=false;}}
    else stored=trialWrite(localStorage,game,host.sound.musicSave());
    const paid=stored&&(!experimentRewarded(game.setup)||host.reward(game.earning));blocked=!paid;
    if(blocked){paused=true;host.sound.pauseSet(true);$('trial-alert').textContent='Progress could not be saved. Play is paused; retry saving or export this run before leaving.';}return paid;
  }
  function enter(next,music=null){host.save();menu.close();host.screen('trial');oldMusic=host.sound.musicSave();game=next;selected=game.mode;if(game.setup)hub.select(game.setup);paused=game.phase==='flight';blocked=false;drag=null;flashes=[];angle=0;power=.7;accumulator=0;last=performance.now();lastSaved=game.tick;
    host.sound.musicRestore(music,game.earning.blooms,game.shots);host.sound.portrait=false;host.sound.media.describe(TRIAL_MODES[game.mode].name);host.sound.pauseSet(paused);host.sound.musicStart();host.unlock();play.showModal();save();renderUI();draw();canvas.focus({preventScroll:true});if(!frame)frame=requestAnimationFrame(loop);
  }
  function leave(toHome=false){if(!save()){renderUI();return;}host.sound.pauseSet(true);play.close();game=null;drag=null;host.sound.musicRestore(oldMusic,oldMusic?.blooms,oldMusic?.plucks);oldMusic=null;if(toHome===true)host.home();else host.back();}
  function pause(value=true){if(!active())return;paused=value;drag=null;accumulator=0;host.sound.pauseSet(value);save();renderUI();if(!paused){host.unlock();canvas.focus({preventScroll:true});}}
  function launch(){if(!active()||paused||blocked||game.phase!=='aim')return;if(trialLaunch(game,angle,power)){effects(game.events);save();renderUI();}}
  function retry(){if(!save()){renderUI();return;}const mode=game.mode,layout=game.layout,kind=game.kind;host.sound.pauseSet(true);game=trialCreate(mode,layout,kind,undefined,game.setup);paused=false;flashes=[];angle=0;accumulator=0;host.sound.musicRestore(null,0,0);host.sound.pauseSet(false);save();renderUI();draw();canvas.focus({preventScroll:true});}
  function renderUI(){if(!game)return;const m=TRIAL_MODES[game.mode],ended=['won','lost'].includes(game.phase);$('trial-title').textContent=EXPERIMENT_RECIPES[game.setup?.experimentId]?.name??m.name;$('trial-layout').textContent=m.layouts[game.layout]+(game.setup?' · '+game.setup.preset.replace(/^./,c=>c.toUpperCase()):' · Earlier Trial');$('trial-goal').textContent=game.setup?experimentGoal(game.setup):m.goal;$('trial-shots').textContent=game.setup?.experimentId==='090'?`${game.shots} Shots Played`:`${trialShots(game)-game.shots} Shots Left`;$('trial-status').textContent=trialStatus(game);$('trial-wallet').textContent=host.points().toLocaleString('en-US');$('trial-points').textContent=!experimentRewarded(game.setup)?'Experiment · No Points Awarded':`${earningAmount(game.earning)} Point${earningAmount(game.earning)===1?'' : 's'} Earned This Run`;$('trial-legend').textContent=m.legend;
    $('trial-overlay').hidden=!(paused||ended);$('trial-outcome').textContent=ended?(game.phase==='won'?'Well Played':'Try Another Route'):'Paused';$('trial-reason').textContent=ended?game.reason:'Your progress is saved.';$('trial-resume').hidden=ended;$('trial-resume').disabled=blocked;$('trial-retry').hidden=!ended;$('trial-retry').disabled=blocked;$('trial-pause').disabled=ended||blocked;$('trial-pause').lastElementChild.textContent=paused?'Resume':'Pause';$('trial-launch').disabled=paused||blocked||game.phase!=='aim'||!!game.melody?.preview||game.shots>=trialShots(game);$('trial-save-retry').hidden=!blocked;$('trial-export').hidden=!blocked||!game.setup;$('trial-release').hidden=game.mode!=='capture';$('trial-release').disabled=paused||blocked||game.phase!=='aim'||game.payloadState!=='carried';$('trial-review').hidden=!ended;$('trial-review').disabled=blocked;$('trial-home').hidden=!ended;$('trial-home').disabled=blocked;
    const actions=$('trial-actions');
    if(game.setup?.experimentId==='003'){
      actions.innerHTML='<label>Call Your First Target<select id="trial-call">'+game.bodies.filter(b=>b.kind==='target'&&b.active).map(b=>`<option value="${b.id}"${b.id===game.precision.call?' selected':''}>Target ${b.id}</option>`).join('')+'</select></label>';
      $('trial-call').disabled=paused||blocked||game.phase!=='aim';$('trial-call').onchange=e=>{if(trialAction(game,'call',Number(e.target.value))){save();renderUI();}};
    }else if(game.mode==='music'){
      actions.innerHTML=game.setup.experimentId==='083'?'<button id="trial-preview">Replay Call</button>':game.setup.experimentId==='090'?'<button id="trial-compose">Save Composition</button>':'';
      const action=$('trial-preview')??$('trial-compose');if(action){action.disabled=paused||blocked||game.phase!=='aim'||(game.setup.experimentId==='090'&&!game.melody.heard.length);action.onclick=()=>{if(game.setup.experimentId==='090'){const kept=songKeep(localStorage,{id:game.id,name:'Composition · '+TRIAL_MODES.music.layouts[game.layout],created:Date.now(),music:host.sound.musicSave()});if(!kept.ok){alert(kept.reason);return;}}if(trialAction(game,game.setup.experimentId==='083'?'preview':'finish')){save();renderUI();}};}
    }else actions.replaceChildren();
    for(const id of ['trial-angle','trial-power'])$(id).disabled=paused||game.phase!=='aim';$('trial-angle').value=Math.round(angle*180/Math.PI);$('trial-power').value=Math.round(power*100);$('trial-angle-value').textContent=`${Math.round(angle*180/Math.PI)}°`;$('trial-power-value').textContent=`${Math.round(power*100)}%`;
    if(!blocked)$('trial-alert').textContent=paused?'Paused. Resume when you are ready.':game.phase==='flight'?'Shot in motion…':game.melody?.preview?'Watch and listen to the call. Launch unlocks after the phrase.':ended?game.reason:game.mode==='outbreak'?'Next: infection advances and vents follow their shown turn schedules. The infection cap is six.':'Drag backward and release, or set your aim and press Launch.';
    $('trial-log').replaceChildren(...game.log.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));canvas.dataset.phase=game.phase;canvas.dataset.tick=game.tick;canvas.dataset.layout=game.layout;canvas.dataset.mode=game.mode;canvas.dataset.shots=game.shots;
  }
  function loop(now){frame=0;if(!active())return;const dt=Math.min(.05,(now-last)/1000);last=now;
    if(!paused&&!blocked&&!document.hidden){host.sound.musicUpdate(game.setup?.experimentId==='087'?game.melody.chains/2:.35);accumulator+=dt;while(accumulator>=TRIAL_SIZE.step){const before=game.phase,beforePreview=!!game.melody?.preview,beforeHits=game.hit.length;effects(trialStep(game));accumulator-=TRIAL_SIZE.step;if(before!==game.phase||beforePreview!==!!game.melody?.preview){save();renderUI();}else if(game.mode==='music'&&beforeHits!==game.hit.length)renderUI();if(blocked)break;}
      if(game.tick-lastSaved>=60){save();lastSaved=game.tick;if(blocked)renderUI();}flashes=flashes.filter(f=>(f.life-=dt)>0);
    }else accumulator=0;
    draw();frame=requestAnimationFrame(loop);
  }
  function draw(){if(!game)return;ctx.clearRect(0,0,900,600);const gradient=ctx.createLinearGradient(0,0,900,600);gradient.addColorStop(0,'#112c36');gradient.addColorStop(1,'#090f22');ctx.fillStyle=gradient;ctx.fillRect(0,0,900,600);
    ctx.fillStyle='#b5e4e512';for(let i=0;i<70;i++){ctx.beginPath();ctx.arc((i*137+40)%900,(i*83+30)%600,1.5,0,Math.PI*2);ctx.fill();}
    if(game.current){const r=game.current;ctx.fillStyle='#7ad7ef12';ctx.beginPath();ctx.roundRect(r.x,r.y,r.w,r.h,10);ctx.fill();ctx.strokeStyle='#74d7ec55';ctx.lineWidth=2;for(let y=r.y+25;y<r.y+r.h;y+=50)for(let x=r.x+20;x<r.x+r.w;x+=55){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+22,y);ctx.lineTo(x+14,y-6);ctx.moveTo(x+22,y);ctx.lineTo(x+14,y+6);ctx.stroke();}}
    if(game.receiver){const r=game.receiver;ctx.fillStyle='#9cf1c92a';ctx.beginPath();ctx.roundRect(r.x,r.y,r.w,r.h,10);ctx.fill();ctx.strokeStyle='#a4f4cf';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#a4f4cf';ctx.font='bold 14px sans-serif';ctx.fillText(game.mode==='precision'?'FINISH':'SAFE',r.x+14,r.y+28);}
    for(const z of game.zones){ctx.fillStyle='#bba18c25';ctx.strokeStyle='#bba18c88';ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();ctx.stroke();}
    for(const w of game.walls)if(w.active){ctx.fillStyle=game.setup?.experimentId==='010'?'#783b50':w.breakable?'#a88760':'#375364';ctx.beginPath();ctx.roundRect(w.x,w.y,w.w,w.h,Math.min(8,w.w/2,w.h/2));ctx.fill();ctx.strokeStyle=w.breakable?'#f1c698':'#92c4d0';ctx.lineWidth=2;ctx.stroke();if(w.breakable){ctx.strokeStyle='#493a34';for(let y=w.y+8;y<w.y+w.h;y+=12){ctx.beginPath();ctx.moveTo(w.x,y);ctx.lineTo(w.x+w.w,Math.min(y+8,w.y+w.h));ctx.stroke();}}}
    if(game.mode==='music')melodyDraw(game,ctx);
    for(const b of game.bodies.filter(b=>b.active)){
      ctx.save();ctx.translate(b.x,b.y);ctx.strokeStyle=color[b.kind];ctx.fillStyle=color[b.kind]+'35';ctx.lineWidth=2.5;
      if(['blast','gas'].includes(b.kind)){ctx.setLineDash([3,9]);ctx.globalAlpha=.15;ctx.beginPath();ctx.arc(0,0,b.kind==='gas'?160:140,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.setLineDash([]);}
      ctx.beginPath();if(b.kind==='spike'||b.kind==='mote'){for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?b.r*.65:b.r;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();}else if(b.kind==='plug'){ctx.moveTo(0,-b.r);ctx.lineTo(b.r,0);ctx.lineTo(0,b.r);ctx.lineTo(-b.r,0);ctx.closePath();}else ctx.arc(0,0,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();
      if(b.kind==='player'&&game.payloadState==='carried'){ctx.strokeStyle='#ffb56e';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,27,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=color.player;}
      if(b.kind==='player'){ctx.fillStyle='#fff4d4';ctx.shadowColor='#e8f6c5';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.fill();}
      if(b.kind==='cell'){ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.moveTo(0,-9);ctx.lineTo(0,9);ctx.stroke();if(game.mode==='outbreak'){ctx.fillStyle=color.cell;ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(String(b.hp),0,b.r+19);}}
      if(b.kind==='vent'){ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(0,0,b.r+9,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=color.vent;ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText(game.bodies.filter(b=>b.kind==='mote'&&b.active).length>=6?'CAPPED':`${(game.setup?.settings.sourceEvery??1)+(game.setup?.experimentId==='032'&&b.id===3?1:0)-game.shots%((game.setup?.settings.sourceEvery??1)+(game.setup?.experimentId==='032'&&b.id===3?1:0))}t`,0,5);}
      if(b.kind==='fire'){ctx.beginPath();ctx.moveTo(0,-12);ctx.quadraticCurveTo(16,6,0,12);ctx.quadraticCurveTo(-16,6,0,-12);ctx.stroke();}
      if(b.kind==='blast'){for(let a=0;a<Math.PI*2;a+=Math.PI/4){ctx.beginPath();ctx.moveTo(Math.cos(a)*5,Math.sin(a)*5);ctx.lineTo(Math.cos(a)*12,Math.sin(a)*12);ctx.stroke();}}
      if(b.kind==='cargo'||b.kind==='gas'||b.kind==='mud'){ctx.beginPath();ctx.arc(-5,-4,4,0,Math.PI*2);ctx.arc(6,5,5,0,Math.PI*2);ctx.stroke();}
      if(b.label){ctx.fillStyle=color[b.kind]??'#e5f7ff';ctx.font=b.kind==='power'?'13px sans-serif':'bold 17px sans-serif';ctx.textAlign='center';ctx.fillText(b.label,0,b.kind==='power'?b.r+20:6);}
      ctx.restore();
    }
    for(const f of flashes){ctx.strokeStyle=f.type==='damage'?'#ff8899':'#ffe2aa';ctx.lineWidth=2;ctx.globalAlpha=Math.min(1,f.life*2);ctx.beginPath();ctx.arc(f.x,f.y,f.radius?f.radius*(1-f.life/.6):30*(1-f.life/.4),0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
    if(game.phase==='aim'&&!paused){const p=trialPlayer(game),length=70+power*120;ctx.strokeStyle='#fff0b7';ctx.lineWidth=3;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(angle)*length,p.y+Math.sin(angle)*length);ctx.stroke();ctx.setLineDash([]);}
  }
  const point=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*900/r.width,y:(e.clientY-r.top)*600/r.height};};
  canvas.onpointerdown=e=>{if(e.button!==0||paused||blocked||game?.phase!=='aim')return;drag={...point(e),id:e.pointerId};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});};
  canvas.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e),dx=drag.x-p.x,dy=drag.y-p.y;if(Math.hypot(dx,dy)>4){angle=Math.atan2(dy,dx);power=Math.min(1,Math.hypot(dx,dy)/180);renderUI();}};
  canvas.onpointerup=e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e),distance=Math.hypot(p.x-drag.x,p.y-drag.y);drag=null;if(distance>8)launch();};canvas.onpointercancel=canvas.onlostpointercapture=()=>{drag=null;};
  canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){e.preventDefault();if(e.key===' ')launch();else {if(game.phase!=='aim'||paused)return;if(e.key==='ArrowLeft')angle-=Math.PI/36;if(e.key==='ArrowRight')angle+=Math.PI/36;if(e.key==='ArrowUp')power=Math.min(1,power+.05);if(e.key==='ArrowDown')power=Math.max(0,power-.05);angle=Math.atan2(Math.sin(angle),Math.cos(angle));renderUI();}}};
  $('trial-release').onclick=()=>{if(!paused&&!blocked&&trialRelease(game)){effects(game.events);save();renderUI();draw();}};
  $('trial-home').onclick=()=>leave(true);
  $('trial-review').onclick=()=>{const id=game.setup?.experimentId??game.mode;leave();if(!game){hub.setup(id);content.querySelector('.experiment-review').open=true;}};
  $('trial-export').onclick=()=>{try{const read=experimentRead(localStorage,game.kind),pending=experimentSave(read.library??experimentEmpty(),game,host.sound.musicSave()),url=URL.createObjectURL(new Blob([experimentExport(pending,game.kind)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='ricochet-bloom-pending-experiment.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{alert('The pending run could not be exported. Keep this tab open and retry saving.');}};
  $('trial-angle').oninput=e=>{angle=Number(e.target.value)*Math.PI/180;renderUI();};$('trial-power').oninput=e=>{power=Number(e.target.value)/100;renderUI();};$('trial-launch').onclick=launch;$('trial-back').onclick=leave;$('trial-pause').onclick=()=>pause(!paused);$('trial-resume').onclick=()=>pause(false);$('trial-retry').onclick=retry;$('trial-save-retry').onclick=()=>{save();renderUI();};$('gamemodes-back').onclick=()=>{rememberGallery();menu.close();host.back();};
  menu.addEventListener('cancel',e=>{e.preventDefault();rememberGallery();menu.close();host.back();});play.addEventListener('cancel',e=>{e.preventDefault();pause();});
  for(const event of ['pagehide','freeze'])window.addEventListener(event,()=>pause());document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  return {gallery,setup,hub:hub.hub,family:hub.family,detail:hub.detail,scoreSetup,save,pause,get active(){return active();}};
}
