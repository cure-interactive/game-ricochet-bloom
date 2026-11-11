import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import { assetURL } from './asset.js?v=702ecbe37f35afa96b95db6e49c578f7cd2be014d782640f9bbab8bd04850404';

// Screen history belongs here; campaign progress and unlocks stay in run.js.
export function gameMenuMount(host) {
  const home=document.createElement('section');home.id='main-menu';home.setAttribute('aria-label','Main menu');
  const button=(id,label,icon,kind='')=>`<button type="button" id="${id}" class="${kind}">${iconHTML(icon)}<span>${label}</span></button>`;
  home.innerHTML=`<div class="home-art" aria-hidden="true"><img src="${assetURL('artwork/pool-512.png')}" alt=""></div><div class="home-content"><p class="home-eyebrow">A LITTLE MOMENTUM. A LITTLE MUSIC.</p><h1>ricochet<br><span>bloom</span></h1><nav class="home-primary" aria-label="Main game actions">${button('home-continue','Continue','play','primary')}${button('home-levels','Level select','grid','primary')}${button('home-tree','Skill tree','network-node-three')}</nav><p id="home-progress" class="home-progress"></p><nav class="home-secondary" aria-label="More game options">${button('home-modes','Other modes','gamepad')}${button('home-collection','Collection','music-note')}${button('home-settings','Settings','gear')}</nav><button type="button" class="home-display" data-fullscreen>${iconHTML('fullscreen-enable')}<span class="button-label">Enter full screen</span></button><p class="home-note">Pluck light. Make a song.</p></div>`;
  document.body.append(home);
  let current='home',history=[],returning=false;
  const close=()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  function refresh(){const info=host.info();const resume=home.querySelector('#home-continue');resume.hidden=!info.resume;resume.lastElementChild.textContent=info.resume||'Continue';home.querySelector('#home-levels').classList.toggle('primary',!info.resume);home.querySelector('#home-progress').textContent=info.detail;}
  function present(name){
    if(name!==current&&!returning)history.push(current);
    current=name;document.body.dataset.screen=name;home.hidden=name!=='home';
    document.querySelector('body>main').inert=name!=='play';document.querySelector('body>header').inert=name!=='play';
    if(name!=='play')host.suspend();refresh();
  }
  function homeOpen(){close();history=[];present('home');history=[];home.querySelector(host.info().resume?'#home-continue':'#home-levels').focus({preventScroll:true});}
  function back(){const target=history.pop()||'home';returning=true;close();if(target==='play')host.resume();else if(target==='home')homeOpen();else host.open(target);returning=false;}
  home.querySelector('#home-continue').onclick=()=>host.continue();
  home.querySelector('#home-levels').onclick=()=>host.open('levels');
  home.querySelector('#home-tree').onclick=()=>host.open('tree');
  home.querySelector('#home-collection').onclick=()=>host.open('collection');
  home.querySelector('#home-modes').onclick=()=>host.open('modes');
  home.querySelector('#home-settings').onclick=()=>host.open('settings');
  refresh();present('home');
  return {home:homeOpen,back,show:present,play(){close();present('play');history=[];},get current(){return current;}};
}
