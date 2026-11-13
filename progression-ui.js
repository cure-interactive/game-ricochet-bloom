import { earningPrepare, earningId } from './earning.js?v=1afa4d4bcc5833ee186a45acb741cf69d6b41a916791779352cdfa39c28efea4';
import { profilePlayReward, profileDevelopmentCopy } from './profile.js?v=c6193f5b78aa1b7b083af2a61bd361bc4bd29630e62ac6a78ae4914a996f0faa';
import { developmentBarMount } from './development-bar.js?v=181dce74a6c678d17bc3bf56a544abf43f86d43f4a3425995c93deb94be38b6b';
import { titleCase } from './ui-text.js?v=2c84fa9359b3450499aad40d6bf02d804236b14edac3b33e3e2738480818319a';
import { campaignMount } from './campaign-ui.js?v=55c49e4dd7ed6b0357cfcde186dc083cb8d8f78ebbcf3ac1511ea909c67a427d';
import { challengeEncode, challengeDecode } from './challenge.js?v=7fbdf091e799e46eaff095ca85709dc41c3dfa7f3e6f9b84c3026cd039f3ad2d';
import { trackGet } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { unlockedTracks, researchTarget, progressionAct, progressionObserve, progressionLoadout, GAME_CATALOGUE, GOALS, POOL_NAMES, progressionCreate, progressionValidate, goalRemaining } from './run.js?v=e3c4f47443dc857f478874cd9dd084335cb1fa39d9c04b258ef874ef440ede4f';
import { progressionRead, progressionWrite, progressionImport, developmentSettingsRead, developmentSettingsWrite } from './progression-store.js?v=8ceb383e3779d82da1307a4c85e0ffea4dcd1e37765e194dca1be624646e5e94';
import { gameCreate } from './engine.js?v=2db9fdcd9241ec8c083ee82e78844226085b2c177941e6192bbf566a363eaa97';
import { treeMount } from './tree-ui.js?v=5033560a5ea5f4a1694fb07cb7193c11195b2d91620256478a098611ef9222f4';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
const button=(id,label,icon='play')=>`<button id="${id}" type="button">${iconHTML(icon)}<span>${label}</span></button>`;
import { skinMount } from './skin-ui.js?v=5fca3cc5aac40e1bc292701ff788040196687a6b1bbb5fc9d08dd984b15188d0';
export function progressionMount(host){
  let developmentSettings=developmentSettingsRead(localStorage);
  let kind=developmentSettings.enabled?'development':'normal',loaded=progressionRead(localStorage,kind),state=loaded.state,context='legacy',listening=null,tree,campaign,pending=null,pendingAfter=null,suspended=null,shared=null,listenTimer=null;
  let saveBlocked=!loaded.available,pendingEarning=null,pendingEarningState=null,earningAfter=null;
  const profileBar=developmentBarMount();
  const $=id=>document.getElementById(id);
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const warning=document.createElement('div');warning.className='save-warning';warning.hidden=!saveBlocked;warning.setAttribute('role','alert');warning.innerHTML='<span>Progress could not be read. Export a backup before replacing it.</span>'+button('save-export','Export backup','download')+button('save-retry','Retry save','reset');document.body.append(warning);
  function exportBackup(){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(pendingEarningState||pending||state,null,2)],{type:'application/json'}));a.href=url;a.download=`ricochet-bloom-${shared?'shared':kind}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function commit(next,after=null){
    let r;
    if(shared){try{const valid=progressionValidate(next,'development');if(!valid)throw new Error('invalid');localStorage.setItem('ricochet-bloom-shared-v1',JSON.stringify({code:shared,state:valid}));r={ok:true,state:valid};}catch{r={ok:false,reason:'Shared Challenge could not be saved.'};}}
    else r=progressionWrite(localStorage,next);
    if(r.ok){state=r.state;pending=null;pendingAfter=null;saveBlocked=false;warning.hidden=true;after?.();}
    else {pending=structuredClone(next);pendingAfter=after;saveBlocked=true;warning.hidden=false;warning.firstElementChild.textContent=r.reason+' Play is paused. Export a backup or free storage and retry.';}
    return r;
  }
  $('save-export').onclick=exportBackup;
  $('save-retry').onclick=()=>{if(pendingEarning){const after=earningAfter;if(settleEarning(pendingEarning)){earningAfter=null;after?.();}return;}if(pending)commit(pending,pendingAfter);else {const recovered=progressionRead(localStorage,kind);if(recovered.available){state=recovered.state;saveBlocked=false;warning.hidden=true;tree.refresh();}else if(confirm('Start a fresh profile? Existing unreadable data will be preserved in a recovery file first.')){try{const key='ricochet-bloom-progression-v1'+(kind==='development'?'-development':'');localStorage.setItem(key+'-unreadable',JSON.stringify({main:localStorage.getItem(key),backup:localStorage.getItem(key+'-backup')}));commit(state);}catch{warning.firstElementChild.textContent='Storage is unavailable. Export before closing.';}}}};

  function settleEarning(earning,notify=true){
    if(pending||saveBlocked&&!pendingEarning)return false;
    if(!earning||!earning.shots)return true;
    const owner=suspended?.kind===earning.kind?'suspended':!shared&&kind===earning.kind?'current':'stored';
    const loadedOwner=owner==='stored'?progressionRead(localStorage,earning.kind):null;
    const input=owner==='suspended'?suspended.state:owner==='current'?state:loadedOwner.state;
    const earned=loadedOwner&&!loadedOwner.available?{ok:false,reason:'The earning profile could not be read.'}:profilePlayReward(input.profile,earning,GAME_CATALOGUE);
    const next=earned.ok?{...input,profile:earned.profile}:null;
    const saved=earned.ok?(earned.duplicate?{ok:true,state:input}:progressionWrite(localStorage,next)):earned;
    if(!saved.ok){pendingEarning=structuredClone(earning);pendingEarningState=next;saveBlocked=true;warning.hidden=false;warning.firstElementChild.textContent='Points could not be saved. Play is paused. Free storage and retry.';return false;}
    if(owner==='suspended')suspended.state=saved.state;else if(owner==='current')state=saved.state;
    pendingEarning=null;pendingEarningState=null;saveBlocked=false;warning.hidden=true;
    if(!earned.duplicate&&earned.amount===0&&earning.contacts%6&&notify)host.message(`${earning.contacts%6}/6 Contacts Toward Your Next Point`);
    if(earned.amount>0&&notify)host.message(`+${earned.amount} Point${earned.amount===1?'':'s'} · ${saved.state.profile.wallet.seeds} Available in Skill Tree`);
    return true;
  }
  function act(action){if(saveBlocked)return {ok:false,reason:'Resolve the save warning first.'};if(shared&&!['start','continue','abandon'].includes(action.type))return {ok:false,reason:'Shared challenges use the fixed supplied build.'};const input=structuredClone(state);if(shared&&action.type==='continue')input.route=shared.routes[input.pool+1];const r=progressionAct(input,action);if(!r.ok)return r;const saved=commit(r.state);return saved.ok?{...r,state}:saved;}
  const dev=document.createElement('dialog');dev.id='development-dialog';dev.className='standard-dialog';dev.setAttribute('aria-label','Development settings');
  dev.innerHTML=`<div class="dialog-heading">${iconHTML('flask')}<h2>Development</h2>${button('dev-close','Close','close')}</div><div class="dialog-body"><p>Development mode, view toggles and the Points amount are remembered in this browser. Test progress is saved separately from normal progress.</p><p id="dev-status" role="status"></p><div class="dev-controls"><label class="setting-toggle"><input id="dev-switch" type="checkbox"><span>Development mode</span></label><label class="setting-toggle"><input id="dev-show-hidden-content" type="checkbox"><span>Show Hidden Tracks, Skills and Skins</span></label><small>Reveal hidden tracks, research and player skins in either profile. This does not unlock them.</small><label class="setting-toggle"><input id="dev-show-purchased-costs" type="checkbox"><span>Show Purchased Skill Costs</span></label><small>Show catalogue Points costs on owned skill nodes and cards in either profile.</small>${button('dev-seed','Copy normal progress into test profile','copy')}<p class="dev-help">These controls change only the Development profile.</p>${button('dev-max-progress','Maximize level progress','grid')}<small>Open every level and skin, and set Points to at least 10,000. Research is unchanged.</small>${button('dev-max','Max out skill tree','epic')}<small>Unlock all 25 powers and all their upgrades. Level progress is unchanged.</small>${button('dev-reset','Reset all test progress','reset')}<small>Clear test levels, research, currency, songs and the active test run.</small><section id="dev-reset-confirmation" class="tree-confirm" hidden aria-label="Confirm reset"><strong>Reset all Development progress?</strong><p>Test levels, research, Points, saved songs and the active test run will be reset. Normal progress stays unchanged.</p>${button('dev-reset-cancel','Keep test progress','arrow-left')}${button('dev-reset-confirm','Reset Development profile','reset')}</section><label>Points to add<input id="dev-amount" type="number" min="1" max="1000000" step="1" value="100"></label><div class="grant-presets">${[10,100,1000].map(n=>button('dev-add-'+n,'+'+n,'coin')).join('')}</div>${button('dev-grant','Add Points','coin')}</div><hr><p>Progress backup · selected profile only</p><div class="dialog-actions">${button('progress-export','Export backup','download')}<label class="file-button">${iconHTML('upload')} Import backup<input id="progress-import" type="file" accept="application/json,.json"></label></div></div>`;
  document.body.append(dev);$('dev-amount').value=String(developmentSettings.grantAmount);
  const result=document.createElement('dialog');result.id='run-result-dialog';result.addEventListener('cancel',event=>{event.preventDefault();host.home?.();});result.setAttribute('aria-labelledby','run-result-title');
  result.innerHTML=`<div class="run-result-icon">${iconHTML('epic')}</div><h2 id="run-result-title"></h2><p id="run-result-copy"></p><div id="run-restoration"></div><p id="run-target"></p><div class="dialog-actions">${button('run-listen','Listen to this song','music-note')}${button('run-skin','Use earned skin','check')}${button('run-destination','Next track','arrow-right')}${button('run-retry','Retry same setup','reset')}${button('run-next','Next Pool','arrow-right')}${button('run-leave','Main Menu','grid')}</div>`;document.body.append(result);
  const back=document.createElement('button');back.id='listening-return';back.className='quiet';back.hidden=true;back.innerHTML=iconHTML('arrow-left')+'<span>Leave listening</span>';document.querySelector('.goal-strip').append(back);
  function leave(){clearTimeout(listenTimer);const fromMenu=host.currentScreen?.()!=='play';host.save();if(suspended){state=suspended.state;kind=suspended.kind;suspended=null;shared=null;}context='legacy';listening=null;back.hidden=true;close();host.restoreLegacy();if(fromMenu)host.home?.();}
  back.onclick=()=>{const fromCampaign=listening?.campaign,track=listening?.track;leave();campaign.open(fromCampaign?'play':'songs',track);};
  function enterRun(){host.save();if(state.phase==='shop'){const r=act({type:'start'});if(!r.ok)return r;}else if(state.phase==='interlude'){const r=act({type:'continue'});if(!r.ok)return r;}context=shared?'challenge':'run';listening=null;back.hidden=true;close();host.play(state.run.game,state.run.music);return {ok:true};}
  function devRender(){const development=kind==='development';$('dev-switch').checked=development;$('dev-show-hidden-content').checked=developmentSettings.showHiddenContent;$('dev-show-purchased-costs').checked=developmentSettings.showPurchasedCosts;$('dev-seed').disabled=!development||state.phase==='run';profileBar.set(kind,!!shared);$('dev-status').textContent=`${development?'Development':'Normal'} profile · ${state.profile.wallet.seeds} Points`;for(const id of ['dev-max-progress','dev-max','dev-grant',...['10','100','1000'].map(n=>'dev-add-'+n)])$(id).disabled=!development||state.phase==='run';$('dev-amount').disabled=!development;$('dev-reset').disabled=!development;$('dev-reset-confirmation').hidden=true;if(development&&state.phase==='run')$('dev-status').textContent+=' · Finish this pool before maximizing progress.';}
  function open(type,id){
    if(type==='campaign'){campaign.open();return {ok:true};}
    if(type==='play')return enterRun();
    if(type==='development'){devRender();dev.showModal();return {ok:true};}
    return {ok:false,reason:'This play option is unavailable.'};
  }
  tree=treeMount({get:()=>state,showHiddenContent:()=>developmentSettings.showHiddenContent,showPurchasedCosts:()=>developmentSettings.showPurchasedCosts,act,open,screen:()=>host.screen?.('tree'),back:()=>host.back?.()});
  const skins=skinMount({get:()=>state,showHiddenContent:()=>developmentSettings.showHiddenContent,act,screen:()=>host.screen?.('skins'),back:()=>host.back?.()});
  const listen=(record,seconds=0)=>{clearTimeout(listenTimer);host.save();context='listening';listening={campaign:seconds>0,track:record.track};close();back.hidden=false;back.lastElementChild.textContent=seconds?'Stop preview':'Leave listening';const listeningGame=gameCreate(record.seed,'free');listeningGame.blooms=record.music.blooms;listeningGame.launches=record.music.plucks;host.play(listeningGame,record.music);host.message('Listening to '+trackGet(record.track).name+'. Leave listening to return to your saved run.');if(seconds)listenTimer=setTimeout(()=>{if(context==='listening'&&host.currentScreen?.()==='play'){leave();campaign.open('play',record.track);}},seconds*1000);};
  campaign=campaignMount({showHiddenContent:()=>developmentSettings.showHiddenContent,screen:()=>host.screen?.('levels'),songsMount:host.songsMount,songsClose:host.songsClose,songsRefresh:host.songsRefresh,back:()=>host.back?.(),get:()=>({...state,shared:!!shared}),act,open,listen,
    code(){const build=progressionLoadout(state);if(!build.ok)return {ok:false,reason:'Your power pool could not be read.'};try{return {ok:true,code:challengeEncode({version:2,rules:18,track:state.track,seed:state.seed,relaxed:state.relaxed,build:build.powers,routes:[0,0,0,0,0]})};}catch{return {ok:false,reason:'This build cannot be shared.'};}},
    resumeChallenge(){try{const saved=JSON.parse(localStorage.getItem('ricochet-bloom-shared-v1')||'null'),code=saved?.code&&challengeDecode(challengeEncode(saved.code)),next=progressionValidate(saved?.state,'development');if(!code||!next||next.phase==='shop'||JSON.stringify(progressionLoadout(next).powers)!==JSON.stringify(code.build))return {ok:false,reason:'No valid unfinished shared challenge is saved.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;state=next;kind='development';return enterRun();}catch{return {ok:false,reason:'No valid saved challenge.'};}},
    challenge(text){const code=challengeDecode(text);if(!code)return {ok:false,reason:'Invalid challenge code or incompatible rules version.'};host.save();if(suspended)leave();suspended={state:structuredClone(state),kind};shared=code;
      const next=progressionCreate('development');next.powerMode='shared';next.sharedVersion=code.version;next.fixedBuild=structuredClone(code.build);next.track=code.track;next.seed=code.seed;next.route=code.routes[0];next.relaxed=code.relaxed;next.bypass=true;next.borrowed=[];next.powers=code.build.map(p=>p.power);next.equipped=[];
      for(const p of code.build){next.profile.research[p.power+'.base']={paid:0};for(const k of [...(p.foundation?['foundation']:[]),...p.variants,...(p.capstone?['capstone']:[])]){next.profile.research[p.power+'.'+k]={paid:0};next.equipped.push(p.power+'.'+k);}}
      state=next;kind='development';return enterRun();}
  });


  $('dev-close').onclick=()=>dev.close();
  dev.addEventListener('close',()=>{if(!dev.open&&!$('settings-dialog').open&&host.currentScreen?.()==='home')host.home?.();});
  $('dev-switch').onchange=()=>{
    const enabled=$('dev-switch').checked;
    if(pending||pendingEarning){devRender();$('dev-status').textContent='Resolve the save warning before changing profiles.';return;}
    leave();
    if(pending||pendingEarning){devRender();dev.showModal();$('dev-status').textContent='Resolve the save warning before changing profiles.';return;}
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,enabled});
    if(!saved.ok){devRender();dev.showModal();$('dev-status').textContent=saved.reason;return;}
    developmentSettings=saved.settings;kind=enabled?'development':'normal';loaded=progressionRead(localStorage,kind);state=loaded.state;
    saveBlocked=!loaded.available;warning.hidden=!saveBlocked;if(saveBlocked)warning.firstElementChild.textContent='Progress could not be read. Export a backup before replacing it.';
    tree.refresh();devRender();dev.showModal();
  };
  $('dev-show-hidden-content').onchange=()=>{
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,showHiddenContent:$('dev-show-hidden-content').checked});
    if(saved.ok){developmentSettings=saved.settings;tree.refresh();campaign.refresh();skins.refresh();devRender();}
    else {$('dev-show-hidden-content').checked=developmentSettings.showHiddenContent;$('dev-status').textContent=saved.reason;}
  };
  $('dev-show-purchased-costs').onchange=()=>{
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,showPurchasedCosts:$('dev-show-purchased-costs').checked});
    if(saved.ok){developmentSettings=saved.settings;tree.refresh();devRender();}
    else {$('dev-show-purchased-costs').checked=developmentSettings.showPurchasedCosts;$('dev-status').textContent=saved.reason;}
  };
  $('dev-amount').oninput=()=>{
    if(!$('dev-amount').validity.valid||!$('dev-amount').value)return;
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,grantAmount:Number($('dev-amount').value)});
    if(saved.ok)developmentSettings=saved.settings;else $('dev-status').textContent=saved.reason;
  };
  $('dev-reset').onclick=()=>{$('dev-reset-confirmation').hidden=false;$('dev-reset-cancel').focus();$('dev-reset-confirmation').scrollIntoView({block:'nearest'});};
  $('dev-reset-cancel').onclick=()=>{$('dev-reset-confirmation').hidden=true;$('dev-reset').focus();};
  $('dev-reset-confirm').onclick=()=>{const r=act({type:'reset-progress'});if(r.ok){context='legacy';listening=null;back.hidden=true;host.restoreLegacy();host.home?.();dev.showModal();}devRender();tree.refresh();$('dev-status').textContent=r.ok?r.message:r.reason;$('dev-reset').focus();};
  $('dev-seed').onclick=()=>{const normal=progressionRead(localStorage,'normal').state;normal.profile=profileDevelopmentCopy(normal.profile,GAME_CATALOGUE);if(normal.run?.game.earning)normal.run.game.earning.kind='development';normal.bypass=false;const r=commit(normal);devRender();tree.refresh();$('dev-status').textContent=r.ok?'Normal progress copied. Your normal profile remains unchanged.':r.reason;};
  for(const amount of [10,100,1000])$('dev-add-'+amount).onclick=()=>{const r=act({type:'grant',amount});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  for(const [id,type] of [['dev-max','max'],['dev-max-progress','max-progress'],['dev-grant','grant']])$(id).onclick=()=>{const r=act({type,amount:Number($('dev-amount').value)});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  $('progress-export').onclick=exportBackup;
  $('progress-import').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10_000_000){$('dev-status').textContent='Backup is too large.';return;}const text=await file.text();if(!confirm(`Replace this ${kind} profile with the selected backup? The current save becomes a backup.`))return;const r=progressionImport(localStorage,text,kind);if(r.ok){leave();state=r.state;tree.refresh();devRender();dev.showModal();}else $('dev-status').textContent=r.reason;event.target.value='';};
  const targetRender=el=>{const t=researchTarget(state);el.textContent=t?`Next goal: ${t.name} · ${t.text}`:'';};
  $('run-skin').onclick=()=>{const r=act({type:'skin',skin:state.latest.track});if(r.ok)$('run-skin').lastElementChild.textContent='Skin equipped';};
  $('run-destination').onclick=()=>{const next=unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id));if(next)act({type:'track',track:next.id});close();campaign.open(next?'play':'songs');};
  $('run-next').onclick=()=>enterRun();$('run-listen').onclick=()=>{if(state.latest)listen(state.latest);};$('run-retry').onclick=()=>{const r=act({type:'retry'});if(r.ok)enterRun();else host.message(r.reason);};$('run-leave').onclick=()=>{leave();host.home?.();};

  const settings=document.getElementById('settings-dialog');if(settings){const b=document.createElement('button');b.className='quiet';b.innerHTML=iconHTML('flask')+'<span>Development & backups</span>';b.onclick=()=>open('development');settings.querySelector('#settings-advanced-actions').prepend(b);}
  devRender();
  if(loaded.recovered)host.message('Recovered progression from your backup.');
  const api={
    get trialKind(){return (suspended||{kind}).kind;},
    trialReward:earning=>settleEarning(earning,false),
    profileIndicator(){profileBar.set(kind,!!shared);},
    get context(){return context;},get blocked(){return saveBlocked||context==='listening'||['run','challenge'].includes(context)&&state.phase!=='run';},get state(){return state;},
    skins:()=>skins.open(),tree:()=>tree.open(),campaign:view=>campaign.open(view),play:enterRun,leave,
    get skin(){return state.skin==='original'?null:trackGet(state.skin)?.color;},
    prepareShot(game){if(context==='listening'||saveBlocked)return false;const owner=suspended||{state,kind};earningPrepare(game,owner.kind,Object.keys(owner.state.profile.research).filter(id=>id.endsWith('.base')).map(id=>id.slice(0,-5)),earningId());return true;},
    settle(game,notify=true){return pendingEarning?false:context==='listening'?true:settleEarning(game.earning,notify);},
    checkpoint(game,music){if(['run','challenge'].includes(context)&&state.phase==='run'){const next=structuredClone(state);next.run.game=structuredClone(game);next.run.music=music;return commit(next).ok;}return true;},
    observe(game,events,music){
      if(context==='listening'||saveBlocked)return;
      if(!settleEarning(game.earning)){earningAfter=()=>api.observe(game,events,music);return;}
      if(!['run','challenge'].includes(context)||state.phase!=='run')return;
      const r=progressionObserve(state,game,events,music);
      commit(r.state,()=>{if(r.outcome){
        if(r.record?.music)host.runMusic?.(r.record.music);
        $('run-result-title').textContent=titleCase(shared?'Shared Challenge · '+r.message:r.message);
        $('run-result-copy').textContent=r.outcome==='clear'?`Next: ${POOL_NAMES[state.pool+1]}. Your song continues with the powers and upgrades already active.`:r.outcome==='victory'?`${r.record.medal} · ${r.record.launches} plucks · ${r.record.bonuses}/5 bonuses. Song saved in Campaign.`:'Your unfinished song is saved. Retry the track or unlock more powers before your next attempt.';
        $('run-listen').hidden=!r.record?.music;$('run-retry').hidden=r.outcome!=='failure'||!!shared;
        $('run-next').lastElementChild.textContent='Continue to '+POOL_NAMES[state.pool+1];
        const won=r.outcome==='victory'&&!shared;$('run-next').hidden=r.outcome!=='clear';$('run-destination').classList.add('primary');$('run-next').classList.add('primary');$('run-skin').hidden=!won;$('run-destination').hidden=!won;
        const destination=won?unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id)):null;
        $('run-destination').hidden=!destination;$('run-destination').lastElementChild.textContent=destination?'Next: '+destination.name:'Next track';
        $('run-restoration').innerHTML=won?`<div class="earned-skin" style="--track-color:${trackGet(state.track).color}"><i></i><span>${trackGet(state.track).name} restored<br>Player skin earned · your song saved</span></div>`:'';
        targetRender($('run-target'));result.showModal();tree.refresh();campaign.refresh();
      }});
    },
    hud(){if(context==='listening')return 'LISTENING · Your saved song';if(['run','challenge'].includes(context))return state.run?`${shared?'SHARED · ':''}${POOL_NAMES[state.pool]} ${state.pool+1}/5 · ${goalRemaining(state)}`:'Run complete · open Skill Tree';return null;}
  };
  return api;
}
