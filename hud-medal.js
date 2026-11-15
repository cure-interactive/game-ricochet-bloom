import { medalIcon } from './medal-ui.js?v=b66de041ee2d9f60adfb88f52c358438190802a3f8dc744542f54dc430e58530';
import { medalRank } from './medal.js?v=97f2ce6ed69f5c8834ecd381128c29d366fdfc9390080f59a05049d77db5f006';

// A score target advances as the score grows. Shot limits show the strongest
// medal still reachable; only a recorded Gold is presented as already earned.
export function hudMedal(conditions,{score=0,shots=0,earned=null}={}){
  if(!conditions?.length)return null;
  const gold=conditions.at(-1);
  if(earned===gold.name)return {name:gold.name,text:gold.name,label:`${gold.name} medal earned. View medal conditions.`};
  const next=conditions[0].metric==='score'
    ? conditions.find(c=>c.target>score&&medalRank(c.name)>medalRank(earned))??gold
    : [...conditions].reverse().find(c=>c.metric==='complete'||c.direction==='at-most'&&shots<=c.target)??conditions[0];
  const text=next.metric==='score'?next.target.toLocaleString('en-US'):next.metric==='shots'?`≤${next.target} shots`:'Goal';
  return {name:next.name,text,label:`${next.name} target: ${next.text}. View medal conditions.`};
}
export function hudMedalRender(button,view){
  button.hidden=!view;if(!view)return;
  const html=`<span class="label">MEDAL</span><span class="hud-medal-value">${medalIcon(view.name)}<span>${view.text}</span></span>`;
  if(button.innerHTML!==html)button.innerHTML=html;
  button.setAttribute('aria-label',view.label);button.title=view.label;
}
