// Decorative render loops share visibility, never gameplay/persistence state.
export function visualActivityMount(element,change,{intersection=true}={}){
 const doc=element.ownerDocument,win=doc.defaultView||globalThis.window;
 let active=false,destroyed=false,inView=!intersection||!win?.IntersectionObserver,clips=[];
 function visible(){
  if(destroyed||doc.hidden||element.isConnected===false||!inView)return false;
  if(element.checkVisibility&&!element.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))return false;
  clips=[];
  for(let node=element;node;node=node.parentElement){
   if(node.hidden||node.tagName==='DIALOG'&&!node.open)return false;
   const style=win?.getComputedStyle?.(node);
   if(style?.display==='none'||style?.visibility==='hidden'||style?.opacity==='0')return false;
   if(node!==element){const x=/^(auto|scroll|hidden|clip)$/.test(style?.overflowX),y=/^(auto|scroll|hidden|clip)$/.test(style?.overflowY);if(x||y)clips.push({node,x,y});}
  }
  const dialogs=[...(doc.querySelectorAll?.('dialog[open]')||[])];
  const focused=doc.activeElement?.closest?.('dialog[open]');
  const top=dialogs.includes(focused)?focused:dialogs.at(-1);
  return !top||top.contains(element);
 }
 function refresh(){const next=visible();if(next!==active){active=next;change(active);}}
 // Simulation activity is independent of paint visibility. Callers can supply
 // their full visual bounds (including trails) rather than the control hit box.
 function clip(bounds){
  let left=Math.max(0,bounds.left),top=Math.max(0,bounds.top),right=Math.min(win?.innerWidth??Infinity,bounds.right),bottom=Math.min(win?.innerHeight??Infinity,bounds.bottom);
  for(const {node,x,y} of clips){const r=node.getBoundingClientRect();if(x){left=Math.max(left,r.left);right=Math.min(right,r.right);}if(y){top=Math.max(top,r.top);bottom=Math.min(bottom,r.bottom);}}
  return right>left&&bottom>top?{left,top,right,bottom}:null;
 }
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
 return {isActive:()=>active,refresh,clip,destroy(){destroyed=true;observer?.disconnect();mutations?.disconnect();doc.removeEventListener('visibilitychange',refresh);if(active){active=false;change(false);}}};
}
