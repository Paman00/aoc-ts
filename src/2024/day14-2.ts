// Path: src/2024/day14
import { openInput } from '../openInput.ts';

const file = openInput(2024, 14);

const WIDTH_TILES = 101;
const HEIGHT_TILES = 103;

const robots = parseData(file);
const res = obtainSecondsForThree(robots);
printMap(robots);
console.log(res);

function parseData(file: string): Robot[] {
  const regexp = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)\s{0,1}/;
  const robots: Robot[] = [];
  let match: RegExpExecArray | null = null;
  while ((match = regexp.exec(file)) !== null) {
    const [, px, py, vx, vy] = match.map(Number);
    robots.push({
      position: { x: px, y: py },
      velocity: { x: vx, y: vy },
    });
    file = file.slice(match.index + match[0].length);
  }
  return robots;
}

function obtainSecondsForThree(robots: Robot[]): number {
  let seconds = 0;
  let areRobotsUnique = moveRobots(robots, 0);
  if (areRobotsUnique) return seconds;
  while (!(areRobotsUnique = moveRobots(robots, 1))) {
    seconds++;
  }
  return seconds + 1;
}

function moveRobots(robots: Robot[], seconds: number): boolean {
  const uniqueCoords = new Set<string>();
  let areRobotsUnique = true;
  for (const robot of robots) {
    const deltaX = robot.velocity.x * seconds;
    const deltaY = robot.velocity.y * seconds;

    const newX = (robot.position.x + deltaX) % WIDTH_TILES;
    const newY = (robot.position.y + deltaY) % HEIGHT_TILES;

    robot.position.x = (newX + WIDTH_TILES) % WIDTH_TILES;
    robot.position.y = (newY + HEIGHT_TILES) % HEIGHT_TILES;

    if (areRobotsUnique) {
      const coords = `${robot.position.x},${robot.position.y}`;
      if (uniqueCoords.has(coords)) {
        areRobotsUnique = false;
      } else {
        uniqueCoords.add(coords);
      }
    }
  }
  return areRobotsUnique;
}

function printMap(robots: Robot[]): void {
  const map: number[][] = Array.from({ length: HEIGHT_TILES }, () =>
    Array.from({ length: WIDTH_TILES }, () => 0),
  );
  for (const robot of robots) {
    map[robot.position.y][robot.position.x] =
      map[robot.position.y][robot.position.x] + 1;
  }
  for (const row of map) {
    console.log(row.map((v) => (v > 0 ? '#' : '.')).join(''));
  }
  console.log('\n');
}

interface Robot {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
}

/*
moveRobots(robots, 8000);

let seconds = 8000;
const interval = setInterval(() => {
  console.clear();
  const areRobotsUnique = moveRobots(robots, 1);
  printMap(robots);
  if (areRobotsUnique) {
    clearInterval(interval);
    console.log(seconds);
  }
  seconds++;
}, 60);
*/
