import { screenHeader } from './screen-header.js?v=b0d0290acde6740ba753e57b09f4a348cb46e78967253fc0bddd3ef9d9ea5ab0';
import { buttonHTML } from './ui-icon.js?v=888786437685208af4de5b05ebc18f1a101f52f9783e909022cd0ea8e19dc5a6';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { assetURL } from './asset.js?v=cb684ea278b2dc6b1457e951b71d22eea4538d738b252e9abd7f743632acdfd4';
import { GAMEMODE_CARDS } from './gamemode-catalogue.js?v=2f2b5dfa3eb51ce572f69a015074d1231711d1f687ad7f6a3ba2b6d82b2f444e';
import { gamemodeGalleryMount } from './gamemode-gallery.js?v=563dc128f053d01d126529cf3abb8d139f4a0cc0b6b99ce3755dd9e4eac0b71d';
import { scoreAttackMount } from './score-attack-ui.js?v=7e8f67c1889056cd723039ca14c364ae253c90f13a707821a8f9e3f0aba33d64';
import { experimentMount } from './experiment-ui.js?v=860f3392e88e6b65c55c6dfdb89b1b9da6da9a600132135238d2a04eeeafcf01';
import { poolConditions } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { medalBadge, medalConditionsHTML } from './medal-ui.js?v=32365a20c578d3041ee46927bf0fbb1d7cae05b81eac19d73650d171b0df73c1';

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
