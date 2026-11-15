import { buttonLabel } from './ui-icon.js?v=e77c8634175296f7fa7b6ad85ade1b42bdf0d89af6f8099b5d6206fb97d7a067';
import { assetURL } from './asset.js?v=9aa4355875f47659bed1ca495b9cf522c1b1f52eafe4fb135b89de5f59214643';
import { escapeHTML } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';

export function displayDeviceIcon(win){
 const nav=win.navigator||{};
 return /iPhone|iPad|iPod|Android|Mobile/.test(nav.userAgent||'')||nav.userAgentData?.mobile===true||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1)?'mobile-device':'monitor';
}
export function instructionHTML(step,icons={}){
 const labels=[...new Set([...Object.keys(icons),'Open as Web App','Ricochet Bloom','Applications','Safari','Chrome','Firefox','Microsoft Edge','Samsung Internet','More tools','Cast, save, and share','Start menu','File','Add','Install','Yes'])].sort((a,b)=>b.length-a.length);
 const pattern=new RegExp(labels.map(label=>label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
 return escapeHTML(step).replace(pattern,label=>{
  const icon=icons[label],url=icon?assetURL('icon/ui/'+icon+'.svg'):'';
  const artwork=icon==='safari'?`<img class="instruction-icon instruction-color" src="${url}" alt="" width="23" height="23">`:`<span class="instruction-icon" style="--instruction-image:url('${url}')" aria-hidden="true"></span>`;
  return (icon?'<span class="instruction-control">'+artwork:'')+'<strong>'+label+'</strong>'+(icon?'</span>':'');
 });
}

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
  const edge=/Edg(?:A)?\//.test(ua),firefox=/Firefox\//.test(ua),chrome=/Chrome|Chromium|CrOS/.test(ua)&&!edge&&!/OPR|SamsungBrowser/.test(ua);
  const safari=mac&&/Safari/.test(ua)&&!/Chrome|Chromium|Edg|OPR/.test(ua);
  const installed=appView(win),mode=state.action==='exit'||state.browser?'Full screen':installed?'App view':'Browser view';
  const description=state.action==='exit'?'Full screen is on. Leave it here or use your browser’s exit command.':state.browser?'Your browser controls this full-screen view. Use its full-screen command to leave.':state.action==='enter'?'Hide browser controls for this session. You can return to this view at any time.':'This browser does not allow the game to enter full screen. App view is a separate option below.';
  if(installed)return {mode,description,title:'App View Is Active',copy:'You opened the game from its app icon. Your device may still show a status bar or home indicator.',steps:[],open:true};
  const guide=(id,title,copy,steps,icons)=>({mode,description,id,title,copy,steps,icons,open:state.action==='help'});
  if(apple)return guide('ios','Add to Home Screen','For iPhone and iPad, use these Safari steps. If you opened the game in another browser or inside another app, open the same address in Safari first.',[
   'Open this game in Safari, then open Share (inside the browser menu if needed).',
   'Tap View More if shown, then scroll down and choose Add to Home Screen.',
   'Keep Open as Web App enabled if shown, then tap Add.',
   'Open Ricochet Bloom from its new Home Screen icon.'
  ],{Safari:'safari',Share:'ios-share','View More':'ios-view-more','Add to Home Screen':'ios-home-screen'});
  if(android&&/SamsungBrowser/.test(ua))return guide('samsung','Add to Your Home Screen','Samsung Internet can add a shortcut. Menu wording and app-window availability vary by version.',[
   'In Samsung Internet, open Menu (three lines), then Add page to.',
   'Choose Home screen, then Add. Confirm placement if your device asks.',
   'Open Ricochet Bloom from the new icon. If Home screen is unavailable, open this address in Chrome and use its installation menu.'
  ],{Menu:'browser-menu-lines','Add page to':'add','Home screen':'android-home-screen'});
  if(android&&firefox)return guide('firefox-android','Add to Your Home Screen','Firefox on Android offers installation or a website shortcut, depending on the page and browser version.',[
   'In Firefox, open Menu (three dots).',
   'Choose Install if offered, or Add to Home Screen for a shortcut.',
   'Tap Add automatically or Add when prompted, then open Ricochet Bloom from your Home Screen.'
  ],{Menu:'browser-menu-dots',Install:'app-install','Add to Home Screen':'android-home-screen','Add automatically':'android-home-screen'});
  if(android)return guide('chrome-android','Install on Your Home Screen',chrome?'Chrome on Android can install the game or create a shortcut.':'These steps use Chrome on Android. Open the same game address in Chrome if your current browser has different menus.',[
   'Open this game in Chrome, then open More (three dots).',
   'Choose Install and create shortcut → Install, if offered. Some versions call this Install app or Add to Home screen.',
   'Confirm the browser’s prompts, then open Ricochet Bloom from its app icon.'
  ],{More:'browser-menu-dots','Install and create shortcut':'android-home-screen',Install:'app-install','Install app':'app-install','Add to Home screen':'android-home-screen'});
  if(safari)return guide('safari-mac','Add to Dock','On macOS Sonoma 14 or later, Safari can open the game in its own app window.',[
   'In Safari, choose File → Add to Dock (or Share → Add to Dock).',
   'Choose Add, then open Ricochet Bloom from the Dock or Applications.'
  ],{Safari:'safari',Share:'ios-share','Add to Dock':'mac-dock',Dock:'mac-dock'});
  if(edge)return guide('edge-desktop','Install with Microsoft Edge','Install the game in its own window on your computer.',[
   'Open Settings and more (three dots), then More tools → Apps → Install this site as an app. Some versions show Apps directly in the menu.',
   'Confirm Install, then open Ricochet Bloom from Apps or the shortcut you choose.'
  ],{'Settings and more':'browser-menu-horizontal',Apps:'app-grid','Install this site as an app':'app-install',Install:'app-install'});
  if(firefox&&/Windows|Win32/.test(ua+' '+nav.platform))return guide('firefox-windows','Add to Your Taskbar','Recent Firefox versions on Windows can open websites in their own app window. Availability depends on your Firefox version and installation.',[
   'In Firefox, select the web apps button in the address bar, if present.',
   'Choose Yes if asked to pin it, then open Ricochet Bloom from your taskbar or Start menu.',
   'If the web apps button is missing, keep playing in the browser or open the game in Chrome or Microsoft Edge to install it.'
  ],{'web apps button':'web-app-window'});
  if(chrome)return guide('chrome-desktop','Install with Chrome','These steps work in Chrome on Windows, macOS, Linux and Chromebook.',[
   'Open More (three dots) → Cast, save, and share → Install page as app.',
   'You can also select Install in the address bar when offered.',
   'Confirm the prompt, then open Ricochet Bloom from your app launcher or shortcut.'
  ],{More:'browser-menu-dots','Install page as app':'app-install',Install:'app-install'});
  return guide('fallback','Play in an App Window','Installation options vary in this browser. You can keep playing here without installing anything.',[
   'Look for Install app in your browser menu, if offered.',
   'For guided installation, open this game in Chrome or Microsoft Edge on a computer. On a Mac, Safari also offers Add to Dock on macOS Sonoma 14 or later.',
   'Full screen, when supported, is a separate option above.'
  ],{'Install app':'app-install','Add to Dock':'mac-dock',Safari:'safari'});
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
    const deviceIcon=doc.getElementById('display-device-icon');if(deviceIcon)deviceIcon.dataset.icon=displayDeviceIcon(win);
    doc.getElementById('display-instructions').innerHTML='<p>'+escapeHTML(options.copy)+'</p>'+(options.steps.length?'<ol>'+options.steps.map(step=>'<li>'+instructionHTML(step,options.icons)+'</li>').join('')+'</ol>':'');
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
