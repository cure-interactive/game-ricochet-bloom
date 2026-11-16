import {segmentedHTML} from './segmented-control.js?v=1a318092255fb007cafc5d85b01f9155f2a6962c7558c1623c1ab76b7ad5f298';
import {buttonHTML} from './ui-icon.js?v=6c99c7aabe02590f700c101241c5f5bc6c6ba38a67af533a14b8cef863768aaa';
export function gamemodeNavigation(current=''){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
