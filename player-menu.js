import {skinOptions} from './skin-ui.js?v=cf7b942816cb8b507a0cc9360dcba128ba745d5bed84ec44263a930dd49c4a72';
import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=20b9a6e6dcb6c0b1f5182adc72ed0282dd864528b6ea26ed11621b0dca8ee442';
import { screenHeader } from './screen-header.js?v=b12f4a7f643a7ebc5d8945f2671aead3040da9be729bee110404af53f14e24e0';
import { buttonHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 let preview=null;
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><section class="player-viewer"><div class="player-viewer-preview"></div><h3 class="player-viewer-name"></h3><p class="player-viewer-caption">Equipped Skin</p><p class="player-viewer-hint">Drag or tap your player</p></section><nav class="player-menu-actions" aria-label="Player options">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}${buttonHTML('Stats','player-skin',{'data-player-open':'stats'})}${buttonHTML('Skills','player-skin',{'data-player-open':'skills'})}</nav></div>`;
 document.body.append(dialog);const back=dialog.querySelector('[data-player-back]');
 back.onclick=()=>host.back();dialog.addEventListener('cancel',e=>{e.preventDefault();host.back();});
 dialog.addEventListener('click',e=>{const destination=e.target.closest('[data-player-open]')?.dataset.playerOpen;if(destination)host.open(destination);});
 dialog.addEventListener('close',()=>{if(!dialog.open){preview?.destroy();preview=null;}});
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());preview?.destroy();const skin=skinOptions(host.get()).find(s=>s.equipped)||skinOptions(host.get())[0];
  dialog.style.setProperty('--skin-color',skin.color);dialog.querySelector('.player-viewer-name').textContent=skin.name;
  const surface=dialog.querySelector('.player-viewer-preview');surface.innerHTML=skinPreviewHTML(skin.name);
  preview=skinPreviewMount(surface.firstElementChild,{gentle:host.gentle});dialog.showModal();back.focus({preventScroll:true});}};
}
