import {profileName} from './profile.js?v=6e2f55bc3e634f44abda0bba37ac84a494ca47497058fe0850adbf1df9ec6610';
import {skinOptions} from './skin-ui.js?v=8e680b8a4a1ccfdc7c56c80fe98fe421cc8b0436e6ad80e40f66adc2eedd9820';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=589afccbde94ea3151bcf119a929aca8430cd8adfc584bf88b1add584a8621a2';
import { screenHeader } from './screen-header.js?v=7db753fa19626839b08a41fd5d2583821cbc0774ad262a06dd328bb3f050c988';
import { buttonHTML } from './ui-icon.js?v=35ef67d69b283afcc7c65c45f76a6dee06daf0fc829eafd4dff245d7c24940c0';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 let preview=null;
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({icon:'player-skin',className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><section class="player-viewer"><div class="player-viewer-preview"></div><div class="player-viewer-name"><button type="button" class="player-name-label"></button><input class="player-name-input" aria-label="Player name" maxlength="32" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" hidden></div><p class="sr-only player-name-status" role="status" aria-live="polite"></p></section><nav class="player-menu-options" aria-label="Player options"><section aria-labelledby="player-appearance-title"><h3 id="player-appearance-title">Personalize</h3><div class="player-menu-actions player-appearance">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}${buttonHTML('Trails','trails',{'data-player-open':'trails'})}${buttonHTML('Impacts','bounce-effects',{'data-player-open':'bounce-effects'})}${buttonHTML('Music','music-note',{'data-player-open':'music-themes'})}</div></section><div class="player-menu-actions player-progress" aria-label="Skills and stats">${buttonHTML('Skills','skill-tree',{'data-player-open':'skills'})}${buttonHTML('Stats','stats',{'data-player-open':'stats'})}</div></nav></div>`;
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
  preview ||=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
