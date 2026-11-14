import {profileName} from './profile.js?v=949a2b3900c5567be5390d6c1b0174be5fa8cc4c7a2aad535b856bd343160163';
import {skinOptions} from './skin-ui.js?v=783de86e37e9b5a7d5f9eaa85e0816af5a8064a763c614a71c500a37e0d2136c';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=53af67f29d668b6e357b87f461b569b823466d27fd5cac0b9c35aa70460da85f';
import { screenHeader } from './screen-header.js?v=883c141deaf0d60097c4b99c555371897614dfd0bde5d3229b4a41e5450222e0';
import { buttonHTML } from './ui-icon.js?v=6ec8a4ba31addd578a8b719304a1ec4bd9a40353abff6d30f299787bf0d2481c';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 let preview=null;
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({icon:'player-skin',className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><section class="player-viewer"><div class="player-viewer-preview"></div><div class="player-viewer-name"><button type="button" class="player-name-label"></button><input class="player-name-input" aria-label="Player name" maxlength="32" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" hidden></div><p class="sr-only player-name-status" role="status" aria-live="polite"></p></section><nav class="player-menu-actions" aria-label="Player options">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}${buttonHTML('Stats','stats',{'data-player-open':'stats'})}${buttonHTML('Skills','skill-tree',{'data-player-open':'skills'})}</nav></div>`;
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
 dialog.addEventListener('close',()=>{if(!dialog.open){preview?.destroy();preview=null;}});
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());preview?.destroy();const skin=skinOptions(host.get()).find(s=>s.equipped)||skinOptions(host.get())[0];
  dialog.style.setProperty('--skin-color',skin.color);editing=false;nameInput.hidden=true;nameButton.hidden=false;nameStatus.textContent='';nameRender();
  const surface=dialog.querySelector('.player-viewer-preview');surface.innerHTML=skinPreviewHTML(currentName());nameRender();
  preview=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
