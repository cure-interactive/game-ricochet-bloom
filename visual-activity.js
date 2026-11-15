// Decorative render loops share visibility, never gameplay/persistence state.
export function visualActivityMount(element,change,{intersection=true}={}){
 const doc=element.ownerDocument,win=doc.defaultView||globalThis.window;
 let active=false,destroyed=false,inView=!intersection||!win?.IntersectionObserver;
 function visible(){
  if(destroyed||doc.hidden||element.isConnected===false||!inView)return false;
  if(element.checkVisibility&&!element.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))return false;
  for(let node=element;node;node=node.parentElement){
   if(node.hidden||node.tagName==='DIALOG'&&!node.open)return false;
   const style=win?.getComputedStyle?.(node);
   if(style?.display==='none'||style?.visibility==='hidden'||style?.opacity==='0')return false;
  }
  const dialogs=[...(doc.querySelectorAll?.('dialog[open]')||[])];
  const focused=doc.activeElement?.closest?.('dialog[open]');
  const top=dialogs.includes(focused)?focused:dialogs.at(-1);
  return !top||top.contains(element);
 }
 function refresh(){const next=visible();if(next!==active){active=next;change(active);}}
 const observer=intersection&&win?.IntersectionObserver?new win.IntersectionObserver(entries=>{inView=entries.some(e=>e.isIntersecting&&e.intersectionRect.width>0&&e.intersectionRect.height!==0);refresh();}):null;
 observer?.observe(element);
 // Ignore animated transforms. Only visibility-changing styles and structural
 // changes require reevaluation, so our own paint never perpetuates work.
 const visibilityStyle=value=>(value||'').match(/(?:^|;)\s*(?:display|visibility|opacity|content-visibility)\s*:[^;]*/g)?.join(';')||'';
 const mutations=win?.MutationObserver?new win.MutationObserver(records=>{
  if(records.some(r=>r.type==='childList'||r.attributeName!=='style'||visibilityStyle(r.oldValue)!==visibilityStyle(r.target.getAttribute('style'))))refresh();
 }):null;
 if(doc.body)mutations?.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeOldValue:true,attributeFilter:['open','hidden','class','style']});
 doc.addEventListener('visibilitychange',refresh);refresh();
 return {isActive:()=>active,refresh,destroy(){destroyed=true;observer?.disconnect();mutations?.disconnect();doc.removeEventListener('visibilitychange',refresh);if(active){active=false;change(false);}}};
}
