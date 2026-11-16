import {GAME_VERSION} from './version.js?v=bce572041296d0b9538c50491bc8f9c05cb158e3682123e319f4f0a5ed306df1';
import {BUILD_TIME} from './build.js?v=984eb85ecd47f02fd3a69fc131fd52d99fb6ee17fd9439111f7db405fcb77acb';
import {buttonHTML,iconHTML} from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';
export const isAppView=win=>!!win.navigator?.standalone||!!win.matchMedia?.('(display-mode: standalone)').matches||!!win.matchMedia?.('(display-mode: fullscreen)').matches;
export function newerBuild(remote,version=GAME_VERSION,time=BUILD_TIME){
 if(!remote||!/^\d+\.\d+\.\d+$/.test(remote.version)||!Number.isFinite(Date.parse(remote.commitTime)))throw new Error('Invalid release information');
 const a=remote.version.split('.').map(Number),b=version.split('.').map(Number);
 for(let i=0;i<3;i++)if(a[i]!==b[i])return a[i]>b[i];
 return Date.parse(remote.commitTime)>Date.parse(time);
}
export async function checkUpdate({fetch:request=fetch,version=GAME_VERSION,time=BUILD_TIME,save=()=>true,restart=()=>location.reload(),canRestart=()=>true,base=location.href}={}){
 const url=new URL('build.json',base);url.searchParams.set('check',String(Date.now()));
 const response=await request(url,{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('The update server could not be reached.');
 const release=await response.json();if(!newerBuild(release,version,time))return {updated:false};
 // Warm the canonical document with the new version before restarting. Hashed
 // module URLs then load the matching assets; no saves or unrelated caches clear.
 const page=await request(new URL('./',base),{cache:'reload',signal:AbortSignal.timeout(15000)});
 if(!page.ok)throw new Error('The new game could not be loaded yet. Try again shortly.');
 const html=await page.text();if(!html.includes(`name="game-version" content="${release.version}"`)||!html.includes(`name="game-build" content="${release.commitTime}"`))throw new Error('The update is still being published. Try again shortly.');
 if(!canRestart())return {updated:false,deferred:true};
 if(await save()===false)throw new Error('Progress could not be saved. Resolve Progress Recovery before restarting.');
 if(!canRestart())return {updated:false,deferred:true};
 restart();return {updated:true,version:release.version};
}
// Foreground signals share one request and one restart decision.
export function updateLifecycleMount({enabled=()=>true,check,onState=()=>{}},doc=document,win=window){
 let timer=null,pending=null,disposed=false;
 const cancel=()=>{if(timer!==null){win.clearTimeout(timer);timer=null;}};
 function run(automatic=false){
  cancel();if(disposed||doc.hidden||automatic&&!enabled())return Promise.resolve(null);
  if(pending)return pending;
  onState({checking:true});
  pending=Promise.resolve().then(()=>check(()=>!disposed&&!doc.hidden&&(!automatic||enabled())))
   .then(result=>{onState({result});return result;},error=>{onState({error});return null;})
   .finally(()=>{pending=null;onState({checking:false});});
  return pending;
 }
 function schedule(){cancel();if(!disposed&&!doc.hidden&&enabled())timer=win.setTimeout(()=>{timer=null;run(true);},250);}
 doc.addEventListener('visibilitychange',schedule);win.addEventListener('focus',schedule);win.addEventListener('pageshow',schedule);
 schedule();
 return {run:()=>run(false),changed:schedule,destroy(){disposed=true;cancel();doc.removeEventListener('visibilitychange',schedule);win.removeEventListener('focus',schedule);win.removeEventListener('pageshow',schedule);}};
}
export function appUpdateMount({save,getAutomatic=()=>true,setAutomatic=()=>true},doc=document,win=window){
 const help=doc.querySelector('.settings-help');if(!help)return;
 const group=doc.createElement('details');group.className='settings-section settings-updates';
 group.innerHTML=`<summary>${iconHTML('reset')}<span>Updates</span></summary><div class="settings-section-body"><label class="setting-toggle"><input id="automatic-updates" type="checkbox"><span>${iconHTML('reset')}<span>Automatic updates</span></span></label><p class="settings-hint">Check when the game opens or you return to it. When an update is ready, your progress is saved and the game restarts.</p>${buttonHTML('Check for Updates','reset',{id:'check-updates',class:'quiet'})}<p class="settings-update-status" role="status" aria-live="polite">Ready to check for updates.</p></div>`;
 help.before(group);const button=group.querySelector('button'),toggle=group.querySelector('input'),status=group.querySelector('[role=status]');
 toggle.checked=getAutomatic();
 const control=updateLifecycleMount({enabled:getAutomatic,check:canRestart=>checkUpdate({save,canRestart,base:win.location.href,restart:()=>win.location.reload()}),onState:state=>{
  if('checking' in state){button.disabled=state.checking;if(state.checking)status.textContent='Checking for updates…';}
  if(state.result)status.textContent=state.result.updated?'Update ready. Restarting…':state.result.deferred?'Update ready. It will be checked when you return.':'You have the latest version.';
  if(state.error)status.textContent=win.navigator.onLine===false?'You are offline. Updates will be checked when you return.':state.error.message||'Could not check for updates. Try again.';
 }},doc,win);
 toggle.onchange=()=>{const saved=setAutomatic(toggle.checked);control.changed();if(saved===false)status.textContent='Changed for this session. This browser could not save the preference.';};
 button.onclick=()=>control.run();return control;
}
