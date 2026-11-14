import { screenHeader } from './screen-header.js?v=b12f4a7f643a7ebc5d8945f2671aead3040da9be729bee110404af53f14e24e0';
import { buttonHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { assetURL } from './asset.js?v=b61b263cca739098e590874441ca93d7dd0d93530d85f7f90f10bc579dc815ae';
import { GAMEMODE_CARDS } from './gamemode-catalogue.js?v=a897a1ea6f1c72b6ae9a4ea4d7c43a81daf972b4887882b8fe9c08ee768385ec';
import { gamemodeGalleryMount } from './gamemode-gallery.js?v=17ab37d86b3dc90c62b5eeec414905f9281c4696fd87f697d513900842fcba3e';
import { scoreAttackMount } from './score-attack-ui.js?v=8571191db8edff119df5078de2a9c4ece2c1cc99b366985dd5db3b2eef503954';
import { experimentMount } from './experiment-ui.js?v=16274f3b84d482e4597da5429266c09c3d01ebe133542e848522358722ff3554';
import { poolConditions } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { medalBadge, medalConditionsHTML } from './medal-ui.js?v=559905246b3697fd9cf0a993d9c71ffe30b47a0c6d6cd3943a5b235d0faa31c8';

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
