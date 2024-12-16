// Path: src/2024/day15
import { openInput } from '../openInput.ts';

const file = openInput(2024, 15);
const [initialMap, moves] = parseData(file);
const map = simulateMoves(initialMap, moves);
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
  const directions = {
    [Direction.top]: { x: 0, y: -1 },
    [Direction.bottom]: { x: 0, y: 1 },
    [Direction.right]: { x: 1, y: 0 },
    [Direction.left]: { x: -1, y: 0 },
  };

  const canMoveBox = (dir: Direction, [y, x]: number[]): boolean => {
    const { x: dx, y: dy } = directions[dir];
    const nextX1 = x + dx;
    const nextY = y + dy;
    if (dir === Direction.top || dir === Direction.bottom) {
      const nextX2 = x + 1;
      if (!isInLimits(map, nextX1, nextY) || map[nextY][nextX1] === '#') {
        return false;
      }
      if (!isInLimits(map, nextX2, nextY) || map[nextY][nextX2] === '#') {
        return false;
      }
      const nextChar1 = map[nextY][nextX1];
      const nextChar2 = map[nextY][nextX2];
      if (nextChar1 === '[' || nextChar1 === ']') {
        const xStartBox = nextChar1 === '[' ? nextX1 : nextX1 - 1;
        if (!canMoveBox(dir, [nextY, xStartBox])) return false;
      }
      if (nextChar2 === '[' || nextChar2 === ']') {
        const xStartBox = nextChar2 === '[' ? nextX2 : nextX2 - 1;
        if (!canMoveBox(dir, [nextY, xStartBox])) return false;
      }
    } else {
      const nextX2 = x + 2 * dx;
      const nextChar1 = map[nextY][nextX1];
      const nextChar2 = map[nextY][nextX2];
      if (!isInLimits(map, nextX1, nextY) || nextChar1 === '#') {
        return false;
      }
      if (
        dir === Direction.right &&
        (!isInLimits(map, nextX2, nextY) || nextChar2 === '#')
      ) {
        return false;
      }
      if (dir === Direction.right && nextChar2 === '[') {
        return canMoveBox(dir, [nextY, nextX2]);
      } else if (dir === Direction.left && nextChar1 === ']') {
        return canMoveBox(dir, [nextY, nextX2]);
      }
    }
    return true;
  };

  const moveBox = (dir: Direction, [y, x]: number[]): void => {
    const { x: dx, y: dy } = directions[dir];
    const nextY = y + dy;
    const nextX1 = x + dx;
    if (dir === Direction.top || dir === Direction.bottom) {
      const nextX2 = x + 1;
      if (map[nextY][nextX1] === '[' || map[nextY][nextX1] === ']') {
        const xstartBox = map[nextY][nextX1] === '[' ? nextX1 : nextX1 - 1;
        moveBox(dir, [nextY, xstartBox]);
      }
      if (map[nextY][nextX2] === '[' || map[nextY][nextX2] === ']') {
        const xstartBox = map[nextY][nextX2] === '[' ? nextX2 : nextX2 - 1;
        moveBox(dir, [nextY, xstartBox]);
      }
      updateItem(map, [y, x], [nextY, nextX1], '[]');
    } else {
      const nextX2 = x + 2 * dx;
      if (dir === Direction.right && map[nextY][nextX2] === '[') {
        moveBox(dir, [y, nextX2]);
      } else if (dir === Direction.left && map[nextY][nextX1] === ']') {
        moveBox(dir, [y, nextX2]);
      }
      updateItem(map, [y, x], [y, nextX1], '[]');
    }
  };

  const moveRobot = (dir: Direction, [y, x]: number[]): number[] => {
    const { x: dx, y: dy } = directions[dir];
    const nextY = y + dy;
    const nextX = x + dx;
    const nextChar = map[nextY][nextX];
    if (!isInLimits(map, nextX, nextY) || nextChar === '#') {
      return [y, x];
    }
    if (nextChar === '[' || nextChar === ']') {
      const xStartBox = nextChar === '[' ? nextX : nextX - 1;
      if (!canMoveBox(dir, [nextY, xStartBox])) {
        return [y, x];
      }
      moveBox(dir, [nextY, xStartBox]);
    }
    updateItem(map, [y, x], [nextY, nextX], '@');
    return [nextY, nextX];
  };

  let [robotY, robotX] = findRobot(map);

  for (const move of moves) {
    [robotY, robotX] = moveRobot(move, [robotY, robotX]);
  }
  return map;
}

function findRobot(map: string[]): [number, number] {
  for (let i = 1; i < map.length - 1; i++) {
    const x = map[i].indexOf('@');
    if (x !== -1) {
      return [i, x];
    }
  }
  return [1, 2];
}

function isInLimits(map: string[], x: number, y: number): boolean {
  return y >= 0 && y < map.length && x >= 0 && x < map[0].length;
}

function updateItem(
  map: string[],
  pastC: number[],
  newC: number[],
  item: string,
): void {
  const [y, x] = pastC;
  const [newY, newX] = newC;
  map[y] =
    `${map[y].slice(0, x)}${'.'.repeat(item.length)}${map[y].slice(x + item.length)}`;
  map[newY] =
    `${map[newY].slice(0, newX)}${item}${map[newY].slice(newX + item.length)}`;
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
