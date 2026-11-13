// Colors are the canonical Cure Interactive Icons collection rarity colors.
export const RARITIES = Object.freeze({
 common: {name:'Common',color:'#767676'},
 rare: {name:'Rare',color:'#0072B2'},
 epic: {name:'Epic',color:'#8E44AD'},
 legendary: {name:'Legendary',color:'#A38200'},
 mythic: {name:'Mythic',color:'#B22222'}
});
export const SKILL_TYPES = Object.freeze({
 Motion: {icon:'motion',description:'Changes the player’s speed, rebounds or steering.'},
 Flow: {icon:'flow',description:'Creates currents and forces through the pool.'},
 Control: {icon:'control',description:'Changes how bubbles move, gather or react.'},
 Propagation: {icon:'propagation',description:'Extends contact through extra bodies, projectiles or chains.'},
 Navigation: {icon:'navigation',description:'Changes destinations, targeting or travel through the field.'}
});
// Rarity is authored per node in power-tree.js, independent of chain length.
