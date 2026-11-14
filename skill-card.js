import {escapeHTML as escape} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {skillIconHTML,rarityIconHTML,typeIconHTML} from './skill-icon.js?v=18da00c67ed30f0ba7a7d95cd1c45883ed1b09ffbfc187e5f004c9cf996974ec';
import {buttonHTML,iconHTML} from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';
import {tooltipPosition} from './skill-comparison.js?v=d906b14eaf8c1806bffd0856ede555240e415e41cd337331a1c6c433b7afd085';
const button=(action,label,icon='add',attrs={})=>buttonHTML(label,icon,{'aria-label':label,'data-tree-action':action,...attrs});

function statCurveHTML(curve,stats){
 const left=32,right=270,top=22,bottom=112;
 const x=v=>left+v/curve.xMax*(right-left),y=v=>bottom-(v-curve.yMin)/(curve.yMax-curve.yMin)*(bottom-top);
 const path=points=>points.map(([a,b],i)=>`${i?'L':'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ');
 const zero=y(0),caption=curve.changed?`<span class="skill-curve-current">${escape(stats.beforeLabel)}</span><span class="skill-curve-upgrade">${escape(stats.afterLabel)}</span>`:'<span class="skill-curve-value">'+escape(stats.compare?stats.afterLabel:stats.heading)+'</span>';
 return `<figure class="skill-curve"><svg viewBox="0 0 280 148" role="img" aria-label="${escape(curve.summary)}"><text class="skill-curve-axis-title" x="32" y="11">${escape(curve.yLabel)}</text><path class="skill-curve-grid" d="M32 22H270 M32 67H270 M32 112H270"/><path class="skill-curve-axis" d="M32 22V112H270 M32 ${zero}H270"/><text x="26" y="26" text-anchor="end">${curve.yMax}</text><text x="26" y="115" text-anchor="end">${curve.yMin}</text>${curve.yMin<0?`<text x="26" y="${zero+4}" text-anchor="end">0</text>`:''}${curve.previous?`<path class="skill-curve-before" d="${path(curve.previous)}"/>`:''}<path class="skill-curve-after" d="${path(curve.points)}"/><text x="32" y="127">0</text><text x="270" y="127" text-anchor="end">${escape(curve.xEnd)}</text><text x="151" y="144" text-anchor="middle">${escape(curve.xLabel)}</text></svg><figcaption>${caption}</figcaption><p>${escape(curve.note)}</p></figure>`;
}

function statVisual(row){
 const value=row.progress,before=row.changed?row.previousProgress:value,kept=Math.min(before,value),extent=Math.max(before,value),change=value>before?'gain':'loss';
 const fill=row.kind==='count'?Array.from({length:row.max},(_,i)=>`<i class="${i<Math.round(kept*row.max)?'filled':i<Math.round(extent*row.max)?'skill-stat-'+change:''}"></i>`).join(''):
   `<i style="width:${kept*100}%"></i>${row.changed?`<i class="skill-stat-${change}" style="width:${(extent-kept)*100}%"></i>`:''}`;
 const bar=`<span class="skill-stat-${row.kind}" aria-hidden="true">${fill}</span>`;
 if(row.kind!=='bar')return bar;
 const partial=value<1,formatted=String(row.after),best=String(row.after).replace(/^[\d.]+/,String(row.best));
 return `<span class="sr-only">${row.direction==='lower'?'Lower':'Higher'} is better. Best: ${escape(best)}</span><span class="skill-stat-meter" aria-hidden="true"><span class="skill-stat-labels ${partial&&value>.75?'is-tight':''} ${row.changed?'is-'+change:''}" style="--fill:${value*100}%;--value-width:${formatted.length+.5}ch">${partial?`<span class="skill-stat-endpoint">${escape(formatted)}</span>`:''}<span class="skill-stat-max">Best ${escape(best)}</span></span>${bar}</span>`;
}
export function skillStatsHTML(stats){
 const changed=stats.rows.filter(r=>r.changed&&r.kind!=='text'&&!r.curve);
 const legend=changed.length?`<p class="skill-stat-change-key">${changed.some(r=>r.progress>r.previousProgress)?'<span><i class="skill-stat-gain" aria-hidden="true"></i>Improvement</span>':''}${changed.some(r=>r.progress<r.previousProgress)?'<span><i class="skill-stat-loss" aria-hidden="true"></i>Tradeoff</span>':''}</p>`:'';
 return `<section class="skill-stats" aria-label="${escape(stats.heading)}"><h4>${escape(stats.heading)}</h4>${stats.compare?`<p class="skill-stat-key"><span>${escape(stats.beforeLabel)}</span><span aria-hidden="true">→</span><span>${escape(stats.afterLabel)}</span></p>`:''}${legend}<dl>${stats.rows.map(row=>`<div class="skill-stat ${row.changed?'is-changed':''}" data-change="${row.changed&&row.kind!=='text'?(row.progress>row.previousProgress?'gain':'loss'):'none'}"><dt>${escape(row.label)}</dt><dd>${row.changed?`<span class="skill-stat-before">${escape(row.before)}</span><span aria-hidden="true"> → </span><span class="sr-only"> to </span>`:''}<strong>${escape(row.after)}</strong></dd><dd class="skill-stat-description">${escape(row.description)}</dd>${row.curve?`<dd class="skill-stat-visual">${statCurveHTML(row.curve,stats)}</dd>`:row.kind!=='text'?`<dd class="skill-stat-visual">${statVisual(row)}</dd>`:''}</div>`).join('')}</dl>${stats.rows.some(r=>r.kind==='bar'&&!r.curve)?'<p class="skill-stat-note">Full bar = best value for this stat. Researched upgrades stack.</p>':''}</section>`;
}

// Rendering has no purchase side effects. Each tree supplies its own eligibility.
export function skillNodeHTML(n,{position=n,attribute='data-node',tooltipId='skill-tooltip',selected=false,active=false,available=false,cost=null}={}){
 if(!['data-node','data-player-node'].includes(attribute))throw new Error('Unknown skill node attribute');
 const base=n.kind==='base',locked=!n.owned&&!n.borrowed&&!available;
 const badge=n.borrowed?'clock':active||n.owned?'check':locked?'lock':null;
 const label=active?'Active':n.owned?'Owned':available?'Available to Purchase':n.borrowed?'Borrowed':'Locked';
 return `<button type="button" ${attribute}="${escape(n.id)}" data-kind="${n.kind}" data-rarity="${n.rarity}" class="skill-node ${base?'is-base':''} ${n.kind==='capstone'?'is-capstone':''} ${n.owned?'is-owned':''} ${n.dimmed?'is-unavailable':''} ${active?'is-active':''} ${available?'is-available':''} ${locked?'is-locked':''} ${n.borrowed?'is-borrowed':''}" style="--rarity-color:${RARITIES[n.rarity].color};--node-x:${position.x}px;--node-y:${position.y}px" aria-label="${escape(n.name+', '+label+(cost===null?'':', Cost: '+cost+' Points'))}" aria-pressed="${selected}" aria-haspopup="dialog" aria-controls="${escape(tooltipId)}" aria-expanded="false"><span class="skill-orb">${skillIconHTML(n)}<span class="skill-rarity" aria-hidden="true">${rarityIconHTML(n.rarity)}</span>${badge?'<i class="skill-badge">'+iconHTML(badge)+'</i>':''}</span><strong>${escape(n.name)}</strong>${cost===null?'':`<small class="skill-node-cost">${iconHTML('coin')}<span>${cost} Points</span></small>`}</button>`;
}

export const skillLegendHTML=(id)=>`<button type="button" class="tree-legend" data-tree-action="legend" aria-expanded="false" aria-controls="${escape(id)}"><span class="tree-legend-title">${iconHTML('about')}<span>Legend</span><span class="tree-legend-close" aria-hidden="true">${iconHTML('close')}</span></span><span id="${escape(id)}" hidden><span class="rarity-legend">${Object.entries(RARITIES).map(([id,r])=>`<span class="rarity-key">${rarityIconHTML(id)}${r.name}</span>`).join('')}</span><span class="status-legend"><span class="legend-active">Active</span><span class="legend-owned">Owned</span><span class="legend-available">Available</span><span class="legend-locked">Locked</span></span><span class="tree-legend-hint">Tap to Collapse</span></span></button>`;

export function skillCardHTML(info,titleId){
 return `<div class="skill-tooltip-heading"><div class="skill-card-title"><h3 id="${escape(titleId)}">${escape(info.name)}</h3><span class="skill-type-pill"><span class="sr-only">Type: </span>${typeIconHTML(info.type)}${escape(info.type)}</span></div>${button('dismiss','Close','close')}</div><div class="skill-tooltip-body"><p>${escape(info.description)}</p>${info.stats?skillStatsHTML(info.stats):''}${info.unlock?'':`<p>${escape(info.status)}${info.blocker?'<br>'+escape(info.blocker):''}</p>`}</div>${info.unlock?`<div class="skill-tooltip-action">${button('buy',`Unlock · ${info.unlock.cost} Points`,'lock',{class:'primary',disabled:!info.unlock.enabled,'aria-describedby':info.unlock.enabled?null:titleId+'-reason'})}${info.unlock.reason?`<p id="${escape(titleId)}-reason">${escape(info.unlock.reason)}</p>`:''}</div>`:info.canEquip?`<div class="skill-tooltip-action">${button('equip','Use This Style','check',{class:'primary'})}</div>`:''}`;
}

export function showSkillCard({tip,source,stage,dialog,info,titleId}){
 const bounds=stage.getBoundingClientRect();
 tip.style.maxHeight=Math.max(44,bounds.height-16)+'px';tip.style.maxWidth=Math.max(0,bounds.width-16)+'px';
 tip.innerHTML=skillCardHTML(info,titleId);
 // Mirror the selected node's actual artwork and badges; the card shares its paint rules.
 const cardIcon=document.createElement('span');
 cardIcon.className=source.className.replace('skill-node','skill-card-icon');cardIcon.setAttribute('aria-hidden','true');
 cardIcon.style.setProperty('--rarity-color',source.style.getPropertyValue('--rarity-color'));
 cardIcon.append(source.querySelector('.skill-orb').cloneNode(true));tip.querySelector('.skill-tooltip-heading').prepend(cardIcon);
 tip.hidden=false;source.setAttribute('aria-expanded','true');
 const size=tip.getBoundingClientRect(),position=tooltipPosition(source.getBoundingClientRect(),bounds,size.width,size.height),origin=dialog.getBoundingClientRect();
 tip.style.left=position.left-origin.left+'px';tip.style.top=position.top-origin.top+'px';
}
