import { GAME_VERSION } from './version.js?v=58eb9d7c529f68e2fca0bbe3565b8e7d4e7447df8ebe482fa4f52f8cd049721c';

// Home and Pause share the game's identity and version presentation.
export function menuTitleHTML(){
  return `<h1>Ricochet<br><span>Bloom</span><small class="home-version" aria-label="Version ${GAME_VERSION}">v${GAME_VERSION}</small></h1>`;
}
