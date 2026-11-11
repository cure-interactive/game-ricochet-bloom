import { upgradePreviewMount, upgradeFixture, BUILD_EXAMPLES } from './upgrade-preview.js?v=273d3ce8311febbf71221b79fdd8b511e76fa773a19d0d3dbe913e0f8abd57c2';
import { rewardMount } from './reward-ui.js?v=4d7fc8c227be06c02c1c50dde9abe6ca510c533debab1235e76b770c8a8b38d2';
import { campaignMount } from './campaign-ui.js?v=cd49020d9b2e8ac3c190535fd854d20ff7ba9ad99f4683891e3823c203aa3b56';
import { challengeEncode, challengeDecode } from './challenge.js?v=fa0bfc81f3249e0b86cf3443563dd3bae007936346853a09092a01078b67e869';
import { trackGet, trackEnvironment } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { unlockedTracks, researchTarget, campaignPoolAccess, POPULATIONS, progressionAct, progressionObserve, progressionLoadout, GAME_CATALOGUE, GOALS, POOL_NAMES, progressionCreate, progressionValidate, goalRemaining } from './run.js?v=afdfda1beb256bb301dfd037f92ff412feaa1f6568dc71a447c56e8750405fce';
import { progressionRead, progressionWrite, progressionImport } from './progression-store.js?v=7d401b69d12e7ba1ee22eb6a6fab709c63e9301fde8d80258f5584c4fcd4dfb4';
import { profileReward } from './profile.js?v=34737935bb9fa338929973769d09b3c14eed45a03a0c366afa3d7800febf0035';
import { gameCreate } from './engine.js?v=ff1b90cebfd24e6845e51dc92c4a434e7460b271df6473d5ee0164d71af79298';
import { treeMount } from './tree-ui.js?v=e8d243f69b7f044410cf1157e20779fdccbb68faa4c1312643407a35d7980551';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
const button=(id,label,icon='play')=>`<button id="${id}" type="button">${iconHTML(icon)}<span>${label}</span></button>`;
export function progressionMount(host){
  let kind='normal',loaded=progressionRead(localStorage,kind),state=loaded.state,context='legacy',practice=null,tree,campaign,pending=null,pendingAfter=null,suspended=null,shared=null,rewards,listenTimer=null;
  let saveBlocked=!loaded.available;
  const $=id=>document.getElementById(id);
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const warning=document.createElement('div');warning.className='save-warning';warning.hidden=!saveBlocked;warning.setAttribute('role','alert');warning.innerHTML='<span>Progress could not be read. Export a backup before replacing it.</span>'+button('save-export','Export backup','download')+button('save-retry','Retry save','reset');document.body.append(warning);
  function exportBackup(){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(pending||state,null,2)],{type:'application/json'}));a.href=url;a.download=`ricochet-bloom-${shared?'shared':kind}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function commit(next,after=null){
    let r;
    if(shared){try{const valid=progressionValidate(next,'development');if(!valid)throw new Error('invalid');localStorage.setItem('ricochet-bloom-shared-v1',JSON.stringify({code:shared,state:valid}));r={ok:true,state:valid};}catch{r={ok:false,reason:'Shared challenge could not be saved.'};}}
    else r=progressionWrite(localStorage,next);
    if(r.ok){state=r.state;pending=null;pendingAfter=null;saveBlocked=false;warning.hidden=true;after?.();}
    else {pending=structuredClone(next);pendingAfter=after;saveBlocked=true;warning.hidden=false;warning.firstElementChild.textContent=r.reason+' Play is paused. Export a backup or free storage and retry.';}
    return r;
  }
  $('save-export').onclick=exportBackup;
  $('save-retry').onclick=()=>{if(pending)commit(pending,pendingAfter);else {const recovered=progressionRead(localStorage,kind);if(recovered.available){state=recovered.state;saveBlocked=false;warning.hidden=true;tree.refresh();}else if(confirm('Start a fresh profile? Existing unreadable data will be preserved in a recovery file first.')){try{const key='ricochet-bloom-progression-v1'+(kind==='development'?'-development':'');localStorage.setItem(key+'-unreadable',JSON.stringify({main:localStorage.getItem(key),backup:localStorage.getItem(key+'-backup')}));commit(state);}catch{warning.firstElementChild.textContent='Storage is unavailable. Export before closing.';}}}};

  function act(action){if(saveBlocked)return {ok:false,reason:'Resolve the save warning first.'};if(shared&&!['start','continue','abandon'].includes(action.type))return {ok:false,reason:'Shared challenges use the fixed supplied build.'};const input=structuredClone(state);if(shared&&action.type==='continue')input.route=shared.routes[input.pool+1];const r=progressionAct(input,action);if(!r.ok)return r;const saved=commit(r.state);return saved.ok?{...r,state}:saved;}
  const dev=document.createElement('dialog');dev.id='development-dialog';dev.setAttribute('aria-label','Development settings');
  dev.innerHTML=`<div class="dialog-heading">${iconHTML('flask')}<h2>Development</h2>${button('dev-close','Close','close')}</div><p>Use a separate test profile. Normal research, currency and runs stay in your normal profile.</p><p id="dev-status" role="status"></p><div class="dev-controls"><label class="setting-toggle"><input id="dev-switch" type="checkbox"><span>Development mode</span></label>${button('dev-seed','Copy normal progress into test profile','copy')}${button('dev-max','Unlock all powers & upgrades','epic')}<label>Seeds to add<input id="dev-amount" type="number" min="1" max="1000000" step="1" value="100"></label><div class="grant-presets">${[10,100,1000].map(n=>button('dev-add-'+n,'+'+n,'coin')).join('')}</div>${button('dev-grant','Add Seeds','coin')}${button('dev-bypass','Tuning limit: on','switches')}</div><hr><p>Progress backup · selected profile only</p><div class="dialog-actions">${button('progress-export','Export backup','download')}<label class="file-button">${iconHTML('upload')} Import backup<input id="progress-import" type="file" accept="application/json,.json"></label></div>`;
  document.body.append(dev);
  const result=document.createElement('dialog');result.id='run-result-dialog';result.setAttribute('aria-labelledby','run-result-title');
  result.innerHTML=`<div class="run-result-icon">${iconHTML('epic')}</div><h2 id="run-result-title"></h2><p id="run-result-copy"></p><div id="run-restoration"></div><p id="run-target"></p><div class="dialog-actions">${button('run-listen','Listen to this song','music-note')}${button('run-skin','Use earned skin','check')}${button('run-destination','Next track','arrow-right')}${button('run-retry','Retry same setup','reset')}${button('run-next','Tune & continue','network-node-three')}${button('run-leave','Main menu','grid')}</div>`;document.body.append(result);
  const back=document.createElement('button');back.id='practice-return';back.setAttribute('aria-label','Return to campaign');back.className='quiet';back.hidden=true;back.innerHTML=iconHTML('arrow-left')+'<span>Leave practice</span>';document.querySelector('body>header').append(back);
  function leave(){clearTimeout(listenTimer);const fromMenu=host.currentScreen?.()!=='play';host.save();if(suspended){state=suspended.state;kind=suspended.kind;suspended=null;shared=null;}context='legacy';practice=null;back.hidden=true;close();host.restoreLegacy();if(fromMenu)host.home?.();}
  back.onclick=()=>{const listening=practice?.listening,fromCampaign=practice?.campaign,fromReward=practice?.reward;leave();if(fromReward)rewards.open();else if(listening)campaign.open(fromCampaign?'play':'collection');else if(fromCampaign)campaign.open();else tree.open();};
  function enterRun(){host.save();if(state.phase==='shop'){const r=act({type:'start'});if(!r.ok)return r;}else if(state.phase==='interlude'){const r=act({type:'continue'});if(!r.ok)return r;}context=shared?'challenge':'run';practice=null;back.hidden=true;close();host.play(state.run.game,state.run.music);return {ok:true};}
  function enterPractice(id,tutorial=false){
    host.save();const node=GAME_CATALOGUE.nodes[id],power=tutorial?'ripple':node?.power||BUILD_EXAMPLES.find(x=>x.id===id)?.powers[0];
    const powers=[power,...['ripple','attract','comet'].filter(p=>p!==power)].slice(0,3),build=powers.map(p=>({power:p,foundation:p===power&&node?.kind==='foundation',variants:p===power&&['a','b'].includes(node?.kind)?[node.kind]:[],capstone:p===power&&node?.kind==='capstone'}));
    const game=tutorial?gameCreate('BLOOM-LESSON','free',{build,population:14}):upgradeFixture(id,true,false);
    game.power.offer=power;game.power.target=1;
    // The practice marker starts directly above the player, so one upward pluck tests it.
    if(tutorial)Object.assign(game.bodies[1],{x:480,y:420,vx:0,vy:0});
    context='practice';practice={tutorial,reward:state.phase==='interlude'};close();back.hidden=false;back.lastElementChild.textContent='Leave practice';host.play(game,null);host.message(tutorial?'Make one bloom to earn your first 4 Seeds. Practice has unlimited plucks.':'Pluck upward to collect the marked power. Practice does not change your run.');return {ok:true};
  }
  function devRender(){const development=kind==='development';$('dev-switch').checked=development;$('dev-seed').disabled=!development||state.phase==='run';document.body.dataset.development=String(development);const badge=document.getElementById('development-badge');if(badge)badge.hidden=!development;$('dev-status').textContent=`${development?'Development':'Normal'} profile · ${state.profile.wallet.seeds} Seeds`;for(const id of ['dev-max','dev-grant','dev-bypass','dev-amount',...['10','100','1000'].map(n=>'dev-add-'+n)])$(id).disabled=!development||state.phase==='run';$('dev-bypass').lastElementChild.textContent=`Tuning limit: ${state.bypass?'off':'on'}`;}
  function open(type,id){if(type==='replay'){if(!campaignPoolAccess(state,id).replay)return {ok:false,reason:'Clear this pool first.'};host.save();const game=gameCreate(`${state.seed}-replay-${id}`,'free',{build:progressionLoadout(state).powers,population:POPULATIONS[id],environment:trackEnvironment(state.track,id,state.route)});context='practice';practice={campaign:true};close();back.hidden=false;back.lastElementChild.textContent='Level select';host.play(game,null);host.message('Replay practice · your run and rewards are preserved.');return {ok:true};}if(type==='campaign'){if(state.phase==='interlude'&&!shared)rewards.open();else campaign.open();return {ok:true};}if(type==='compare'){preview.open(id);return {ok:true};}if(type==='play')return enterRun();if(type==='practice'||type==='tutorial')return enterPractice(type==='tutorial'?'ripple.base':id,type==='tutorial');if(type==='development'){devRender();dev.showModal();return {ok:true};}}
  const preview=upgradePreviewMount({gentle:()=>host.gentle?.(),practice:id=>enterPractice(id)});
  tree=treeMount({get:()=>state,act,open,screen:()=>host.screen?.('tree'),back:()=>host.back?.()});
  const listen=(record,seconds=0)=>{clearTimeout(listenTimer);host.save();context='practice';practice={listening:true,campaign:seconds>0};close();back.hidden=false;back.lastElementChild.textContent=seconds?'Stop preview':'Leave listening';const listeningGame=gameCreate(record.seed,'free');listeningGame.blooms=record.music.blooms;listeningGame.launches=record.music.plucks;host.play(listeningGame,record.music);host.message('Listening to '+trackGet(record.track).name+'. Leave listening to return to your saved run.');if(seconds)listenTimer=setTimeout(()=>{if(context==='practice'&&practice?.listening&&host.currentScreen?.()==='play'){leave();campaign.open();}},seconds*1000);};
  campaign=campaignMount({screen:tab=>host.screen?.(tab==='collection'?'collection':'levels'),back:()=>host.back?.(),get:()=>({...state,shared:!!shared}),act,open,tree:family=>tree.open(family),listen,
    code(){const build=progressionLoadout(state);if(!build.ok||build.tuning>10)return {ok:false,reason:'Use a build within 10 tuning points.'};try{return {ok:true,code:challengeEncode({version:1,rules:18,track:state.track,seed:state.seed,relaxed:state.relaxed,build:build.powers,routes:[0,0,0,0,0]})};}catch{return {ok:false,reason:'This build cannot be shared.'};}},
    resumeChallenge(){try{const saved=JSON.parse(localStorage.getItem('ricochet-bloom-shared-v1')||'null'),code=saved?.code&&challengeDecode(challengeEncode(saved.code)),next=progressionValidate(saved?.state,'development');if(!code||!next||next.phase==='shop'||JSON.stringify(progressionLoadout(next).powers)!==JSON.stringify(code.build))return {ok:false,reason:'No valid unfinished shared challenge is saved.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;state=next;kind='development';return enterRun();}catch{return {ok:false,reason:'No valid saved challenge.'};}},
    challenge(text){const code=challengeDecode(text);if(!code)return {ok:false,reason:'Invalid challenge code or incompatible rules version.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;
      const next=progressionCreate('development');next.track=code.track;next.seed=code.seed;next.route=code.routes[0];next.relaxed=code.relaxed;next.bypass=true;next.borrowed=[];next.powers=code.build.map(p=>p.power);next.equipped=[];
      for(const p of code.build){next.profile.research[p.power+'.base']={paid:0};for(const k of [...(p.foundation?['foundation']:[]),...p.variants,...(p.capstone?['capstone']:[])]){next.profile.research[p.power+'.'+k]={paid:0};next.equipped.push(p.power+'.'+k);}}
      state=next;kind='development';return enterRun();}
  });
  const badge=document.createElement('span');badge.id='development-badge';badge.className='development-badge';badge.textContent='TEST';badge.hidden=true;document.querySelector('header').append(badge);
  const hub=document.createElement('button');hub.id='campaign-open';hub.className='primary';hub.innerHTML=iconHTML('epic')+'<span>Level select</span>';hub.onclick=()=>{host.save();campaign.open();};document.getElementById('campaign-slot').append(hub);


  $('dev-close').onclick=()=>dev.close();
  dev.addEventListener('close',()=>{if(!dev.open&&host.currentScreen?.()==='home')host.home?.();});
  $('dev-switch').onchange=()=>{leave();kind=kind==='normal'?'development':'normal';loaded=progressionRead(localStorage,kind);state=loaded.state;tree.refresh();devRender();dev.showModal();};
  $('dev-seed').onclick=()=>{const normal=progressionRead(localStorage,'normal').state;normal.profile.kind='development';normal.bypass=false;const r=commit(normal);devRender();tree.refresh();$('dev-status').textContent=r.ok?'Normal progress copied. Your normal profile remains unchanged.':r.reason;};
  for(const amount of [10,100,1000])$('dev-add-'+amount).onclick=()=>{const r=act({type:'grant',amount});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  for(const [id,type] of [['dev-max','max'],['dev-grant','grant'],['dev-bypass','bypass']])$(id).onclick=()=>{const r=act({type,amount:Number($('dev-amount').value)});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  $('progress-export').onclick=exportBackup;
  $('progress-import').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10_000_000){$('dev-status').textContent='Backup is too large.';return;}const text=await file.text();if(!confirm(`Replace this ${kind} profile with the selected backup? The current save becomes a backup.`))return;const r=progressionImport(localStorage,text,kind);if(r.ok){leave();state=r.state;tree.refresh();devRender();dev.showModal();}else $('dev-status').textContent=r.reason;event.target.value='';};
  const targetRender=el=>{const t=researchTarget(state);el.textContent=t?`Next goal: ${t.name} · ${t.text}`:'';};
  rewards=rewardMount({target:targetRender,get:()=>state,act,screen:()=>host.screen?.('levels'),home:()=>host.home?.(),tree:()=>tree.open(),preview:id=>preview.open(id),continue:()=>campaign.open()});
  $('run-skin').onclick=()=>{const r=act({type:'skin',skin:state.latest.track});if(r.ok)$('run-skin').lastElementChild.textContent='Skin equipped';};
  $('run-destination').onclick=()=>{const next=unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id));if(next)act({type:'track',track:next.id});close();campaign.open(next?'play':'collection');};
  $('run-next').onclick=()=>{close();if(state.phase==='interlude'&&!shared)rewards.open();else campaign.open();};$('run-listen').onclick=()=>{if(state.latest)listen(state.latest);};$('run-retry').onclick=()=>{const r=act({type:'retry'});if(r.ok)enterRun();else host.message(r.reason);};$('run-leave').onclick=()=>{leave();host.home?.();};

  const settings=document.getElementById('settings-dialog');if(settings){const b=document.createElement('button');b.className='quiet';b.innerHTML=iconHTML('flask')+'<span>Development & backups</span>';b.onclick=()=>open('development');settings.append(b);}
  if(loaded.recovered)host.message('Recovered progression from your backup.');
  return {
    get context(){return context;},get blocked(){return saveBlocked||!!practice?.listening||['run','challenge'].includes(context)&&state.phase!=='run';},get state(){return state;},
    tree:()=>tree.open(),campaign:view=>state.phase==='interlude'&&!shared&&view!=='collection'?rewards.open():campaign.open(view),play:enterRun,leave,
    get skin(){return state.skin==='original'?null:trackGet(state.skin)?.color;},
    checkpoint(game,music){if(['run','challenge'].includes(context)&&state.phase==='run'){const next=structuredClone(state);next.run.game=structuredClone(game);next.run.music=music;return commit(next).ok;}return true;},
    observe(game,events,music){
      if(context==='practice'&&practice?.tutorial&&events.some(e=>e.type==='bloom')){const r=profileReward(state.profile,{mode:'song-run',type:'tutorial',bloom:true},GAME_CATALOGUE);if(r.ok&&!r.duplicate){const next=structuredClone(state);next.profile=r.profile;if(commit(next).ok)host.message('First bloom · +4 Seeds! Open the tree to research your first upgrade.');}}
      if(!['run','challenge'].includes(context)||state.phase!=='run'||saveBlocked)return;
      const r=progressionObserve(state,game,events,music);
      commit(r.state,()=>{if(r.outcome){
        if(r.record?.music)host.runMusic?.(r.record.music);
        $('run-result-title').textContent=shared?'Shared challenge · '+r.message:r.message;
        $('run-result-copy').textContent=r.outcome==='clear'?`Next: ${POOL_NAMES[state.pool+1]}. Choose a discovery, retune, and preview the next pool.`:r.outcome==='victory'?`${r.record.medal} · ${r.record.launches} plucks · ${r.record.bonuses}/5 bonuses. Song saved to your collection.`:'Your unfinished song is saved. Retry the same setup, change your build, or try Relaxed pace.';
        $('run-listen').hidden=!r.record?.music;$('run-retry').hidden=r.outcome!=='failure'||!!shared;
        $('run-next').lastElementChild.textContent=r.outcome==='clear'?'Next pool & discoveries':'Campaign & collection';
        const won=r.outcome==='victory'&&!shared;$('run-next').hidden=won;$('run-destination').classList.add('primary');$('run-next').classList.add('primary');$('run-skin').hidden=!won;$('run-destination').hidden=!won;
        const destination=won?unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id)):null;
        $('run-destination').lastElementChild.textContent=destination?'Next: '+destination.name:'Your five-song collection';
        $('run-restoration').innerHTML=won?`<div class="earned-skin" style="--track-color:${trackGet(state.track).color}"><i></i><span>${trackGet(state.track).name} restored<br>Player skin earned · your song saved</span></div>`:'';
        targetRender($('run-target'));result.showModal();tree.refresh();campaign.refresh();
      }});
    },
    hud(){if(context==='practice')return `${practice?.listening?'LISTENING':practice?.tutorial?'BLOOM LESSON':'PRACTICE'} · Unlimited plucks · no run rewards`;if(['run','challenge'].includes(context))return state.run?`${shared?'SHARED · ':kind==='development'?'TEST · ':''}${POOL_NAMES[state.pool]} ${state.pool+1}/5 · ${goalRemaining(state)}`:'Run complete · open Skill tree';return null;}
  };
}
