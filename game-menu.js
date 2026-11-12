import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import { menuBackgroundMount } from './menu-background.js?v=8ea0bd20341b3a917ee2fc03d4200b08b4dd10589978ebce138856e075e53991';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.setAttribute('aria-label','Main Menu');
  const button=(id,label,icon,kind='')=>`<button type="button" id="${id}" class="${kind}">${iconHTML(icon)}<span>${label}</span></button>`;
  home.innerHTML=`<canvas class="home-pool" aria-hidden="true"></canvas><div class="home-content"><h1>Ricochet<br><span>Bloom</span></h1><div class="home-actions"><nav class="home-primary" aria-label="Main game actions"><button type="button" id="home-continue" class="primary"><img class="continue-art" width="48" height="48" alt=""><span class="continue-copy"><span>Continue</span><small class="continue-detail"></small></span></button>${button('home-levels','Campaign','campaign','primary')}${button('home-free','Free Play','play')}${button('home-tree','Skill Tree','skill-tree')}${button('home-skins','Player Skins','player-skin')}</nav><nav class="home-secondary" aria-label="More game options">${button('home-wiki','Wiki','book')}${button('home-help','How to Play','book')}${button('home-settings','Settings','gear')}</nav></div></div>`;
  document.body.append(home);
  const background=menuBackgroundMount(home.querySelector('.home-pool'),()=>host.gentle?.()===true);
  let current='home',history=[],returning=false,homeMode=true;
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function refresh(){const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;if(info.resume){resume.querySelector('.continue-art').src=info.resume.artwork;resume.querySelector('.continue-detail').textContent=info.resume.detail;}home.querySelector('#home-levels').classList.toggle('primary',!info.resume);}
  function present(name){
    if(name!==current&&!returning)history.push(current);
    if(name==='home')homeMode=true;else if(name==='play'||name==='pause')homeMode=false;
    current=name;document.body.dataset.screen=name;document.body.dataset.menuMode=homeMode?'home':'play';home.hidden=name!=='home';background.show(name==='home');
    document.querySelector('body>main').inert=name!=='play';
    if(name!=='play')host.suspend();refresh();
  }
  function homeOpen(){close();history=[];present('home');history=[];home.querySelector(host.info().resume?'#home-continue':'#home-levels').focus({preventScroll:true});}
  function back(){const target=history.pop()||'home';returning=true;close();if(target==='play')host.resume();else if(target==='home')homeOpen();else {present(target);host.open(target);}returning=false;}
  home.querySelector('#home-continue').onclick=()=>host.continue();
  home.querySelector('#home-levels').onclick=()=>host.open('levels');
  home.querySelector('#home-tree').onclick=()=>host.open('tree');
  home.querySelector('#home-skins').onclick=()=>host.open('skins');
  home.querySelector('#home-free').onclick=()=>host.freePlay();
  home.querySelector('#home-wiki').onclick=()=>host.open('wiki');
  home.querySelector('#home-help').onclick=()=>host.open('help');
  home.querySelector('#home-settings').onclick=()=>host.open('settings');
  home.addEventListener('click',event=>{if(event.detail&& !event.target.closest('button,a,input,select,textarea,label,summary'))background.tap(event.clientX,event.clientY);});
  refresh();present('home');
  return {home:homeOpen,back,show:present,pause(){close();present('pause');host.open('pause');},play(){close();present('play');history=[];},get current(){return current;}};
}
