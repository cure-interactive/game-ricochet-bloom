import {segmentedHTML} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import {buttonHTML} from './ui-icon.js?v=9eb1f65342ffa97596ec1e0ab247623baf53b2164005b7b5fad851e4fce7dc44';
export function gamemodeNavigation(current='',hasFavorites=false){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].filter(([id])=>id!=='favourites'||hasFavorites).map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
