import { iconHTML } from './ui-icon.js?v=a45b8b7529e9829c50cbaee84ed71f02e69362d8a4b87c41723a1409fa839d8b';
import { CATALOGUE } from './catalogue.js?v=41b471c37ef2d3e54b61ceb1967e63963fa935f4a0b48d5bb6eeeedc6069f66c';
import { RARITIES, SKILL_TYPES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { skillIconHTML, rarityIconHTML, typeIconHTML } from './skill-icon.js?v=7d33e83dc72269b5657a3a329c2ca7ab36840a7c3f8e368989a32736abbb3b05';
import { medalIcon } from './medal-ui.js?v=e42ceb7e910836840823bc95f1a1b941bc0a67e9fca8e194f7fac697a662775f';

// Only known topics and catalogue identities produce decoration. Markdown never
// supplies an image URL, raw SVG or icon name to the renderer.
const pages={developer:'flask','development-concept':'flask','game-modes':'flask',wiki:'book',contents:'list','how-to-play':'gamepad',waves:'wave',campaign:'campaign','skill-tree':'skill-tree','power-ups':'power',settings:'gear',medals:'medal',experiments:'flask','score-attack':'speedometer',player:'player-skin'};
const topics={
 'ricochet-bloom-wiki':'book','table-of-contents':'list','how-to-play':'gamepad',waves:'wave',campaign:'campaign','skill-tree':'skill-tree','power-ups':'power','sound-settings-saves':'gear',
 play:'play',grow:'skill-tree','make-yourself-at-home':'gear',
 'pull-release-bloom':'pulse','contact-powers':'power','build-a-song':'music-note',controls:'hand-left',
 'choose-a-track':'campaign','five-pools-per-run':'list','research-points-and-powers':'coin','continue-or-start-again':'play',
 'one-connected-tree':'skill-tree','research-and-activation':'lock-open','rarity-and-type':'epic','read-the-map':'eye',
 audio:'music-note','accessibility-and-display':'switches','saves-and-backups':'download','screen-rotation':'eye','find-a-power':'power',
 'start-here':'gamepad','game-modes':'grid','your-player-and-progress':'skill-tree','settings-and-help':'gear',
 medals:'medal','earning-and-keeping-medals':'medal','score-and-medals':'medal','score-medals-in-every-pool':'medal',
 'melody-journey':'campaign','score-attack':'speedometer','endless-waves':'wave','free-play':'play',challenge:'gamepad',
 'play-the-experiments':'flask','play-the-gamemodes':'flask','experiment-levels':'flask','ideas-in-development':'flask','find-and-favourite-games':'star',
 'three-levels-and-settings':'switches','trick-shots':'control-gun','melody-trials':'music-note','controls-and-saves':'download',
 'reaction-puzzle':'flask','cargo-rescue':'shield','outbreak-containment':'shield','capture-transport-release':'lock',
 'results-and-feedback':'list','points-and-music':'coin','what-to-test':'check','every-shot-counts':'control-gun','points-and-saves':'coin',
 'clear-the-board':'wave','harder-waves':'wave','powers-and-music':'power','saves-and-records':'bookmark',
 skills:'skill-tree',player:'player-skin','player-viewer':'player-skin',skins:'player-skin',stats:'stats','player-stats':'stats','player-upgrades':'skill-tree',
 'points-in-every-mode':'coin','left-handed-layout':'hand-left','copy-diagnostics':'copy',
 developer:'flask','development-concept':'flask','game-modes-to-try':'flask','economy-tuning':'coin','playtest-method':'check',workshop:'flask','development-tools':'gear'
};
const wrap=html=>html?`<span class="wiki-icon" aria-hidden="true">${html}</span>`:'';
const topicHTML=name=>name==='medal'?medalIcon('Gold'):iconHTML(name);
export function wikiTopicIcon(page,anchor=''){
 const power=page==='power-ups'&&CATALOGUE.nodes[`${anchor}.base`];
 if(power)return wrap(skillIconHTML(power));
 const name=anchor?(Object.hasOwn(topics,anchor)?topics[anchor]:null):(Object.hasOwn(pages,page)?pages[page]:null);
 return name?wrap(topicHTML(name)):'';
}
export function wikiStrongHTML(text,page,section,escaped){
 if(page==='medals'&&['Bronze','Silver','Gold'].includes(text))return wrap(medalIcon(text))+escaped;
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
