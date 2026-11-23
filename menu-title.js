import { GAME_VERSION } from './version.js?v=30ade659e57e3c872c97f170da462b5741e6e0f8bdc62ed12109054546253fc0';

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
