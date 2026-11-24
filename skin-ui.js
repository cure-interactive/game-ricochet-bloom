import {cosmeticViewMount} from './cosmetic-view.js?v=8a82cbc5eeca85df021842a58ec6d738a351c0557536fe3173f024b39009b9be';
import {cosmeticPreviewMount} from './cosmetic-preview.js?v=69a26a5399c47b34db839cc26859f43a75564969944ea40dbb8f5b92c498d618';
import {rememberView} from './navigation-state.js?v=d7ae9a905aacccc9eaf9bbac7fc9b56f9cb442d4e202334ea0b1d7b5f2e82f2a';
import {rarityFilterMount,rarityPreviewHTML,cosmeticCardHTML} from './rarity-filter.js?v=7b3ab7cc595af0ea2236395531a9b86991375d7ff8c318c0e2993d9a69a0b3c3';
import {cosmeticPriceHTML} from './cosmetic-price.js?v=5e602c81cdadc96a789a1ac3e245b03e87bcd145f6eced05db8ca78c81432532';
import {COSMETICS,cosmeticOrder,cosmeticLoadout,cosmeticOwned} from './cosmetic.js?v=386c865d18f3ecc56ec0e8d96181350a8f83899d2fde7de3cc434c8f8f3685c5';
import {rarityIconHTML} from './skill-icon.js?v=1e5fb74555308add256ae8e53708298f1614778e6c3d768f377a9808ce260427';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { screenHeader } from './screen-header.js?v=dc9c49c3de9dba6c62156c5183b3aaa7f74f68b35a1e805937f596b9990e8af1';
import { TRACKS } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { completedTracks, unlockedTracks } from './run.js?v=795057cada8dafcc7cc5aea6aff6ab73e3e640b0127abc4ab18c91aae6c4b1e0';
import { iconHTML, staticIconHTML } from './ui-icon.js?v=44ea63eff6eacd4cad173283015795275bfc00f891809cd37ea89694c51bd05d';

