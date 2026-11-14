import {buttonHTML} from './ui-icon.js?v=a45b8b7529e9829c50cbaee84ed71f02e69362d8a4b87c41723a1409fa839d8b';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" aria-label="Skills Views">${[['powers','Powers','skill-tree'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 dialog.addEventListener('click',event=>{const view=event.target.closest('[data-tree-view]')?.dataset.treeView;if(view&&view!==current)change(view);});
}
