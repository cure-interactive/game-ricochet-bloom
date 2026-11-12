import { titleCase } from './ui-text.js?v=2c84fa9359b3450499aad40d6bf02d804236b14edac3b33e3e2738480818319a';
import { rewardMount } from './reward-ui.js?v=72c5b3c608fdf6faf789c2f09e007795d9e0e7e0d43b3c5a7ea811e20639acda';
import { campaignMount } from './campaign-ui.js?v=9efd28150102eb00d00f293de27f1896cf8d1470cf999d74ac12cca67c37b178';
import { challengeEncode, challengeDecode } from './challenge.js?v=d7c564a87bf80b093a690f2f933c2530738feb0e3e8f77831c1831fcf94c1a41';
import { trackGet } from './track.js?v=57009a338150b0399594597f6a834d703dafefeb8088046d9e587aa1896fb5ed';
import { unlockedTracks, researchTarget, progressionAct, progressionObserve, progressionLoadout, GAME_CATALOGUE, GOALS, POOL_NAMES, progressionCreate, progressionValidate, goalRemaining } from './run.js?v=c0ea84dd906f0ed13559a0d34416d93c5e872cb0e3ad1100204904c9bb62fa30';
import { progressionRead, progressionWrite, progressionImport } from './progression-store.js?v=5517bdd0d9ca66018e84efa210ee73a6c93b3a2fa232aa849acfbfb597038bf4';
import { gameCreate } from './engine.js?v=12aca0299e489e19cee12712b048995045f1a99ab7437f65848b511da9a147d5';
import { treeMount } from './tree-ui.js?v=d0256110d9004e43a34a67116b9f529e3223dbe6cefcd9e589790a4a49d9ec3f';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
const button=(id,label,icon='play')=>`<button id="${id}" type="button">${iconHTML(icon)}<span>${label}</span></button>`;
import { skinMount } from './skin-ui.js?v=a92495e30b4b27b32fe50c4d07d5d26cf80a2827058793397088185f2027f148';
export function progressionMount(host){
  let kind='normal',loaded=progressionRead(localStorage,kind),state=loaded.state,context='legacy',listening=null,tree,campaign,pending=null,pendingAfter=null,suspended=null,shared=null,rewards,listenTimer=null;
  let saveBlocked=!loaded.available;
  const $=id=>document.getElementById(id);
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const warning=document.createElement('div');warning.className='save-warning';warning.hidden=!saveBlocked;warning.setAttribute('role','alert');warning.innerHTML='<span>Progress could not be read. Export a backup before replacing it.</span>'+button('save-export','Export backup','download')+button('save-retry','Retry save','reset');document.body.append(warning);
  function exportBackup(){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(pending||state,null,2)],{type:'application/json'}));a.href=url;a.download=`ricochet-bloom-${shared?'shared':kind}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function commit(next,after=null){
    let r;
    if(shared){try{const valid=progressionValidate(next,'development');if(!valid)throw new Error('invalid');localStorage.setItem('ricochet-bloom-shared-v1',JSON.stringify({code:shared,state:valid}));r={ok:true,state:valid};}catch{r={ok:false,reason:'Shared Challenge could not be saved.'};}}
    else r=progressionWrite(localStorage,next);
    if(r.ok){state=r.state;pending=null;pendingAfter=null;saveBlocked=false;warning.hidden=true;after?.();}
    else {pending=structuredClone(next);pendingAfter=after;saveBlocked=true;warning.hidden=false;warning.firstElementChild.textContent=r.reason+' Play is paused. Export a backup or free storage and retry.';}
    return r;
  }
  $('save-export').onclick=exportBackup;
  $('save-retry').onclick=()=>{if(pending)commit(pending,pendingAfter);else {const recovered=progressionRead(localStorage,kind);if(recovered.available){state=recovered.state;saveBlocked=false;warning.hidden=true;tree.refresh();}else if(confirm('Start a fresh profile? Existing unreadable data will be preserved in a recovery file first.')){try{const key='ricochet-bloom-progression-v1'+(kind==='development'?'-development':'');localStorage.setItem(key+'-unreadable',JSON.stringify({main:localStorage.getItem(key),backup:localStorage.getItem(key+'-backup')}));commit(state);}catch{warning.firstElementChild.textContent='Storage is unavailable. Export before closing.';}}}};

  function act(action){if(saveBlocked)return {ok:false,reason:'Resolve the save warning first.'};if(shared&&!['start','continue','abandon'].includes(action.type))return {ok:false,reason:'Shared challenges use the fixed supplied build.'};const input=structuredClone(state);if(shared&&action.type==='continue')input.route=shared.routes[input.pool+1];const r=progressionAct(input,action);if(!r.ok)return r;const saved=commit(r.state);return saved.ok?{...r,state}:saved;}
  const dev=document.createElement('dialog');dev.id='development-dialog';dev.setAttribute('aria-label','Development settings');
  dev.innerHTML=`<div class="dialog-heading">${iconHTML('flask')}<h2>Development</h2>${button('dev-close','Close','close')}</div><p>Use a separate test profile. Normal research, currency and runs stay in your normal profile.</p><p id="dev-status" role="status"></p><div class="dev-controls"><label class="setting-toggle"><input id="dev-switch" type="checkbox"><span>Development mode</span></label>${button('dev-seed','Copy normal progress into test profile','copy')}<p class="dev-help">These controls change only the Development profile.</p>${button('dev-max-progress','Maximize level progress','grid')}<small>Open every level and skin, and set Points to at least 10,000. Research is unchanged.</small>${button('dev-max','Max out skill tree','epic')}<small>Unlock all 25 powers and all their upgrades. Level progress is unchanged.</small>${button('dev-reset','Reset all test progress','reset')}<small>Clear test levels, research, currency, songs and the active test run.</small><section id="dev-reset-confirmation" class="tree-confirm" hidden aria-label="Confirm reset"><strong>Reset all Development progress?</strong><p>Test levels, research, Points, saved songs and the active test run will be reset. Normal progress stays unchanged.</p>${button('dev-reset-cancel','Keep test progress','arrow-left')}${button('dev-reset-confirm','Reset Development profile','reset')}</section><label>Points to add<input id="dev-amount" type="number" min="1" max="1000000" step="1" value="100"></label><div class="grant-presets">${[10,100,1000].map(n=>button('dev-add-'+n,'+'+n,'coin')).join('')}</div>${button('dev-grant','Add Points','coin')}</div><hr><p>Progress backup · selected profile only</p><div class="dialog-actions">${button('progress-export','Export backup','download')}<label class="file-button">${iconHTML('upload')} Import backup<input id="progress-import" type="file" accept="application/json,.json"></label></div>`;
  document.body.append(dev);
  const result=document.createElement('dialog');result.id='run-result-dialog';result.setAttribute('aria-labelledby','run-result-title');
  result.innerHTML=`<div class="run-result-icon">${iconHTML('epic')}</div><h2 id="run-result-title"></h2><p id="run-result-copy"></p><div id="run-restoration"></div><p id="run-target"></p><div class="dialog-actions">${button('run-listen','Listen to this song','music-note')}${button('run-skin','Use earned skin','check')}${button('run-destination','Next track','arrow-right')}${button('run-retry','Retry same setup','reset')}${button('run-next','Next pool & discoveries','arrow-right')}${button('run-leave','Main Menu','grid')}</div>`;document.body.append(result);
  const back=document.createElement('button');back.id='listening-return';back.className='quiet';back.hidden=true;back.innerHTML=iconHTML('arrow-left')+'<span>Leave listening</span>';document.querySelector('.goal-strip').append(back);
  function leave(){clearTimeout(listenTimer);const fromMenu=host.currentScreen?.()!=='play';host.save();if(suspended){state=suspended.state;kind=suspended.kind;suspended=null;shared=null;}context='legacy';listening=null;back.hidden=true;close();host.restoreLegacy();if(fromMenu)host.home?.();}
  back.onclick=()=>{const fromCampaign=listening?.campaign;leave();campaign.open(fromCampaign?'play':'songs');};
  function enterRun(){host.save();if(state.phase==='shop'){const r=act({type:'start'});if(!r.ok)return r;}else if(state.phase==='interlude'){const r=act({type:'continue'});if(!r.ok)return r;}context=shared?'challenge':'run';listening=null;back.hidden=true;close();host.play(state.run.game,state.run.music);return {ok:true};}
  function devRender(){const development=kind==='development';$('dev-switch').checked=development;$('dev-seed').disabled=!development||state.phase==='run';document.body.dataset.development=String(development);const badge=document.getElementById('development-badge');if(badge)badge.hidden=!development;$('dev-status').textContent=`${development?'Development':'Normal'} profile · ${state.profile.wallet.seeds} Points`;for(const id of ['dev-max-progress','dev-max','dev-grant','dev-amount',...['10','100','1000'].map(n=>'dev-add-'+n)])$(id).disabled=!development||state.phase==='run';$('dev-reset').disabled=!development;$('dev-reset-confirmation').hidden=true;if(development&&state.phase==='run')$('dev-status').textContent+=' · Finish this pool before maximizing progress.';}
  function open(type,id){
    if(type==='campaign'){if(state.phase==='interlude'&&!shared)rewards.open();else campaign.open();return {ok:true};}
    if(type==='play')return enterRun();
    if(type==='development'){devRender();dev.showModal();return {ok:true};}
    return {ok:false,reason:'This play option is unavailable.'};
  }
  tree=treeMount({get:()=>state,act,open,screen:()=>host.screen?.('tree'),back:()=>host.back?.()});
  const skins=skinMount({get:()=>state,act,screen:()=>host.screen?.('skins'),back:()=>host.back?.()});
  const listen=(record,seconds=0)=>{clearTimeout(listenTimer);host.save();context='listening';listening={campaign:seconds>0};close();back.hidden=false;back.lastElementChild.textContent=seconds?'Stop preview':'Leave listening';const listeningGame=gameCreate(record.seed,'free');listeningGame.blooms=record.music.blooms;listeningGame.launches=record.music.plucks;host.play(listeningGame,record.music);host.message('Listening to '+trackGet(record.track).name+'. Leave listening to return to your saved run.');if(seconds)listenTimer=setTimeout(()=>{if(context==='listening'&&host.currentScreen?.()==='play'){leave();campaign.open();}},seconds*1000);};
  campaign=campaignMount({screen:()=>host.screen?.('levels'),songsMount:host.songsMount,songsClose:host.songsClose,songsRefresh:host.songsRefresh,back:()=>host.back?.(),get:()=>({...state,shared:!!shared}),act,open,listen,
    code(){const build=progressionLoadout(state);if(!build.ok)return {ok:false,reason:'Your power pool could not be read.'};try{return {ok:true,code:challengeEncode({version:2,rules:18,track:state.track,seed:state.seed,relaxed:state.relaxed,build:build.powers,routes:[0,0,0,0,0]})};}catch{return {ok:false,reason:'This build cannot be shared.'};}},
    resumeChallenge(){try{const saved=JSON.parse(localStorage.getItem('ricochet-bloom-shared-v1')||'null'),code=saved?.code&&challengeDecode(challengeEncode(saved.code)),next=progressionValidate(saved?.state,'development');if(!code||!next||next.phase==='shop'||JSON.stringify(progressionLoadout(next).powers)!==JSON.stringify(code.build))return {ok:false,reason:'No valid unfinished shared challenge is saved.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;state=next;kind='development';return enterRun();}catch{return {ok:false,reason:'No valid saved challenge.'};}},
    challenge(text){const code=challengeDecode(text);if(!code)return {ok:false,reason:'Invalid challenge code or incompatible rules version.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;
      const next=progressionCreate('development');next.powerMode='shared';next.sharedVersion=code.version;next.fixedBuild=structuredClone(code.build);next.track=code.track;next.seed=code.seed;next.route=code.routes[0];next.relaxed=code.relaxed;next.bypass=true;next.borrowed=[];next.powers=code.build.map(p=>p.power);next.equipped=[];
      for(const p of code.build){next.profile.research[p.power+'.base']={paid:0};for(const k of [...(p.foundation?['foundation']:[]),...p.variants,...(p.capstone?['capstone']:[])]){next.profile.research[p.power+'.'+k]={paid:0};next.equipped.push(p.power+'.'+k);}}
      state=next;kind='development';return enterRun();}
  });
  const badge=document.createElement('span');badge.id='development-badge';badge.className='development-badge';badge.textContent='TEST';badge.hidden=true;document.querySelector('.goal-strip').append(badge);


  $('dev-close').onclick=()=>dev.close();
  dev.addEventListener('close',()=>{if(!dev.open&&!$('settings-dialog').open&&host.currentScreen?.()==='home')host.home?.();});
  $('dev-switch').onchange=()=>{leave();kind=kind==='normal'?'development':'normal';loaded=progressionRead(localStorage,kind);state=loaded.state;tree.refresh();devRender();dev.showModal();};
  $('dev-reset').onclick=()=>{$('dev-reset-confirmation').hidden=false;$('dev-reset-cancel').focus();$('dev-reset-confirmation').scrollIntoView({block:'nearest'});};
  $('dev-reset-cancel').onclick=()=>{$('dev-reset-confirmation').hidden=true;$('dev-reset').focus();};
  $('dev-reset-confirm').onclick=()=>{const r=act({type:'reset-progress'});if(r.ok){context='legacy';listening=null;back.hidden=true;host.restoreLegacy();host.home?.();dev.showModal();}devRender();tree.refresh();$('dev-status').textContent=r.ok?r.message:r.reason;$('dev-reset').focus();};
  $('dev-seed').onclick=()=>{const normal=progressionRead(localStorage,'normal').state;normal.profile.kind='development';normal.bypass=false;const r=commit(normal);devRender();tree.refresh();$('dev-status').textContent=r.ok?'Normal progress copied. Your normal profile remains unchanged.':r.reason;};
  for(const amount of [10,100,1000])$('dev-add-'+amount).onclick=()=>{const r=act({type:'grant',amount});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  for(const [id,type] of [['dev-max','max'],['dev-max-progress','max-progress'],['dev-grant','grant']])$(id).onclick=()=>{const r=act({type,amount:Number($('dev-amount').value)});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  $('progress-export').onclick=exportBackup;
  $('progress-import').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10_000_000){$('dev-status').textContent='Backup is too large.';return;}const text=await file.text();if(!confirm(`Replace this ${kind} profile with the selected backup? The current save becomes a backup.`))return;const r=progressionImport(localStorage,text,kind);if(r.ok){leave();state=r.state;tree.refresh();devRender();dev.showModal();}else $('dev-status').textContent=r.reason;event.target.value='';};
  const targetRender=el=>{const t=researchTarget(state);el.textContent=t?`Next goal: ${t.name} · ${t.text}`:'';};
  rewards=rewardMount({target:targetRender,get:()=>state,act,screen:()=>host.screen?.('levels'),home:()=>host.home?.(),continue:()=>campaign.open()});
  $('run-skin').onclick=()=>{const r=act({type:'skin',skin:state.latest.track});if(r.ok)$('run-skin').lastElementChild.textContent='Skin equipped';};
  $('run-destination').onclick=()=>{const next=unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id));if(next)act({type:'track',track:next.id});close();campaign.open(next?'play':'songs');};
  $('run-next').onclick=()=>{close();if(state.phase==='interlude'&&!shared)rewards.open();else campaign.open();};$('run-listen').onclick=()=>{if(state.latest)listen(state.latest);};$('run-retry').onclick=()=>{const r=act({type:'retry'});if(r.ok)enterRun();else host.message(r.reason);};$('run-leave').onclick=()=>{leave();host.home?.();};

  const settings=document.getElementById('settings-dialog');if(settings){const b=document.createElement('button');b.className='quiet';b.innerHTML=iconHTML('flask')+'<span>Development & backups</span>';b.onclick=()=>open('development');settings.querySelector('#settings-advanced-actions').prepend(b);}
  if(loaded.recovered)host.message('Recovered progression from your backup.');
  return {
    get context(){return context;},get blocked(){return saveBlocked||context==='listening'||['run','challenge'].includes(context)&&state.phase!=='run';},get state(){return state;},
    skins:()=>skins.open(),tree:()=>tree.open(),campaign:view=>state.phase==='interlude'&&!shared&&!['tracks','collection','songs'].includes(view)?rewards.open():campaign.open(view),play:enterRun,leave,
    get skin(){return state.skin==='original'?null:trackGet(state.skin)?.color;},
    checkpoint(game,music){if(['run','challenge'].includes(context)&&state.phase==='run'){const next=structuredClone(state);next.run.game=structuredClone(game);next.run.music=music;return commit(next).ok;}return true;},
    observe(game,events,music){
      if(!['run','challenge'].includes(context)||state.phase!=='run'||saveBlocked)return;
      const r=progressionObserve(state,game,events,music);
      commit(r.state,()=>{if(r.outcome){
        if(r.record?.music)host.runMusic?.(r.record.music);
        $('run-result-title').textContent=titleCase(shared?'Shared Challenge · '+r.message:r.message);
        $('run-result-copy').textContent=r.outcome==='clear'?`Next: ${POOL_NAMES[state.pool+1]}. Choose a discovery and continue to the next pool.`:r.outcome==='victory'?`${r.record.medal} · ${r.record.launches} plucks · ${r.record.bonuses}/5 bonuses. Song saved in Campaign.`:'Your unfinished song is saved. Retry the track or unlock more powers before your next attempt.';
        $('run-listen').hidden=!r.record?.music;$('run-retry').hidden=r.outcome!=='failure'||!!shared;
        $('run-next').lastElementChild.textContent='Next pool & discoveries';
        const won=r.outcome==='victory'&&!shared;$('run-next').hidden=r.outcome!=='clear';$('run-destination').classList.add('primary');$('run-next').classList.add('primary');$('run-skin').hidden=!won;$('run-destination').hidden=!won;
        const destination=won?unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id)):null;
        $('run-destination').hidden=!destination;$('run-destination').lastElementChild.textContent=destination?'Next: '+destination.name:'Next track';
        $('run-restoration').innerHTML=won?`<div class="earned-skin" style="--track-color:${trackGet(state.track).color}"><i></i><span>${trackGet(state.track).name} restored<br>Player skin earned · your song saved</span></div>`:'';
        targetRender($('run-target'));result.showModal();tree.refresh();campaign.refresh();
      }});
    },
    hud(){if(context==='listening')return 'LISTENING · Your saved song';if(['run','challenge'].includes(context))return state.run?`${shared?'SHARED · ':kind==='development'?'TEST · ':''}${POOL_NAMES[state.pool]} ${state.pool+1}/5 · ${goalRemaining(state)}`:'Run complete · open Skill Tree';return null;}
  };
}
