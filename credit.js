import { assetURL } from './asset.js?v=6bd4d1d7502ba20bf95bc75985c2a8694fbab62f24ccc87e2722225697137195';
import { renderMarkdown } from './wiki.js?v=c93fe1ef830f726abda32797e5426e5b508050a55206f91f03d70a6edac0cb74';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
const escape = text => text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Only shipped attribution/assets may navigate inside the viewer.
export function creditTarget(href, current='icon/ui/INDEX.md') {
  try {
    const root='https://credit.invalid/game/',url=new URL(href,new URL(current,root));
    if(url.origin!=='https://credit.invalid'||!url.pathname.startsWith('/game/icon/'))return null;
    const name=url.pathname.slice('/game/'.length);
    if(!/\.(md|svg)$/.test(name))return null;
    return {name,url:assetURL(name),anchor:/^#[a-z0-9-]*$/i.test(url.hash)?url.hash:''};
  }catch{return null;}
}
export function creditMarkdown(source,current) {
  const link=(label,href)=>{
    const target=creditTarget(href,current);
    if(target)return `<a href="${escape(target.url+target.anchor)}"${target.name.endsWith('.md')?` data-credit="${escape(target.name)}"`:' target="_blank" rel="noopener"'}>${escape(label)}</a>`;
    if(/^https?:\/\/[^\s<>"']+$/i.test(href))return `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;
    return escape(label);
  };
  // The collection's details and code fences are rendered structurally;
  // arbitrary HTML stays escaped and machine-readable comment records stay hidden.
  const lines=source.replace(/<!--[\s\S]*?-->/g,'').replace(/\r\n?/g,'\n').split('\n');
  let html='',chunk=[],code=null,fence='',details=false;
  const flush=()=>{html+=renderMarkdown(chunk.join('\n'),'credits',link);chunk=[];};
  for(const line of lines){
    const mark=/^\s*(`{3,}|~{3,})/.exec(line);
    if(code){if(mark&&mark[1][0]===fence){html+=`<pre><code>${escape(code.join('\n'))}</code></pre>`;code=null;}else code.push(line);continue;}
    if(mark){flush();code=[];fence=mark[1][0];continue;}
    if(line.trim()==='<details>'){flush();if(!details){html+='<details>';details=true;}continue;}
    const summary=/^\s*<summary>(.*?)<\/summary>\s*$/.exec(line);
    if(summary&&details){flush();html+=`<summary>${escape(summary[1].replace(/&amp;/g,'&'))}</summary>`;continue;}
    if(line.trim()==='</details>'){flush();if(details){html+='</details>';details=false;}continue;}
    chunk.push(line);
  }
  flush();if(code)html+=`<pre><code>${escape(code.join('\n'))}</code></pre>`;if(details)html+='</details>';
  return html;
}
export function creditsMount(dialog) {
  const original=dialog.querySelector('.dialog-body'),page=document.createElement('div');
  page.className='dialog-body credit-page';page.hidden=true;
  page.innerHTML=`<button type="button" class="quiet" data-credit-back>${iconHTML('arrow-left')}<span>Back to Credits</span></button><article class="wiki-article" aria-label="Icon credits" tabindex="0"></article>`;
  dialog.append(page);
  const article=page.querySelector('article'),history=pageHistory('index');let request=null,current=null;
  async function load(name,remember=true){
    const target=creditTarget(name,'index.html');if(!target)return;
    if(remember)history.visit(name);current=name;request?.abort();const active=new AbortController();request=active;
    original.hidden=true;page.hidden=false;article.innerHTML='<p role="status">Loading Credits…</p>';page.scrollTop=0;
    try{const response=await fetch(target.url,{signal:active.signal});if(!response.ok)throw new Error('Unavailable');const source=await response.text();
      if(request!==active||!dialog.open)return;article.innerHTML=creditMarkdown(source,name);article.focus({preventScroll:true});
    }catch{if(!active.signal.aborted&&dialog.open)article.innerHTML='<p role="alert">Credits could not load.</p><button type="button" class="quiet" data-credit-retry>Try Again</button>';}
  }
  function reset(){request?.abort();history.reset('index');current=null;page.hidden=true;original.hidden=false;}
  function back(){const name=history.back();if(name&&name!=='index')load(name,false);else reset();}
  page.querySelector('[data-credit-back]').onclick=back;
  dialog.addEventListener('click',event=>{
    if(event.target.closest('[data-credit-retry]')){load(current,false);return;}
    const a=event.target.closest('a');if(!a)return;
    const target=creditTarget(a.dataset.credit||a.getAttribute('href'),'index.html');
    if(target?.name.endsWith('.md')){event.preventDefault();load(target.name);}
  });
  dialog.addEventListener('cancel',event=>{if(current){event.preventDefault();back();}});
  dialog.addEventListener('close',reset);
}
