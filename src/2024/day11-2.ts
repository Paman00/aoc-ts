// Path: src/2024/day11
import { openInput } from '../openInput.ts';

const file = openInput(2024, 11);
const stones = file.trim().split(' ');
const res = countBlinks(75, stones);
console.log(res);

function countBlinks(times: number, stones: string[]): number {
  const memo: Dict = {};
  const countBlink = (remaining: number, stone: string): number => {
    const key = `${stone}:${remaining}`;
    if (key in memo) return memo[key];

    if (remaining === 0) return 1;
    if (stone === '0') {
      memo[key] = countBlink(remaining - 1, '1');
    } else if (stone.length % 2 === 0) {
      const half = stone.length / 2;
      const left = parseInt(stone.slice(0, half)).toString();
      const right = parseInt(stone.slice(half)).toString();
      memo[key] = countBlink(remaining - 1, left) + countBlink(remaining - 1, right);
    } else {
      memo[key] = countBlink(remaining - 1, (parseInt(stone) * 2024).toString());
    }
    return memo[key];
  };
  return stones.reduce((acc, stone) => acc + countBlink(times, stone), 0);
}

type Dict = Record<string, number>;
