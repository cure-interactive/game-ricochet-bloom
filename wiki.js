import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { screenHeader } from './screen-header.js?v=abdd601bfd00682c8e2df56bb78bf52f54d173e7c455d7ae92bba16d48c17860';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
import { iconHTML } from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';
import { wikiTopicIcon, wikiStrongHTML } from './wiki-icon.js?v=dd4e4e6c9eb4689ef5b0e3bfa50552448b3a58c2529bf9c88e39056524dca652';

export const WIKI_PAGES = Object.freeze({
  'cosmetic-rarity':{title:'Cosmetic Rarity',url:'./wiki/cosmetic-rarity.md?v=347ed0bb71c4b93e0c2c9e947ead96c5714dd752fb4a35658766abb5bbd30543'},
  changelog: { title: 'Change Logs', url: './wiki/changelog.md?v=f8d8920057adddae5102275859cb4d7335fc3fb175b1b97682c50d0ee840e8ce' },
  player: { title: 'Player', url: './wiki/player.md?v=9639fc666ff0bc014ba412012998b44f545c0be8e8863b01743ff9db34e64ee4' },
  developer: { title: 'Developer', development: true, url: './wiki/developer.md?v=1fe84040818660452a57fe2d535171badfba1733dfda772ea176e823fd7a4101' },
  medals: { title: 'Medals', url: './wiki/medals.md?v=f43259f3d42301b05c30588b2e1335e8ec1ca9d0f2f1a3a7a2287bbd4e709eca' },
  'score-attack': { title: 'Score Attack', url: './wiki/score-attack.md?v=d6278e8639a6e191b88cb7e39346754f332346f490fa3678f44913799e749137' },
  experiments: { title: 'Play the Experiments', url: './wiki/experiments.md?v=dce80e9365221d4fdfc91886aae8ea149d80c477e02b246bc914d4e64170368d' },
  'development-concept': { development: true, title: 'Development Concept', url: './wiki/development-concept.md?v=2135a1f9773ebeb036c23a038d08786f3f8947e16dce43863a67af0ab790dc36' },
  'game-modes': { development: true, title: 'Game Modes to Try', url: './wiki/game-modes.md?v=76d41fb0cd2c9a17bde4187f69e4b31570e5d49a5c33b4e2a32053553185f457' },
  waves: { title: 'Endless Waves', url: './wiki/waves.md?v=941b0fdf11b0e94d22e69c8e45dc214c953cc790f3ba805d876bf03443103c12' },
  contents: { title: 'Contents', url: './wiki/contents.md?v=b1847c166ee4c19ed33a8f73a768a3450afedee90ee3c2a1e0996161b58687b2' },
  wiki: { title: 'Wiki', url: './wiki/wiki.md?v=c7d2965c7a1c36d0a7891df9b8ca49e03594d78e63c17a06e1c41cfecead07a9' },
  'how-to-play': { title: 'How to Play', url: './wiki/how-to-play.md?v=be86390d575d6d8e329a81d9040943addbf25802020a51615a87d1a3b18c6d9d' },
  campaign: { title: 'Melody Journey', url: './wiki/campaign.md?v=3226c8202c5ec9c396c1c4abe0e5e00d931094617edf98ea6ff8945e8feff623' },
  'skill-tree': { title: 'Skills', url: './wiki/skill-tree.md?v=878a330d1e22b6c26b9deea8ff2e2958bf4a624ee9fc62f97817125c958f832a' },
  'power-ups': { title: 'Power-Ups', url: './wiki/power-ups.md?v=85f25a8d2896fbb481d837d5b7bb3995f7aa330e30fcb681bd61f3c366732e51' },
  settings: { title: 'Sound, Settings & Saves', url: './wiki/settings.md?v=c6316e35fab7710828c46b42d69424b7c35cf9f27fe0481ce38e08b49bb74fe7' }
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
