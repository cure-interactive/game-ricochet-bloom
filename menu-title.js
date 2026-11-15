import { GAME_VERSION } from './version.js?v=3ed107c76a952c8b9d29d4ded04b7587319149a8b7d676a48e2ec757b176a636';

// Home and Pause share the game's identity and version presentation.
export function menuTitleHTML(){
  return `<h1>Ricochet<br><span>Bloom</span><small class="home-version" aria-label="Version ${GAME_VERSION}">v${GAME_VERSION}</small></h1>`;
}

// Both destinations keep their own actions but use the same DOM and layout.
export function menuLayoutMount(container){
 const heading=container.ownerDocument.createElement('div');heading.className='menu-heading';heading.innerHTML=menuTitleHTML();
 const mode=container.querySelector('#menu-mode');if(mode)heading.append(mode);
 const actions=container.querySelector('.home-actions');
 container.replaceChildren(heading,actions);container.classList.add('home-content','menu-layout');
}
