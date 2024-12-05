// Path: src/2024/day04
import { openInput } from '../openInput.ts';

const file = openInput(2024, 4);
const res = getQMASinX(file);

console.log(res);

function getQMASinX(file: string): number {
  const lines = file.split('\n');
  let res = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[0].length; j++) {
      if (lines[i][j] === 'A' && checkDiagonals(lines, i, j))
        res++;
    }
  }
  return res;
}

function checkDiagonals(lines: string[], i: number, j: number): boolean {
  const firstDiagonal: Direction[] = [
    { x: 1, y: 1 },
    { x: -1, y: -1 },
  ];
  const secondDiagonal: Direction[] = [
    { x: 1, y: -1 },
    { x: -1, y: 1 },
  ];

  if (!checkDiagonal(lines, i, j, firstDiagonal)) return false;
  if (!checkDiagonal(lines, i, j, secondDiagonal)) return false;
  return true;
}

function checkDiagonal(lines: string[], i: number, j: number, diagonal: Direction[]): boolean {
  let first: string;

  let xPos = j + diagonal[0].x;
  let yPos = i + diagonal[0].y;
  if (!isInLimits(lines, xPos, yPos)) return false;
  if (lines[yPos][xPos] !== 'M' && lines[yPos][xPos] !== 'S')
    return false;
  first = lines[yPos][xPos];

  xPos = j + diagonal[1].x;
  yPos = i + diagonal[1].y;
  if (!isInLimits(lines, xPos, yPos)) return false;
  if ((first === 'M' && lines[yPos][xPos] !== 'S') || (first === 'S' && lines[yPos][xPos] !== 'M'))
    return false;
  return true;
}

function isInLimits(lines: string[], x: number, y: number): boolean {
  return (x >= 0 && x < lines[0].length) && (y >= 0 && y < lines.length);
}

interface Direction {
  x: number;
  y: number;
}
