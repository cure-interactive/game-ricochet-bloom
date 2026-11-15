import { menuLayoutMount } from './menu-title.js?v=3efa75c41220d77bf5f5957a3edda60671f8e4c885d78efbe3ec92c7ac84a27e';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { buttonHTML } from './ui-icon.js?v=888786437685208af4de5b05ebc18f1a101f52f9783e909022cd0ea8e19dc5a6';
import { menuBackgroundMount } from './menu-background.js?v=ecc5aa4b0f43ee95fe4b11978cc31a0a33a0d45b18224a873a2d48302e19cc90';

import { driftMount } from './drift-ui.js?v=12ebc56f67f6014dceb59e4ea177d346a40a3dc3c55c5abfeab0d9f871122538';

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
  function refresh(){background.refresh();document.body.style.setProperty('--player-skin-color',host.skin?.()||'#f1f9d7');document.body.style.setProperty('--player-skin-style',host.skinStyle?.()||'original');const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;if(info.resume){resume.querySelector('.continue-art').src=info.resume.artwork;resume.querySelector('.continue-detail').textContent=info.resume.detail;}home.querySelector('#home-gamemodes').classList.toggle('primary',!info.resume);}
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
