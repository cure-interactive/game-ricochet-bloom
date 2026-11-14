import {skinOptions} from './skin-ui.js?v=567ca76f028c9d2668a1b0ad6bb9eb1ef03d3791ce37c0945bb71846a67f2e0e';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=53af67f29d668b6e357b87f461b569b823466d27fd5cac0b9c35aa70460da85f';
import { screenHeader } from './screen-header.js?v=97e7bd37ef6eedf0b994bfdd65619d8772e5f7f1cbb1b236ef426b2bb37144f4';
import { buttonHTML } from './ui-icon.js?v=4d4624a19042310239e24c63a77cac78d6ea0211b7729b424db194db73b5cb52';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 let preview=null;
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({icon:'player-skin',className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><section class="player-viewer"><div class="player-viewer-preview"></div><h3 class="player-viewer-name"></h3><p class="player-viewer-caption">Equipped Skin</p><p class="player-viewer-hint">Drag or tap your player</p></section><nav class="player-menu-actions" aria-label="Player options">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}${buttonHTML('Stats','stats',{'data-player-open':'stats'})}${buttonHTML('Skills','skill-tree',{'data-player-open':'skills'})}</nav></div>`;
 document.body.append(dialog);const back=dialog.querySelector('[data-player-back]');
 back.onclick=()=>host.back();dialog.addEventListener('cancel',e=>{e.preventDefault();host.back();});
 dialog.addEventListener('click',e=>{const destination=e.target.closest('[data-player-open]')?.dataset.playerOpen;if(destination)host.open(destination);});
 dialog.addEventListener('close',()=>{if(!dialog.open){preview?.destroy();preview=null;}});
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());preview?.destroy();const skin=skinOptions(host.get()).find(s=>s.equipped)||skinOptions(host.get())[0];
  dialog.style.setProperty('--skin-color',skin.color);dialog.querySelector('.player-viewer-name').textContent=skin.name;
  const surface=dialog.querySelector('.player-viewer-preview');surface.innerHTML=skinPreviewHTML(skin.name);
  preview=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