import {escapeHTML} from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';

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
  dialog.innerHTML=`${screenHeader({icon:'player-skin',className:'skin-heading',title:'Player Skin',titleId:'skin-title',back:`<button type="button" data-skin-back>${iconHTML('arrow-left')}<span>Back</span></button>`})}<div class="skin-content"><div class="skin-scroll"><section class="skin-library"><p class="skin-intro">Choose a look from Common to Mythic with Points, or earn skins by completing campaign tracks.</p><div class="skin-grid"></div></section><section class="skin-detail" hidden></section><p class="skin-status" role="status"></p></div></div>`;
  document.body.append(dialog);
  const scroll=dialog.querySelector('.skin-scroll'),detail=dialog.querySelector('.skin-detail'),status=dialog.querySelector('.skin-status'),back=dialog.querySelector('[data-skin-back]');
  const filter=rarityFilterMount(dialog,{scroll,cards:()=>[...dialog.querySelectorAll('.cosmetic-card')],profile:()=>controller.get().profile,act:controller.act,status});
  const views=cosmeticViewMount(dialog,next=>preview?.viewSet(next));
  function render(){
    preview?.destroy();preview=null;
    const options=skinOptions(controller.get(),controller.showHiddenContent?.()),skin=options.find(s=>s.id===selected);
    if(selected&&!skin)selected=null;
    // The title previews this selection without equipping it or recreating its
    // live bubble; the library title returns to the currently equipped skin.
    const titleSkin=skin||options.find(s=>s.equipped),titleIcon=dialog.querySelector('.screen-heading-title .ui-icon');
    titleIcon.style.setProperty('--skin-color',titleSkin?.color||'#f1f9d7');titleIcon.style.setProperty('--skin-style',titleSkin?.style||'original');
    dialog.querySelector('.skin-grid').innerHTML=options.map(skin=>cosmeticCardHTML(skin,`<button type="button" class="skin-choice ${skin.equipped?'is-equipped':''} ${skin.owned?'':'is-locked'}" data-player-skin="${skin.id}" data-rarity="${skin.rarity}" style="--skin-color:${skin.color};--skin-style:${skin.style}" aria-label="View ${skin.name}, ${RARITIES[skin.rarity].name}, ${skin.equipped?'Equipped':skin.owned?'Unlocked':'Locked'}">${rarityPreviewHTML(skin.rarity,`<span class="skin-preview" aria-hidden="true"><i><player-bubble trail="equipped"></player-bubble></i></span>`)}<strong>${skin.name}</strong><span class="skin-choice-state">${iconHTML(skin.equipped?'check':skin.owned?'lock-open':'lock')}${skin.equipped?'Equipped':skin.owned?'Unlocked':skin.kind==='skin'?skin.cost+' Points':'Campaign Reward'}</span>${cosmeticPriceHTML(skin,skin.owned,controller.showPurchasedCosts?.())}</button>`)).join('');
    dialog.querySelector('.skin-library').hidden=!!skin;detail.hidden=!skin;scroll.classList.toggle('is-detail',!!skin);filter.show(!skin);views.show(!!skin);
    dialog.querySelector('#skin-title').textContent=skin?skin.name:'Player Skin';back.setAttribute('aria-label',skin?'Back to Player Skin':'Back');
    if(!skin){detail.replaceChildren();return;}
    detail.style.setProperty('--skin-color',skin.color);detail.style.setProperty('--skin-style',skin.style);
    const points=controller.get().profile.wallet.seeds,canBuy=skin.kind==='skin'&&points>=skin.cost;
    detail.innerHTML=`<div class="cosmetic-viewer"><div class="cosmetic-preview-large" role="button" tabindex="0" aria-label="Skin Preview. Tap or use arrow keys to nudge."><canvas aria-label="Animated Skin Preview"></canvas></div></div><section class="skin-selection ${skin.equipped?'is-equipped':''}" aria-label="${escapeHTML(skin.name)} Skin"><div class="skin-selection-title">${iconHTML(skin.equipped?'check':skin.owned?'lock-open':'lock')}<div><small class="cosmetic-rarity">${rarityIconHTML(skin.rarity)}${RARITIES[skin.rarity].name} · Player Skin</small><h3>${escapeHTML(skin.name)}</h3></div></div><p class="skin-unlock">${skin.kind==='skin'?escapeHTML(skin.description):!skin.owned?'Complete '+escapeHTML(skin.name)+' to unlock this skin.':skin.id==='original'?'Your original glow.':skin.equipped?'Your player is wearing this skin.':'Unlocked by completing '+escapeHTML(skin.name)+'.'}</p>${cosmeticPriceHTML(skin,skin.owned,controller.showPurchasedCosts?.())}<button type="button" id="skin-use" class="skin-equip ${skin.equipped?'is-equipped':''}" ${(!skin.owned&&!canBuy)||skin.equipped?'disabled':''}>${staticIconHTML(skin.equipped?'check':skin.owned?'player-skin':'lock')}<span>${skin.equipped?'Equipped':skin.owned?'Equip Skin':skin.kind==='skin'?'Unlock &amp; Equip · '+skin.cost+' Points':'Campaign Reward'}</span>${cosmeticPriceHTML(skin,skin.owned,controller.showPurchasedCosts?.())}</button>${skin.kind==='skin'&&!skin.owned?`<p class="cosmetic-wallet">${iconHTML('coin')}${points} Points${!skin.owned&&!canBuy?` · ${skin.cost-points} more needed`:""}</p>`:""}</section>`;
    views.attach(detail.querySelector('.cosmetic-viewer'));const canvas=detail.querySelector('canvas');preview=cosmeticPreviewMount(canvas,{surface:canvas.parentElement,view:views.value(),kind:()=> 'skin',loadout:()=>cosmeticLoadout(controller.get().profile),color:()=>skin.color,style:()=>skin.style});
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
  rememberView(dialog,'detail',()=>({selected,libraryScroll,view:views.value()}),state=>{if(state?.selected&&(skins.some(x=>x.id===state.selected)||COSMETICS.some(x=>x.kind==='skin'&&x.id===state.selected))){selected=state.selected;libraryScroll=Number.isFinite(state.libraryScroll)?state.libraryScroll:0;views.set(state.view);render();}},20);
  return {refresh(){if(dialog.open)render();},open(){selected=null;libraryScroll=0;controller.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
