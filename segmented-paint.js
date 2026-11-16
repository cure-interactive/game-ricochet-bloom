// One opaque, fully repainted surface owns the moving highlight and its ink.
// Native buttons retain layout, focus and semantics underneath; the live player
// keeps its own animated canvas above this surface.
export function segmentedPainter(doc,win){
 const surfaces=new WeakMap(),images=new Map(),tints=new Map(),waiting=new WeakSet();
 function image(url,repaint){
  let item=images.get(url);
  if(!item){const img=new win.Image();item={img,ready:false,listeners:new Set()};images.set(url,item);img.onload=()=>{item.ready=true;for(const fn of item.listeners)fn();item.listeners.clear();};img.onerror=()=>item.listeners.clear();img.src=url;}
  if(!item.ready)item.listeners.add(repaint);
  return item.ready?item.img:null;
 }
 function tinted(img,color,size){
  const key=img.src+'|'+color+'|'+size;let canvas=tints.get(key);
  if(!canvas){canvas=doc.createElement('canvas');canvas.width=canvas.height=size;const c=canvas.getContext('2d');c.drawImage(img,0,0,size,size);c.globalCompositeOperation='source-in';c.fillStyle=color;c.fillRect(0,0,size,size);tints.set(key,canvas);if(tints.size>96)tints.delete(tints.keys().next().value);}
  return canvas;
 }
 return function draw(nav,buttons,pill){
  let surface=surfaces.get(nav);
  if(!surface){const canvas=doc.createElement?.('canvas'),context=canvas?.getContext?.('2d',{alpha:false});if(!context)return;
   canvas.className='segment-paint';canvas.setAttribute('aria-hidden','true');nav.append(canvas);nav.classList.add('segment-canvas');surface={canvas,context,buttons};surface.repaint=()=>{if(nav.isConnected&&nav.getClientRects().length)draw(nav,surface.buttons,nav.querySelector('.segment-selection').getBoundingClientRect());};surfaces.set(nav,surface);
  }
  const {canvas,context:c}=surface,ratio=Math.min(3,win.devicePixelRatio||1),width=nav.clientWidth,height=nav.clientHeight;
  if(!width||!height)return;
  canvas.style.width=width+'px';canvas.style.height=height+'px';
  const pw=Math.ceil(width*ratio),ph=Math.ceil(height*ratio);if(canvas.width!==pw)canvas.width=pw;if(canvas.height!==ph)canvas.height=ph;
  const bounds=canvas.getBoundingClientRect(),x=pill.left-bounds.left,y=pill.top-bounds.top;
  c.setTransform(ratio,0,0,ratio,0,0);c.fillStyle='#0d202a';c.fillRect(0,0,width,height);
  surface.buttons=buttons;const repaint=surface.repaint;
  const contents=selected=>{
   const color=selected?'#12332e':'#dceeea';
   for(const button of buttons){
    const label=button.querySelector('span:not(.ui-icon)'),icon=button.querySelector('.ui-icon'),art=button.querySelector('img');
    if(label){const r=label.getBoundingClientRect(),s=win.getComputedStyle(label);c.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;c.textAlign='left';c.textBaseline='alphabetic';c.letterSpacing=s.letterSpacing==='normal'?'0px':s.letterSpacing;c.fillStyle=color;
     const metrics=c.measureText(label.textContent),ascent=metrics.fontBoundingBoxAscent??parseFloat(s.fontSize)*.8,descent=metrics.fontBoundingBoxDescent??parseFloat(s.fontSize)*.2;
     c.fillText(label.textContent,r.left-bounds.left,r.top-bounds.top+(r.height-ascent-descent)/2+ascent);
    }
    if(art){if(art.complete&&art.naturalWidth){const r=art.getBoundingClientRect();c.drawImage(art,r.left-bounds.left,r.top-bounds.top,r.width,r.height);}else if(!waiting.has(art)){waiting.add(art);art.addEventListener('load',repaint,{once:true});}}
    if(icon&&icon.dataset.icon!=='player-skin'){
     const url=win.getComputedStyle(icon).getPropertyValue('--ui-icon').trim().match(/^url\(["']?(.*?)["']?\)$/)?.[1],r=icon.getBoundingClientRect(),img=url&&image(new URL(url,doc.baseURI).href,repaint);
     if(img)c.drawImage(tinted(img,color,Math.ceil(Math.max(r.width,r.height)*ratio)),r.left-bounds.left,r.top-bounds.top,r.width,r.height);
    }
   }
  };
  contents(false);c.save();c.beginPath();c.roundRect(x,y,pill.width,pill.height,10);c.clip();c.fillStyle='#b4f2d8';c.fillRect(x,y,pill.width,pill.height);contents(true);c.restore();
  for(const button of buttons)if(button.matches(':focus-visible')){const r=button.getBoundingClientRect();c.strokeStyle='#e9fff5';c.lineWidth=2;c.beginPath();c.roundRect(r.left-bounds.left+1,r.top-bounds.top+1,r.width-2,r.height-2,8);c.stroke();}
 };
}
