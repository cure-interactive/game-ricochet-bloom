import {profileSession} from './profile-session.js?v=be340d1c7cfc6f6927c6717f7379226c43484b011621086348cf0f44a9a18aae';
import {cosmeticSkin,cosmeticLoadout} from './cosmetic.js?v=5fce426acea1cc7e8321f13619eaedbf2850895e457e202e7acc7843946b35d9';
import { screenHeader } from './screen-header.js?v=d2d9e718968f9e0818bd55ea79a06044736b5b22e901d86b8031521d8556b67b';
import { playerUpgradeMount } from './player-upgrade-ui.js?v=20ad6cd24984d95ff1bb6715d07e2aef187f1bd4dda0ea740fa5b0581647213c';
import { saveRecoveryMount } from './save-recovery-ui.js?v=02c17f1a37e0b451d9e14e771f73facc418bf03b436e52f8df8f1a6a4378f7b9';
import { progressionResetUnreadable } from './progression-store.js?v=a66e751aaec87c1ea46e3f109222b1e6b242975b81fc4e0758158aa311686e8b';
import { medalIcon } from './medal-ui.js?v=6df228e6d2895828fc52e3634bd7cb5b98bc58ddf86a48515c6d0a1527524ed2';

import { earningPrepare, earningId } from './earning.js?v=6e78b642b40a8b5067bb53b7a8694613a999b1c158bcef5909c8bb927ddad43f';
import { profilePlayReward, profileDevelopmentCopy, profileRename, profileName } from './profile.js?v=6ae3e8ed9c37fbcaa242590984de898190bb78ee535ff9a1ae0374fd9ff188bf';
import { developmentBarMount } from './development-bar.js?v=0b71d362f1a5c406c6eb36aad31483846558bb98b33e4104fe1e950e5e969940';
import { titleCase } from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
import { campaignMount } from './campaign-ui.js?v=431fbe9363392f0359320be94ec4dc8733f565bfed05ad22e7b7488995c2ce28';
import { challengeEncode, challengeDecode } from './challenge.js?v=35303a9c47d9ad23d0ad3075e6eecdc7787a463dfb03b464fa733829dc572aa2';
import { trackGet } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { CAMPAIGN_NAME, POOL_MEDALS, poolMedal, campaignPoolBest, unlockedTracks, researchTarget, progressionAct, progressionObserve, progressionLoadout, GAME_CATALOGUE, GOALS, POOL_NAMES, progressionCreate, progressionValidate, goalRemaining } from './run.js?v=da55154f29119180994fa42fffb0519eb40ddbf8abf9811a904032fce5de8861';
import { progressionRead, progressionWrite, progressionImport, developmentSettingsRead, developmentSettingsWrite } from './progression-store.js?v=a66e751aaec87c1ea46e3f109222b1e6b242975b81fc4e0758158aa311686e8b';
import { gameCreate } from './engine.js?v=7a7d88b5db94d46009aaeff65ec846efcbab72afa22735088b3758b3b0962fe5';
import { treeMount } from './tree-ui.js?v=ed8c4026b9cffcd31005fa1733d89ae7c50fe301606ccbd0903570564a0ae02c';
import { buttonHTML, iconHTML } from './ui-icon.js?v=cbf022ce3248160b361afed81589ae1a2f56bdd61274c5ee3f96e1462e192dff';
const button=(id,label,icon='play')=>buttonHTML(label,icon,{id});
import { skinMount } from './skin-ui.js?v=6f81e7c8b6861f5230bd3657301ce453e406dbe08c9577f4cf4fb604708d2984';
export function progressionMount(host){
  let developmentSettings=developmentSettingsRead(localStorage);
  let kind=developmentSettings.enabled?'development':'normal',loaded=progressionRead(localStorage,kind),state=loaded.state,context='legacy',listening=null,tree,campaign,suspended=null,shared=null,listenTimer=null;
  const session=profileSession({
    get:()=>({state,kind,loaded,suspended,shared}),
    read:ownerKind=>progressionRead(localStorage,ownerKind),
    write:next=>progressionWrite(localStorage,next),
    writeShared(next,code){try{const valid=progressionValidate(next,'development');if(!valid)throw new Error('invalid');localStorage.setItem('ricochet-bloom-shared-v1',JSON.stringify({code,state:valid}));return {ok:true,state:valid};}catch{return {ok:false,reason:'Shared Challenge could not be saved.'};}},
    reward:(profile,earning)=>profilePlayReward(profile,earning,GAME_CATALOGUE),
    accept(owner,next){if(owner.type==='suspended')suspended.state=next;else if(owner.type!=='stored'){state=next;loaded={state,available:true};}}
  });
  const profileBar=developmentBarMount();
  const $=id=>document.getElementById(id);
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const readMessage=()=>loaded.problem==='unavailable'?'Browser storage could not be accessed. Retry when storage is available. Nothing has been replaced.':'This profile could not be read by this version of the game. Your original data has not been replaced. Export it for recovery or try loading again.';
  let recoveryMessage=readMessage(),lastSaveFailure='';
  const recovery=saveRecoveryMount({status:()=>({blocked:session.blocked,kind,message:recoveryMessage,pending:!!session.pending,canReset:!session.pending&&!loaded.available&&loaded.problem==='invalid',canExport:loaded.available||!!session.pending||loaded.recovery?.main!=null||loaded.recovery?.backup!=null,details:[!loaded.available?Object.entries(loaded.recovery?.checks||{}).map(([k,v])=>k+': '+v).join('\n'):'',lastSaveFailure].filter(Boolean).join('\n')}),exportBackup,retry:retrySave,reset:resetUnreadable});
  function showRecovery(message,failure=null){if(failure)lastSaveFailure=`Save failure: ${failure.code||'reward-rejected'} · Stage: ${failure.stage||'reward'} · Phase: ${state.phase} · Pool: ${state.pool+1}`;recoveryMessage=message;recovery.refresh();if(document.body.dataset.startup==='ready')recovery.open();}
  function backupValue(){
    // An unreadable profile must export its exact source, never the empty fallback.
    return !loaded.available?{...loaded.recovery,...(session.pending?.earning?{pendingEarning:session.pending?.earning}:{}),...(session.pending?.state?{pendingState:session.pending?.state}:{})}:session.pending?.state||state;
  }
  window.ricochetDiagnostics?.setSupport(()=>({playerName:profileName((suspended?.state||session.pending?.state||state).profile),profile:kind,progress:backupValue(),...(session.pending||session.pending?.state?{lastSaved:state}:{}),pendingEarning:session.pending?.earning,saveFailure:lastSaveFailure}));
  function exportBackup(){
    const value=backupValue();
    const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.href=url;a.download=`ricochet-bloom-${shared?'shared':kind}${!loaded.available?'-recovery':''}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function transactionResult(r){
    if(!r.ok){showRecovery(r.reason+' Play is paused until the save succeeds.',r);return r;}
    recovery.refresh();
    if(r.amount>0&&r.notify)host.message(`+${r.amount} Point${r.amount===1?'':'s'} · ${r.state.profile.wallet.seeds} Available in Skills`);
    r.after?.();return r;
  }
  const commit=(next,after=null)=>transactionResult(session.commit(next,{after}));
  function retrySave(){
    if(session.pending){transactionResult(session.retry());tree.refresh();return;}
    const recovered=progressionRead(localStorage,kind);
    if(recovered.available){loaded=recovered;state=recovered.state;recovery.refresh();tree.refresh();}
    else {if(recovered.problem!=='unavailable'||loaded.available)loaded=recovered;recoveryMessage=recovered.problem==='unavailable'?'Browser storage is still unavailable. Your saved data has not been replaced.':readMessage();recovery.refresh();}
  }
  function resetUnreadable(){
    const result=progressionResetUnreadable(localStorage,kind);
    if(result.ok){state=result.state;loaded={state,available:true};tree.refresh();recovery.refresh();}
    else {recoveryMessage=result.reason;recovery.refresh();}
  }

  function settleEarning(earning,notify=true){return transactionResult(session.settle(earning,notify)).ok;}
  function act(action){if(session.blocked){recovery.open();return {ok:false,reason:'Saving needs attention. Use Retry Save or Email Report in the open recovery panel.'};}if(shared&&!['start','continue','abandon'].includes(action.type))return {ok:false,reason:'Shared challenges use the fixed supplied build.'};const input=structuredClone(state);if(shared&&action.type==='continue')input.route=shared.routes[input.pool+1];const r=progressionAct(input,action);if(!r.ok)return r;const saved=commit(r.state);return saved.ok?{...r,state}:saved;}
  const dev=document.createElement('dialog');dev.id='development-dialog';dev.className='standard-dialog';dev.setAttribute('aria-label','Development Settings');
  dev.innerHTML=`${screenHeader({className:'dialog-heading',title:'Development',icon:'flask',back:button('dev-close','Close','close')})}<div class="dialog-body"><div class="dev-controls">
<section class="reading-card"><h3 class="section-title"><span class="ui-icon" data-icon="flask" aria-hidden="true"></span><span>Development Profile</span></h3><p>Test progress is saved separately from normal progress. These settings are remembered in this browser.</p><p id="dev-status" role="status"></p><label class="setting-toggle"><input id="dev-switch" type="checkbox"><span><span class="ui-icon" data-icon="flask" aria-hidden="true"></span><span>Development Mode</span></span></label></section>
<section class="reading-card"><h3 class="section-title"><span class="ui-icon" data-icon="eye" aria-hidden="true"></span><span>Visibility</span></h3><div class="dev-option"><label class="setting-toggle"><input id="dev-show-hidden-content" type="checkbox"><span><span class="ui-icon" data-icon="eye" aria-hidden="true"></span><span>Show Hidden Tracks, Skills and Skins</span></span></label><small>Reveal hidden tracks, research and player skins in either profile. This does not unlock them.</small></div><div class="dev-option"><label class="setting-toggle"><input id="dev-show-purchased-costs" type="checkbox"><span><span class="ui-icon" data-icon="coin" aria-hidden="true"></span><span>Show Purchased Items Cost</span></span></label><small>Show catalogue Points costs for owned skills, skins, trails, impacts and music in either profile.</small></div></section>
<section class="reading-card"><h3 class="section-title"><span class="ui-icon" data-icon="coin" aria-hidden="true"></span><span>Points</span></h3><small>Changes only the Development profile.</small><div class="dev-grant-row"><label for="dev-amount">Points to Add<input id="dev-amount" type="number" min="1" max="1000000" step="1" value="100"></label>${button('dev-grant','Add Points','coin')}</div><div class="grant-presets" role="group" aria-label="Quick Add Points">${[10,100,1000].map(n=>button('dev-add-'+n,'+'+n,'coin')).join('')}</div></section>
<section class="reading-card"><h3 class="section-title"><span class="ui-icon" data-icon="skill-tree" aria-hidden="true"></span><span>Test Progress</span></h3><small>Changes only the Development profile.</small>${button('dev-seed','Copy normal progress into test profile','copy')}<div class="dev-option">${button('dev-max-progress','Maximize level progress','grid')}<small>Open every level and campaign skin, and set Points to at least 10,000. Research is unchanged.</small></div><div class="dev-option">${button('dev-max','Max out skill tree','skill-tree')}<small>Unlock all 25 powers, their upgrades and all player upgrades. Level progress is unchanged.</small></div></section>
<section class="reading-card"><h3 class="section-title"><span class="ui-icon" data-icon="reset" aria-hidden="true"></span><span>Reset Test Progress</span></h3><p>Clear test levels, research, Points, songs and the active test run. Normal progress stays unchanged.</p>${button('dev-reset','Reset all test progress','reset')}<section id="dev-reset-confirmation" class="tree-confirm" hidden aria-label="Confirm Reset"><strong>Reset all Development progress?</strong><p>Test levels, research, Points, saved songs and the active test run will be reset. Normal progress stays unchanged.</p>${button('dev-reset-cancel','Keep test progress','arrow-left')}${button('dev-reset-confirm','Reset Development profile','reset')}</section></section>
<section class="reading-card"><h3 class="section-title"><span class="ui-icon" data-icon="export" aria-hidden="true"></span><span>Progress Backups</span></h3><p>Export or import progress for the selected profile only.</p><div class="dialog-actions backup-actions">${button('progress-export','Export Backup','export')}${button('progress-import-open','Import Backup','import')}<input id="progress-import" type="file" accept="application/json,.json" hidden></div></section></div></div>`;
  document.body.append(dev);$('dev-amount').value=String(developmentSettings.grantAmount);
  const result=document.createElement('dialog');result.id='run-result-dialog';result.addEventListener('cancel',event=>{event.preventDefault();$('run-leave').click();});result.setAttribute('aria-labelledby','run-result-title');
  result.innerHTML=`<div class="run-result-icon">${iconHTML('epic')}</div><h2 id="run-result-title"></h2><p id="run-result-copy"></p><div id="run-restoration"></div><p id="run-target"></p><div class="dialog-actions">${button('run-listen','Listen to this song','music-note')}${button('run-skin','Use earned skin','player-skin')}${button('run-destination','Next Track','arrow-right')}${button('run-retry','Retry same setup','reset')}${button('run-next','Next Pool','arrow-right')}${button('run-leave','Main Menu','grid')}</div>`;document.body.append(result);
  const back=document.createElement('button');back.id='listening-return';back.className='quiet';back.hidden=true;back.innerHTML=iconHTML('arrow-left')+'<span>Leave Listening</span>';document.querySelector('.goal-strip').append(back);
  function leave(){clearTimeout(listenTimer);const fromMenu=host.currentScreen?.()!=='play';if(host.save()===false){host.message('Your result could not be saved. Keep this tab open and try Main Menu again.');return false;}if(suspended){state=suspended.state;kind=suspended.kind;suspended=null;shared=null;}context='legacy';listening=null;back.hidden=true;close();host.restoreLegacy();if(fromMenu)host.home?.();}
  back.onclick=()=>{const fromCampaign=listening?.campaign,track=listening?.track;leave();campaign.open(fromCampaign?'play':'songs',track);};
  function enterRun(){if(host.save()===false||session.blocked){recovery.open();return {ok:false,reason:'Saving needs attention before this level can start.'};}if(state.phase==='shop'){const r=act({type:'start'});if(!r.ok)return r;}else if(state.phase==='interlude'){const r=act({type:'continue'});if(!r.ok)return r;}context=shared?'challenge':'run';listening=null;back.hidden=true;close();host.play(state.run.game,state.run.music);return {ok:true};}
  function devRender(){const development=kind==='development',restricted=!development||!!shared||session.blocked;$('dev-switch').checked=development;$('dev-show-hidden-content').checked=developmentSettings.showHiddenContent;$('dev-show-purchased-costs').checked=developmentSettings.showPurchasedCosts;$('dev-seed').disabled=restricted;profileBar.set(kind,!!shared,['run','challenge','listening'].includes(context));$('dev-status').textContent=`${development?'Development':'Normal'} profile · ${state.profile.wallet.seeds} Points`;for(const id of ['dev-max-progress','dev-max','dev-grant',...['10','100','1000'].map(n=>'dev-add-'+n)])$(id).disabled=restricted;$('dev-amount').disabled=!development;$('dev-reset').disabled=restricted;$('dev-reset-confirmation').hidden=true;if(shared)$('dev-status').textContent+=' · Leave the shared challenge to edit your Development profile.';else if(session.blocked)$('dev-status').textContent+=' · Resolve Progress Recovery before editing.';else if(!development)$('dev-status').textContent+=' · Enable Development Mode to use test controls.';else if(state.phase==='run')$('dev-status').textContent+=' · Changes keep the current pool build; new skills apply from the next pool.';}
  function open(type,id){
    if(type==='campaign'){campaign.open();return {ok:true};}
    if(type==='play')return enterRun();
    if(type==='development'){devRender();dev.showModal();return {ok:true};}
    return {ok:false,reason:'This play option is unavailable.'};
  }
  function treeAct(action){
    if(session.blocked){recovery.open();return {ok:false,reason:'Saving needs attention. Use Retry Save in Progress Recovery.'};}
    return transactionResult(session.transact(owner=>progressionAct(owner,action)));
  }
  const players=playerUpgradeMount({showHiddenContent:()=>developmentSettings.showHiddenContent,showPurchasedCosts:()=>developmentSettings.showPurchasedCosts,get:()=>session.origin.state,act:treeAct,screen:()=>host.screen?.('player-upgrades'),back:()=>host.back?.()});
  tree=treeMount({get:()=>session.origin.state,showHiddenContent:()=>developmentSettings.showHiddenContent,showPurchasedCosts:()=>developmentSettings.showPurchasedCosts,act:treeAct,open,screen:()=>host.screen?.('tree'),back:()=>host.back?.()});
  const skins=skinMount({showPurchasedCosts:()=>developmentSettings.showPurchasedCosts,gentle:host.gentle,get:()=>session.origin.state,showHiddenContent:()=>developmentSettings.showHiddenContent,act:treeAct,screen:()=>host.screen?.('skins'),back:()=>host.back?.()});
  const listen=(record,seconds=0)=>{clearTimeout(listenTimer);host.save();context='listening';listening={campaign:seconds>0,track:record.track};close();back.hidden=false;back.lastElementChild.textContent=seconds?'Stop Preview':'Leave Listening';const listeningGame=gameCreate(record.seed,'free');listeningGame.blooms=record.music.blooms;listeningGame.launches=record.music.plucks;host.play(listeningGame,record.music);host.message('Listening to '+trackGet(record.track).name+'. Leave listening to return to your saved run.');if(seconds)listenTimer=setTimeout(()=>{if(context==='listening'&&host.currentScreen?.()==='play'){leave();campaign.open('play',record.track);}},seconds*1000);};
  campaign=campaignMount({showHiddenContent:()=>developmentSettings.showHiddenContent,screen:()=>host.screen?.('levels'),songsMount:host.songsMount,songsClose:host.songsClose,songsRefresh:host.songsRefresh,back:()=>host.back?.(),get:()=>({...state,shared:!!shared}),act,open,listen,
    code(){const build=progressionLoadout(state);if(!build.ok)return {ok:false,reason:'Your power pool could not be read.'};try{return {ok:true,code:challengeEncode({version:2,rules:18,track:state.track,seed:state.seed,relaxed:state.relaxed,build:build.powers,routes:[0,0,0,0,0]})};}catch{return {ok:false,reason:'This build cannot be shared.'};}},
    resumeChallenge(){try{const saved=JSON.parse(localStorage.getItem('ricochet-bloom-shared-v1')||'null'),code=saved?.code&&challengeDecode(challengeEncode(saved.code)),next=progressionValidate(saved?.state,'development');if(!code||!next||next.phase==='shop'||JSON.stringify(progressionLoadout(next).powers)!==JSON.stringify(code.build))return {ok:false,reason:'No valid unfinished shared challenge is saved.'};if(host.save()===false||suspended&&leave()===false)return {ok:false,reason:'Resolve Progress Recovery before changing challenges.'};suspended={state:structuredClone(state),kind};shared=code;state=next;kind='development';return enterRun();}catch{return {ok:false,reason:'No valid saved challenge.'};}},
    challenge(text){const code=challengeDecode(text);if(!code)return {ok:false,reason:'Invalid challenge code or incompatible rules version.'};if(host.save()===false||suspended&&leave()===false)return {ok:false,reason:'Resolve Progress Recovery before changing challenges.'};suspended={state:structuredClone(state),kind};shared=code;
      const next=progressionCreate('development');next.powerMode='shared';next.sharedVersion=code.version;next.fixedBuild=structuredClone(code.build);next.track=code.track;next.seed=code.seed;next.route=code.routes[0];next.relaxed=code.relaxed;next.bypass=true;next.borrowed=[];next.powers=code.build.map(p=>p.power);next.equipped=[];
      for(const p of code.build){next.profile.research[p.power+'.base']={paid:0};for(const k of [...(p.foundation?['foundation']:[]),...p.variants,...(p.capstone?['capstone']:[])]){next.profile.research[p.power+'.'+k]={paid:0};next.equipped.push(p.power+'.'+k);}}
      state=next;kind='development';return enterRun();}
  });


  $('dev-close').onclick=()=>dev.close();
  dev.addEventListener('close',()=>{if(!dev.open&&!$('settings-dialog').open&&host.currentScreen?.()==='home')host.home?.();});
  $('dev-switch').onchange=()=>{
    const enabled=$('dev-switch').checked;
    if(session.pending){devRender();$('dev-status').textContent='Resolve Progress Recovery before changing profiles.';return;}
    leave();
    if(session.pending){devRender();dev.showModal();$('dev-status').textContent='Resolve Progress Recovery before changing profiles.';return;}
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,enabled});
    if(!saved.ok){devRender();dev.showModal();$('dev-status').textContent=saved.reason;return;}
    developmentSettings=saved.settings;kind=enabled?'development':'normal';loaded=progressionRead(localStorage,kind);state=loaded.state;
    recoveryMessage=readMessage();recovery.refresh();
    tree.refresh();devRender();dev.showModal();
  };
  $('dev-show-hidden-content').onchange=()=>{
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,showHiddenContent:$('dev-show-hidden-content').checked});
    if(saved.ok){developmentSettings=saved.settings;tree.refresh();campaign.refresh();skins.refresh();devRender();}
    else {$('dev-show-hidden-content').checked=developmentSettings.showHiddenContent;$('dev-status').textContent=saved.reason;}
  };
  $('dev-show-purchased-costs').onchange=()=>{
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,showPurchasedCosts:$('dev-show-purchased-costs').checked});
    if(saved.ok){developmentSettings=saved.settings;tree.refresh();players.refresh();skins.refresh();devRender();}
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
  $('dev-seed').onclick=()=>{if(kind!=='development'||shared||session.blocked)return;const source=progressionRead(localStorage,'normal');if(!source.available){$('dev-status').textContent='Normal progress could not be read. Nothing was copied.';return;}if(leave()===false||session.blocked){dev.showModal();return;}const normal=source.state;normal.profile=profileDevelopmentCopy(normal.profile,GAME_CATALOGUE);normal.profile.playGeneration=(state.profile.playGeneration??0)+1;if(normal.run?.game.earning){normal.run.game.earning.kind='development';normal.run.game.earning.generation=normal.profile.playGeneration;}normal.bypass=false;const r=commit(normal);dev.showModal();devRender();tree.refresh();$('dev-status').textContent=r.ok?'Normal progress copied. Your normal profile remains unchanged.':r.reason;};
  for(const amount of [10,100,1000])$('dev-add-'+amount).onclick=()=>{const r=act({type:'grant',amount});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  for(const [id,type] of [['dev-max','max'],['dev-max-progress','max-progress'],['dev-grant','grant']])$(id).onclick=()=>{const r=act({type,amount:Number($('dev-amount').value)});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  $('progress-export').onclick=exportBackup;
  $('progress-import-open').onclick=()=>$('progress-import').click();
  $('progress-import').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10_000_000){$('dev-status').textContent='Backup is too large.';return;}const importKind=kind;const text=await file.text();if(session.pending||kind!==importKind||shared){$('dev-status').textContent='Resolve pending saves before importing into this profile.';return;}if(!confirm(`Replace this ${kind} profile with the selected backup? The current save becomes a backup.`))return;if(loaded.available&&leave()===false)return;const r=progressionImport(localStorage,text,importKind);if(r.ok){state=r.state;loaded={state,available:true};recovery.refresh();tree.refresh();devRender();dev.showModal();}else $('dev-status').textContent=r.reason;event.target.value='';};
  const targetRender=el=>{const t=researchTarget(state);el.textContent=t?`Next goal: ${t.name} · ${t.text}`:'';};
  $('run-skin').onclick=()=>{const r=act({type:'skin',skin:state.latest.track});if(r.ok)$('run-skin').lastElementChild.textContent='Skin equipped';};
  $('run-destination').onclick=()=>{const next=unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id));if(next)act({type:'track',track:next.id});close();campaign.open(next?'play':'songs');};
  $('run-next').onclick=()=>enterRun();$('run-listen').onclick=()=>{if(state.latest)listen(state.latest);};$('run-retry').onclick=()=>{const r=act({type:'retry'});if(r.ok)enterRun();else host.message(r.reason);};$('run-leave').onclick=()=>{if(leave()!==false)host.home?.();};

  const settings=document.getElementById('settings-dialog');if(settings){const b=document.createElement('button');b.className='quiet';b.innerHTML=iconHTML('flask')+'<span>Development & backups</span>';b.onclick=()=>open('development');settings.querySelector('#settings-advanced-actions').prepend(b);}
  devRender();
  if(loaded.recovered)host.message('Recovered progression from your backup.');
  const api={
    get developmentEnabled(){return developmentSettings.enabled;},
    // Shared challenges pay the originating profile, not their temporary build.
    get points(){return (session.origin.state).profile.wallet.seeds;},
    get trialKind(){return session.origin.kind;},
    get trialGeneration(){return (session.origin.state).profile.playGeneration??0;},
    get showPurchasedCosts(){return developmentSettings.showPurchasedCosts;},
    get statsProfile(){return {state:session.origin.state,available:loaded.available,kind:session.origin.kind};},
    trialReward:earning=>settleEarning(earning,false),
    profileIndicator(){profileBar.set(kind,!!shared);},
    recoveryNotice:recovery.notice,
    get saveDiagnostics(){return {blocked:session.blocked,pending:!!session.pending,lastFailure:lastSaveFailure};},
    get context(){return context;},get blocked(){return session.blocked||context==='listening'||['run','challenge'].includes(context)&&state.phase!=='run';},get state(){return state;},
    renamePlayer(name){
      if(session.blocked){recovery.open();return {ok:false,reason:'Saving needs attention. Use Retry Save in Progress Recovery.'};}
      return transactionResult(session.transact(owner=>{const renamed=profileRename(owner.profile,name);return renamed.ok?{ok:true,state:{...owner,profile:renamed.profile}}:renamed;}));
    },
    skins:()=>skins.open(),players:()=>players.open(),tree:()=>tree.open(),campaign:view=>campaign.open(view),play:enterRun,leave,
    cosmeticAct:treeAct,
    get cosmetics(){return cosmeticLoadout((session.origin.state).profile);},
    get skinStyle(){return cosmeticSkin((session.origin.state).profile)?.style||'original';},
    get skin(){const owner=session.origin.state;return cosmeticSkin(owner.profile)?.color||(owner.skin==='original'?null:trackGet(owner.skin)?.color);},
    prepareShot(game){if(context==='listening'||session.blocked)return false;const owner=session.origin;earningPrepare(game,owner.kind,Object.keys(owner.state.profile.research).filter(id=>id.endsWith('.base')).map(id=>id.slice(0,-5)),earningId(),owner.state.profile.playGeneration??0);return true;},
    settle(game,notify=true){return session.pending?.earning?false:context==='listening'?true:settleEarning(game.earning,notify);},
    checkpoint(game,music){if(['run','challenge'].includes(context)&&state.phase==='run'){const next=structuredClone(state);next.run.game=structuredClone(game);next.run.music=music;return commit(next).ok;}return true;},
    observe(game,events,music){
      if(context==='listening'||session.blocked)return;
      if(!settleEarning(game.earning)){session.after(()=>api.observe(game,events,music));return;}
      if(!['run','challenge'].includes(context)||state.phase!=='run')return;
      const r=progressionObserve(state,game,events,music);
      commit(r.state,()=>{if(r.outcome){
        if(['clear','victory'].includes(r.outcome))host.celebrate?.();
        if(r.record?.music)host.runMusic?.(r.record.music);
        $('run-result-title').textContent=titleCase(shared?'Shared Challenge · '+r.message:r.message);
        $('run-result-copy').textContent=r.outcome==='clear'?`Next: ${POOL_NAMES[state.pool+1]}. Your song continues with the powers and upgrades already active.`:r.outcome==='victory'?`Track award: ${r.record.medal} · ${r.record.launches} plucks · ${r.record.bonuses}/5 bonuses. Song saved in ${CAMPAIGN_NAME}.`:'Your unfinished song is saved. Retry the track or unlock more powers before your next attempt.';
        $('run-result-title').querySelector('.medal-icon')?.remove();
        if(r.poolResult){const p=r.poolResult,medal=poolMedal(p.pool,p.score);$('run-result-title').insertAdjacentHTML('afterbegin',medalIcon(medal));$('run-result-copy').textContent=`${POOL_NAMES[p.pool]} · ${medal||'Completed'} · ${p.score.toLocaleString('en-US')} Score · ${p.shots} ${p.shots===1?'shot':'shots'}. `+$('run-result-copy').textContent;}
        $('run-listen').hidden=!r.record?.music;$('run-retry').hidden=r.outcome!=='failure'||!!shared;
        $('run-next').lastElementChild.textContent='Continue to '+POOL_NAMES[state.pool+1];
        const won=r.outcome==='victory'&&!shared;$('run-next').hidden=r.outcome!=='clear';$('run-destination').classList.add('primary');$('run-next').classList.add('primary');$('run-skin').hidden=!won;$('run-destination').hidden=!won;
        const destination=won?unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id)):null;
        $('run-destination').hidden=!destination;$('run-destination').lastElementChild.textContent=destination?'Next: '+destination.name:'Next Track';
        $('run-skin').style.setProperty('--player-skin-color',trackGet(state.track).color);
        $('run-restoration').innerHTML=won?`<div class="earned-skin" style="--track-color:${trackGet(state.track).color}"><i></i><span>${trackGet(state.track).name} restored<br>Player skin earned · your song saved</span></div>`:'';
        targetRender($('run-target'));result.showModal();tree.refresh();campaign.refresh();
      }});
      return true; // This step already owns its campaign checkpoint.
    },
    medalHud(){if(!['run','challenge'].includes(context)||state.phase!=='run')return null;return {targets:POOL_MEDALS[state.pool],best:campaignPoolBest(state,state.track,state.pool)?.score??null};},
    hud(){if(context==='listening')return 'LISTENING · Your saved song';if(['run','challenge'].includes(context))return state.run?`${shared?'SHARED · ':''}${POOL_NAMES[state.pool]} ${state.pool+1}/5 · ${goalRemaining(state)}`:'Run complete · open Skills';return null;}
  };
  return api;
}
