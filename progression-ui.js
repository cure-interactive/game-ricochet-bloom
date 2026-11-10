import { progressionAct, progressionObserve, progressionLoadout, GAME_CATALOGUE, GOALS, POOL_NAMES } from './run.js?v=a5da9f437077bba3d892dfaaaf2c5894ddc0b77e13c79e7c7d6456e76240a9d5';
import { progressionRead, progressionWrite, progressionImport } from './progression-store.js?v=51eda5c0fce4f4f529d54fc9bd0a4db94a3b05bad510d04ee227beb9c843dbf8';
import { profileReward } from './profile.js?v=c703912292f7bab5f657f5c89991fda053a00d41848a6b0f92c3f14a35c56421';
import { gameCreate } from './engine.js?v=3866c817d261df98d09b8f4b537d91c3b9b0498907e606f8585acde8f0ddd411';
import { treeMount } from './tree-ui.js?v=c287455bb131be33516ed2c78aca05846711dc86aac6272fa8dfbad067285d54';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
const button=(id,label,icon='play')=>`<button id="${id}" type="button">${iconHTML(icon)}<span>${label}</span></button>`;
export function progressionMount(host){
  let kind='normal',loaded=progressionRead(localStorage,kind),state=loaded.state,context='legacy',practice=null,tree;
  const $=id=>document.getElementById(id);
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function commit(next){const r=progressionWrite(localStorage,next);if(r.ok)state=r.state;else host.message(r.reason);return r;}
  function act(action){const r=progressionAct(state,action);if(!r.ok)return r;const saved=commit(r.state);return saved.ok?{...r,state}:saved;}
  const dev=document.createElement('dialog');dev.id='development-dialog';dev.setAttribute('aria-label','Development settings');
  dev.innerHTML=`<div class="dialog-heading">${iconHTML('flask')}<h2>Development</h2>${button('dev-close','Close','close')}</div><p>Use a separate test profile. Normal research, currency and runs stay in your normal profile.</p><p id="dev-status" role="status"></p><div class="dev-controls">${button('dev-switch','Use development profile','flask')}${button('dev-max','Unlock all powers & upgrades','epic')}<label>Seeds to add<input id="dev-amount" type="number" min="1" max="1000000" step="1" value="100"></label>${button('dev-grant','Add Seeds','coin')}${button('dev-bypass','Tuning limit: on','switches')}</div><hr><p>Progress backup · selected profile only</p><div class="dialog-actions">${button('progress-export','Export backup','download')}<label class="file-button">${iconHTML('upload')} Import backup<input id="progress-import" type="file" accept="application/json,.json"></label></div>`;
  document.body.append(dev);
  const result=document.createElement('dialog');result.id='run-result-dialog';result.setAttribute('aria-labelledby','run-result-title');
  result.innerHTML=`<div class="run-result-icon">${iconHTML('epic')}</div><h2 id="run-result-title"></h2><p id="run-result-copy"></p><div class="dialog-actions">${button('run-next','Tune & continue','network-node-three')}${button('run-leave','Back to other modes','grid')}</div>`;document.body.append(result);
  const back=document.createElement('button');back.id='practice-return';back.setAttribute('aria-label','Leave practice');back.className='quiet';back.hidden=true;back.innerHTML=iconHTML('arrow-left')+'<span>Leave practice</span>';document.querySelector('.pool-navigation').append(back);
  function leave(){host.save();context='legacy';practice=null;back.hidden=true;close();host.restoreLegacy();}
  back.onclick=()=>{leave();tree.open();};
  function enterRun(){host.save();if(state.phase==='shop'){const r=act({type:'start'});if(!r.ok)return r;}else if(state.phase==='interlude'){const r=act({type:'continue'});if(!r.ok)return r;}context='run';practice=null;back.hidden=true;close();host.play(state.run.game,state.run.music);return {ok:true};}
  function enterPractice(id,tutorial=false){
    host.save();const node=GAME_CATALOGUE.nodes[id],power=tutorial?'ripple':node.power;
    const powers=[power,...['ripple','attract','comet'].filter(p=>p!==power)].slice(0,3),build=powers.map(p=>({power:p,foundation:p===power&&node?.kind==='foundation',variants:p===power&&['a','b'].includes(node?.kind)?[node.kind]:[],capstone:p===power&&node?.kind==='capstone'}));
    const game=gameCreate(tutorial?'BLOOM-LESSON':'TRY-'+id,'free',{build,population:14});
    game.power.offer=power;game.power.target=1;
    // The practice marker starts directly above the player, so one upward pluck tests it.
    Object.assign(game.bodies[1],{x:480,y:420,vx:0,vy:0});
    context='practice';practice={tutorial};close();back.hidden=false;host.play(game,null);host.message(tutorial?'Make one bloom to earn your first 4 Seeds. Practice has unlimited plucks.':'Pluck upward to collect the marked power. Practice does not change your run.');return {ok:true};
  }
  function devRender(){const development=kind==='development';$('dev-status').textContent=`${development?'Development':'Normal'} profile · ${state.profile.wallet.seeds} Seeds`;$('dev-switch').lastElementChild.textContent=development?'Return to normal profile':'Use development profile';for(const id of ['dev-max','dev-grant','dev-bypass','dev-amount'])$(id).disabled=!development||state.phase==='run';$('dev-bypass').lastElementChild.textContent=`Tuning limit: ${state.bypass?'off':'on'}`;}
  function open(type,id){if(type==='play')return enterRun();if(type==='practice'||type==='tutorial')return enterPractice(type==='tutorial'?'ripple.base':id,type==='tutorial');if(type==='development'){devRender();dev.showModal();return {ok:true};}}
  tree=treeMount({get:()=>state,act,open});
  $('dev-close').onclick=()=>dev.close();
  $('dev-switch').onclick=()=>{leave();kind=kind==='normal'?'development':'normal';loaded=progressionRead(localStorage,kind);state=loaded.state;tree.refresh();devRender();dev.showModal();};
  for(const [id,type] of [['dev-max','max'],['dev-grant','grant'],['dev-bypass','bypass']])$(id).onclick=()=>{const r=act({type,amount:Number($('dev-amount').value)});devRender();$('dev-status').textContent=r.ok?r.message:r.reason;tree.refresh();};
  $('progress-export').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.href=url;a.download=`ricochet-bloom-${kind}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  $('progress-import').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10_000_000){$('dev-status').textContent='Backup is too large.';return;}const text=await file.text();if(!confirm(`Replace this ${kind} profile with the selected backup? The current save becomes a backup.`))return;const r=progressionImport(localStorage,text,kind);if(r.ok){leave();state=r.state;tree.refresh();devRender();dev.showModal();}else $('dev-status').textContent=r.reason;event.target.value='';};
  $('run-next').onclick=()=>{close();tree.open();document.querySelector('[data-tree-view="run"]').click();};$('run-leave').onclick=leave;
  const mode=document.createElement('section');mode.className='mode-card song-run-card';mode.innerHTML=`${iconHTML('epic')}<h3>Song Run</h3><p>Five pools. Earn Seeds. Grow your powers.</p>${button('choose-song-run','Research & play','network-node-three')}`;$('mode-dialog').insertBefore(mode,$('mode-dialog').querySelector('[data-close]')?.nextSibling||null);$('choose-song-run').onclick=()=>{close();tree.open();document.querySelector('[data-tree-view="run"]').click();};
  const settings=document.getElementById('settings-dialog');if(settings){const b=document.createElement('button');b.className='quiet';b.innerHTML=iconHTML('flask')+'<span>Development & backups</span>';b.onclick=()=>open('development');settings.append(b);}
  if(loaded.recovered)host.message('Recovered progression from your backup.');
  return {
    get context(){return context;},get blocked(){return context==='run'&&state.phase!=='run';},get state(){return state;},
    tree:()=>tree.open(),leave,
    checkpoint(game,music){if(context==='run'&&state.phase==='run'){const next=structuredClone(state);next.run.game=structuredClone(game);next.run.music=music;return commit(next).ok;}return true;},
    observe(game,events,music){
      if(context==='practice'&&practice?.tutorial&&events.some(e=>e.type==='bloom')){const r=profileReward(state.profile,{mode:'song-run',type:'tutorial',bloom:true},GAME_CATALOGUE);if(r.ok&&!r.duplicate){const next=structuredClone(state);next.profile=r.profile;if(commit(next).ok)host.message('First bloom · +4 Seeds! Open the tree to research your first upgrade.');}}
      if(context!=='run'||state.phase!=='run')return;
      const r=progressionObserve(state,game,events,music);state=r.state;
      if(events.some(e=>['note','power','bloom','rest','over','win'].includes(e.type)))commit(state);
      if(r.outcome){$('run-result-title').textContent=r.message;$('run-result-copy').textContent=r.outcome==='clear'?`Next: ${POOL_NAMES[state.pool+1]}. Borrow another upgrade and retune your loadout.`:r.outcome==='victory'?'Your complete song and permanent research are yours to keep. Try another build.':'Research an upgrade, change your loadout, or try Relaxed pace.';result.showModal();tree.refresh();}
    },
    hud(){if(context==='practice')return `${practice?.tutorial?'BLOOM LESSON':'PRACTICE'} · Unlimited plucks · no run rewards`;if(context==='run')return state.run?`${POOL_NAMES[state.pool]} ${state.pool+1}/5 · ${GOALS[state.pool]} · ${state.run.game.blooms} blooms · ${state.run.roles.length}/3 roles`:'Run complete · open Skill tree';return null;}
  };
}
