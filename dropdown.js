import { iconNode } from './ui-icon.js?v=8c06dc6cfead8fb7f911c3f4f5d15ca9cae08f5df389037de10e703f88542d83';
// Native selects remain the value/change owner; one themed popup presents them.
export function dropdownMount(doc=document,win=window){
 const entries=new Map();let opened=null,serial=0,queued=false,type='',typedAt=0;
 function close(focus=true){
  if(!opened)return;const item=opened;opened=null;
  if(item.panel.matches(':popover-open'))item.panel.hidePopover();item.panel.hidden=true;
  item.button.setAttribute('aria-expanded','false');if(focus&&item.button.isConnected)item.button.focus({preventScroll:true});
 }
 function refresh(item){
  const {select,button,text}=item,selected=select.selectedOptions[0];
  if(text.textContent!==(selected?.textContent||''))text.textContent=selected?.textContent||'';
  button.disabled=select.disabled;
  const label=select.getAttribute('aria-label')||[...select.labels||[]].map(l=>[...l.childNodes].filter(n=>n.nodeType===3||n.nodeType===1&&!n.contains(select)&&!n.contains(button)).map(n=>n.textContent).join(' ')).join(' ').trim()||select.name||'Choose an option';
  button.setAttribute('aria-label',`${label}: ${text.textContent}`);
  if(select.getAttribute('aria-describedby'))button.setAttribute('aria-describedby',select.getAttribute('aria-describedby'));
 }
 function open(item){
  close(false);refresh(item);if(item.button.disabled)return;opened=item;type='';
  const choices=[...item.select.options].filter(option=>!option.hidden);
  item.panel.replaceChildren(...choices.map(option=>{
   const button=doc.createElement('button');button.type='button';button.role='option';button.tabIndex=-1;button.disabled=option.disabled||option.parentElement?.disabled===true;
   button.setAttribute('aria-selected',String(option.selected));button.append(iconNode(option.selected?'radio-on':'radio-off'),doc.createTextNode(option.textContent));
   button.onclick=()=>{if(button.disabled)return;item.select.value=option.value;item.select.dispatchEvent(new Event('input',{bubbles:true}));item.select.dispatchEvent(new Event('change',{bubbles:true}));refresh(item);close();};return button;
  }));
  item.panel.hidden=false;item.panel.showPopover?.();item.button.setAttribute('aria-expanded','true');
  position(item);
  const selected=item.panel.querySelector('[aria-selected="true"]:not(:disabled)')||item.panel.querySelector('button:not(:disabled)');selected?.focus({preventScroll:true});selected?.scrollIntoView({block:'nearest'});
 }
 function position(item){
  const r=item.button.getBoundingClientRect(),height=win.innerHeight,width=Math.min(Math.max(r.width,180),win.innerWidth-16);
  const below=height-r.bottom-8,above=r.top-8,useAbove=below<Math.min(240,item.panel.children.length*48)&&above>below;
  Object.assign(item.panel.style,{width:width+'px',left:Math.max(8,Math.min(r.left,win.innerWidth-width-8))+'px',top:useAbove?'auto':r.bottom+5+'px',bottom:useAbove?height-r.top+5+'px':'auto',maxHeight:Math.max(80,(useAbove?above:below)-5)+'px'});
 }
 function enhance(select){
  if(select.multiple||select.size>1||entries.has(select))return;
  const wrap=doc.createElement('span');wrap.className='game-dropdown';
  const button=doc.createElement('button');button.type='button';button.className='dropdown-trigger';button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
  const text=doc.createElement('span'),chevron=doc.createElement('span');chevron.className='ui-icon';chevron.dataset.icon='arrow-down';chevron.setAttribute('aria-hidden','true');button.append(text,chevron);wrap.append(button);select.after(wrap);
  const panel=doc.createElement('div');panel.id='dropdown-options-'+(++serial);panel.className='dropdown-options';panel.role='listbox';panel.setAttribute('popover','manual');panel.hidden=true;button.setAttribute('aria-controls',panel.id);(select.closest('dialog')||doc.body).append(panel);
  const item={select,wrap,button,text,panel};entries.set(select,item);select.hidden=true;refresh(item);
  button.onclick=()=>opened===item?close():open(item);
  button.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open(item);}});
  select.addEventListener('change',()=>refresh(item));
  panel.addEventListener('keydown',event=>{
   const options=[...panel.querySelectorAll('button:not(:disabled)')],index=options.indexOf(doc.activeElement);let next=index;
   if(event.key==='ArrowDown')next=(index+1)%options.length;else if(event.key==='ArrowUp')next=(index+options.length-1)%options.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=options.length-1;
   else if(event.key==='Tab'){close();return;}else if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&event.key!==' '){const now=Date.now();type=now-typedAt>700?event.key:type+event.key;typedAt=now;next=options.findIndex(o=>o.textContent.toLowerCase().startsWith(type.toLowerCase()));}else return;
   event.preventDefault();options[next]?.focus();
  });
 }
 const pointer=event=>{if(opened&&!opened.wrap.contains(event.target)&&!opened.panel.contains(event.target))close(false);};
 const key=event=>{if(opened&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();close();}};
 const scan=()=>{queued=false;for(const [select,item] of entries){if(!select.isConnected){if(opened===item)close(false);item.wrap.remove();item.panel.remove();entries.delete(select);}else refresh(item);}for(const select of doc.querySelectorAll('select'))enhance(select);if(opened&&!opened.button.getClientRects().length)close(false);};
 const schedule=()=>{if(!queued){queued=true;queueMicrotask(scan);}};
 // Writes in refresh are conditional so native render updates cannot cause loops.
 const observer=new MutationObserver(records=>{if(records.some(r=>!r.target.closest?.('.game-dropdown,.dropdown-options')))schedule();});
 observer.observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['selected','disabled','hidden','open']});
 doc.addEventListener('pointerdown',pointer,true);doc.addEventListener('keydown',key,true);doc.addEventListener('reset',schedule);win.addEventListener('resize',()=>{if(opened)position(opened);});scan();
 return {close,refresh:scan};
}
