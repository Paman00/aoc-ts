// Path: src/2024/day15
import { openInput } from '../openInput.ts';

const file = openInput(2024, 15);
const [initialMap, moves] = parseData(file);
const map = simulateMoves(initialMap, moves);
const result = calculateGPS(map);
console.log(result);

function parseData(data: string): [string[][], Direction[]] {
  const lines = data.trim().split('\n');
  const separatorIndex = lines.indexOf('');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- trusted input
  const moves = lines
    .slice(separatorIndex + 1)
    .join('')
    .split('') as Direction[];
  const map = lines.slice(0, separatorIndex).map((line) => line.split(''));
  return [map, moves];
}

function simulateMoves(map: string[][], moves: Direction[]): string[][] {
  const directions = {
    [Direction.top]: [0, -1],
    [Direction.bottom]: [0, 1],
    [Direction.right]: [1, 0],
    [Direction.left]: [-1, 0],
  };

  const moveBox = (dir: Direction, [y, x]: number[]): boolean => {
    const [dx, dy] = directions[dir];
    const nextY = y + dy;
    const nextX = x + dx;
    if (!isInLimits(map, nextX, nextY) || map[nextY][nextX] === '#') {
      return false;
    }
    if (map[nextY][nextX] === 'O' && !moveBox(dir, [nextY, nextX])) {
      return false;
    }
    map[y][x] = '.';
    map[nextY][nextX] = 'O';
    return true;
  };

  const moveRobot = (dir: Direction, [y, x]: number[]): number[] => {
    const [dx, dy] = directions[dir];
    const nextY = y + dy;
    const nextX = x + dx;
    if (!isInLimits(map, nextX, nextY) || map[nextY][nextX] === '#') {
      return [y, x];
    }
    if (map[nextY][nextX] === 'O' && !moveBox(dir, [nextY, nextX])) {
      return [y, x];
    }
    map[y][x] = '.';
    map[nextY][nextX] = '@';
    return [nextY, nextX];
  };

  let [robotY, robotX] = findRobot(map);

  for (const move of moves) {
    [robotY, robotX] = moveRobot(move, [robotY, robotX]);
  }
  return map;
}

function isInLimits(map: string[][], x: number, y: number): boolean {
  return y >= 0 && y < map.length && x >= 0 && x < map[0].length;
}

function findRobot(map: string[][]): [number, number] {
  for (let i = 1; i < map.length - 1; i++) {
    const x = map[i].indexOf('@');
    if (x !== -1) {
      return [i, x];
    }
  }
  return [1, 1];
}

function calculateGPS(map: string[][]): number {
  let result = 0;
  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[0].length - 1; j++) {
      if (map[i][j] === 'O') {
        result += i * 100 + j;
      }
    }
  }
  return result;
}

enum Direction {
  top = '^',
  right = '>',
  bottom = 'v',
  left = '<',
}
