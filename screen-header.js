import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { iconHTML } from './ui-icon.js?v=23254d5124a1e10208687f81fc9971554edfeeb2b34e4c17b4d273dc2d5cad13';
// The icon is a sibling of the heading, so textContent updates keep it intact.
export function screenTitle({title='',titleId='',titleHtml=null,icon='about'}){
  return `<div class="screen-heading-title">${iconHTML(icon)}<h2${titleId?` id="${escape(titleId)}"`:''}>${titleHtml??escape(title)}</h2></div>`;
}
// Shared structural component. Callers own trusted button markup and behavior.
export function screenHeader({className='',title='',titleId='',back='',actions='',meta='',metaId='',titleHtml=null,icon='about'}){
  return `<header class="screen-heading ${escape(className)}"><div class="screen-heading-copy">${meta||metaId?`<small${metaId?` id="${escape(metaId)}"`:''}>${escape(meta)}</small>`:''}${screenTitle({title,titleId,titleHtml,icon})}</div>${actions}${back}</header>`;
}
