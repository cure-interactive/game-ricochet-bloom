import { TRACKS } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { completedTracks } from './run.js?v=501d720ce1abcc910dfc629974bc0b65ee7bd248c9664a44445ff205fee06a2b';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const skins=[{id:'original',name:'Original',color:'#f1f9d7'},...TRACKS];
export function skinMount(controller){
  const dialog=document.createElement('dialog');dialog.id='skin-dialog';dialog.setAttribute('aria-labelledby','skin-title');
  dialog.innerHTML=`<header class="skin-heading"><button type="button" data-skin-back>${iconHTML('arrow-left')}<span>Back</span></button><h2 id="skin-title">Player skins</h2></header><div class="skin-scroll"><p class="skin-intro">Your look in the pool. Complete campaign tracks to unlock more.</p><p class="skin-status" role="status"></p><div class="skin-grid"></div></div>`;
  document.body.append(dialog);
  function render(){
    const state=controller.get(),unlocked=new Set(['original',...completedTracks(state)]);
    dialog.querySelector('.skin-grid').innerHTML=skins.map(skin=>{
      const owned=unlocked.has(skin.id),equipped=state.skin===skin.id;
      return `<button type="button" class="skin-choice ${equipped?'is-equipped':''}" data-player-skin="${skin.id}" style="--skin-color:${skin.color}" aria-pressed="${equipped}" ${owned?'':'disabled'}><span class="skin-preview" aria-hidden="true"><i></i></span><strong>${skin.name}</strong><span class="skin-choice-state">${iconHTML(equipped?'check':owned?'radio-off':'lock')}${equipped?'Equipped':owned?'Use skin':'Locked'}</span>${!owned?`<small>Complete ${skin.name}</small>`:''}</button>`;
    }).join('');
  }
  dialog.querySelector('[data-skin-back]').onclick=()=>controller.back();
  dialog.addEventListener('cancel',event=>{event.preventDefault();controller.back();});
  dialog.addEventListener('click',event=>{
    const choice=event.target.closest('[data-player-skin]');if(!choice||choice.disabled)return;
    const id=choice.dataset.playerSkin,result=controller.act({type:'skin',skin:id});
    if(result.ok){render();dialog.querySelector(`[data-player-skin="${id}"]`).focus({preventScroll:true});}
    dialog.querySelector('.skin-status').textContent=result.ok?`${skins.find(s=>s.id===id).name} equipped.`:result.reason;
  });
  return {open(){controller.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();dialog.querySelector('.skin-status').textContent='';dialog.showModal();dialog.querySelector('[data-skin-back]').focus({preventScroll:true});}};
}
