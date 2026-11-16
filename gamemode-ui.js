import {segmentedMount} from './segmented-control.js?v=1e468d73b757e0bde736e26cea5c8fb3ffaf1b69e7e21e158fb10491f0630bac';
import { screenHeader } from './screen-header.js?v=abdd601bfd00682c8e2df56bb78bf52f54d173e7c455d7ae92bba16d48c17860';
import { buttonHTML } from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { assetURL } from './asset.js?v=637716717d2250f0d96d961614bfe2ace0e7a403d7f201f26f134e685de2062c';
import { GAMEMODE_CARDS } from './gamemode-catalogue.js?v=cd1efc7fa33273d53d46cd1e4fe5b154e594d1209be37d62c18adf92f52b3987';
import { gamemodeGalleryMount } from './gamemode-gallery.js?v=cc56a1c2b094f7f381aad60b17d67e4ee71d053e0b6865b06a8ca8ff2d8b6101';
import { scoreAttackMount } from './score-attack-ui.js?v=0e55c3f58570fa056da72ca1f89c0946ad0b080ecc48f3d3361902b0f41b0206';
import { experimentMount } from './experiment-ui.js?v=e4b7dbae942e7b2a38b4baa7100c20e174bf21e24b2ed23f8999d3d0e396e34e';
import { poolConditions } from './medal.js?v=97f2ce6ed69f5c8834ecd381128c29d366fdfc9390080f59a05049d77db5f006';
import { medalBadge, medalConditionsHTML } from './medal-ui.js?v=06712ea7606e557f4f58ab781e63550ed1e2d5ec646b691e108df5a16d62d646';

// Dialog composition and destination routing. Each child receives only the
// content slot, profile/storage access and navigation callbacks it uses.
export function gamemodeMount(host) {
  const button=(id,label,icon='arrow-left')=>buttonHTML(label,icon,{id});
  const menu=document.createElement('dialog');menu.id='gamemodes-dialog';menu.className='standard-dialog';menu.setAttribute('aria-labelledby','gamemodes-title');
  menu.innerHTML=`${screenHeader({icon:'grid',className:'dialog-heading',title:'Gamemodes',titleId:'gamemodes-title',back:button('gamemodes-back','Back')})}<div class="dialog-body tab-panel"><div class="tab-scroll mode-body"></div></div>`;
  document.body.append(menu);
  const $=id=>menu.querySelector('#'+id),content=menu.querySelector('.mode-body'),heading=$('gamemodes-title');
  const storage=localStorage,art=mode=>assetURL(`artwork/mode/${mode}.svg`);
  let tabFrame=0;
  function showMenu(){cancelAnimationFrame(tabFrame);tabFrame=requestAnimationFrame(()=>{tabFrame=0;const bar=content.querySelector(".tab-bar");content.parentElement.querySelector(":scope>.tab-bar")?.remove();if(bar)content.after(bar);navigationTabs.refresh();});if(!menu.open)menu.showModal();$('gamemodes-back').focus({preventScroll:true});}
  const gallery=gamemodeGalleryMount({content,heading,storage,screen:host.screen,kind:host.kind,show:showMenu,notebook:()=>hub.hub(),open(card){
    if(card.route==='legacy'){if(card.id==='campaign'){menu.close();host.legacy(card.id);}else poolSetup(card.id);}
    else if(card.route==='casual'){menu.close();host.drift();}
    else if(card.route==='destination')score.open();
    else if(card.route==='setup')hub.setup(card.id);
    else hub.detail(card.id);
  }});
  const score=scoreAttackMount({content,heading,storage,screen:host.screen,kind:host.kind,show:showMenu,start(budget,replace){menu.close();host.scorePlay(budget,replace);}});
  const hub=experimentMount({content,title:heading,show:showMenu,screen:host.screen,kind:host.kind,start:host.start,destination:()=>score.open(),modes:gallery.open,wiki:id=>{menu.close();host.wiki(id);}});
  const navigationTabs=segmentedMount(menu,{attribute:'data-gamemode-tab',change(next){gallery.remember();if(next==='saved')hub.hub();else gallery.open(next);return content.querySelector('.gamemode-switch');}});
  function poolSetup(mode){
    const card=GAMEMODE_CARDS.find(e=>e.id===mode),records=host.poolMedals(mode);host.screen('pool-setup:'+mode);$('gamemodes-title').textContent=card.name;
    content.innerHTML=`<div class="mode-overview"><img src="${art(mode)}" alt="" width="480" height="240"><p>${escape(card.description)}</p></div>${medalConditionsHTML(poolConditions(mode))}<p>${mode==='waves'?'Every wave has its own medal. The entire clearing shot counts; remaining shots determine your tier.':mode==='free'?'Milestones use the current pool’s score and are awarded when a shot settles. Keep playing after Gold.':'Finish three 5-Chains to earn a medal. Your final shot finishes before its result is recorded.'} Personal medals stay separate by pool seed and profile.</p>${records.length?`<details><summary>Earned Medals · ${records.length}</summary><ul>${records.map(r=>`<li>${medalBadge(r.medal)} · ${escape(r.seed)}${mode==='waves'?' · Wave '+r.wave:''}</li>`).join('')}</ul></details>`:'<p>No medals recorded yet.</p>'}<button id="pool-play" class="primary">Play ${card.name}</button>`;
    $('pool-play').onclick=()=>{menu.close();host.legacy(mode);};showMenu();
  }
  const back=()=>{gallery.remember();menu.close();host.back();};
  $('gamemodes-back').onclick=back;
  menu.addEventListener('cancel',event=>{event.preventDefault();back();});
  return {
    gallery:gallery.open,setup:hub.setup,hub:hub.hub,family:hub.family,detail:hub.detail,
    scoreSetup:score.open,poolSetup,select:hub.select,close:()=>menu.close(),
    review(id){hub.setup(id);content.querySelector('.experiment-review').open=true;}
  };
}
