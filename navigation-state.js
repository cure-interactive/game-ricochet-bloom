// UI-only memory. Owners restore their own view; no saved action is replayed.
const views=new Map();
export function rememberView(root,key,read,restore,priority=0){
 const scope=root.id||root.closest?.('[id]')?.id;if(!scope)return;
 views.set(scope+':'+key,{root,read,restore,priority});
}
export function navigationRead(storage,key){
 try{const value=JSON.parse(storage.getItem(key));return [1,2].includes(value?.version)&&Array.isArray(value.path)&&value.path.length<=24&&value.path.every(x=>typeof x==='string'&&x.length<128)&&value.views&&typeof value.views==='object'?value:null;}catch{return null;}
}
const visible=root=>root.isConnected!==false&&root.getClientRects().length>0;
const scrollSelector='.dialog-body,.tab-scroll,.tab-bar,.skin-scroll,.song-list,.campaign-scroll,.wiki-article,.trial-scroll';
function geometryKey(el,root){
 if(el===root)return 'root';
 const explicit=el.getAttribute?.('data-navigation-key');if(explicit)return 'key:'+explicit;
 if(el.id)return 'id:'+el.id;
 if(el.tagName==='DETAILS'){
  const summary=el.querySelector(':scope > summary'),label=summary?.querySelector('[id]')?.id||summary?.textContent?.trim();
  if(!label)return null;
  const parent=el.parentElement?.closest('details');
  const scope=parent&&root.contains(parent)?geometryKey(parent,root):'';
  return scope===null?null:scope+'/detail:'+label;
 }
 const role=scrollSelector.split(',').find(selector=>el.matches?.(selector));
 if(!role)return null;
 const label=el.getAttribute?.('aria-label')||el.querySelector?.('nav[aria-label]')?.getAttribute('aria-label')||'';
 return 'scroll:'+role+':'+label;
}
function geometryElements(root,selector,includeRoot=false){
 const result=new Map();
 for(const el of [...(includeRoot?[root]:[]),...root.querySelectorAll(selector)]){
  const key=geometryKey(el,root);if(key)result.set(key,result.has(key)?null:el);
 }
 // Ambiguous identities are deliberately omitted, never assigned by position.
 return new Map([...result].filter(([,el])=>el));
}
function geometry(doc){return [...doc.querySelectorAll('dialog[open]')].map(root=>({id:root.id,scroll:[...geometryElements(root,scrollSelector,true)].map(([key,el])=>({key,x:el.scrollLeft,y:el.scrollTop})),details:[...geometryElements(root,'details')].map(([key,el])=>({key,open:el.open}))}));}
export function navigationMemoryMount(doc,win,{storage,profile,navigation}){
 let restoring=false,timer=0;
 const key=()=>`ricochet-bloom-navigation-v1-${profile()}`;
 function save(){
  if(restoring)return true;win.clearTimeout(timer);timer=0;
  const state={version:2,path:navigation.snapshot,play:navigation.playIdentity,views:{},geometry:geometry(doc)};
  if(doc.querySelector('#settings-dialog[open]')&&state.path.at(-1)!=='settings')state.path.push('settings');
  for(const [id,view] of views)if(visible(view.root))state.views[id]=view.read();
  try{storage.setItem(key(),JSON.stringify(state));return true;}catch{return false;}
 }
 function soon(){if(!restoring){win.clearTimeout(timer);timer=win.setTimeout(save,180);}}
 async function restore(){
  const state=navigationRead(storage,key());if(!state)return false;restoring=true;
  try{
   await navigation.restore(state.path,state.play);
   for(const [id,view] of [...views].sort((a,b)=>a[1].priority-b[1].priority))if(visible(view.root)&&Object.hasOwn(state.views,id))await view.restore(state.views[id]);
   const items=Array.isArray(state.geometry)?state.geometry:[];
   for(const item of items){
    const root=doc.getElementById(item.id);if(!root?.open)continue;
    const details=state.version===1?[...root.querySelectorAll('details')]:geometryElements(root,'details');
    for(const [i,saved] of (Array.isArray(item.details)?item.details:[]).entries()){
     const el=state.version===1?details[i]:details.get(saved?.key);if(el)el.open=(state.version===1?saved:saved.open)===true;
    }
   }
   // View restore promises own content readiness (including fetched Wiki pages).
   // Expand disclosures first; one layout opportunity then makes scroll bounds
   // reflect that content. A frame count is not an asynchronous-content timeout.
   await new Promise(resolve=>win.requestAnimationFrame(resolve));
   for(const item of items){
    const root=doc.getElementById(item.id);if(!root?.open)continue;
    const elements=state.version===1?[root,...root.querySelectorAll(scrollSelector)]:geometryElements(root,scrollSelector,true);
    for(const pos of Array.isArray(item.scroll)?item.scroll:[]){
     const el=state.version===1?elements[pos?.index]:elements.get(pos?.key);
     if(el&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)){el.scrollLeft=pos.x;el.scrollTop=pos.y;}
    }
   }
   return true;
  }catch{return false;}finally{restoring=false;}
 }
 for(const name of ['click','input','change','scroll','toggle','pointerup','touchend'])doc.addEventListener(name,soon,true);
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)save();});
 for(const name of ['pagehide','beforeunload'])win.addEventListener(name,save);
 return {save,restore};
}
