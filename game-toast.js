export const FIRST_SHOT_HINT='Drag back and release to launch';

// Transient announcements may temporarily replace guidance, but elapsed time
// never completes onboarding. The caller supplies actual successful launches.
export function gameToastMount(element,{needsHint,announce=()=>{},clock=globalThis}){
 let timer=null;
 function paint(text){element.textContent=text;element.classList.toggle('show',!!text);}
 function refresh(){if(timer===null)paint(needsHint()?FIRST_SHOT_HINT:'');}
 function clear(){if(timer!==null)clock.clearTimeout(timer);timer=null;refresh();}
 function show(text){if(timer!==null)clock.clearTimeout(timer);paint(text);announce(text);timer=clock.setTimeout(()=>{timer=null;refresh();},1600);}
 return {show,refresh,clear};
}
