import {segmentedHTML} from './segmented-control.js?v=bfc2eb723bd5080e1ff722bcfb43b3958890bbcd7bb4f5ce1e7dbf3c3192b161';
import {buttonHTML} from './ui-icon.js?v=651851d37e4b6c0baf7ace97e9b872c2946987c9106bb31c885aa3814763f420';
export function gamemodeNavigation(current='',hasFavorites=false){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].filter(([id])=>id!=='favourites'||hasFavorites).map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
