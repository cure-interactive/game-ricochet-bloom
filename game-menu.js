import {menuSummaryRender} from './menu-summary.js?v=88be0a3d0eefb7d6ff84518fc4e186dec329935a2399efe6f97308f69ae578e1';
import {cosmeticLoadout} from './cosmetic.js?v=61a0093e32ea698e1cd5c0a834a10234875ae75bb6ff4247be147a3b78edee0b';
import { menuLayoutMount } from './menu-title.js?v=fed2973e187cd11eaefa230f91208410025525423e478089d957ed35f42c8369';
import { pageHistory } from './page-history.js?v=54c1c0aaacb43da66e5503f9ea5ea7948dfd1efd2ededbc6b416434a1792e935';
import { buttonHTML } from './ui-icon.js?v=c034fd245b2540631902989670ffc7b2e11942d4f3456fce74a63c3ecaf6710f';
import { menuBackgroundMount } from './menu-background.js?v=aff86fd647ec7bd0e2107532d43dfd59ef0e312d020194c8a29df25b4e927fd3';

import { driftMount } from './drift-ui.js?v=ee3716ba1e8ad6aa7801616b2416e5c897894126a44b3a489ad6ee0711836e1a';

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
  function restore(pages,play){
    const allowed=name=>['home','play','pause','drift','drift-pause','gamemodes','score-setup','trial-setup','experiment-family','experiment-detail','experiment-hub','levels','player','stats','trails','bounce-effects','music-themes','tree','skins','player-upgrades','wiki','help','settings'].includes(name)||/^gamemodes:/.test(name)||/^pool-setup:(free|waves|challenge)$/.test(name);
    const path=pages.filter(allowed);if(!path.length)return;
    let target=path.at(-1);close();
    if(path.includes('play')||path.includes('pause')){if(host.restorePlay){if(host.restorePlay(play)===false){homeOpen();return;}}else host.continue();pauseOpen();}
    if(target==='play')target='pause';
    if(target==='drift'||target==='drift-pause'){casual=true;target='drift-pause';}
    if(target==='home')homeOpen();else{present(target);host.open(target);}
    route.restore([...path.slice(0,-1),route.current]);
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
    if(homeMode)refresh();
    // Native Close/Escape and nested dialog exits must always leave a destination.
    // Check after synchronous navigation has opened its replacement dialog.
    queueMicrotask(recoverDestination);
  },true);
  refresh();present('home');
  return {restore,get playIdentity(){return host.playIdentity?.();},get snapshot(){return route.snapshot;},refresh,home:homeOpen,back,show:present,get musicAudio(){return background.audio;},drift(){close();casual=true;present('drift');},pause:pauseOpen,resume,play(){close();casual=false;route.reset('play');present('play');},get current(){return route.current;}};
}
