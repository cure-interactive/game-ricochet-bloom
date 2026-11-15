// Rendering preferences never change physics, progression or bubble deformation.
export const QUALITY = {
 high:{label:'High',pixelRatio:2,description:'Full resolution, glow and decorative effects.'},
 balanced:{label:'Balanced',pixelRatio:1.5,description:'Lower rendering resolution with full bubble motion and effects.'},
 low:{label:'Low',pixelRatio:1,description:'Lower resolution and fewer decorative effects. Bubble motion stays active.'},
};
export function qualityRead(preferences={}){
 return Object.hasOwn(QUALITY,preferences.quality)?preferences.quality:preferences.gentle===true?'low':'high';
}
export function qualityPixelRatio(quality,dpr=1){return Math.min(QUALITY[quality]?.pixelRatio||2,Number.isFinite(dpr)&&dpr>0?dpr:1);}
