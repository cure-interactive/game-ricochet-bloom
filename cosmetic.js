import {ACCESSORIES} from './accessory.js?v=4d13cc3b9bb353e9a5ba36bbea63f73cf346bf99b33ef7eba5bde79cf60c9e30';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {COSMETIC_COLLECTION} from './cosmetic-collection.js?v=5fffc248bcec63bc94d641fd08adb36b591a815fa2cd26ed62801ef5a1ea9cca';
import {SOUNDSTAGES,AMBIENCES} from './music-environment.js?v=09dcc5aa06da815b08ac721d6fe505e7c6abd27d237928af2e681a09764eb1a4';
import {MUSIC_THEMES} from './music-theme.js?v=88ea7b370c0695e982b380622f15db38e58496f3cd4335b7104b62ec49d0ad79';
// Stable cosmetic identities and historical paid prices belong to the profile.
export const COSMETICS=Object.freeze([
 ...MUSIC_THEMES,...SOUNDSTAGES,...AMBIENCES,...ACCESSORIES,
 {id:'trail.original',kind:'trail',name:'Original',rarity:'common',cost:0,color:'#bff6e2',style:'original',description:'Your familiar soft wake.'},
 {id:'trail.silk',kind:'trail',name:'Silk',rarity:'common',cost:60,color:'#a9f1df',style:'silk',description:'A clean, flowing ribbon of mint light.'},
 {id:'trail.stardust',kind:'trail',name:'Stardust',rarity:'rare',cost:120,color:'#8ddcff',style:'stardust',description:'A trail of drifting blue-white stars.'},
 {id:'trail.prism',kind:'trail',name:'Prism',rarity:'epic',cost:220,color:'#c4a4ff',style:'prism',description:'Three colored ribbons braid through your wake.'},
 {id:'trail.ember',kind:'trail',name:'Ember',rarity:'legendary',cost:360,color:'#ffc477',style:'ember',description:'Twin fire ribbons brighten with speed and shed cooling embers, with a warm launch accent.'},
 {id:'trail.aurora',kind:'trail',name:'Aurora',rarity:'mythic',cost:550,color:'#aaf5df',style:'aurora',description:'Aurora ribbons unfurl with speed, leaving drifting stars. A rising chime accompanies each launch, with a travel shimmer that tapers for three seconds after launch and two seconds after impacts.'},
 {id:'bounce.none',kind:'bounce',name:'Original',rarity:'common',cost:0,color:'#bff6e2',style:'none',description:'Keep the normal bubble and power feedback.'},
 {id:'bounce.rings',kind:'bounce',name:'Ripple Rings',rarity:'common',cost:60,color:'#a9f1df',style:'rings',description:'Soft rings spread from every player bounce.'},
 {id:'bounce.spark',kind:'bounce',name:'Spark',rarity:'rare',cost:120,color:'#8ddcff',style:'spark',description:'Tiny stars burst from each contact and fade.'},
 {id:'bounce.petals',kind:'bounce',name:'Bloom Petals',rarity:'epic',cost:220,color:'#e9a4ef',style:'petals',description:'A flower of light opens at the point of impact.'},
 {id:'bounce.sunburst',kind:'bounce',name:'Sunburst',rarity:'legendary',cost:360,color:'#ffd17e',style:'sunburst',description:'A bright core releases a golden corona and expanding rays.'},
 {id:'bounce.nova',kind:'bounce',name:'Prismatic Nova',rarity:'mythic',cost:550,color:'#b9afff',style:'nova',description:'A turning star opens into three successive rainbow shockwaves with a crystalline Mythic impact accent.'},
 {id:'skin.seaglass',kind:'skin',name:'Sea Glass',rarity:'common',cost:60,color:'#90e5cf',style:'seaglass',description:'Translucent green with fine flowing bands.'},
 {id:'skin.frost',kind:'skin',name:'Frost Crystal',rarity:'rare',cost:120,color:'#8acdf3',style:'frost',description:'A luminous snow crystal floats inside blue glass.'},
 {id:'skin.nebula',kind:'skin',name:'Nebula',rarity:'epic',cost:220,color:'#b99af1',style:'nebula',description:'A slow-turning constellation floats inside a violet nebula.'},
 {id:'skin.solar',kind:'skin',name:'Solar',rarity:'legendary',cost:360,color:'#ffd182',style:'solar',description:'A living corona turns around a sun, flaring as you move.'},
 {id:'skin.cure',kind:'skin',name:'Cure Interactive',rarity:'legendary',cost:360,color:'#7dcce3',style:'cure',description:'The Cure emblem rests inside moving blue orbits that glow with motion.'},
 {id:'skin.spectrum',kind:'skin',name:'Spectrum',rarity:'mythic',cost:550,color:'#c5b9ff',style:'spectrum',description:'Three shifting orbits surround a turning star that opens with speed.'},
 ...COSMETIC_COLLECTION
]);
// Gallery order is a view of the catalogue; never reorder persistent identities.
export function cosmeticOrder(items){
 const ranks=Object.keys(RARITIES);
 return items.map((item,index)=>({item,index})).sort((a,b)=>ranks.indexOf(a.item.rarity)-ranks.indexOf(b.item.rarity)||a.index-b.index).map(x=>x.item);
}
export const cosmeticGet=id=>COSMETICS.find(item=>item.id===id);
export const cosmeticDefault=()=>({owned:{},trail:'trail.original',bounce:'bounce.none',skin:'campaign',music:'music.original',soundstage:'soundstage.original',ambience:'ambience.none',pendant:'pendant.none',companion:'companion.none'});
export function cosmeticValidate(value){
 if(value===undefined)return undefined;
 if(!value||typeof value!=='object'||Array.isArray(value)||!value.owned||typeof value.owned!=='object'||Array.isArray(value.owned))return null;
 const result=cosmeticDefault();
 for(const [id,receipt] of Object.entries(value.owned)){
  if(!cosmeticGet(id)||!receipt||!Number.isSafeInteger(receipt.paid)||receipt.paid<0)return null;
  result.owned[id]={paid:receipt.paid};
 }
 for(const kind of ['trail','bounce','skin','music','soundstage','ambience','pendant','companion']){
  const id=value[kind];if(['music','soundstage','ambience','pendant','companion'].includes(kind)&&id===undefined){delete result[kind];continue;}if(kind==='skin'&&id==='campaign')continue;
  const item=cosmeticGet(id);if(!item||item.kind!==kind||item.cost>0&&!Object.hasOwn(result.owned,id))return null;
  result[kind]=id;
 }
 return result;
}
export const cosmeticLoadout=profile=>({...cosmeticDefault(),...profile?.cosmetics});
export const cosmeticOwned=(profile,item)=>item.cost===0||Object.hasOwn(cosmeticLoadout(profile).owned,item.id);
export const cosmeticSkin=profile=>cosmeticGet(cosmeticLoadout(profile).skin);

export const cosmeticHasSound=item=>!!item&&(['music','soundstage','ambience'].includes(item.kind)||item.kind==='trail'&&['legendary','mythic'].includes(item.rarity)||item.kind==='bounce'&&item.rarity==='mythic'||item.kind==='companion'&&['epic','legendary','mythic'].includes(item.rarity));
