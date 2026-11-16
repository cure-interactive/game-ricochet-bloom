// Layout slots govern placement; live drawing bounds govern the bitmap.
export function cosmeticBounds(body,outline,visual,unit=1){
 const glow=Math.max(body.radius*1.3,18/unit);
 let left=body.x-glow,top=body.y-glow,right=body.x+glow,bottom=body.y+glow;
 const include=(x,y,r)=>{left=Math.min(left,x-r);top=Math.min(top,y-r);right=Math.max(right,x+r);bottom=Math.max(bottom,y+r);};
 for(const p of outline)include(p.x,p.y,glow+2);
 for(const p of visual.points)include(p.x,p.y,34);
 for(const b of visual.bounces)include(b.x,b.y,70);
 return {left,top,right,bottom};
}
export function cosmeticPaint(canvas,surface,activity,bounds,unit,ratio,paint){
 const rect=surface.getBoundingClientRect(),clipped=activity.clip({left:rect.left+bounds.left*unit,top:rect.top+bounds.top*unit,right:rect.left+bounds.right*unit,bottom:rect.top+bounds.bottom*unit});
 canvas.hidden=!clipped;if(!clipped)return;
 const floor=x=>Math.floor(x/16)*16,ceil=x=>Math.ceil(x/16)*16;
 const left=floor(clipped.left-rect.left),top=floor(clipped.top-rect.top),width=ceil(clipped.right-rect.left)-left,height=ceil(clipped.bottom-rect.top)-top;
 Object.assign(canvas.style,{left:left+'px',top:top+'px',width:width+'px',height:height+'px'});
 const pw=Math.ceil(width*ratio),ph=Math.ceil(height*ratio);
 if(canvas.width!==pw)canvas.width=pw;if(canvas.height!==ph)canvas.height=ph;
 const c=canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pw,ph);
 c.setTransform(unit*ratio,0,0,unit*ratio,-left*ratio,-top*ratio);paint(c);
}
