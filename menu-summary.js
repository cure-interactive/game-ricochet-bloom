import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
// Continue and the pause status card share the same image/text hierarchy.
export function menuSummaryRender(element,{artwork,title,detail='',progress=''}){
 const signature=JSON.stringify([artwork,title,detail,progress]);
 if(element.dataset.summary===signature)return;
 element.dataset.summary=signature;element.classList.add('menu-summary');
 element.innerHTML=`<img class="summary-art" src="${escapeHTML(artwork)}" width="48" height="48" alt=""><span class="summary-copy"><span class="summary-title">${escapeHTML(title)}</span>${detail?`<small class="summary-detail">${escapeHTML(detail)}</small>`:''}${progress?`<small class="summary-progress">${escapeHTML(progress)}</small>`:''}</span>`;
}
