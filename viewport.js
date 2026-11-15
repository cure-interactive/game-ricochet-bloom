// Keep viewport units and safe insets in the same CSS coordinate system. Safari
// can report a different innerHeight after page zoom or an installed-app resume.
// Normally env() owns clearance. Account for a narrowly identified installed
// WebKit shell defect and for an active keyboard inside that viewport.
export function viewportInsets(raw,layoutHeight,height){
  const covered=Math.max(0,layoutHeight-height);
  return {...raw,bottom:Math.max(0,raw.bottom-covered)};
}
// WebKit #313800: some installed iPhone shells reserve a status-bar-sized
// region outside the page but still return a bottom env() inset inside it.
// This is deliberately a narrow compatibility check, not a screen-height layout.
export function viewportShellBottom(raw,{standalone=false,iphone=false,width,height,screenWidth,screenHeight,scale=1,offsetTop=0,offsetLeft=0}={}){
  if(!standalone||!iphone||!(raw.bottom>0)||!(raw.top>raw.bottom)||!(scale>0)||!(screenHeight>screenWidth)||Math.abs(offsetTop)>1||Math.abs(offsetLeft)>1)return raw.bottom;
  const fullWidth=Number.isFinite(width)&&Math.abs(width*scale-screenWidth)<=2;
  const outside=screenHeight-height*scale,tolerance=Math.max(2,raw.top*.04);
  return fullWidth&&outside>=raw.bottom&&Math.abs(outside-raw.top)<=tolerance?0:raw.bottom;
}
export function viewportMount(doc=document,win=window){
  const viewport=win.visualViewport,baseScale=viewport?.scale||1;let frame=0;
  const last=new Map();
  let probe,bounds;
  if(win.CSS?.supports?.('height','100dvh')&&doc.createElement){
    probe=doc.createElement('div');
    probe.id='viewport-measure';probe.setAttribute('aria-hidden','true');
    probe.style.cssText='position:fixed;top:0;left:0;width:0;height:100dvh;box-sizing:border-box;visibility:hidden;pointer-events:none;overflow:hidden;contain:strict;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
    doc.documentElement.append(probe);
    bounds=doc.createElement('div');bounds.id='viewport-bounds';bounds.setAttribute('aria-hidden','true');
    bounds.style.cssText='position:fixed;inset:0;visibility:hidden;pointer-events:none;contain:strict';
    doc.documentElement.append(bounds);
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
    const dynamicHeight=measured>0?measured:0,fixedHeight=bounds?.getBoundingClientRect().height||0;
    // An installed shell may under-report dvh while its fixed containing block
    // still reaches the available edge (WebKit #254868). Never use screen size
    // to manufacture a taller, potentially clipped interactive surface.
    const cssHeight=standalone?Math.max(dynamicHeight,fixedHeight):dynamicHeight;
    const height=editing&&viewport?.height>0?Math.min(cssHeight||Infinity,viewport.height):cssHeight||(standalone?win.innerHeight:viewport?.height>0?viewport.height:win.innerHeight);
    if(!Number.isFinite(height)||height<=0)return;
    if(probe){
      const style=win.getComputedStyle(probe),raw={};
      for(const edge of ['top','right','bottom','left'])raw[edge]=Math.max(0,parseFloat(style.getPropertyValue(`padding-${edge}`))||0);
      const bottom=editing?raw.bottom:viewportShellBottom(raw,{standalone,iphone:/iPhone|iPod/.test(win.navigator?.userAgent||''),width:viewport?.width||win.innerWidth,height:cssHeight||height,screenWidth:win.screen?.width,screenHeight:win.screen?.height,scale:viewport?.scale||1,offsetTop:viewport?.offsetTop||0,offsetLeft:viewport?.offsetLeft||0});
      const insets=viewportInsets({...raw,bottom},cssHeight||height,height);
      publish('--viewport-dynamic-height',dynamicHeight);publish('--viewport-fixed-height',fixedHeight);
      publish('--safe-area-bottom-reported',raw.bottom);
      publish('--safe-area-bottom-external',raw.bottom-bottom);
      for(const edge of ['top','right','bottom','left'])publish(`--safe-area-${edge}`,insets[edge]);
    }
    publish('--viewport-height',height);
  }
  const schedule=()=>{if(!frame)frame=win.requestAnimationFrame(update);};
  viewport?.addEventListener('resize',schedule,{passive:true});
  for(const name of ['resize','orientationchange','pageshow'])win.addEventListener(name,schedule,{passive:true});
  doc.addEventListener('visibilitychange',()=>{if(!doc.hidden)schedule();});
  for(const name of ['focusin','focusout'])doc.addEventListener(name,schedule);
  if(probe&&win.ResizeObserver){const observer=new win.ResizeObserver(schedule);observer.observe(probe);observer.observe(bounds);}
  update();
}
