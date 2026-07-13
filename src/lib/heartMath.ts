export type HeartParticleData = {
  positions: Float32Array;
  colors: Float32Array;
};

function random(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function createHeartParticleData(count: number, seedOffset = 0): HeartParticleData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    [1, 0.08, 0.52],
    [1, 0.28, 0.68],
    [1, 0.72, 0.88],
    [1, 0.95, 0.98],
    [1, 0.18, 0.36],
  ];

  for (let index = 0; index < count; index += 1) {
    const t = random(index + 11 + seedOffset) * Math.PI * 2;
    const fill = 0.15 + random(index + 101 + seedOffset) * 0.85;
    const noise = (random(index + 211 + seedOffset) - 0.5) * 0.28;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const z = (random(index + 307 + seedOffset) - 0.5) * 0.5;

    positions[index * 3] = (x * fill + noise) / 18;
    positions[index * 3 + 1] = (y * fill + noise) / 18;
    positions[index * 3 + 2] = z;

    const color = palette[index % palette.length];
    colors[index * 3] = color[0];
    colors[index * 3 + 1] = color[1];
    colors[index * 3 + 2] = color[2];
  }

  return { positions, colors };
}

export function createHeartContourData(count: number, seedOffset = 5000): HeartParticleData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const t = (index / count) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const z = (random(index + seedOffset) - 0.5) * 0.34;

    positions[index * 3] = x / 18;
    positions[index * 3 + 1] = y / 18;
    positions[index * 3 + 2] = z;
    colors[index * 3] = 1;
    colors[index * 3 + 1] = 0.22;
    colors[index * 3 + 2] = 0.66;
  }

  return { positions, colors };
}
