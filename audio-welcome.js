import {buttonHTML} from './ui-icon.js?v=c034fd245b2540631902989670ffc7b2e11942d4f3456fce74a63c3ecaf6710f';

// One return screen collects the menu and gameplay outputs. Each unlock starts
// synchronously inside Continue's trusted activation, never after an await.
export function audioWelcomeMount(doc=document,{ready=true}={}){
 const dialog=doc.createElement('dialog');dialog.id='audio-welcome-dialog';dialog.className='audio-welcome-dialog';dialog.setAttribute('aria-labelledby','audio-welcome-title');
 dialog.innerHTML=`<section><h2 id="audio-welcome-title">Welcome Back</h2><p>Your place is saved. Continue with sound when you're ready.</p>${buttonHTML('Continue','play',{class:'primary','data-audio-continue':true})}<p data-audio-status role="status" hidden></p><button type="button" data-audio-skip hidden>Continue Without Sound</button></section>`;
 doc.body.append(dialog);
 const resumes=new Set(),button=dialog.querySelector('[data-audio-continue]'),status=dialog.querySelector('[data-audio-status]'),skip=dialog.querySelector('[data-audio-skip]');let busy=false,generation=0;
 const show=()=>{if(ready&&resumes.size&&!dialog.open){status.hidden=true;skip.hidden=true;dialog.showModal();button.focus({preventScroll:true});}};
 const request=event=>{event.preventDefault();resumes.add(event.detail.resume);show();};
 doc.addEventListener('audio-return',request);
 button.addEventListener('click',event=>{
  if(event.isTrusted===false||busy||!ready)return;
  busy=true;button.disabled=true;status.hidden=true;const current=generation,requested=[...resumes];
  const pending=requested.map(resume=>{try{return Promise.resolve(resume());}catch(error){return Promise.reject(error);}});
  Promise.allSettled(pending).then(results=>{
   if(current!==generation)return;
   busy=false;button.disabled=false;
   if(results.every(result=>result.status==='fulfilled'&&result.value!==false)){for(const resume of requested)resumes.delete(resume);if(!resumes.size)dialog.close();}
   else {status.textContent='Sound could not resume. Try Continue again, or continue without sound.';status.hidden=false;skip.hidden=false;}
  });
 });
 skip.addEventListener('click',()=>{resumes.clear();dialog.close();});
 dialog.addEventListener('cancel',event=>event.preventDefault());
 return {ready(value){ready=value;if(ready)show();else{generation++;busy=false;button.disabled=false;if(dialog.open)dialog.close();}},destroy(){generation++;doc.removeEventListener('audio-return',request);dialog.remove();}};
}
