import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { screenHeader } from './screen-header.js?v=786f504b0d8e7c345d1c30428db16e12dc5b1c2513f004bec1c0c4c0b2618c9a';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { iconHTML } from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';
import { wikiTopicIcon, wikiStrongHTML } from './wiki-icon.js?v=bfd8e5fa22b9b2983cd06fa089ef46301ab9be21afc062afbb3057966b441912';

export const WIKI_PAGES = Object.freeze({
  'cosmetic-rarity':{title:'Cosmetic Rarity',url:'./wiki/cosmetic-rarity.md?v=896a1be30fb81f887b14ee93cdf79f18ddd4de10df2e42db5cd15ab295594af3'},
  changelog: { title: 'Change Logs', url: './wiki/changelog.md?v=6ba1e071529e04e8e725efdae16993b5e4a95fb98f54b5d09e92b49de67a19a5' },
  player: { title: 'Player', url: './wiki/player.md?v=0a7a5c5bac2db2865c09ad2437033e04385139d4caf7ec1b654690dd5e895ed0' },
  developer: { title: 'Developer', development: true, url: './wiki/developer.md?v=8bbd51ef13042a46fa7ace852798c897795fd7ec22cc778d2a1bd19e606099a5' },
  medals: { title: 'Medals', url: './wiki/medals.md?v=8e4bd3a9087a3772f6c6f6eecd7b835c3419fddfc7372f20360fdbb87a1529c0' },
  'score-attack': { title: 'Score Attack', url: './wiki/score-attack.md?v=c607b2d4e304d343c0815a81882356b4613b7d19554b3e82aa3383def0720193' },
  experiments: { title: 'Play the Experiments', url: './wiki/experiments.md?v=6051ff2946335f320cc36f76e159b8c74806e015b0c9b35141e50fb2205808bd' },
  'development-concept': { development: true, title: 'Development Concept', url: './wiki/development-concept.md?v=2135a1f9773ebeb036c23a038d08786f3f8947e16dce43863a67af0ab790dc36' },
  'game-modes': { development: true, title: 'Game Modes to Try', url: './wiki/game-modes.md?v=dcc952e821bf4579a59a3d5a7dada9cc83b5d191ad4b12c3b250fdfb0bb74c88' },
  waves: { title: 'Endless Waves', url: './wiki/waves.md?v=e55368d7bc59e118d866c5f0413bc9f20f5493013b5c6b6ccf7c39f697aff1c5' },
  contents: { title: 'Contents', url: './wiki/contents.md?v=54f6282ef84d666d5ddb2121e0d24825cf921f8b06196332dfbd9e96bfc71081' },
  wiki: { title: 'Wiki', url: './wiki/wiki.md?v=543ce8c11fb5723231312405b2d53945c5e12fa5d38a6b72224c5e12dcfa3e8a' },
  'how-to-play': { title: 'How to Play', url: './wiki/how-to-play.md?v=be1529e94417ad6a4a0c268f61e340a8b1495d05b8a7f2d9f7d1b468c4377b0d' },
  campaign: { title: 'Melody Journey', url: './wiki/campaign.md?v=e026ea11f5c9b5353e502ade842d29105c205541db51ff9ed859c22d6740c1bb' },
  'skill-tree': { title: 'Skills', url: './wiki/skill-tree.md?v=a2fe43e02ad2b75313cdf4f5808432c438a6ebea1eebd2cde9b935ecdc2a7168' },
  'power-ups': { title: 'Power-Ups', url: './wiki/power-ups.md?v=0c9a5b593081ded6ac4c78168d7178fdf514956f3bca243287927ee4c12449f5' },
  settings: { title: 'Sound, Settings & Saves', url: './wiki/settings.md?v=c2d6e311922519c7a91efa9eda21760270b0fd991bfb98c2e8651e0bf1f864fd' }
});
// Research citations are exact reviewed destinations, not arbitrary Markdown URLs.
export const WIKI_SOURCES = Object.freeze([
  'https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Bubble-Bobble-4-Friends-The-Baron-is-Back--1679668.html',
  'https://apps.apple.com/us/app/bubble-bobble-classic/id1497822213',
  'https://www.taito.co.jp/en/PBEverybubble/gamemodes',
  'https://www.nintendo.com/us/store/products/pang-adventures-switch/',
  'https://www.nintendo.com/us/store/products/bubble-ghost-remake-switch/',
  'https://www.osmos-game.hemispheregames.com/',
  'https://press.na.square-enix.com/FOAMSTARS',
  'https://noitagame.com/'
]);
export const headingID = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function wikiTarget(href, current = 'wiki') {
  const match = /^(?:\.\/)?([a-z0-9-]+\.md)?(?:#([a-z0-9-]+))?$/.exec(href);
  if (!match || !href) return null;
  const page = match[1] ? match[1].slice(0, -3) : current;
  return Object.hasOwn(WIKI_PAGES, page) ? { page, anchor: match[2] || '' } : null;
}
function inline(text, current, section='', linkRender=null) {
  const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`/g;
  let html = '', cursor = 0;
  for (const m of text.matchAll(pattern)) {
    html += escape(text.slice(cursor, m.index));
    if (m[1]) {
      if(linkRender){html+=linkRender(m[1],m[2]);cursor=m.index+m[0].length;continue;}
      const target = wikiTarget(m[2], current);
      html += target ? `<a href="${escape(WIKI_PAGES[target.page].url)}${target.anchor ? '#'+target.anchor : ''}" data-wiki-page="${target.page}" data-wiki-anchor="${target.anchor}">${wikiTopicIcon(target.page,target.anchor)}${escape(m[1])}</a>` : WIKI_SOURCES.includes(m[2]) ? `<a href="${escape(m[2])}" target="_blank" rel="noopener noreferrer">${escape(m[1])} (opens in new tab)</a>` : escape(m[1]);
    } else html += m[3] ? `<strong>${wikiStrongHTML(m[3],current,section,escape(m[3]))}</strong>` : `<code>${escape(m[4])}</code>`;
    cursor = m.index + m[0].length;
  }
  return html + escape(text.slice(cursor));
}
// Bounded Markdown: no raw HTML, supplied images, embeds or executable URLs.
// Decorative icons come exclusively from the shipped topic/catalogue allowlist.
export function renderMarkdown(markdown, current = 'wiki', linkRender=null) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n'), html = [];
  let list = '', paragraph = [], credits = false, section='';
  const flush = () => { if(paragraph.length){html.push(`<p>${inline(paragraph.join(' '),current,section,linkRender)}</p>`);paragraph=[];} if(list){html.push(`</${list}>`);list='';} };
  for (const line of lines) {
    const heading = /^(#{1,4}) (.+)$/.exec(line), item = /^(?:([-*])|\d+\.) (.+)$/.exec(line);
    if (heading) {
      flush();
      if(heading[2]==='Attribution'){html.push('<details class="wiki-credits"><summary>Page Credits</summary>');credits=true;continue;}
      const level=heading[1].length;
      const id=headingID(heading[2]);if(level===2)section=id;
      html.push(`<h${level} id="${id}">${credits?'':wikiTopicIcon(current,id)}${inline(heading[2],current,section,linkRender)}</h${level}>`);
    } else if(item) {
      if(paragraph.length){html.push(`<p>${inline(paragraph.join(' '),current,section,linkRender)}</p>`);paragraph=[];}
      const kind=item[1]?'ul':'ol';if(list!==kind){if(list)html.push(`</${list}>`);list=kind;html.push(`<${kind}>`);}
      html.push(`<li>${inline(item[2],current,section,linkRender)}</li>`);
    } else if(!line.trim()) flush();
    else {if(list){html.push(`</${list}>`);list='';}paragraph.push(line.trim());}
  }
  flush();if(credits)html.push('</details>');return html.join('\n');
}
export const wikiPageAvailable=(page,development=false)=>Object.hasOwn(WIKI_PAGES,page)&&(!WIKI_PAGES[page].development||development===true);
export function renderWikiPage(source,page,development=false){
  if(!wikiPageAvailable(page,development))return '';
  const visible=source.replace(/<!-- development -->([\s\S]*?)<!-- \/development -->/g,(_,body)=>development?body:'');
  const html=renderMarkdown(visible,page,(label,href)=>{
    const target=wikiTarget(href,page);
    if(target&&!wikiPageAvailable(target.page,development))return '';
    // Reuse the exact bounded-link renderer and its reviewed source allowlist.
    return inline(`[${label}](${href})`,page);
  });
  // Contents groups retain the authored headings and links. Native disclosures
  // provide touch/keyboard access without another navigation or search model.
  if(page==='changelog'){
    let version=0;
    return html.split(/(?=<h2 )/).map(part=>part.replace(/^(<h2 [\s\S]*?<\/h2>)([\s\S]*)$/,(_,heading,body)=>{
      const content=body.replace(/(<h3 id="developer-notes"[^>]*>[\s\S]*?<\/h3>)([\s\S]*?)(?=<h3 |$)/g,'<details class="wiki-developer-notes"><summary>$1</summary>$2</details>');
      return `<details class="wiki-topic-group wiki-release-group"${version++===0?' open':''}><summary>${heading}</summary><div class="wiki-release-body">${content}</div></details>`;
    })).join('\n');
  }
  return page==='contents'?html.split(/(?=<h2 )/).map(part=>part.replace(/^(<h2 [\s\S]*?<\/h2>)([\s\S]*)$/, '<details class="wiki-topic-group"><summary>$1</summary>$2</details>')).join('\n'):html;
}
export function revealWikiHeading(heading){
 for(let group=heading.closest?.('details');group;group=group.parentElement?.closest?.('details'))group.open=true;
 heading.scrollIntoView({block:'start'});
}
export function wikiMount(host) {
  const dialog=document.createElement('dialog');dialog.id='wiki-dialog';dialog.setAttribute('aria-labelledby','wiki-title');
  dialog.innerHTML=`${screenHeader({icon:'book',className:'wiki-heading',title:'Wiki',titleId:'wiki-title',back:`<button type="button" data-wiki-back aria-label="Back">${iconHTML('arrow-left')}<span>Back</span></button>`,actions:`<button type="button" data-wiki-contents>${iconHTML('list')}<span>Contents</span></button>`})}<article class="wiki-article" tabindex="0" aria-label="Wiki page"></article>`;
  document.body.append(dialog);
  const article=dialog.querySelector('article'), title=dialog.querySelector('h2'), contents=dialog.querySelector('[data-wiki-contents]');
  let current={page:'wiki',anchor:''}, request=null;const history=pageHistory(current,target=>target.page);
  function position(anchor){if(current.page==='player'&&anchor==='trails-and-bounces')anchor='trails-and-impacts';const heading=anchor&&article.querySelector('#'+anchor);if(heading)revealWikiHeading(heading);else article.scrollTop=0;}
  const available=page=>wikiPageAvailable(page,host.development?.()===true);
  async function load(target, remember=true) {
    if(!available(target.page)){target={page:'wiki',anchor:''};history.reset(target);remember=false;}
    if(remember)history.visit(target);current=target;request?.abort();const active=new AbortController();request=active;
    title.textContent=WIKI_PAGES[target.page].title;contents.hidden=target.page==='contents';article.setAttribute('data-wiki-view',target.page);
    article.setAttribute('aria-busy','true');article.innerHTML='<div class="loading-state"><div class="loading-bar" role="progressbar" aria-label="Loading Wiki page"><span></span></div></div>';article.scrollTop=0;
    try {
      const response=await fetch(WIKI_PAGES[target.page].url,{cache:'no-cache',signal:active.signal});
      if(!response.ok)throw new Error('Page unavailable');const source=await response.text();
      if(request!==active||!dialog.open)return;
      if(!available(target.page)){const home={page:'wiki',anchor:''};history.reset(home);load(home,false);return;}
      article.innerHTML=renderWikiPage(source,target.page,host.development?.()===true);article.removeAttribute('aria-busy');position(target.anchor);article.focus({preventScroll:true});
    } catch(error) {
      if(active.signal.aborted||request!==active||!dialog.open)return;
      article.removeAttribute('aria-busy');article.innerHTML='<p role="alert">This wiki page couldn’t load. Check your connection and try again.</p><button type="button" data-wiki-retry>Try Again</button>';
    }
  }
  function back(){const target=history.back();if(target)load(target,false);else {request?.abort();dialog.close();host.back();}}
  dialog.querySelector('[data-wiki-back]').onclick=back;
  contents.onclick=()=>load({page:'contents',anchor:''});
  dialog.addEventListener('cancel',event=>{event.preventDefault();back();});
  dialog.addEventListener('close',()=>{request?.abort();});
  article.addEventListener('click',event=>{
    const link=event.target.closest('[data-wiki-page]');
    if(link){event.preventDefault();const target={page:link.dataset.wikiPage,anchor:link.dataset.wikiAnchor};if(!available(target.page))load({page:'wiki',anchor:''});else if(target.page===current.page)position(target.anchor);else load(target);}
    else if(event.target.closest('[data-wiki-retry]'))load(current,false);
  });
  return {open(page='wiki',anchor=''){
    const target={page:Object.hasOwn(WIKI_PAGES,page)?page:'wiki',anchor:/^[a-z0-9-]*$/.test(anchor)?anchor:''};
    history.reset(target);host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    dialog.showModal();load(target,false);
  }};
}
