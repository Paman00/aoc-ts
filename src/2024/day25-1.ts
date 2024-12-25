// Path: src/2024/day25
import { openInput } from '../openInput.ts';

const file = openInput(2024, 25);
const [keys, locks] = parseData(file);
const res = getUniqueCombinations(keys, locks);
console.log(res);

function parseData(file: string): [number[][], number[][]] {
  const keys = getCoincidences(file, /((?:[.#]{5}\s){6}#####)/g);
  const locks = getCoincidences(file, /(#####(?:\s[.#]{5}){6})/g);

  return [keys, locks];
}

function getCoincidences(file: string, regexp: RegExp): number[][] {
  const matches = file.match(regexp);
  if (matches === null) return [];

  const coincidences = [];
  for (const match of matches) {
    const res: number[] = Array.from({ length: 5 }, () => 0);
    const matchLines = match.split('\n');
    for (let i = 1; i < matchLines.length - 1; i++) {
      for (let j = 0; j < matchLines[i].length; j++) {
        if (matchLines[i][j] === '#') {
          res[j]++;
        }
      }
    }
    coincidences.push(res);
  }
  return coincidences;
}

function getUniqueCombinations(keys: number[][], locks: number[][]): number {
  let combinations = 0;
  for (const lock of locks) {
    for (const key of keys) {
      if (lock.every((val, i) => key[i] + val <= 5)) {
        combinations++;
      }
    }
  }
  return combinations;
}
