import {iconHTML} from './ui-icon.js?v=3ec57aca06a56be722ba4758c1a5f9f22822f17f0488b0eba544ab0976429198';
import {screenHeader} from './screen-header.js?v=c0ab32179094cd2acf42cb3223ff85a0c4c8741768d7e30b357f764d2c334f84';

const number=value=>value.toLocaleString('en-US');
export function hudHelpView(kind,{score=0,points=0,shots=0,mode='free',contacts=0}={}){
  const views={
    score:{title:'Score',icon:'stats',value:number(score),text:'Build score by contacting bubbles, banking off walls and making 5-Chains. Score is used for medal targets and personal bests; it is separate from spendable Points.'},
    points:{title:'Points',icon:'coin',value:number(points),text:'Spend these Points on permanent power and player upgrades in Skills. Productive shots and completed bonus challenges earn Points when the shot settles. Your balance carries between gamemodes in this profile.'},
    shots:{title:'Shots',icon:'play',value:mode==='free'?'Unlimited':number(shots)+' left',text:mode==='free'?'Free Play has no shot limit. Drag back from your player and release to launch. Wait for the current shot to settle before launching again.':'Each launch uses one shot. Complete the current goal before the budget runs out. The remaining shots are shown here; medal conditions may ask you to finish in fewer shots.'},
    chain:{title:'5-Chain',icon:'ripple',value:number(contacts)+' different bubbles',text:'Touch five different bubbles during one shot to make a 5-Chain. Each dot is one unique contact; hitting the same bubble again does not add another dot. A 5-Chain earns an extra power opportunity for the next shot, up to three.',dots:Math.min(5,contacts)}
  };
  return views[kind];
}

// All compact HUD disclosures share native focus/Escape behavior and dismiss
// only for a completed click outside the card, never for a drag through it.
export function hudCardsMount(read){
  const card=document.createElement('dialog');card.id='hud-help-dialog';card.className='standard-dialog hud-info-card';card.setAttribute('aria-labelledby','hud-help-title');document.body.append(card);
  for(const trigger of document.querySelectorAll('[data-hud-help]'))trigger.onclick=()=>{
    const view=hudHelpView(trigger.dataset.hudHelp,read());
    card.innerHTML=screenHeader({className:'dialog-heading',title:view.title,titleId:'hud-help-title',icon:view.icon,back:`<button type="button" class="close" aria-label="Close Information">${iconHTML('close')}</button>`})+`<div class="dialog-body"><strong class="hud-help-value">${view.value}</strong>${view.dots===undefined?'':`<div class="hud-help-chain" aria-label="${view.dots} of 5 contacts">${Array.from({length:5},(_,i)=>`<i class="${i<view.dots?'active':''}"></i>`).join('')}</div>`}<p>${view.text}</p></div>`;
    card.querySelector('button').onclick=()=>card.close();card.showModal();
  };
  for(const dialog of document.querySelectorAll('.hud-info-card')){
    let outside=false;
    const isOutside=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;};
    dialog.addEventListener('pointerdown',e=>{outside=e.target===dialog&&isOutside(e);});
    dialog.addEventListener('click',e=>{if(outside&&e.target===dialog&&isOutside(e))dialog.close();outside=false;});
  }
}
