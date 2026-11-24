import {registerCosmeticIcon} from './cosmetic-icon.js?v=44cfc3807429be6c1765aec7242005fbc3d75f1512773e963672eb284d954b11';
if(typeof window!=='undefined')registerCosmeticIcon();
import {registerPlayerBubble} from './player-bubble.js?v=7201e148b81252f80901dc4b014fa280146ecb6ade0773d9bbe590c2e3a4b66f';
if(typeof window!=='undefined')registerPlayerBubble();
import { escapeHTML,titleCase } from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
// Decorative icons share one renderer. player-skin uses the equipped skin
// renderer, never an SVG mask or a duck/player glyph.
export function iconHTML(name) {
  return `<span class="ui-icon" data-icon="${escapeHTML(name)}" aria-hidden="true">${name==='player-skin'?'<player-bubble></player-bubble>':['trails','bounce-effects','pendants','companions'].includes(name)?`<cosmetic-icon kind="${({trails:'trail','bounce-effects':'bounce',pendants:'pendant',companions:'companion'}[name])}"></cosmetic-icon>`:''}</span>`;
}
export function staticIconHTML(name){return iconHTML({'player-skin':'player-static',trails:'trails-static','bounce-effects':'impact-static',pendants:'star',companions:'player-static'}[name]||name);}
export function iconNode(name) {
  const icon=document.createElement('span');
  icon.className='ui-icon';icon.dataset.icon=name;icon.setAttribute('aria-hidden','true');
  if(name==='player-skin')icon.append(document.createElement('player-bubble'));
  if(['trails','bounce-effects','pendants','companions'].includes(name)){const effect=document.createElement('cosmetic-icon');effect.setAttribute('kind',({trails:'trail','bounce-effects':'bounce',pendants:'pendant',companions:'companion'}[name]));icon.append(effect);}
  return icon;
}
export function buttonLabel(button,text,name,{preserveCase=false}={}) {
  const signature=`${name}:${preserveCase}:${text}`;
  if(button.dataset.iconLabel===signature)return;
  button.dataset.iconLabel=signature;
  if(!preserveCase)text=titleCase(text);
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
  return ` ${key}="${escapeHTML(key==='aria-label'||key==='title'?titleCase(value):value)}"`;
 }).join('');
 const text=escapeHTML(titleCase(label));
 return `<button${attrs}>${iconHTML(icon)}${text?`<span>${text}</span>`:''}</button>`;
}
