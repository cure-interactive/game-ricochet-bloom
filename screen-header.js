import { escapeHTML as escape } from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
import { iconHTML } from './ui-icon.js?v=0963cd053d0a0800e33d00fd5c13d534adc684f6c740fd8a4ac552d779c53a6b';
// The icon is a sibling of the heading, so textContent updates keep it intact.
export function screenTitle({title='',titleId='',titleHtml=null,icon='about'}){
  return `<div class="screen-heading-title">${iconHTML(icon)}<h2${titleId?` id="${escape(titleId)}"`:''}>${titleHtml??escape(title)}</h2></div>`;
}
// Shared structural component. Callers own trusted button markup and behavior.
export function screenHeader({className='',title='',titleId='',back='',actions='',meta='',metaId='',titleHtml=null,icon='about'}){
  return `<header class="screen-heading ${escape(className)}"><div class="screen-heading-copy">${meta||metaId?`<small${metaId?` id="${escape(metaId)}"`:''}>${escape(meta)}</small>`:''}${screenTitle({title,titleId,titleHtml,icon})}</div>${actions}${back}</header>`;
}
