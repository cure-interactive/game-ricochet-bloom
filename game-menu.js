import {menuView,menuDismiss,menuRestorePath} from './menu-state.js?v=0ac50ae5758d0c7e70f669aa366f6b6a16c5613629af35c4c1d1b5a4b7be3b54';
import {menuSummaryRender} from './menu-summary.js?v=88be0a3d0eefb7d6ff84518fc4e186dec329935a2399efe6f97308f69ae578e1';
import {cosmeticLoadout} from './cosmetic.js?v=91c84c76f4cab70c42d98d3478ee3f1de65abb45f7542101028be9084fe96d9e';
import { menuLayoutMount } from './menu-title.js?v=50a219215962514f8cd3c31d41cc0bc710a3b02f6b15178915a0f3d87e7c7c7b';
import { pageHistory } from './page-history.js?v=54c1c0aaacb43da66e5503f9ea5ea7948dfd1efd2ededbc6b416434a1792e935';
import { buttonHTML } from './ui-icon.js?v=3ec57aca06a56be722ba4758c1a5f9f22822f17f0488b0eba544ab0976429198';
import { menuBackgroundMount } from './menu-background.js?v=02d206d3f07a53ba1464b5d2cbd9b52c9fdf44d635e832741506aeffb6388ef2';

import { driftMount } from './drift-ui.js?v=66bfbcbbcb4ee85c3031fd46c78ca5926df5cae7557c9fc4ad2b288a0b6c14d4';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.inert=document.body.dataset.startup!==undefined&&document.body.dataset.startup!=='ready';home.setAttribute('aria-label','Main Menu');
  const button=(id,label,icon,kind='')=>buttonHTML(label,icon,{id,class:kind});
  home.innerHTML=`<div class="home-content"><div class="home-actions"><nav class="home-primary" aria-label="Main Game Actions"><button type="button" id="home-continue" class="primary"></button>${button('home-gamemodes','Gamemodes','grid','primary')}${button('home-tree','Skills','skill-tree')}${button('home-player','Player','player-skin')}</nav><nav class="home-secondary" aria-label="More Game Options">${button('home-wiki','Wiki','book')}${button('home-help','How to Play','book')}${button('home-settings','Settings','gear')}</nav></div></div>`;
  menuLayoutMount(home.querySelector('.home-content'));
  menuLayoutMount(document.querySelector('#menu-dialog>.dialog-body'));
  const backdrop=document.createElement('div');backdrop.id='menu-background';backdrop.setAttribute('aria-hidden','true');
  backdrop.innerHTML='<canvas class="home-pool"></canvas>';
  document.body.append(backdrop,home);
  if(host.recoveryNotice)home.querySelector('.home-actions').prepend(host.recoveryNotice);
  const route=pageHistory('home');
  const view=()=>menuView(route.snapshot);
  const drift=driftMount({pause:pauseOpen,resume});
  const background=menuBackgroundMount(backdrop.querySelector('.home-pool'),()=>host.gentle?.()===true,{profile:host.profile,skin:host.skin,skinStyle:host.skinStyle,audioSettings:host.audioSettings,powerMarkings:()=>view().casual});
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function refresh(){background.refresh();document.body.style.setProperty('--player-skin-color',host.skin?.()||'#f1f9d7');document.body.style.setProperty('--player-skin-style',host.skinStyle?.()||'original');document.body.style.setProperty('--player-trail',cosmeticLoadout(host.profile?.()?.profile).trail);document.body.style.setProperty('--player-impact',cosmeticLoadout(host.profile?.()?.profile).bounce);const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;if(info.resume){menuSummaryRender(resume,{...info.resume,title:'Continue'});}home.querySelector('#home-gamemodes').classList.toggle('primary',!info.resume);}
  function present(name){
    route.visit(name);
    const current=view();
    document.body.dataset.screen=current.screen;document.body.dataset.menuMode=current.menuMode;home.hidden=!current.homeVisible;backdrop.hidden=!current.backdropVisible;
    background.show(current.backgroundActive,{ambient:current.backgroundAmbient});drift.show(current.screen);
    document.querySelector('body>main').inert=!current.playInput;
    if(current.suspend)host.suspend({ambient:current.suspendAmbient});refresh();
    queueMicrotask(recoverDestination);
  }
  function recoverDestination(){
    if(document.querySelector('dialog[open]'))return;
    const destination=menuDismiss(route.snapshot);
    if(destination==='home')homeOpen();
    else if(destination){present(destination);host.open(destination);}
  }
  function homeOpen(){close();route.reset('home');present('home');home.querySelector(host.info().resume?'#home-continue':'#home-gamemodes').focus({preventScroll:true});}
  function pauseOpen(){close();const name=view().casual?'drift-pause':'pause';present(name);host.open(name);}
  function resume(){if(view().casual){close();present('drift');}else host.resume();}
  function restore(pages,play){
    const path=menuRestorePath(pages);if(!path.length)return;
    const target=path.at(-1);close();
    if(path.includes('play')||path.includes('pause')){if(host.restorePlay){if(host.restorePlay(play)===false){homeOpen();return;}}else host.continue();}
    route.restore(path);
    if(target==='home')homeOpen();else{present(target);host.open(target);}
  }
  function back(){const target=route.back();if(target===null)return;close();if(target==='play')host.resume();else if(target==='home')homeOpen();else {present(target);host.open(target);}}
  home.querySelector('#home-continue').onclick=()=>host.continue();
  home.querySelector('#home-gamemodes').onclick=()=>host.open('gamemodes');
  home.querySelector('#home-tree').onclick=()=>host.open('tree');
  home.querySelector('#home-player').onclick=()=>host.open('player');
  home.querySelector('#home-wiki').onclick=()=>host.open('wiki');
  home.querySelector('#home-help').onclick=()=>host.open('help');
  home.querySelector('#home-settings').onclick=()=>host.open('settings');
  // Settings can switch profiles without a page-history transition.
  document.addEventListener('close',()=>{
    if(view().homeMode)refresh();
    // Native Close/Escape and nested dialog exits must always leave a destination.
    // Check after synchronous navigation has opened its replacement dialog.
    queueMicrotask(recoverDestination);
  },true);
  refresh();present('home');
  return {restore,get playIdentity(){return host.playIdentity?.();},get snapshot(){return route.snapshot;},refresh,home:homeOpen,back,show:present,get musicAudio(){return background.audio;},drift(){close();present('drift');},pause:pauseOpen,resume,play(){close();route.reset('play');present('play');},get current(){return route.current;}};
}
