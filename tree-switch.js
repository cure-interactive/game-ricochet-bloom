import {buttonHTML} from './ui-icon.js?v=0963cd053d0a0800e33d00fd5c13d534adc684f6c740fd8a4ac552d779c53a6b';
import {segmentedHTML,segmentedBarMount} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
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
