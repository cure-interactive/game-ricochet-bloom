import {buttonHTML} from './ui-icon.js?v=c034fd245b2540631902989670ffc7b2e11942d4f3456fce74a63c3ecaf6710f';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=9177239cf54f096e1a7d7b9a041d427e077baef1d5723af65b85bc1c13778763';
export function treeSwitchHTML(current){
 return segmentedHTML([['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})),{label:'Skills Views',current,className:'tree-switch'});
}
export function treeSwitchMount(dialog,current,change){
 return segmentedMount(dialog,{attribute:'data-tree-view',change(view){change(view);return dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`);}});
}
