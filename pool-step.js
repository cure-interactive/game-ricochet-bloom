// Effects retain their order and immediacy. Persistence consumes the completed
// step, after progression has reconciled the same events and musical state.
const progressionEvents=new Set(['note','power','bloom','rest','over','win','objective','wave']);
const checkpointEvents=new Set([...progressionEvents,'blaster-fire','lightning','wrap','reunite','portal','slingshot','power-streak']);
export function poolStepCommit(events,{effect,observe,save,render,periodic=false}){
  for(const event of events)effect(event);
  const progressionObserved=events.some(event=>progressionEvents.has(event.type))?observe(events)===true:false;
  const checkpoint=periodic||events.some(event=>checkpointEvents.has(event.type));
  const saved=checkpoint?save({progressionObserved}):true;
  if(events.length)render();
  return saved;
}
