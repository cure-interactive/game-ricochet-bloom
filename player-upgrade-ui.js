import { PLAYER_UPGRADES, playerUpgradeReason, playerBuild, playerConfig } from './player-upgrade.js?v=fab6c92f134e88ebe641c4be9b87d9e46b857905b117a20831b164d5181c0c23';
import { screenHeader } from './screen-header.js?v=b12f4a7f643a7ebc5d8945f2671aead3040da9be729bee110404af53f14e24e0';
import { buttonHTML, iconHTML } from './ui-icon.js?v=7e81246e997e2106001cc2f001032e68090a0c751f008678bd91820191a7979e';
import { escapeHTML } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';

export function playerUpgradeMount(host) {
 const dialog=document.createElement('dialog');dialog.id='player-upgrade-dialog';dialog.className='standard-dialog';dialog.setAttribute('aria-labelledby','player-upgrade-title');
 dialog.innerHTML=screenHeader({className:'dialog-heading',title:'Player Upgrades',titleId:'player-upgrade-title',back:buttonHTML('Back','arrow-left',{'data-player-back':true})})+'<div class="dialog-body player-upgrade-body"></div>';
 document.body.append(dialog);
 const content=dialog.querySelector('.player-upgrade-body'),back=dialog.querySelector('[data-player-back]');
 function render(message='') {
  const state=host.get(),profile=state.profile,owned=profile.playerResearch??{},config=playerConfig(playerBuild(profile));
  content.innerHTML=`<div class="player-upgrade-intro"><span class="player-upgrade-emblem">${iconHTML('player-skin')}</span><div><p class="player-upgrade-wallet">${profile.wallet.seeds.toLocaleString('en-US')} <span>Points Available</span></p><p>Permanent improvements to your player. Every purchased upgrade stacks automatically.</p><p>Used in Melody Journey, Free Play, Endless Waves, Challenge and Score Attack.</p></div></div><dl class="player-upgrade-stats"><div><dt>Extra Guide Length</dt><dd>+${config.guideExtra}</dd></div><div><dt>Maximum Launch Speed</dt><dd>${config.maxLaunch.toLocaleString('en-US')}</dd></div><div><dt>Wall Speed Retained</dt><dd>${Math.round(config.wallRetention*100)}%</dd></div></dl><p class="player-upgrade-status" role="status" aria-live="polite">${escapeHTML(message)}</p><div class="player-upgrade-grid">${['Sight','Launch','Rebound'].map(branch=>`<section class="player-upgrade-branch"><h3>${branch}</h3><ol>${PLAYER_UPGRADES.filter(n=>n.branch===branch).map(n=>{
   const has=Object.hasOwn(owned,n.id),reason=playerUpgradeReason(profile,n.id),blocked=state.powerMode==='shared';
   return `<li class="player-upgrade-card${has?' is-owned':''}"><h4>${escapeHTML(n.name)}${has?iconHTML('check'):''}</h4><p>${escapeHTML(n.description)}</p>${has?'<strong class="player-upgrade-owned">Owned · Cumulative</strong>':buttonHTML(`Unlock · ${n.cost} Points`,'coin',{'data-player-buy':n.id,'aria-label':`Unlock ${n.name} for ${n.cost} Points`,disabled:!!reason||blocked,'aria-describedby':'player-reason-'+n.id.replace('.','-')})+`<small id="player-reason-${n.id.replace('.','-')}">${escapeHTML(blocked?'Shared challenges use their fixed build.':reason??'Ready to unlock')}</small>`}</li>`;
  }).join('')}</ol></section>`).join('')}</div><details class="player-upgrade-rules"><summary>Where Upgrades Apply</summary><p>Free Play, Challenge and Endless Waves apply purchases between shots. Melody Journey applies them from the next pool. Score Attack fixes them when a new run starts. Saved shots keep their original physics.</p><p>Fixed puzzle trials and shared challenges use their authored rules. Player skins change appearance only. The guide shows wall geometry; drifting bubbles and powers can alter the actual path. Speed and distance use game-world units.</p></details>`;
 }
 back.onclick=()=>host.back();dialog.addEventListener('cancel',event=>{event.preventDefault();host.back();});
 dialog.addEventListener('click',event=>{
  const id=event.target.closest('[data-player-buy]')?.dataset.playerBuy;if(!id)return;
  const result=host.act({type:'buy-player',id});render(result.ok?result.message:result.reason);back.focus({preventScroll:true});
 });
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();dialog.showModal();back.focus({preventScroll:true});},refresh(){if(dialog.open)render();}};
}
