import { TRACKS } from './track.js?v=57009a338150b0399594597f6a834d703dafefeb8088046d9e587aa1896fb5ed';
import { completedTracks, unlockedTracks } from './run.js?v=4a6b36c1f1f885e0e63739e7ebfec31ec2f164543efa29e2eada2632f613b604';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const skins=[{id:'original',name:'Original',color:'#f1f9d7'},...TRACKS];
export function skinOptions(state,showHidden=false){
  const unlocked=new Set(['original',...completedTracks(state)]),visible=new Set(['original',...unlockedTracks(state).map(t=>t.id)]);
  return skins.filter(skin=>showHidden||visible.has(skin.id)).map(skin=>({...skin,owned:unlocked.has(skin.id),equipped:state.skin===skin.id}));
}
export function skinSelection(state,id,enabled){
  const skin=skinOptions(state).find(s=>s.id===id);
  if(!skin?.owned||typeof enabled!=='boolean')return null;
  return {type:'skin',skin:enabled?id:'original'};
}
export function skinMount(controller){
  let selected=null,libraryScroll=0;
  const dialog=document.createElement('dialog');dialog.id='skin-dialog';dialog.setAttribute('aria-labelledby','skin-title');
  dialog.innerHTML=`<header class="skin-heading"><button type="button" data-skin-back>${iconHTML('arrow-left')}<span>Back</span></button><h2 id="skin-title">Player Skins</h2></header><div class="skin-scroll"><section class="skin-library"><p class="skin-intro">Complete campaign tracks to unlock more looks.</p><div class="skin-grid"></div></section><section class="skin-detail" hidden></section><p class="skin-status" role="status"></p></div>`;
  document.body.append(dialog);
  const scroll=dialog.querySelector('.skin-scroll'),detail=dialog.querySelector('.skin-detail'),status=dialog.querySelector('.skin-status'),back=dialog.querySelector('[data-skin-back]');
  function render(){
    const options=skinOptions(controller.get(),controller.showHiddenContent?.()),skin=options.find(s=>s.id===selected);
    if(selected&&!skin)selected=null;
    dialog.querySelector('.skin-grid').innerHTML=options.map(skin=>`<button type="button" class="skin-choice ${skin.equipped?'is-equipped':''} ${skin.owned?'':'is-locked'}" data-player-skin="${skin.id}" style="--skin-color:${skin.color}" aria-label="View ${skin.name}, ${skin.equipped?'Equipped':skin.owned?'Unlocked':'Locked'}"><span class="skin-preview" aria-hidden="true"><i></i></span><strong>${skin.name}</strong><span class="skin-choice-state">${iconHTML(skin.equipped?'check':skin.owned?'lock-open':'lock')}${skin.equipped?'Equipped':skin.owned?'Unlocked':'Locked'}</span></button>`).join('');
    dialog.querySelector('.skin-library').hidden=!!skin;detail.hidden=!skin;scroll.classList.toggle('is-detail',!!skin);
    dialog.querySelector('#skin-title').textContent=skin?skin.name:'Player Skins';back.setAttribute('aria-label',skin?'Back to Player Skins':'Back');
    if(!skin){detail.replaceChildren();return;}
    detail.style.setProperty('--skin-color',skin.color);
    detail.innerHTML=`<div class="skin-preview skin-preview-large" aria-hidden="true"><i></i></div><div class="skin-selection"><label class="setting-toggle"><input id="skin-use" type="checkbox" ${skin.equipped?'checked':''} ${!skin.owned||skin.id==='original'&&skin.equipped?'disabled':''}><span>Use This Skin</span></label><p class="skin-unlock">${!skin.owned?iconHTML('lock')+'Complete '+skin.name+' to unlock this skin.':skin.id==='original'?'The original player appearance.':skin.equipped?'Turn off to return to Original.':'Unlocked by completing '+skin.name+'.'}</p></div>`;
  }
  function goBack(){
    if(selected){const id=selected;selected=null;render();status.textContent='';scroll.scrollTop=libraryScroll;dialog.querySelector(`[data-player-skin="${id}"]`)?.focus({preventScroll:true});}
    else controller.back();
  }
  back.onclick=goBack;
  dialog.addEventListener('cancel',event=>{event.preventDefault();goBack();});
  dialog.addEventListener('click',event=>{
    const choice=event.target.closest('[data-player-skin]');if(!choice)return;
    libraryScroll=scroll.scrollTop;selected=choice.dataset.playerSkin;render();status.textContent='';scroll.scrollTop=0;back.focus({preventScroll:true});
  });
  dialog.addEventListener('change',event=>{
    if(event.target.id!=='skin-use')return;
    const action=skinSelection(controller.get(),selected,event.target.checked);if(!action){render();return;}
    const result=controller.act(action);render();
    status.textContent=result.ok?`${skins.find(s=>s.id===action.skin).name} equipped.`:result.reason;
    const toggle=dialog.querySelector('#skin-use');(toggle.disabled?back:toggle).focus({preventScroll:true});
  });
  return {refresh(){if(dialog.open)render();},open(){selected=null;libraryScroll=0;controller.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();status.textContent='';dialog.showModal();scroll.scrollTop=0;back.focus({preventScroll:true});}};
}
