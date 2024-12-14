// Path: src/2024/day13
import { openInput } from '../openInput.ts';

const file = openInput(2024, 13);

const MAX_PRESSED = 100;
const TOKENS_A = 3;
const TOKENS_B = 1;

const entries = parseData(file);
const res = getAllMinimumTokens(entries);
console.log(res);

function parseData(file: string): Entry[] {
  const regexp =
    /Button A: X\+(\d+), Y\+(\d+)\s+Button B: X\+(\d+), Y\+(\d+)\s+Prize: X=(\d+), Y=(\d+)\s+/;
  const entries: Entry[] = [];
  let match: RegExpExecArray | null = null;
  while ((match = regexp.exec(file)) !== null) {
    const [, ax, ay, bx, by, px, py] = match.map(Number);
    entries.push({
      a: { x: ax, y: ay, cost: TOKENS_A },
      b: { x: bx, y: by, cost: TOKENS_B },
      prize: { targetX: px, targetY: py },
    });
    file = file.slice(match.index + match[0].length);
  }
  return entries;
}

function getMinimumTokens(entry: Entry): number {
  let minimumTokens = Infinity;
  for (let a = 0; a <= MAX_PRESSED; a++) {
    for (let b = 0; b <= MAX_PRESSED; b++) {
      const currentX = a * entry.a.x + b * entry.b.x;
      const currentY = a * entry.a.y + b * entry.b.y;
      if (
        currentX === entry.prize.targetX &&
        currentY === entry.prize.targetY
      ) {
        const tokens = a * entry.a.cost + b * entry.b.cost;
        if (tokens < minimumTokens) {
          minimumTokens = tokens;
        }
      }
    }
  }
  return minimumTokens;
}

function getAllMinimumTokens(entries: Entry[]): number {
  let minTokens = 0;
  for (const entry of entries) {
    const tokens = getMinimumTokens(entry);
    if (tokens === Infinity) continue;
    minTokens += tokens;
  }
  return minTokens;
}

interface Prize {
  targetX: number;
  targetY: number;
}

interface Button {
  x: number;
  y: number;
  cost: number;
}

interface Entry {
  a: Button;
  b: Button;
  prize: Prize;
}
