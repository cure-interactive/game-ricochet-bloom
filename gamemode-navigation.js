import {segmentedHTML} from './segmented-control.js?v=e01092f1909350f2de0d577c1402eff5b6621367607d815de120299d3f0ab153';
import {buttonHTML} from './ui-icon.js?v=e7e1e0264b8d800aa16ee5e89ddb82b5bd4dfa68327d0cff8b81d788cb47de8c';
export function gamemodeNavigation(current=''){
 return segmentedHTML([['','All','grid','root'],['favourites','Favorites','star','favourites'],['development','Development','flask','development'],['saved','Saved','floppy-disk','notebook']].map(([id,label,icon,key])=>buttonHTML(label,icon,{id:'gamemode-'+key,'data-gamemode-tab':id,'aria-pressed':id===current})),{current,label:'Gamemode sections',className:'gamemode-switch'});
}
