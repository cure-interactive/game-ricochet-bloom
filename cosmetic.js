// Stable cosmetic identities and historical paid prices belong to the profile.
export const COSMETICS=Object.freeze([
 {id:'trail.original',kind:'trail',name:'Original',rarity:'common',cost:0,color:'#bff6e2',style:'original',description:'Your familiar soft wake.'},
 {id:'trail.silk',kind:'trail',name:'Silk',rarity:'common',cost:60,color:'#a9f1df',style:'silk',description:'A clean, flowing ribbon of mint light.'},
 {id:'trail.stardust',kind:'trail',name:'Stardust',rarity:'rare',cost:120,color:'#8ddcff',style:'stardust',description:'A trail of drifting blue-white stars.'},
 {id:'trail.prism',kind:'trail',name:'Prism',rarity:'epic',cost:220,color:'#c4a4ff',style:'prism',description:'Three colored ribbons braid through your wake.'},
 {id:'trail.ember',kind:'trail',name:'Ember',rarity:'legendary',cost:360,color:'#ffc477',style:'ember',description:'Golden embers spiral away and cool gently.'},
 {id:'trail.aurora',kind:'trail',name:'Aurora',rarity:'mythic',cost:550,color:'#aaf5df',style:'aurora',description:'An iridescent curtain of light follows every curve.'},
 {id:'bounce.none',kind:'bounce',name:'Original',rarity:'common',cost:0,color:'#bff6e2',style:'none',description:'Keep the normal bubble and power feedback.'},
 {id:'bounce.rings',kind:'bounce',name:'Ripple Rings',rarity:'common',cost:60,color:'#a9f1df',style:'rings',description:'Soft rings spread from every player bounce.'},
 {id:'bounce.spark',kind:'bounce',name:'Spark',rarity:'rare',cost:120,color:'#8ddcff',style:'spark',description:'Tiny stars burst from each contact and fade.'},
 {id:'bounce.petals',kind:'bounce',name:'Bloom Petals',rarity:'epic',cost:220,color:'#e9a4ef',style:'petals',description:'A flower of light opens at the point of impact.'},
 {id:'bounce.sunburst',kind:'bounce',name:'Sunburst',rarity:'legendary',cost:360,color:'#ffd17e',style:'sunburst',description:'Golden rays expand around a bright central ring.'},
 {id:'bounce.nova',kind:'bounce',name:'Prismatic Nova',rarity:'mythic',cost:550,color:'#b9afff',style:'nova',description:'Layered rainbow rings and stars mark the bounce.'},
 {id:'skin.seaglass',kind:'skin',name:'Sea Glass',rarity:'common',cost:60,color:'#90e5cf',style:'seaglass',description:'Translucent green with fine flowing bands.'},
 {id:'skin.frost',kind:'skin',name:'Frost Crystal',rarity:'rare',cost:120,color:'#8acdf3',style:'frost',description:'A luminous snow crystal floats inside blue glass.'},
 {id:'skin.nebula',kind:'skin',name:'Nebula',rarity:'epic',cost:220,color:'#b99af1',style:'nebula',description:'A tiny constellation wrapped in violet haze.'},
 {id:'skin.solar',kind:'skin',name:'Solar',rarity:'legendary',cost:360,color:'#ffd182',style:'solar',description:'A golden sun and orbiting arcs under the membrane.'},
 {id:'skin.cure',kind:'skin',name:'Cure Interactive',rarity:'legendary',cost:360,color:'#7dcce3',style:'cure',description:'The Cure Interactive emblem suspended in cool blue glass.'},
 {id:'skin.spectrum',kind:'skin',name:'Spectrum',rarity:'mythic',cost:550,color:'#c5b9ff',style:'spectrum',description:'Prismatic bands and a bright star shimmer inside your bubble.'}
]);
export const cosmeticGet=id=>COSMETICS.find(item=>item.id===id);
export const cosmeticDefault=()=>({owned:{},trail:'trail.original',bounce:'bounce.none',skin:'campaign'});
export function cosmeticValidate(value){
 if(value===undefined)return undefined;
 if(!value||typeof value!=='object'||Array.isArray(value)||!value.owned||typeof value.owned!=='object'||Array.isArray(value.owned))return null;
 const result=cosmeticDefault();
 for(const [id,receipt] of Object.entries(value.owned)){
  if(!cosmeticGet(id)||!receipt||!Number.isSafeInteger(receipt.paid)||receipt.paid<0)return null;
  result.owned[id]={paid:receipt.paid};
 }
 for(const kind of ['trail','bounce','skin']){
  const id=value[kind];if(kind==='skin'&&id==='campaign')continue;
  const item=cosmeticGet(id);if(!item||item.kind!==kind||item.cost>0&&!Object.hasOwn(result.owned,id))return null;
  result[kind]=id;
 }
 return result;
}
export const cosmeticLoadout=profile=>profile?.cosmetics??cosmeticDefault();
export const cosmeticOwned=(profile,item)=>item.cost===0||Object.hasOwn(cosmeticLoadout(profile).owned,item.id);
export const cosmeticSkin=profile=>cosmeticGet(cosmeticLoadout(profile).skin);
