import {menuSummaryRender} from './menu-summary.js?v=ae45281d84da1bab2004670a7e08413c46eec38f2c344291b3c7b345710e5910';
import {cosmeticLoadout} from './cosmetic.js?v=d1d645c2cb1e77c1ae227eac07869113efb83df2de1d21c30e530c67252d96c7';
import { menuLayoutMount } from './menu-title.js?v=d6a295f22ba1d5f501692ea03026bc236abd5445a3a3ffcf2a92e4ee0cd237be';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { buttonHTML } from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';
import { menuBackgroundMount } from './menu-background.js?v=9d60737d9e66c11794fa297c86dea9343b07924a886dbdcc0d9f5675e6ce0152';

import { driftMount } from './drift-ui.js?v=13db8163de2fcfc630cda6b8d92c04cff3e6319244cd22992752069e8a982915';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.inert=document.body.dataset.startup!==undefined&&document.body.dataset.startup!=='ready';home.setAttribute('aria-label','Main Menu');
  const button=(id,label,icon,kind='')=>buttonHTML(label,icon,{id,class:kind});
  home.innerHTML=`<div class="home-content"><div class="home-actions"><nav class="home-primary" aria-label="Main game actions"><button type="button" id="home-continue" class="primary"></button>${button('home-gamemodes','Gamemodes','grid','primary')}${button('home-tree','Skills','skill-tree')}${button('home-player','Player','player-skin')}</nav><nav class="home-secondary" aria-label="More game options">${button('home-wiki','Wiki','book')}${button('home-help','How to Play','book')}${button('home-settings','Settings','gear')}</nav></div></div>`;
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
  function refresh(){background.refresh();document.body.style.setProperty('--player-skin-color',host.skin?.()||'#f1f9d7');document.body.style.setProperty('--player-skin-style',host.skinStyle?.()||'original');document.body.style.setProperty('--player-trail',cosmeticLoadout(host.profile?.()?.profile).trail);document.body.style.setProperty('--player-impact',cosmeticLoadout(host.profile?.()?.profile).bounce);const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;if(info.resume){menuSummaryRender(resume,{...info.resume,title:'Continue'});}home.querySelector('#home-gamemodes').classList.toggle('primary',!info.resume);}
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
