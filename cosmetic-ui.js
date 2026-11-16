import {segmentedHTML,segmentedMount} from './segmented-control.js?v=1a318092255fb007cafc5d85b01f9155f2a6962c7558c1623c1ab76b7ad5f298';
import {cosmeticPriceHTML} from './cosmetic-price.js?v=9a0d945c37ceec5a2b10b4895eb976d64b35aa18bd76a070f26a9e457d59dc97';
import {COSMETICS,cosmeticHasSound,cosmeticGet,cosmeticLoadout,cosmeticOwned} from './cosmetic.js?v=d1d645c2cb1e77c1ae227eac07869113efb83df2de1d21c30e530c67252d96c7';
import {cosmeticPreviewMount,cosmeticThumbnailMount} from './cosmetic-preview.js?v=3a8fb581790496471bc0ba0b420c1dea49ef881da791f6bcab5299d573aab2eb';
import {screenHeader} from './screen-header.js?v=786f504b0d8e7c345d1c30428db16e12dc5b1c2513f004bec1c0c4c0b2618c9a';
import {buttonHTML,iconHTML,staticIconHTML} from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';
import {rarityIconHTML} from './skill-icon.js?v=30e163fa7cf9ecff14317a409c1038691cee610af060f411d678d628dacc7f96';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
export function cosmeticMount(host){
 let kind='trail',selected=null,preview=null,renderedKind='',audition=0,libraryScroll=0;const thumbnails=[];
 const dialog=document.createElement('dialog');dialog.id='cosmetic-dialog';dialog.setAttribute('aria-labelledby','cosmetic-title');
 dialog.innerHTML=screenHeader({icon:'trails',title:'Trails',titleId:'cosmetic-title',className:'skin-heading',back:buttonHTML('Back','arrow-left',{'data-cosmetic-back':true})})+`<div class="skin-scroll"><section class="skin-library">${segmentedHTML([['music','Instruments','music-note'],['soundstage','Soundstages','sound'],['ambience','Ambience','wave']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-music-category':id,'aria-pressed':id==='music'})),{label:'Music categories',current:'music',className:'music-category'})}<p class="skin-intro"></p><div class="skin-grid"></div></section><section class="skin-detail" hidden><div class="cosmetic-preview-large"><canvas aria-label="Animated cosmetic preview"></canvas></div><section class="skin-selection cosmetic-detail"></section></section><p class="skin-status" role="status"></p></div>`;
 document.body.append(dialog);
 const back=dialog.querySelector('[data-cosmetic-back]'),detail=dialog.querySelector('.cosmetic-detail'),status=dialog.querySelector('.skin-status'),scroll=dialog.querySelector('.skin-scroll'),large=dialog.querySelector('.cosmetic-preview-large canvas');
 let heading=dialog.querySelector('.screen-heading-title>.ui-icon');
 const isAudio=()=>['music','soundstage','ambience'].includes(kind);
 const title=()=>isAudio()?'Music':kind==='trail'?'Trails':'Impacts';
 const label=()=>({music:'Instrument',soundstage:'Soundstage',ambience:'Ambience'}[kind])||(kind==='trail'?'Trail':'Impact');
 const glyph=()=>isAudio()?'music-note':kind==='trail'?'trails':'bounce-effects';
 const musicArt=item=>`<div class="music-theme-art" style="--theme-color:${item.color}" aria-hidden="true">${iconHTML(item.kind==='soundstage'?'sound':item.kind==='ambience'?'wave':'music-note')}<span>${[.4,.7,1,.6,.85].map(h=>`<i style="--bar-height:${h}"></i>`).join('')}</span></div>`;
 const stop=()=>{audition++;host.stopSound?.();};
 function render(){
  if(heading.dataset.icon!==glyph()){heading.outerHTML=iconHTML(glyph());heading=dialog.querySelector('.screen-heading-title>.ui-icon');}
  const profile=host.profile(),loadout=cosmeticLoadout(profile),item=selected?cosmeticGet(selected):null;
  dialog.querySelector('.skin-library').hidden=!!item;dialog.querySelector('.skin-detail').hidden=!item;scroll.classList.toggle('is-detail',!!item);
  dialog.querySelector('#cosmetic-title').textContent=item?.name||title();back.setAttribute('aria-label',item?'Back to '+title():'Back');
  const tabs=dialog.querySelector('.music-category');tabs.hidden=!isAudio();tabs.dataset.current=kind;for(const button of tabs.querySelectorAll('button'))button.setAttribute('aria-pressed',button.dataset.musicCategory===kind);categories.refresh();
  dialog.querySelector('.skin-intro').textContent=isAudio()?({music:'Choose the instruments that voice your melody.',soundstage:'Choose the acoustic space around your instruments.',ambience:'Choose a quiet background atmosphere to accompany your music.'}[kind])+' Preview before purchasing. Each Music category equips independently.':`Choose ${kind==='trail'?'a trail':'an impact'} from Common to Mythic. Open a style to see it in motion before unlocking it with Points.`;

  heading.style.setProperty('--cosmetic-id',selected||loadout[kind]);heading.style.setProperty('--skin-color',host.color?.()||'#f1f9d7');heading.style.setProperty('--skin-style',host.style?.()||'original');
  if(renderedKind!==kind){
   for(const control of thumbnails)control.destroy();thumbnails.length=0;renderedKind=kind;
   dialog.querySelector('.skin-grid').innerHTML=COSMETICS.filter(x=>x.kind===kind).map(x=>`<button type="button" class="skin-choice" data-cosmetic="${x.id}">${isAudio()?musicArt(x):'<span class="cosmetic-thumbnail-slot"><canvas class="cosmetic-thumbnail" aria-hidden="true"></canvas></span>'}<strong>${escapeHTML(x.name)}</strong><span class="cosmetic-rarity">${rarityIconHTML(x.rarity)}${RARITIES[x.rarity].name}</span><span class="skin-choice-state"></span><span class="cosmetic-price-slot"></span></button>`).join('');
   for(const canvas of dialog.querySelectorAll('.cosmetic-thumbnail'))thumbnails.push(cosmeticThumbnailMount(canvas,cosmeticGet(canvas.closest('[data-cosmetic]').dataset.cosmetic),{color:host.color,style:host.style,surface:canvas.parentElement}));
  }
  for(const button of dialog.querySelectorAll('[data-cosmetic]')){
   const x=cosmeticGet(button.dataset.cosmetic),owned=cosmeticOwned(profile,x),equipped=loadout[kind]===x.id;
   button.classList.toggle('is-equipped',equipped);button.classList.toggle('is-locked',!owned);
   button.setAttribute('aria-label',`View ${x.name}, ${equipped?'Equipped':owned?'Unlocked':'Locked'}`);
   button.querySelector('.cosmetic-price-slot').innerHTML=cosmeticPriceHTML(x,owned,host.showPurchasedCosts?.());
   button.querySelector('.skin-choice-state').innerHTML=iconHTML(equipped?'check':owned?'lock-open':'lock')+(equipped?'Equipped':owned?'Unlocked':x.cost+' Points');
  }
  if(!item)return;
  const owned=cosmeticOwned(profile,item),equipped=loadout[kind]===selected,points=profile.wallet.seeds;
  detail.classList.toggle('is-equipped',equipped);detail.style.setProperty('--skin-color',item.color);
  detail.innerHTML=`<div class="skin-selection-title">${iconHTML(equipped?'check':owned?'lock-open':'lock')}<div><small class="cosmetic-rarity">${rarityIconHTML(item.rarity)}${RARITIES[item.rarity].name} · ${label()}</small><h3>${escapeHTML(item.name)}</h3></div></div><p class="skin-unlock">${escapeHTML(item.description)}</p>${cosmeticPriceHTML(item,owned,host.showPurchasedCosts?.())}<button type="button" data-cosmetic-equip ${equipped||!owned&&points<item.cost?'disabled':''} class="skin-equip ${equipped?'is-equipped':''}">${staticIconHTML(equipped?'check':owned?glyph():'lock')}<span>${equipped?'Equipped':owned?'Equip '+label():'Unlock &amp; Equip · '+item.cost+' Points'}</span></button>${!owned?`<p class="cosmetic-wallet">${iconHTML('coin')}${points} Points${points<item.cost?' · '+(item.cost-points)+' more needed':''}</p>`:''}`;
  if(cosmeticHasSound(item))detail.insertAdjacentHTML('beforeend',`<button type="button" class="quiet cosmetic-sound-button" data-cosmetic-sound>${iconHTML('play')}<span>${isAudio()?'Preview Sound':'Preview Sound'}</span></button><small class="cosmetic-sound-hint" role="status">${isAudio()?'A six-second sample of this selection with your other equipped Music layers. Follows Music volume, master volume and mute.':(item.kind==='trail'&&item.rarity==='mythic'?'Launch and travel · fades during the final second.':'Launch or impact accent.')+' Follows master volume and mute.'}</small>`);
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
 dialog.addEventListener('click',async e=>{if(!e.target.closest('[data-cosmetic-sound]'))return;const id=selected,token=++audition;host.stopSound?.();const ready=await host.unlock?.();if(token!==audition||!dialog.open||selected!==id)return;detail.querySelector('.cosmetic-sound-hint').textContent=ready!==false&&host.sound?.(id)?'Sound preview started. Tap to replay.':'Sound is muted or unavailable. Check Audio settings.';});
 dialog.addEventListener('click',e=>{
  const choice=e.target.closest('[data-cosmetic]');
  if(choice){stop();libraryScroll=scroll.scrollTop;selected=choice.dataset.cosmetic;render();status.textContent='';scroll.scrollTop=0;back.focus({preventScroll:true});}
  else if(e.target.closest('[data-cosmetic-equip]')){stop();const item=cosmeticGet(selected),result=host.act({type:cosmeticOwned(host.profile(),item)?'equip-cosmetic':'buy-cosmetic',id:selected});render();status.textContent=result.ok?item.name+' equipped.':result.reason;const equip=detail.querySelector('[data-cosmetic-equip]');(equip.disabled?back:equip).focus({preventScroll:true});}
 });
 return {open(destination='trails'){stop();kind=destination==='music-themes'?'music':destination==='bounce-effects'?'bounce':'trail';selected=null;libraryScroll=0;host.screen(destination);document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
