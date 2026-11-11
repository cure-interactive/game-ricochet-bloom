import { buttonLabel } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

// Capability and actual browser state, never screen size, decide this action.
export function fullscreenState(doc, win) {
  const active=!!(doc.fullscreenElement||doc.webkitFullscreenElement);
  const standalone=!!win.navigator?.standalone||!!win.matchMedia?.('(display-mode: standalone)').matches;
  const root=doc.documentElement;
  const supported=typeof root.requestFullscreen==='function'?doc.fullscreenEnabled!==false:typeof root.webkitRequestFullscreen==='function'&&doc.webkitFullscreenEnabled!==false;
  if(active)return {action:'exit',label:'Exit full screen',icon:'fullscreen-disable'};
  if(standalone)return {action:'help',label:'App display',icon:'about',standalone:true};
  if(win.matchMedia?.('(display-mode: fullscreen)').matches)return {action:'help',label:'Full screen active',icon:'fullscreen-disable',browser:true};
  if(supported)return {action:'enter',label:'Enter full screen',icon:'fullscreen-enable'};
  return {action:'help',label:'Full screen options',icon:'add'};
}

export async function fullscreenToggleAsync(doc, win) {
  const state=fullscreenState(doc,win);
  try {
    if(state.action==='exit')await (doc.exitFullscreen||doc.webkitExitFullscreen).call(doc);
    else if(state.action==='enter')await (doc.documentElement.requestFullscreen||doc.documentElement.webkitRequestFullscreen).call(doc.documentElement);
    else return {help:true,standalone:state.standalone,browser:state.browser};
    return {help:false};
  } catch {
    return {help:true,rejected:true};
  }
}

export function fullscreenMount(doc,win) {
  const buttons=[...doc.querySelectorAll('[data-fullscreen]')],dialog=doc.getElementById('display-dialog');
  let pending=false;
  const render=()=>{const state=fullscreenState(doc,win);for(const button of buttons){buttonLabel(button,state.label,state.icon);button.disabled=pending;button.setAttribute('aria-haspopup',state.action==='help'?'dialog':'false');}};
  function help(result){
    doc.getElementById('display-title').textContent=result.browser?'Browser full screen':result.standalone?'Already in app view':'Play without browser bars';
    doc.getElementById('display-message').textContent=result.browser?'Your browser is already in full screen. Use its full-screen command to leave this view.':result.standalone?'You opened Ricochet Bloom as an app. There are no browser tabs or address bar to hide. Your device may keep its status bar or home indicator visible.':result.rejected?'Your browser did not allow full screen. You can keep playing here, or open the game from your Home Screen.':'This browser cannot put the whole game in full screen. Open it as a Home Screen app to remove the browser toolbar.';
    const apple=/iPhone|iPad|iPod/.test(win.navigator?.userAgent||'')||(win.navigator?.platform==='MacIntel'&&win.navigator?.maxTouchPoints>1);
    doc.getElementById('display-instructions').innerHTML=result.standalone||result.browser?'':apple?'<h3>On iPhone or iPad</h3><ol><li>Open this game in Safari.</li><li>Open the browser menu or Share sheet and choose <b>Add to Home Screen</b>.</li><li>Leave <b>Open as Web App</b> on if shown, then tap <b>Add</b>.</li><li>Launch Ricochet Bloom from its Home Screen icon.</li></ol>':'<h3>On Android</h3><p>Open your browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>, if offered. Launch the new icon to play.</p><h3>On a computer</h3><p>Use your browser’s full-screen command or its app-install option. Availability depends on the browser.</p>';
    if(!dialog.open)dialog.showModal();
  }
  for(const button of buttons)button.addEventListener('click',async()=>{
    if(pending)return;pending=true;render();
    const result=await fullscreenToggleAsync(doc,win);
    pending=false;render();if(result.help)help(result);
  });
  for(const name of ['fullscreenchange','webkitfullscreenchange'])doc.addEventListener(name,render);
  win.matchMedia?.('(display-mode: standalone)').addEventListener?.('change',render);
  win.matchMedia?.('(display-mode: fullscreen)').addEventListener?.('change',render);
  render();
}
