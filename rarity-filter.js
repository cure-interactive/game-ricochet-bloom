import {segmentedHTML,segmentedMount} from './segmented-control.js?v=e01092f1909350f2de0d577c1402eff5b6621367607d815de120299d3f0ab153';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {rarityIconHTML} from './skill-icon.js?v=79f84be6812079dcd8b2766d28af69d11f4714dc8718f1c0ea3aa7b91a0d9f13';
import {staticIconHTML} from './ui-icon.js?v=e7e1e0264b8d800aa16ee5e89ddb82b5bd4dfa68327d0cff8b81d788cb47de8c';

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
