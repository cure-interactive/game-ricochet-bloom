// Focus placement remains accessible; only its keyboard-only decoration changes.
export function inputModalityMount(doc=document){
 const set=value=>{doc.body.dataset.inputModality=value;};
 set('pointer');
 const pointer=()=>set('pointer');
 const keyboard=event=>{
  if(event.isComposing||event.altKey||event.ctrlKey||event.metaKey)return;
  if(['Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown','Enter',' ','Escape'].includes(event.key))set('keyboard');
 };
 const capture={capture:true},touch={capture:true,passive:true};
 doc.addEventListener('keydown',keyboard,capture);
 doc.addEventListener('pointerdown',pointer,capture);
 doc.addEventListener('touchstart',pointer,touch);
 return ()=>{doc.removeEventListener('keydown',keyboard,capture);doc.removeEventListener('pointerdown',pointer,capture);doc.removeEventListener('touchstart',pointer,touch);};
}
