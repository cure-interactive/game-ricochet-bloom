import { GAME_VERSION } from './version.js?v=81428a02c78d7a5b6f6e53d368ea40b885ec90eb0c483ccb001e0f7484c10973';

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
