// Path: src/2024/day15
import { openInput } from '../openInput.ts';

const file = openInput(2024, 15);
const [initialMap, moves] = parseData(file);
const map = simulateMoves(initialMap, moves);
console.log(map.join('\n'));
const result = calculateGPS(map);
console.log(result);

function parseData(data: string): [string[], Direction[]] {
  const lines = data.trim().split('\n');
  const separatorIndex = lines.indexOf('');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- trusted input
  const moves = lines
    .slice(separatorIndex + 1)
    .join('')
    .split('') as Direction[];
  const map = lines.slice(0, separatorIndex).map((line) => {
    for (let i = 0; i < line.length; i += 2) {
      if (line[i] === '@') {
        line = line.slice(0, i) + '@.' + line.slice(i + 1);
      } else if (line[i] === 'O') {
        line = line.slice(0, i) + '[]' + line.slice(i + 1);
      } else if (line[i] === '#') {
        line = line.slice(0, i) + '##' + line.slice(i + 1);
      } else if (line[i] === '.') {
        line = line.slice(0, i) + '..' + line.slice(i + 1);
      }
    }
    return line;
  });
  return [map, moves];
}

function simulateMoves(map: string[], moves: Direction[]): string[] {
  // TODO: refactor
  const directions = {
    [Direction.top]: { x: 0, y: -1 },
    [Direction.bottom]: { x: 0, y: 1 },
    [Direction.right]: { x: 1, y: 0 },
    [Direction.left]: { x: -1, y: 0 },
  };

  const canMoveBox = (dir: Direction, [y, x]: number[]): boolean => {
    const {/*x: dx,*/y: dy } = directions[dir];
    if (dir === Direction.top || dir === Direction.bottom) {
      const nextY = y + dy;
      const nextX1 = x;
      const nextX2 = x + 1;
      if (!isInLimits(map, nextX1, nextY) || !isInLimits(map, nextX2, nextY) || map[nextY][nextX1] === '#' || map[nextY][nextX2] === '#') {
        return false;
      }
      if ((map[nextY][nextX1] === '[' || map[nextY][nextX1] === ']') && !canMoveBox(dir, [nextY, map[nextY][nextX1] === '[' ? nextX1 : nextX1 - 1])) {
        return false;
      }
      if ((map[nextY][nextX2] === '[' || map[nextY][nextX2] === ']') && !canMoveBox(dir, [nextY, map[nextY][nextX2] === '[' ? nextX2 : nextX2 - 1])) {
        return false;
      }
      return true;
    }
    return true;
  };

  const moveBox = (dir: Direction, [y, x]: number[]): boolean => {
    const { x: dx, y: dy } = directions[dir];
    if (dir === Direction.top || dir === Direction.bottom) {
      const nextY = y + dy;
      const nextX1 = x;
      const nextX2 = x + 1;
      if (!isInLimits(map, nextX1, nextY) || !isInLimits(map, nextX2, nextY) || map[nextY][nextX1] === '#' || map[nextY][nextX2] === '#') {
        return false;
      }
      if ((map[nextY][nextX1] === '[' || map[nextY][nextX1] === ']') && !canMoveBox(dir, [nextY, map[nextY][nextX1] === '[' ? nextX1 : nextX1 - 1])) {
        return false;
      }
      if ((map[nextY][nextX2] === '[' || map[nextY][nextX2] === ']') && !canMoveBox(dir, [nextY, map[nextY][nextX2] === '[' ? nextX2 : nextX2 - 1])) {
        return false;
      }
      if ((map[nextY][nextX1] === '[' || map[nextY][nextX1] === ']') && !moveBox(dir, [nextY, map[nextY][nextX1] === '[' ? nextX1 : nextX1 - 1])) {
        return false;
      }
      if ((map[nextY][nextX2] === '[' || map[nextY][nextX2] === ']') && !moveBox(dir, [nextY, map[nextY][nextX2] === '[' ? nextX2 : nextX2 - 1])) {
        return false;
      }
      map[y] = map[y].slice(0, x) + '..' + map[y].slice(x + 2);
      map[nextY] = map[nextY].slice(0, nextX1) + '[]' + map[nextY].slice(nextX1 + 2);
      return true;
    }
    const nextY = y;
    if (dir === Direction.right) {
      const nextX1 = x + dx;
      const nextX2 = x + 2 * dx;
      if (!isInLimits(map, nextX1, y) || !isInLimits(map, nextX2, y) || map[y][nextX1] === '#' || map[y][nextX2] === '#') {
        return false;
      }
      if (map[y][nextX2] === '[' && !moveBox(dir, [y, nextX2])) {
        return false;
      }
      map[y] = map[y].slice(0, x) + '..' + map[y].slice(x + 2);
      map[y] = map[y].slice(0, nextX1) + '[]' + map[y].slice(nextX1 + 2);
      return true;
    }
    const nextX = x + dx;
    if (!isInLimits(map, nextX, nextY) || map[nextY][nextX] === '#') {
      return false;
    }
    if (map[nextY][nextX] === ']' && !moveBox(dir, [nextY, nextX - 1])) {
      return false;
    }
    map[y] = map[y].slice(0, x) + '..' + map[y].slice(x + 2);
    map[nextY] = map[nextY].slice(0, nextX) + '[]' + map[nextY].slice(nextX + 2);
    return true;
  };

  const moveRobot = (dir: Direction, [y, x]: number[]): number[] => {
    const { x: dx, y: dy } = directions[dir];
    const nextY = y + dy;
    const nextX = x + dx;
    const nextChar = map[nextY][nextX];
    if (!isInLimits(map, nextX, nextY) || nextChar === '#') {
      return [y, x];
    }
    if ((nextChar === '[' || nextChar === ']') && !moveBox(dir, [nextY, nextChar === '[' ? nextX : nextX - 1])) {
      return [y, x];
    }
    map[y] = map[y].slice(0, x) + '.' + map[y].slice(x + 1);
    map[nextY] = map[nextY].slice(0, nextX) + '@' + map[nextY].slice(nextX + 1);
    return [nextY, nextX];
  };

  let [robotY, robotX] = findRobot(map);

  for (const move of moves) {
    [robotY, robotX] = moveRobot(move, [robotY, robotX]);
  }
  return map;
}

function isInLimits(map: string[], x: number, y: number): boolean {
  return y >= 0 && y < map.length && x >= 0 && x < map[0].length;
}

function findRobot(map: string[]): [number, number] {
  for (let i = 1; i < map.length - 1; i++) {
    const x = map[i].indexOf('@');
    if (x !== -1) {
      return [i, x];
    }
  }
  return [1, 1];
}

function calculateGPS(map: string[]): number {
  let result = 0;
  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 2; j < map[0].length - 2; j++) {
      if (map[i][j] === '[') {
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
