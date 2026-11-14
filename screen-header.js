import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
// Shared structural component. Callers own trusted button markup and behavior.
export function screenHeader({className,title='',titleId='',back='',actions='',meta='',metaId='',titleHtml=null}){
  return `<header class="screen-heading ${escape(className)}"><div class="screen-heading-copy">${meta||metaId?`<small${metaId?` id="${escape(metaId)}"`:''}>${escape(meta)}</small>`:''}<h2${titleId?` id="${escape(titleId)}"`:''}>${titleHtml??escape(title)}</h2></div>${actions}${back}</header>`;
}
