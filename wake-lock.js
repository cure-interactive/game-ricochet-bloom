// A screen wake lock follows active play, never menu animation or ambient audio.
export function wakeLockMount(doc=document,nav=navigator,Observer=MutationObserver){
 let sentinel=null,pending=false,disposed=false;
 const wanted=()=>!disposed&&!doc.hidden&&['play','trial','drift'].includes(doc.body.dataset.screen)&&!doc.querySelector('dialog[open]');
 const status=value=>{doc.body.dataset.wakeLock=value;};
 async function sync(){
  if(!wanted()){
   const old=sentinel;sentinel=null;if(old)try{await old.release();}catch{}
   status('inactive');return;
  }
  if(!nav.wakeLock?.request){status('unsupported');return;}
  if(sentinel||pending)return;
  pending=true;
  try{
   const lock=await nav.wakeLock.request('screen');
   if(!wanted()){await lock.release();return;}
   sentinel=lock;status('active');
   lock.addEventListener('release',()=>{if(sentinel===lock){sentinel=null;status('released');}});
  }catch{status(wanted()?'unavailable':'inactive');}
  finally{pending=false;}
 }
 const observer=new Observer(sync);observer.observe(doc.body,{attributes:true,subtree:true,attributeFilter:['data-screen','open']});
 doc.addEventListener('visibilitychange',sync);doc.addEventListener('pointerdown',sync,{passive:true});doc.addEventListener('keydown',sync);
 sync();
 return ()=>{disposed=true;observer.disconnect();doc.removeEventListener('visibilitychange',sync);doc.removeEventListener('pointerdown',sync);doc.removeEventListener('keydown',sync);sync();};
}
