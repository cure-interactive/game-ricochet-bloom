import {buttonHTML} from './ui-icon.js?v=0bef764d102dc0e159800242f682b3d49abfbf27a976ab9ca47f0d10b1c82188';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" aria-label="Skills Views">${[['powers','Powers','skill-tree'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 dialog.addEventListener('click',event=>{const view=event.target.closest('[data-tree-view]')?.dataset.treeView;if(view&&view!==current)change(view);});
}
