import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

export const WIKI_PAGES = Object.freeze({
  wiki: { title: 'Wiki', url: './wiki/wiki.md?v=c0e5656371f7d87d73e88f8c85f0c066ba894d7bff4e45eba84f32967f9b67ea' },
  'how-to-play': { title: 'How to Play', url: './wiki/how-to-play.md?v=1f7e952790505b01a3ad6df6c1e6964ba663e7bc139a2c607849df207f3df982' },
  campaign: { title: 'Campaign', url: './wiki/campaign.md?v=9100f5e95ca5c140dadc3058c9e9a06b898e5a2eae673293b9c0d41c573038e4' },
  'skill-tree': { title: 'Skill Tree', url: './wiki/skill-tree.md?v=dd28e0accb66336e18a74861ed329df9016c10051579b063c8b6a7dcd4093de5' },
  'power-ups': { title: 'Power-Ups', url: './wiki/power-ups.md?v=5394df77188d0533ce46eee9efd4168a82f1004672b6dce9ea97434c42c84abb' },
  settings: { title: 'Sound, Settings & Saves', url: './wiki/settings.md?v=a235d7b2b960e0abb3025420688a616c4e7e4db911b647f0bf597950714e3f71' }
});
const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const headingID = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function wikiTarget(href, current = 'wiki') {
  const match = /^(?:\.\/)?([a-z0-9-]+\.md)?(?:#([a-z0-9-]+))?$/.exec(href);
  if (!match || !href) return null;
  const page = match[1] ? match[1].slice(0, -3) : current;
  return Object.hasOwn(WIKI_PAGES, page) ? { page, anchor: match[2] || '' } : null;
}
function inline(text, current) {
  const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`/g;
  let html = '', cursor = 0;
  for (const m of text.matchAll(pattern)) {
    html += escape(text.slice(cursor, m.index));
    if (m[1]) {
      const target = wikiTarget(m[2], current);
      html += target ? `<a href="${escape(WIKI_PAGES[target.page].url)}${target.anchor ? '#'+target.anchor : ''}" data-wiki-page="${target.page}" data-wiki-anchor="${target.anchor}">${escape(m[1])}</a>` : escape(m[1]);
    } else html += m[3] ? `<strong>${escape(m[3])}</strong>` : `<code>${escape(m[4])}</code>`;
    cursor = m.index + m[0].length;
  }
  return html + escape(text.slice(cursor));
}
// Deliberately bounded Markdown: no raw HTML, images, embeds or executable URLs.
export function renderMarkdown(markdown, current = 'wiki') {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n'), html = [];
  let list = '', paragraph = [], credits = false;
  const flush = () => { if(paragraph.length){html.push(`<p>${inline(paragraph.join(' '),current)}</p>`);paragraph=[];} if(list){html.push(`</${list}>`);list='';} };
  for (const line of lines) {
    const heading = /^(#{1,4}) (.+)$/.exec(line), item = /^(?:([-*])|\d+\.) (.+)$/.exec(line);
    if (heading) {
      flush();
      if(heading[2]==='Attribution'){html.push('<details class="wiki-credits"><summary>Page Credits</summary>');credits=true;continue;}
      const level=heading[1].length;
      html.push(`<h${level} id="${headingID(heading[2])}">${inline(heading[2],current)}</h${level}>`);
    } else if(item) {
      if(paragraph.length){html.push(`<p>${inline(paragraph.join(' '),current)}</p>`);paragraph=[];}
      const kind=item[1]?'ul':'ol';if(list!==kind){if(list)html.push(`</${list}>`);list=kind;html.push(`<${kind}>`);}
      html.push(`<li>${inline(item[2],current)}</li>`);
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
    title.textContent=WIKI_PAGES[target.page].title;contents.hidden=target.page==='wiki';
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
  contents.onclick=()=>load({page:'wiki',anchor:''});
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
