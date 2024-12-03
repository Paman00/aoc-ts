// Path: src/2024/day03
import { openInput } from '../openInput.ts';

const file = openInput(2024, 3);

const data = parseData(file);
const res = mulAll(data);
console.log(res)

function parseData(input: string): number[][] {
  const regex = /mul\(\d{1,3},\d{1,3}\)/;
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null = null;
  do {
    match = regex.exec(input);
    if (match) {
      matches.push(match);
      input = input.slice(match.index + match[0].length);
    }
  } while (match);
  return matches.map(match => {
    const [a, b] = match[0].slice(4, -1).split(',').map(Number);
    return [a, b];
  });
}

function mulAll(data: number[][]): number {
  return data.reduce((acc, [a, b]) => (a * b) + acc, 0);
}
