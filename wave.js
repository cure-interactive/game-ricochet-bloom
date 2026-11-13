// Endless-wave rules are independent of rendering and campaign progression.
export const WAVE_MOVES = 5;
export const WAVE_ENTRY = 1.6;
export const liveBubbles = state => state.bodies.slice(1).filter(body => !body.popped);
export function waveConfig(number) {
  const difficulty = Math.max(0, number - 1);
  return { count: Math.min(20, 12 + Math.floor(difficulty / 2)), moves: WAVE_MOVES,
    radius: 18 + 18 / (1 + difficulty / 12), speed: 18 + 150 * difficulty / (difficulty + 18) };
}
export function wavePrepare(state, number, random) {
  state.wave = { number, entry: 0 };
  state.plucks = WAVE_MOVES;
  const config = waveConfig(number);
  for (const body of state.bodies.slice(1)) {
    const column = (body.id - 1) % 5, row = Math.floor((body.id - 1) / 5);
    body.radius = config.radius;
    body.popped = false;
    body.arrival = { x: 150 + column * 160 + (random(state) - .5) * 60,
      y: 120 + row * 115 + (random(state) - .5) * 35, side: (body.id + number) % 4 };
    const angle = random(state) * Math.PI * 2;
    body.vx = Math.cos(angle) * config.speed; body.vy = Math.sin(angle) * config.speed;
  }
  waveEntryStep(state, 0);
}
export function waveEntryStep(state, dt) {
  if (!state.wave || state.wave.entry >= WAVE_ENTRY) return false;
  state.wave.entry = Math.min(WAVE_ENTRY, state.wave.entry + dt);
  for (const body of state.bodies.slice(1)) {
    const { x, y, side } = body.arrival;
    const t = Math.max(0, Math.min(1, (state.wave.entry - (body.id % 4) * .1) / 1.3));
    const ease = 1 - (1 - t) ** 3;
    const fromX = side === 0 ? -60 : side === 1 ? 1020 : x;
    const fromY = side === 2 ? -60 : side === 3 ? 700 : y;
    body.x = fromX + (x - fromX) * ease; body.y = fromY + (y - fromY) * ease;
  }
  return true;
}
export function waveValid(state) {
  if (state.mode !== 'waves') return state.wave === undefined && state.bodies.every(b => b.popped === undefined && b.arrival === undefined);
  const w = state.wave;
  if (!w || !Number.isSafeInteger(w.number) || w.number < 1 || !Number.isFinite(w.entry) || w.entry < 0 || w.entry > WAVE_ENTRY || state.plucks > WAVE_MOVES || state.isOver && (state.plucks !== 0 || !liveBubbles(state).length)) return false;
  if (state.bodies.length !== waveConfig(w.number).count + 1 || w.entry < WAVE_ENTRY && (state.isFlying || state.isOver || state.chain.length || state.plucks !== WAVE_MOVES)) return false;
  if (state.bodies[0].popped || state.bodies[0].arrival) return false;
  return state.bodies.slice(1).every(b => typeof b.popped === 'boolean' && (!b.popped || w.entry === WAVE_ENTRY) && b.arrival &&
    Number.isInteger(b.arrival.side) && b.arrival.side >= 0 && b.arrival.side < 4 &&
    Number.isFinite(b.arrival.x) && b.arrival.x >= 100 && b.arrival.x <= 850 && Number.isFinite(b.arrival.y) && b.arrival.y >= 80 && b.arrival.y <= 520);
}
