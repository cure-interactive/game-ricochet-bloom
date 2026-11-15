import {cosmeticGet,cosmeticLoadout} from './cosmetic.js?v=97b306ab42d46dc2f32ef73e7417114b7e4c554d3db716a4334c31895c9d8d32';
import {cosmeticThumbnailMount} from './cosmetic-preview.js?v=5bcce0eb71dcfa0a2670076c0c6fcf7ffc879a26eb35852f918016696d8de3d3';
import {profileName} from './profile.js?v=ff0d5bd39c348b5e77e65e08c9073076fa5df9194776f8a8ac297063482529da';
import {skinOptions} from './skin-ui.js?v=0abc679a44a5d9e3f9f6c6f4dc20875b3db32e761924c8e26245dcc66ece5438';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=dffa0b15172b1535b0849715aec10f240c6cdfbb50a479ee8ce195b254fee193';
import { screenHeader } from './screen-header.js?v=787a0f26e9ce958dd7fc39d6f8a8060e54493bdd6e428a4b02dc4cbf3e02b5f6';
import { buttonHTML } from './ui-icon.js?v=67494bc447e88045ecfb056d422d1fe9d650a74f0aeff78377a52630b16c73fb';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 let preview=null,currentSkin;const effectPreviews=[];
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({icon:'player-skin',className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><section class="player-viewer"><div class="player-viewer-preview"></div><div class="player-viewer-name"><button type="button" class="player-name-label"></button><input class="player-name-input" aria-label="Player name" maxlength="32" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" hidden></div><p class="sr-only player-name-status" role="status" aria-live="polite"></p></section><nav class="player-menu-options" aria-label="Player options"><section aria-labelledby="player-appearance-title"><h3 id="player-appearance-title">Appearance</h3><div class="player-menu-actions player-appearance">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}<button type="button" data-player-open="trails"><canvas class="player-effect-thumbnail" data-kind="trail" aria-hidden="true"></canvas><span>Trails</span></button><button type="button" data-player-open="bounce-effects"><canvas class="player-effect-thumbnail" data-kind="bounce" aria-hidden="true"></canvas><span>Impacts</span></button></div></section><div class="player-menu-actions player-progress" aria-label="Skills and stats">${buttonHTML('Skills','skill-tree',{'data-player-open':'skills'})}${buttonHTML('Stats','stats',{'data-player-open':'stats'})}</div></nav></div>`;
 document.body.append(dialog);const back=dialog.querySelector('[data-player-back]');
 const nameButton=dialog.querySelector('.player-name-label'),nameInput=dialog.querySelector('.player-name-input'),nameStatus=dialog.querySelector('.player-name-status');
 let editing=false;
 const currentName=()=>profileName(host.profile?.()||host.get().profile);
 function nameRender(){const name=currentName();nameButton.textContent=name;nameButton.setAttribute('aria-label','Edit player name: '+name);nameInput.value=name;dialog.querySelector('.player-viewer-preview [aria-label]')?.setAttribute('aria-label',`${name==='Player'?'Your':name} player preview. Drag or tap to bounce; arrow keys also move it.`);}
 function finishName(save,restoreFocus=false){
  if(!editing)return;editing=false;
  const name=nameInput.value.trim();
  const result=save&&name&&name!==currentName()?host.rename(name):{ok:true};
  nameStatus.textContent=result.ok?'':result.reason;
  nameInput.hidden=true;nameButton.hidden=false;nameRender();
  if(restoreFocus)nameButton.focus({preventScroll:true});
 }
 nameButton.onclick=()=>{nameRender();nameStatus.textContent='';editing=true;nameButton.hidden=true;nameInput.hidden=false;nameInput.focus({preventScroll:true});nameInput.select();};
 nameInput.addEventListener('blur',()=>finishName(true));
 nameInput.addEventListener('keydown',event=>{if(event.isComposing)return;if(event.key==='Enter'||event.key==='Escape'){event.preventDefault();event.stopPropagation();finishName(event.key==='Enter',true);}});
 back.onclick=()=>{finishName(true);host.back();};dialog.addEventListener('cancel',e=>{e.preventDefault();if(editing)finishName(false,true);else host.back();});
 dialog.addEventListener('click',e=>{const destination=e.target.closest('[data-player-open]')?.dataset.playerOpen;if(destination){finishName(true);host.open(destination);}});

 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());const skin=skinOptions(host.get()).find(s=>s.equipped)||skinOptions(host.get())[0];
  dialog.style.setProperty('--skin-color',skin.color);dialog.style.setProperty('--skin-style',skin.style||'original');editing=false;nameInput.hidden=true;nameButton.hidden=false;nameStatus.textContent='';nameRender();
  const surface=dialog.querySelector('.player-viewer-preview');if(!preview)surface.innerHTML=skinPreviewHTML(currentName());nameRender();
  currentSkin=skin;if(!effectPreviews.length)for(const canvas of dialog.querySelectorAll('.player-effect-thumbnail'))effectPreviews.push(cosmeticThumbnailMount(canvas,()=>cosmeticGet(cosmeticLoadout(host.profile?.()||host.get().profile)[canvas.dataset.kind]),{color:()=>currentSkin.color,style:()=>currentSkin.style}));
  preview ||=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
