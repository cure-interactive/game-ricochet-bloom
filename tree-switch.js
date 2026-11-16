import {buttonHTML} from './ui-icon.js?v=23254d5124a1e10208687f81fc9971554edfeeb2b34e4c17b4d273dc2d5cad13';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=ae6533301310dfdace64dc8d6c4cb5593228e2619ad5192f3f9dc04f83632978';
export function treeSwitchHTML(current){
 return segmentedHTML([['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})),{label:'Skills Views',current,className:'tree-switch'});
}
export function treeSwitchMount(dialog,current,change){
 return segmentedMount(dialog,{attribute:'data-tree-view',change(view){change(view);return dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`);}});
}
