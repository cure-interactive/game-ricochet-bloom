// UI-only memory. Owners restore their own view; no saved action is replayed.
const views=new Map();
export function rememberView(root,key,read,restore,priority=0){
 const scope=root.id||root.closest?.('[id]')?.id;if(!scope)return;
 views.set(scope+':'+key,{root,read,restore,priority});
}
export function navigationRead(storage,key){
 try{const value=JSON.parse(storage.getItem(key));return value?.version===1&&Array.isArray(value.path)&&value.path.length<=24&&value.path.every(x=>typeof x==='string'&&x.length<128)&&value.views&&typeof value.views==='object'?value:null;}catch{return null;}
}
const visible=root=>root.isConnected!==false&&root.getClientRects().length>0;
const scrollSelector='.dialog-body,.tab-scroll,.tab-bar,.skin-scroll,.song-list,.campaign-scroll,.wiki-article,.trial-scroll';
function geometry(doc){return [...doc.querySelectorAll('dialog[open]')].map(root=>({id:root.id,scroll:[root,...root.querySelectorAll(scrollSelector)].map((el,index)=>({index,x:el.scrollLeft,y:el.scrollTop})),details:[...root.querySelectorAll('details')].map(el=>el.open)}));}
export function navigationMemoryMount(doc,win,{storage,profile,navigation}){
 let restoring=false,timer=0;
 const key=()=>`ricochet-bloom-navigation-v1-${profile()}`;
 function save(){
  if(restoring)return true;win.clearTimeout(timer);timer=0;
  const state={version:1,path:navigation.snapshot,play:navigation.playIdentity,views:{},geometry:geometry(doc)};
  if(doc.querySelector('#settings-dialog[open]')&&state.path.at(-1)!=='settings')state.path.push('settings');
  for(const [id,view] of views)if(visible(view.root))state.views[id]=view.read();
  try{storage.setItem(key(),JSON.stringify(state));return true;}catch{return false;}
 }
 function soon(){if(!restoring){win.clearTimeout(timer);timer=win.setTimeout(save,180);}}
 async function restore(){
  const state=navigationRead(storage,key());if(!state)return false;restoring=true;
  try{
   navigation.restore(state.path,state.play);
   for(const [id,view] of [...views].sort((a,b)=>a[1].priority-b[1].priority))if(visible(view.root)&&Object.hasOwn(state.views,id))await view.restore(state.views[id]);
   await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
   for(const item of Array.isArray(state.geometry)?state.geometry:[]){const root=doc.getElementById(item.id);if(!root?.open)continue;const details=[...root.querySelectorAll('details')];for(const [i,open] of (item.details||[]).entries())if(details[i])details[i].open=open===true;const elements=[root,...root.querySelectorAll(scrollSelector)];for(const pos of item.scroll||[]){const el=elements[pos.index];if(el&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)){el.scrollLeft=pos.x;el.scrollTop=pos.y;}}}
   return true;
  }catch{return false;}finally{restoring=false;}
 }
 for(const name of ['click','input','change','scroll','toggle','pointerup','touchend'])doc.addEventListener(name,soon,true);
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)save();});
 for(const name of ['pagehide','beforeunload'])win.addEventListener(name,save);
 return {save,restore};
}
