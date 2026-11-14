import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { buttonHTML } from './ui-icon.js?v=7e81246e997e2106001cc2f001032e68090a0c751f008678bd91820191a7979e';
import { menuBackgroundMount } from './menu-background.js?v=8e566b6618a527f80a47aaca9294f1e7dc8576c495214d69d3fa2afcb03a3c9c';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.setAttribute('aria-label','Main Menu');
  const button=(id,label,icon,kind='')=>buttonHTML(label,icon,{id,class:kind});
  home.innerHTML=`<div class="home-content"><h1>Ricochet<br><span>Bloom</span></h1><div class="home-actions"><nav class="home-primary" aria-label="Main game actions"><button type="button" id="home-continue" class="primary"><img class="continue-art" width="48" height="48" alt=""><span class="continue-copy"><span>Continue</span><small class="continue-detail"></small></span></button>${button('home-gamemodes','Gamemodes','grid','primary')}${button('home-tree','Skill Tree','skill-tree')}<button type="button" id="home-skins"><span class="skin-preview home-skin" aria-hidden="true"><i></i></span><span>Player Skins</span></button></nav><nav class="home-secondary" aria-label="More game options">${button('home-wiki','Wiki','book')}${button('home-help','How to Play','book')}${button('home-settings','Settings','gear')}</nav></div></div>`;
  const backdrop=document.createElement('div');backdrop.id='menu-background';backdrop.setAttribute('aria-hidden','true');
  backdrop.innerHTML='<canvas class="home-pool"></canvas>';
  document.body.append(backdrop,home);
  const background=menuBackgroundMount(backdrop.querySelector('.home-pool'),()=>host.gentle?.()===true);
  const route=pageHistory('home');let homeMode=true;
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function refresh(){home.querySelector('.home-skin').style.setProperty('--skin-color',host.skin?.()||'#f1f9d7');const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;if(info.resume){resume.querySelector('.continue-art').src=info.resume.artwork;resume.querySelector('.continue-detail').textContent=info.resume.detail;}home.querySelector('#home-gamemodes').classList.toggle('primary',!info.resume);}
  function present(name){
    route.visit(name);
    if((name.startsWith('gamemodes:')||name.startsWith('pool-setup:'))||['home','gamemodes','trial-setup','score-setup','experiment-hub','experiment-family','experiment-detail'].includes(name))homeMode=true;else if(['play','pause','trial'].includes(name))homeMode=false;
    document.body.dataset.screen=name;document.body.dataset.menuMode=homeMode?'home':'play';home.hidden=name!=='home';backdrop.hidden=!homeMode;background.show(homeMode);
    document.querySelector('body>main').inert=name!=='play';
    if(name!=='play')host.suspend();refresh();
  }
  function homeOpen(){close();route.reset('home');present('home');home.querySelector(host.info().resume?'#home-continue':'#home-gamemodes').focus({preventScroll:true});}
  function back(){const target=route.back();if(target===null)return;close();if(target==='play')host.resume();else if(target==='home')homeOpen();else {present(target);host.open(target);}}
  home.querySelector('#home-continue').onclick=()=>host.continue();
  home.querySelector('#home-gamemodes').onclick=()=>host.open('gamemodes');
  home.querySelector('#home-tree').onclick=()=>host.open('tree');
  home.querySelector('#home-skins').onclick=()=>host.open('skins');
  home.querySelector('#home-wiki').onclick=()=>host.open('wiki');
  home.querySelector('#home-help').onclick=()=>host.open('help');
  home.querySelector('#home-settings').onclick=()=>host.open('settings');
  // Settings can switch profiles without a page-history transition.
  document.addEventListener('close',()=>{if(homeMode)refresh();},true);
  refresh();present('home');
  return {home:homeOpen,back,show:present,pause(){close();present('pause');host.open('pause');},play(){close();route.reset('play');present('play');},get current(){return route.current;}};
}
