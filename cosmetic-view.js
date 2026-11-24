import {segmentedHTML,segmentedMount} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import {buttonHTML} from './ui-icon.js?v=6714d1bebfde0855f289ae2396849587b277c74e191bc1ae84a5fdd1b44bd11c';

// One persistent selector per detail viewer, shared by skins and effects.
export function cosmeticViewMount(root,change){
 const content=root.querySelector('.skin-content');
 content.insertAdjacentHTML('beforeend',segmentedHTML([['showcase','Showcase','player-skin'],['motion','In Motion','play']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-cosmetic-view':id,'aria-pressed':id==='showcase'})),{label:'Preview View',current:'showcase',className:'cosmetic-view'}));
 const nav=content.querySelector('.cosmetic-view'),bar=nav.closest('.tab-bar');bar.hidden=true;
 const control=segmentedMount(bar,{attribute:'data-cosmetic-view',remember:false,change(next){change(next);return nav;}});
 return {attach(viewer){if(bar.parentElement!==viewer)viewer.append(bar);control.refresh();},value:()=>nav.dataset.current,set(next){if(!['showcase','motion'].includes(next))return;nav.dataset.current=next;for(const b of nav.querySelectorAll('[data-cosmetic-view]'))b.setAttribute('aria-pressed',String(b.dataset.cosmeticView===next));control.refresh();change(next);},show(visible){bar.hidden=!visible;control.refresh();}};
}
