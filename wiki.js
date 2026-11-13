import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import { wikiTopicIcon, wikiStrongHTML } from './wiki-icon.js?v=7c6b2ee16663450952814ac4e888191c65aba61cd1df1d7307f1e900a7987ca1';

export const WIKI_PAGES = Object.freeze({
  'development-concept': { title: 'Development Concept', url: './wiki/development-concept.md?v=f87d5cc129ac6e51237f66d53099c7a3915a21e609661700223aa330fdbf434b' },
  'game-modes': { title: 'Game Modes to Try', url: './wiki/game-modes.md?v=82d6440e3310eae77f6b25f6ad6e92983576c8898be427d4ec3fbcf57ab81178' },
  waves: { title: 'Endless Waves', url: './wiki/waves.md?v=e8be7695205f3a976d6e7024cdb3260dbf3153e125ea93e81cd69fc3d0eb2cc4' },
  contents: { title: 'Contents', url: './wiki/contents.md?v=3c9f0d4f41b91859642ca036d629727abe8fba3e786d4f18864ddd5b2c812985' },
  wiki: { title: 'Wiki', url: './wiki/wiki.md?v=223e75f6739d1797358e58e6c18361419ea47aa8c1fdbc7370234b6a003ce918' },
  'how-to-play': { title: 'How to Play', url: './wiki/how-to-play.md?v=7f8e99a2c6392ce4f27e8d620141cfbbd0df17e97b7b21c473c135b7b8393c31' },
  campaign: { title: 'Campaign', url: './wiki/campaign.md?v=dd28c4eefd1fca190b7bc676e30e255a246e147bbfca72bf925a5ec2d5dd65f1' },
  'skill-tree': { title: 'Skill Tree', url: './wiki/skill-tree.md?v=f3ce0903035dd43a181bdf015cdf4f6589249839cbd4e2c18881c684b9edc8ec' },
  'power-ups': { title: 'Power-Ups', url: './wiki/power-ups.md?v=7c896e9621172bb9a2c987053d1370ca5f689f686143013059b5d63b43f38230' },
  settings: { title: 'Sound, Settings & Saves', url: './wiki/settings.md?v=fafab985c72bc2ea0e445b393328660962ca193e5098c106fe7523e94893e531' }
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
const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
export function wikiMount(host) {
  const dialog=document.createElement('dialog');dialog.id='wiki-dialog';dialog.setAttribute('aria-labelledby','wiki-title');
  dialog.innerHTML=`<header class="wiki-heading"><button type="button" data-wiki-back aria-label="Back">${iconHTML('arrow-left')}<span>Back</span></button><h2 id="wiki-title">Wiki</h2><button type="button" data-wiki-contents>${iconHTML('book')}<span>Contents</span></button></header><article class="wiki-article" tabindex="0" aria-label="Wiki page"></article>`;
  document.body.append(dialog);
  const article=dialog.querySelector('article'), title=dialog.querySelector('h2'), contents=dialog.querySelector('[data-wiki-contents]');
  let current={page:'wiki',anchor:''}, request=null;const history=pageHistory(current,target=>target.page);
  function position(anchor){const heading=anchor&&article.querySelector('#'+anchor);if(heading)heading.scrollIntoView({block:'start'});else article.scrollTop=0;}
  async function load(target, remember=true) {
    if(remember)history.visit(target);current=target;request?.abort();const active=new AbortController();request=active;
    title.textContent=WIKI_PAGES[target.page].title;contents.hidden=target.page==='contents';
    article.setAttribute('aria-busy','true');article.innerHTML='<p role="status">Loading page…</p>';article.scrollTop=0;
    try {
      const response=await fetch(WIKI_PAGES[target.page].url,{cache:'no-cache',signal:active.signal});
      if(!response.ok)throw new Error('Page unavailable');const source=await response.text();
      if(request!==active||!dialog.open)return;
      article.innerHTML=renderMarkdown(source,target.page);article.removeAttribute('aria-busy');position(target.anchor);article.focus({preventScroll:true});
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
    if(link){event.preventDefault();const target={page:link.dataset.wikiPage,anchor:link.dataset.wikiAnchor};if(target.page===current.page)position(target.anchor);else load(target);}
    else if(event.target.closest('[data-wiki-retry]'))load(current,false);
  });
  return {open(page='wiki'){
    history.reset({page:Object.hasOwn(WIKI_PAGES,page)?page:'wiki',anchor:''});host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    dialog.showModal();load({page:Object.hasOwn(WIKI_PAGES,page)?page:'wiki',anchor:''},false);
  }};
}
