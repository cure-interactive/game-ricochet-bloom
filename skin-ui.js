import {skinPreviewHTML,skinPreviewMount} from './skin-preview.js?v=20b9a6e6dcb6c0b1f5182adc72ed0282dd864528b6ea26ed11621b0dca8ee442';
import { screenHeader } from './screen-header.js?v=8c1818ee2c0fd6b0a409cbf62a7a68979ad5f1b9778b9567b20f46abfd27dda7';
import { TRACKS } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { completedTracks, unlockedTracks } from './run.js?v=cc440fdabebe81d2a4eb7bbd3fb7e891f85544ca0cdecf5fe40ef089b5c4d3fb';
import { iconHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';

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
  let selected=null,libraryScroll=0,preview=null;
  const dialog=document.createElement('dialog');dialog.id='skin-dialog';dialog.setAttribute('aria-labelledby','skin-title');
  dialog.innerHTML=`${screenHeader({icon:'player-skin',className:'skin-heading',title:'Player Skins',titleId:'skin-title',back:`<button type="button" data-skin-back>${iconHTML('arrow-left')}<span>Back</span></button>`})}<div class="skin-scroll"><section class="skin-library"><p class="skin-intro">Complete campaign tracks to unlock more looks.</p><div class="skin-grid"></div></section><section class="skin-detail" hidden></section><p class="skin-status" role="status"></p></div>`;
  document.body.append(dialog);
  const scroll=dialog.querySelector('.skin-scroll'),detail=dialog.querySelector('.skin-detail'),status=dialog.querySelector('.skin-status'),back=dialog.querySelector('[data-skin-back]');
  function render(){
    preview?.destroy();preview=null;
    const options=skinOptions(controller.get(),controller.showHiddenContent?.()),skin=options.find(s=>s.id===selected);
    if(selected&&!skin)selected=null;
    dialog.querySelector('.skin-grid').innerHTML=options.map(skin=>`<button type="button" class="skin-choice ${skin.equipped?'is-equipped':''} ${skin.owned?'':'is-locked'}" data-player-skin="${skin.id}" style="--skin-color:${skin.color}" aria-label="View ${skin.name}, ${skin.equipped?'Equipped':skin.owned?'Unlocked':'Locked'}"><span class="skin-preview" aria-hidden="true"><i></i></span><strong>${skin.name}</strong><span class="skin-choice-state">${iconHTML(skin.equipped?'check':skin.owned?'lock-open':'lock')}${skin.equipped?'Equipped':skin.owned?'Unlocked':'Locked'}</span></button>`).join('');
    dialog.querySelector('.skin-library').hidden=!!skin;detail.hidden=!skin;scroll.classList.toggle('is-detail',!!skin);
    dialog.querySelector('#skin-title').textContent=skin?skin.name:'Player Skins';back.setAttribute('aria-label',skin?'Back to Player Skins':'Back');
    if(!skin){detail.replaceChildren();return;}
    detail.style.setProperty('--skin-color',skin.color);
    detail.innerHTML=`${skinPreviewHTML(skin.name)}<div class="skin-selection"><label class="setting-toggle"><input id="skin-use" type="checkbox" ${skin.equipped?'checked':''} ${!skin.owned||skin.id==='original'&&skin.equipped?'disabled':''}><span>Use This Skin</span></label><p class="skin-unlock">${!skin.owned?iconHTML('lock')+'Complete '+skin.name+' to unlock this skin.':skin.id==='original'?'The original player appearance.':skin.equipped?'Turn off to return to Original.':'Unlocked by completing '+skin.name+'.'}</p></div>`;
    preview=skinPreviewMount(detail.querySelector('.skin-preview-large'),{gentle:controller.gentle});
  }
  dialog.addEventListener('close',()=>{if(!dialog.open){preview?.destroy();preview=null;}});
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
