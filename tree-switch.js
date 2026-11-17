import {buttonHTML} from './ui-icon.js?v=35ef67d69b283afcc7c65c45f76a6dee06daf0fc829eafd4dff245d7c24940c0';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=243f0a277d087d49db7886bca98385b3ae275c6584df618d00e35953745f0be9';
export function treeSwitchHTML(current){
 return segmentedHTML([['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})),{label:'Skills Views',current,className:'tree-switch'});
}
export function treeSwitchMount(dialog,current,change){
 return segmentedMount(dialog,{attribute:'data-tree-view',change(view){change(view);return dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`);}});
}
