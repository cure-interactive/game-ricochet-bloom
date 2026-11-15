import {buttonHTML} from './ui-icon.js?v=030c0efc6cdfba88e28420bfcfaf809c34dba306c37f69d9b366521d5b469e5d';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" aria-label="Skills Views">${[['powers','Powers','skill-tree'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 dialog.addEventListener('click',event=>{const view=event.target.closest('[data-tree-view]')?.dataset.treeView;if(view&&view!==current)change(view);});
}
