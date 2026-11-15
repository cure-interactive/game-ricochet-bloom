import {GAME_VERSION} from './version.js?v=396091ac883948d93fb8cd9badc90da2f569590f4a10d2aeae21cb08d77345fc';
import {BUILD_TIME} from './build.js?v=633f12ffd67f4d96fc6efa69870de6cf45b9ee3c88cbd4971e945b55ff84032b';
import {buttonHTML} from './ui-icon.js?v=103b94fa6d56faa5abe36425811d79604abe143e6520441bb91f860e9a636119';
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
 const group=doc.querySelector('.settings-help');if(!group)return;
 const wrapper=doc.createElement('div');wrapper.innerHTML=buttonHTML('Check for Updates','reset',{id:'check-updates',class:'quiet'});const button=wrapper.firstElementChild;
 group.prepend(button);const status=doc.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;group.append(status);
 const render=()=>{button.hidden=!isAppView(win);if(button.hidden)status.hidden=true;};
 for(const query of ['(display-mode: standalone)','(display-mode: fullscreen)'])win.matchMedia?.(query).addEventListener?.('change',render);
 button.onclick=async()=>{button.disabled=true;status.hidden=false;status.textContent='Checking for updates…';try{const result=await checkUpdate({save,base:win.location.href,restart:()=>win.location.reload()});status.textContent=result.updated?'Update ready. Restarting…':'You have the latest version.';}catch(error){status.textContent=win.navigator.onLine===false?'You are offline. Connect to check for updates.':error.message||'Could not check for updates. Try again.';}finally{button.disabled=false;}};render();
}
