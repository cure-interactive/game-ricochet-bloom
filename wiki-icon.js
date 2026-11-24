import { iconHTML, staticIconHTML } from './ui-icon.js?v=982f9454c09cc864e801fe77c736c293672bd5de6e1347de5acff33ca4492647';
import { CATALOGUE } from './catalogue.js?v=c1d42ecf5ab5eb7f0a369fdccd0d8696079d69ac29f9676f4f854e39de9671ac';
import { RARITIES, SKILL_TYPES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { skillIconHTML, rarityIconHTML, typeIconHTML } from './skill-icon.js?v=4b9833fc1b065e0073a99862c6c9119d619870b3b7f6857bd98a78125335c0cf';
import { medalIcon } from './medal-ui.js?v=6df228e6d2895828fc52e3634bd7cb5b98bc58ddf86a48515c6d0a1527524ed2';

// Only known topics and catalogue identities produce decoration. Markdown never
// supplies an image URL, raw SVG or icon name to the renderer.
const pages={'cosmetic-rarity':'epic',changelog:'list',developer:'flask','development-concept':'flask','game-modes':'flask',wiki:'book',contents:'list','how-to-play':'gamepad',waves:'wave',campaign:'campaign','skill-tree':'skill-tree','power-ups':'powers',settings:'gear',medals:'medal',experiments:'flask','score-attack':'speedometer',player:'player-skin'};
const topics={
 pendants:'pendants',companions:'companions','pendants-and-companions':'companions','cosmetic-rarity':'epic',trails:'trails',impacts:'bounce-effects',instruments:'music-note',soundstages:'sound',ambience:'wave',
 'release-notes':'list','direction-and-boundaries':'shield','mind-map':'skill-tree','bubble-actions':'player-static','independent-properties':'switches','elements-and-status-effects':'powers','chain-reactions':'pulse','environment-and-layout':'grid','bubble-sources':'add','enemies':'warning-triangle','cellular-campaign':'campaign','objectives-and-loss':'check','research-inspired-branches':'skill-tree','research-and-sources':'book','decisions-still-open':'about',
 'current-baseline':'check','mind-map-and-research-connections':'skill-tree','experiment-catalogue':'list','precision-and-shot-planning':'control-gun','reactions-and-logic':'pulse','cargo-and-rescue':'shield','containment-and-defense':'shield','survival-and-time-pressure':'clock','terrain-and-navigation':'grid','score-and-risk':'coin','builds-and-power-choices':'powers','music-and-composition':'music-note','memory-and-hidden-information':'eye','growth-and-material-systems':'player-static','journeys-and-campaign-formats':'campaign','competition-and-party-play':'gamepad','cooperation':'gamepad','sandboxes-and-gentle-play':'wave','direct-mind-map-experiments':'flask','capture-carry-and-release':'lock','division-fusion-and-payload-accounting':'pulse','elements-status-and-chain-interruption':'powers','sources-as-resources':'add','anchors-connections-and-changing-routes':'grid','fictional-cellular-missions':'campaign','first-experiments-to-compare':'flask','experiment-guardrails':'shield','recommended-order':'list','pressure-survival':'clock','reaction-lab-and-playtest-method':'flask','scope-and-implementation-decision':'check',
 'glide-and-steady-shell':'player-glide','getting-help':'about',
 'trails-and-impacts':'bounce-effects','trails-and-bounces':'bounce-effects',
 'change-logs':'list','player-changes':'gamepad','developer-notes':'code',
 'ricochet-bloom-wiki':'book','table-of-contents':'list','how-to-play':'gamepad',waves:'wave',campaign:'campaign','skill-tree':'skill-tree','power-ups':'powers','sound-settings-saves':'gear',
 play:'play',grow:'skill-tree','make-yourself-at-home':'gear',
 'pull-release-bloom':'pulse','pull-release-chain':'pulse','contact-powers':'powers','build-a-song':'music-note',controls:'hand-left',
 'choose-a-track':'campaign','five-pools-per-run':'list','research-points-and-powers':'coin','continue-or-start-again':'play',
 'one-connected-tree':'skill-tree','research-and-activation':'lock-open','rarity-and-type':'epic','read-the-map':'eye',
 audio:'music-note','accessibility-and-display':'switches','saves-and-backups':'download','screen-rotation':'eye','find-a-power':'powers',
 'start-here':'gamepad','game-modes':'grid','your-player-and-progress':'skill-tree','settings-and-help':'gear',
 medals:'medal','earning-and-keeping-medals':'medal','score-and-medals':'medal','score-medals-in-every-pool':'medal',
 'melody-journey':'campaign','score-attack':'speedometer','endless-waves':'wave','free-play':'play',challenge:'gamepad',
 'play-the-experiments':'flask','play-the-gamemodes':'flask','experiment-levels':'flask','ideas-in-development':'flask','find-and-favourite-games':'star',
 'three-levels-and-settings':'switches','trick-shots':'control-gun','melody-trials':'music-note','controls-and-saves':'download',
 'reaction-puzzle':'flask','cargo-rescue':'shield','outbreak-containment':'shield','capture-transport-release':'lock',
 'results-and-feedback':'list','points-and-music':'coin','what-to-test':'check','every-shot-counts':'control-gun','points-and-saves':'coin',
 'clear-the-board':'wave','harder-waves':'wave','powers-and-music':'powers','saves-and-records':'bookmark',
 music:'music-note',skills:'skill-tree',player:'player-skin','player-viewer':'player-skin',skins:'player-skin',stats:'stats','player-stats':'stats','player-upgrades':'skill-tree',
 'points-in-every-mode':'coin','points':'coin','drift':'wave','casual':'wave','left-handed-layout':'hand-left','copy-diagnostics':'copy',
 developer:'flask','development-concept':'flask','game-modes-to-try':'flask','economy-tuning':'coin','playtest-method':'check',workshop:'flask','development-tools':'gear'
};
const wrap=html=>html?`<span class="wiki-icon" aria-hidden="true">${html}</span>`:'';
const topicHTML=name=>name==='medal'?medalIcon('Gold'):staticIconHTML(name);
export function wikiTopicIcon(page,anchor=''){
 if(Object.hasOwn(Object.prototype,anchor)||Object.hasOwn(Object.prototype,page))return '';
 const power=page==='power-ups'&&CATALOGUE.nodes[`${anchor}.base`];
 if(power)return wrap(skillIconHTML(power));
 const name=anchor?(Object.hasOwn(topics,anchor)?topics[anchor]:(Object.hasOwn(pages,page)?pages[page]:null)):(Object.hasOwn(pages,page)?pages[page]:null);
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
