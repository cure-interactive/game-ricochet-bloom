// Cards share the Player hub's restrained composition: one demonstrated slot,
// the same equipped trail, and no unrelated accessories or impact effects.
export const cosmeticCardLoadout=(item,loadout={})=>({trail:loadout.trail||'trail.original',[item.kind]:item.id});

// Showcase isolates accessories; In Motion and other detail views retain the ensemble.
export const cosmeticSoloKind=(view,kind)=>view==='showcase'&&['pendant','companion'].includes(kind)?kind:null;
export const cosmeticPreviewLoadout=(loadout,solo)=>solo?{[solo]:loadout[solo]}:loadout;

// A hidden Showcase anchor can yield without introducing feedback into gameplay.
// Force uses the shared interaction owner's radius-14 coordinate system.
export function cosmeticAnchorForce(body,charm){
 if(!charm)return {x:0,y:0};
 const dx=(body.x-charm.x)*14/body.radius,dy=(body.y-charm.y)*14/body.radius,d=Math.hypot(dx,dy);
 const force=Math.max(0,28-d)*5;
 return force>0&&d>.001?{x:dx/d*force,y:dy/d*force}:{x:0,y:0};
}

// Frame the visible subject, including a pendant's cord endpoint but no hidden shell.
export function cosmeticShowcaseFrame(body,accessories,kind,width,height){
 if(kind==='companion'&&accessories.follower){
  const p=accessories.follower,zoom=Math.min(6,width/(body.radius*3.4+24),height/(body.radius*3.4+24));
  return {zoom,x:width/2-p.x*zoom,y:height/2-p.y*zoom};
 }
 if(kind==='pendant'&&accessories.charm){
  const p=accessories.charm,a=accessories.attachment(body,p),r=body.radius*.95;
  const left=Math.min(a.x,p.x-r),right=Math.max(a.x,p.x+r),top=Math.min(a.y,p.y-r),bottom=Math.max(a.y,p.y+r);
  const zoom=Math.min(8,width/(right-left+32),height/(bottom-top+32));
  return {zoom,x:width/2-(left+right)/2*zoom,y:height/2-(top+bottom)/2*zoom};
 }
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
