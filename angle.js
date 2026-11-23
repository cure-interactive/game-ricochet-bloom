// Frame-rate independent interpolation along the shortest rotational arc.
export function angleApproach(current,target,rate,dt){
 const delta=Math.atan2(Math.sin(target-current),Math.cos(target-current));
 return current+delta*(1-Math.exp(-rate*dt));
}
