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
const lastKeyboard = solveForRobots(doorCodes, 3);
const res = Array.from(lastKeyboard.entries()).reduce((acc, [key, value]) => {
  const numeric = Number(key.replace('A', ''));
  return acc + value.length * numeric;
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

function getAllFasterPaths(from: Coord, to: Coord, keypad: Keypad): Action[][] {
  const queue: Array<{ coord: Coord; path: Action[]; visited: Set<string> }> =
    [];
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
  return paths;
}

function solveForRobots(
  doorCodes: string[],
  robotCount: number,
): Map<string, Action[]> {
  if (robotCount < 1) throw new Error('Invalid robotCount');

  const getFasterPaths = memoize(getAllFasterPaths, {
    createKey: (from, to, keypad) =>
      `${from.x},${from.y},${to.x},${to.y},${keypad === numericKeypad ? 'n' : 'd'}`,
  });

  const solve = memoize(
    (from: Coord, to: Coord, remainingRobots: number): Action[] => {
      const keypad: Keypad =
        remainingRobots === robotCount ? numericKeypad : directionalKeypad;

      if (remainingRobots === 1) {
        return getFasterPaths(from, to, keypad)[0];
      }

      const paths: Action[][] = getFasterPaths(from, to, keypad);
      return findBestPath(paths, solve, remainingRobots);
    },
    {
      mustMemo: (_, __, remainingRobots) => remainingRobots > 1,
    },
  );

  const res = new Map<string, Action[]>();
  for (const numVal of doorCodes) {
    const path = computePathForCode(numVal, numericKeypad, solve, robotCount);
    res.set(numVal, path);
  }

  return res;
}

function findBestPath(
  paths: Action[][],
  solve: (from: Coord, to: Coord, remainingRobots: number) => Action[],
  remainingRobots: number,
): Action[] {
  let bestPath: Action[] = [];

  for (const path of paths) {
    let fromDirectional = directionalKeypad.start;
    const currentPath: Action[] = [];

    for (const step of path) {
      const toDirectional = directionalKeypad.coords[step];
      const subPath = solve(
        fromDirectional,
        toDirectional,
        remainingRobots - 1,
      );
      currentPath.push(...subPath);
      fromDirectional = toDirectional;
    }

    if (bestPath.length === 0 || currentPath.length < bestPath.length) {
      bestPath = currentPath;
    }
  }

  return bestPath;
}

function computePathForCode(
  code: string,
  keypad: Keypad,
  solve: (from: Coord, to: Coord, remainingRobots: number) => Action[],
  robotCount: number,
): Action[] {
  let from = keypad.start;
  const path: Action[] = [];

  for (const char of code) {
    const to = keypad.coords[char];
    const subPath = solve(from, to, robotCount);
    path.push(...subPath);
    from = to;
  }

  return path;
}

function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  options: {
    mustMemo?: (...args: T) => boolean;
    createKey?: (...args: T) => string;
  } = {},
): (...args: T) => R {
  const {
    mustMemo = () => true,
    createKey = (...args: T) =>
      args.length === 0 ? '__no_args_:0__' : JSON.stringify(args),
  } = options;
  const cache = new Map<string, R>();

  return function (...args: T): R {
    const key = createKey(...args);

    if (cache.has(key)) {
      const cachedResult = cache.get(key);
      if (cachedResult !== undefined) {
        return cachedResult;
      }
    }
    const res: R = fn(...args);
    if (mustMemo(...args)) {
      cache.set(key, res);
    }
    return res;
  };
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
