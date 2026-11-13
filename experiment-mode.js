// A mode owns a distinct player activity and exactly three difficulty boards.
// Catalogue ideas are challenges/tools within it, never a second level tree.
const mode=(id,name,activity,levels,ranges,accent)=>({id,name,activity,levels,ranges,accent});
export const EXPERIMENT_MODES=Object.freeze([
  mode('precision','Trick Shots','Plan a precise route, call your target and control where the seed stops.',['First Line','Bank and Bend','The Final Pocket'],[[1,10]],'#83d7f4'),
  mode('reaction','Reaction Puzzle','Trigger, delay or interrupt chain reactions while protecting fragile cells.',['First Spark','Firebreak','Chain of Islands'],[[11,20],[171,180]],'#ffb56e'),
  mode('cargo','Cargo Rescue','Push, sort and escort physical cargo into safe receivers.',['Open Water','Narrow Passage','The Long Way'],[[21,30]],'#8edbff'),
  mode('outbreak','Outbreak Containment','Control sources and spreading enemies while defending living cells.',['First Response','Crossfire','Quarantine'],[[31,40]],'#c6a2f5'),
  mode('survival','Pressure Survival','Move under time pressure, manage safety and survive changing threats.',['Breathing Room','Closing In','Last Refuge'],[[41,50]],'#ff8b91'),
  mode('engineer','Pool Engineer','Change the physical route with reflectors, currents, portals and attachments.',['Open Channel','Crossed Paths','The Switchyard'],[[51,60],[191,200]],'#77d5cf'),
  mode('score','Score Attack','Choose scoring risks and decide when to bank your rewards.',['Clean Break','Risk and Reward','High Stakes'],[[61,70]],'#f2d279'),
  mode('power','Power Expedition','Build a temporary loadout and manage its resources across a run.',['First Choice','Trade-Off','Final Build'],[[71,80]],'#c4adff'),
  mode('music','Melody Trials','Play visible musical phrases, timing windows and complementary voices.',['First Phrase','Two Voices','Full Arrangement'],[[81,90]],'#eb9bcd'),
  mode('memory','Memory Pool','Observe, remember and infer information before committing your shots.',['Remember Three','Hidden Route','Final Deduction'],[[91,100]],'#a3baff'),
  mode('living','Living Pool','Balance mass, pressure and cellular resources in a changing organism.',['One Cell','Shared Resources','The Whole Organ'],[[101,110],[201,210]],'#a6dc97'),
  mode('journey','Pool Adventures','Solve linked rooms and boss encounters with a shared expedition budget.',['The Entrance','The Detour','The Escape'],[[111,120]],'#e0bd8e'),
  mode('versus','Pool Duel','Compete on one device with explicit turns, claims and comparable starts.',['First Round','Contested Ground','The Decider'],[[121,130]],'#f39eae'),
  mode('cooperation','Together','Coordinate different roles and shared resources to solve a board together.',['Meet in the Middle','Separate Roles','One Last Chance'],[[131,140]],'#88e1c9'),
  mode('workshop','Pool Workshop','Create, inspect and save bounded puzzles, reactions and compositions.',['First Creation','Working System','The Showcase'],[[141,150]],'#b1cee5'),
  mode('capture','Capture and Release','Capture a live payload, transport it safely and choose where to release it.',['Around the Wall','Lower Passage','The Return'],[[151,160]],'#f2b074'),
  mode('division','Split and Merge','Divide, combine and allocate physical mass to satisfy several constraints.',['Two Halves','Unequal Shares','Exact Balance'],[[161,170]],'#87dacc'),
  mode('producer','Source Works','Feed, reposition and schedule producers to manufacture and route outputs.',['First Output','Supply Chain','The Factory'],[[181,190]],'#c3d87c')
]);
export const DIFFICULTIES=Object.freeze(['Introductory','Intermediate','Advanced']);
export function experimentMode(id){
  if(['reaction','cargo','outbreak'].includes(id))return EXPERIMENT_MODES.find(m=>m.id===id);
  const n=Number(id);return EXPERIMENT_MODES.find(m=>m.ranges.some(([a,b])=>n>=a&&n<=b));
}
export function modeIdeas(mode,catalogue){return catalogue.filter(e=>experimentMode(e.id)?.id===mode.id);}
