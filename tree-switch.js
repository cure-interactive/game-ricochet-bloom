import {buttonHTML} from './ui-icon.js?v=c034fd245b2540631902989670ffc7b2e11942d4f3456fce74a63c3ecaf6710f';
import {segmentedHTML,segmentedBarMount} from './segmented-control.js?v=908df6c6ea1d5c1c4b197a6c29c3406bf114735dddbc908cf00b030e213b0259';
export function treeSwitchHTML(current){
 return segmentedHTML([['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})),{label:'Skills Views',current,className:'tree-switch'});
}
const groups=new WeakMap();
export function treeSwitchMount(dialog,current,open){
 const doc=dialog.ownerDocument;let group=groups.get(doc);
 if(!group){const destinations=new Map();group={destinations,control:segmentedBarMount(doc,treeSwitchHTML(current),{attribute:'data-tree-view',change:view=>destinations.get(view)?.()})};groups.set(doc,group);}
 group.destinations.set(current,open);
 return {show(){group.control.show(dialog.querySelector('.tree-map-section'),current);}};
}
