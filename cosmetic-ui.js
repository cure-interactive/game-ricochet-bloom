import {COSMETICS,cosmeticHasSound,cosmeticGet,cosmeticLoadout,cosmeticOwned} from './cosmetic.js?v=7ec09556610ab987f7c5deb3143a3e4ba1da31461c131f3a4136838fa80ecdac';
import {cosmeticPreviewMount,cosmeticThumbnailMount} from './cosmetic-preview.js?v=2b229bf52d006d9550d38d66a6667530c0260090e4fbdad9df8eca97f29e2e69';
import {screenHeader} from './screen-header.js?v=2e096f2a79faa63185588495732061424d007cab358cb47837ed18fd2666ad3c';
import {buttonHTML,iconHTML} from './ui-icon.js?v=2fc20cc9221a523874a677a151fa2d76dd8dda2734129b3078e5c0d045e87188';
import {rarityIconHTML} from './skill-icon.js?v=6afe5816de6b88784292e9626ccd933b6ecd0972b8aa92b72f278a2865892f5a';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
export function cosmeticMount(host){
 let kind='trail',selected=null,preview=null,headingPreview=null,renderedKind='',audition=0,libraryScroll=0;const thumbnails=[];
 const dialog=document.createElement('dialog');dialog.id='cosmetic-dialog';dialog.setAttribute('aria-labelledby','cosmetic-title');
 dialog.innerHTML=screenHeader({icon:'trails',title:'Trails',titleId:'cosmetic-title',className:'skin-heading',back:buttonHTML('Back','arrow-left',{'data-cosmetic-back':true})})+`<div class="skin-scroll"><section class="skin-library"><p class="skin-intro"></p><div class="skin-grid"></div></section><section class="skin-detail" hidden><div class="cosmetic-preview-large"><canvas aria-label="Animated cosmetic preview"></canvas></div><section class="skin-selection cosmetic-detail"></section></section><p class="skin-status" role="status"></p></div>`;
 document.body.append(dialog);
 const back=dialog.querySelector('[data-cosmetic-back]'),detail=dialog.querySelector('.cosmetic-detail'),status=dialog.querySelector('.skin-status'),scroll=dialog.querySelector('.skin-scroll'),large=dialog.querySelector('.cosmetic-preview-large canvas');
 const heading=document.createElement('canvas');heading.className='cosmetic-heading-preview';heading.setAttribute('aria-hidden','true');dialog.querySelector('.screen-heading-title>.ui-icon').replaceWith(heading);
 const title=()=>kind==='trail'?'Trails':'Impacts';
 const stop=()=>{audition++;host.stopSound?.();};
 function render(){
  const profile=host.profile(),loadout=cosmeticLoadout(profile),item=selected?cosmeticGet(selected):null;
  dialog.querySelector('.skin-library').hidden=!!item;dialog.querySelector('.skin-detail').hidden=!item;scroll.classList.toggle('is-detail',!!item);
  dialog.querySelector('#cosmetic-title').textContent=item?.name||title();back.setAttribute('aria-label',item?'Back to '+title():'Back');
  dialog.querySelector('.skin-intro').textContent=`Choose ${kind==='trail'?'a trail':'an impact'} from Common to Mythic. Open a style to see it in motion before unlocking it with Points.`;
  if(renderedKind!==kind){
   for(const control of thumbnails)control.destroy();thumbnails.length=0;headingPreview?.destroy();renderedKind=kind;
   dialog.querySelector('.skin-grid').innerHTML=COSMETICS.filter(x=>x.kind===kind).map(x=>`<button type="button" class="skin-choice" data-cosmetic="${x.id}"><canvas class="cosmetic-thumbnail" aria-hidden="true"></canvas><strong>${escapeHTML(x.name)}</strong><span class="cosmetic-rarity">${rarityIconHTML(x.rarity)}${RARITIES[x.rarity].name}</span><span class="skin-choice-state"></span></button>`).join('');
   for(const canvas of dialog.querySelectorAll('.cosmetic-thumbnail'))thumbnails.push(cosmeticThumbnailMount(canvas,cosmeticGet(canvas.closest('[data-cosmetic]').dataset.cosmetic),{color:host.color,style:host.style}));
   headingPreview=cosmeticThumbnailMount(heading,()=>cosmeticGet(selected||cosmeticLoadout(host.profile())[kind]),{color:host.color,style:host.style,compact:true});
  }
  for(const button of dialog.querySelectorAll('[data-cosmetic]')){
   const x=cosmeticGet(button.dataset.cosmetic),owned=cosmeticOwned(profile,x),equipped=loadout[kind]===x.id;
   button.classList.toggle('is-equipped',equipped);button.classList.toggle('is-locked',!owned);
   button.setAttribute('aria-label',`View ${x.name}, ${equipped?'Equipped':owned?'Unlocked':'Locked'}`);
   button.querySelector('.skin-choice-state').innerHTML=iconHTML(equipped?'check':owned?'lock-open':'lock')+(equipped?'Equipped':owned?'Unlocked':x.cost+' Points');
  }
  if(!item)return;
  const owned=cosmeticOwned(profile,item),equipped=loadout[kind]===selected,points=profile.wallet.seeds;
  detail.classList.toggle('is-equipped',equipped);detail.style.setProperty('--skin-color',item.color);
  detail.innerHTML=`<div class="skin-selection-title">${iconHTML(equipped?'check':owned?'lock-open':'lock')}<div><small class="cosmetic-rarity">${rarityIconHTML(item.rarity)}${RARITIES[item.rarity].name} · ${kind==='trail'?'Trail':'Impact'}</small><h3>${escapeHTML(item.name)}</h3></div></div><p class="skin-unlock">${escapeHTML(item.description)}</p><button type="button" data-cosmetic-equip ${equipped||!owned&&points<item.cost?'disabled':''} class="skin-equip ${equipped?'is-equipped':''}">${iconHTML(equipped?'check':owned?(kind==='trail'?'trails':'bounce-effects'):'lock')}<span>${equipped?'Equipped':owned?'Equip '+(kind==='trail'?'Trail':'Impact'):'Unlock &amp; Equip · '+item.cost+' Points'}</span></button>${!owned?`<p class="cosmetic-wallet">${iconHTML('coin')}${points} Points${points<item.cost?' · '+(item.cost-points)+' more needed':''}</p>`:''}`;
  if(cosmeticHasSound(item))detail.insertAdjacentHTML('beforeend',`<button type="button" class="quiet cosmetic-sound-button" data-cosmetic-sound>${iconHTML('play')}<span>Preview Sound</span></button><small class="cosmetic-sound-hint" role="status">${item.kind==='trail'&&item.rarity==='mythic'?'Launch and travel · fades during the final second.':'Launch or impact accent.'} Follows master volume and mute.</small>`);
  preview ||=cosmeticPreviewMount(large,{loadout:()=>({...cosmeticLoadout(host.profile()),...(selected?{[kind]:selected}:{})}),color:host.color,style:host.style});
 }
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
  else if(e.target.closest('[data-cosmetic-equip]')){const item=cosmeticGet(selected),result=host.act({type:cosmeticOwned(host.profile(),item)?'equip-cosmetic':'buy-cosmetic',id:selected});render();status.textContent=result.ok?item.name+' equipped.':result.reason;const equip=detail.querySelector('[data-cosmetic-equip]');(equip.disabled?back:equip).focus({preventScroll:true});}
 });
 return {open(destination='trails'){stop();kind=destination==='bounce-effects'?'bounce':'trail';selected=null;libraryScroll=0;host.screen(destination);document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
