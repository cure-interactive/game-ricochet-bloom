// Shared gentle current for decorative skin previews and player thumbnails.
export function bubbleCurrent(phase,age){
 const angle=phase+age*1.7,x=Math.cos(angle),y=Math.sin(angle);
 return {x,y,vx:34*x,vy:28*Math.sin(angle*.83),next:age+1.35+.35*(1+y)};
}
