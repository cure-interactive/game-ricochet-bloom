import { screenHeader } from './screen-header.js?v=b12f4a7f643a7ebc5d8945f2671aead3040da9be729bee110404af53f14e24e0';
import { buttonHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';

// Player destinations share the game's existing screen history and profile.
export function playerMenuMount(host){
 const dialog=document.createElement('dialog');dialog.id='player-menu-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-menu-title');
 dialog.innerHTML=screenHeader({className:'dialog-heading',title:'Player',titleId:'player-menu-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+`<div class="dialog-body player-menu-body"><nav class="player-menu-actions" aria-label="Player options">${buttonHTML('Skins','player-skin',{'data-player-open':'skins'})}${buttonHTML('Stats','player-skin',{'data-player-open':'stats'})}${buttonHTML('Skills','player-skin',{'data-player-open':'skills'})}</nav></div>`;
 document.body.append(dialog);const back=dialog.querySelector('[data-player-back]');
 back.onclick=()=>host.back();dialog.addEventListener('cancel',e=>{e.preventDefault();host.back();});
 dialog.addEventListener('click',e=>{const destination=e.target.closest('[data-player-open]')?.dataset.playerOpen;if(destination)host.open(destination);});
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());dialog.showModal();back.focus({preventScroll:true});}};
}
