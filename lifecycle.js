// Every background route must checkpoint the same paused state. Restoring a
// cached page never launches a shot or resumes active play without a gesture.
export function lifecycleMount(page, browser, suspend, visible, returnToPause=()=>{}) {
  let interrupted=false;
  const hold=()=>{interrupted=true;suspend();};
  const foreground=()=>{if(interrupted){interrupted=false;returnToPause();}visible();};
  const visibility = () => page.hidden ? hold() : foreground();
  const restored = event => { if (event.persisted) { hold(); if(!page.hidden)foreground(); } };
  page.addEventListener('visibilitychange', visibility);
  page.addEventListener('freeze', hold);
  browser.addEventListener('pagehide', hold);
  browser.addEventListener('pageshow', restored);
  return () => {
    page.removeEventListener('visibilitychange', visibility);
    page.removeEventListener('freeze', hold);
    browser.removeEventListener('pagehide', hold);
    browser.removeEventListener('pageshow', restored);
  };
}
