// Melody Trials owns musical goals and cues; trial.js owns physical integration.
export const MELODY_RULES=Object.freeze({
  '081':{name:'Melody Route',shots:12,goal:'Play the displayed notes in order. Wrong notes sound but do not advance the phrase.'},
  '082':{name:'Rhythm Gates',shots:12,goal:'Cross each numbered gate while the beat window is open. Use Timing Offset to calibrate the visible beat, or compare Untimed in Settings.'},
  '083':{name:'Call and Response',shots:12,goal:'Watch and hear the call, then reproduce it. Replay Call is always available and never spends a shot.'},
  '084':{name:'Harmony Builder',shots:18,goal:'Collect every note in the current chord, in any order. Complete all three displayed chords. Other notes do not fill a chord.'},
  '085':{name:'Instrument Rescue',shots:18,goal:'Push Melody, Bass and Rhythm cargo into their matching stages. All three parts are required; a wrong stage does not accept cargo.'},
  '086':{name:'Silence Puzzle',shots:12,goal:'Play each green note without touching a red sound bubble. One forbidden contact ends the attempt.'},
  '087':{name:'Crescendo Run',shots:18,goal:'Build two chains of at least three different notes, then stop completely inside the quiet finish. A single repeated note cannot build intensity.'},
  '088':{name:'Counterpoint',shots:18,goal:'Alternate the Upper and Lower seeds after every shot. Complete each voice’s displayed phrase. Touching the other voice’s notes fails.'},
  '089':{name:'Phrase Repair',shots:12,goal:'Repair each highlighted missing or incorrect note by playing its requested replacement. Correct existing notes are kept.'},
  '090':{name:'Free Composition',shots:4096,goal:'Play a song using your chosen pitch palette. There is no losing condition. At rest, Save Composition finishes and stores your song in the Song Library and this setup’s notebook.'}
});
const notes=['C','D','E','F','G','A','B'],midi=[60,62,64,65,67,69,71];
const rule=g=>g.setup.experimentId;
const body=(id,kind,x,y,r,label,extra={})=>({id,kind,x,y,r,label,vx:0,vy:0,hp:1,active:true,fixed:kind!=='player'&&kind!=='instrument',...extra});
const rect=(x,y,w,h)=>({x,y,w,h,active:true,breakable:false});
const contains=(b,z)=>b.x-b.r>=z.x&&b.x+b.r<=z.x+z.w&&b.y-b.r>=z.y&&b.y+b.r<=z.y+z.h;
const phrase=n=>n===0?[0,2,4]:n===1?[0,2,1,4]:[0,2,4,1,5,4];
const repairs=n=>n===0?[2,4]:n===1?[1,5,4]:[2,1,5,4];
export const melodyPlayer=g=>g.bodies[g.melody?.voice??0];
export function melodyCreate(g){
  const n=g.layout,r=rule(g);
  g.bodies=[body(0,'player',100,300,16,'')];g.walls=[];g.receiver=null;g.current=null;
  g.melody={clock:0,progress:0,chord:0,collected:[],heard:[],chains:0,voice:0,lines:[0,0],failed:'',preview:r==='083'?1:0,finished:false,delivered:[]};
  const add=(kind,x,y,r,label,extra)=>g.bodies.push(body(g.bodies.length,kind,x,y,r,label,extra));
  if(r==='085'){
    for(let i=0;i<3;i++)add('instrument',280+n*20,140+i*160,22,['Melody','Bass','Rhythm'][i],{role:i});
    if(n>0)g.walls.push(rect(440,205,22,30),rect(440,365,22,30));
    if(n===2)g.walls.push(rect(580,50,20,70),rect(580,480,20,70));
  }else if(r==='088'){
    g.bodies[0].y=150;add('player',100,450,16,'Lower');
    for(let voice=0;voice<2;voice++)for(let i=0;i<3;i++)add('music-note',300+i*180,150+voice*300+(n?((i%2?1:-1)*n*25):0),26-n*3,notes[[0,2,4][i]]+(voice?' ↓':' ↑'),{pitch:[0,2,4][i],role:voice});
    g.walls.push(rect(180,290,630,20));
  }else{
    // Three common musical spaces: open keys, staggered voices, then a stage
    // divided by cover. Challenges change goals inside these three levels.
    const positions=n===0?[[280,180],[460,180],[640,180],[760,300],[640,420],[460,420],[280,420]]:n===1?[[280,130],[480,180],[710,120],[770,330],[650,470],[430,420],[240,470]]:[[250,100],[480,150],[740,90],[780,350],[670,500],[430,450],[220,500]];
    let pitches=r==='086'||r==='082'?[0,2,4]:r==='090'?(g.setup.settings.palette===1?[1,2,4,5,6]:[0,1,2,4,5]):[0,1,2,3,4,5,6];
    for(const pitch of pitches){const [x,y]=positions[pitch];add(r==='082'?'beat-gate':'music-note',x,y,30-n*3,r==='082'?String(pitches.indexOf(pitch)+1):notes[pitch],{pitch,role:0});}
    if(n>0)g.walls.push(rect(390,245,160,20));
    if(n===2)g.walls.push(rect(580,310,22,130));
    if(r==='086'){add('sound-hazard',460,300,38+n*8,'SOUND');if(n>0)add('sound-hazard',620,280,30,'SOUND');}
    if(r==='087')g.receiver={x:40,y:245,w:140,h:110};
  }
  g.nextId=g.bodies.length;
}
export function melodyStages(g){return [0,1,2].map(i=>({x:730,y:80+i*160,w:150,h:120,role:i,label:['Melody','Bass','Rhythm'][i]}));}
export function melodyBeat(g){const period=120,phase=(g.melody.clock+g.setup.settings.offset+period)%period;return {phase,open:g.setup.settings.timing===0||phase<24||phase>=108};}
function emit(g,b,cue=false){g.events.push({type:cue?'music-cue':'note',id:rule(g)==='088'?[0,2,4].indexOf(b.pitch)*3+1+b.role:b.id,x:b.x,y:b.y,tone:b.pitch%5,midi:midi[b.pitch]-(b.role===1&&rule(g)==='088'?12:0),chain:g.hit.length,speed:450,tick:g.tick});}
export function melodyClock(g){
  const m=g.melody;m.clock=(m.clock+1)%480;
  if(m.preview){const seq=phrase(g.layout),index=Math.floor((m.preview-1)/72);if((m.preview-1)%72===0){const b=g.bodies.find(b=>b.pitch===seq[index]);if(b)emit(g,b,true);}m.preview++;if(m.preview>seq.length*72)m.preview=0;}
}
export function melodyLaunch(g){return !g.melody.preview;}
export function melodyTouch(g,a,b){
  const m=g.melody,r=rule(g);if(a.id!==m.voice||b.kind==='player'||b.kind==='instrument')return;
  if(b.kind==='sound-hazard'){m.failed='A forbidden sound bubble was touched.';return;}
  if(g.hit.includes(b.id))return;g.hit.push(b.id);emit(g,b);m.heard.push(b.pitch);m.heard=m.heard.slice(-64);
  if(r==='081'||r==='083'){if(b.pitch===phrase(g.layout)[m.progress])m.progress++;}
  if(r==='082'&&b.id===m.progress+1&&melodyBeat(g).open){m.progress++;b.active=false;}
  if(r==='084'){const chord=[[0,2,4],[1,3,5],[4,6,1]][m.chord];if(chord?.includes(b.pitch)&&!m.collected.includes(b.pitch)){m.collected.push(b.pitch);if(m.collected.length===3){m.chord++;m.collected=[];}}}
  if(r==='086'){b.active=false;m.progress++;}
  if(r==='088'){if(b.role!==m.voice){m.failed='The other voice’s note was touched.';return;}if(b.pitch===[0,2,4][m.lines[m.voice]])m.lines[m.voice]++;}
  if(r==='089'&&b.pitch===repairs(g.layout)[m.progress])m.progress++;
}
export function melodyDestinations(g){
  if(rule(g)!=='085')return;
  for(const b of g.bodies)if(b.kind==='instrument'&&b.active&&contains(b,melodyStages(g)[b.role])){b.active=false;b.vx=b.vy=0;g.melody.delivered.push(b.role);g.delivered++;g.hit.push(b.id);g.melody.heard.push([2,0,4][b.role]);g.events.push({type:'note',id:b.role+1,x:b.x,y:b.y,tone:b.role,midi:[64,48,67][b.role],chain:g.hit.length,speed:450,tick:g.tick});g.events.push({type:'objective',id:b.id,x:b.x,y:b.y,tick:g.tick});}
}
export function melodySettle(g){
  const m=g.melody;if(rule(g)==='087'&&new Set(g.hit.map(id=>g.bodies.find(b=>b.id===id)?.pitch).filter(Number.isInteger)).size>=3)m.chains=Math.min(2,m.chains+1);
  if(rule(g)==='088')m.voice=1-m.voice;
}
export function melodyOutcome(g){
  const m=g.melody,r=rule(g);if(m.failed)return ['lost',m.failed];
  const success=r==='081'||r==='083'?m.progress===phrase(g.layout).length:r==='082'||r==='086'?m.progress===3:r==='084'?m.chord===3:r==='085'?m.delivered.length===3:r==='087'?m.chains===2&&contains(g.bodies[0],g.receiver):r==='088'?m.lines.every(n=>n===3):r==='089'?m.progress===[2,3,4][g.layout]:m.finished;
  if(success)return ['won',r==='090'?'Composition saved to the Song Library and this setup’s notebook.':'The musical objective is complete.'];
  if(r!=='090'&&g.shots>=g.setup.settings.shots)return ['lost','The shot budget ran out before the arrangement was complete.'];
  return null;
}
export function melodyAction(g,action){
  if(g.mode!=='music'||g.phase!=='aim')return false;
  if(action==='preview'&&rule(g)==='083'){g.melody.preview=1;return true;}
  if(action==='finish'&&rule(g)==='090'&&g.melody.heard.length){g.melody.finished=true;g.phase='won';g.reason=melodyOutcome(g)[1];g.earning.wins=1;return true;}
  return false;
}
export function melodyStatus(g){
  const m=g.melody,r=rule(g),sequence=phrase(g.layout).map((p,i)=>`${i<m.progress?'✓ ':''}${notes[p]}`).join(' → ');
  if(r==='081')return sequence;
  if(r==='083')return m.preview?'Listen and watch the highlighted notes…':`${m.progress}/${phrase(g.layout).length} notes answered · Replay Call to hear it again`;
  if(r==='082')return `${m.progress}/3 gates · ${g.setup.settings.timing?'Timed':'Untimed'} · Offset ${g.setup.settings.offset/120} seconds`;
  if(r==='084')return m.chord===3?'Three chords complete':`${['C major','D minor','G major'][m.chord]}: ${[[0,2,4],[1,3,5],[4,6,1]][m.chord].map(p=>(m.collected.includes(p)?'✓ ':'')+notes[p]).join(' + ')} · ${m.chord}/3 chords`;
  if(r==='085')return `${m.delivered.length}/3 instruments delivered`;
  if(r==='086')return `${m.progress}/3 quiet-route notes · Avoid SOUND`;
  if(r==='087')return `Intensity ${m.chains}/2 · Build varied chains, then finish in the quiet zone`;
  if(r==='088')return `${m.voice?'Lower':'Upper'} voice to launch · Upper ${m.lines[0]}/3 · Lower ${m.lines[1]}/3 · Each plays C → E → G`;
  if(r==='089')return `${['Original: C _ G _','Original: C E F(wrong) _ _','Original: C _ G F(wrong) _ _'][g.layout]} · Replace in order: ${repairs(g.layout).map((p,i)=>(i<m.progress?'✓ ':i===m.progress?'[ ':'')+notes[p]+(i===m.progress?' ]':'')).join(' → ')}`;
  if(m.finished)return 'Composition kept in Saved Songs';
  if(g.shots>=g.setup.settings.shots)return 'Composition capacity reached · Save Composition to finish';
  return `${m.heard.length} recent notes · ${g.setup.settings.palette?'D E G A B':'C D E G A'} palette · Save Composition when ready`;
}
export function melodyDraw(g,ctx){
  const m=g.melody,r=rule(g);
  if(r==='085')for(const z of melodyStages(g)){ctx.fillStyle=['#eb9bcd33','#83d7f433','#f2d27933'][z.role];ctx.strokeStyle=['#eb9bcd','#83d7f4','#f2d279'][z.role];ctx.beginPath();ctx.roundRect(z.x,z.y,z.w,z.h,15);ctx.fill();ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.font='bold 18px sans-serif';ctx.fillText(z.label,z.x+12,z.y+28);}
  if(r==='082'){const beat=melodyBeat(g);ctx.fillStyle=beat.open?'#9ff5df':'#eb9bcd';ctx.font='bold 20px sans-serif';ctx.fillText(beat.open?'BEAT WINDOW OPEN':'WAIT FOR THE BEAT',270,36);ctx.fillStyle='#ffffff22';ctx.beginPath();ctx.roundRect(270,46,360,10,5);ctx.fill();ctx.fillStyle=beat.open?'#9ff5df':'#eb9bcd';ctx.beginPath();ctx.arc(270+beat.phase*3,51,8,0,Math.PI*2);ctx.fill();}
  if(m.preview){const pitch=phrase(g.layout)[Math.floor((m.preview-1)/72)],b=g.bodies.find(b=>b.pitch===pitch);if(b){ctx.strokeStyle='#fff4c4';ctx.lineWidth=8;ctx.beginPath();ctx.arc(b.x,b.y,b.r+12,0,Math.PI*2);ctx.stroke();ctx.font='bold 28px sans-serif';ctx.fillStyle='#fff4c4';ctx.fillText(`CALL: ${notes[pitch]}`,360,42);}}
}
export function melodyValid(g,base){
  const m=g.melody;if(!m||!['clock','progress','chord','chains','voice','preview'].every(k=>Number.isInteger(m[k])&&m[k]>=0)||m.clock>=480||m.progress>6||m.chord>3||m.chains>2||m.voice>1||m.preview>phrase(g.layout).length*72||typeof m.finished!=='boolean'||!['','A forbidden sound bubble was touched.','The other voice’s note was touched.'].includes(m.failed))return false;
  const list=(a,max,cap)=>Array.isArray(a)&&a.length<=cap&&a.every(n=>Number.isInteger(n)&&n>=0&&n<=max);
  if(!list(m.collected,6,3)||new Set(m.collected).size!==m.collected.length||!list(m.heard,6,64)||!list(m.lines,3,2)||m.lines.length!==2||!list(m.delivered,2,3)||new Set(m.delivered).size!==m.delivered.length)return false;
  if(rule(g)!=='088'&&m.voice!==0||rule(g)!=='083'&&m.preview!==0||rule(g)!=='090'&&m.finished||g.delivered!==m.delivered.length)return false;
  const r=rule(g),limit=r==='081'||r==='083'?phrase(g.layout).length:r==='082'||r==='086'?3:r==='089'?repairs(g.layout).length:0;
  if(m.preview&&g.phase==='flight'||m.progress>limit||r!=='084'&&(m.chord||m.collected.length)||r!=='087'&&m.chains||r!=='088'&&m.lines.some(Boolean)||r!=='085'&&m.delivered.length||m.finished&&(!m.heard.length||g.phase!=='won')||g.shots===0&&m.heard.length)return false;
  if(m.failed&&(r==='086'?m.failed!=='A forbidden sound bubble was touched.':r==='088'?m.failed!=='The other voice’s note was touched.':true))return false;
  if(r==='084'&&m.collected.some(p=>![[0,2,4],[1,3,5],[4,6,1]][m.chord]?.includes(p)))return false;
  if(r==='086'&&m.progress!==g.bodies.filter(b=>b.kind==='music-note'&&!b.active).length)return false;
  return g.bodies.length===base.bodies.length&&g.bodies.every((b,i)=>['label','pitch','role'].every(k=>b[k]===base.bodies[i][k])&&(!b.fixed||b.x===base.bodies[i].x&&b.y===base.bodies[i].y)&&
    (b.kind==='instrument'?b.active===!m.delivered.includes(b.role):r==='082'&&b.kind==='beat-gate'?b.active===(b.id>m.progress):r==='086'&&b.kind==='music-note'?true:b.active));
}
