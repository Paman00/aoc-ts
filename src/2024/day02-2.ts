// Path: src/2024/day02
import { openInput } from '../openInput.ts';

const file = openInput(2024, 2);

const lines = file.split('\n').slice(0, -1);

const res = lines.map(isSafe).filter(Boolean).length;
console.log(res);

function isSafe(input: string): boolean {
  const numbers: number[] = input.split(' ').map(Number);
  let wildcards = 1;
  // 0: unknown, 1: increasing, -1: decreasing
  let direction: 0 | 1 | -1 = 0;
  for (let i = 1; i < numbers.length; i++) {
    const diff = numbers[i] - numbers[i - 1];
    if (diff === 0 || Math.abs(diff) > 3) {
      if (wildcards == 0) return false;
      wildcards--;
    } else if (direction === 0) {
      direction = diff > 0 ? 1 : -1;
    } else if ((direction === 1 && diff < 0) || (direction === -1 && diff > 0)) {
      if (wildcards == 0) return false;
      wildcards--;
      direction = diff > 0 ? 1 : -1;
    }
  }
  return true;
}
// * i think i must use a linter

/*
function isSafe(input: string): boolean {
  const numbers: number[] = input.split(' ').map(Number);
  if (isStrictSafe(numbers)) return true;
  for (let i = 0; i < numbers.length; i++) {
    const copy = [...numbers];
    copy.splice(i, 1);
    if (isStrictSafe(copy)) return true;
  }
  return false;
}

function isStrictSafe(numbers: number[]): boolean {
  // 1: increasing, -1: decreasing
  const direction = numbers[1] > numbers[0] ? 1 : -1;
  return numbers.every((n, i) => {
    if (i == 0) return true;
    const past = numbers[i - 1];
    if (n == past) return false;
    if (direction == 1 && past < n) return (n - past <= 3);
    if (direction == -1 && past > n) return (past - n <= 3);
    return false;
  })
}
*/
