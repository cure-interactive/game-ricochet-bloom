import { playerUpgradeMount } from './player-upgrade-ui.js?v=399a63fa274fe60c9267d82c155c136818920c5fc333ee74ddc2876bb437b417';
import { saveRecoveryMount } from './save-recovery-ui.js?v=22ca1b694e351eb79943b890a1c8470d3ddf6925355688b7f5b88b9ef82a9109';
import { progressionResetUnreadable } from './progression-store.js?v=f2589426fa95238b3613d91150a238ab2996ab5b5dce9a9a20accbe0475d1a72';
import { medalIcon } from './medal-ui.js?v=559905246b3697fd9cf0a993d9c71ffe30b47a0c6d6cd3943a5b235d0faa31c8';

import { earningPrepare, earningId } from './earning.js?v=95a3b4796136fdaeecc73effb73229085d826719b7179b769a0c3482f2e13e20';
import { profilePlayReward, profileDevelopmentCopy } from './profile.js?v=03135a7e384bee9ced392b53013ac9b1d30322c335516a5135a553ae01bb76a3';
import { developmentBarMount } from './development-bar.js?v=b0a9cd790c798450cb10b29aef25140fc2e6c33d64c54683da93b2db844c8b3b';
import { titleCase } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { campaignMount } from './campaign-ui.js?v=01bcd20909353c902e75161a09a2797d98cc811556da09af2fccf9ddd45d1038';
import { challengeEncode, challengeDecode } from './challenge.js?v=724ffa049fdd2ff0c86b50c37463781c0cb28fd33aa82f39ae539a70f4edd18d';
import { trackGet } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { CAMPAIGN_NAME, POOL_MEDALS, poolMedal, campaignPoolBest, unlockedTracks, researchTarget, progressionAct, progressionObserve, progressionLoadout, GAME_CATALOGUE, GOALS, POOL_NAMES, progressionCreate, progressionValidate, goalRemaining } from './run.js?v=cc440fdabebe81d2a4eb7bbd3fb7e891f85544ca0cdecf5fe40ef089b5c4d3fb';
import { progressionRead, progressionWrite, progressionImport, developmentSettingsRead, developmentSettingsWrite } from './progression-store.js?v=f2589426fa95238b3613d91150a238ab2996ab5b5dce9a9a20accbe0475d1a72';
import { gameCreate } from './engine.js?v=2dd0f771b37dc76497de4916b6a40d2267fe82b6096fb3b47ff898d77220ee69';
import { treeMount } from './tree-ui.js?v=b6b95da6ecaed8185fd684bc7f28bffc789ae746709d73a35c5956476e366705';
import { buttonHTML, iconHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';
const button=(id,label,icon='play')=>buttonHTML(label,icon,{id});
import { skinMount } from './skin-ui.js?v=cd6e9849fb4a5ab1274be06c059e546ec2484757dba8d989c725f2e5d0e4a0bb';
export function progressionMount(host){
  let developmentSettings=developmentSettingsRead(localStorage);
  let kind=developmentSettings.enabled?'development':'normal',loaded=progressionRead(localStorage,kind),state=loaded.state,context='legacy',listening=null,tree,campaign,pending=null,pendingAfter=null,suspended=null,shared=null,listenTimer=null;
  let saveBlocked=!loaded.available,pendingEarning=null,pendingEarningState=null,earningAfter=null;
  const profileBar=developmentBarMount();
  const $=id=>document.getElementById(id);
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const readMessage=()=>loaded.problem==='unavailable'?'Browser storage could not be accessed. Retry when storage is available. Nothing has been replaced.':'This profile could not be read by this version of the game. Your original data has not been replaced. Export it for recovery or try loading again.';
  let recoveryMessage=readMessage();
  const recovery=saveRecoveryMount({status:()=>({blocked:saveBlocked,kind,message:recoveryMessage,pending:!!(pending||pendingEarning),canReset:!pending&&!pendingEarning&&!loaded.available&&loaded.problem==='invalid',canExport:loaded.available||!!pending||!!pendingEarning||loaded.recovery?.main!=null||loaded.recovery?.backup!=null,details:!loaded.available?Object.entries(loaded.recovery?.checks||{}).map(([k,v])=>k+': '+v).join('\n'):''}),exportBackup,retry:retrySave,reset:resetUnreadable});
  function showRecovery(message){recoveryMessage=message;recovery.refresh();if(document.body.dataset.startup==='ready')recovery.open();}
  function exportBackup(){
    // An unreadable profile must export its exact source, never the empty fallback.
    const value=!loaded.available?{...loaded.recovery,...(pendingEarning?{pendingEarning}:{}),...(pendingEarningState||pending?{pendingState:pendingEarningState||pending}:{})}:pendingEarningState||pending||state;
    const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.href=url;a.download=`ricochet-bloom-${shared?'shared':kind}${!loaded.available?'-recovery':''}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function commit(next,after=null){
    if(!loaded.available&&!pending&&!pendingEarning)return {ok:false,reason:'Open Progress Recovery before replacing unreadable data.'};
    let r;
    if(shared){try{const valid=progressionValidate(next,'development');if(!valid)throw new Error('invalid');localStorage.setItem('ricochet-bloom-shared-v1',JSON.stringify({code:shared,state:valid}));r={ok:true,state:valid};}catch{r={ok:false,reason:'Shared Challenge could not be saved.'};}}
    else r=progressionWrite(localStorage,next);
    if(r.ok){state=r.state;loaded={state,available:true};pending=null;pendingAfter=null;saveBlocked=false;recovery.refresh();after?.();}
    else {pending=structuredClone(next);pendingAfter=after;saveBlocked=true;showRecovery(r.reason+' Play is paused. Export a backup or free storage and retry.');}
    return r;
  }
  function retrySave(){
    if(pendingEarning){const after=earningAfter;if(settleEarning(pendingEarning)){earningAfter=null;after?.();}return;}
    if(pending){commit(pending,pendingAfter);return;}
    const recovered=progressionRead(localStorage,kind);
    if(recovered.available){loaded=recovered;state=recovered.state;saveBlocked=false;recovery.refresh();tree.refresh();}
    else {if(recovered.problem!=='unavailable'||loaded.available)loaded=recovered;recoveryMessage=recovered.problem==='unavailable'?'Browser storage is still unavailable. Your saved data has not been replaced.':readMessage();recovery.refresh();}
  }
  function resetUnreadable(){
    const result=progressionResetUnreadable(localStorage,kind);
    if(result.ok){state=result.state;loaded={state,available:true};saveBlocked=false;tree.refresh();recovery.refresh();}
    else {recoveryMessage=result.reason;recovery.refresh();}
  }

  function settleEarning(earning,notify=true){
    if(pending||saveBlocked&&!pendingEarning)return false;
    if(!earning||!earning.shots)return true;
    const owner=suspended?.kind===earning.kind?'suspended':!shared&&kind===earning.kind?'current':'stored';
    const loadedOwner=owner==='stored'?progressionRead(localStorage,earning.kind):null;
    const input=owner==='suspended'?suspended.state:owner==='current'?state:loadedOwner.state;
    const earned=loadedOwner&&!loadedOwner.available?{ok:false,reason:'The earning profile could not be read.'}:profilePlayReward(input.profile,earning,GAME_CATALOGUE);
    const next=earned.ok?{...input,profile:earned.profile}:null;
    const saved=earned.ok?(earned.duplicate?{ok:true,state:input}:progressionWrite(localStorage,next)):earned;
    if(!saved.ok){pendingEarning=structuredClone(earning);pendingEarningState=next;saveBlocked=true;showRecovery('Points could not be saved. Play is paused. Free storage and retry.');return false;}
    if(owner==='suspended')suspended.state=saved.state;else if(owner==='current')state=saved.state;
    pendingEarning=null;pendingEarningState=null;saveBlocked=false;recovery.refresh();
    if(earned.amount>0&&notify)host.message(`+${earned.amount} Point${earned.amount===1?'':'s'} · ${saved.state.profile.wallet.seeds} Available in Skills`);
    return true;
  }
  function act(action){if(saveBlocked)return {ok:false,reason:'Open Progress Recovery from the main menu or Settings.'};if(shared&&!['start','continue','abandon'].includes(action.type))return {ok:false,reason:'Shared challenges use the fixed supplied build.'};const input=structuredClone(state);if(shared&&action.type==='continue')input.route=shared.routes[input.pool+1];const r=progressionAct(input,action);if(!r.ok)return r;const saved=commit(r.state);return saved.ok?{...r,state}:saved;}
  const dev=document.createElement('dialog');dev.id='development-dialog';dev.className='standard-dialog';dev.setAttribute('aria-label','Development settings');
  dev.innerHTML=`<div class="dialog-heading screen-heading">${iconHTML('flask')}<h2>Development</h2>${button('dev-close','Close','close')}</div><div class="dialog-body"><p>Development mode, view toggles and the Points amount are remembered in this browser. Test progress is saved separately from normal progress.</p><p id="dev-status" role="status"></p><div class="dev-controls"><label class="setting-toggle"><input id="dev-switch" type="checkbox"><span>Development mode</span></label><label class="setting-toggle"><input id="dev-show-hidden-content" type="checkbox"><span>Show Hidden Tracks, Skills and Skins</span></label><small>Reveal hidden tracks, research and player skins in either profile. This does not unlock them.</small><label class="setting-toggle"><input id="dev-show-purchased-costs" type="checkbox"><span>Show Purchased Skill Costs</span></label><small>Show catalogue Points costs on owned skill nodes and cards in either profile.</small>${button('dev-seed','Copy normal progress into test profile','copy')}<p class="dev-help">These controls change only the Development profile.</p>${button('dev-max-progress','Maximize level progress','grid')}<small>Open every level and skin, and set Points to at least 10,000. Research is unchanged.</small>${button('dev-max','Max out skill tree','epic')}<small>Unlock all 25 powers, their upgrades and all player upgrades. Level progress is unchanged.</small>${button('dev-reset','Reset all test progress','reset')}<small>Clear test levels, research, currency, songs and the active test run.</small><section id="dev-reset-confirmation" class="tree-confirm" hidden aria-label="Confirm reset"><strong>Reset all Development progress?</strong><p>Test levels, research, Points, saved songs and the active test run will be reset. Normal progress stays unchanged.</p>${button('dev-reset-cancel','Keep test progress','arrow-left')}${button('dev-reset-confirm','Reset Development profile','reset')}</section><label>Points to add<input id="dev-amount" type="number" min="1" max="1000000" step="1" value="100"></label><div class="grant-presets">${[10,100,1000].map(n=>button('dev-add-'+n,'+'+n,'coin')).join('')}</div>${button('dev-grant','Add Points','coin')}</div><hr><p>Progress backup · selected profile only</p><div class="dialog-actions">${button('progress-export','Export backup','download')}<label class="file-button">${iconHTML('upload')} Import backup<input id="progress-import" type="file" accept="application/json,.json"></label></div></div>`;
  document.body.append(dev);$('dev-amount').value=String(developmentSettings.grantAmount);
  const result=document.createElement('dialog');result.id='run-result-dialog';result.addEventListener('cancel',event=>{event.preventDefault();$('run-leave').click();});result.setAttribute('aria-labelledby','run-result-title');
  result.innerHTML=`<div class="run-result-icon">${iconHTML('epic')}</div><h2 id="run-result-title"></h2><p id="run-result-copy"></p><div id="run-restoration"></div><p id="run-target"></p><div class="dialog-actions">${button('run-listen','Listen to this song','music-note')}${button('run-skin','Use earned skin','player-skin')}${button('run-destination','Next track','arrow-right')}${button('run-retry','Retry same setup','reset')}${button('run-next','Next Pool','arrow-right')}${button('run-leave','Main Menu','grid')}</div>`;document.body.append(result);
  const back=document.createElement('button');back.id='listening-return';back.className='quiet';back.hidden=true;back.innerHTML=iconHTML('arrow-left')+'<span>Leave listening</span>';document.querySelector('.goal-strip').append(back);
  function leave(){clearTimeout(listenTimer);const fromMenu=host.currentScreen?.()!=='play';if(host.save()===false){host.message('Your result could not be saved. Keep this tab open and try Main Menu again.');return false;}if(suspended){state=suspended.state;kind=suspended.kind;suspended=null;shared=null;}context='legacy';listening=null;back.hidden=true;close();host.restoreLegacy();if(fromMenu)host.home?.();}
  back.onclick=()=>{const fromCampaign=listening?.campaign,track=listening?.track;leave();campaign.open(fromCampaign?'play':'songs',track);};
  function enterRun(){host.save();if(state.phase==='shop'){const r=act({type:'start'});if(!r.ok)return r;}else if(state.phase==='interlude'){const r=act({type:'continue'});if(!r.ok)return r;}context=shared?'challenge':'run';listening=null;back.hidden=true;close();host.play(state.run.game,state.run.music);return {ok:true};}
  function devRender(){const development=kind==='development';$('dev-switch').checked=development;$('dev-show-hidden-content').checked=developmentSettings.showHiddenContent;$('dev-show-purchased-costs').checked=developmentSettings.showPurchasedCosts;$('dev-seed').disabled=!development||state.phase==='run';profileBar.set(kind,!!shared,['run','challenge','listening'].includes(context));$('dev-status').textContent=`${development?'Development':'Normal'} profile · ${state.profile.wallet.seeds} Points`;for(const id of ['dev-max-progress','dev-max','dev-grant',...['10','100','1000'].map(n=>'dev-add-'+n)])$(id).disabled=!development||state.phase==='run';$('dev-amount').disabled=!development;$('dev-reset').disabled=!development;$('dev-reset-confirmation').hidden=true;if(development&&state.phase==='run')$('dev-status').textContent+=' · Finish this pool before maximizing progress.';}
  function open(type,id){
    if(type==='campaign'){campaign.open();return {ok:true};}
    if(type==='play')return enterRun();
    if(type==='development'){devRender();dev.showModal();return {ok:true};}
    return {ok:false,reason:'This play option is unavailable.'};
  }
  function treeAct(action){
    if(!suspended)return act(action);
    if(saveBlocked)return {ok:false,reason:'Open Progress Recovery from the main menu or Settings.'};
    const r=progressionAct(suspended.state,action);if(!r.ok)return r;
    const saved=progressionWrite(localStorage,r.state);
    if(saved.ok)suspended.state=saved.state;
    return saved.ok?{...r,state:saved.state}:saved;
  }
  const players=playerUpgradeMount({showHiddenContent:()=>developmentSettings.showHiddenContent,powers:()=>tree.open(),showPurchasedCosts:()=>developmentSettings.showPurchasedCosts,get:()=>suspended?.state||state,act:treeAct,screen:()=>host.screen?.('player-upgrades'),back:()=>host.back?.()});
  tree=treeMount({players:()=>players.open(),get:()=>suspended?.state||state,showHiddenContent:()=>developmentSettings.showHiddenContent,showPurchasedCosts:()=>developmentSettings.showPurchasedCosts,act:treeAct,open,screen:()=>host.screen?.('tree'),back:()=>host.back?.()});
  const skins=skinMount({gentle:host.gentle,get:()=>state,showHiddenContent:()=>developmentSettings.showHiddenContent,act,screen:()=>host.screen?.('skins'),back:()=>host.back?.()});
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
    if(pending||pendingEarning){devRender();$('dev-status').textContent='Resolve Progress Recovery before changing profiles.';return;}
    leave();
    if(pending||pendingEarning){devRender();dev.showModal();$('dev-status').textContent='Resolve Progress Recovery before changing profiles.';return;}
    const saved=developmentSettingsWrite(localStorage,{...developmentSettings,enabled});
    if(!saved.ok){devRender();dev.showModal();$('dev-status').textContent=saved.reason;return;}
    developmentSettings=saved.settings;kind=enabled?'development':'normal';loaded=progressionRead(localStorage,kind);state=loaded.state;
    saveBlocked=!loaded.available;recoveryMessage=readMessage();recovery.refresh();
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
  $('progress-import').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10_000_000){$('dev-status').textContent='Backup is too large.';return;}const text=await file.text();if(!confirm(`Replace this ${kind} profile with the selected backup? The current save becomes a backup.`))return;const r=progressionImport(localStorage,text,kind);if(r.ok){leave();state=r.state;loaded={state,available:true};saveBlocked=false;recovery.refresh();tree.refresh();devRender();dev.showModal();}else $('dev-status').textContent=r.reason;event.target.value='';};
  const targetRender=el=>{const t=researchTarget(state);el.textContent=t?`Next goal: ${t.name} · ${t.text}`:'';};
  $('run-skin').onclick=()=>{const r=act({type:'skin',skin:state.latest.track});if(r.ok)$('run-skin').lastElementChild.textContent='Skin equipped';};
  $('run-destination').onclick=()=>{const next=unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id));if(next)act({type:'track',track:next.id});close();campaign.open(next?'play':'songs');};
  $('run-next').onclick=()=>enterRun();$('run-listen').onclick=()=>{if(state.latest)listen(state.latest);};$('run-retry').onclick=()=>{const r=act({type:'retry'});if(r.ok)enterRun();else host.message(r.reason);};$('run-leave').onclick=()=>{if(leave()!==false)host.home?.();};

  const settings=document.getElementById('settings-dialog');if(settings){const b=document.createElement('button');b.className='quiet';b.innerHTML=iconHTML('flask')+'<span>Development & backups</span>';b.onclick=()=>open('development');settings.querySelector('#settings-advanced-actions').prepend(b);}
  devRender();
  if(loaded.recovered)host.message('Recovered progression from your backup.');
  const api={
    get developmentEnabled(){return developmentSettings.enabled;},
    get developmentEnabled(){return developmentSettings.enabled;},
    // Shared challenges pay the originating profile, not their temporary build.
    get points(){return (suspended?.state||state).profile.wallet.seeds;},
    get trialKind(){return (suspended||{kind}).kind;},
    get statsProfile(){return {state:suspended?.state||state,available:loaded.available,kind:(suspended||{kind}).kind};},
    trialReward:earning=>settleEarning(earning,false),
    profileIndicator(){profileBar.set(kind,!!shared,['run','challenge','listening'].includes(context));},
    recoveryNotice:recovery.notice,
    get context(){return context;},get blocked(){return saveBlocked||context==='listening'||['run','challenge'].includes(context)&&state.phase!=='run';},get state(){return state;},
    skins:()=>skins.open(),players:()=>players.open(),tree:()=>tree.open(),campaign:view=>campaign.open(view),play:enterRun,leave,
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
        $('run-result-copy').textContent=r.outcome==='clear'?`Next: ${POOL_NAMES[state.pool+1]}. Your song continues with the powers and upgrades already active.`:r.outcome==='victory'?`Track award: ${r.record.medal} · ${r.record.launches} plucks · ${r.record.bonuses}/5 bonuses. Song saved in ${CAMPAIGN_NAME}.`:'Your unfinished song is saved. Retry the track or unlock more powers before your next attempt.';
        $('run-result-title').querySelector('.medal-icon')?.remove();
        if(r.poolResult){const p=r.poolResult,medal=poolMedal(p.pool,p.score);$('run-result-title').insertAdjacentHTML('afterbegin',medalIcon(medal));$('run-result-copy').textContent=`${POOL_NAMES[p.pool]} · ${medal||'Completed'} · ${p.score.toLocaleString('en-US')} Score · ${p.shots} ${p.shots===1?'shot':'shots'}. `+$('run-result-copy').textContent;}
        $('run-listen').hidden=!r.record?.music;$('run-retry').hidden=r.outcome!=='failure'||!!shared;
        $('run-next').lastElementChild.textContent='Continue to '+POOL_NAMES[state.pool+1];
        const won=r.outcome==='victory'&&!shared;$('run-next').hidden=r.outcome!=='clear';$('run-destination').classList.add('primary');$('run-next').classList.add('primary');$('run-skin').hidden=!won;$('run-destination').hidden=!won;
        const destination=won?unlockedTracks(state).find(t=>!state.profile.rewards.some(r=>r.event.type==='victory'&&r.event.trackId===t.id)):null;
        $('run-destination').hidden=!destination;$('run-destination').lastElementChild.textContent=destination?'Next: '+destination.name:'Next track';
        $('run-skin').style.setProperty('--player-skin-color',trackGet(state.track).color);
        $('run-restoration').innerHTML=won?`<div class="earned-skin" style="--track-color:${trackGet(state.track).color}"><i></i><span>${trackGet(state.track).name} restored<br>Player skin earned · your song saved</span></div>`:'';
        targetRender($('run-target'));result.showModal();tree.refresh();campaign.refresh();
      }});
    },
    medalHud(){if(!['run','challenge'].includes(context)||state.phase!=='run')return null;return {targets:POOL_MEDALS[state.pool],best:campaignPoolBest(state,state.track,state.pool)?.score??null};},
    hud(){if(context==='listening')return 'LISTENING · Your saved song';if(['run','challenge'].includes(context))return state.run?`${shared?'SHARED · ':''}${POOL_NAMES[state.pool]} ${state.pool+1}/5 · ${goalRemaining(state)}`:'Run complete · open Skills';return null;}
  };
  return api;
}
