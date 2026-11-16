import {rememberView} from './navigation-state.js?v=8f540f6be269a8759011349f3d0983c46c7ea4c71a6728e0324dba8b0e6e72e8';
import {rarityFilterMount,rarityPreviewHTML,cosmeticCardHTML} from './rarity-filter.js?v=33b57334bfe5dae634acc06ed1abe98c3743f3c9cde0054ea3922d70e945f145';
import {cosmeticPriceHTML} from './cosmetic-price.js?v=a87813cd95ebe513b3e4c54a07af3848d82ebd3d5045c4fe337e594f69e20bb8';
import {COSMETICS,cosmeticOrder,cosmeticLoadout,cosmeticOwned} from './cosmetic.js?v=0b32f7936068fa17090bc0edec50d142f4f145642fd37ef3110a6b59b56a93de';
import {rarityIconHTML} from './skill-icon.js?v=323da47ec6044e57d9571db79d2e73cc83e5d962daf53f03192092c7de37fdc8';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=589afccbde94ea3151bcf119a929aca8430cd8adfc584bf88b1add584a8621a2';
import { screenHeader } from './screen-header.js?v=abdd601bfd00682c8e2df56bb78bf52f54d173e7c455d7ae92bba16d48c17860';
import { TRACKS } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { completedTracks, unlockedTracks } from './run.js?v=13cddd0791aa2c8ea509a45b8136591b3e0359519cf8ebb3be6fefb2c61961d8';
import { iconHTML, staticIconHTML } from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';

import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';

const skins=[{id:'original',name:'Original',color:'#f1f9d7'},...TRACKS];
export function skinOptions(state,showHidden=false){
  const unlocked=new Set(['original',...completedTracks(state)]),visible=new Set(['original',...unlockedTracks(state).map(t=>t.id)]);
  const chosen=cosmeticLoadout(state.profile).skin;
  return cosmeticOrder([...skins.filter(skin=>showHidden||visible.has(skin.id)).map(skin=>({...skin,style:'original',rarity:'common',owned:unlocked.has(skin.id),equipped:chosen==='campaign'&&state.skin===skin.id})),...COSMETICS.filter(s=>s.kind==='skin').map(s=>({...s,owned:cosmeticOwned(state.profile,s),equipped:chosen===s.id}))]);
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
  dialog.innerHTML=`${screenHeader({icon:'player-skin',className:'skin-heading',title:'Player Skins',titleId:'skin-title',back:`<button type="button" data-skin-back>${iconHTML('arrow-left')}<span>Back</span></button>`})}<div class="skin-content"><div class="skin-scroll"><section class="skin-library"><p class="skin-intro">Choose a look from Common to Mythic with Points, or earn skins by completing campaign tracks.</p><div class="skin-grid"></div></section><section class="skin-detail" hidden></section><p class="skin-status" role="status"></p></div></div>`;
  document.body.append(dialog);
  const scroll=dialog.querySelector('.skin-scroll'),detail=dialog.querySelector('.skin-detail'),status=dialog.querySelector('.skin-status'),back=dialog.querySelector('[data-skin-back]');
  const filter=rarityFilterMount(dialog,{scroll,cards:()=>[...dialog.querySelectorAll('.cosmetic-card')],profile:()=>controller.get().profile,act:controller.act,status});
  function render(){
    preview?.destroy();preview=null;
    const options=skinOptions(controller.get(),controller.showHiddenContent?.()),skin=options.find(s=>s.id===selected);
    if(selected&&!skin)selected=null;
    // The title previews this selection without equipping it or recreating its
    // live bubble; the library title returns to the currently equipped skin.
    const titleSkin=skin||options.find(s=>s.equipped),titleIcon=dialog.querySelector('.screen-heading-title .ui-icon');
    titleIcon.style.setProperty('--skin-color',titleSkin?.color||'#f1f9d7');titleIcon.style.setProperty('--skin-style',titleSkin?.style||'original');
    dialog.querySelector('.skin-grid').innerHTML=options.map(skin=>cosmeticCardHTML(skin,`<button type="button" class="skin-choice ${skin.equipped?'is-equipped':''} ${skin.owned?'':'is-locked'}" data-player-skin="${skin.id}" data-rarity="${skin.rarity}" style="--skin-color:${skin.color};--skin-style:${skin.style}" aria-label="View ${skin.name}, ${RARITIES[skin.rarity].name}, ${skin.equipped?'Equipped':skin.owned?'Unlocked':'Locked'}">${rarityPreviewHTML(skin.rarity,'<span class="skin-preview" aria-hidden="true"><i><player-bubble></player-bubble></i></span>')}<strong>${skin.name}</strong><span class="skin-choice-state">${iconHTML(skin.equipped?'check':skin.owned?'lock-open':'lock')}${skin.equipped?'Equipped':skin.owned?'Unlocked':skin.kind==='skin'?skin.cost+' Points':'Campaign reward'}</span>${cosmeticPriceHTML(skin,skin.owned,controller.showPurchasedCosts?.())}</button>`)).join('');
    dialog.querySelector('.skin-library').hidden=!!skin;detail.hidden=!skin;scroll.classList.toggle('is-detail',!!skin);filter.show(!skin);
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
  rememberView(dialog,'detail',()=>({selected,libraryScroll}),state=>{if(state?.selected&&(skins.some(x=>x.id===state.selected)||COSMETICS.some(x=>x.kind==='skin'&&x.id===state.selected))){selected=state.selected;libraryScroll=Number.isFinite(state.libraryScroll)?state.libraryScroll:0;render();}},20);
  return {refresh(){if(dialog.open)render();},open(){selected=null;libraryScroll=0;controller.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
