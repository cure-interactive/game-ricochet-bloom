import { screenHeader } from './screen-header.js?v=15bce8133223b9e41fb2955f06dcf847cc767d4f64307c602442b86117ae056e';
import { buttonHTML } from './ui-icon.js?v=8551bed13f7a48d36a919c6b5d9290c16f3a19271f3ead8585eb9fdb1abdae6b';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { assetURL } from './asset.js?v=743039c3405a2515f971f201afe1964500b749ddd36b5142733c78e2ae16bc29';
import { GAMEMODE_CARDS } from './gamemode-catalogue.js?v=b344691fc75411842a164cf17bcdd85c1b6c5864ccff7d6a65b8560e1bcd9144';
import { gamemodeGalleryMount } from './gamemode-gallery.js?v=ee17a1d5f6d16c0d7032f17d63f1f6e0376789cbde8fd270106d09be25006f37';
import { scoreAttackMount } from './score-attack-ui.js?v=e2362727a2fa794fb115d28197fed94e0b227b6b2e0bbcc5ac750efa8b004b95';
import { experimentMount } from './experiment-ui.js?v=01f78410e9df688f02bd4904d7bc384656719cf75a7aa3c28edc4cb4cf21c690';
import { poolConditions } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { medalBadge, medalConditionsHTML } from './medal-ui.js?v=9792b2d8e2643e06247bd19cd073ef092a6535778d01d4ac3dae8a72dae97539';

// Dialog composition and destination routing. Each child receives only the
// content slot, profile/storage access and navigation callbacks it uses.
export function gamemodeMount(host) {
  const button=(id,label,icon='arrow-left')=>buttonHTML(label,icon,{id});
  const menu=document.createElement('dialog');menu.id='gamemodes-dialog';menu.className='standard-dialog';menu.setAttribute('aria-labelledby','gamemodes-title');
  menu.innerHTML=`${screenHeader({icon:'grid',className:'dialog-heading',title:'Gamemodes',titleId:'gamemodes-title',back:button('gamemodes-back','Back')})}<div class="dialog-body mode-body"></div>`;
  document.body.append(menu);
  const $=id=>menu.querySelector('#'+id),content=menu.querySelector('.mode-body'),heading=$('gamemodes-title');
  const storage=localStorage,art=mode=>assetURL(`artwork/mode/${mode}.svg`);
  function showMenu(){if(!menu.open)menu.showModal();$('gamemodes-back').focus({preventScroll:true});}
  const gallery=gamemodeGalleryMount({content,heading,storage,screen:host.screen,kind:host.kind,show:showMenu,notebook:()=>hub.hub(),open(card){
    if(card.route==='legacy'){if(card.id==='campaign'){menu.close();host.legacy(card.id);}else poolSetup(card.id);}
    else if(card.route==='casual'){menu.close();host.drift();}
    else if(card.route==='destination')score.open();
    else if(card.route==='setup')hub.setup(card.id);
    else hub.detail(card.id);
  }});
  const score=scoreAttackMount({content,heading,storage,screen:host.screen,kind:host.kind,show:showMenu,start(budget,replace){menu.close();host.scorePlay(budget,replace);}});
  const hub=experimentMount({content,title:heading,show:showMenu,screen:host.screen,kind:host.kind,start:host.start,destination:()=>score.open(),modes:gallery.open,wiki:id=>{menu.close();host.wiki(id);}});
  function poolSetup(mode){
    const card=GAMEMODE_CARDS.find(e=>e.id===mode),records=host.poolMedals(mode);host.screen('pool-setup:'+mode);$('gamemodes-title').textContent=card.name;
    content.innerHTML=`<div class="mode-overview"><img src="${art(mode)}" alt="" width="480" height="240"><p>${escape(card.description)}</p></div>${medalConditionsHTML(poolConditions(mode))}<p>${mode==='waves'?'Every wave has its own medal. The entire clearing shot counts; remaining shots determine your tier.':mode==='free'?'Milestones use the current pool’s score and are awarded when a shot settles. Keep playing after Gold.':'Finish three blooms to earn a medal. Your final shot finishes before its result is recorded.'} Personal medals stay separate by pool seed and profile.</p>${records.length?`<details><summary>Earned Medals · ${records.length}</summary><ul>${records.map(r=>`<li>${medalBadge(r.medal)} · ${escape(r.seed)}${mode==='waves'?' · Wave '+r.wave:''}</li>`).join('')}</ul></details>`:'<p>No medals recorded yet.</p>'}<button id="pool-play" class="primary">Play ${card.name}</button>`;
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
