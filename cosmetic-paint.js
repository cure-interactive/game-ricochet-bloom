// Layout slots govern placement; live drawing bounds govern the bitmap.
export function cosmeticBounds(body,outline,visual,unit=1){
 const glow=Math.max(body.radius*1.3,18/unit);
 let left=body.x-glow,top=body.y-glow,right=body.x+glow,bottom=body.y+glow;
 const include=(x,y,r)=>{left=Math.min(left,x-r);top=Math.min(top,y-r);right=Math.max(right,x+r);bottom=Math.max(bottom,y+r);};
 for(const p of visual.accessories?.bounds()||[])include(p.x,p.y,p.r);
 for(const p of outline)include(p.x,p.y,glow+2);
 for(const p of visual.points)include(p.x,p.y,34);
 for(const b of visual.bounces)include(b.x,b.y,70);
 return {left,top,right,bottom};
}
export function cosmeticPaint(canvas,surface,activity,bounds,unit,ratio,paint){
 // Quantize artwork before clipping. Expanding a clipped rectangle can put its
 // transparent canvas back outside the scroller and change the native endpoint.
 const floor=x=>Math.floor(x/16)*16,ceil=x=>Math.ceil(x/16)*16;
 const rect=surface.getBoundingClientRect(),clipped=activity.clip({left:rect.left+floor(bounds.left*unit),top:rect.top+floor(bounds.top*unit),right:rect.left+ceil(bounds.right*unit),bottom:rect.top+ceil(bounds.bottom*unit)});
 // Visibility is a transition, not a paint tick: setting hidden repeatedly
 // wakes every visibility observer and the shared scrollbar layout pass.
 const hidden=!clipped;if(canvas.hidden!==hidden)canvas.hidden=hidden;if(hidden)return;
 const left=clipped.left-rect.left,top=clipped.top-rect.top,width=clipped.right-clipped.left,height=clipped.bottom-clipped.top;
 for(const [name,value] of Object.entries({left:left+'px',top:top+'px',width:width+'px',height:height+'px'}))if(canvas.style[name]!==value)canvas.style[name]=value;
 const pw=Math.ceil(width*ratio),ph=Math.ceil(height*ratio);
 if(canvas.width!==pw)canvas.width=pw;if(canvas.height!==ph)canvas.height=ph;
 const c=canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pw,ph);
 const sx=pw/width,sy=ph/height;
 c.setTransform(unit*sx,0,0,unit*sy,-left*sx,-top*sy);paint(c);
}
