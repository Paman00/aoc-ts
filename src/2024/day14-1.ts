// Path: src/2024/day14
import { openInput } from '../openInput.ts';

const file = openInput(2024, 14);

const WIDTH_TILES = 101;
const HEIGHT_TILES = 103;
const SECONDS = 100;

const robots = parseData(file);
const res = countRobotsPerCuadrant(moveRobots(robots, SECONDS));
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

function countRobotsPerCuadrant(robots: Robot[]): number {
  const cuadrants = [
    [0, 0],
    [0, 0],
  ];
  const halfWidth = Math.floor(WIDTH_TILES / 2);
  const halfHeight = Math.floor(HEIGHT_TILES / 2);

  for (const robot of robots) {
    const { x, y } = robot.position;
    const cuadrantX = x < halfWidth ? 0 : x > halfWidth ? 1 : -1;
    const cuadrantY = y < halfHeight ? 0 : y > halfHeight ? 1 : -1;

    if (cuadrantX !== -1 && cuadrantY !== -1) {
      cuadrants[cuadrantY][cuadrantX]++;
    }
  }
  return cuadrants[0][0] * cuadrants[0][1] * cuadrants[1][0] * cuadrants[1][1];
}

function moveRobots(robots: Robot[], seconds: number): Robot[] {
  for (const robot of robots) {
    const deltaX = robot.velocity.x * seconds;
    const deltaY = robot.velocity.y * seconds;

    const newX = (robot.position.x + deltaX) % WIDTH_TILES;
    const newY = (robot.position.y + deltaY) % HEIGHT_TILES;

    robot.position.x = (newX + WIDTH_TILES) % WIDTH_TILES;
    robot.position.y = (newY + HEIGHT_TILES) % HEIGHT_TILES;
  }
  return robots;
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
