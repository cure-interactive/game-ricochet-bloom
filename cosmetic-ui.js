import {cosmeticViewMount} from './cosmetic-view.js?v=ba8f8ec95a95b5b8caaa61a679c009b8f18d7406b000c3ca5cf4fed02b38afcb';
import {rememberView} from './navigation-state.js?v=d7ae9a905aacccc9eaf9bbac7fc9b56f9cb442d4e202334ea0b1d7b5f2e82f2a';
import {rarityFilterMount,rarityPreviewHTML,cosmeticCardHTML} from './rarity-filter.js?v=49b509cc7abd57a15a9a8ede92966e22362b27a849f3d37f8ebf8c78dc65cd17';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import {cosmeticPriceHTML} from './cosmetic-price.js?v=c6045ef3522d643402f1c5ff6529bcfd1fb9193b8f974485bd65c1c9441d262c';
import {COSMETICS,cosmeticOrder,cosmeticHasSound,cosmeticGet,cosmeticLoadout,cosmeticOwned} from './cosmetic.js?v=ddc203acc7e92b1a16f24947665f4dbf857da6e9dea64f178d61d81305382532';
import {cosmeticPreviewMount,cosmeticThumbnailMount} from './cosmetic-preview.js?v=b3e9a7f4c7bdf908064a3195d2386bdd0146c80ddf6052b084fff03b64ee53b1';
import {screenHeader} from './screen-header.js?v=9ab6b3cf5602ced6dc6e13b81276dce489e8ed34d63861ef887524042f9c5327';
import {buttonHTML,iconHTML,staticIconHTML} from './ui-icon.js?v=6714d1bebfde0855f289ae2396849587b277c74e191bc1ae84a5fdd1b44bd11c';
import {rarityIconHTML} from './skill-icon.js?v=02904255d1cccc861729bb9437324ef61ba438ddbb65e46a3382f94fbc10d9ab';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {escapeHTML} from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
const playbackButtonHTML=(label,attribute)=>`<button type="button" class="quiet cosmetic-sound-button" ${attribute} data-preview-title="${label}" aria-pressed="false">${iconHTML('play')}<span data-preview-label>${label}</span><span class="cosmetic-sound-progress" aria-hidden="true"><i></i></span></button>`;
export function cosmeticMount(host){
 let kind='trail',selected=null,preview=null,renderedKind='',audition=0,libraryScroll=0,soundFrame=0,soundActive=false;const thumbnails=[];
 const dialog=document.createElement('dialog');dialog.id='cosmetic-dialog';dialog.setAttribute('aria-labelledby','cosmetic-title');
 dialog.innerHTML=screenHeader({icon:'trails',title:'Trail',titleId:'cosmetic-title',className:'skin-heading',back:buttonHTML('Back','arrow-left',{'data-cosmetic-back':true})})+`<div class="skin-content"><div class="skin-scroll"><section class="skin-library">${segmentedHTML([['music','Instruments','music-note'],['soundstage','Soundstages','sound'],['ambience','Ambience','wave']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-music-category':id,'aria-pressed':id==='music'})),{label:'Music categories',current:'music',className:'music-category'})}<p class="skin-intro"></p><div class="skin-grid"></div></section><section class="skin-detail" hidden><div class="cosmetic-viewer"><div class="cosmetic-preview-large" role="button" tabindex="0" aria-label="Cosmetic Preview. Tap or use arrow keys to nudge."><canvas aria-label="Animated Cosmetic Preview"></canvas></div></div><section class="skin-selection cosmetic-detail"></section></section><p class="skin-status" role="status"></p></div></div>`;
 document.body.append(dialog);
 const back=dialog.querySelector('[data-cosmetic-back]'),detail=dialog.querySelector('.cosmetic-detail'),status=dialog.querySelector('.skin-status'),scroll=dialog.querySelector('.skin-scroll'),large=dialog.querySelector('.cosmetic-preview-large canvas');
 let heading=dialog.querySelector('.screen-heading-title>.ui-icon');
 const isAudio=()=>['music','soundstage','ambience'].includes(kind);
 const title=()=>isAudio()?'Music':({trail:'Trail',bounce:'Impact',pendant:'Pendant',companion:'Companion'}[kind]);
 const label=()=>({music:'Instrument',soundstage:'Soundstage',ambience:'Ambience',pendant:'Pendant',companion:'Companion'}[kind])||(kind==='trail'?'Trail':'Impact');
 const glyph=()=>isAudio()?'music-note':({trail:'trails',bounce:'bounce-effects',pendant:'pendants',companion:'companions'}[kind]);
 const musicArt=item=>`<div class="music-theme-art" style="--theme-color:${item.color}" aria-hidden="true">${iconHTML(item.kind==='soundstage'?'sound':item.kind==='ambience'?'wave':'music-note')}<span>${[.4,.7,1,.6,.85].map(h=>`<i style="--bar-height:${h}"></i>`).join('')}</span></div>`;
 const win=dialog.ownerDocument.defaultView;
 function soundButton(active,progress=0){const button=detail.querySelector('.cosmetic-sound-button');if(!button)return;button.setAttribute('aria-pressed',String(active));button.querySelector('[data-preview-label]').textContent=active?'Stop Preview':button.dataset.previewTitle;button.style.setProperty('--preview-progress',String(progress));}
 const stop=()=>{audition++;soundActive=false;win.cancelAnimationFrame(soundFrame);soundFrame=0;host.stopSound?.();preview?.cancelCelebration();soundButton(false);};
 function followSound(){
  const state=detail.querySelector('[data-accessory-celebrate]')?preview?.celebrationStatus():host.previewStatus?.();if(!soundActive)return;
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
   for(const canvas of dialog.querySelectorAll('.cosmetic-thumbnail'))thumbnails.push(cosmeticThumbnailMount(canvas,cosmeticGet(canvas.closest('[data-cosmetic]').dataset.cosmetic),{color:host.color,style:host.style,surface:canvas.parentElement,loadout:()=>cosmeticLoadout(host.profile()),trailEnabled:()=>true}));
  }
  for(const button of dialog.querySelectorAll('[data-cosmetic]')){
   const x=cosmeticGet(button.dataset.cosmetic),owned=cosmeticOwned(profile,x),equipped=loadout[kind]===x.id;
   button.classList.toggle('is-equipped',equipped);button.classList.toggle('is-locked',!owned);
   button.setAttribute('aria-label',`View ${x.name}, ${RARITIES[x.rarity].name}, ${equipped?'Equipped':owned?'Unlocked':'Locked'}`);
   button.querySelector('.cosmetic-price-slot').innerHTML=cosmeticPriceHTML(x,owned,host.showPurchasedCosts?.());
   button.querySelector('.skin-choice-state').innerHTML=iconHTML(equipped?'check':owned?'lock-open':'lock')+(equipped?'Equipped':owned?'Unlocked':x.cost+' Points');
  }
  filter.show(!item);views.show(!!item&&!isAudio());
  if(!item)return;
  const owned=cosmeticOwned(profile,item),equipped=loadout[kind]===selected,points=profile.wallet.seeds;
  detail.classList.toggle('is-equipped',equipped);detail.style.setProperty('--skin-color',item.color);
  detail.innerHTML=`<div class="skin-selection-title">${iconHTML(equipped?'check':owned?'lock-open':'lock')}<div><small class="cosmetic-rarity">${rarityIconHTML(item.rarity)}${RARITIES[item.rarity].name} · ${label()}</small><h3>${escapeHTML(item.name)}</h3></div></div><p class="skin-unlock">${escapeHTML(item.description)}</p>${cosmeticPriceHTML(item,owned,host.showPurchasedCosts?.())}<button type="button" data-cosmetic-equip ${equipped||!owned&&points<item.cost?'disabled':''} class="skin-equip ${equipped?'is-equipped':''}">${staticIconHTML(equipped?'check':owned?glyph():'lock')}<span>${equipped?'Equipped':owned?'Equip '+label():'Unlock &amp; Equip · '+item.cost+' Points'}</span></button>${!owned?`<p class="cosmetic-wallet">${iconHTML('coin')}${points} Points${points<item.cost?' · '+(item.cost-points)+' more needed':''}</p>`:''}`;
  if(['pendant','companion'].includes(item.kind)&&item.style!=='none')detail.insertAdjacentHTML('beforeend',playbackButtonHTML('Preview Celebration','data-accessory-celebrate')+`<small class="cosmetic-sound-hint" role="status">Play the celebration${cosmeticHasSound(item)?' with sound':''}. Tap again to stop.</small>`);
  if(cosmeticHasSound(item)&&item.kind!=='companion')detail.insertAdjacentHTML('beforeend',playbackButtonHTML('Preview Sound','data-cosmetic-sound')+`<small class="cosmetic-sound-hint" role="status">${isAudio()?'Try this '+label().toLowerCase()+' with the current music for up to ten seconds. Tap again to restore your equipped choice.'+(kind==='ambience'?' Follows Ambience Volume, Master Volume and Sound.':' Follows Music Volume, Master Volume and Sound.'):(item.kind==='trail'&&item.rarity==='mythic'?'Launch and travel · tapers to silence over 2.5 seconds.':item.kind==='companion'?'Celebration voice · a short answer after a 5-Chain or success.':'Launch or impact accent.')+' Follows master volume and mute.'}</small>`);
  large.hidden=isAudio();
  const stage=large.parentElement;if(isAudio()){stage.removeAttribute('role');stage.removeAttribute('tabindex');stage.removeAttribute('aria-label');}else{stage.setAttribute('role','button');stage.setAttribute('tabindex','0');stage.setAttribute('aria-label',item.name+' Preview. Tap or use arrow keys to nudge.'+(item.kind==='pendant'?' In Showcase, drag to move the invisible cord anchor.':''));}
  large.parentElement.querySelector('.music-theme-art')?.remove();
  if(isAudio()){preview?.destroy();preview=null;large.insertAdjacentHTML('afterend',musicArt(item));return;}
  preview ||=cosmeticPreviewMount(large,{surface:large.parentElement,view:views.value(),kind:()=>kind,loadout:()=>({...cosmeticLoadout(host.profile()),...(selected?{[kind]:selected}:{})}),color:host.color,style:host.style});
 }
 const views=cosmeticViewMount(dialog,next=>{stop();preview?.viewSet(next);});views.attach(large.parentElement.parentElement);
 const categories=segmentedMount(dialog,{attribute:'data-music-category',change(next){stop();kind=next;selected=null;libraryScroll=0;render();scroll.scrollTop=0;return dialog.querySelector('.music-category');}});
 function goBack(){
  stop();if(!selected){host.back();return;}
  const id=selected;selected=null;render();status.textContent='';scroll.scrollTop=libraryScroll;dialog.querySelector(`[data-cosmetic="${id}"]`)?.focus({preventScroll:true});
 }
 back.onclick=goBack;dialog.addEventListener('cancel',e=>{e.preventDefault();goBack();});
 dialog.addEventListener('close',()=>{stop();preview?.destroy();preview=null;});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 dialog.addEventListener('click',async e=>{
  const celebrate=e.target.closest('[data-accessory-celebrate]');
  if(celebrate){
   if(soundActive){stop();detail.querySelector('.cosmetic-sound-hint').textContent='Preview stopped.';return;}
   stop();const id=selected,item=cosmeticGet(id),token=++audition;soundActive=true;soundButton(true);
   const ready=cosmeticHasSound(item)?await host.unlock?.():true;
   if(token!==audition||!dialog.open||selected!==id)return;
   preview?.celebrate({start:()=>{if(ready!==false&&cosmeticHasSound(item))host.sound?.(id);},soundDone:()=>!host.previewStatus?.()?.active,soundStatus:()=>host.previewStatus?.()});
   detail.querySelector('.cosmetic-sound-hint').textContent='Preview playing. Tap again to stop.';followSound();
   return;
  }
  if(!e.target.closest('[data-cosmetic-sound]'))return;
  if(soundActive){stop();detail.querySelector('.cosmetic-sound-hint').textContent='Preview stopped.';return;}
  const id=selected,token=++audition;soundActive=true;soundButton(true);
  const ready=await host.unlock?.();if(token!==audition||!dialog.open||selected!==id)return;
  if(ready!==false&&host.sound?.(id)){detail.querySelector('.cosmetic-sound-hint').textContent=isAudio()?'Previewing this '+label().toLowerCase()+' with the current music. Tap again to restore your equipped choice.':'Preview playing. Tap again to stop.';followSound();}
  else{stop();detail.querySelector('.cosmetic-sound-hint').textContent='Sound is muted or unavailable. Check Audio settings.';}
 });
 dialog.addEventListener('click',e=>{
  const choice=e.target.closest('[data-cosmetic]');
  if(choice){stop();libraryScroll=scroll.scrollTop;selected=choice.dataset.cosmetic;render();status.textContent='';scroll.scrollTop=0;back.focus({preventScroll:true});}
  else if(e.target.closest('[data-cosmetic-equip]')){stop();const item=cosmeticGet(selected),result=host.act({type:cosmeticOwned(host.profile(),item)?'equip-cosmetic':'buy-cosmetic',id:selected});render();status.textContent=result.ok?item.name+' equipped.':result.reason;const equip=detail.querySelector('[data-cosmetic-equip]');(equip.disabled?back:equip).focus({preventScroll:true});}
 });
 rememberView(dialog,'detail',()=>({selected,libraryScroll,view:views.value()}),state=>{const item=cosmeticGet(state?.selected);if(item?.kind===kind){selected=item.id;libraryScroll=Number.isFinite(state.libraryScroll)?state.libraryScroll:0;views.set(state.view);render();}},20);
 return {open(destination='trails'){stop();kind=destination==='music-themes'?'music':destination==='bounce-effects'?'bounce':destination==='pendants'?'pendant':destination==='companions'?'companion':'trail';selected=null;libraryScroll=0;host.screen(destination);document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
