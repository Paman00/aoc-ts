// Path: src/2024/day22
import { openInput } from '../openInput.ts';

const file = openInput(2024, 22);

const secretsNumbers = file.trim().split('\n').map(Number);
const res = getMostBananas(secretsNumbers);
console.log(res);

function xor(a: number, b: number): number {
  return Number(BigInt(a) ^ BigInt(b));
}

function randomize(seed: number): number {
  let res = seed;
  res = xor(res, res * 64) % 16777216;
  res = xor(res, Math.floor(res / 32)) % 16777216;
  res = xor(res, res * 2048) % 16777216;
  return res;
}

function getBananas(seed: number, times: number): Banana[] {
  let res = seed;
  const bananas: Banana[] = [];
  bananas.push({ value: res % 10 });
  for (let i = 0; i < times; i++) {
    res = randomize(res);
    const value = res % 10;
    bananas.push({ value, change: value - bananas[i].value });
  }
  return bananas;
}

function getMostBananas(secretsNumbers: number[]): number {
  const sequencesTotal = new Map<string, number>();

  for (const secretNumber of secretsNumbers) {
    const bananas = getBananas(secretNumber, 2000);

    const diferenciesVisited = new Set<string>();
    for (let i = 1; i < bananas.length - 3; i++) {
      const sequence = bananas.slice(i, i + 4);
      const diferencies: number[] = sequence.map((e) => e.change ?? 0);

      const key = diferencies.join(',');
      if (diferenciesVisited.has(key)) continue;
      diferenciesVisited.add(key);

      const countBananas = sequence[sequence.length - 1].value;
      sequencesTotal.set(key, (sequencesTotal.get(key) ?? 0) + countBananas);
    }
  }

  return Math.max(...sequencesTotal.values());
}

interface Banana {
  value: number;
  change?: number;
}
