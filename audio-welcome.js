import {buttonHTML} from './ui-icon.js?v=35ef67d69b283afcc7c65c45f76a6dee06daf0fc829eafd4dff245d7c24940c0';

// One return screen collects the menu and gameplay outputs. Each unlock starts
// synchronously inside Continue's trusted activation, never after an await.
export function audioWelcomeMount(doc=document){
 const dialog=doc.createElement('dialog');dialog.id='audio-welcome-dialog';dialog.className='audio-welcome-dialog';dialog.setAttribute('aria-labelledby','audio-welcome-title');
 dialog.innerHTML=`<section><h2 id="audio-welcome-title">Welcome back</h2><p>Your place is saved. Continue with sound when you're ready.</p>${buttonHTML('Continue','play',{class:'primary','data-audio-continue':true})}<p data-audio-status role="status" hidden></p><button type="button" data-audio-skip hidden>Continue without sound</button></section>`;
 doc.body.append(dialog);
 const resumes=new Set(),button=dialog.querySelector('[data-audio-continue]'),status=dialog.querySelector('[data-audio-status]'),skip=dialog.querySelector('[data-audio-skip]');let busy=false;
 const request=event=>{event.preventDefault();resumes.add(event.detail.resume);if(!dialog.open){status.hidden=true;skip.hidden=true;dialog.showModal();button.focus({preventScroll:true});}};
 doc.addEventListener('audio-return',request);
 const restore=()=>{if(resumes.size&&!dialog.open){dialog.showModal();button.focus({preventScroll:true});}};
 doc.defaultView?.addEventListener('ricochet-ready',restore);
 button.addEventListener('click',event=>{
  if(event.isTrusted===false||busy)return;
  busy=true;button.disabled=true;status.hidden=true;
  const pending=[...resumes].map(resume=>{try{return Promise.resolve(resume());}catch(error){return Promise.reject(error);}});
  Promise.allSettled(pending).then(results=>{
   busy=false;button.disabled=false;
   if(results.every(result=>result.status==='fulfilled'&&result.value!==false)){resumes.clear();dialog.close();}
   else {status.textContent='Sound could not resume. Try Continue again, or continue without sound.';status.hidden=false;skip.hidden=false;}
  });
 });
 skip.addEventListener('click',()=>{resumes.clear();dialog.close();});
 dialog.addEventListener('cancel',event=>event.preventDefault());
 return ()=>{doc.removeEventListener('audio-return',request);doc.defaultView?.removeEventListener('ricochet-ready',restore);dialog.remove();};
}
