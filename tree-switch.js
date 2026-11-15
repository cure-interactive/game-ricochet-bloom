import {buttonHTML} from './ui-icon.js?v=e8f82528036d2fd5dc9ea4baa32cd3a0f4b8d154b0a5fbb3994c86cdd0cd5bdf';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" data-current="${current}" aria-label="Skills Views"><span class="tree-switch-selection" aria-hidden="true"></span>${[['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 dialog.addEventListener('click',event=>{
  const view=event.target.closest('[data-tree-view]')?.dataset.treeView;if(!view||view===current)return;
  const old=dialog.querySelector('.tree-switch-selection').getBoundingClientRect();
  change(view);
  const nav=dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`),pill=nav?.querySelector('.tree-switch-selection');
  if(!pill?.animate)return;
  // Both trees have their own dialog. Transfer the visible pill position into
  // the newly opened shared control, including an interrupted reverse slide.
  for(const animation of pill.getAnimations())animation.cancel();
  const destination=pill.getBoundingClientRect();
  pill.animate([{translate:`${old.left-destination.left}px 0`,scale:`${old.width/Math.max(1,destination.width)} 1`},{translate:'0 0',scale:'1 1'}],{duration:280,easing:'cubic-bezier(.22,.8,.24,1)'});
 });
}
