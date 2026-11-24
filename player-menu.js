import {cosmeticLoadout} from './cosmetic.js?v=50f26a8ecaed06f42769edbf9c8dd50c2a0fa896dce11e53d36ad78d1830d695';
import {profileName} from './profile.js?v=c192410727d8e5933b09661146a0fac9abdafa7425c3f801b75128ef20add4f6';
import {skinOptions} from './skin-ui.js?v=5c348fc8450544f336053455a3781f0595ecc496412d8e64b58c3a78eddd5375';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=208b099e60570883bba34fe5e670ffca5c81f12a01a2ef6b663936fd7ce70c0b';
import { screenHeader } from './screen-header.js?v=d1513f31ab835f2c43467db0e97fef3d67705455d468cb953f3922cb68111868';
import { buttonHTML } from './ui-icon.js?v=d474ef06c45d7ef2761594a09b8c5b635d07a809b7079341c6eff82cc037544a';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 let preview=null;
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({icon:'player-skin',className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><section class="player-viewer"><div class="player-viewer-preview"></div><div class="player-viewer-name"><button type="button" class="player-name-label"></button><input class="player-name-input" aria-label="Player Name" maxlength="32" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" hidden></div><p class="sr-only player-name-status" role="status" aria-live="polite"></p></section><nav class="player-menu-options" aria-label="Player Options"><section aria-labelledby="player-appearance-title"><h3 id="player-appearance-title">Personalize</h3><div class="player-menu-actions player-appearance">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}${buttonHTML('Trails','trails',{'data-player-open':'trails'})}${buttonHTML('Impacts','bounce-effects',{'data-player-open':'bounce-effects'})}${buttonHTML('Pendants','pendants',{'data-player-open':'pendants'})}${buttonHTML('Companions','companions',{'data-player-open':'companions'})}${buttonHTML('Music','music-note',{'data-player-open':'music-themes'})}</div></section><div class="player-menu-actions player-progress" aria-label="Skills and Stats">${buttonHTML('Skills','skill-tree',{'data-player-open':'skills'})}${buttonHTML('Stats','stats',{'data-player-open':'stats'})}</div></nav></div>`;
 document.body.append(dialog);const back=dialog.querySelector('[data-player-back]');
 const nameButton=dialog.querySelector('.player-name-label'),nameInput=dialog.querySelector('.player-name-input'),nameStatus=dialog.querySelector('.player-name-status');
 let editing=false;
 const currentName=()=>profileName(host.profile?.()||host.get().profile);
 function nameRender(){const name=currentName();nameButton.textContent=name;nameButton.setAttribute('aria-label','Edit Player Name: '+name);nameInput.value=name;dialog.querySelector('.player-viewer-preview [aria-label]')?.setAttribute('aria-label',`${name==='Player'?'Your':name} player preview. Drag or tap to bounce; arrow keys also move it.`);}
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
  const loadout=cosmeticLoadout(host.profile?.()||host.get().profile);dialog.classList.toggle('has-accessories',loadout.pendant!=='pendant.none'||loadout.companion!=='companion.none');
  const surface=dialog.querySelector('.player-viewer-preview');if(!preview)surface.innerHTML=skinPreviewHTML(currentName());nameRender();surface.querySelector('player-bubble').setAttribute('accessories','');
  preview ||=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
