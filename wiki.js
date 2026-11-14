import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { screenHeader } from './screen-header.js?v=b12f4a7f643a7ebc5d8945f2671aead3040da9be729bee110404af53f14e24e0';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { iconHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';
import { wikiTopicIcon, wikiStrongHTML } from './wiki-icon.js?v=0e18ae6114b8d5fa65804a78c4cc7e44c97373ed2989c0d47760e43b9f224451';

export const WIKI_PAGES = Object.freeze({
  developer: { title: 'Developer', development: true, url: './wiki/developer.md?v=ceb8c80d6bb5f809b39ba60740d24a5a704a1900198d00593c6d31669be04f07' },
  medals: { title: 'Medals', url: './wiki/medals.md?v=6ad6f404b6d3440ce771beb2501e730bc767709bea66c668fba96cfbd41334a8' },
  'score-attack': { title: 'Score Attack', url: './wiki/score-attack.md?v=688714c1fe057d6c0da78a5f38b32cd4bc3fe0e712812b248e9d7552b6c54daf' },
  experiments: { title: 'Play the Experiments', url: './wiki/experiments.md?v=2925dacfbb1be75a34b46fe3cec9074a5e78b169a558c1a8299ea528a7e635b1' },
  'development-concept': { development: true, title: 'Development Concept', url: './wiki/development-concept.md?v=2135a1f9773ebeb036c23a038d08786f3f8947e16dce43863a67af0ab790dc36' },
  'game-modes': { development: true, title: 'Game Modes to Try', url: './wiki/game-modes.md?v=dcc952e821bf4579a59a3d5a7dada9cc83b5d191ad4b12c3b250fdfb0bb74c88' },
  waves: { title: 'Endless Waves', url: './wiki/waves.md?v=43d206ad19f209d6294446e0ce643914d29f9d57bde7e04c329fa510a6adb431' },
  contents: { title: 'Contents', url: './wiki/contents.md?v=87b782a5f3fd8d58d9e4dd1ee4be0e16bca7a04b0083d4b88e128aac4b8ef7d6' },
  wiki: { title: 'Wiki', url: './wiki/wiki.md?v=aa85ee47db1a46b216eebd4a7d8a84a83e9c264242323c6364658867a9e727a6' },
  'how-to-play': { title: 'How to Play', url: './wiki/how-to-play.md?v=d03e23be2397cfa4949bdf37269710f2876a2bb4d5493d0b22e6f2bdf5d923eb' },
  campaign: { title: 'Melody Journey', url: './wiki/campaign.md?v=7a28e512643ce0faf78d4f9020b8a6e8d56a536f4d64caa116560a40390460e3' },
  'skill-tree': { title: 'Skills', url: './wiki/skill-tree.md?v=3acd6d44547163b633a944abf088b1089a57018e9fbda57d7471b01347616e90' },
  'power-ups': { title: 'Power-Ups', url: './wiki/power-ups.md?v=fdfe61d1691fced0483795dde874fa6adb22ed6ee9939e72afac3342e114d3c3' },
  settings: { title: 'Sound, Settings & Saves', url: './wiki/settings.md?v=64f0c9ebbdb2018d122a23596751082c72a28f6dcbae7e2d492aad305d8218cf' }
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
  return renderMarkdown(visible,page,(label,href)=>{
    const target=wikiTarget(href,page);
    if(target&&!wikiPageAvailable(target.page,development))return '';
    // Reuse the exact bounded-link renderer and its reviewed source allowlist.
    return inline(`[${label}](${href})`,page);
  });
}
export function wikiMount(host) {
  const dialog=document.createElement('dialog');dialog.id='wiki-dialog';dialog.setAttribute('aria-labelledby','wiki-title');
  dialog.innerHTML=`${screenHeader({className:'wiki-heading',title:'Wiki',titleId:'wiki-title',back:`<button type="button" data-wiki-back aria-label="Back">${iconHTML('arrow-left')}<span>Back</span></button>`,actions:`<button type="button" data-wiki-contents>${iconHTML('book')}<span>Contents</span></button>`})}<article class="wiki-article" tabindex="0" aria-label="Wiki page"></article>`;
  document.body.append(dialog);
  const article=dialog.querySelector('article'), title=dialog.querySelector('h2'), contents=dialog.querySelector('[data-wiki-contents]');
  let current={page:'wiki',anchor:''}, request=null;const history=pageHistory(current,target=>target.page);
  function position(anchor){const heading=anchor&&article.querySelector('#'+anchor);if(heading)heading.scrollIntoView({block:'start'});else article.scrollTop=0;}
  const available=page=>wikiPageAvailable(page,host.development?.()===true);
  async function load(target, remember=true) {
    if(!available(target.page)){target={page:'wiki',anchor:''};history.reset(target);remember=false;}
    if(remember)history.visit(target);current=target;request?.abort();const active=new AbortController();request=active;
    title.textContent=WIKI_PAGES[target.page].title;contents.hidden=target.page==='contents';
    article.setAttribute('aria-busy','true');article.innerHTML='<p role="status">Loading page…</p>';article.scrollTop=0;
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
