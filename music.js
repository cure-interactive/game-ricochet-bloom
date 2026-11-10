import { trackGet } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
// Play supplies the motif and harmony; arrangement supplies a musical journey.
export const CHORDS = [
  { name: 'C6/9', notes: [60, 62, 64, 67, 69] },
  { name: 'Am9', notes: [57, 59, 60, 64, 67] },
  { name: 'Fmaj9', notes: [53, 55, 57, 60, 64] },
  { name: 'G6/9', notes: [55, 57, 59, 62, 64] }
];
export const JELLY_ROLES = Object.freeze({melody:{name:'Melody',mark:'♪'},bass:{name:'Bass',mark:'≋'},rhythm:{name:'Rhythm',mark:'⋮'}});
export const jellyRole = id => ['melody','bass','rhythm'][Math.max(0,id-1)%3];
export const PALETTES = Object.freeze({glass:'Glass',velvet:'Velvet',wood:'Wood'});
export function musicAccent(music) { if(music.bar >= music.accentUntil) { music.accentStart=Math.ceil(music.bar/4)*4;music.accentUntil=music.accentStart+8; } }
export const BEAT_SECONDS = .75, BAR_SECONDS = 3, PASSAGE_SECONDS = 12;
const tonesValid = (tones, min, max) => Array.isArray(tones) && tones.length >= min && tones.length <= max && tones.every(tone => Number.isInteger(tone) && tone >= 0 && tone < 5);
const countValid = value => Number.isSafeInteger(value) && value >= 0;
const pitchValid = midi => Number.isInteger(midi) && midi >= 48 && midi <= 84 && [0, 2, 4, 5, 7, 9, 11].includes(midi % 12);
const idValid = id => Number.isInteger(id) && id >= 0 && id <= 20;
const motifValid = value => value && tonesValid(value.tones, 1, 16) && Number.isInteger(value.rhythm) && value.rhythm >= 0 && value.rhythm < 3;
const phraseValid = value => motifValid(value) && ['steps', 'ids', 'pitches'].every(key => Array.isArray(value[key]) && value[key].length === value.tones.length)
  && value.steps.every((step, i) => Number.isInteger(step) && step >= 0 && step < 16 && (i ? step > value.steps[i - 1] : step === 0))
  && value.ids.every(idValid) && value.pitches.every(pitchValid);
