import {escapeHTML} from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
// Continue and the pause status card share the same image/text hierarchy.
export function menuSummaryRender(element,{artwork,title,detail='',progress=''}){
 const signature=JSON.stringify([artwork,title,detail,progress]);
 if(element.dataset.summary===signature)return;
 element.dataset.summary=signature;element.classList.add('menu-summary');
 element.innerHTML=`<img class="summary-art" src="${escapeHTML(artwork)}" width="48" height="48" alt=""><span class="summary-copy"><span class="summary-title">${escapeHTML(title)}</span>${detail?`<small class="summary-detail">${escapeHTML(detail)}</small>`:''}${progress?`<small class="summary-progress">${escapeHTML(progress)}</small>`:''}</span>`;
}
