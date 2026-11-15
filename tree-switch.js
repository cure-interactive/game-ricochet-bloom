import {buttonHTML} from './ui-icon.js?v=0d0f9193c5aa6fef4bc7c261261b274c333b9a1c84f7bc0aa5c9411ec47da6eb';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=ae6533301310dfdace64dc8d6c4cb5593228e2619ad5192f3f9dc04f83632978';
export function treeSwitchHTML(current){
 return segmentedHTML([['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})),{label:'Skills Views',current,className:'tree-switch'});
}
export function treeSwitchMount(dialog,current,change){
 return segmentedMount(dialog,{attribute:'data-tree-view',change(view){change(view);return dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`);}});
}
