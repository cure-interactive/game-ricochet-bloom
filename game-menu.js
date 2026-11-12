import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import { menuBackgroundMount } from './menu-background.js?v=24819272e4348789e59ebca22d1fb4e9f26e9862f3608abb740fc08a4890ee2f';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.setAttribute('aria-label','Main menu');
  const button=(id,label,icon,kind='')=>`<button type="button" id="${id}" class="${kind}">${iconHTML(icon)}<span>${label}</span></button>`;
  home.innerHTML=`<canvas class="home-pool" aria-hidden="true"></canvas><div class="home-content"><h1>Ricochet<br><span>Bloom</span></h1><nav class="home-primary" aria-label="Main game actions">${button('home-continue','Continue','play','primary')}${button('home-levels','Campaign','campaign','primary')}${button('home-free','Free Play','play')}${button('home-tree','Skill tree','skill-tree')}${button('home-skins','Player skins','player-skin')}</nav><nav class="home-secondary" aria-label="More game options">${button('home-help','How to play','book')}${button('home-settings','Settings','gear')}</nav></div>`;
  document.body.append(home);
  const background=menuBackgroundMount(home.querySelector('.home-pool'),()=>host.gentle?.()===true);
  let current='home',history=[],returning=false,homeMode=true;
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function refresh(){const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;resume.lastElementChild.textContent=info.resume||'Continue';home.querySelector('#home-levels').classList.toggle('primary',!info.resume);}
  function present(name){
    if(name!==current&&!returning)history.push(current);
    if(name==='home')homeMode=true;else if(name==='play'||name==='pause')homeMode=false;
    current=name;document.body.dataset.screen=name;document.body.dataset.menuMode=homeMode?'home':'play';home.hidden=name!=='home';background.show(name==='home');
    document.querySelector('body>main').inert=name!=='play';document.querySelector('body>header').inert=name!=='play';
    if(name!=='play')host.suspend();refresh();
  }
  function homeOpen(){close();history=[];present('home');history=[];home.querySelector(host.info().resume?'#home-continue':'#home-levels').focus({preventScroll:true});}
  function back(){const target=history.pop()||'home';returning=true;close();if(target==='play')host.resume();else if(target==='home')homeOpen();else {present(target);host.open(target);}returning=false;}
  home.querySelector('#home-continue').onclick=()=>host.continue();
  home.querySelector('#home-levels').onclick=()=>host.open('levels');
  home.querySelector('#home-tree').onclick=()=>host.open('tree');
  home.querySelector('#home-skins').onclick=()=>host.open('skins');
  home.querySelector('#home-free').onclick=()=>host.freePlay();
  home.querySelector('#home-help').onclick=()=>host.open('help');
  home.querySelector('#home-settings').onclick=()=>host.open('settings');
  home.addEventListener('click',event=>{if(event.detail&& !event.target.closest('button,a,input,select,textarea,label,summary'))background.tap(event.clientX,event.clientY);});
  refresh();present('home');
  return {home:homeOpen,back,show:present,pause(){close();present('pause');host.open('pause');},play(){close();present('play');history=[];},get current(){return current;}};
}
