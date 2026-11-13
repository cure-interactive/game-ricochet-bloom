// Shared structural component. Callers own trusted button markup and behavior.
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function screenHeader({className,title='',titleId='',back='',actions='',meta='',metaId='',titleHtml=null}){
  return `<header class="screen-heading ${escape(className)}">${back}<div class="screen-heading-copy">${meta||metaId?`<small${metaId?` id="${escape(metaId)}"`:''}>${escape(meta)}</small>`:''}<h2${titleId?` id="${escape(titleId)}"`:''}>${titleHtml??escape(title)}</h2></div>${actions}</header>`;
}
