// Original synthesized instruments; no sampled or downloaded sound banks.
export const MUSIC_THEMES=Object.freeze([
 {id:'music.original',kind:'music',name:'Original',rarity:'common',cost:0,color:'#b1edd6',style:'original',description:'Keep the original instruments and each song’s Glass, Velvet or Wood palette.'},
 {id:'music.felt',kind:'music',name:'Felt Keys',rarity:'common',cost:60,color:'#c5dfbb',style:'felt',description:'Soft triangle keys with a gentle attack and short, warm upper tones.',wave:'triangle',attack:1.6,duration:.85,partials:[[1,1,1],[2,.12,.5]]},
 {id:'music.chime',kind:'music',name:'Crystal Chimes',rarity:'rare',cost:120,color:'#90dbf5',style:'chime',description:'Bright bell-like harmonics ring above the same melody and rhythm.',wave:'sine',attack:.65,duration:1.3,partials:[[1,.85,1],[2.01,.3,.65],[3.98,.1,.35]]},
 {id:'music.strings',kind:'music',name:'Velvet Strings',rarity:'epic',cost:220,color:'#cba6ee',style:'strings',description:'Closely tuned voices swell together into a soft string-like ensemble.',wave:'triangle',attack:2.4,duration:1.25,partials:[[.997,.48,1],[1.003,.48,.95],[2,.1,.6]]},
 {id:'music.celesta',kind:'music',name:'Golden Celesta',rarity:'legendary',cost:360,color:'#ffd17e',style:'celesta',description:'Clear struck keys bloom into long, delicate golden overtones.',wave:'sine',attack:.5,duration:1.6,partials:[[1,.9,1],[3,.2,.7],[5,.07,.4]]},
 {id:'music.aurora',kind:'music',name:'Aurora Choir',rarity:'mythic',cost:550,color:'#b4b2ff',style:'aurora',description:'Slow, airy harmonic voices form a drifting choir around your music.',wave:'sine',attack:3,duration:1.8,partials:[[1,.7,1],[1.5,.2,.85],[2.005,.15,.7]]}
]);
export const musicTheme=id=>MUSIC_THEMES.find(x=>x.id===id)||MUSIC_THEMES[0];
