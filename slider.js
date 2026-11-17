import {uiWind,uiWindMoved} from './ui-sound.js?v=4a2a1d353744aeef5ade6b422cecb774bf3d9a7eb3241eea60df1cf0b4cd4236';
// Native ranges retain values, labels, keyboard and assistive-technology behavior.
// Shared DOM paints every slider; pointer mapping does not depend on host widgets.
export function sliderValue(min,max,step,fraction){
 const value=min+Math.max(0,Math.min(1,fraction))*(max-min);
 return Math.max(min,Math.min(max,step>0?Number((min+Math.round((value-min)/step)*step).toFixed(10)):value));
}
export function sliderMount(doc=document,win=window){
 const entries=new Map();
 function enhance(input){
  const wrap=doc.createElement('span');wrap.className='game-slider';
  const rail=doc.createElement('span'),fill=doc.createElement('span'),thumb=doc.createElement('span');
  rail.className='slider-rail';fill.className='slider-fill';thumb.className='slider-thumb';
  for(const el of [rail,thumb])el.setAttribute('aria-hidden','true');
  input.before(wrap);rail.append(fill);wrap.append(rail,thumb,input);
  let drag=null,previous=Number(input.value);
  const limits=()=>({min:input.min===''?0:Number(input.min),max:input.max===''?100:Number(input.max),step:input.step==='any'?0:Number(input.step)||1});
  const refresh=()=>{const {min,max}=limits();previous=Number(input.value);wrap.style.setProperty('--slider-value',String(max>min?Math.max(0,Math.min(1,(Number(input.value)-min)/(max-min))):0));wrap.dataset.disabled=String(input.disabled);};
  // Existing settings owners assign .value directly when restoring a profile.
  const descriptor=Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype,'value');
  Object.defineProperty(input,'value',{configurable:true,get(){return descriptor.get.call(this);},set(value){descriptor.set.call(this,value);refresh();}});
  const update=e=>{
   const r=rail.getBoundingClientRect(),{min,max,step}=limits(),rtl=win.getComputedStyle(input).direction==='rtl';
   const fraction=(e.clientX-r.left)/Math.max(1,r.width),value=String(sliderValue(min,max,step,rtl?1-fraction:fraction));
   const changed=value!==input.value,x=Math.max(r.left,Math.min(r.left+r.width,e.clientX));
   if(changed){input.value=value;input.dispatchEvent(new win.Event('input',{bubbles:true}));}
   if(uiWindMoved(drag.cueX,x,changed)){uiWind(input,(x-drag.cueX)/Math.max(1,r.width)||Number(value)-Number(drag.start),e,(Number(value)-min)/Math.max(1,max-min));drag.cueX=x;}
  };
  const end=e=>{if(!drag||e.pointerId!==drag.id)return;const changed=input.value!==drag.start;drag=null;delete wrap.dataset.held;if(input.hasPointerCapture(e.pointerId))input.releasePointerCapture(e.pointerId);if(changed)input.dispatchEvent(new win.Event('change',{bubbles:true}));};
  input.addEventListener('pointerdown',e=>{if(input.disabled||e.button!==0||drag)return;e.preventDefault();input.focus({preventScroll:true});drag={id:e.pointerId,start:input.value,cueX:e.clientX};input.setPointerCapture(e.pointerId);wrap.dataset.held='true';update(e);});
  input.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId){e.preventDefault();update(e);}});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])input.addEventListener(name,end);
  input.addEventListener('input',e=>{const {min,max}=limits();if(!drag)uiWind(input,(Number(input.value)-previous)/Math.max(1,max-min),e,(Number(input.value)-min)/Math.max(1,max-min));refresh();});input.addEventListener('change',refresh);
  const observer=new win.MutationObserver(refresh);observer.observe(input,{attributes:true,attributeFilter:['value','min','max','step','disabled']});
  entries.set(input,{refresh,observer});refresh();
 }
 const scan=()=>{for(const [input,item] of entries)if(!input.isConnected){item.observer.disconnect();entries.delete(input);}for(const input of doc.querySelectorAll('input[type=range]'))if(!entries.has(input))enhance(input);};
 const observer=new win.MutationObserver(scan);observer.observe(doc.body,{childList:true,subtree:true});
 doc.addEventListener('reset',()=>queueMicrotask(()=>{for(const item of entries.values())item.refresh();}));scan();
 return {refresh(){scan();for(const item of entries.values())item.refresh();}};
}
