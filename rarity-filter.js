import {escapeHTML} from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
import {segmentedHTML,segmentedMount} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {rarityIconHTML} from './skill-icon.js?v=a663f533204e0c8ec49a3e74b88b99be525495f123c3fa4a5a574c9f5c8a45d5';
import {staticIconHTML} from './ui-icon.js?v=8d255b14e7d23a0f224ee9fa4070909259e237f5c3c988cefd05fd6456bae20e';

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
  const favoriteTab=footer.querySelector('[data-rarity-filter="favorites"]'),nav=footer.querySelector('.segmented-control');
  favoriteTab.hidden=!list.some(card=>favorites.includes(card.dataset.cosmeticCard));
  if(favoriteTab.hidden&&rarity==='favorites')rarity='all';
  nav.dataset.current=rarity;for(const button of nav.querySelectorAll('[data-rarity-filter]'))button.setAttribute('aria-pressed',String(button.dataset.rarityFilter===rarity));
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
  if(button.closest('.cosmetic-card').hidden)(cards().find(card=>!card.hidden)?.querySelector('[data-cosmetic-favorite]')||footer.querySelector('[data-rarity-filter="all"]')).focus({preventScroll:true});
 });
 const control=segmentedMount(root,{attribute:'data-rarity-filter',change(next){rarity=next;refresh();scroll.scrollTop=0;}});
 return {refresh,show(visible){footer.hidden=!visible;refresh();}};
}
