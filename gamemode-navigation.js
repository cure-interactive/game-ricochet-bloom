import {segmentedHTML} from './segmented-control.js?v=f00bd781036223fc2f7395a6946a17e7106fd0d6d55191f99b6325b4f7da4bc2';
import {buttonHTML} from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';
export function gamemodeNavigation(current=''){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
