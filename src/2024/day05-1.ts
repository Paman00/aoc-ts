// Path: src/2024/day05
import { openInput } from '../openInput.ts';

const file = openInput(2024, 5);

const [rules, pages]= parseData(file);
const correctPages = getCorrectPages(rules, pages);
const res = sumMiddleNumbers(correctPages);

console.log(res);

function parseData(file: string): [ Dictionary, number[][]] {
  const lines = file.split('\n');
  const separatorIndex = lines.indexOf('');
  const rulesStr = lines.slice(0, separatorIndex);
  const pagesStr = lines.slice(separatorIndex + 1, -1);
  const rules: Dictionary = {}
  rulesStr.forEach((rule) => {
    const [value, key] = rule.split('|');
    if (!(key in rules))
      rules[key] = [];
    rules[key].push(Number(value));
  });
  const pages = pagesStr.map((page) => page.split(',').map(Number));
  return [rules, pages];
}

function getCorrectPages (rules: Dictionary, pages: number[][]): number[][] {
  const correctPages: number[][] = pages.filter((page) => {
    for (let i = 0; i < page.length - 1; i++) {
      for (let j = i + 1; j < page.length; j++) {
        if (rules[page[i]].includes(page[j]))
          return false;
      }
    }
    return true;
  });
  return correctPages;
}

function sumMiddleNumbers(arr: number[][]): number {
  return arr.reduce((acc, page) => acc + page[Math.floor(page.length / 2)], 0);
}

interface Dictionary {
  [key: string]: number[];
}
