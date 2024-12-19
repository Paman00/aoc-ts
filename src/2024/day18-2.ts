// Path: src/2024/day18
import { openInput } from '../openInput.ts';

const file = openInput(2024, 18);

const mapWidth = 71;
const mapHeight = 71;
const [bytesMap, remainingCorruptedBytes] = parseData(
  file,
  mapWidth,
  mapHeight,
);
const coords = getBlockByte(
  remainingCorruptedBytes,
  bytesMap,
  mapWidth,
  mapHeight,
);
console.log(coords);

function parseData(
  file: string,
  mapWidth: number,
  mapHeight: number,
): [string[], string[]] {
  const corruptedBytes = file.trim().split('\n');
  const remainingCorruptedBytes = corruptedBytes.splice(1024);
  const bytesMap = Array.from({ length: mapHeight }, () =>
    Array.from({ length: mapWidth }, () => '.'),
  );
  corruptedBytes.forEach((byte) => {
    const [x, y] = byte.split(',').map(Number);
    bytesMap[y][x] = '#';
  });
  return [bytesMap.map((row) => row.join('')), remainingCorruptedBytes];
}

function getStepsCount(
  bytesMap: string[],
  mapWidth: number,
  mapHeight: number,
): number {
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const visited = new Set<string>();
  const queue: number[][] = [];

  const start = [0, 0, 0];
  const goal = `${mapWidth - 1},${mapHeight - 1}`;
  queue.push(start);
  while (queue.length > 0) {
    const next = queue.shift();
    if (next === undefined) break;
    const [x, y, steps] = next;
    const key = `${x},${y}`;
    if (key === goal) {
      return steps;
    }
    for (const [dy, dx] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const nKey = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= mapWidth || ny >= mapHeight) continue;
      if (bytesMap[ny][nx] === '#' || visited.has(nKey)) continue;
      visited.add(nKey);
      queue.push([nx, ny, steps + 1]);
    }
  }
  return -1;
}

function getBlockByte(
  remainingCorruptedBytes: string[],
  bytesMap: string[],
  mapWidth: number,
  mapHeight: number,
): string {
  for (const byte of remainingCorruptedBytes) {
    const [x, y] = byte.split(',').map(Number);

    bytesMap[y] =
      bytesMap[y].substring(0, x) + '#' + bytesMap[y].substring(x + 1);
    const steps = getStepsCount(bytesMap, mapWidth, mapHeight);
    if (steps === -1) {
      return `${x},${y}`;
    }
  }
  throw new Error('No byte found');
}
