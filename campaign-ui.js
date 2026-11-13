import { gameCreate, objectiveProgress } from './engine.js?v=8f3aec315f5641fc3607ff24db94ba5aedb253a753d259fc501c3a6fe65cad8a';
import { TRACKS, trackGet, LAYOUTS, trackEnvironment } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { campaignRestoration, campaignPoolAccess, POPULATIONS, POOL_NAMES, GOALS, completedTracks, unlockedTracks, progressionLoadout, GAME_CATALOGUE } from './run.js?v=2c3a5c55618222220cf91fe89401936e57fde9581f137341df26ea7a9f3e8ecc';
import { profileSummary } from './profile.js?v=97ac100a92c9a7d558ac51c6da874fef4e1440ffe2a58ac08a0bfe480956ca86';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import { assetURL } from './asset.js?v=6bd4d1d7502ba20bf95bc75985c2a8694fbab62f24ccc87e2722225697137195';
import { SONG_STORAGE, SONG_LIMIT, songLibraryRead, songSnapshot } from './song.js?v=6909bc96a5ec9b3981c89dc4fca150ed64875600c1b66e18653e3eb51f74db45';

const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,icon='play',extra='')=>`<button type="button" data-campaign="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
export function restorationArt(state,track,large=false){
  const count=campaignRestoration(state,track.id);
  return `<span class="restoration-art ${large?'is-large':''}" style="--track-color:${track.color}" role="img" aria-label="${track.name}: ${track.mechanic}; ${count} of 5 pools cleared"><img src="${assetURL('artwork/'+track.id+'.svg')}" alt=""></span>`;
}
export function campaignMount(controller) {
  const dialog=document.createElement('dialog');dialog.id='campaign-dialog';dialog.setAttribute('aria-label','Campaign');document.body.append(dialog);
  let tab='tracks',viewTrack=null,previewPool=null,songsOpen=false,ending=null;
  function back(){ending=null;if(tab!=='tracks'){tab='tracks';previewPool=null;render();dialog.querySelector(`[data-track="${viewTrack}"]`)?.focus();}else controller.back?.();}
  const say=text=>{dialog.querySelector('[role=status]').textContent=text;};
  function render(){
    controller.songsClose?.();
    const actual=controller.get(),viewingOther=!!viewTrack&&viewTrack!==actual.track,blocked=viewingOther&&actual.phase!=='shop';
    // Track inspection is presentation-only; an active run stays untouched.
    const s=viewingOther?{...actual,track:viewTrack,phase:'shop',pool:0,route:0,run:null}:actual;
    dialog.dataset.view=tab;
    dialog.setAttribute('aria-label',tab==='challenge'?'Shared Challenge':tab==='play'?trackGet(s.track).name:'Campaign');
    const track=trackGet(s.track),complete=profileSummary(s.profile,GAME_CATALOGUE).completedTracks,unlocked=unlockedTracks(s),running=s.phase!=='shop',next=s.phase==='interlude'?s.pool+1:s.pool,target=running?next:0,pool=previewPool??target,access=campaignPoolAccess(s,pool),lockedPool=POOL_NAMES.findIndex((_,i)=>{const a=campaignPoolAccess(s,i);return !a.play&&!a.replay;});
    const preview=s.phase==='run'&&pool===s.pool?s.run.game:gameCreate(`${s.run?.seed||s.seed}-${pool}-${s.route}`,'song-run',{build:progressionLoadout(s).powers,population:POPULATIONS[pool],relaxed:s.relaxed,environment:trackEnvironment(s.track,pool,s.route)});
    dialog.innerHTML=`<div class="campaign-heading"><div><small>RICOCHET BLOOM</small><h2>${tab==='challenge'?'Shared Challenge':tab==='play'?track.name:'Campaign'}${s.shared?'<span class="shared-badge"> · SHARED</span>':''}</h2></div>${button('close','Back','arrow-left')}</div><div class="campaign-scroll"><div class="campaign-status" role="status" aria-live="polite"></div>
    ${tab==='tracks'?`<div class="track-strip" role="group" aria-label="Choose track" tabindex="0">${TRACKS.filter(t=>controller.showHiddenContent?.()||unlocked.some(x=>x.id===t.id)).map(t=>{const i=TRACKS.indexOf(t),available=unlocked.some(x=>x.id===t.id);return `<button type="button" data-track="${t.id}" class="${available?complete.includes(t.id)?'is-complete':'is-unlocked':'is-locked'}" ${!available?'disabled':''} aria-label="${t.name}, ${complete.includes(t.id)?'completed':available?'available':'locked, clear '+TRACKS[i-1]?.name}" style="--track-color:${t.color}">${restorationArt(s,t)}<span>${t.name}<small>${!available?'Locked · finish '+TRACKS[i-1].name:complete.includes(t.id)?'Completed · view track':actual.phase!=='shop'&&t.id===actual.track?'Run in progress':'View track'}</small></span>${iconHTML(complete.includes(t.id)?'check':available?'arrow-right':'lock')}</button>`;}).join('')}</div>
    <div class="campaign-actions">${button('challenge-tab','Shared Challenge','copy')}</div>`:''}
    ${tab==='play'?`${blocked?`<p class="track-run-notice">Your ${trackGet(actual.track).name} run is saved. Finish it before starting this track.</p>`:''}<section class="track-overview" style="--track-color:${track.color}">${restorationArt(s,track,true)}<div><p>${track.mechanic}.</p><p class="track-sound">${iconHTML('music-note')}${track.music}.</p><small>${campaignRestoration(s,track.id)}/5 pools cleared · ${complete.includes(track.id)?'Player skin earned':'Finish this track to earn its player skin'}</small>${s.records.find(r=>r.track===track.id&&r.music)?button('sample','Hear your song · 12s','music-note',`data-record="${s.records.find(r=>r.track===track.id&&r.music).id}"`):''}</div></section>
    <div class="pool-selection-heading"><strong>Five Pools</strong><small>Clear each pool to unlock the next.</small></div><nav class="level-path" aria-label="Five pools in ${track.name}">${POOL_NAMES.map((name,i)=>{const a=campaignPoolAccess(s,i),locked=!a.play&&!a.replay,label=locked?'Locked':a.play?s.phase==='run'?'In progress':'Play next':s.developmentProgress?'Open':'Completed';return `<button type="button" data-pool="${i}" ${locked?'disabled':''} aria-pressed="${pool===i}" aria-label="Pool ${i+1}, ${name}, ${locked?'locked, clear '+POOL_NAMES[i-1]+' first':label}" class="${locked?'is-locked':a.cleared?'is-cleared':'is-unlocked'}"><b>${locked?iconHTML('lock'):a.cleared?iconHTML('check'):i+1}</b><span>${name}</span><small>${label}</small></button>`;}).join('')}</nav><p class="pool-unlock-hint">${lockedPool>=0?'Next unlock: '+POOL_NAMES[lockedPool]+' — clear '+POOL_NAMES[lockedPool-1]+'.':'All pools unlocked.'}</p>
    <section class="campaign-preview"><div class="level-description"><span class="eyebrow">${track.name} · POOL ${pool+1} / 5</span><h3>${POOL_NAMES[pool]}</h3><p>${GOALS[pool]}</p><div class="level-reward"><span>${iconHTML('coin')}${pool!==target&&access.replay?'Completed':'+2 Points on clear'}</span><span>${POPULATIONS[pool]} bubbles</span></div></div><div class="pool-route-preview" aria-label="Pool preview"><svg viewBox="0 0 960 640" role="img" aria-label="${LAYOUTS[pool]}"><rect x="30" y="30" width="900" height="580" rx="45" fill="#101e31" stroke="#7794a6" stroke-width="4"/>${preview.bodies.map(b=>`<circle cx="${b.x}" cy="${b.y}" r="${b.radius}" fill="${b.id?track.color:'#fff'}"/>`).join('')}</svg><span>${LAYOUTS[pool]}</span></div>
    ${pool!==target?`<p class="level-locked-hint">${access.replay?'This pool is complete. Continue your current run to play the next pool.':'Clear the preceding pools in this run to play here.'} ${button('current','Return to '+POOL_NAMES[target],'arrow-left')}</p>`:''}
    <p class="level-rules">${s.relaxed?'8':'6'} plucks per pool, plus one bonus pluck for the first bloom. Bonus: ${objectiveProgress(preview).title} · +1 bonus Point.</p></section><div class="level-extra">${!running&&s.retry?button('retry','Retry last run','reset'):''}${running&&!blocked?button('end-ask','End Run','close'):''}</div>
    ${running&&!blocked&&ending===s.run?.id?`<section class="run-end-confirm" role="group" aria-label="End Run Confirmation"><h3>End This Run?</h3><p>Earned Points and research stay. Temporary discoveries return, and this run ends.</p><div>${button('keep-run','Keep Playing','arrow-left')}${button('end-run','End Run','check')}</div></section>`:''}
    `:''}
    ${tab==='play'?`<details class="level-collection" id="level-collection" ${songsOpen?'open':''}><summary>${iconHTML('music-note')}<span>Songs<small>Recordings and saved songs for this track</small></span></summary><div class="level-collection-content"><h3>Track Rewards</h3><p>Your best songs from this track are kept automatically.</p><div class="track-rewards">${[track].filter(t=>s.records.some(r=>r.track===t.id)||completedTracks(s).includes(t.id)).map(t=>`<section class="track-reward" style="--track-color:${t.color}"><h4><i aria-hidden="true"></i>${t.name}</h4>${s.records.filter(r=>r.track===t.id).map(r=>`<div class="track-record"><span>${r.relaxed?'Relaxed':'Standard'} · ${r.medal}<small>${r.launches} plucks · ${r.bonuses}/5 bonuses</small></span><div>${button('listen','Listen','play',`data-record="${r.id}"`)}${button('favorite','Keep song','bookmark',`data-record="${r.id}"`)}</div></div>`).join('')}</section>`).join('')||'<p>Finish this track to save its song.</p>'}</div> ${s.latest?.track===track.id?`<section class="latest-song"><h3>Latest Attempt</h3><p>${trackGet(s.latest.track).name} · ${s.latest.outcome==='victory'?'Complete':'Unfinished'} · ${s.latest.launches} plucks</p>${button('listen','Listen','play','data-record="latest"')}${button('favorite','Keep song','bookmark','data-record="latest"')}</section>`:''}<div id="level-song-slot"></div></div></details>`:''}
    ${tab==='challenge'?`<h3>Same Seed. Same Powers.</h3><p>A shared challenge supplies a fixed build, independent of research. Launch timing still affects moving physics. These are friendly challenges, without a verified global ranking.</p><label>Challenge code<textarea id="challenge-code" rows="5" maxlength="8192" spellcheck="false" placeholder="RB1.…"></textarea></label><div class="campaign-actions">${button('create-code','Share these powers','copy')}${button('play-code','Play shared challenge','play')}${button('resume-code','Resume saved challenge','clock')}</div><p>Your normal wallet and suspended run are preserved.</p>`:''}</div>${tab==='play'?`<footer class="campaign-footer">${blocked?button('active-track','Continue '+trackGet(actual.track).name,'arrow-right'):button('launch',s.phase==='run'?'Resume '+POOL_NAMES[target]:s.phase==='interlude'?'Play '+POOL_NAMES[target]:'Start '+track.name,'play',`class="primary" ${pool!==target?'disabled':''}`)}</footer>`:''}`;

    const collection=dialog.querySelector('#level-collection');if(collection){collection.addEventListener('toggle',()=>{songsOpen=collection.open;if(!songsOpen)controller.songsClose?.();});controller.songsMount?.(dialog.querySelector('#level-song-slot'),track.id);}
  }
  function open(view='play',trackId=null){ending=null;songsOpen=['songs','collection'].includes(view);tab=view==='challenge'?'challenge':view==='play'||songsOpen?'play':'tracks';viewTrack=unlockedTracks(controller.get()).some(t=>t.id===trackId)?trackId:controller.get().track;previewPool=null;controller.screen?.(tab);document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();dialog.showModal();if(songsOpen)dialog.querySelector('#level-collection')?.scrollIntoView({block:'start'});}
  dialog.onclick=e=>{
    const selectedPool=e.target.closest('[data-pool]');if(selectedPool){previewPool=Number(selectedPool.dataset.pool);render();return;}
    const track=e.target.closest('[data-track]');if(track){if(!unlockedTracks(controller.get()).some(t=>t.id===track.dataset.track))return;ending=null;viewTrack=track.dataset.track;tab='play';previewPool=null;render();dialog.querySelector('[data-campaign=close]')?.focus();return;}
    const b=e.target.closest('[data-campaign]');if(!b)return;
    const action=b.dataset.campaign,s=controller.get();
    if(action==='close'){back();return;}
    if(action==='end-ask'){if(tab!=='play'||viewTrack!==s.track||!s.run)return;ending=s.run.id;render();dialog.querySelector('.run-end-confirm')?.scrollIntoView({block:'nearest'});dialog.querySelector('[data-campaign=keep-run]')?.focus();return;}
    if(action==='keep-run'){ending=null;render();dialog.querySelector('[data-campaign=end-ask]')?.focus();return;}
    if(action==='end-run'){if(tab!=='play'||viewTrack!==s.track||!s.run||ending!==s.run.id)return;const r=controller.act({type:'abandon'});ending=null;if(r.ok)render();say(r.ok?r.message:r.reason);return;}
    if(action==='active-track'){viewTrack=s.track;previewPool=null;tab='play';render();return;}
    if(action==='current'){previewPool=null;render();return;}
    if(action.endsWith('-tab')){tab=action==='challenge-tab'?'challenge':'play';controller.screen?.(tab);render();return;}
    if(action==='listen'||action==='sample'||action==='favorite'){
      const record=b.dataset.record==='latest'?s.latest:s.records.find(r=>r.id===b.dataset.record);if(!record?.music){say('This older result has no recorded song.');return;}
      if(action==='listen'||action==='sample'){controller.listen(record,action==='sample'?12:0);return;}
      try{const library=songLibraryRead(JSON.parse(localStorage.getItem(SONG_STORAGE)||'null'));if(library.songs.length>=SONG_LIMIT){say('Saved Songs are full. Export or remove one first; nothing was replaced.');return;}library.songs.push({id:crypto.randomUUID(),name:`${trackGet(record.track).name} · ${record.outcome==='victory'?record.medal:'Unfinished'}`,created:Date.now(),music:songSnapshot(record.music)});localStorage.setItem(SONG_STORAGE,JSON.stringify(library));controller.songsRefresh?.();say('Song kept in Saved Songs below.');}catch{say('Could not save. Export a progress backup before closing.');}return;
    }
    if(action==='create-code'){const r=controller.code();if(r.ok){dialog.querySelector('#challenge-code').value=r.code;say('Code ready. Select and copy it to share.');}else say(r.reason);return;}
    if(action==='resume-code'){const r=controller.resumeChallenge();if(!r.ok)say(r.reason);return;}
    if(action==='play-code'){const r=controller.challenge(dialog.querySelector('#challenge-code').value);if(!r.ok)say(r.reason);return;}
    if(action==='launch'){
      if(s.phase!=='shop'&&viewTrack!==s.track){say('Finish your current run before starting another track.');return;}
      if(s.phase==='shop'&&viewTrack!==s.track){const selected=controller.act({type:'track',track:viewTrack});if(!selected.ok){say(selected.reason);return;}}
      const r=controller.open('play');if(!r.ok)say(r.reason);return;
    }
    const r=controller.act(action==='retry'?{type:'retry'}:action.startsWith('route-')?{type:'route',route:Number(action.at(-1))}:{type:action});
    if(r.ok){if(action==='retry')controller.open('play');else render();}else say(r.reason);
  };
  dialog.addEventListener('close',()=>controller.songsClose?.());
  dialog.addEventListener('cancel',event=>{event.preventDefault();back();});
  return {open,refresh:()=>{if(dialog.open)render();}};
}
