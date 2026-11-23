import {buttonHTML} from './ui-icon.js?v=cbf022ce3248160b361afed81589ae1a2f56bdd61274c5ee3f96e1462e192dff';

// One return screen collects the menu and gameplay outputs. Each unlock starts
// synchronously inside Continue's trusted activation, never after an await.
export function audioWelcomeMount(doc=document,{ready=true}={}){
 const dialog=doc.createElement('dialog');dialog.id='audio-welcome-dialog';dialog.className='audio-welcome-dialog';dialog.setAttribute('aria-labelledby','audio-welcome-title');
 dialog.innerHTML=`<section><h2 id="audio-welcome-title">Welcome Back</h2><p>Your place is saved. Continue with sound when you're ready.</p>${buttonHTML('Continue','play',{class:'primary','data-audio-continue':true})}<p data-audio-status role="status" hidden></p><button type="button" data-audio-skip hidden>Continue Without Sound</button></section>`;
 doc.body.append(dialog);
 const resumes=new Set(),button=dialog.querySelector('[data-audio-continue]'),status=dialog.querySelector('[data-audio-status]'),skip=dialog.querySelector('[data-audio-skip]');let busy=false,generation=0,exit=null;
 const cancelExit=()=>{const animation=exit;exit=null;animation?.cancel();dialog.inert=false;};
 function dismiss(){
  if(exit||!dialog.open)return;
  busy=true;button.disabled=true;dialog.inert=true;
  const current=generation;
  const finish=()=>{if(current!==generation)return;if(dialog.open)dialog.close();cancelExit();busy=false;button.disabled=false;};
  // Readiness is supplied only after navigation and updates finish. Start the
  // exit now: the next paint reveals that destination, with no extra hold.
  if(!dialog.animate||doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches){finish();return;}
  const animation=exit=dialog.animate([{opacity:1},{opacity:0}],{duration:250,easing:'ease-out',fill:'forwards'});
  animation.finished.then(()=>{if(exit===animation)finish();},()=>{});
 }
 const show=()=>{if(ready&&resumes.size&&!dialog.open){status.hidden=true;skip.hidden=true;dialog.showModal();button.focus({preventScroll:true});}};
 const request=event=>{event.preventDefault();if(exit){generation++;cancelExit();busy=false;button.disabled=false;}resumes.add(event.detail.resume);show();};
 doc.addEventListener('audio-return',request);
 button.addEventListener('click',event=>{
  if(event.isTrusted===false||busy||!ready)return;
  busy=true;button.disabled=true;status.hidden=true;const current=generation,requested=[...resumes];
  const pending=requested.map(resume=>{try{return Promise.resolve(resume());}catch(error){return Promise.reject(error);}});
  Promise.allSettled(pending).then(results=>{
   if(current!==generation)return;
   busy=false;button.disabled=false;
   if(results.every(result=>result.status==='fulfilled'&&result.value!==false)){for(const resume of requested)resumes.delete(resume);if(!resumes.size)dismiss();}
   else {status.textContent='Sound could not resume. Try Continue again, or continue without sound.';status.hidden=false;skip.hidden=false;}
  });
 });
 skip.addEventListener('click',()=>{resumes.clear();dismiss();});
 dialog.addEventListener('cancel',event=>event.preventDefault());
 return {ready(value){ready=value;if(ready)show();else{generation++;cancelExit();busy=false;button.disabled=false;if(dialog.open)dialog.close();}},destroy(){generation++;cancelExit();doc.removeEventListener('audio-return',request);dialog.remove();}};
}
