import { buttonLabel } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const appView=win=>!!win.navigator?.standalone||!!win.matchMedia?.('(display-mode: standalone)').matches;
// Capability and actual browser state, never screen size, decide this action.
export function fullscreenState(doc, win) {
  const active=!!(doc.fullscreenElement||doc.webkitFullscreenElement),root=doc.documentElement;
  const supported=typeof root.requestFullscreen==='function'?doc.fullscreenEnabled!==false:typeof root.webkitRequestFullscreen==='function'&&doc.webkitFullscreenEnabled!==false;
  if(active)return {action:'exit',label:'Exit full screen',icon:'fullscreen-disable'};
  if(win.matchMedia?.('(display-mode: fullscreen)').matches)return {action:'help',label:'Full screen active',icon:'fullscreen-disable',browser:true};
  if(supported)return {action:'enter',label:'Enter full screen',icon:'fullscreen-enable'};
  return {action:'help',label:'Full screen unavailable',icon:'fullscreen-enable'};
}

export function displayOptions(doc,win) {
  const state=fullscreenState(doc,win),nav=win.navigator||{},ua=nav.userAgent||'';
  const apple=/iPhone|iPad|iPod/.test(ua)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);
  const android=/Android/.test(ua),mac=!apple&&/Mac/.test(nav.platform||ua);
  const safari=mac&&/Safari/.test(ua)&&!/Chrome|Chromium|Edg|OPR/.test(ua);
  const installed=appView(win),mode=state.action==='exit'||state.browser?'Full screen':installed?'App view':'Browser view';
  const description=state.action==='exit'?'Full screen is on. Leave it here or use your browser’s exit command.':state.browser?'Your browser controls this full-screen view. Use its full-screen command to leave.':state.action==='enter'?'Hide browser controls for this session. You can return to this view at any time.':'This browser does not allow the game to enter full screen. App view is a separate option below.';
  if(installed)return {mode,description,title:'App view is active',copy:'You opened the game from its app icon. Your device may still show a status bar or home indicator.',steps:[],open:true};
  if(apple)return {mode,description,title:'Add to Home Screen',copy:'Launch from the Home Screen to play without Safari’s toolbar.',steps:['Open this game in Safari.','Open Share (inside the browser menu if needed), then choose Add to Home Screen.','Keep Open as Web App enabled if shown, then tap Add.','Open Ricochet Bloom from its new Home Screen icon.'],open:state.action==='help'};
  if(android)return {mode,description,title:'Install on your Home Screen',copy:'An app window is another way to play with fewer browser controls.',steps:['Open this game in Chrome.','Open the browser menu and choose Install and create shortcut → Install, if offered. Some versions call this Install app or Add to Home screen.','Follow the browser’s instructions, then launch the game from its app icon.'],open:state.action==='help'};
  if(safari)return {mode,description,title:'Add to Dock',copy:'On macOS Sonoma or later, Safari can open the game in its own app window.',steps:['In Safari, choose File → Add to Dock (or Share → Add to Dock).','Choose Add, then open Ricochet Bloom from the Dock or Applications.'],open:state.action==='help'};
  return {mode,description,title:'Play in an app window',copy:'App installation depends on your browser. It is separate from full screen.',steps:['Look for an install icon in the address bar, or an Install app option in your browser menu.','If offered, follow the browser’s instructions and launch the game from its new app shortcut.','You can also use your browser’s own full-screen command in its menu.'],open:state.action==='help'};
}

export async function fullscreenToggleAsync(doc, win) {
  const state=fullscreenState(doc,win);
  try {
    if(state.action==='exit')await (doc.exitFullscreen||doc.webkitExitFullscreen).call(doc);
    else if(state.action==='enter')await (doc.documentElement.requestFullscreen||doc.documentElement.webkitRequestFullscreen).call(doc.documentElement);
    else return {help:true,browser:state.browser};
    return {help:false};
  } catch { return {help:true,rejected:true}; }
}

export function fullscreenMount(doc,win) {
  const buttons=[...doc.querySelectorAll('[data-fullscreen]')],details=doc.getElementById('display-app'),message=doc.getElementById('display-message');
  let pending=false,guideKey='';
  const render=()=>{
    const state=fullscreenState(doc,win),options=displayOptions(doc,win);
    for(const button of buttons){buttonLabel(button,state.label,state.icon);button.disabled=pending||state.action==='help';}
    doc.getElementById('display-mode').textContent=options.mode;
    doc.getElementById('display-description').textContent=options.description;
    doc.getElementById('display-app-title').textContent=options.title;
    doc.getElementById('display-instructions').innerHTML='<p>'+options.copy+'</p>'+(options.steps.length?'<ol>'+options.steps.map(step=>'<li>'+step+'</li>').join('')+'</ol>':'');
    const key=options.title+options.open;
    if(key!==guideKey){details.open=options.open;guideKey=key;}
  };
  for(const button of buttons)button.addEventListener('click',async()=>{
    if(pending||fullscreenState(doc,win).action==='help')return;
    pending=true;message.textContent='';render();
    const result=await fullscreenToggleAsync(doc,win);
    pending=false;render();
    if(result.rejected){message.textContent='Your browser declined full screen. Try again, or use the app-view options below.';details.open=true;}
  });
  for(const name of ['fullscreenchange','webkitfullscreenchange'])doc.addEventListener(name,render);
  for(const query of ['(display-mode: standalone)','(display-mode: fullscreen)'])win.matchMedia?.(query).addEventListener?.('change',render);
  render();
}
