import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=85baee81ddba2373d8557c60e4f613c8605c94af9623563ec7e5bc8033ff4852';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {rarityIconHTML} from './skill-icon.js?v=323da47ec6044e57d9571db79d2e73cc83e5d962daf53f03192092c7de37fdc8';
import {staticIconHTML} from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';

export const rarityPreviewHTML=(rarity,art)=>`<span class="rarity-preview">${art}<span class="rarity-preview-badge" aria-hidden="true">${rarityIconHTML(rarity)}</span></span>`;

// One persistent filter for every cosmetic gallery. Cards keep their instances
// and catalogue order; detail navigation preserves both filter and scroll.
export const cosmeticCardHTML=(item,content)=>`<article class="cosmetic-card" data-cosmetic-card="${escapeHTML(item.id)}" data-rarity="${item.rarity}">${content}<button type="button" class="cosmetic-favorite" data-cosmetic-favorite="${escapeHTML(item.id)}" data-name="${escapeHTML(item.name)}" aria-label="Star ${escapeHTML(item.name)}" aria-pressed="false">${staticIconHTML('star-outline')}</button></article>`;
export function rarityFilterMount(root,{scroll,cards,profile,act,status}){
 const footer=root.ownerDocument.createElement('footer');footer.className='rarity-filter';
 footer.innerHTML=segmentedHTML([['all','All'],['favorites','Favorites'],...Object.entries(RARITIES).map(([id,r])=>[id,r.name])].map(([id,name])=>`<button type="button" data-rarity-filter="${id}" aria-pressed="${id==='all'}">${id==='all'?staticIconHTML('grid'):id==='favorites'?staticIconHTML('star'):rarityIconHTML(id)}<span>${name}</span></button>`),{label:'Filter by rarity',current:'all',className:'segment-scrollable'});
 scroll.after(footer);let rarity='all';
 const empty=root.ownerDocument.createElement('p');empty.className='rarity-empty';empty.setAttribute('role','status');empty.textContent='No styles in this rarity.';empty.hidden=true;scroll.append(empty);
 function refresh(){
  const list=cards(),favorites=profile?.()?.cosmeticFavorites||[];
  for(const card of list){
   const starred=favorites.includes(card.dataset.cosmeticCard),button=card.querySelector('[data-cosmetic-favorite]');
   card.hidden=rarity==='favorites'?!starred:rarity!=='all'&&card.dataset.rarity!==rarity;
   if(button){button.setAttribute('aria-pressed',String(starred));button.setAttribute('aria-label',`${starred?'Unstar':'Star'} ${button.dataset.name}`);button.innerHTML=staticIconHTML(starred?'star':'star-outline');}
  }
  empty.textContent=rarity==='favorites'?'No favorites yet. Star a card to find it here.':'No styles in this rarity.';
  empty.hidden=footer.hidden||list.some(card=>!card.hidden);control.refresh();
 }
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-cosmetic-favorite]');if(!button)return;
  event.preventDefault();event.stopPropagation();const result=act?.({type:'favorite-cosmetic',id:button.dataset.cosmeticFavorite});
  if(!result?.ok){if(status)status.textContent=result?.reason||'Could not save this favorite. Please try again.';return;}
  refresh();if(status)status.textContent='';
  if(button.closest('.cosmetic-card').hidden)(cards().find(card=>!card.hidden)?.querySelector('[data-cosmetic-favorite]')||footer.querySelector('[data-rarity-filter="favorites"]')).focus({preventScroll:true});
 });
 const control=segmentedMount(root,{attribute:'data-rarity-filter',change(next){rarity=next;refresh();scroll.scrollTop=0;}});
 return {refresh,show(visible){footer.hidden=!visible;refresh();}};
}
