import { SCORE_BUDGETS, SCORE_DEFAULT, scoreTargets, scoreMedal } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
import { scoreRead } from './score-attack-store.js?v=5ff229a31a77b92b75b6336e1bb1d7143a5c4a32922a4c4f10e12c8f11de9e18';
import { scoreConditions } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { medalConditionsHTML } from './medal-ui.js?v=4fccbcfa467ab558a8cfba26398ff7d1b89d650b0664c6af2ba633490cf7ad0c';
import { assetURL } from './asset.js?v=3cbfab492cc37c59b11a7e7ee1809773bc384873f2e900d7d5fa6526e0af4b91';

export function scoreAttackMount({content,heading,storage,...host}) {
  const $=id=>content.querySelector('#'+id);
  const art=mode=>assetURL(`artwork/mode/${mode}.svg`);
  let budget=SCORE_DEFAULT;
  function scoreSetup(){
    host.screen('score-setup');heading.textContent='Score Attack';
    content.innerHTML=`<div class="mode-overview"><img src="${art('score-attack')}" alt="" width="480" height="240"><div><p>Build chains, bank off walls and trigger blooms. Use every shot to chase your best score.</p><small>No countdown · No extra shots · Final shot finishes before scoring</small></div></div><div class="layout-grid" role="group" aria-label="Shot budget">${SCORE_BUDGETS.map(n=>`<button class="layout-card" data-budget="${n}" aria-pressed="${n===budget}"><strong>${n} Shots</strong><small>${n===5?'Quick Run':n===10?'Standard Run':'Long Run'}</small></button>`).join('')}</div><div id="score-setup-detail"></div>`;
    for(const b of content.querySelectorAll('[data-budget]'))b.onclick=()=>{budget=Number(b.dataset.budget);scoreSetup();content.querySelector(`[data-budget="${budget}"]`).focus();};
    const saved=scoreRead(storage,host.kind(),budget),targets=scoreTargets(budget),detail=$('score-setup-detail');
    const medal=saved.best===null?null:scoreMedal(saved.best,budget);
    detail.innerHTML=`${medalConditionsHTML(scoreConditions(targets,'Finish every shot'),medal)}<p>${saved.best===null?'No completed best yet':`Personal Best: ${saved.best.toLocaleString('en-US')}${medal?' · '+medal:''}`}</p><p>Points earned here are usable in the Skill Tree. Your researched skills are fixed when a run starts; new purchases apply to your next run. Each budget and profile keeps its own save and completed best. Runs begin with the same layout; bubbles drift while you aim.</p>`;
    if(!saved.ok){const warning=document.createElement('p');warning.className='trial-warning';warning.textContent='This save could not be read. It is preserved until you explicitly replace it.';detail.append(warning);}
    if(saved.entry&&!saved.entry.game.isOver){const b=document.createElement('button');b.className='primary';b.textContent=`Continue · ${saved.entry.game.plucks} Shots Left`;b.onclick=()=>{host.start(budget,false);};detail.append(b);}
    const start=document.createElement('button');start.className='primary';start.textContent=saved.entry&&!saved.entry.game.isOver?'Replace Saved Run':!saved.ok?'Replace Unreadable Save':`Start ${budget} Shots`;start.onclick=()=>{if((!saved.ok||saved.entry&&!saved.entry.game.isOver)&&!confirm(saved.ok?'Replace this budget’s saved run? Completed personal bests and earned Points are kept.':'Replace this unreadable save? Its personal best cannot be recovered. Your Skill Tree Points are kept.'))return;host.start(budget,true);};detail.append(start);host.show();
  }
  return {open:scoreSetup};
}
