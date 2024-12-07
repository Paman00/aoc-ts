// Path: src/2024/day06
import { openInput } from '../openInput.ts';

const file = openInput(2024, 6);

const [map, start] = parseData(file);
const res = getMapsInLoop(map, start);
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

function getMapsInLoop(map: string[], start: number[]) {
  const directions: Directions = {
    [Direction.top]: [-1, 0], [Direction.right]: [0, 1], [Direction.bottom]: [1, 0], [Direction.left]: [0, -1]
  };
  const visited = getVisitedMap(map, start, directions);
  let count = 0;
  visited.forEach((posVisited) => {
    const pos = posVisited.split(',').map(Number);
    if (isMapTravelLoop(map, start, pos, directions)) {
      count++;
    }
  });
  return count;
}

function getVisitedMap(map: string[], start: number[], directions: Directions): Set<string> {
  const visited = new Set<string>();
  let pos = start;
  let dir = Direction.top;
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
      }
    }
    else if (nextChar === '#') {
      dir = (dir + 1) % 4; // enum trick
    }
  }
  return visited;
}

function isMapTravelLoop(map: string[], start: number[], newObstacle: number[], directions: Directions): boolean {
  const newMap = [...map];
  newMap[newObstacle[0]] = newMap[newObstacle[0]].substring(0, newObstacle[1]) + 'O' + newMap[newObstacle[0]].substring(newObstacle[1] + 1);
  const visited = new Map<string, number>();
  let pos = start;
  let dir = Direction.top;
  visited.set(pos.toString(), 1);
  while (true) {
    const nextPos = [pos[0] + directions[dir][0], pos[1] + directions[dir][1]];
    if (!isInLimits(newMap, nextPos[0], nextPos[1]))
      break ;
    const nextChar = newMap[nextPos[0]][nextPos[1]];
    if (nextChar === '.' || nextChar === '^') {
      pos = nextPos;
      visited.set(pos.toString(), (visited.get(pos.toString()) ?? 0) + 1);
      if (visited.get(pos.toString())! > 4) {
        return true;
      }
    }
    else {
      dir = (dir + 1) % 4; // enum trick
    }
  }
  return false;
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

type Directions = { [key in Direction]: [number, number] };
