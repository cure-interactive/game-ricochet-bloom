// Browser chrome can resize the visible area without resizing the layout viewport.
// Publish the visible viewport; CSS subtracts shared chrome for every screen.
// Do not reflow pinch zoom.
export function viewportMount(doc=document,win=window){
  const viewport=win.visualViewport;let frame=0,last='';
  function update(){
    frame=0;if(doc.hidden)return;
    if(viewport&&Math.abs(viewport.scale-1)>.01)return;
    const standalone=!!win.navigator?.standalone||!!win.matchMedia?.('(display-mode: standalone)').matches;
    const editing=doc.activeElement?.matches?.('input,textarea,[contenteditable=true]');
    const height=standalone&&!editing?win.innerHeight:viewport?.height>0?viewport.height:win.innerHeight;
    if(!Number.isFinite(height)||height<=0)return;
    const value=`${Math.round(height*100)/100}px`;
    if(value!==last){doc.documentElement.style.setProperty('--viewport-height',value);last=value;}
  }
  const schedule=()=>{if(!frame)frame=win.requestAnimationFrame(update);};
  viewport?.addEventListener('resize',schedule,{passive:true});
  for(const name of ['resize','orientationchange','pageshow'])win.addEventListener(name,schedule,{passive:true});
  doc.addEventListener('visibilitychange',()=>{if(!doc.hidden)schedule();});
  update();
}
