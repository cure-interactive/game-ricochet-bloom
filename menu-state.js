const homeScreens=new Set(['home','gamemodes','trial-setup','score-setup','experiment-hub','experiment-family','experiment-detail']);
const overlayScreens=new Set(['levels','player','stats','trails','bounce-effects','music-themes','tree','skins','player-upgrades','wiki','help','settings']);
function activityAt(name){
  if(name==='drift'||name==='drift-pause')return 'casual';
  if(name==='play'||name==='pause')return 'play';
  if(name==='trial')return 'trial';
  if(homeScreens.has(name)||name.startsWith('gamemodes:')||name.startsWith('pool-setup:'))return 'home';
  return null;
}
// The path retains the caller beneath an overlay. Settings over a paused pool
// and Settings over Home therefore do not need competing presentation flags.
export function menuView(path){
  const screen=path.at(-1)||'home',activity=[...path].reverse().map(activityAt).find(Boolean)||'home';
  const casual=activity==='casual',homeMode=casual||activity==='home';
  return {screen,activity,casual,homeMode,menuMode:screen==='drift'?'drift':homeMode&&!casual?'home':'play',homeVisible:screen==='home',backdropVisible:homeMode||screen==='pause',backgroundActive:homeMode&&(!casual||screen==='drift'),backgroundAmbient:homeMode,playInput:screen==='play',suspend:screen!=='play',suspendAmbient:!homeMode&&!casual};
}
export function menuDismiss(path){
  const view=menuView(path);if(['home','play','drift'].includes(view.screen))return null;
  return view.activity==='play'?'pause':view.casual?'drift-pause':'home';
}
export function menuRestorePath(pages){
  const path=pages.filter(name=>typeof name==='string'&&(homeScreens.has(name)||overlayScreens.has(name)||['play','pause','drift','drift-pause'].includes(name)||/^gamemodes:/.test(name)||/^pool-setup:(free|waves|challenge)$/.test(name)));
  if(path.at(-1)==='play')path[path.length-1]='pause';
  if(path.at(-1)==='drift')path[path.length-1]='drift-pause';
  return path;
}
