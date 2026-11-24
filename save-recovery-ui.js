import { screenHeader } from './screen-header.js?v=8ba40d32995eb33b79b5954ffcf2215d6b859e128bf56fd7afe99509916cf979';
import { buttonHTML, iconHTML } from './ui-icon.js?v=141b73ae9912576ea262053e37bd74607d256a5049e1845326c31654e92fc915';

const supportActions=(showHelpTitle=false)=>`<section data-diagnostics class="support-actions reading-card" aria-label="Send a Problem Report">${showHelpTitle?'<h3 class="section-title"><span class="ui-icon" data-icon="about" aria-hidden="true"></span><span>Contact Support</span></h3>':''}<p>For help with playing, purchases or saving, send a Support Report. It includes your player name, game progress, save status, device and screen details, audio state and recent errors.</p><p>Email opens a draft for you to review and send. Share and Copy use the same report.</p><p class="support-recipient">To: main@cureinteractive.com</p><div class="save-actions">${buttonHTML('Email Report','upload',{'data-support-email':''})}${buttonHTML('Share Report','upload',{'data-support-share':''})}${buttonHTML('Copy Report','copy',{'data-support-copy':''})}</div><p data-diagnostics-status role="status" aria-live="polite"></p><textarea data-diagnostics-report aria-label="Support Report" readonly hidden></textarea></section>`;

// One recovery surface for unreadable profiles and pending writes.
export function saveRecoveryMount(host){
  const notice=document.createElement('section');notice.className='save-notice';notice.setAttribute('aria-label','Progress Recovery');
  notice.innerHTML='<div><strong>Saving Needs Help</strong><p>Your progress is kept. Tap here to retry or send a report.</p></div>'+buttonHTML('Progress Recovery','reset',{class:'save-review'});
  const dialog=document.createElement('dialog');dialog.id='save-recovery-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','save-recovery-title');
  dialog.innerHTML=`${screenHeader({className:'dialog-heading',title:'Progress Recovery',titleId:'save-recovery-title',icon:'reset',back:buttonHTML('Close','close',{id:'save-close'})})}<div class="dialog-body"><section class="reading-card"><p id="save-profile"></p><p id="save-message" role="status"></p><div class="save-actions">${buttonHTML('Retry Loading','reset',{id:'save-retry'})}</div></section>${supportActions()}<details class="reading-card"><summary>Backup Options</summary>${buttonHTML('Export Backup','export',{id:'save-export'})}</details><details id="save-diagnostics" class="reading-card"><summary>Recovery Details</summary><pre></pre></details><div id="save-reset-section" class="reading-card">${buttonHTML('Start Fresh Profile','reset',{id:'save-reset'})}<section id="save-reset-confirmation" hidden><h3 class="section-title"><span class="ui-icon" data-icon="reset" aria-hidden="true"></span><span>Start Fresh?</span></h3><p>This replaces this profile with an empty one. Export a backup first if you want help recovering it. A separate copy of the original data will also be kept in this browser.</p><div class="save-actions">${buttonHTML('Keep Saved Data','arrow-left',{id:'save-keep'})}${buttonHTML('Back Up and Start Fresh','reset',{id:'save-reset-confirm'})}</div></section></div></div>`;
  document.body.append(dialog);
  const helpActions=document.createElement('details');helpActions.className='settings-section settings-help';
  helpActions.innerHTML=`<summary>${iconHTML('about')}<span>Get Help</span></summary><div class="settings-section-body">${supportActions(true).replace('support-actions reading-card','support-actions')}</div>`;
  document.querySelector('#settings-dialog > .dialog-body').append(helpActions);
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
