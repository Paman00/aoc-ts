// Path: src/2024/day13
import { openInput } from '../openInput.ts';

const file = openInput(2024, 13);

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
      prize: { targetX: px + 10000000000000, targetY: py + 10000000000000 },
    });
    file = file.slice(match.index + match[0].length);
  }
  return entries;
}

// a * entry.a.x + b * entry.b.x = entry.prize.targetX
// a * entry.a.y + b * entry.b.y = entry.prize.targetY
function getMinimumTokens(entry: Entry): number {
  const div = entry.b.x * entry.a.y - entry.b.y * entry.a.x;
  if (div === 0) return -1;
  const bTimes =
    (entry.prize.targetX * entry.a.y - entry.prize.targetY * entry.a.x) / div;
  if (bTimes % 1 !== 0) return -1;
  const aTimes = (entry.prize.targetX - bTimes * entry.b.x) / entry.a.x;
  if (aTimes % 1 !== 0) return -1;
  return bTimes * entry.b.cost + aTimes * entry.a.cost;
}

function getAllMinimumTokens(entries: Entry[]): number {
  let minTokens = 0;
  for (const entry of entries) {
    const tokens = getMinimumTokens(entry);
    if (tokens === -1) continue;
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
