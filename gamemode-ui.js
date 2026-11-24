import {gamemodeNavigation} from './gamemode-navigation.js?v=dd1cece1eaffa2e64e60a1a96f5c83c90f7350e0ed582187d54423a7c3d2cb9e';
import {segmentedBarMount} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import { screenHeader } from './screen-header.js?v=22cdd7237f9886a35b4827c06a0cedde129e69b71b571ae67171c7586a9f32c9';
import { buttonHTML } from './ui-icon.js?v=982f9454c09cc864e801fe77c736c293672bd5de6e1347de5acff33ca4492647';
import { escapeHTML as escape } from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
import { assetURL } from './asset.js?v=637716717d2250f0d96d961614bfe2ace0e7a403d7f201f26f134e685de2062c';
import { GAMEMODE_CARDS } from './gamemode-catalogue.js?v=4a77aef872946701ceb303f36baf9bdb3a5ee3c85b0df90fc3879ab94ffceff8';
import { gamemodeGalleryMount } from './gamemode-gallery.js?v=526527c5f262a856024ca7c8c00dc36e3e246207aa78fd621fc21c8391727f91';
import { scoreAttackMount } from './score-attack-ui.js?v=168f446cb008181b33210a0ee529d3e1935e845fbeff14b82207e19c5b7b3b42';
import { experimentMount } from './experiment-ui.js?v=ee9446cc67fdf218f0a7a9c34bb881277032e7e50def2709447a11c5f3ae4999';
import { poolConditions } from './medal.js?v=97f2ce6ed69f5c8834ecd381128c29d366fdfc9390080f59a05049d77db5f006';
import { medalBadge, medalConditionsHTML } from './medal-ui.js?v=6df228e6d2895828fc52e3634bd7cb5b98bc58ddf86a48515c6d0a1527524ed2';

// Dialog composition and destination routing. Each child receives only the
// content slot, profile/storage access and navigation callbacks it uses.
export function gamemodeMount(host) {
  const button=(id,label,icon='arrow-left')=>buttonHTML(label,icon,{id});
  const menu=document.createElement('dialog');menu.id='gamemodes-dialog';menu.className='standard-dialog';menu.setAttribute('aria-labelledby','gamemodes-title');
  menu.innerHTML=`${screenHeader({icon:'grid',className:'dialog-heading',title:'Gamemodes',titleId:'gamemodes-title',back:button('gamemodes-back','Back')})}<div class="dialog-body tab-panel"><div class="tab-scroll mode-body"></div></div>`;
  document.body.append(menu);
  const $=id=>menu.querySelector('#'+id),content=menu.querySelector('.mode-body'),heading=$('gamemodes-title');
  const storage=localStorage,art=mode=>assetURL(`artwork/mode/${mode}.svg`);
  function showMenu({tab=null,favorites=false}={}){
    navigationTabs.bar.hidden=tab===null;
    if(tab!==null){navigationTabs.nav.querySelector('[data-gamemode-tab="favourites"]').hidden=!favorites;navigationTabs.show(content.parentElement,tab);}
    if(!menu.open)menu.showModal();navigationTabs.refresh();$('gamemodes-back').focus({preventScroll:true});
  }
  const gallery=gamemodeGalleryMount({content,heading,storage,screen:host.screen,kind:host.kind,show:showMenu,refreshTabs(hasFavorites){navigationTabs.nav.querySelector('[data-gamemode-tab="favourites"]').hidden=!hasFavorites;navigationTabs.refresh();},notebook:()=>hub.hub(),open(card){
    if(card.route==='legacy'){if(card.id==='campaign'){menu.close();host.legacy(card.id);}else poolSetup(card.id);}
    else if(card.route==='casual'){menu.close();host.drift();}
    else if(card.route==='destination')score.open();
    else if(card.route==='setup')hub.setup(card.id);
    else hub.detail(card.id);
  }});
  const score=scoreAttackMount({content,heading,storage,screen:host.screen,kind:host.kind,show:showMenu,start(budget,replace){menu.close();host.scorePlay(budget,replace);}});
  const hub=experimentMount({content,title:heading,show:showMenu,screen:host.screen,kind:host.kind,start:host.start,destination:()=>score.open(),modes:gallery.open,wiki:id=>{menu.close();host.wiki(id);}});
  const navigationTabs=segmentedBarMount(document,gamemodeNavigation('',true),{attribute:'data-gamemode-tab',change(next){gallery.remember();if(next==='saved')hub.hub();else gallery.open(next);}});
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
