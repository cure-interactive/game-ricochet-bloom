import {buttonHTML} from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=1a318092255fb007cafc5d85b01f9155f2a6962c7558c1623c1ab76b7ad5f298';
export function treeSwitchHTML(current){
 return segmentedHTML([['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})),{label:'Skills Views',current,className:'tree-switch'});
}
export function treeSwitchMount(dialog,current,change){
 return segmentedMount(dialog,{attribute:'data-tree-view',change(view){change(view);return dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`);}});
}
