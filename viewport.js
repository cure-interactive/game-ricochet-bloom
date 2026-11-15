// Keep viewport units and safe insets in the same CSS coordinate system. Safari
// can report a different innerHeight after page zoom or an installed-app resume.
// env() already describes browser-chrome clearance. Only clip it further when
// an active keyboard shortens our content viewport inside the CSS viewport.
export function viewportInsets(raw,layoutHeight,height){
  const covered=Math.max(0,layoutHeight-height);
  return {...raw,bottom:Math.max(0,raw.bottom-covered)};
}
export function viewportMount(doc=document,win=window){
  const viewport=win.visualViewport,baseScale=viewport?.scale||1;let frame=0;
  const last=new Map();
  let probe;
  if(win.CSS?.supports?.('height','100dvh')&&doc.createElement){
    probe=doc.createElement('div');
    probe.id='viewport-measure';probe.setAttribute('aria-hidden','true');
    probe.style.cssText='position:fixed;top:0;left:0;width:0;height:100dvh;box-sizing:border-box;visibility:hidden;pointer-events:none;overflow:hidden;contain:strict;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
    doc.documentElement.append(probe);
  }
  function publish(name,value){
    const text=`${Math.round(value*100)/100}px`;
    if(last.get(name)!==text){doc.documentElement.style.setProperty(name,text);last.set(name,text);}
  }
  function update(){
    frame=0;if(doc.hidden)return;
    const standalone=!!win.navigator?.standalone||!!win.matchMedia?.('(display-mode: standalone)').matches;
    // Safari's saved page zoom can start above 1. Treat that as the baseline,
    // not an endless pinch gesture which freezes all later viewport updates.
    if(!standalone&&viewport&&Math.abs(viewport.scale-baseScale)>.01)return;
    const editing=doc.activeElement?.matches?.('textarea,[contenteditable=true],input:not([type]),input[type=text],input[type=search],input[type=email],input[type=url],input[type=tel],input[type=password],input[type=number]');
    const measured=probe?.getBoundingClientRect().height;
    const cssHeight=measured>0?measured:0;
    const height=editing&&viewport?.height>0?Math.min(cssHeight||Infinity,viewport.height):cssHeight||(standalone?win.innerHeight:viewport?.height>0?viewport.height:win.innerHeight);
    if(!Number.isFinite(height)||height<=0)return;
    if(probe){
      const style=win.getComputedStyle(probe),raw={};
      for(const edge of ['top','right','bottom','left'])raw[edge]=Math.max(0,parseFloat(style.getPropertyValue(`padding-${edge}`))||0);
      const insets=viewportInsets(raw,cssHeight||height,height);
      for(const edge of ['top','right','bottom','left'])publish(`--safe-area-${edge}`,insets[edge]);
    }
    publish('--viewport-height',height);
  }
  const schedule=()=>{if(!frame)frame=win.requestAnimationFrame(update);};
  viewport?.addEventListener('resize',schedule,{passive:true});
  for(const name of ['resize','orientationchange','pageshow'])win.addEventListener(name,schedule,{passive:true});
  doc.addEventListener('visibilitychange',()=>{if(!doc.hidden)schedule();});
  for(const name of ['focusin','focusout'])doc.addEventListener(name,schedule);
  if(probe&&win.ResizeObserver)new win.ResizeObserver(schedule).observe(probe);
  update();
}
