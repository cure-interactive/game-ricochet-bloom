import {segmentedHTML} from './segmented-control.js?v=c97ea7fc0d2e1b1607bc752f13b732b3439bd6439630457197c7390422e28b24';
import {buttonHTML} from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';
export function gamemodeNavigation(current=''){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
