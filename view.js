// One reversible camera mapping for drawing and pointer input; physics stays unchanged.
export function poolPan(x = 480, y = 320, portrait = false) {
 const across = portrait ? 1 - (Number.isFinite(y) ? y : 320) / 640 : (Number.isFinite(x) ? x : 480) / 960;
 return Math.max(-.9, Math.min(.9, (across - .5) * 1.8));
}
export function poolView(width,height,worldWidth=960,worldHeight=640,portrait=height>width){
 const w=portrait?worldHeight:worldWidth,h=portrait?worldWidth:worldHeight;
 const scale=Math.max(.0001,Math.min(width/w,height/h)),left=(width-w*scale)/2,top=(height-h*scale)/2;
 return {portrait,scale,matrix:portrait?[0,scale,-scale,0,left+worldHeight*scale,top]:[scale,0,0,scale,left,top],
  screen:(x,y)=>portrait?{x:left+(worldHeight-y)*scale,y:top+x*scale}:{x:left+x*scale,y:top+y*scale},
  world:(x,y)=>portrait?{x:(y-top)/scale,y:worldHeight-(x-left)/scale}:{x:(x-left)/scale,y:(y-top)/scale}};
}
