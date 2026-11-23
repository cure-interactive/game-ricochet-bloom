import {segmentedHTML} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import {buttonHTML} from './ui-icon.js?v=f3f8658260fb99cd64b77f5221ce198d475a00038dab248c8a5fcc7cf074badc';
export function gamemodeNavigation(current='',hasFavorites=false){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].filter(([id])=>id!=='favourites'||hasFavorites).map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
