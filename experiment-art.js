import { EXPERIMENT_CATALOGUE } from './experiment-catalogue.js?v=46fd868b7899d3825edca249ee222d0822e27a53f260e03d7069491bca53ea1e';
import { EXPERIMENT_MODES, experimentMode } from './experiment-mode.js?v=8691672ebafa0ee909e0adfbe1058bb7a29634ac3aef011c8c8a34ad0b9eb1bf';

const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const circle=(x,y,r,c,fill=c+'22')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${c}" stroke-width="2.5"/>`;
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(12,w/3,h/3)}" fill="${c.slice(0,7)}22" stroke="${c}" stroke-width="2"/>`;
const line=(d,c,dash='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"${dash?' stroke-dasharray="'+dash+'"':''}/>`;
const text=(x,y,s,c,size=17)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" font-family="system-ui,sans-serif" font-weight="600" font-size="${size}">${escape(s)}</text>`;
function symbol(type,x,y,c,number){
  const core=circle(x,y,22,c);
  if(type==='cell')return core+line(`M${x-8} ${y}h16 M${x} ${y-8}v16`,c);
  if(type==='source')return core+circle(x,y,30,c,'none')+line(`M${x-7} ${y+5}l7 -12 7 12`,c);
  if(type==='cargo')return core+box(x-9,y-9,18,18,c);
  if(type==='note')return core+line(`M${x+4} ${y+6}v-18l9 -2`,c)+circle(x-1,y+8,5,c,c);
  if(type==='lock')return box(x-20,y-14,40,34,c)+line(`M${x-10} ${y-14}v-7a10 10 0 0 1 20 0v7`,c);
  if(type==='blast')return core+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return line(`M${x+Math.cos(a)*10} ${y+Math.sin(a)*10}L${x+Math.cos(a)*30} ${y+Math.sin(a)*30}`,c);}).join('');
  if(type==='seed')return circle(x,y,15,'#fff3c9','#fff3c9')+circle(x-4,y-4,4,'#ffffff','#ffffff');
  if(type==='keeper')return core+line(`M${x-8} ${y-8}l16 16 M${x+8} ${y-8}l-16 16`,c);
  if(type==='gate')return box(x-15,y-29,30,58,c)+line(`M${x-7} ${y}h14`,c);
  return core+text(x,y+6,number??'•',c);
}
// Each idea's two focal symbols are authored, not selected by arbitrary hash.
const motifs=[
  'target target','target gate','target target','target target','target keeper','source source','gate gate','gate target','target gate','gate keeper',
  'blast gate','blast cargo','blast target','target target','source target','source gate','source target','blast cell','blast keeper','blast cell',
  'cargo cargo','cargo cell','cargo gate','cargo target','cargo gate','cargo cargo','cargo target','cargo gate','lock cell','cargo blast',
  'keeper cell','source cell','source gate','cell target','gate cell','source gate','lock source','target cell','source target','cell cell',
  'source cell','gate keeper','source gate','target keeper','blast source','gate keeper','gate keeper','keeper target','source target','gate target',
  'gate target','source cargo','gate gate','source gate','target gate','gate target','gate cargo','source cargo','gate gate','cargo gate',
  'target target','target source','target target','target keeper','target source','target gate','keeper target','target target','keeper gate','target source',
  'source source','source target','source source','lock source','source target','source keeper','source gate','keeper source','cell source','source target',
  'note note','gate note','note note','note note','cargo note','note keeper','note gate','note note','note target','note source',
  'target keeper','target gate','target source','cargo target','lock target','target target','lock gate','blast target','lock source','source cargo',
  'cell cell','cell gate','cell gate','cargo cell','cell cell','cell gate','source cell','cell cargo','source gate','cell cell',
  'gate gate','keeper target','lock cargo','target gate','cargo gate','lock gate','cell gate','source gate','keeper keeper','blast cargo',
  'seed seed','target target','target keeper','cargo gate','seed gate','seed keeper','target gate','seed target','target gate','note cargo',
  'seed target','seed cargo','source source','gate cargo','seed seed','cell cell','cargo cargo','seed seed','note note','gate gate',
  'blast source','gate target','source source','target target','target target','cell cargo','blast target','target gate','seed target','source gate',
  'blast target','keeper cell','source cargo','source gate','cell lock','blast cargo','cell gate','keeper gate','cargo cargo','cargo gate',
  'cargo gate','cargo cargo','cell gate','blast cargo','keeper cell','source cargo','cell cell','cell keeper','cell blast','cargo cell',
  'blast target','source lock','source gate','source cargo','source gate','keeper blast','cargo source','source keeper','blast target','blast cell',
  'source cargo','cargo source','source gate','source source','source cargo','source cell','cargo keeper','source cell','source cargo','source gate',
  'cargo gate','gate cargo','blast gate','cargo gate','keeper cargo','blast target','cargo cargo','source cargo','gate source','cargo gate',
  'cargo cell','cargo gate','cargo cell','source cell','cargo gate','cell gate','cargo keeper','keeper cargo','cargo cell','cell cell'
];
function playableComposition(id,c){
  const seed=(x=70,y=175)=>symbol('seed',x,y,c),target=(x,y,label)=>circle(x,y,23,c)+text(x,y+6,label,c,17);
  const route=d=>line(d,c,'6 8'),note=(x,y,label)=>symbol('note',x,y,c)+text(x,y+47,label,c,14);
  if(id==='001')return seed()+route('M90 175L175 125 275 125 375 125')+[175,275,375].map((x,i)=>target(x,125,i+1)).join('')+text(265,202,'ONE SHOT',c);
  if(id==='002')return seed()+box(150,48,230,13,'#7295a3')+route('M90 175L220 65 350 172')+target(350,172,'1')+text(210,211,'BANK FIRST',c);
  if(id==='003')return seed()+[170,280,390].map((x,i)=>target(x,130,i+1)).join('')+circle(280,130,39,'#fff3c9','none')+route('M90 175L260 140')+text(280,67,'CALL 2',c);
  if(id==='004')return seed()+[150,230,310].map((x,i)=>target(x,120,'✓')).join('')+symbol('keeper',400,120,'#ff8b91')+text(270,195,'EXACTLY THREE',c);
  if(id==='005')return seed()+symbol('keeper',270,135,'#ff8b91')+[ [180,85],[370,85],[180,190],[370,190] ].map(([x,y],i)=>target(x,y,i+1)).join('')+route('M90 175L170 85H370V190H180');
  if(id==='006')return seed()+route('M90 175L170 110H380')+symbol('source',170,110,'#ffb56e')+circle(275,110,30,'#c4adff','none')+symbol('gate',380,110,'#83d7f4')+text(170,184,'COMET',c,13)+text(275,184,'WRAP',c,13)+text(380,184,'STASIS',c,13);
  if(id==='007')return route('M130 70H390V190H130V70')+[[130,70],[390,70],[390,190],[130,190]].map(([x,y],i)=>target(x,y,i+1)).join('')+box(225,105,70,55,'#a4f4cf')+seed(260,132);
  if(id==='008')return seed()+box(210,65,18,115,'#7295a3')+route('M90 175L160 65 290 80 380 170')+circle(380,170,33,'#a4f4cf','#163a33')+line('M380 170V93l35 16-35 10','#a4f4cf');
  if(id==='009')return seed()+target(180,100,'1')+target(280,110,'2')+route('M90 175L180 100 280 110 385 165')+box(340,130,90,70,'#a4f4cf')+circle(385,165,12,'#fff3c9','#fff3c9');
  if(id==='010')return seed()+box(150,45,18,100,'#ff8b91')+box(260,115,18,100,'#ff8b91')+box(370,45,18,100,'#ff8b91')+route('M90 175L195 175 230 75 330 75 335 175 420 175');
  if(id==='013')return seed()+[170,270,370].map((x,i)=>symbol('blast',x,125,c)+text(x,185,i+1,c)).join('')+text(270,65,'BLAST BUDGET',c,16);
  if(id==='030')return seed()+symbol('cargo',230,130,c)+circle(230,130,48,'#ff8b91','none')+box(370,75,65,125,'#a4f4cf')+text(235,205,'FRAGILE',c,15);
  if(id==='032')return seed()+symbol('source',230,100,c)+symbol('source',370,155,c)+text(230,161,'1 TURN',c,13)+text(370,211,'2 TURNS',c,13);
  if(id==='151')return seed()+symbol('cargo',190,125,c)+circle(190,125,38,'#fff3c9','none')+box(270,55,18,115,'#7295a3')+route('M190 165Q270 235 350 175')+symbol('blast',380,140,c);
  if(id==='081')return seed()+route('M90 175L175 105 280 125 390 90')+note(175,105,'C')+note(280,125,'E')+note(390,90,'G');
  if(id==='082')return seed()+line('M145 190H425','#7295a3')+[175,280,385].map((x,i)=>box(x-13,80,26,95,c)+circle(x,190,8,i===1?'#fff3c9':c)+text(x,64,i+1,c)).join('')+box(253,173,54,34,'#a4f4cf');
  if(id==='083')return text(115,80,'CALL',c,15)+text(115,185,'ANSWER',c,15)+[220,300,380].map((x,i)=>note(x,75,['C','E','G'][i])).join('')+[220,300,380].map(x=>target(x,181,'?')).join('');
  if(id==='084')return [170,280,390].map((x,i)=>[0,1,2].map((n)=>circle(x,80+n*45,15,c)+text(x,85+n*45,[['C','E','G'],['D','F','A'],['G','B','D']][i][n],c,14)).join('')+text(x,222,['C MAJOR','D MINOR','G MAJOR'][i],c,11)).join('');
  if(id==='085')return [75,130,185].map((y,i)=>symbol('cargo',150,y,['#eb9bcd','#83d7f4','#f2d279'][i])+route(`M180 ${y}H310`)+box(325,y-22,110,44,['#eb9bcd','#83d7f4','#f2d279'][i])+text(380,y+5,['MELODY','BASS','RHYTHM'][i],c,12)).join('');
  if(id==='086')return seed()+symbol('keeper',260,135,'#ff8b91')+note(180,80,'C')+note(375,95,'G')+route('M90 175L180 80Q270 30 375 95')+text(270,209,'KEEP IT QUIET',c,15);
  if(id==='087')return seed()+[150,210,270,330].map((x,i)=>box(x,180-i*30,25,30+i*30,c)).join('')+box(385,155,55,45,'#a4f4cf')+text(270,62,'CRESCENDO',c,17);
  if(id==='088')return line('M45 130H435','#7295a3','4 6')+seed(80,80)+seed(80,185)+[170,270,370].map((x,i)=>target(x,80,['C','E','G'][i])+target(x,185,['C','E','G'][i])).join('');
  if(id==='089')return [125,220,315,410].map((x,i)=>i===1||i===3?box(x-24,90,48,60,c)+text(x,130,'?',c,30):note(x,115,i===0?'C':'G')).join('')+line('M220 195v-35m-8 8 8-8 8 8',c)+text(310,207,'REPAIR',c,15);
  if(id==='090')return seed()+route('M90 175Q140 50 220 115T380 90')+note(180,100,'C')+note(280,150,'A')+note(385,85,'E')+box(350,185,85,30,'#a4f4cf')+text(392,206,'SAVE',c,12);
  return null;
}
function composition(mode,index,c){
  const featured=playableComposition(String(index).padStart(3,'0'),c);if(featured)return featured;
  const n=index%10,types=motifs[index-1]?.split(' ')??['target','target'];
  const a={x:225,y:102+(n%3)*15},b={x:360,y:126-(n%2)*25};
  let art='';
  if(['reaction','outbreak','producer'].includes(mode)){
    art+=line(`M98 164Q160 70 ${a.x} ${a.y}L${b.x} ${b.y}`,c,'5 9');
    art+=circle(a.x,a.y,58,c+'66','none')+symbol('cell',388,191,'#a4f4cf');
    art+=box(295,157,16,62,'#6a8997');
  }else if(['cargo','capture','engineer'].includes(mode)){
    art+=box(383,65,65,132,'#a4f4cf')+box(275,84,18,80,'#6a8997');
    art+=line(`M95 164Q152 209 238 189T385 167`,c,'6 9');
    if(mode==='capture')art+=circle(a.x,a.y,35,'#f3ce9b','none');
    if(mode==='engineer')art+=line('M120 80h45l-12 -8 M165 80l-12 8',c);
  }else if(['music','memory'].includes(mode)){
    for(let i=0;i<4;i++)art+=line(`M145 ${85+i*25}H435`,c+'33');
    art+=line(`M100 180Q200 50 300 175T435 105`,c,'3 9');
    if(mode==='memory')art+=text(190,74,'?','#fff3c9',28);
  }else if(['division','living'].includes(mode)){
    art+=line(`M100 153Q190 150 ${a.x} ${a.y} M${a.x} ${a.y}L355 70 M${a.x} ${a.y}L355 183`,c,'5 8');
    art+=circle(355,70,30,c)+circle(355,183,22,c)+text(355,76,'½',c)+text(355,189,'½',c);
  }else if(['versus','cooperation'].includes(mode)){
    art+=line('M255 55v155',c+'66','5 9')+symbol('seed',409,170,'#fff3c9');
    art+=line('M115 170Q240 225 400 170',c,mode==='cooperation'?'':'6 9');
    art+=text(90,83,'P1',c,15)+text(410,83,'P2','#f7b0cd',15);
  }else if(mode==='survival'){
    art+=box(155,53,293,161,'#fd859b')+line('M165 201L435 65','#fd859b66');
    art+=circle(397,65,22,c)+line('M397 51v14l10 6',c);
  }else if(mode==='journey'||mode==='power'){
    art+=line('M100 170L205 95 300 165 405 75',c,'5 8');
    art+=box(177,65,56,56,c)+box(275,138,52,52,c)+box(380,50,50,50,c);
  }else if(mode==='workshop'){
    for(let x=170;x<440;x+=45)art+=line(`M${x} 55v150`,c+'22');
    for(let y=55;y<215;y+=45)art+=line(`M150 ${y}h290`,c+'22');
    art+=line('M110 175L177 108l14 14 -67 67Z',c);
  }else{
    art+=line(`M100 166L170 50 ${a.x} ${a.y}L${b.x} ${b.y}`,c,'5 9');
    art+=box(145,39,96,12,'#6a8997')+circle(b.x,b.y,39,c+'55','none');
  }
  return art+symbol('seed',96,170,'#fff3c9')+symbol(types[0],a.x,a.y,c,n+1)+symbol(types[1],b.x,b.y,c,(n+2)%10||10);
}
export function experimentArt(id,{decorative=true}={}){
  const entry=EXPERIMENT_CATALOGUE.find(e=>e.id===id),m=experimentMode(id)||EXPERIMENT_MODES.find(m=>m.id===id)||EXPERIMENT_MODES[0];
  const n=entry?Number(id):m.ranges[0][0],c=m.accent,title=entry?.name??m.name;
  return `<svg class="experiment-art" viewBox="0 0 480 250" ${decorative?'aria-hidden="true"':'role="img" aria-label="'+escape(title)+' illustration"'} focusable="false"><rect width="480" height="250" rx="22" fill="#0c202e"/>${box(12,12,456,226,c+'55')}<circle cx="360" cy="50" r="120" fill="${c}08"/><circle cx="110" cy="200" r="90" fill="${c}0b"/>${composition(m.id,n,c)}${text(46,48,entry?'#'+id:'◆',c,13)}${line('M37 217h45',c)}${text(411,230,m.id.toUpperCase(),c,10)}</svg>`;
}
