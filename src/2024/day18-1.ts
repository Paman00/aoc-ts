// Path: src/2024/day18
import { openInput } from '../openInput.ts';

const file = openInput(2024, 18);

const bytesMap = parseData(file);
const steps = getStepsCount(bytesMap);
console.log(steps);

function parseData(file: string): string[] {
  const corruptedBytes = file.trim().split('\n');
  const bytesMap = Array.from({ length: 71 }, () =>
    Array.from({ length: 71 }, () => '.'),
  );
  for (let i = 0; i < 1024; i++) {
    const [x, y] = corruptedBytes[i].split(',').map(Number);
    bytesMap[y][x] = '#';
  }
  return bytesMap.map((row) => row.join(''));
}

function getStepsCount(bytesMap: string[]): number {
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const visited = new Set<string>();
  const queue: number[][] = [];

  const start = [0, 0, 0];
  const goal = '70,70';
  queue.push(start);
  while (queue.length > 0) {
    const next = queue.shift();
    if (next === undefined) break;
    const [x, y, steps] = next;
    const key = `${y},${x}`;
    if (key === goal) {
      return steps;
    }
    for (const [dy, dx] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const nKey = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx > 70 || ny > 70) continue;
      if (bytesMap[ny][nx] === '#' || visited.has(nKey)) continue;
      visited.add(nKey);
      queue.push([nx, ny, steps + 1]);
    }
  }
  return -1;
}
