import { escapeHTML as escape } from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
import { iconHTML } from './ui-icon.js?v=e2d2d79e184dc6662e2e3ee3fcb93c316de9df95c09e3c41219e302d68d91238';
// The icon is a sibling of the heading, so textContent updates keep it intact.
export function screenTitle({title='',titleId='',titleHtml=null,icon='about'}){
  return `<div class="screen-heading-title">${iconHTML(icon)}<h2${titleId?` id="${escape(titleId)}"`:''}>${titleHtml??escape(title)}</h2></div>`;
}
// Shared structural component. Callers own trusted button markup and behavior.
export function screenHeader({className='',title='',titleId='',back='',actions='',meta='',metaId='',titleHtml=null,icon='about'}){
  return `<header class="screen-heading ${escape(className)}"><div class="screen-heading-copy">${meta||metaId?`<small${metaId?` id="${escape(metaId)}"`:''}>${escape(meta)}</small>`:''}${screenTitle({title,titleId,titleHtml,icon})}</div>${actions}${back}</header>`;
}
