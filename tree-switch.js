import {buttonHTML} from './ui-icon.js?v=38ca69c062e7f070053503afe2ecc1bb3d94f32cc42f76760cbf1495ddfef877';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=ae6533301310dfdace64dc8d6c4cb5593228e2619ad5192f3f9dc04f83632978';
export function treeSwitchHTML(current){
 return segmentedHTML([['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})),{label:'Skills Views',current,className:'tree-switch'});
}
export function treeSwitchMount(dialog,current,change){
 return segmentedMount(dialog,{attribute:'data-tree-view',change(view){change(view);return dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`);}});
}
