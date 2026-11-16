import {segmentedHTML,segmentedMount} from './segmented-control.js?v=f00bd781036223fc2f7395a6946a17e7106fd0d6d55191f99b6325b4f7da4bc2';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {rarityIconHTML} from './skill-icon.js?v=323da47ec6044e57d9571db79d2e73cc83e5d962daf53f03192092c7de37fdc8';
import {staticIconHTML} from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';

// One persistent filter for every cosmetic gallery. Cards keep their instances
// and catalogue order; detail navigation preserves both filter and scroll.
export function rarityFilterMount(root,{scroll,cards}){
 const footer=root.ownerDocument.createElement('footer');footer.className='rarity-filter';
 footer.innerHTML=segmentedHTML([['all','All'],...Object.entries(RARITIES).map(([id,r])=>[id,r.name])].map(([id,name])=>`<button type="button" data-rarity-filter="${id}" aria-pressed="${id==='all'}">${id==='all'?staticIconHTML('grid'):rarityIconHTML(id)}<span>${name}</span></button>`),{label:'Filter by rarity',current:'all'});
 scroll.after(footer);let rarity='all';
 const empty=root.ownerDocument.createElement('p');empty.className='rarity-empty';empty.setAttribute('role','status');empty.textContent='No styles in this rarity.';empty.hidden=true;scroll.append(empty);
 function refresh(){const list=cards();for(const card of list)card.hidden=rarity!=='all'&&card.dataset.rarity!==rarity;empty.hidden=footer.hidden||list.some(card=>!card.hidden);control.refresh();}
 const control=segmentedMount(root,{attribute:'data-rarity-filter',change(next){rarity=next;refresh();scroll.scrollTop=0;}});
 return {refresh,show(visible){footer.hidden=!visible;refresh();}};
}
