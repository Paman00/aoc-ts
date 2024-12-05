// Path: src/2024/day05
import { openInput } from '../openInput.ts';

const file = openInput(2024, 5);

const [rules, pages]= parseData(file);

const incorrectPages = getIncorrectPages(rules, pages);

const orderedPages = orderPagesWithRules(rules, incorrectPages);

const res = sumMiddleNumbers(orderedPages);
console.log(res);

function orderPagesWithRules(rules: Dictionary, pages: number[][]): number[][] {
  pages.forEach((page) => {
    page.sort((a, b) => {
      if (rules[a].includes(b))
        return 1;
      if (rules[b].includes(a))
        return -1;
      return 0;
    });
  });
  return pages;
}

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

function getIncorrectPages (rules: Dictionary, pages: number[][]): number[][] {
  const incorrectPages: number[][] = pages.filter((page) => {
    for (let i = 0; i < page.length - 1; i++) {
      for (let j = i + 1; j < page.length; j++) {
        if (rules[page[i]].includes(page[j]))
          return true;
      }
    }
    return false;
  });
  return incorrectPages;
}

function sumMiddleNumbers(arr: number[][]): number {
  return arr.reduce((acc, page) => acc + page[Math.floor(page.length / 2)], 0);
}

interface Dictionary {
  [key: string]: number[];
}
