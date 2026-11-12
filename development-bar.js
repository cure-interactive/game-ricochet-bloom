// A single status surface follows the selected profile above the modal top layer.
export const developmentProfileActive=(kind,shared=false)=>kind==='development'&&!shared;
export function developmentBarMount(doc=document){
 const bar=doc.createElement('div');bar.id='development-profile-bar';bar.textContent='Development Profile Active';bar.setAttribute('role','status');bar.setAttribute('popover','manual');bar.hidden=true;doc.body.append(bar);
 let active=false,stack=[...doc.querySelectorAll('dialog[open]')];
 const popover=typeof bar.showPopover==='function';
 function refresh(){
  stack=stack.filter(d=>d.open&&d.isConnected);
  if(popover&&bar.matches(':popover-open'))bar.hidePopover();
  bar.hidden=!active;
  if(!active)return;
  if(popover)bar.showPopover();
  else {const parent=stack.at(-1)||doc.body;if(bar.parentNode!==parent)parent.append(bar);}
 }
 const observer=new doc.defaultView.MutationObserver(records=>{
  let changed=false;
  for(const r of records){
   if(r.type==='attributes'&&r.target.tagName==='DIALOG'){
    stack=stack.filter(d=>d!==r.target);if(r.target.open)stack.push(r.target);changed=true;
   }else if(r.type==='childList'&&[...r.removedNodes].some(n=>n===bar||n.contains?.(bar)))changed=true;
  }
  if(changed)refresh();
 });
 observer.observe(doc.body,{attributes:true,attributeFilter:['open'],childList:true,subtree:true});
 return {set(kind,shared=false){const next=developmentProfileActive(kind,shared);if(next===active)return;active=next;doc.body.dataset.development=String(active);refresh();}};
}
