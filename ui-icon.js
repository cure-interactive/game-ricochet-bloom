import { escapeHTML } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
// Decorative SVG masks share one renderer so changing labels preserves their icons.
export function iconHTML(name) {
  return `<span class="ui-icon" data-icon="${escapeHTML(name)}" aria-hidden="true"></span>`;
}
export function iconNode(name) {
  const icon=document.createElement('span');
  icon.className='ui-icon';icon.dataset.icon=name;icon.setAttribute('aria-hidden','true');
  return icon;
}
export function buttonLabel(button,text,name) {
  const signature=`${name}:${text}`;
  if(button.dataset.iconLabel===signature)return;
  button.dataset.iconLabel=signature;
  const label=document.createElement('span');label.className='button-label';label.textContent=text;
  button.replaceChildren(iconNode(name),...(text?[label]:[]));
}

// Structured attributes keep action-specific routing in each screen.
export function buttonHTML(label,icon='play',attributes={}) {
 const allowed=/^(id|class|title|name|value|type|disabled|hidden|aria-[a-z0-9-]+|data-[a-z0-9-]+)$/;
 const attrs=Object.entries({type:'button',...attributes}).map(([key,value])=>{
  if(!allowed.test(key))throw new Error('Unsupported button attribute: '+key);
  if(value===null||value===undefined)return '';
  if(key==='disabled'||key==='hidden')return value?' '+key:'';
  return ` ${key}="${escapeHTML(value)}"`;
 }).join('');
 return `<button${attrs}>${iconHTML(icon)}<span>${escapeHTML(label)}</span></button>`;
}
