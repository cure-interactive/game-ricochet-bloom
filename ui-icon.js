import {registerCosmeticIcon} from './cosmetic-icon.js?v=b79e34bebec1bb2cf6eb6a703630e1d06166ecc7eba2be7876271afa2ba42852';
if(typeof window!=='undefined')registerCosmeticIcon();
import {registerPlayerBubble} from './player-bubble.js?v=d1af4703b8d9bb975000fae20c7942f059498329ea23fd71d4f36648de327680';
if(typeof window!=='undefined')registerPlayerBubble();
import { escapeHTML } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
// Decorative icons share one renderer. player-skin uses the equipped skin
// renderer, never an SVG mask or a duck/player glyph.
export function iconHTML(name) {
  return `<span class="ui-icon" data-icon="${escapeHTML(name)}" aria-hidden="true">${name==='player-skin'?'<player-bubble></player-bubble>':['trails','bounce-effects'].includes(name)?`<cosmetic-icon kind="${name==='trails'?'trail':'bounce'}"></cosmetic-icon>`:''}</span>`;
}
export function iconNode(name) {
  const icon=document.createElement('span');
  icon.className='ui-icon';icon.dataset.icon=name;icon.setAttribute('aria-hidden','true');
  if(name==='player-skin')icon.append(document.createElement('player-bubble'));
  if(['trails','bounce-effects'].includes(name)){const effect=document.createElement('cosmetic-icon');effect.setAttribute('kind',name==='trails'?'trail':'bounce');icon.append(effect);}
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
 const text=escapeHTML(label);
 return `<button${attrs}>${iconHTML(icon)}${text?`<span>${text}</span>`:''}</button>`;
}
