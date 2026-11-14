// Shared response laws: the skill graphs and physics sample the same functions.
export const DRUNK_SECONDS = 4;
export function waveFalloff(distance, radius, shape={}) {
 return 1-(distance/radius)**(shape.b?4:2);
}
export function waveRadial(kind, distance, radius, shape={}) {
 if(kind==='attract')return -1;
 return kind==='vortex'?(shape.a?-.45:0):1;
}
export function overlapResponse(depth) { return depth*depth*(3-2*depth); }
export function magnetResponse(distance, reach) { return 1-.5*distance/reach; }
export function drunkSway(t, config) {
 const phase=t/(config.swayPeriod||1);
 return Math.sin(Math.PI*Math.min(1,t/.3)/2)*Math.sin(Math.PI*Math.min(1,(DRUNK_SECONDS-t)/.6)/2)
  *config.swayScale*(.68*Math.sin(phase*Math.PI*2/(!config.legacy&&config.foundation?.75:1.2))+.16*Math.sin(phase*Math.PI*2/(!config.legacy&&config.foundation?1.5:.7)));
}
