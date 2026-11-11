// Every background route must checkpoint the same paused state. Restoring a
// cached page never launches a shot or resumes active play without a gesture.
export function lifecycleMount(page, browser, suspend, visible) {
  const visibility = () => page.hidden ? suspend() : visible();
  const restored = event => { if (event.persisted) suspend(); };
  page.addEventListener('visibilitychange', visibility);
  page.addEventListener('freeze', suspend);
  browser.addEventListener('pagehide', suspend);
  browser.addEventListener('pageshow', restored);
  return () => {
    page.removeEventListener('visibilitychange', visibility);
    page.removeEventListener('freeze', suspend);
    browser.removeEventListener('pagehide', suspend);
    browser.removeEventListener('pageshow', restored);
  };
}
