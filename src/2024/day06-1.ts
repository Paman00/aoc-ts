// Path: src/2024/day06
import { openInput } from '../openInput.ts';

const file = openInput(2024, 6);

const [map, start] = parseData(file)  ;
const res = solveMap(map, start);

console.log(res);

function parseData(file: string): [string[], number[]] {
  const lines = file.split('\n').slice(0, -1);
  for(let i = 0; i < lines.length; i++) {
    const ubi = lines[i].indexOf('^');
    if (ubi !== -1)
      return [lines, [i, ubi]];
  }
  return [lines, [0, 0]];
}

function solveMap(map: string[], start: number[]): number {
  const directions: { [key in Direction]: [number, number] } = {
    [Direction.top]: [-1, 0], [Direction.right]: [0, 1], [Direction.bottom]: [1, 0], [Direction.left]: [0, -1]
  };
  const visited = new Set<string>();
  let pos = start;
  let dir = Direction.top;
  let uniqueSteps = 1; // I'm not sure if the start position should be counted, but without it the result is 1 less
  visited.add(pos.toString());
  while (true) {
    const nextPos = [pos[0] + directions[dir][0], pos[1] + directions[dir][1]];
    if (!isInLimits(map, nextPos[0], nextPos[1]))
      break ;
    const nextChar = map[nextPos[0]][nextPos[1]];
    if (nextChar === '.' || nextChar === '^') {
      pos = nextPos;
      if (!visited.has(pos.toString())) {
        visited.add(pos.toString());
        uniqueSteps++;
      }
    }
    else if (nextChar === '#') {
      dir = (dir + 1) % 4; // enum trick
    }
  }
  return uniqueSteps;
}

function isInLimits(map: string[], x: number, y: number): boolean {
  return (x >= 0 && x < map.length) && (y >= 0 && y < map[0].length);
}

enum Direction {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3
}
