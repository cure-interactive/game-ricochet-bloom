import { iconHTML } from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';
import { CATALOGUE } from './catalogue.js?v=b2330060a946840e4caf0bd604dd4001893829861e077d21e980d225f355dbf8';
import { RARITIES, SKILL_TYPES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { skillIconHTML, rarityIconHTML, typeIconHTML } from './skill-icon.js?v=18da00c67ed30f0ba7a7d95cd1c45883ed1b09ffbfc187e5f004c9cf996974ec';

// Only known topics and catalogue identities produce decoration. Markdown never
// supplies an image URL, raw SVG or icon name to the renderer.
const pages={wiki:'book',contents:'list','how-to-play':'gamepad',waves:'wave',campaign:'campaign','skill-tree':'skill-tree','power-ups':'power',settings:'gear'};
const topics={
 'ricochet-bloom-wiki':'book','table-of-contents':'list','how-to-play':'gamepad',waves:'wave',campaign:'campaign','skill-tree':'skill-tree','power-ups':'power','sound-settings-saves':'gear',
 play:'play',grow:'skill-tree','make-yourself-at-home':'gear',
 'pull-release-bloom':'pulse','contact-powers':'power','build-a-song':'music-note',controls:'hand-left',
 'choose-a-track':'campaign','five-pools-per-run':'list','research-points-and-powers':'coin','continue-or-start-again':'play',
 'one-connected-tree':'skill-tree','research-and-activation':'lock-open','rarity-and-type':'epic','read-the-map':'eye',
 audio:'music-note','accessibility-and-display':'switches','saves-and-backups':'download','screen-rotation':'eye','find-a-power':'power'
};
const wrap=html=>html?`<span class="wiki-icon" aria-hidden="true">${html}</span>`:'';
export function wikiTopicIcon(page,anchor=''){
 const power=page==='power-ups'&&CATALOGUE.nodes[`${anchor}.base`];
 if(power)return wrap(skillIconHTML(power));
 const name=anchor?(Object.hasOwn(topics,anchor)?topics[anchor]:null):(Object.hasOwn(pages,page)?pages[page]:null);
 return name?wrap(iconHTML(name)):'';
}
export function wikiStrongHTML(text,page,section,escaped){
 if(page==='power-ups'){
  const base=CATALOGUE.nodes[`${section}.base`];
  if(base){
   if(text===`${RARITIES[base.rarity].name} · ${base.type} Type`)
    return `${wrap(rarityIconHTML(base.rarity))}${RARITIES[base.rarity].name} · ${wrap(typeIconHTML(base.type))}${base.type} Type`;
   const node=Object.values(CATALOGUE.nodes).find(n=>n.power===base.power&&text===`${n.name} (${RARITIES[n.rarity].name}):`);
   if(node)return wrap(skillIconHTML(node))+escaped;
  }
 }
 if(page==='skill-tree'){
  const rarity=Object.keys(RARITIES).find(id=>RARITIES[id].name===text);
  if(rarity)return wrap(rarityIconHTML(rarity))+escaped;
  const type=text.replace(/:$/,'');
  if(Object.hasOwn(SKILL_TYPES,type))return wrap(typeIconHTML(type))+escaped;
 }
 if(page==='how-to-play'&&['melody','bass','rhythm'].includes(text.toLowerCase()))return wrap(iconHTML(text.toLowerCase()))+escaped;
 return escaped;
}
