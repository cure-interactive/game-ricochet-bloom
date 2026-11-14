import { buttonHTML, iconHTML } from './ui-icon.js?v=7e81246e997e2106001cc2f001032e68090a0c751f008678bd91820191a7979e';

// One recovery surface for unreadable profiles and pending writes.
export function saveRecoveryMount(host){
  const notice=document.createElement('section');notice.className='save-notice';notice.setAttribute('aria-label','Progress recovery');
  notice.innerHTML='<div><strong>Progress Needs Attention</strong><p>Review recovery options before playing.</p></div>'+buttonHTML('Review','reset',{class:'save-review'});
  const dialog=document.createElement('dialog');dialog.id='save-recovery-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','save-recovery-title');
  dialog.innerHTML=`<div class="dialog-heading screen-heading"><h2 id="save-recovery-title">Progress Recovery</h2>${buttonHTML('Close','close',{id:'save-close'})}</div><div class="dialog-body"><p id="save-profile"></p><p id="save-message" role="status"></p><p>Your original save is kept until you explicitly choose to start fresh.</p><div class="save-actions">${buttonHTML('Export Backup','download',{id:'save-export'})}${buttonHTML('Retry Loading','reset',{id:'save-retry'})}</div><details id="save-diagnostics"><summary>Recovery Details</summary><pre></pre></details><div id="save-reset-section"><hr>${buttonHTML('Start Fresh Profile','reset',{id:'save-reset'})}<section id="save-reset-confirmation" hidden><h3>Start Fresh?</h3><p>This replaces this profile with an empty one. Export a backup first if you want help recovering it. A separate copy of the original data will also be kept in this browser.</p><div class="save-actions">${buttonHTML('Keep Saved Data','arrow-left',{id:'save-keep'})}${buttonHTML('Back Up and Start Fresh','reset',{id:'save-reset-confirm'})}</div></section></div></div>`;
  document.body.append(dialog);
  const find=id=>dialog.querySelector('#'+id);
  const settings=document.createElement('button');settings.type='button';settings.innerHTML=iconHTML('reset')+'<span>Progress Recovery</span>';
  document.getElementById('settings-advanced-actions').append(settings);
  function refresh(){
    const s=host.status();notice.hidden=!s.blocked;settings.hidden=!s.blocked;
    find('save-profile').textContent=s.kind==='development'?'Development Profile':'Normal Profile';
    find('save-message').textContent=s.message;
    find('save-reset-section').hidden=!s.canReset;
    find('save-retry').lastElementChild.textContent=s.pending?'Retry Save':'Retry Loading';
    find('save-export').disabled=!s.canExport;
    find('save-diagnostics').hidden=!s.details;
    find('save-diagnostics').querySelector('pre').textContent=s.details||'';
    if(!s.blocked&&dialog.open)dialog.close();
  }
  function open(){refresh();find('save-reset-confirmation').hidden=true;if(host.status().blocked&&!dialog.open)dialog.showModal();}
  notice.querySelector('button').onclick=open;settings.onclick=open;
  find('save-close').onclick=()=>dialog.close();
  find('save-export').onclick=()=>{host.exportBackup();refresh();};
  find('save-retry').onclick=()=>{host.retry();refresh();};
  find('save-reset').onclick=()=>{find('save-reset-confirmation').hidden=false;find('save-keep').focus();find('save-reset-confirmation').scrollIntoView({block:'nearest'});};
  find('save-keep').onclick=()=>{find('save-reset-confirmation').hidden=true;find('save-reset').focus();};
  find('save-reset-confirm').onclick=()=>{host.reset();refresh();};
  refresh();
  return {notice,open,refresh};
}