const phraseCopy = value => ({ tones: [...value.tones], rhythm: value.rhythm, steps: [...value.steps], ids: [...value.ids], pitches: [...value.pitches] });
function legacyPhrase(value) {
  if (phraseValid(value)) return phraseCopy(value);
  const timing = [[0, 1, 4, 6], [0, 2, 3, 6], [0, 3, 5, 7]][value.rhythm];
  return { tones: [...value.tones], rhythm: value.rhythm, steps: value.tones.map((_, i) => timing[i % 4] + Math.floor(i / 4) * 8), ids: value.tones.map(() => 0), pitches: value.tones.map(tone => PENTATONIC[tone]) };
}
export function musicCreate(input = null, blooms = 0, plucks = null) {
  const empty = { version: 4, blooms, plucks: countValid(plucks) ? plucks : 0, theme: [], history: [], strikes: [], motifs: [], bar: 0, formStart: 0, hook: null, evolution:{nextBar:0,half:1,pending:null}, pendingParts:{bass:null,rhythm:null}, reply: null, parts:{melody:null,bass:null,rhythm:null}, intensity:{}, pans:{}, palette:'glass', accentStart:-1, accentUntil:0 };
  if (!input || ![1, 2, 3, 4].includes(input.version) || input.blooms !== blooms || !tonesValid(input.theme, 0, 4) || !Array.isArray(input.history) || input.history.length > Math.min(4, blooms) || !Array.isArray(input.strikes) || input.strikes.length > (input.version >= 3 ? 16 : 8)) return empty;
  if (input.history.length && input.theme.length !== 4) return empty;
  const valid = input.version >= 3 ? phraseValid : value => motifValid(value) && value.tones.length <= 8;
  if (!input.history.every(value => valid(value) && Number.isInteger(value.chord) && value.chord >= 0 && value.chord < CHORDS.length)) return empty;
  if (!input.strikes.every((hit, i) => hit && tonesValid([hit.tone], 1, 1) && countValid(hit.tick) && (!i || hit.tick >= input.strikes[i - 1].tick) && (input.version < 3 || (idValid(hit.id) && pitchValid(hit.midi))))) return empty;
  if (input.version >= 2 && (!countValid(input.plucks) || !countValid(input.bar) || !countValid(input.formStart) || input.formStart > input.bar || (plucks !== null && input.plucks !== plucks) || !Array.isArray(input.motifs) || input.motifs.length > 4 || !input.motifs.every(valid))) return empty;
  if (input.version >= 3 && ((input.version===3 && (typeof input.kept!=='boolean'||(input.kept&&!input.hook))) || (input.hook !== null && !phraseValid(input.hook)) || (input.reply !== null && (!input.reply || !phraseValid(input.reply.phrase) || ![0, 1].includes(input.reply.part))))) return empty;
  if(input.version===4) {
    const e=input.evolution;
    if(!e||!countValid(e.nextBar)||e.nextBar%2||e.nextBar>input.bar+10||![0,1].includes(e.half)||(e.pending!==null&&!phraseValid(e.pending))||!input.pendingParts||['bass','rhythm'].some(role=>input.pendingParts[role]!==null&&!phraseValid(input.pendingParts[role])))return empty;
  }
  const evolution=input.version===4?{...input.evolution,pending:input.evolution.pending?phraseCopy(input.evolution.pending):null}:{nextBar:Math.ceil((input.bar||0)/2)*2+8,half:1,pending:null};
  const pendingParts=Object.fromEntries(['bass','rhythm'].map(role=>[role,input.version===4&&input.pendingParts[role]?phraseCopy(input.pendingParts[role]):null]));
  const parts=Object.fromEntries(Object.keys(JELLY_ROLES).map(role=>[role,phraseValid(input.parts?.[role])?phraseCopy(input.parts[role]):null]));
  const intensity=Object.fromEntries(Object.entries(input.intensity||{}).filter(([id,v])=>idValid(Number(id))&&Number.isFinite(v)&&v>=0&&v<=1));
  const pans=Object.fromEntries(Object.entries(input.pans||{}).filter(([id,v])=>idValid(Number(id))&&Number.isFinite(v)&&v>=-1&&v<=1));
  const palette=Object.hasOwn(PALETTES,input.palette)?input.palette:'glass';
  const accentStart=Number.isInteger(input.accentStart)&&input.accentStart>=-1&&input.accentStart<=input.bar+4?input.accentStart:-1;
  const accentUntil=countValid(input.accentUntil)&&input.accentUntil<=input.bar+12?input.accentUntil:0;
  if(input.run!==undefined&&(!input.run||!trackGet(input.run.track)||!Number.isInteger(input.run.section)||input.run.section<0||input.run.section>5||!Number.isInteger(input.run.pending)||input.run.pending<0||input.run.pending>5||typeof input.run.cadenceDone!=='boolean'))return empty;
  const run=input.run?{run:{...input.run}}:{};
  const copy = value => input.version >= 3 ? phraseCopy(value) : legacyPhrase(value);
  return { ...empty, ...run, evolution, pendingParts, parts, intensity, pans, palette, accentStart, accentUntil, plucks: plucks ?? (input.version >= 2 ? input.plucks : blooms), theme: [...input.theme], history: input.history.map(value => ({ ...copy(value), chord: value.chord })), strikes: input.strikes.map(hit => ({ tone: hit.tone, tick: hit.tick, id: hit.id ?? 0, midi: hit.midi ?? PENTATONIC[hit.tone] })), motifs: (input.version >= 2 ? input.motifs : input.history).map(copy), bar: input.version >= 2 ? input.bar : 0, formStart: input.version >= 2 ? input.formStart : 0, hook: input.version >= 3 && input.hook ? copy(input.hook) : null, reply: input.version >= 3 && input.reply ? { phrase: copy(input.reply.phrase), part: input.reply.part } : null };
}
function capture(music) {
  const hits = music.strikes.length ? music.strikes : [0, 2, 3, 1].map((tone, i) => ({ tone, tick: i * 90, id: 0, midi: PENTATONIC[tone] }));
  const tones = hits.map(hit => hit.tone), span = hits.at(-1).tick - hits[0].tick;
  const gap = hits.length > 1 ? span / (hits.length - 1) : 60;
  // 120 physics ticks/second, 45 ticks/eighth note. Compress only long flights.
  // Reserve a distinct slot for every hit, keeping order even in dense clusters.
  const divisor = Math.max(45, span / 15), steps = [];
  hits.forEach((hit, i) => steps.push(Math.min(16 - hits.length + i, Math.max(i ? steps[i - 1] + 1 : 0, Math.round((hit.tick - hits[0].tick) / divisor)))));
  return { tones, rhythm: gap < 40 ? 0 : gap < 90 ? 1 : 2, steps, ids: hits.map(hit => hit.id), pitches: hits.map(hit => hit.midi) };
}
// Read-only view of the same quantization used when a shot finishes.
export function musicPhrasePreview(music) { return music.strikes.length ? capture(music) : null; }
function learn(music, tones) {
  if (music.theme.length) return;
  music.theme = Array.from({ length: 4 }, (_, index) => tones[index % tones.length]);
  if (new Set(music.theme).size === 1) { music.theme[2] = (music.theme[0] + 2) % 5; music.theme[3] = (music.theme[0] + 1) % 5; }
}
function hookSet(music, phrase) {
  music.hook = phraseCopy(phrase);
  music.theme = Array.from({ length: 4 }, (_, i) => phrase.tones[i % phrase.tones.length]);
}
export function musicLaunch(music) { music.plucks++; music.strikes = []; }
export function musicStrike(music, tone, tick, chain, id = 0, midi = PENTATONIC[tone], speed = 400, pan = 0) {
  if (chain === 1) music.strikes = [];
  if (!tonesValid([tone], 1, 1) || music.strikes.length >= 16) return;
  music.intensity[id]=Math.max(0,Math.min(1,(Number.isFinite(speed)?speed:400)/1000));
  music.pans[id]=Number.isFinite(pan)?Math.max(-1,Math.min(1,pan)):0;
  music.strikes.push({ tone, tick: Math.max(music.strikes.at(-1)?.tick ?? 0, countValid(tick) ? tick : 0), id: idValid(id) ? id : 0, midi: pitchValid(midi) ? midi : PENTATONIC[tone] });
}
export function musicFinish(music) {
  if (music.strikes.length) {
    const motif = capture(music); music.motifs.push(motif); music.motifs = music.motifs.slice(-4);
    const hadHook=!!music.hook;
    if(!hadHook && motif.tones.length>=3) {hookSet(music,motif);music.evolution.nextBar=Math.ceil(music.bar/2)*2+8;}
    for(const role of Object.keys(JELLY_ROLES)) {
      const hits=music.strikes.filter(hit=>hit.id>0&&jellyRole(hit.id)===role);
      if(hits.length) {
        const phrase=capture({...music,strikes:hits});
        if(role==='melody') {music.parts.melody=phrase;if(hadHook)music.evolution.pending=phrase;}
        else music.pendingParts[role]=phrase;
      }
    }
    music.reply = { phrase: phraseCopy(motif), part: 0 };
  }
  music.strikes = [];
}
// Change one bar of the two-bar hook, preserving every event in the other bar.
function hookDevelop(music) {
  const {half,pending}=music.evolution;if(!music.hook||!pending)return;
  const events=music.hook.steps.flatMap((step,i)=>Math.floor(step/8)===half?[]:[{step,tone:music.hook.tones[i],id:music.hook.ids[i],pitch:music.hook.pitches[i]}]);
  const count=Math.min(7,14-events.length,pending.tones.length),span=Math.max(1,pending.steps[count-1]);let previous=-1;
  for(let i=0;i<count;i++) {
    const step=Math.min(8-count+i,Math.max(previous+1,Math.round(pending.steps[i]/span*7)));previous=step;
    events.push({step:half*8+step,tone:pending.tones[i],id:pending.ids[i],pitch:pending.pitches[i]});
  }
  events.sort((a,b)=>a.step-b.step);
  hookSet(music,{rhythm:music.hook.rhythm,tones:events.map(e=>e.tone),steps:events.map(e=>e.step),ids:events.map(e=>e.id),pitches:events.map(e=>e.pitch)});
  music.evolution.half=1-half;music.evolution.pending=null;
}
// One clock transition shared by live audio and offline highlights.
export function musicNextBar(music,flow=0,previous=67) {
  const bar=music.bar;
  if(music.run){music.run.section=music.run.pending;music.palette=trackGet(music.run.track).palette;}
  if(bar%2===0) {
    for(const role of ['bass','rhythm'])if(music.pendingParts[role]){music.parts[role]=music.pendingParts[role];music.pendingParts[role]=null;}
    if(music.hook&&bar>=music.evolution.nextBar){hookDevelop(music);music.evolution.nextBar=bar+8;}
  }
  const score=musicComposeBar(music,bar,flow,previous);
  if(music.run?.section===5&&!music.run.cadenceDone)music.run.cadenceDone=true;
  score.replyBars=music.reply?2-music.reply.part:0;
  if(music.reply&&++music.reply.part===2)music.reply=null;
  music.bar++;
  return score;
}
export function musicBloom(music) {
  const motif = capture(music); learn(music, motif.tones);
  const chord = [0, 3, 1, 0, 2][motif.tones.at(-1)];
  music.history.push({ ...motif, chord }); music.history = music.history.slice(-4);
  music.blooms++;
  if (music.blooms === 3) music.formStart = music.bar;
  return chord;
}
export function musicProgress(music) {
  let stage = music.blooms >= 3 ? 4 : music.blooms >= 2 || (music.plucks >= 6 && music.blooms >= 1) ? 3 : music.blooms >= 1 || (music.plucks >= 3 && music.theme.length === 4) ? 2 : music.plucks > 0 ? 1 : 0;
  if(music.run)stage=Math.min(stage,[2,3,3,2,4,4][music.run.section]);
  return { stage, name: ['Quiet pool', 'First ripples', 'Melody', 'Groove', 'Full song'][stage], next: ['Pluck to wake the song', 'A bloom or three plucks grows your melody', 'More plucks and blooms add a groove', 'Three blooms brings the full song', 'Keep plucking to write new variations'][stage] };
}
const TRIADS = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
const VOICINGS = [[60, 64, 67], [57, 60, 64], [57, 60, 65], [59, 62, 67]];
const BASS = [48, 45, 41, 43], SCALE = [60, 62, 64, 65, 67, 69, 71, 72, 74];
const PENTATONIC = [60, 62, 64, 67, 69];
const RHYTHMS = [[0, .5, 2, 3], [0, 1, 1.5, 3], [0, 1.5, 2.5, 3.5]];
const FORM = ['Chorus', 'Chorus', 'Verse', 'Build', 'Chorus', 'Breakdown', 'Build', 'Chorus'];
function chordPitch(chord, target, low = 60, high = 74) {
  return TRIADS[chord].flatMap(midi => [midi - 12, midi, midi + 12, midi + 24]).filter(midi => midi >= low && midi <= high).sort((a, b) => Math.abs(a - target) - Math.abs(b - target) || a - b)[0];
}
function contour(tones) {
  // Keep the player's direction changes, but balance large jumps with shorter steps.
  let position = SCALE.indexOf(PENTATONIC[tones[0]]);
  const notes = [SCALE[position]];
  for (let i = 1; i < 4; i++) {
    const delta = tones[i % tones.length] - tones[(i - 1) % tones.length];
    position = Math.max(0, Math.min(7, position + Math.max(-2, Math.min(2, delta))));
    notes.push(SCALE[position]);
  }
  return notes;
}
export function musicCompose(music, passage = 0, flow = 0, previous = 67, barStart = passage*4+music.formStart) {
  const { stage } = musicProgress(music), cycle = Math.floor(passage / FORM.length);
  const section = stage === 4 ? FORM[passage % FORM.length] : ['Quiet pool', 'First ripples', 'Theme', 'Growing'][stage];
  const chorus = section === 'Chorus', breakdown = section === 'Breakdown', build = section === 'Build';
  const events = [], motion = Math.max(0, Math.min(1, Number.isFinite(flow) ? flow : 0));
  const memories = music.history.length ? music.history : [{ chord: 0, tones: [0, 2, 3, 1], rhythm: 1 }];
  const newest = memories.at(-1), motif = music.motifs.length ? music.motifs[(passage + cycle) % music.motifs.length] : newest;
  const theme = music.theme.length ? music.theme : music.strikes.length ? capture(music).tones : [0, 2, 3, 1];
  const hook = contour(theme), answer = contour(motif.tones);
  const rhythm = RHYTHMS[(chorus ? memories[0] : motif).rhythm];
  const add = (at, midi, duration, level, role, pan = 0, attack = .025) => events.push({ at, midi, duration, level, role, pan, attack });
  for (let bar = 0; bar < 4; bar++) {
    const at = bar * BAR_SECONDS;
    let chord = stage < 2 ? newest.chord : memories[(bar + (chorus ? 0 : cycle)) % memories.length].chord;
    // Turnarounds and resolution give the learned chords a destination.
    if (stage >= 2 && bar === 3) chord = chorus || passage % 2 ? 0 : 3;
    if (stage >= 3 && bar === 2 && (chorus || build)) chord = 3;
    events.push({ at, chord });
    if (stage === 0) { if (bar % 2 === 0) add(at, chordPitch(chord, bar ? 67 : 64), 2.8, .014, 'air', bar ? .2 : -.2, .6); continue; }
    if (stage === 1) {
      add(at, VOICINGS[chord][0], .8, .018, 'pulse', -.15);
      if (!music.hook && bar % 2 === 0) hook.slice(0, 2).forEach((midi, i) => add(at + i * 1.5, chordPitch(chord, midi), 1.5, .028, 'spark', .15, .06));
      if(!music.hook)continue;
    }
    const density = breakdown ? .55 : chorus ? 1 : .78;
    if (stage>=2 && (!breakdown || bar % 2 === 0)) add(at, BASS[chord], 1.9, .04 * density, 'bass', -.12);
    if (stage >= 3 && !breakdown) add(at + 1.5, BASS[chord] + (chorus && bar % 2 ? 7 : 0), .9, .026, 'bass', -.12);
    for (const beat of stage<2?[]:breakdown ? [2] : chorus ? [.5, 2, 3.5] : [1, 3]) add(at + beat * BEAT_SECONDS, VOICINGS[chord][(bar + Math.floor(beat) + cycle) % 3], 1.15, .022 * density + motion * .003, 'accompaniment', -.3);
    if (music.hook) {
      const phrase = music.hook;
      const part = (barStart+bar) % 2;
      for (const [i, step] of phrase.steps.entries()) {
        if (Math.floor(step / 8) !== part || (breakdown && i % 2)) continue;
        let midi = phrase.pitches[i];
        if (step % 4 === 0) midi = chordPitch(chord, midi, 48, 84);
        if (bar === 3 && i === phrase.steps.length - 1) midi = chord === 0 ? 60 : 62;
        const duration = Math.min(1.6, ((phrase.steps[i + 1] ?? 16) - step) * .375 + .12);
        events.push({ at: at + (step % 8) * .375, midi, duration, level: (stage === 1 ? .032 : stage === 2 ? .064 : .092) * density, role: 'lead', pan: .1, attack: .018, sourceId: phrase.ids[i], step, phraseIndex: i });
        previous = midi;
      }
    } else {
    let line = bar % 2 === 0 ? [...hook] : [...answer];
    if (chorus && bar === 1) line = [...hook].reverse();
    if ((build || (chorus && bar === 2)) && bar >= 2) line = line.map(midi => SCALE[Math.min(8, SCALE.indexOf(midi) + 1)]);
    // Later verses develop one part of a learned answer; the chorus retains its hook.
    if (!chorus && cycle % 3 === 1 && bar === 1) line = [...line.slice(1), line[0]];
    if (!chorus && cycle % 3 === 2 && bar === 1) line.reverse();
    const count = breakdown ? 2 : stage === 2 && bar % 2 ? 3 : 4;
    for (let i = 0; i < count; i++) {
      const beat = breakdown ? i * 2 : rhythm[i];
      let midi = i === 0 || beat === 2 ? chordPitch(chord, line[i]) : line[i];
      if (bar === 3 && i === count - 1) midi = chord === 0 ? 60 : 62;
      const duration = Math.min(1.6, ((breakdown ? 2 : (rhythm[i + 1] ?? 4) - beat) * BEAT_SECONDS) + .2);
      add(at + beat * BEAT_SECONDS, midi, duration, (stage === 2 ? .064 : .092) * density * (i ? .86 : 1), 'lead', .1, .018); previous = midi;
    }
    }
    if (stage >= 3 && !breakdown) {
      // Soft kick and rim establish a groove; offbeat shakers arrive with the chorus.
      for (const beat of [0, 2]) add(at + beat * BEAT_SECONDS, 0, .22, chorus ? .055 : .035, 'kick');
      for (const beat of [1, 3]) add(at + beat * BEAT_SECONDS, 0, .09, chorus ? .022 : .014, 'rim', .12);
      if (chorus || build) for (const beat of chorus ? [.5, 1.5, 2.5, 3.5] : [1.5, 3.5]) add(at + beat * BEAT_SECONDS, 0, .07, .014, 'shaker', -.25);
    }
    if (stage === 4 && chorus && bar % 2 === 1) add(at + 2.25, chordPitch(chord, answer[(bar + cycle) % 4] - 5, 55, 72), .7, .032, 'answer', .35, .06);
    if (stage === 4 && build && bar === 3) add(at + 2.625, 0, .09, .018, 'rim', -.1);
  }
  return { events: events.sort((a, b) => a.at - b.at), duration: PASSAGE_SECONDS, nextPitch: previous, section, stage };
}
export function musicComposeBar(music, bar = music.bar, flow = 0, previous = 67) {
  const position = Math.max(0, bar - music.formStart), offset = position % 4 * BAR_SECONDS;
  const score = musicCompose(music, Math.floor(position / 4), flow, previous, bar-position%4);
  let events = score.events.filter(event => event.at >= offset && event.at < offset + BAR_SECONDS).map(event => ({ ...event, at: event.at - offset }));
  if (music.reply) {
    const { phrase, part } = music.reply;
    // Give the player's answer the foreground; do not pile another tune on top.
    events = events.filter(event => !['lead', 'spark', 'answer'].includes(event.role));
    for (const [i, step] of phrase.steps.entries()) if (Math.floor(step / 8) === part) {
      events.push({ at: (step % 8) * .375, midi: phrase.pitches[i], duration: Math.min(1.6, ((phrase.steps[i + 1] ?? 16) - step) * .375 + .12), level: score.stage < 2 ? .045 : .08, role: 'lead', pan: .1, attack: .025, sourceId: phrase.ids[i], step, phraseIndex: i, reply: true });
    }
  }
  const chord=events.find(event=>event.chord!==undefined)?.chord??0;
  for(const role of ['bass','rhythm']) {
    const phrase=music.parts?.[role];if(!phrase||score.stage<(role==='bass'?2:3))continue;
    const kinds=role==='bass'?['bass']:['kick','rim','shaker']; events=events.filter(e=>!kinds.includes(e.role));
    for(const [i,step] of phrase.steps.entries()) if(Math.floor(step/8)===bar%2) {
      events.push({at:(step%8)*.375,midi:role==='bass'?chordPitch(chord,phrase.pitches[i]-24,36,55):0,duration:role==='bass'?.8:.12,level:role==='bass'?.042:.032,role:role==='bass'?'bass':i%2?'rim':'kick',pan:role==='bass'?-.12:.12,attack:.025,sourceId:phrase.ids[i],step});
    }
  }
  const accent=music.accentStart>=0?bar-music.accentStart:-1;
  let section=score.section;
  if(accent===0) {section='Earned fill';for(let i=0;i<3;i++)events.push({at:1.875+i*.375,midi:0,duration:.10,level:.025,role:'rim',pan:(i-1)*.2,attack:.005});}
  if(accent===1) {section='Breathing room';events=events.filter(e=>!['accompaniment','shaker','answer'].includes(e.role)).map(e=>e.level?{...e,level:e.level*.7}:e);}
  if(accent===2) {section='Return';events.push({at:0,midi:chordPitch(chord,72),duration:1.2,level:.045,role:'answer',pan:0,attack:.05});}
  if(music.run){
    const {track,section:pool,cadenceDone}=music.run;
    if(pool===3){section='Bridge · breathing room';events=events.filter(e=>!['shaker','answer','rim'].includes(e.role)).map(e=>({...e,level:(e.level||0)*.72}));}
    if(track==='crosscurrent')events=events.map(e=>e.role==='accompaniment'?{...e,at:Math.min(2.85,e.at+.1875)}:e);
    if(track==='glasswater')events=events.filter(e=>e.role!=='shaker'&&(e.role!=='accompaniment'||bar%2===0)).map(e=>({...e,duration:Math.min(e.duration,1.2),attack:.012}));
    if(track==='afterimage'&&bar%2===1)events=events.filter(e=>e.role!=='accompaniment').map(e=>e.role==='lead'?{...e,role:'answer',level:e.level*.7,pan:-(e.pan||0)}:e);
    if(pool===5&&!cadenceDone){section='Song complete';events=events.filter(e=>!['lead','answer','accompaniment','kick','rim','shaker'].includes(e.role));for(const [i,midi] of [67,64,60].entries())events.push({at:i*.75,midi,duration:1.5,level:.045,role:'lead',pan:0,attack:.04});}
  }
  events=events.map(e=>{
    if(!e.level)return e;
    const force=music.intensity?.[e.sourceId]??.45, ending=e.at>2.2?.83:1;
    return {...e,pan:e.sourceId>0?music.pans?.[e.sourceId]??0:e.pan,level:e.level*(.78+force*.38)*ending,attack:Math.max(.006,(e.attack??.025)*(1.3-force*.65)),duration:e.duration*(.94+force*.12),brightness:.7+force*.6,palette:music.palette};
  });
  return { ...score, section, phrase: music.reply?.phrase ?? music.hook, events: events.sort((a, b) => a.at - b.at), duration: BAR_SECONDS, isReply: !!music.reply, nextPitch: events.filter(event => event.role === 'lead').at(-1)?.midi ?? previous };
}

// A requested section enters at the next scheduled bar; the hook and clock survive.
export function musicRunSection(music,section,track){
  if(!trackGet(track)||!Number.isInteger(section)||section<0||section>5)throw new TypeError('Invalid musical section');
  music.run??={track,section:0,pending:0,cadenceDone:false};
  music.run.track=track;music.run.pending=section;
  return music;
}
