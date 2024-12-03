// Path: src/2024/day03
import { openInput } from '../openInput.ts';

const file = openInput(2024, 3);

const data = parseData(file);
const res = mulAll(data);
console.log(res)

function parseData(input: string): number[][] {
  const mulRegex = /mul\(\d{1,3},\d{1,3}\)/;
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null = null;
  let isNextValid = true;
  while (match = mulRegex.exec(input)) {
    isNextValid = isValidMatch(match, input, isNextValid);
    if (isNextValid)
      matches.push(match);
    input = input.slice(match.index + match[0].length);
  }
  return matches.map(match => {
    const [a, b] = match[0].slice(4, -1).split(',').map(Number);
    return [a, b];
  });
}

function isValidMatch(match: RegExpExecArray, input: string, pastValid: boolean): boolean {
  const doRegex = /do\(\)/;
  const dontRegex = /don't\(\)/;

  const beforeInput = input.slice(0, match.index);

  const lastDo = getLastMatch(doRegex, beforeInput);
  const lastDont = getLastMatch(dontRegex, beforeInput);
  if (!lastDo && !lastDont)
    return pastValid;
  if (!lastDont)
    return true;
  if (lastDo && lastDo.index > lastDont.index)
    return true;
  return false;
}

function getLastMatch(regex: RegExp, input: string): RegExpExecArray | null {
  let lastMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null = null;
  while (lastMatch = regex.exec(input)) {
    match = lastMatch;
    input = input.slice(match.index + match[0].length);
  }
  return match;
}

function mulAll(data: number[][]): number {
  return data.reduce((acc, [a, b]) => (a * b) + acc, 0);
}
