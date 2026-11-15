import { GAME_VERSION } from './version.js?v=76a3c04e5b6757eb77fd221e89bfc35b11ae5680ecefe0bf272abd044152f5c8';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { buttonHTML } from './ui-icon.js?v=b05618f62d88c1057558c943cbcf7d2565de3287bf77909ca25275b9b5cb8cbf';
import { menuBackgroundMount } from './menu-background.js?v=38ab6f1b8880f0cb3f25923f05724640ccd5c04e3dae63f5662983d19886d732';

import { driftMount } from './drift-ui.js?v=dbc645da13fb8d04b6b7d8e9bcd080fc66b50433a9624d6b8423a791196a15dc';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.inert=document.body.dataset.startup!==undefined&&document.body.dataset.startup!=='ready';home.setAttribute('aria-label','Main Menu');
  const button=(id,label,icon,kind='')=>buttonHTML(label,icon,{id,class:kind});
  home.innerHTML=`<div class="home-content"><h1>Ricochet<br><span>Bloom</span><small class="home-version" aria-label="Version ${GAME_VERSION}">v${GAME_VERSION}</small></h1><div class="home-actions"><nav class="home-primary" aria-label="Main game actions"><button type="button" id="home-continue" class="primary"><img class="continue-art" width="48" height="48" alt=""><span class="continue-copy"><span>Continue</span><small class="continue-detail"></small></span></button>${button('home-gamemodes','Gamemodes','grid','primary')}${button('home-tree','Skills','skill-tree')}${button('home-player','Player','player-skin')}</nav><nav class="home-secondary" aria-label="More game options">${button('home-wiki','Wiki','book')}${button('home-help','How to Play','book')}${button('home-settings','Settings','gear')}</nav></div></div>`;
  const backdrop=document.createElement('div');backdrop.id='menu-background';backdrop.setAttribute('aria-hidden','true');
  backdrop.innerHTML='<canvas class="home-pool"></canvas>';
  document.body.append(backdrop,home);
  if(host.recoveryNotice)home.querySelector('.home-actions').prepend(host.recoveryNotice);
  const route=pageHistory('home');let homeMode=true;
  const drift=driftMount({pause:()=>present('drift-pause'),resume:()=>present('drift'),modes:()=>{close();host.open('gamemodes');},home:()=>homeOpen()});
  const background=menuBackgroundMount(backdrop.querySelector('.home-pool'),()=>host.gentle?.()===true,{profile:host.profile,skin:host.skin,audioSettings:host.audioSettings,powerMarkings:()=>route.current==='drift'||route.current==='drift-pause'});
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function refresh(){background.refresh();document.body.style.setProperty('--player-skin-color',host.skin?.()||'#f1f9d7');const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;if(info.resume){resume.querySelector('.continue-art').src=info.resume.artwork;resume.querySelector('.continue-detail').textContent=info.resume.detail;}home.querySelector('#home-gamemodes').classList.toggle('primary',!info.resume);}
  function present(name){
    route.visit(name);
    if((name.startsWith('gamemodes:')||name.startsWith('pool-setup:'))||['drift','drift-pause','home','gamemodes','trial-setup','score-setup','experiment-hub','experiment-family','experiment-detail'].includes(name))homeMode=true;else if(['play','pause','trial'].includes(name))homeMode=false;
    document.body.dataset.screen=name;document.body.dataset.menuMode=name==='drift'||name==='drift-pause'?'drift':homeMode?'home':'play';home.hidden=name!=='home';backdrop.hidden=!homeMode;background.show(homeMode&&name!=='drift-pause');drift.show(name);
    document.querySelector('body>main').inert=name!=='play';
    if(name!=='play')host.suspend();refresh();
  }
  function homeOpen(){close();route.reset('home');present('home');home.querySelector(host.info().resume?'#home-continue':'#home-gamemodes').focus({preventScroll:true});}
  function back(){const target=route.back();if(target===null)return;close();if(target==='play')host.resume();else if(target==='home')homeOpen();else {present(target);host.open(target);}}
  home.querySelector('#home-continue').onclick=()=>host.continue();
  home.querySelector('#home-gamemodes').onclick=()=>host.open('gamemodes');
  home.querySelector('#home-tree').onclick=()=>host.open('tree');
  home.querySelector('#home-player').onclick=()=>host.open('player');
  home.querySelector('#home-wiki').onclick=()=>host.open('wiki');
  home.querySelector('#home-help').onclick=()=>host.open('help');
  home.querySelector('#home-settings').onclick=()=>host.open('settings');
  // Settings can switch profiles without a page-history transition.
  document.addEventListener('close',()=>{if(homeMode)refresh();},true);
  refresh();present('home');
  return {home:homeOpen,back,show:present,drift(){close();present('drift');},pause(){close();present('pause');host.open('pause');},play(){close();route.reset('play');present('play');},get current(){return route.current;}};
}
