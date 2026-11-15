import {qualityRead,QUALITY} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
let frameLimit=0;
export function performancePolicy(preferences={},battery=null){
 const saving=preferences.autoBattery!==false&&battery?.charging===false&&Number.isFinite(battery.level)&&battery.level<=.2;
 return {saving,quality:saving?'low':qualityRead(preferences),fps:saving?30:[30,60].includes(Number(preferences.frameRate))?Number(preferences.frameRate):0};
}
export function frameGate(limit=()=>frameLimit){
 let last=-Infinity,previous;
 return now=>{const fps=limit();if(fps!==previous){last=-Infinity;previous=fps;}if(!fps||now-last>=1000/fps-1){last=now;return true;}return false;};
}
export function performanceMount({preferences,save,apply},doc=document,nav=navigator){
 let battery=null,available=false;
 const quality=doc.getElementById('quality'),rate=doc.getElementById('frame-rate'),automatic=doc.getElementById('auto-battery'),status=doc.getElementById('battery-status');
 function refresh(){
  const state=performancePolicy(preferences,battery);frameLimit=state.fps;
  doc.body.dataset.frameRate=String(state.fps);doc.body.dataset.batterySaving=String(state.saving);
  quality.value=qualityRead(preferences);rate.value=String([30,60].includes(Number(preferences.frameRate))?preferences.frameRate:0);automatic.checked=available&&preferences.autoBattery!==false;automatic.disabled=!available;
  quality.disabled=rate.disabled=state.saving;
  status.textContent=state.saving?'Battery Saver active: Low quality and 30 FPS while unplugged at 20% battery or below. Your chosen settings return when charging or above 20%.':!available?'This browser does not share battery level. For battery saving, choose Low quality and 30 FPS. The game cannot read your device’s Low Power Mode.':automatic.checked?'Automatic: Low quality and 30 FPS at 20% battery or below while unplugged. Device Low Power Mode is not exposed by the browser.':'Automatic battery saving is off. Your chosen quality and frame-rate limit apply.';
  apply(state);doc.getElementById('quality-description').textContent=state.saving?'Low quality is temporarily active to save battery. Turn off automatic battery saving to use your chosen settings.':QUALITY[state.quality].description;
 }
 function change(){preferences.quality=quality.value;preferences.frameRate=Number(rate.value);if(available)preferences.autoBattery=automatic.checked;const saved=save({quality:preferences.quality,frameRate:preferences.frameRate,autoBattery:preferences.autoBattery});refresh();if(!saved)status.textContent+=' Changes apply this session; this browser could not save them.';}
 quality.onchange=rate.onchange=automatic.onchange=change;refresh();
 try{if(nav.getBattery)Promise.resolve(nav.getBattery()).then(value=>{if(!value||!Number.isFinite(value.level)||value.level<0||value.level>1||typeof value.charging!=='boolean')return;battery=value;available=true;for(const event of ['levelchange','chargingchange'])battery.addEventListener?.(event,refresh);refresh();}).catch(()=>{});}catch{}
 return {refresh};
}
