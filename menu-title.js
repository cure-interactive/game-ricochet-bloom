import { GAME_VERSION } from './version.js?v=8cec38d39191d4853b49b42b85b57375c5c2cec92850b260791038978e2e7159';

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
