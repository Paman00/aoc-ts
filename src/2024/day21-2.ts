// Path: src/2024/day21
import { openInput } from '../openInput.ts';

const file = openInput(2024, 21);
const doorCodes = file.trim().split('\n');
enum Direction {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}
const numericKeypad = parseKeypad(
  [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['', '0', 'A'],
  ],
  'A',
);
const directionalKeypad = parseKeypad(
  [
    ['', '^', 'A'],
    ['<', 'v', '>'],
  ],
  'A',
);
const directions: Record<Direction, Coord> = {
  [Direction.Up]: { x: 0, y: -1 },
  [Direction.Down]: { x: 0, y: 1 },
  [Direction.Left]: { x: -1, y: 0 },
  [Direction.Right]: { x: 1, y: 0 },
};

const lastKeyboard = solveForRobots(doorCodes, 26);
const res = Array.from(lastKeyboard.entries()).reduce((acc, [key, value]) => {
  const numeric = Number(key.replace('A', ''));
  return acc + value * numeric;
}, 0);
console.log(res);

function parseKeypad(pad: string[][], start: string): Keypad {
  const coords: Record<string, Coord> = {};
  for (let y = 0; y < pad.length; y++) {
    for (let x = 0; x < pad[y].length; x++) {
      if (pad[y][x] === '') continue;
      coords[pad[y][x]] = { x, y };
    }
  }
  return {
    pad,
    coords,
    start: coords[start] ?? { x: 0, y: 0 },
  };
}

function solveForRobots(
  doorCodes: string[],
  robotCount: number,
): Map<string, number> {
  if (robotCount < 1) throw new Error('Invalid robotCount');

  const memoFasterPaths = new Map<string, Action[][]>();
  const memoSolve = new Map<string, number>();

  const res = new Map<string, number>();
  for (const numVal of doorCodes) {
    const path = computePathForCode(numVal, numericKeypad, robotCount);
    res.set(numVal, path);
  }
  return res;

  function getFasterPaths(from: Coord, to: Coord, keypad: Keypad): Action[][] {
    const key = `${from.x},${from.y},${to.x},${to.y},${keypad === numericKeypad ? 'n' : 'd'}`;
    if (memoFasterPaths.has(key)) return memoFasterPaths.get(key) ?? [];

    const queue: QueueElement[] = [];
    let shortestLength = Infinity;
    const paths: Action[][] = [];

    queue.push({ coord: from, path: [], visited: new Set() });
    while (queue.length > 0) {
      const next = queue.shift();
      if (next === undefined) break;
      const { coord, path, visited } = next;

      if (path.length > shortestLength) break;
      if (coord.x === to.x && coord.y === to.y) {
        shortestLength = path.length;
        paths.push([...path, 'A']);
        visited.clear();
      }

      const key = `${coord.x},${coord.y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- entry keys are Direction enum
      for (const [dir, { x, y }] of Object.entries(directions) as Array<
        [Direction, Coord]
      >) {
        const nx = coord.x + x;
        const ny = coord.y + y;

        if (
          ny < 0 ||
          ny >= keypad.pad.length ||
          nx < 0 ||
          nx >= keypad.pad[0].length
        ) {
          continue;
        }
        if (keypad.pad[ny][nx] === '') continue;

        queue.push({
          coord: { x: nx, y: ny },
          path: [...path, dir],
          visited: new Set(visited),
        });
      }
      visited.clear();
    }
    memoFasterPaths.set(key, paths);
    return paths;
  }

  function solve(from: Coord, to: Coord, remainingRobots: number): number {
    const key = `${from.x},${from.y},${to.x},${to.y},${remainingRobots}`;
    if (memoSolve.has(key)) return memoSolve.get(key) ?? 0;

    const keypad =
      remainingRobots === robotCount ? numericKeypad : directionalKeypad;
    if (remainingRobots === 1) {
      return getFasterPaths(from, to, keypad)[0].length;
    }

    const paths = getFasterPaths(from, to, keypad);
    const bestPath = findBestPath(paths, remainingRobots);
    memoSolve.set(key, bestPath);
    return bestPath;
  }

  function findBestPath(paths: Action[][], remainingRobots: number): number {
    let bestPath = Infinity;

    for (const path of paths) {
      let fromDirectional = directionalKeypad.start;
      let currentPath = 0;

      for (const step of path) {
        const toDirectional = directionalKeypad.coords[step];
        const subPathLength = solve(
          fromDirectional,
          toDirectional,
          remainingRobots - 1,
        );
        currentPath += subPathLength;
        fromDirectional = toDirectional;
      }

      if (currentPath < bestPath) {
        bestPath = currentPath;
      }
    }

    return bestPath;
  }

  function computePathForCode(
    code: string,
    keypad: Keypad,
    robotCount: number,
  ): number {
    let from = keypad.start;
    let path = 0;

    for (const char of code) {
      const to = keypad.coords[char];
      const pathLenght = solve(from, to, robotCount);
      path += pathLenght;
      from = to;
    }

    return path;
  }
}

type Action = Direction | 'A';
interface Coord {
  x: number;
  y: number;
}
interface Keypad {
  pad: string[][];
  start: Coord;
  coords: Record<string, Coord>;
}
interface QueueElement {
  coord: Coord;
  path: Action[];
  visited: Set<string>;
}
