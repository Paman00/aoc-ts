// Path: src/2024/day02
import { openInput } from '../openInput.ts';

const file = openInput(2024, 2);

const lines = file.split('\n').slice(0, -1);

const res = lines.map((line) => isSafe(line)).filter(Boolean).length;
console.log(res);

function isSafe(input: string): boolean {
  const numbers: number[] = input.split(' ').map(Number);
  // 1: increasing, -1: decreasing
  const direction: 1 | -1 = numbers[1] > numbers[0] ? 1 : -1;
  return numbers.every((n, i) => {
    if (i === 0) return true;
    const past = numbers[i - 1];
    if (n === past) return false;
    if (direction === 1 && past < n) return n - past <= 3;
    if (direction === -1 && past > n) return past - n <= 3;
    return false;
  });
}
