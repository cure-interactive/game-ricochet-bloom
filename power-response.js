// Shared response laws: the skill graphs and physics sample the same functions.
export const DRUNK_SECONDS = 4;
export function waveFalloff(distance, radius, shape={}) {
 return shape.a?(1-distance/radius)**2:shape.b?1-Math.sqrt(distance/radius):1-(distance/radius)**2;
}
export function waveRadial(kind, distance, radius, shape={}) {
 if(kind==='attract')return shape.b&&distance<radius*.48?1:-1;
 return kind==='vortex'?(shape.a?-.45:shape.b?.45:0):1;
}
export function overlapResponse(depth) { return depth*depth*(3-2*depth); }
export function magnetResponse(distance, reach) { return 1-.5*distance/reach; }
export function drunkSway(t, config) {
 return Math.sin(Math.PI*Math.min(1,t/.3)/2)*Math.sin(Math.PI*Math.min(1,(DRUNK_SECONDS-t)/.6)/2)
  *config.swayScale*(.68*Math.sin(t*Math.PI*2/(!config.legacy&&config.foundation?.75:config.b?1.6:1.2))+.16*Math.sin(t*Math.PI*2/(!config.legacy&&config.foundation?1.5:config.b?1:.7)));
}
