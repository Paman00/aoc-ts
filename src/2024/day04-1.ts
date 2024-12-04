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
      if (lines[i][j] === 'X')
        res += countCoincidences(lines, i, j, lines.length, lines[0].length);
    }
  }
  return res;
}

function countCoincidences(lines: string[], i: number, j: number, linesQ: number, lineL: number): number {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },

    { x: 0, y: 1 },
    { x: 0, y: -1 },

    { x: 1, y: 1 },
    { x: 1, y: -1 },

    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];
  const string = "XMAS";
  let res = 0;
  directions.forEach((direction) => {
    let index = 1;
    let x1 = j;
    let y1 = i;
    while (index < 4) {
      x1 += direction.x;
      y1 += direction.y;
      if (x1 < 0 || x1 >= lineL || y1 < 0 || y1 >= linesQ) break;
      if (lines[y1][x1] === string[index]) index++;
      else break;
    }
    if (index === 4) res++;
  });
  return res;
}
