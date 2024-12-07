// Path: src/2024/day04
import { openInput } from '../openInput.ts';

const file = openInput(2024, 4);
const res = getQXMAS(file);

console.log(res);

function getQXMAS(file: string): number {
  const lines = file.split('\n');
  let res = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[0].length; j++) {
      if (lines[i][j] === 'X') {
        res += checkPattern(lines, i, j, 'XMAS');
      }
    }
  }
  return res;
}

function checkPattern(
  lines: string[],
  i: number,
  j: number,
  pattern: string,
): number {
  const directions: Direction[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },

    { x: 0, y: 1 },
    { x: 0, y: -1 },

    { x: 1, y: 1 },
    { x: 1, y: -1 },

    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  let res = 0;
  directions.forEach(({ x, y }) => {
    let index = 0;
    let xPos = j;
    let yPos = i;
    while (index < pattern.length) {
      if (
        !isInLimits(lines, xPos, yPos) ||
        lines[yPos][xPos] !== pattern[index]
      ) {
        break;
      }
      xPos += x;
      yPos += y;
      index++;
    }
    if (index === 4) res++;
  });
  return res;
}

function isInLimits(lines: string[], x: number, y: number): boolean {
  return x >= 0 && x < lines[0].length && y >= 0 && y < lines.length;
}

interface Direction {
  x: number;
  y: number;
}
