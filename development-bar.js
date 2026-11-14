// One bottom profile indicator becomes a music disclosure during gameplay.
export const developmentProfileActive=(kind,shared=false)=>kind==='development'&&!shared;
export function developmentBarMount(doc=document){
 const bar=doc.createElement('div');bar.id='development-profile-bar';bar.setAttribute('popover','manual');bar.hidden=true;
 const status=doc.createElement('span');status.textContent='Development Profile Active';status.setAttribute('role','status');
 const toggle=doc.createElement('button');toggle.type='button';toggle.setAttribute('aria-controls','game-music-bar');toggle.hidden=true;
 bar.append(status,toggle);doc.body.append(bar);
 const panel=doc.getElementById('game-music-bar');
 let active=false,campaign=false,expanded=false,stack=[...doc.querySelectorAll('dialog[open]')];
 const popover=typeof bar.showPopover==='function';
 let reserved=0;
 function measure(){
  const height=active&&!bar.hidden?bar.getBoundingClientRect().height:0;
  if(!Number.isFinite(height)||height<0||height===reserved)return;
  reserved=height;doc.documentElement.style.setProperty('--profile-bottom-space',`${height}px`);
 }
 // The top-layer bar cannot occupy normal flow. Reserve its actual border box
 // once, in the shared viewport budget, rather than padding individual screens.
 if(doc.defaultView.ResizeObserver)new doc.defaultView.ResizeObserver(measure).observe(bar);
 else doc.defaultView.addEventListener('resize',measure,{passive:true});
 function disclosure(){
  const playing=doc.body.dataset.screen==='play'&&!!panel,available=active&&!campaign&&playing&&!stack.length;
  if(!active||!playing)expanded=false;
  toggle.hidden=!available;status.hidden=available;
  toggle.textContent=`Development Profile Active · ${expanded?'Hide':'Show'} Music`;
  toggle.setAttribute('aria-label',toggle.textContent);
  toggle.setAttribute('aria-expanded',String(expanded));
  doc.body.dataset.developmentDisclosure=String(available);
  if(panel)panel.hidden=!(playing&&(campaign||active&&expanded));
 }
 toggle.onclick=()=>{if(!active||toggle.hidden)return;expanded=!expanded;disclosure();};
 function refresh(){
  stack=stack.filter(d=>d.open&&d.isConnected);
  disclosure();
  if(popover&&bar.matches(':popover-open'))bar.hidePopover();
  const visible=active&&!['drift','drift-pause'].includes(doc.body.dataset.screen);
  bar.hidden=!visible;
  if(!visible){measure();return;}
  if(popover)bar.showPopover();
  else {const parent=stack.at(-1)||doc.body;if(bar.parentNode!==parent)parent.append(bar);}
  measure();
 }
 const observer=new doc.defaultView.MutationObserver(records=>{
  let changed=false;
  for(const r of records){
   if(r.type==='attributes'&&r.target.tagName==='DIALOG'){
    stack=stack.filter(d=>d!==r.target);if(r.target.open)stack.push(r.target);changed=true;
   }else if(r.type==='attributes'&&r.target===doc.body&&r.attributeName==='data-screen')changed=true;
   else if(r.type==='childList'&&[...r.removedNodes].some(n=>n===bar||n.contains?.(bar)))changed=true;
  }
  if(changed)refresh();
 });
 observer.observe(doc.body,{attributes:true,attributeFilter:['open','data-screen'],childList:true,subtree:true});
 disclosure();
 return {set(kind,shared=false,musicCampaign=false){const next=developmentProfileActive(kind,shared);if(next===active&&campaign===musicCampaign)return;active=next;campaign=musicCampaign;expanded=false;doc.body.dataset.development=String(active);refresh();}};
}
