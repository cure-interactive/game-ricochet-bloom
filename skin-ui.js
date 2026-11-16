import {cosmeticPriceHTML} from './cosmetic-price.js?v=9a0d945c37ceec5a2b10b4895eb976d64b35aa18bd76a070f26a9e457d59dc97';
import {COSMETICS,cosmeticLoadout,cosmeticOwned} from './cosmetic.js?v=d1d645c2cb1e77c1ae227eac07869113efb83df2de1d21c30e530c67252d96c7';
import {rarityIconHTML} from './skill-icon.js?v=30e163fa7cf9ecff14317a409c1038691cee610af060f411d678d628dacc7f96';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=18ffd23993b6d5cca1ef07433534c7facb9f35b6108875ac98d28c6d420fb096';
import { screenHeader } from './screen-header.js?v=786f504b0d8e7c345d1c30428db16e12dc5b1c2513f004bec1c0c4c0b2618c9a';
import { TRACKS } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { completedTracks, unlockedTracks } from './run.js?v=4eb96a8e4a7db4025b4fc665f3148c7d62147766620e7e1abd0c8ea3507f6b3c';
import { iconHTML, staticIconHTML } from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';

import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';

const skins=[{id:'original',name:'Original',color:'#f1f9d7'},...TRACKS];
export function skinOptions(state,showHidden=false){
  const unlocked=new Set(['original',...completedTracks(state)]),visible=new Set(['original',...unlockedTracks(state).map(t=>t.id)]);
  const chosen=cosmeticLoadout(state.profile).skin;
  return [...skins.filter(skin=>showHidden||visible.has(skin.id)).map(skin=>({...skin,style:'original',rarity:'common',owned:unlocked.has(skin.id),equipped:chosen==='campaign'&&state.skin===skin.id})),...COSMETICS.filter(s=>s.kind==='skin').map(s=>({...s,owned:cosmeticOwned(state.profile,s),equipped:chosen===s.id}))];
}
export function skinSelection(state,id,enabled){
  const skin=skinOptions(state).find(s=>s.id===id);
  if(!skin||typeof enabled!=='boolean')return null;
  if(skin.kind==='skin')return enabled?{type:skin.owned?'equip-cosmetic':'buy-cosmetic',id:skin.id}:{type:'skin',skin:'original'};
  if(!skin.owned)return null;
  return {type:'skin',skin:enabled?id:'original'};
}
export function skinMount(controller){
  const optionsName=id=>skinOptions(controller.get(),true).find(s=>s.id===id)?.name||'Skin';
  let selected=null,libraryScroll=0,preview=null;
  const dialog=document.createElement('dialog');dialog.id='skin-dialog';dialog.setAttribute('aria-labelledby','skin-title');
  dialog.innerHTML=`${screenHeader({icon:'player-skin',className:'skin-heading',title:'Player Skins',titleId:'skin-title',back:`<button type="button" data-skin-back>${iconHTML('arrow-left')}<span>Back</span></button>`})}<div class="skin-scroll"><section class="skin-library"><p class="skin-intro">Choose a look from Common to Mythic with Points, or earn skins by completing campaign tracks.</p><div class="skin-grid"></div></section><section class="skin-detail" hidden></section><p class="skin-status" role="status"></p></div>`;
  document.body.append(dialog);
  const scroll=dialog.querySelector('.skin-scroll'),detail=dialog.querySelector('.skin-detail'),status=dialog.querySelector('.skin-status'),back=dialog.querySelector('[data-skin-back]');
  function render(){
    preview?.destroy();preview=null;
    const options=skinOptions(controller.get(),controller.showHiddenContent?.()),skin=options.find(s=>s.id===selected);
    if(selected&&!skin)selected=null;
    // The title previews this selection without equipping it or recreating its
    // live bubble; the library title returns to the currently equipped skin.
    const titleSkin=skin||options.find(s=>s.equipped),titleIcon=dialog.querySelector('.screen-heading-title .ui-icon');
    titleIcon.style.setProperty('--skin-color',titleSkin?.color||'#f1f9d7');titleIcon.style.setProperty('--skin-style',titleSkin?.style||'original');
    dialog.querySelector('.skin-grid').innerHTML=options.map(skin=>`<button type="button" class="skin-choice ${skin.equipped?'is-equipped':''} ${skin.owned?'':'is-locked'}" data-player-skin="${skin.id}" style="--skin-color:${skin.color};--skin-style:${skin.style}" aria-label="View ${skin.name}, ${skin.equipped?'Equipped':skin.owned?'Unlocked':'Locked'}"><span class="skin-preview" aria-hidden="true"><i><player-bubble></player-bubble></i></span><strong>${skin.name}</strong><span class="cosmetic-rarity">${rarityIconHTML(skin.rarity)}${RARITIES[skin.rarity].name}</span><span class="skin-choice-state">${iconHTML(skin.equipped?'check':skin.owned?'lock-open':'lock')}${skin.equipped?'Equipped':skin.owned?'Unlocked':skin.kind==='skin'?skin.cost+' Points':'Campaign reward'}</span>${cosmeticPriceHTML(skin,skin.owned,controller.showPurchasedCosts?.())}</button>`).join('');
    dialog.querySelector('.skin-library').hidden=!!skin;detail.hidden=!skin;scroll.classList.toggle('is-detail',!!skin);
    dialog.querySelector('#skin-title').textContent=skin?skin.name:'Player Skins';back.setAttribute('aria-label',skin?'Back to Player Skins':'Back');
    if(!skin){detail.replaceChildren();return;}
    detail.style.setProperty('--skin-color',skin.color);detail.style.setProperty('--skin-style',skin.style);
    const points=controller.get().profile.wallet.seeds,canBuy=skin.kind==='skin'&&points>=skin.cost;
    detail.innerHTML=`${skinPreviewHTML(skin.name)}<section class="skin-selection ${skin.equipped?'is-equipped':''}" aria-label="${escapeHTML(skin.name)} skin"><div class="skin-selection-title">${iconHTML(skin.equipped?'check':skin.owned?'lock-open':'lock')}<div><small class="cosmetic-rarity">${rarityIconHTML(skin.rarity)}${RARITIES[skin.rarity].name} · Player Skin</small><h3>${escapeHTML(skin.name)}</h3></div></div><p class="skin-unlock">${skin.kind==='skin'?escapeHTML(skin.description):!skin.owned?'Complete '+escapeHTML(skin.name)+' to unlock this skin.':skin.id==='original'?'Your original glow.':skin.equipped?'Your player is wearing this skin.':'Unlocked by completing '+escapeHTML(skin.name)+'.'}</p>${cosmeticPriceHTML(skin,skin.owned,controller.showPurchasedCosts?.())}<button type="button" id="skin-use" class="skin-equip ${skin.equipped?'is-equipped':''}" ${(!skin.owned&&!canBuy)||skin.equipped?'disabled':''}>${staticIconHTML(skin.equipped?'check':skin.owned?'player-skin':'lock')}<span>${skin.equipped?'Equipped':skin.owned?'Equip Skin':skin.kind==='skin'?'Unlock &amp; Equip · '+skin.cost+' Points':'Campaign reward'}</span>${cosmeticPriceHTML(skin,skin.owned,controller.showPurchasedCosts?.())}</button>${skin.kind==='skin'&&!skin.owned?`<p class="cosmetic-wallet">${iconHTML('coin')}${points} Points${!skin.owned&&!canBuy?` · ${skin.cost-points} more needed`:""}</p>`:""}</section>`;
    preview=skinPreviewMount(detail.querySelector('.skin-preview-large'),{gentle:controller.gentle});
  }
  dialog.addEventListener('close',()=>{if(!dialog.open){preview?.destroy();preview=null;}});
  function goBack(){
    if(selected){const id=selected;selected=null;render();status.textContent='';scroll.scrollTop=libraryScroll;dialog.querySelector(`[data-player-skin="${id}"]`)?.focus({preventScroll:true});}
    else controller.back();
  }
  back.onclick=goBack;
  dialog.addEventListener('cancel',event=>{event.preventDefault();goBack();});
  dialog.addEventListener('click',event=>{
    const choice=event.target.closest('[data-player-skin]');if(!choice)return;
    libraryScroll=scroll.scrollTop;selected=choice.dataset.playerSkin;render();status.textContent='';scroll.scrollTop=0;back.focus({preventScroll:true});
  });
  dialog.addEventListener('click',event=>{
    if(!event.target.closest('#skin-use'))return;
    const action=skinSelection(controller.get(),selected,true);if(!action){render();return;}
    const result=controller.act(action);render();
    status.textContent=result.ok?`${optionsName(selected)} equipped.`:result.reason;
    const toggle=dialog.querySelector('#skin-use');(toggle.disabled?back:toggle).focus({preventScroll:true});
  });
  return {refresh(){if(dialog.open)render();},open(){selected=null;libraryScroll=0;controller.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
