// Cards share the Player hub's restrained composition: one demonstrated slot,
// the same equipped trail, and no unrelated accessories or impact effects.
export const cosmeticCardLoadout=(item,loadout={})=>({trail:loadout.trail||'trail.original',[item.kind]:item.id});

// Fit the ensemble while giving the selected subject the largest useful view.
export function cosmeticShowcaseFrame(body,accessories,kind,width,height){
 const points=[{...body,r:body.radius*1.65}];
 if(accessories.pendant!=='pendant.none'&&accessories.charm)points.push({...accessories.charm,r:body.radius*.9});
 if(accessories.companion!=='companion.none'&&accessories.follower)points.push({...accessories.follower,r:body.radius*1.7});
 const focus=kind==='pendant'&&accessories.pendant!=='pendant.none'?accessories.charm:kind==='companion'&&accessories.companion!=='companion.none'?accessories.follower:body;
 const left=Math.min(...points.map(p=>p.x-p.r)),right=Math.max(...points.map(p=>p.x+p.r)),top=Math.min(...points.map(p=>p.y-p.r)),bottom=Math.max(...points.map(p=>p.y+p.r));
 const zoom=Math.min(kind==='pendant'?5:kind==='companion'?3.5:2.8,width/(right-left+24),height/(bottom-top+24));
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const x=clamp((focus||body).x,right+12-width/zoom/2,left-12+width/zoom/2),y=clamp((focus||body).y,bottom+12-height/zoom/2,top-12+height/zoom/2);
 return {zoom,x:width/2-x*zoom,y:height/2-y*zoom};
}
