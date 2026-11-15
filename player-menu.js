import {profileName} from './profile.js?v=158288c80ff606a4bc820da33ab77138b46da32e904b28186088233dd839191d';
import {skinOptions} from './skin-ui.js?v=02588eabca6d64f5bc8ba94ded29fdf41438910edb1f89c5f92afdbc59d9c39c';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=e6fa5d2b4812a18e495e4f673ba1d1c774eb5140702e19298017892c8fe38991';
import { screenHeader } from './screen-header.js?v=ba224017463f62dbe26bd5a9cb443d01adafd0b81d74353ddee29501d9701838';
import { buttonHTML } from './ui-icon.js?v=0bef764d102dc0e159800242f682b3d49abfbf27a976ab9ca47f0d10b1c82188';

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

 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());const skin=skinOptions(host.get()).find(s=>s.equipped)||skinOptions(host.get())[0];
  dialog.style.setProperty('--skin-color',skin.color);editing=false;nameInput.hidden=true;nameButton.hidden=false;nameStatus.textContent='';nameRender();
  const surface=dialog.querySelector('.player-viewer-preview');if(!preview)surface.innerHTML=skinPreviewHTML(currentName());nameRender();
  preview ||=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
