// Startup and foreground recovery share one readiness boundary. The final
// document decides whether to reload before offering trusted audio activation.
export function appReturnMount(welcome,doc=document,win=window){
 let check=null,departed=true,disposed=false,generation=0,pending=null;
 welcome.ready(false);
 const emit=type=>win.dispatchEvent(new (win.Event||Event)(type));
 function leave(event){
  if(event?.isTrusted===false||event?.type==='blur'&&event.target&&event.target!==win)return;
  if(departed)return;
  departed=true;generation++;welcome.ready(false);
 }
 function enter(event){
  if(disposed||event?.isTrusted===false||doc.hidden||!departed||!check)return pending;
  departed=false;const current=++generation;
  welcome.ready(false);emit('ricochet-loading');
  pending=Promise.resolve().then(()=>check()).catch(()=>null).then(result=>{
   if(disposed||current!==generation||doc.hidden||result?.updated)return result;
   welcome.ready(true);emit('ricochet-ready');return result;
  });
  return pending;
 }
 const visible=event=>{if(doc.hidden)leave(event);else enter(event);};
 doc.addEventListener('visibilitychange',visible,true);
 doc.addEventListener('freeze',leave,true);
 win.addEventListener('blur',leave,true);win.addEventListener('pagehide',leave,true);
 win.addEventListener('focus',enter);win.addEventListener('pageshow',enter);
 return {ready(update){check=update;return enter();},destroy(){disposed=true;generation++;doc.removeEventListener('visibilitychange',visible,true);doc.removeEventListener('freeze',leave,true);win.removeEventListener('blur',leave,true);win.removeEventListener('pagehide',leave,true);win.removeEventListener('focus',enter);win.removeEventListener('pageshow',enter);}};
}
