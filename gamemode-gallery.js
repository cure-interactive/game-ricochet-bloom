import { GAMEMODE_CARDS, GAMEMODE_CATEGORIES, GAMEMODE_GROUPS, gamemodePage } from './gamemode-catalogue.js?v=d185b654444d8865033f10814afc2d3053a6d8cee35694ca19e4693a13ce9ae6';
import { experimentArt } from './experiment-art.js?v=4082c37f56072d049c2c358e7a73ede9400b661f42dfdea4813e3991c5f2f597';
import { experimentRead, experimentFavourite } from './experiment-store.js?v=218363fa0a9e14c62261cda9b5068f3603a57a699adb96c3fe166aad06603baa';
import { assetURL } from './asset.js?v=d550b28d96684af605439d08505831edfd982d0886527d4831cff7ecdf4d0e66';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';

// Owns gallery view state only. Starting games and opening other screens are
// callbacks, so browsing cannot reach into the live simulation controller.
export function gamemodeGalleryMount({content,heading,storage, ...host}) {
  const $=id=>content.querySelector('#'+id);
  const art=mode=>assetURL(`artwork/mode/${mode}.svg`);
  const galleryState=new Map();
  let rememberGallery=()=>{};
  const starArt='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2L3.2 9.6l6.3-.9Z"/></svg>';
  function gallery(view=''){
    rememberGallery();
    if(!['','favourites','development',...GAMEMODE_GROUPS.map(g=>'group:'+g.id)].includes(view))view='';
    const state=galleryState.get(view)??{query:'',category:'',scroll:0};galleryState.set(view,state);
    host.screen(view?'gamemodes:'+view:'gamemodes');
    const group=GAMEMODE_GROUPS.find(g=>view==='group:'+g.id),title=group?.name??(view==='favourites'?'Favourites':view==='development'?'In Development':'Gamemodes');
    heading.textContent=title;
    content.innerHTML=`<nav class="gamemode-navigation" aria-label="Gamemode navigation">${view?'<button id="gamemode-root">Gamemodes</button>':''}<button id="gamemode-favourites" aria-pressed="${view==='favourites'}">${starArt} Favourites</button><button id="gamemode-development" aria-pressed="${view==='development'}">In Development</button><button id="gamemode-notebook">Saved Runs & Notes</button></nav><p class="mode-intro">${group?escape(group.description):view==='favourites'?'Your starred games, ready to open directly.':view==='development'?'Explore ideas whose gameplay is still being built.':'Choose a game or explore a collection of related challenges.'}</p><div class="gamemode-filter"><label>Search All Gamemodes<input id="gamemode-search" type="search" placeholder="Name, mechanic or idea number" value="${escape(state.query)}"></label>${view==='development'?`<label>Category<select id="gamemode-category"><option value="">All categories</option>${GAMEMODE_CATEGORIES.map(m=>`<option value="${m.id}"${state.category===m.id?' selected':''}>${m.name}</option>`).join('')}</select></label>`:''}</div><p id="gamemode-count" class="gamemode-count" role="status" aria-live="polite"></p><div id="gamemode-list"></div><p id="gamemode-save-status" role="status"></p>`;
    function card(e,favourites,readable){
      const starred=favourites.includes(e.id),label=`${starred?'Unstar':'Star'} ${e.name}`;
      return `<article class="mode-card-shell"><button type="button" class="mode-card" data-gamemode="${e.id}"><span class="mode-card-top"><small class="mode-category">${GAMEMODE_CATEGORIES.find(c=>c.id===e.category)?.name??''}${/^\d/.test(e.id)?' · #'+e.id:''}</small></span>${e.art?`<img src="${art(e.art)}" alt="" width="480" height="240">`:experimentArt(e.id)}<span><strong>${escape(e.name)}</strong><small>${escape(e.description)}</small><em>${e.playable?(e.route==='casual'?'No Points · Just Play':e.route==='setup'?'Three Difficulty Levels':'Play & Settings'):'In Development · View Idea'}</em></span></button><button type="button" class="mode-star" data-favourite="${e.id}" aria-label="${escape(label)}" aria-pressed="${starred}" title="${escape(label)}" ${readable?'':'disabled'}>${starArt}</button></article>`;
    }
    function cards(){
      const read=experimentRead(storage,host.kind()),favourites=read.library?.favourites??[],page=gamemodePage({view,query:state.query,category:state.category,favourites});
      $('gamemode-count').textContent=state.query.trim()?`${page.entries.length} search result${page.entries.length===1?'':'s'} across all gamemodes`:page.groups.length?`${page.entries.length} games · ${page.groups.length} collections`:`${page.entries.length} ${view==='development'?'idea':'game'}${page.entries.length===1?'':'s'}`;
      $('gamemode-save-status').textContent=read.ok?'':'Favourites could not be read. Your existing notebook is preserved.';
      const sections=[true,false].map(playable=>{const entries=page.entries.filter(e=>e.playable===playable);return entries.length?`<section class="gamemode-group"><h3>${playable?'Play Now':'In Development'}</h3><div class="mode-grid">${entries.map(e=>card(e,favourites,read.ok)).join('')}</div></section>`:'';}).join('');
      const collections=page.groups.length?`<section class="gamemode-group"><h3>Collections</h3><div class="mode-grid">${page.groups.map(g=>`<button type="button" class="mode-card" data-group="${g.id}">${experimentArt(g.art)}<span><strong>${g.name}</strong><small>${g.description}</small><em>${g.count} Playable Games · Explore</em></span></button>`).join('')}</div></section>`:'';
      $('gamemode-list').innerHTML=sections+collections||`<p class="gamemode-empty">${view==='favourites'&&!state.query?'No favourites yet. Star a game using the button in the top-right corner of its card.':'No games match. Try another search or category.'}</p>`;
      if(page.planned)$('gamemode-list').insertAdjacentHTML('beforeend',`<p>${page.planned} related ideas are still in development.</p>`);
      for(const b of content.querySelectorAll('[data-gamemode]'))b.onclick=()=>{rememberGallery();const e=GAMEMODE_CARDS.find(e=>e.id===b.dataset.gamemode);host.open(e);};
      for(const b of content.querySelectorAll('[data-group]'))b.onclick=()=>navigate('group:'+b.dataset.group);
      for(const b of content.querySelectorAll('[data-favourite]'))b.onclick=()=>{
        const id=b.dataset.favourite,scroll=content.scrollTop,result=experimentFavourite(storage,host.kind(),id);
        if(!result.ok){$('gamemode-save-status').textContent='Could not save this favourite. Your existing notebook is preserved. Please try again.';return;}
        cards();content.scrollTop=scroll;(content.querySelector(`[data-favourite="${id}"]`)??content.querySelector('[data-favourite]')??$('gamemode-favourites')).focus({preventScroll:true});
        $('gamemode-save-status').textContent=result.active?'Added to Favourites.':'Removed from Favourites.';
      };
    }
    function navigate(next){state.scroll=content.scrollTop;gallery(next);}
    $('gamemode-root')?.addEventListener('click',()=>navigate(''));
    $('gamemode-favourites').onclick=()=>navigate('favourites');
    $('gamemode-development').onclick=()=>navigate('development');
    $('gamemode-notebook').onclick=()=>{rememberGallery();host.notebook();};
    $('gamemode-search').oninput=e=>{state.query=e.target.value;state.scroll=0;cards();};
    $('gamemode-category')?.addEventListener('change',e=>{state.category=e.target.value;state.scroll=0;cards();});
    cards();host.show();content.scrollTop=state.scroll;
    rememberGallery=()=>{state.scroll=content.scrollTop;rememberGallery=()=>{};};
  }
  return {open:gallery,remember:()=>rememberGallery()};
}
