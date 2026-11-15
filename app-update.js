import {GAME_VERSION} from './version.js?v=8cec38d39191d4853b49b42b85b57375c5c2cec92850b260791038978e2e7159';
import {BUILD_TIME} from './build.js?v=c2c4c5e46071ab82b541bef9291041f869bb04473f8034e2c7e02f8435884acd';
import {buttonHTML,iconHTML} from './ui-icon.js?v=2fc20cc9221a523874a677a151fa2d76dd8dda2734129b3078e5c0d045e87188';
export const isAppView=win=>!!win.navigator?.standalone||!!win.matchMedia?.('(display-mode: standalone)').matches||!!win.matchMedia?.('(display-mode: fullscreen)').matches;
export function newerBuild(remote,version=GAME_VERSION,time=BUILD_TIME){
 if(!remote||!/^\d+\.\d+\.\d+$/.test(remote.version)||!Number.isFinite(Date.parse(remote.commitTime)))throw new Error('Invalid release information');
 const a=remote.version.split('.').map(Number),b=version.split('.').map(Number);
 for(let i=0;i<3;i++)if(a[i]!==b[i])return a[i]>b[i];
 return Date.parse(remote.commitTime)>Date.parse(time);
}
export async function checkUpdate({fetch:request=fetch,version=GAME_VERSION,time=BUILD_TIME,save=()=>true,restart=()=>location.reload(),base=location.href}={}){
 const url=new URL('build.json',base);url.searchParams.set('check',String(Date.now()));
 const response=await request(url,{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('The update server could not be reached.');
 const release=await response.json();if(!newerBuild(release,version,time))return {updated:false};
 // Warm the canonical document with the new version before restarting. Hashed
 // module URLs then load the matching assets; no saves or unrelated caches clear.
 const page=await request(new URL('./',base),{cache:'reload',signal:AbortSignal.timeout(15000)});
 if(!page.ok)throw new Error('The new game could not be loaded yet. Try again shortly.');
 const html=await page.text();if(!html.includes(`name="game-version" content="${release.version}"`)||!html.includes(`name="game-build" content="${release.commitTime}"`))throw new Error('The update is still being published. Try again shortly.');
 if(await save()===false)throw new Error('Progress could not be saved. Resolve Progress Recovery before restarting.');
 restart();return {updated:true,version:release.version};
}
export function appUpdateMount({save},doc=document,win=window){
 const help=doc.querySelector('.settings-help');if(!help)return;
 const group=doc.createElement('details');group.className='settings-section settings-updates';
 group.innerHTML=`<summary>${iconHTML('reset')}<span>Updates</span></summary><div class="settings-section-body"><p class="settings-hint">Check for a new version. Your progress is saved before the app restarts.</p>${buttonHTML('Check for Updates','reset',{id:'check-updates',class:'quiet'})}<p class="settings-update-status" role="status" aria-live="polite">Ready to check for updates.</p></div>`;
 help.before(group);const button=group.querySelector('button'),status=group.querySelector('[role=status]');
 const render=()=>{group.hidden=!isAppView(win);};
 for(const query of ['(display-mode: standalone)','(display-mode: fullscreen)'])win.matchMedia?.(query).addEventListener?.('change',render);
 button.onclick=async()=>{button.disabled=true;status.hidden=false;status.textContent='Checking for updates…';try{const result=await checkUpdate({save,base:win.location.href,restart:()=>win.location.reload()});status.textContent=result.updated?'Update ready. Restarting…':'You have the latest version.';}catch(error){status.textContent=win.navigator.onLine===false?'You are offline. Connect to check for updates.':error.message||'Could not check for updates. Try again.';}finally{button.disabled=false;}};render();
}
