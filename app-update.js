import {GAME_VERSION} from './version.js?v=b6fa5f7bf2069f1378e41680dd0874a209bcece4fcdb0c6b95d5798044af2abe';
import {BUILD_TIME} from './build.js?v=b8025ea2db7226673f7fb3cee770e30b3b9bf730c6b4522a476e24e93c06d7fb';
import {buttonHTML,iconHTML} from './ui-icon.js?v=44ea63eff6eacd4cad173283015795275bfc00f891809cd37ea89694c51bd05d';
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
export function updateLifecycleMount({enabled=()=>true,check,onState=()=>{},foreground=true},doc=document,win=window){
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
 if(foreground){doc.addEventListener('visibilitychange',schedule);win.addEventListener('focus',schedule);win.addEventListener('pageshow',schedule);schedule();}
 return {ready:()=>run(true),run:()=>run(false),changed:schedule,destroy(){disposed=true;cancel();doc.removeEventListener('visibilitychange',schedule);win.removeEventListener('focus',schedule);win.removeEventListener('pageshow',schedule);}};
}
export function appUpdateMount({save,getAutomatic=()=>true,setAutomatic=()=>true,foreground=true},doc=document,win=window){
 const help=doc.querySelector('.settings-help');if(!help)return;
 const group=doc.createElement('details');group.className='settings-section settings-updates';
 group.innerHTML=`<summary>${iconHTML('reset')}<span>Updates</span></summary><div class="settings-section-body"><label class="setting-toggle"><input id="automatic-updates" type="checkbox"><span>${iconHTML('reset')}<span>Automatic Updates</span></span></label><p class="settings-hint">Check when the game opens or you return to it. When an update is ready, your progress is saved and the game restarts.</p>${buttonHTML('Check for Updates','reset',{id:'check-updates',class:'quiet'})}<p class="settings-update-status" role="status" aria-live="polite">Ready to check for updates.</p></div>`;
 help.before(group);const button=group.querySelector('#check-updates'),toggle=group.querySelector('input'),status=group.querySelector('[role=status]');
 const changelog=doc.getElementById('game-changelog');if(changelog)status.after(changelog);
 toggle.checked=getAutomatic();
 const control=updateLifecycleMount({foreground,enabled:getAutomatic,check:canRestart=>checkUpdate({save,canRestart,base:win.location.href,restart:()=>win.location.reload()}),onState:state=>{
  if('checking' in state){button.disabled=state.checking;if(state.checking)status.textContent='Checking for updatesâ€¦';}
  if(state.result)status.textContent=state.result.updated?'Update ready. Restartingâ€¦':state.result.deferred?'Update ready. It will be checked when you return.':'You have the latest version.';
  if(state.error)status.textContent=win.navigator.onLine===false?'You are offline. Updates will be checked when you return.':state.error.message||'Could not check for updates. Try again.';
 }},doc,win);
 toggle.onchange=()=>{const saved=setAutomatic(toggle.checked);control.changed();if(saved===false)status.textContent='Changed for this session. This browser could not save the preference.';};
 button.onclick=()=>control.run();return control;
}
