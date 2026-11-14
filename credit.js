import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { assetURL } from './asset.js?v=c168b1bf74896095e10ba96f5c9cfb00449414ce901de7993bd725e00a9bbfea';
import { renderMarkdown } from './wiki.js?v=f07659347dc16a96c9cc7fdb2e581393017af44ee5cb9748f58ed89cab51e1cc';
import { buttonLabel } from './ui-icon.js?v=a45b8b7529e9829c50cbaee84ed71f02e69362d8a4b87c41723a1409fa839d8b';
import { pageHistory } from './page-history.js?v=6ad2ef8fd27ea449bb23b6db6c55a5a18db153cbedf1b339111b2218522f1ad7';
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
  page.innerHTML=`<article class="wiki-article" aria-label="Icon credits" tabindex="0"></article>`;
  dialog.append(page);
  const article=page.querySelector('article'),dismiss=dialog.querySelector('[data-close]'),history=pageHistory('index');let request=null,current=null;
  async function load(name,remember=true){
    const target=creditTarget(name,'index.html');if(!target)return;
    if(remember)history.visit(name);current=name;buttonLabel(dismiss,'Back','arrow-left');dismiss.setAttribute('aria-label','Back to Credits');dismiss.onclick=back;request?.abort();const active=new AbortController();request=active;
    original.hidden=true;page.hidden=false;article.innerHTML='<p role="status">Loading Credits…</p>';page.scrollTop=0;
    try{const response=await fetch(target.url,{signal:active.signal});if(!response.ok)throw new Error('Unavailable');const source=await response.text();
      if(request!==active||!dialog.open)return;article.innerHTML=creditMarkdown(source,name);article.focus({preventScroll:true});
    }catch{if(!active.signal.aborted&&dialog.open)article.innerHTML='<p role="alert">Credits could not load.</p><button type="button" class="quiet" data-credit-retry>Try Again</button>';}
  }
  function reset(){request?.abort();history.reset('index');current=null;page.hidden=true;original.hidden=false;buttonLabel(dismiss,'Close','close');dismiss.setAttribute('aria-label','Close icon credits');dismiss.onclick=()=>dialog.close();}
  function back(){const name=history.back();if(name&&name!=='index')load(name,false);else reset();}
  dialog.addEventListener('click',event=>{
    if(event.target.closest('[data-credit-retry]')){load(current,false);return;}
    const a=event.target.closest('a');if(!a)return;
    const target=creditTarget(a.dataset.credit||a.getAttribute('href'),'index.html');
    if(target?.name.endsWith('.md')){event.preventDefault();load(target.name);}
  });
  dialog.addEventListener('cancel',event=>{if(current){event.preventDefault();back();}});
  dialog.addEventListener('close',reset);
}
