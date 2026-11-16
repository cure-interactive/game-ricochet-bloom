import {cosmeticLoadout} from './cosmetic.js?v=c1c123b7a3926c29cd0f81c9f79402f0bab12505a0d3d8511563ad7f6f33c054';
import { menuLayoutMount } from './menu-title.js?v=227af622797ef118030a4b0a8f439c0fcf4d1f16ae28d66b41efbf95d97e84a8';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { buttonHTML } from './ui-icon.js?v=38ca69c062e7f070053503afe2ecc1bb3d94f32cc42f76760cbf1495ddfef877';
import { menuBackgroundMount } from './menu-background.js?v=5b86237723bf69c29e9a24eded6d14c5ebc290d9a7886d7e1d399e7b81c4e068';

import { driftMount } from './drift-ui.js?v=185f475e6e6d19f17205fa9ae61ea5c2b845c7a34622f5afe92b51ae1310223e';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.inert=document.body.dataset.startup!==undefined&&document.body.dataset.startup!=='ready';home.setAttribute('aria-label','Main Menu');
  const button=(id,label,icon,kind='')=>buttonHTML(label,icon,{id,class:kind});
  home.innerHTML=`<div class="home-content"><div class="home-actions"><nav class="home-primary" aria-label="Main game actions"><button type="button" id="home-continue" class="primary"><img class="continue-art" width="48" height="48" alt=""><span class="continue-copy"><span>Continue</span><small class="continue-detail"></small></span></button>${button('home-gamemodes','Gamemodes','grid','primary')}${button('home-tree','Skills','skill-tree')}${button('home-player','Player','player-skin')}</nav><nav class="home-secondary" aria-label="More game options">${button('home-wiki','Wiki','book')}${button('home-help','How to Play','book')}${button('home-settings','Settings','gear')}</nav></div></div>`;
  menuLayoutMount(home.querySelector('.home-content'));
  menuLayoutMount(document.querySelector('#menu-dialog>.dialog-body'));
  const backdrop=document.createElement('div');backdrop.id='menu-background';backdrop.setAttribute('aria-hidden','true');
  backdrop.innerHTML='<canvas class="home-pool"></canvas>';
  document.body.append(backdrop,home);
  if(host.recoveryNotice)home.querySelector('.home-actions').prepend(host.recoveryNotice);
  const route=pageHistory('home');let homeMode=true,casual=false;
  const drift=driftMount({pause:pauseOpen,resume});
  const background=menuBackgroundMount(backdrop.querySelector('.home-pool'),()=>host.gentle?.()===true,{profile:host.profile,skin:host.skin,skinStyle:host.skinStyle,audioSettings:host.audioSettings,powerMarkings:()=>casual});
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function refresh(){background.refresh();document.body.style.setProperty('--player-skin-color',host.skin?.()||'#f1f9d7');document.body.style.setProperty('--player-skin-style',host.skinStyle?.()||'original');document.body.style.setProperty('--player-trail',cosmeticLoadout(host.profile?.()?.profile).trail);document.body.style.setProperty('--player-impact',cosmeticLoadout(host.profile?.()?.profile).bounce);const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;if(info.resume){resume.querySelector('.continue-art').src=info.resume.artwork;resume.querySelector('.continue-detail').textContent=info.resume.detail;}home.querySelector('#home-gamemodes').classList.toggle('primary',!info.resume);}
  function present(name){
    route.visit(name);
    if((name.startsWith('gamemodes:')||name.startsWith('pool-setup:'))||['drift','drift-pause','home','gamemodes','trial-setup','score-setup','experiment-hub','experiment-family','experiment-detail'].includes(name))homeMode=true;else if(['play','pause','trial'].includes(name))homeMode=false;
    document.body.dataset.screen=name;document.body.dataset.menuMode=name==='drift'?'drift':casual?'play':homeMode?'home':'play';home.hidden=name!=='home';backdrop.hidden=!homeMode&&name!=='pause';background.show(homeMode&&(!casual||name==='drift'),{ambient:homeMode});drift.show(name);
    document.querySelector('body>main').inert=name!=='play';
    if(name!=='play')host.suspend({ambient:!homeMode&&!casual});refresh();
    queueMicrotask(recoverDestination);
  }
  function recoverDestination(){
    if(document.querySelector('dialog[open]'))return;
    if(casual&&route.current!=='drift')resume();
    else if(homeMode&&!casual&&home.hidden)homeOpen();
  }
  function homeOpen(){close();casual=false;route.reset('home');present('home');home.querySelector(host.info().resume?'#home-continue':'#home-gamemodes').focus({preventScroll:true});}
  function pauseOpen(){close();const name=casual?'drift-pause':'pause';present(name);host.open(name);}
  function resume(){if(casual){close();present('drift');}else host.resume();}
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
    if(homeMode)refresh();
    // Native Close/Escape and nested dialog exits must always leave a destination.
    // Check after synchronous navigation has opened its replacement dialog.
    queueMicrotask(recoverDestination);
  },true);
  refresh();present('home');
  return {refresh,home:homeOpen,back,show:present,drift(){close();casual=true;present('drift');},pause:pauseOpen,resume,play(){close();casual=false;route.reset('play');present('play');},get current(){return route.current;}};
}
