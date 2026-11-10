// Decorative SVG masks share one renderer so changing labels preserves their icons.
export function iconHTML(name) {
  return `<span class="ui-icon" data-icon="${name}" aria-hidden="true"></span>`;
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
