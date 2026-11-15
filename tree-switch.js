import {buttonHTML} from './ui-icon.js?v=6d54c4caa769ca38c3ad26db1215fd884511a97d6e85072fad52e5c45607142e';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" aria-label="Skills Views">${[['powers','Powers','skill-tree'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 dialog.addEventListener('click',event=>{const view=event.target.closest('[data-tree-view]')?.dataset.treeView;if(view&&view!==current)change(view);});
}
