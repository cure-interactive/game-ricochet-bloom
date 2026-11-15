import {cosmeticGet,cosmeticLoadout} from './cosmetic.js?v=b8028cde82f815bfb83549964463189b74fb01825596e5000f4c12401aa3ae76';
import {cosmeticThumbnail} from './cosmetic-preview.js?v=07f88a16f68b00c2f12549f5b9e30902cc4b8a8f575da1013f3d59a0c970da8a';
import {profileName} from './profile.js?v=35ee447af313fddd4644b3ddab21f1d923caeb0ab83ece6417e1b84c61b8fe01';
import {skinOptions} from './skin-ui.js?v=47c616fc64826a7d44e3ddb4f3455d3e0b786451b1f4279323fccf742e37e2a0';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=f6a2f88366df07d470289950dc3f210a87107edc99259fc29ce505ba69a2567a';
import { screenHeader } from './screen-header.js?v=15bce8133223b9e41fb2955f06dcf847cc767d4f64307c602442b86117ae056e';
import { buttonHTML } from './ui-icon.js?v=8551bed13f7a48d36a919c6b5d9290c16f3a19271f3ead8585eb9fdb1abdae6b';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 let preview=null;
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({icon:'player-skin',className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><section class="player-viewer"><div class="player-viewer-preview"></div><div class="player-viewer-name"><button type="button" class="player-name-label"></button><input class="player-name-input" aria-label="Player name" maxlength="32" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" hidden></div><p class="sr-only player-name-status" role="status" aria-live="polite"></p></section><nav class="player-menu-options" aria-label="Player options"><section aria-labelledby="player-appearance-title"><h3 id="player-appearance-title">Appearance</h3><div class="player-menu-actions player-appearance">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}<button type="button" data-player-open="trails"><canvas class="player-effect-thumbnail" data-kind="trail" aria-hidden="true"></canvas><span>Trails</span></button><button type="button" data-player-open="bounce-effects"><canvas class="player-effect-thumbnail" data-kind="bounce" aria-hidden="true"></canvas><span>Bounces</span></button></div></section><div class="player-menu-actions player-progress" aria-label="Skills and stats">${buttonHTML('Skills','skill-tree',{'data-player-open':'skills'})}${buttonHTML('Stats','stats',{'data-player-open':'stats'})}</div></nav></div>`;
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
  const loadout=cosmeticLoadout(host.profile?.()||host.get().profile);for(const canvas of dialog.querySelectorAll('.player-effect-thumbnail'))cosmeticThumbnail(canvas,cosmeticGet(loadout[canvas.dataset.kind]),{color:skin.color,style:skin.style});
  preview ||=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
