import {rememberView} from './navigation-state.js?v=8f540f6be269a8759011349f3d0983c46c7ea4c71a6728e0324dba8b0e6e72e8';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { screenHeader } from './screen-header.js?v=7db753fa19626839b08a41fd5d2583821cbc0774ad262a06dd328bb3f050c988';
import { pageHistory } from './page-history.js?v=54c1c0aaacb43da66e5503f9ea5ea7948dfd1efd2ededbc6b416434a1792e935';
import { iconHTML } from './ui-icon.js?v=35ef67d69b283afcc7c65c45f76a6dee06daf0fc829eafd4dff245d7c24940c0';
import { wikiTopicIcon, wikiStrongHTML } from './wiki-icon.js?v=fffd523cb4433e8330de32e3dc5b9abbf318004a0761ecc6a8383ede0aa3477d';

export const WIKI_PAGES = Object.freeze({
  'cosmetic-rarity':{title:'Cosmetic Rarity',url:'./wiki/cosmetic-rarity.md?v=347ed0bb71c4b93e0c2c9e947ead96c5714dd752fb4a35658766abb5bbd30543'},
  changelog: { title: 'Change Logs', url: './wiki/changelog.md?v=27573f53dc18f1d786adabfbe0030fe5debf8556eae01a9b9a91115101466cec' },
  player: { title: 'Player', url: './wiki/player.md?v=0c38f46b581192d96145cd1c1a85569ccc571ae4dc94401b6546a67af077b787' },
  developer: { title: 'Developer', development: true, url: './wiki/developer.md?v=4b1c4a2f20196920d195b87e44157fbb1271f19c401ac36133b4fbc63b773633' },
  medals: { title: 'Medals', url: './wiki/medals.md?v=f43259f3d42301b05c30588b2e1335e8ec1ca9d0f2f1a3a7a2287bbd4e709eca' },
  'score-attack': { title: 'Score Attack', url: './wiki/score-attack.md?v=d6278e8639a6e191b88cb7e39346754f332346f490fa3678f44913799e749137' },
  experiments: { title: 'Play the Experiments', url: './wiki/experiments.md?v=dce80e9365221d4fdfc91886aae8ea149d80c477e02b246bc914d4e64170368d' },
  'development-concept': { development: true, title: 'Development Concept', url: './wiki/development-concept.md?v=2135a1f9773ebeb036c23a038d08786f3f8947e16dce43863a67af0ab790dc36' },
  'game-modes': { development: true, title: 'Game Modes to Try', url: './wiki/game-modes.md?v=76d41fb0cd2c9a17bde4187f69e4b31570e5d49a5c33b4e2a32053553185f457' },
  waves: { title: 'Endless Waves', url: './wiki/waves.md?v=941b0fdf11b0e94d22e69c8e45dc214c953cc790f3ba805d876bf03443103c12' },
  contents: { title: 'Contents', url: './wiki/contents.md?v=f12bfcc7e0bc40b5a68b1c06a92724296345f5b65cb8886b2cbb147ad99243c7' },
  wiki: { title: 'Wiki', url: './wiki/wiki.md?v=c7d2965c7a1c36d0a7891df9b8ca49e03594d78e63c17a06e1c41cfecead07a9' },
  'how-to-play': { title: 'How to Play', url: './wiki/how-to-play.md?v=7f0d55d08094b85dbfa312fd3cf36379a0666676b0fd6a8c04feca8f0ce86c19' },
  campaign: { title: 'Melody Journey', url: './wiki/campaign.md?v=3226c8202c5ec9c396c1c4abe0e5e00d931094617edf98ea6ff8945e8feff623' },
  'skill-tree': { title: 'Skills', url: './wiki/skill-tree.md?v=878a330d1e22b6c26b9deea8ff2e2958bf4a624ee9fc62f97817125c958f832a' },
  'power-ups': { title: 'Power-Ups', url: './wiki/power-ups.md?v=85f25a8d2896fbb481d837d5b7bb3995f7aa330e30fcb681bd61f3c366732e51' },
  settings: { title: 'Sound, Settings & Saves', url: './wiki/settings.md?v=b54e258a496f7a7d54b301dea44913974840dc797446d7562304ed4ecbbe99d4' }
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
  rememberView(dialog,'page',()=>({current,path:history.snapshot}),async state=>{if(state?.current&&available(state.current.page)){history.restore(Array.isArray(state.path)?state.path.filter(target=>available(target?.page)):[state.current]);await load(state.current,false);}},20);
  return {open(page='wiki',anchor=''){
    const target={page:Object.hasOwn(WIKI_PAGES,page)?page:'wiki',anchor:/^[a-z0-9-]*$/.test(anchor)?anchor:''};
    history.reset(target);host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    dialog.showModal();load(target,false);
  }};
}
