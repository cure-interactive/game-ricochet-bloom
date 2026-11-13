// Renderer-only elastic skin. Gameplay collision bodies remain in engine.js.
const COUNT = 24, TAU = Math.PI * 2;
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
export function bubbleCreate() {
  return { offset: Array(COUNT).fill(0), speed: Array(COUNT).fill(0), strain: [0, 0], strainSpeed: [0, 0], core: [0, 0], coreSpeed: [0, 0], glow: 0, frost: 0 };
}
export function bubbleHit(bubble, radius, nx, ny, speed, isFrozen = false) {
  speed *= isFrozen ? .18 : 1;
  const direction = Math.atan2(ny, nx), impulse = Math.min(radius * 8, Math.max(0, speed) * .95);
  const kicks = Array.from({ length: COUNT }, (_, index) => {
    const projection = Math.cos(index / COUNT * TAU - direction);
    return -(Math.max(0, projection) ** 8) + .28 * (1 - projection * projection);
  });
  const mean = kicks.reduce((sum, value) => sum + value, 0) / COUNT;
  for (let index = 0; index < COUNT; index++) bubble.speed[index] = clamp(bubble.speed[index] + (kicks[index] - mean) * impulse, radius * 12);
  // Compress along the impact axis, bulge perpendicular, then ring back.
  const squash = Math.min(3.8, speed / Math.max(1, radius) * .3);
  bubble.strainSpeed[0] = clamp(bubble.strainSpeed[0] - Math.cos(direction * 2) * squash, 5);
  bubble.strainSpeed[1] = clamp(bubble.strainSpeed[1] - Math.sin(direction * 2) * squash, 5);
  bubble.coreSpeed[0] += nx * Math.min(radius * 3, speed * .18);
  bubble.coreSpeed[1] += ny * Math.min(radius * 3, speed * .18);
}
export function bubbleFlow(body, bodies) {
  let vx = 0, vy = 0;
  for (const source of bodies) {
    if (source.id === body.id) continue;
    const speed = Math.hypot(source.vx, source.vy);
    if (speed < 4) continue;
    const dx = body.x - source.x, dy = body.y - source.y, distance = Math.hypot(dx, dy);
    const reach = (source.radius + body.radius) * 3;
    if (distance >= reach) continue;
    const behind = distance > 0 ? -(dx * source.vx + dy * source.vy) / (distance * speed) : 0;
    const weight = (1 - distance / reach) ** 2 * (.35 + .65 * Math.max(0, behind)) * .35;
    vx += source.vx * weight; vy += source.vy * weight;
  }
  const scale = Math.min(1, 90 / Math.max(1, Math.hypot(vx, vy)));
  return { vx: vx * scale, vy: vy * scale };
}
export function bubbleRipple(ripple, body) {
  const dx = body.x - ripple.x, dy = body.y - ripple.y, distance = Math.hypot(dx, dy);
  ripple.touched ||= new Set();
  if (ripple.touched.has(body.id) || distance < .001 || ripple.radius < distance - body.radius || ripple.previousRadius > distance + body.radius) return null;
  ripple.touched.add(body.id);
  return { nx: -dx / distance, ny: -dy / distance, strength: (ripple.bloom ? 95 : 40) / (1 + distance / 400) };
}
export function bubbleStep(bubble, body, elapsed, gentle = false, flow = { vx: 0, vy: 0 }, isFrozen = false) {
  const frame = Math.min(.08, Math.max(0, elapsed));
  bubble.frost += ((isFrozen ? 1 : 0) - bubble.frost) * (1 - Math.exp(-frame * (isFrozen ? 14 : 7)));
  const frost = bubble.frost, softness = 1 - frost * .82;
  if (gentle) {
    bubble.offset.fill(0); bubble.speed.fill(0); bubble.strain.fill(0); bubble.strainSpeed.fill(0); bubble.core.fill(0); bubble.coreSpeed.fill(0);
    return;
  }
  const speed = Math.hypot(body.vx, body.vy), direction = Math.atan2(body.vy, body.vx);
  const stretch = .3 * speed / (speed + 260) * softness;
  const flowSpeed = Math.hypot(flow.vx, flow.vy), flowDirection = Math.atan2(flow.vy, flow.vx), flowStretch = Math.min(.11, flowSpeed / 450) * softness;
  const target = [Math.cos(direction * 2) * stretch + Math.cos(flowDirection * 2) * flowStretch, Math.sin(direction * 2) * stretch + Math.sin(flowDirection * 2) * flowStretch];
  let remaining = frame;
  while (remaining > 0) {
    const dt = Math.min(1 / 120, remaining); remaining -= dt;
    const previous = bubble.offset.slice();
    for (let index = 0; index < COUNT; index++) {
      const neighbor = (previous[(index + COUNT - 1) % COUNT] + previous[(index + 1) % COUNT]) / 2;
      bubble.speed[index] += (-previous[index] * (90 + frost * 150) + (neighbor - previous[index]) * (150 + frost * 100) - bubble.speed[index] * (5.5 + frost * 16)) * dt;
      bubble.offset[index] = clamp(previous[index] + bubble.speed[index] * dt, body.radius * (.4 - frost * .28));
    }
    for (let axis = 0; axis < 2; axis++) {
      bubble.strainSpeed[axis] += ((target[axis] - bubble.strain[axis]) * (100 + frost * 140) - bubble.strainSpeed[axis] * (6 + frost * 16)) * dt;
      bubble.strain[axis] = clamp(bubble.strain[axis] + bubble.strainSpeed[axis] * dt, .34 * softness);
      const coreTarget = clamp(-(axis ? body.vy : body.vx) * .035 + (axis ? flow.vy : flow.vx) * .08, body.radius * .3) * softness;
      bubble.coreSpeed[axis] += ((coreTarget - bubble.core[axis]) * (65 + frost * 75) - bubble.coreSpeed[axis] * (6.5 + frost * 14)) * dt;
      bubble.core[axis] = clamp(bubble.core[axis] + bubble.coreSpeed[axis] * dt, body.radius * .4);
    }
  }
}
export function bubbleOutline(bubble, body) {
  const radii = Array.from({ length: COUNT }, (_, index) => {
    const theta = index / COUNT * TAU;
    // A circle is the unforced equilibrium; every deviation comes from motion.
    return body.radius * (1 + bubble.strain[0] * Math.cos(theta * 2) + bubble.strain[1] * Math.sin(theta * 2)) + bubble.offset[index];
  });
  const area = radii.reduce((sum, radius, index) => sum + radius * radii[(index + 1) % COUNT] * Math.sin(TAU / COUNT) / 2, 0);
  const restArea = COUNT * body.radius ** 2 * Math.sin(TAU / COUNT) / 2;
  const correction = Math.sqrt(restArea / area);
  return radii.map((radius, index) => ({ x: body.x + Math.cos(index / COUNT * TAU) * radius * correction, y: body.y + Math.sin(index / COUNT * TAU) * radius * correction }));
}
