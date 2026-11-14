import {buttonHTML} from './ui-icon.js?v=7e81246e997e2106001cc2f001032e68090a0c751f008678bd91820191a7979e';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" aria-label="Skill Tree Views">${[['powers','Powers','skill-tree'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 dialog.addEventListener('click',event=>{const view=event.target.closest('[data-tree-view]')?.dataset.treeView;if(view&&view!==current)change(view);});
}
