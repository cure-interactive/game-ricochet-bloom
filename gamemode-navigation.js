import {segmentedHTML} from './segmented-control.js?v=908df6c6ea1d5c1c4b197a6c29c3406bf114735dddbc908cf00b030e213b0259';
import {buttonHTML} from './ui-icon.js?v=c034fd245b2540631902989670ffc7b2e11942d4f3456fce74a63c3ecaf6710f';
export function gamemodeNavigation(current='',hasFavorites=false){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].filter(([id])=>id!=='favourites'||hasFavorites).map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
