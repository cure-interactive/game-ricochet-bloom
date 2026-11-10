import { campaignMount } from './campaign-ui.js?v=297301b1690e06c0b7940b875dcefe23f0f254345b8f7c5c39480ecfedede486';
import { challengeEncode, challengeDecode } from './challenge.js?v=3404a2ac7cb30ad12a4ba737804385476b93f21afde0a31e5c1db54f1d73da41';
import { trackGet } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { progressionAct, progressionObserve, progressionLoadout, GAME_CATALOGUE, GOALS, POOL_NAMES, progressionCreate, progressionValidate, goalRemaining } from './run.js?v=8421ccc4a690fed8a048cdb8f9828583a0f0ed86cd69000531b66c16d4ff591b';
import { progressionRead, progressionWrite, progressionImport } from './progression-store.js?v=87774d7f6c4d728db49ff7f0d8aaf45d5f953b0f10310d8c0dc2a423dfd712fd';
import { profileReward } from './profile.js?v=d86f3e1dc882dcf034b75db8449706fd9c205f62359e1ca4202ef4df753af1c7';
import { gameCreate } from './engine.js?v=56b76ef371ce8d9857fad17229b62f6ad346ac3b95774147bc024b9b3cf4d11e';
import { treeMount } from './tree-ui.js?v=984f7ab2776933b13453edc64a9362bce6382ae3d8eb328de168c936c517b091';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
const button=(id,label,icon='play')=>`<button id="${id}" type="button">${iconHTML(icon)}<span>${label}</span></button>`;
export function progressionMount(host){
  let kind='normal',loaded=progressionRead(localStorage,kind),state=loaded.state,context='legacy',practice=null,tree,campaign,pending=null,pendingAfter=null,suspended=null,shared=null;
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
  result.innerHTML=`<div class="run-result-icon">${iconHTML('epic')}</div><h2 id="run-result-title"></h2><p id="run-result-copy"></p><div class="dialog-actions">${button('run-listen','Listen to this song','music-note')}${button('run-retry','Retry same setup','reset')}${button('run-next','Tune & continue','network-node-three')}${button('run-leave','Back to other modes','grid')}</div>`;document.body.append(result);
  const back=document.createElement('button');back.id='practice-return';back.setAttribute('aria-label','Return to campaign');back.className='quiet';back.hidden=true;back.innerHTML=iconHTML('arrow-left')+'<span>Leave practice</span>';document.querySelector('body>header').append(back);
  function leave(){host.save();if(suspended){state=suspended.state;kind=suspended.kind;suspended=null;shared=null;}context='legacy';practice=null;back.hidden=true;close();host.restoreLegacy();}
  back.onclick=()=>{const listening=practice?.listening;leave();if(listening)campaign.open('collection');else tree.open();};
  function enterRun(){host.save();if(state.phase==='shop'){const r=act({type:'start'});if(!r.ok)return r;}else if(state.phase==='interlude'){const r=act({type:'continue'});if(!r.ok)return r;}context=shared?'challenge':'run';practice=null;back.hidden=true;close();host.play(state.run.game,state.run.music);return {ok:true};}
  function enterPractice(id,tutorial=false){
    host.save();const node=GAME_CATALOGUE.nodes[id],power=tutorial?'ripple':node.power;
    const powers=[power,...['ripple','attract','comet'].filter(p=>p!==power)].slice(0,3),build=powers.map(p=>({power:p,foundation:p===power&&node?.kind==='foundation',variants:p===power&&['a','b'].includes(node?.kind)?[node.kind]:[],capstone:p===power&&node?.kind==='capstone'}));
    const game=gameCreate(tutorial?'BLOOM-LESSON':'TRY-'+id,'free',{build,population:14});
    game.power.offer=power;game.power.target=1;
    // The practice marker starts directly above the player, so one upward pluck tests it.
    Object.assign(game.bodies[1],{x:480,y:420,vx:0,vy:0});
    context='practice';practice={tutorial};close();back.hidden=false;back.lastElementChild.textContent='Leave practice';host.play(game,null);host.message(tutorial?'Make one bloom to earn your first 4 Seeds. Practice has unlimited plucks.':'Pluck upward to collect the marked power. Practice does not change your run.');return {ok:true};
  }
  function devRender(){const development=kind==='development';$('dev-switch').checked=development;$('dev-seed').disabled=!development||state.phase==='run';document.body.dataset.development=String(development);const badge=document.getElementById('development-badge');if(badge)badge.hidden=!development;$('dev-status').textContent=`${development?'Development':'Normal'} profile · ${state.profile.wallet.seeds} Seeds`;for(const id of ['dev-max','dev-grant','dev-bypass','dev-amount',...['10','100','1000'].map(n=>'dev-add-'+n)])$(id).disabled=!development||state.phase==='run';$('dev-bypass').lastElementChild.textContent=`Tuning limit: ${state.bypass?'off':'on'}`;}
  function open(type,id){if(type==='campaign'){campaign.open();return {ok:true};}if(type==='play')return enterRun();if(type==='practice'||type==='tutorial')return enterPractice(type==='tutorial'?'ripple.base':id,type==='tutorial');if(type==='development'){devRender();dev.showModal();return {ok:true};}}
  tree=treeMount({get:()=>state,act,open});
  const listen=record=>{host.save();context='practice';practice={listening:true};close();back.hidden=false;back.lastElementChild.textContent='Leave listening';const listeningGame=gameCreate(record.seed,'free');listeningGame.blooms=record.music.blooms;listeningGame.launches=record.music.plucks;host.play(listeningGame,record.music);host.message('Listening to '+trackGet(record.track).name+'. Leave listening to return to your saved run.');};
  campaign=campaignMount({get:()=>({...state,shared:!!shared}),act,open,tree:()=>tree.open(),listen,
    code(){const build=progressionLoadout(state);if(!build.ok||build.tuning>10)return {ok:false,reason:'Use a build within 10 tuning points.'};try{return {ok:true,code:challengeEncode({version:1,rules:18,track:state.track,seed:state.seed,relaxed:state.relaxed,build:build.powers,routes:[0,0,0,0,0]})};}catch{return {ok:false,reason:'This build cannot be shared.'};}},
    resumeChallenge(){try{const saved=JSON.parse(localStorage.getItem('ricochet-bloom-shared-v1')||'null'),code=saved?.code&&challengeDecode(challengeEncode(saved.code)),next=progressionValidate(saved?.state,'development');if(!code||!next||next.phase==='shop'||JSON.stringify(progressionLoadout(next).powers)!==JSON.stringify(code.build))return {ok:false,reason:'No valid unfinished shared challenge is saved.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;state=next;kind='development';return enterRun();}catch{return {ok:false,reason:'No valid saved challenge.'};}},
    challenge(text){const code=challengeDecode(text);if(!code)return {ok:false,reason:'Invalid challenge code or incompatible rules version.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;
      const next=progressionCreate('development');next.track=code.track;next.seed=code.seed;next.route=code.routes[0];next.relaxed=code.relaxed;next.bypass=true;next.borrowed=[];next.powers=code.build.map(p=>p.power);next.equipped=[];
      for(const p of code.build){next.profile.research[p.power+'.base']={paid:0};for(const k of [...(p.foundation?['foundation']:[]),...p.variants,...(p.capstone?['capstone']:[])]){next.profile.research[p.power+'.'+k]={paid:0};next.equipped.push(p.power+'.'+k);}}
      state=next;kind='development';return enterRun();}
  });
  const badge=document.createElement('span');badge.id='development-badge';badge.className='development-badge';badge.textContent='TEST';badge.hidden=true;document.querySelector('header').append(badge);
  const hub=document.createElement('button');hub.id='campaign-open';hub.className='primary';hub.innerHTML=iconHTML('epic')+'<span>Song Run</span>';hub.onclick=()=>{host.save();campaign.open();};document.getElementById('campaign-slot').append(hub);
  const welcome=document.getElementById('welcome');if(welcome){const b=hub.cloneNode(true);b.id='welcome-campaign';b.className='quiet';b.onclick=()=>campaign.open();welcome.querySelector('.welcome-content').append(b);}

  $('dev-close').onclick=()=>dev.close();
  $('dev-switch').onchange=()=>{leave();kind=kind==='normal'?'development':'normal';loaded=progressionRead(localStorage,kind);state=loaded.state;tree.refresh();devRender();dev.showModal();};
  $('dev-seed').onclick=()=>{const normal=progressionRead(localStorage,'normal').state;normal.profile.kind='development';normal.bypass=false;const r=commit(normal);devRender();tree.refresh();$('dev-status').textContent=r.ok?'Normal progress copied. Your normal profile remains unchanged.':r.reason;};
  for(const amount of [10,100,1000])$('dev-add-'+amount).onclick=()=>{const r=act({type:'grant',amount});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  for(const [id,type] of [['dev-max','max'],['dev-grant','grant'],['dev-bypass','bypass']])$(id).onclick=()=>{const r=act({type,amount:Number($('dev-amount').value)});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  $('progress-export').onclick=exportBackup;
  $('progress-import').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10_000_000){$('dev-status').textContent='Backup is too large.';return;}const text=await file.text();if(!confirm(`Replace this ${kind} profile with the selected backup? The current save becomes a backup.`))return;const r=progressionImport(localStorage,text,kind);if(r.ok){leave();state=r.state;tree.refresh();devRender();dev.showModal();}else $('dev-status').textContent=r.reason;event.target.value='';};
  $('run-next').onclick=()=>{close();campaign.open();};$('run-listen').onclick=()=>{if(state.latest)listen(state.latest);};$('run-retry').onclick=()=>{const r=act({type:'retry'});if(r.ok)enterRun();else host.message(r.reason);};$('run-leave').onclick=leave;
  const mode=document.createElement('section');mode.className='mode-card song-run-card';mode.innerHTML=`${iconHTML('epic')}<h3>Song Run</h3><p>Five pools. Earn Seeds. Grow your powers.</p>${button('choose-song-run','Research & play','network-node-three')}`;$('mode-dialog').insertBefore(mode,$('mode-dialog').querySelector('[data-close]')?.nextSibling||null);$('choose-song-run').onclick=()=>{close();campaign.open();};
  const settings=document.getElementById('settings-dialog');if(settings){const b=document.createElement('button');b.className='quiet';b.innerHTML=iconHTML('flask')+'<span>Development & backups</span>';b.onclick=()=>open('development');settings.append(b);}
  if(loaded.recovered)host.message('Recovered progression from your backup.');
  return {
    get context(){return context;},get blocked(){return saveBlocked||!!practice?.listening||['run','challenge'].includes(context)&&state.phase!=='run';},get state(){return state;},
    tree:()=>tree.open(),campaign:()=>campaign.open(),leave,
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
        $('run-listen').hidden=!r.record?.music;$('run-retry').hidden=r.outcome==='clear'||!!shared;
        $('run-next').lastElementChild.textContent=r.outcome==='clear'?'Next pool & discoveries':'Campaign & collection';
        result.showModal();tree.refresh();campaign.refresh();
      }});
    },
    hud(){if(context==='practice')return `${practice?.listening?'LISTENING':practice?.tutorial?'BLOOM LESSON':'PRACTICE'} · Unlimited plucks · no run rewards`;if(['run','challenge'].includes(context))return state.run?`${shared?'SHARED · ':kind==='development'?'TEST · ':''}${POOL_NAMES[state.pool]} ${state.pool+1}/5 · ${goalRemaining(state)}`:'Run complete · open Skill tree';return null;}
  };
}
