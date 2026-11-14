import { screenHeader } from './screen-header.js?v=77da565ebb121a35c6d59cc8cacc807a866e5fdd0ed619af73057cb6a4b80823';
import { buttonHTML } from './ui-icon.js?v=7e81246e997e2106001cc2f001032e68090a0c751f008678bd91820191a7979e';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { assetURL } from './asset.js?v=3cbfab492cc37c59b11a7e7ee1809773bc384873f2e900d7d5fa6526e0af4b91';
import { GAMEMODE_CARDS } from './gamemode-catalogue.js?v=57c00b5506f930fad7fb871e24aa2973cb86991447a43451a760cf7dadcc7ae1';
import { gamemodeGalleryMount } from './gamemode-gallery.js?v=02619c314343a5618a910217f8fb8668a4ff53a6a7c9476c9c6b918eb35866e2';
import { scoreAttackMount } from './score-attack-ui.js?v=b1b0352dfb22ffe80df2f151b2feeb0fceb4c00a097d4ba7d08607bfaf5893a3';
import { experimentMount } from './experiment-ui.js?v=626a98e142578f6843fa97762fa9b9b7d0d088921c19101768a1af63fc8791a7';
import { poolConditions } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { medalBadge, medalConditionsHTML } from './medal-ui.js?v=4fccbcfa467ab558a8cfba26398ff7d1b89d650b0664c6af2ba633490cf7ad0c';

// Dialog composition and destination routing. Each child receives only the
// content slot, profile/storage access and navigation callbacks it uses.
export function gamemodeMount(host) {
  const button=(id,label,icon='arrow-left')=>buttonHTML(label,icon,{id});
  const menu=document.createElement('dialog');menu.id='gamemodes-dialog';menu.className='standard-dialog';menu.setAttribute('aria-labelledby','gamemodes-title');
  menu.innerHTML=`${screenHeader({className:'dialog-heading',title:'Gamemodes',titleId:'gamemodes-title',back:button('gamemodes-back','Back')})}<div class="dialog-body mode-body"></div>`;
  document.body.append(menu);
  const $=id=>menu.querySelector('#'+id),content=menu.querySelector('.mode-body'),heading=$('gamemodes-title');
  const storage=localStorage,art=mode=>assetURL(`artwork/mode/${mode}.svg`);
  function showMenu(){if(!menu.open)menu.showModal();$('gamemodes-back').focus({preventScroll:true});}
  const gallery=gamemodeGalleryMount({content,heading,storage,screen:host.screen,kind:host.kind,show:showMenu,notebook:()=>hub.hub(),open(card){
    if(card.route==='legacy'){if(card.id==='campaign'){menu.close();host.legacy(card.id);}else poolSetup(card.id);}
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
