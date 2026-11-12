import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import { CATALOGUE } from './catalogue.js?v=72132af057dff2bd5109c48d8a7a7ad6fdf82a3a7eb75d52b4a209a490cfffb0';
import { RARITIES, SKILL_TYPES } from './skill-trait.js?v=bef2df62b29364983801345d0a0318164dfeef5666360b3ce1e2a200ac7acdc0';
import { skillIconHTML, rarityIconHTML, typeIconHTML } from './skill-icon.js?v=1a0162a50410031bd58c7fbd6250e03b4a11b8165ae0caab7a965a7315404b54';

// Only known topics and catalogue identities produce decoration. Markdown never
// supplies an image URL, raw SVG or icon name to the renderer.
const pages={wiki:'book',contents:'list','how-to-play':'gamepad',campaign:'campaign','skill-tree':'skill-tree','power-ups':'power',settings:'gear'};
const topics={
 'ricochet-bloom-wiki':'book','table-of-contents':'list','how-to-play':'gamepad',campaign:'campaign','skill-tree':'skill-tree','power-ups':'power','sound-settings-saves':'gear',
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
