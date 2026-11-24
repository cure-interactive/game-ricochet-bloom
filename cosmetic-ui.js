import {rememberView} from './navigation-state.js?v=d7ae9a905aacccc9eaf9bbac7fc9b56f9cb442d4e202334ea0b1d7b5f2e82f2a';
import {rarityFilterMount,rarityPreviewHTML,cosmeticCardHTML} from './rarity-filter.js?v=4251ecf0a48be61340e86e6deb6d1db5a75fd389a30b95c16a565ebaa60a995e';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import {cosmeticPriceHTML} from './cosmetic-price.js?v=980b863db8db41d73ad3de89a3018398f6e05922f39dce8024b716fde72b3c65';
import {COSMETICS,cosmeticOrder,cosmeticHasSound,cosmeticGet,cosmeticLoadout,cosmeticOwned} from './cosmetic.js?v=36e7348418dff5ee2bd86e9b6d031f48e9fed9ce1ae911f25e16edd70d5de8e5';
import {cosmeticPreviewMount,cosmeticThumbnailMount} from './cosmetic-preview.js?v=3998335642cf4f98355c7ee85a366f430850ff72db92bba8d9d873059d76af2b';
import {screenHeader} from './screen-header.js?v=3d8195bab82c46447953d26055dab77b27d3181b17681af50ce10efc7bfe3569';
import {buttonHTML,iconHTML,staticIconHTML} from './ui-icon.js?v=7c511ffceed13bc60b7242d23fee0e6741c53961d883e627df95ecf7e89da303';
import {rarityIconHTML} from './skill-icon.js?v=95d7d4290b996dc989ba3ec27e845c982f4113db07c91c44e2280e8670f9915f';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {escapeHTML} from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
export function cosmeticMount(host){
 let kind='trail',selected=null,preview=null,renderedKind='',audition=0,libraryScroll=0,soundFrame=0,soundActive=false;const thumbnails=[];
 const dialog=document.createElement('dialog');dialog.id='cosmetic-dialog';dialog.setAttribute('aria-labelledby','cosmetic-title');
 dialog.innerHTML=screenHeader({icon:'trails',title:'Trails',titleId:'cosmetic-title',className:'skin-heading',back:buttonHTML('Back','arrow-left',{'data-cosmetic-back':true})})+`<div class="skin-content"><div class="skin-scroll"><section class="skin-library">${segmentedHTML([['music','Instruments','music-note'],['soundstage','Soundstages','sound'],['ambience','Ambience','wave']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-music-category':id,'aria-pressed':id==='music'})),{label:'Music categories',current:'music',className:'music-category'})}<p class="skin-intro"></p><div class="skin-grid"></div></section><section class="skin-detail" hidden><div class="cosmetic-preview-large"><canvas aria-label="Animated Cosmetic Preview"></canvas></div><section class="skin-selection cosmetic-detail"></section></section><p class="skin-status" role="status"></p></div></div>`;
 document.body.append(dialog);
 const back=dialog.querySelector('[data-cosmetic-back]'),detail=dialog.querySelector('.cosmetic-detail'),status=dialog.querySelector('.skin-status'),scroll=dialog.querySelector('.skin-scroll'),large=dialog.querySelector('.cosmetic-preview-large canvas');
 let heading=dialog.querySelector('.screen-heading-title>.ui-icon');
 const isAudio=()=>['music','soundstage','ambience'].includes(kind);
 const title=()=>isAudio()?'Music':({trail:'Trails',bounce:'Impacts',pendant:'Pendants',companion:'Companions'}[kind]);
 const label=()=>({music:'Instrument',soundstage:'Soundstage',ambience:'Ambience',pendant:'Pendant',companion:'Companion'}[kind])||(kind==='trail'?'Trail':'Impact');
 const glyph=()=>isAudio()?'music-note':({trail:'trails',bounce:'bounce-effects',pendant:'pendants',companion:'companions'}[kind]);
 const musicArt=item=>`<div class="music-theme-art" style="--theme-color:${item.color}" aria-hidden="true">${iconHTML(item.kind==='soundstage'?'sound':item.kind==='ambience'?'wave':'music-note')}<span>${[.4,.7,1,.6,.85].map(h=>`<i style="--bar-height:${h}"></i>`).join('')}</span></div>`;
 const win=dialog.ownerDocument.defaultView;
 function soundButton(active,progress=0){const button=detail.querySelector('[data-cosmetic-sound]');if(!button)return;button.setAttribute('aria-pressed',String(active));button.querySelector('[data-preview-label]').textContent=active?'Stop Preview':'Preview Sound';button.style.setProperty('--preview-progress',String(progress));}
 const stop=()=>{audition++;soundActive=false;win.cancelAnimationFrame(soundFrame);soundFrame=0;host.stopSound?.();soundButton(false);};
 function followSound(){
  const state=host.previewStatus?.();if(!soundActive)return;
  if(!state?.active){stop();detail.querySelector('.cosmetic-sound-hint').textContent='Preview finished.';return;}
  soundButton(true,state.progress);soundFrame=win.requestAnimationFrame(followSound);
 }
 const filter=rarityFilterMount(dialog,{scroll,cards:()=>[...dialog.querySelectorAll('.cosmetic-card')],profile:host.profile,act:host.act,status});
 dialog.querySelector('.skin-content').append(dialog.querySelector('.music-category').closest('.tab-bar'));
 function render(){
  if(heading.dataset.icon!==glyph()){heading.outerHTML=iconHTML(glyph());heading=dialog.querySelector('.screen-heading-title>.ui-icon');}
  const profile=host.profile(),loadout=cosmeticLoadout(profile),item=selected?cosmeticGet(selected):null;
  dialog.querySelector('.skin-library').hidden=!!item;dialog.querySelector('.skin-detail').hidden=!item;scroll.classList.toggle('is-detail',!!item);
  dialog.querySelector('#cosmetic-title').textContent=item?.name||title();back.setAttribute('aria-label',item?'Back to '+title():'Back');
  const tabs=dialog.querySelector('.music-category');tabs.closest('.tab-bar').hidden=!isAudio()||!!item;tabs.dataset.current=kind;for(const button of tabs.querySelectorAll('button'))button.setAttribute('aria-pressed',button.dataset.musicCategory===kind);categories.refresh();
  dialog.querySelector('.skin-intro').textContent=isAudio()?({music:'Choose the instruments that voice your melody.',soundstage:'Choose the acoustic space around your instruments.',ambience:'Choose a quiet background atmosphere to accompany your music.'}[kind])+' Preview before purchasing. Each Music category equips independently.':['pendant','companion'].includes(kind)?`Choose ${kind==='pendant'?'a pendant':'a companion'} to make your player your own. Try the free starter, preview unlockable designs, or choose None. Purely cosmetic: no change to powers, collisions or Score.`:`Choose ${kind==='trail'?'a trail':'an impact'} from Common to Mythic. Open a style to see it in motion before unlocking it with Points.`;

  heading.style.setProperty('--cosmetic-id',selected||loadout[kind]);heading.style.setProperty('--skin-color',host.color?.()||'#f1f9d7');heading.style.setProperty('--skin-style',host.style?.()||'original');
  if(renderedKind!==kind){
   for(const control of thumbnails)control.destroy();thumbnails.length=0;renderedKind=kind;
   dialog.querySelector('.skin-grid').innerHTML=cosmeticOrder(COSMETICS.filter(x=>x.kind===kind)).map(x=>cosmeticCardHTML(x,`<button type="button" class="skin-choice" data-cosmetic="${x.id}" data-rarity="${x.rarity}">${rarityPreviewHTML(x.rarity,isAudio()?musicArt(x):'<span class="cosmetic-thumbnail-slot"><canvas class="cosmetic-thumbnail" aria-hidden="true"></canvas></span>')}<strong>${escapeHTML(x.name)}</strong><span class="skin-choice-state"></span><span class="cosmetic-price-slot"></span></button>`)).join('');
   for(const canvas of dialog.querySelectorAll('.cosmetic-thumbnail'))thumbnails.push(cosmeticThumbnailMount(canvas,cosmeticGet(canvas.closest('[data-cosmetic]').dataset.cosmetic),{color:host.color,style:host.style,surface:canvas.parentElement,loadout:()=>cosmeticLoadout(host.profile()),trailEnabled:()=>canvas.closest('[data-cosmetic]').classList.contains('is-equipped')}));
  }
  for(const button of dialog.querySelectorAll('[data-cosmetic]')){
   const x=cosmeticGet(button.dataset.cosmetic),owned=cosmeticOwned(profile,x),equipped=loadout[kind]===x.id;
   button.classList.toggle('is-equipped',equipped);button.classList.toggle('is-locked',!owned);
   button.setAttribute('aria-label',`View ${x.name}, ${RARITIES[x.rarity].name}, ${equipped?'Equipped':owned?'Unlocked':'Locked'}`);
   button.querySelector('.cosmetic-price-slot').innerHTML=cosmeticPriceHTML(x,owned,host.showPurchasedCosts?.());
   button.querySelector('.skin-choice-state').innerHTML=iconHTML(equipped?'check':owned?'lock-open':'lock')+(equipped?'Equipped':owned?'Unlocked':x.cost+' Points');
  }
  filter.show(!item);
  if(!item)return;
  const owned=cosmeticOwned(profile,item),equipped=loadout[kind]===selected,points=profile.wallet.seeds;
  detail.classList.toggle('is-equipped',equipped);detail.style.setProperty('--skin-color',item.color);
  detail.innerHTML=`<div class="skin-selection-title">${iconHTML(equipped?'check':owned?'lock-open':'lock')}<div><small class="cosmetic-rarity">${rarityIconHTML(item.rarity)}${RARITIES[item.rarity].name} · ${label()}</small><h3>${escapeHTML(item.name)}</h3></div></div><p class="skin-unlock">${escapeHTML(item.description)}</p>${cosmeticPriceHTML(item,owned,host.showPurchasedCosts?.())}<button type="button" data-cosmetic-equip ${equipped||!owned&&points<item.cost?'disabled':''} class="skin-equip ${equipped?'is-equipped':''}">${staticIconHTML(equipped?'check':owned?glyph():'lock')}<span>${equipped?'Equipped':owned?'Equip '+label():'Unlock &amp; Equip · '+item.cost+' Points'}</span></button>${!owned?`<p class="cosmetic-wallet">${iconHTML('coin')}${points} Points${points<item.cost?' · '+(item.cost-points)+' more needed':''}</p>`:''}`;
  if(['pendant','companion'].includes(item.kind)&&item.style!=='none')detail.insertAdjacentHTML('beforeend',`<button type="button" class="quiet" data-accessory-celebrate>Preview Celebration</button>`);
  if(cosmeticHasSound(item))detail.insertAdjacentHTML('beforeend',`<button type="button" class="quiet cosmetic-sound-button" data-cosmetic-sound aria-pressed="false">${iconHTML('play')}<span data-preview-label>Preview Sound</span><span class="cosmetic-sound-progress" aria-hidden="true"><i></i></span></button><small class="cosmetic-sound-hint" role="status">${isAudio()?'Try this '+label().toLowerCase()+' with the current music for up to ten seconds. Tap again to restore your equipped choice.'+(kind==='ambience'?' Follows Ambience Volume, Master Volume and Sound.':' Follows Music Volume, Master Volume and Sound.'):(item.kind==='trail'&&item.rarity==='mythic'?'Launch and travel · tapers to silence over 2.5 seconds.':item.kind==='companion'?'Celebration voice · a short answer after a 5-Chain or success.':'Launch or impact accent.')+' Follows master volume and mute.'}</small>`);
  large.hidden=isAudio();
  large.parentElement.querySelector('.music-theme-art')?.remove();
  if(isAudio()){preview?.destroy();preview=null;large.insertAdjacentHTML('afterend',musicArt(item));return;}
  preview ||=cosmeticPreviewMount(large,{surface:large.parentElement,loadout:()=>({...cosmeticLoadout(host.profile()),...(selected?{[kind]:selected}:{})}),color:host.color,style:host.style});
 }
 const categories=segmentedMount(dialog,{attribute:'data-music-category',change(next){stop();kind=next;selected=null;libraryScroll=0;render();scroll.scrollTop=0;return dialog.querySelector('.music-category');}});
 function goBack(){
  stop();if(!selected){host.back();return;}
  const id=selected;selected=null;render();status.textContent='';scroll.scrollTop=libraryScroll;dialog.querySelector(`[data-cosmetic="${id}"]`)?.focus({preventScroll:true});
 }
 back.onclick=goBack;dialog.addEventListener('cancel',e=>{e.preventDefault();goBack();});
 dialog.addEventListener('close',()=>{stop();preview?.destroy();preview=null;});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 dialog.addEventListener('click',async e=>{
  if(!e.target.closest('[data-cosmetic-sound]'))return;
  if(soundActive){stop();detail.querySelector('.cosmetic-sound-hint').textContent='Preview stopped.';return;}
  const id=selected,token=++audition;soundActive=true;soundButton(true);
  const ready=await host.unlock?.();if(token!==audition||!dialog.open||selected!==id)return;
  if(ready!==false&&host.sound?.(id)){if(kind==='companion')preview?.celebrate();detail.querySelector('.cosmetic-sound-hint').textContent=isAudio()?'Previewing this '+label().toLowerCase()+' with the current music. Tap again to restore your equipped choice.':'Preview playing. Tap again to stop.';followSound();}
  else{stop();detail.querySelector('.cosmetic-sound-hint').textContent='Sound is muted or unavailable. Check Audio settings.';}
 });
 dialog.addEventListener('click',e=>{
  if(e.target.closest('[data-accessory-celebrate]')){preview?.celebrate();return;}
  const choice=e.target.closest('[data-cosmetic]');
  if(choice){stop();libraryScroll=scroll.scrollTop;selected=choice.dataset.cosmetic;render();status.textContent='';scroll.scrollTop=0;back.focus({preventScroll:true});}
  else if(e.target.closest('[data-cosmetic-equip]')){stop();const item=cosmeticGet(selected),result=host.act({type:cosmeticOwned(host.profile(),item)?'equip-cosmetic':'buy-cosmetic',id:selected});render();status.textContent=result.ok?item.name+' equipped.':result.reason;const equip=detail.querySelector('[data-cosmetic-equip]');(equip.disabled?back:equip).focus({preventScroll:true});}
 });
 rememberView(dialog,'detail',()=>({selected,libraryScroll}),state=>{const item=cosmeticGet(state?.selected);if(item?.kind===kind){selected=item.id;libraryScroll=Number.isFinite(state.libraryScroll)?state.libraryScroll:0;render();}},20);
 return {open(destination='trails'){stop();kind=destination==='music-themes'?'music':destination==='bounce-effects'?'bounce':destination==='pendants'?'pendant':destination==='companions'?'companion':'trail';selected=null;libraryScroll=0;host.screen(destination);document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
