import {buttonHTML} from './ui-icon.js?v=c80973e44aaefb9769e151ec4746d8d0a0a1f5288dcb1c3e24c1fac2286b0658';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" aria-label="Skills Views">${[['powers','Powers','skill-tree'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 dialog.addEventListener('click',event=>{const view=event.target.closest('[data-tree-view]')?.dataset.treeView;if(view&&view!==current)change(view);});
}
