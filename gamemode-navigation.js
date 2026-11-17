import {segmentedHTML} from './segmented-control.js?v=9177239cf54f096e1a7d7b9a041d427e077baef1d5723af65b85bc1c13778763';
import {buttonHTML} from './ui-icon.js?v=c034fd245b2540631902989670ffc7b2e11942d4f3456fce74a63c3ecaf6710f';
export function gamemodeNavigation(current='',hasFavorites=false){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].filter(([id])=>id!=='favourites'||hasFavorites).map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
