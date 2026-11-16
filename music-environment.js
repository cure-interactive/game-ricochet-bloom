// Independent music layers. Stable IDs and prices share cosmetic receipts.
export const SOUNDSTAGES=Object.freeze([
 {id:'soundstage.original',kind:'soundstage',name:'Original',rarity:'common',cost:0,color:'#b1edd6',description:'The familiar soft room around the original music.',seconds:3,decay:.55,wet:.22,damping:.7},
 {id:'soundstage.room',kind:'soundstage',name:'Small Room',rarity:'common',cost:60,color:'#c5dfbb',description:'A close, dry room with a short, warm reflection.',seconds:.7,decay:.15,wet:.14,damping:.8},
 {id:'soundstage.wood',kind:'soundstage',name:'Wooden Hall',rarity:'rare',cost:120,color:'#90dbf5',description:'Warm, softened reflections surround each note.',seconds:1.8,decay:.4,wet:.22,damping:.88},
 {id:'soundstage.stone',kind:'soundstage',name:'Stone Chamber',rarity:'epic',cost:220,color:'#cba6ee',description:'Clear early echoes open into a diffuse stone chamber.',seconds:2.6,decay:.65,wet:.25,damping:.56,echo:.075},
 {id:'soundstage.cathedral',kind:'soundstage',name:'Cathedral',rarity:'legendary',cost:360,color:'#ffd17e',description:'A tall, spacious tail with layered reflections and a clear direct melody.',seconds:3.8,decay:.95,wet:.28,damping:.75,echo:.12},
 {id:'soundstage.vault',kind:'soundstage',name:'Celestial Vault',rarity:'mythic',cost:550,color:'#b4b2ff',description:'An imagined vaulted space: fine early reflections unfold into a broad, gently shifting stereo tail.',seconds:4,decay:1.1,wet:.3,damping:.8,echo:.17,diffuse:true}
]);
export const AMBIENCES=Object.freeze([
 {id:'ambience.none',kind:'ambience',name:'None',rarity:'common',cost:0,color:'#b1edd6',description:'Let the instruments and their acoustic space stand alone.',style:'none'},
 {id:'ambience.rain',kind:'ambience',name:'Soft Rain',rarity:'common',cost:60,color:'#c5dfbb',description:'A quiet, even wash of rain behind your music.',style:'rain'},
 {id:'ambience.shore',kind:'ambience',name:'Quiet Shore',rarity:'rare',cost:120,color:'#90dbf5',description:'Slow waves arrive and recede along a sheltered shore.',style:'shore'},
 {id:'ambience.forest',kind:'ambience',name:'Night Forest',rarity:'epic',cost:220,color:'#cba6ee',description:'A soft canopy breeze with distant, varied insect calls.',style:'forest'},
 {id:'ambience.hearth',kind:'ambience',name:'Ember Hearth',rarity:'legendary',cost:360,color:'#ffd17e',description:'A warm, low hearth with tiny softened crackles and drifting air.',style:'hearth'},
 {id:'ambience.orbit',kind:'ambience',name:'Orbital Drift',rarity:'mythic',cost:550,color:'#b4b2ff',description:'An abstract, slowly breathing atmosphere of air and harmonic light.',style:'orbit'}
]);
export const soundstageGet=id=>SOUNDSTAGES.find(x=>x.id===id)||SOUNDSTAGES[0];
export const ambienceGet=id=>AMBIENCES.find(x=>x.id===id)||AMBIENCES[0];
