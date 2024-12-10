// Path: src/2024/day10
import { openInput } from '../openInput.ts';

const file = openInput(2024, 10);
const data = parseData(file);
const trailheads = getTrailheads(data);
const res = countTrailheads(trailheads);
console.log(res);

function parseData(file: string): number[][] {
  return file.trim().split('\n').map((line) => line.split('').map((num) => parseInt(num)));
}

function getTrailheads(data: number[][]): TrailHead {
  const directions = [ [-1, 0], [0, 1], [1, 0], [0, -1] ];

  const coordsVisited: PointCount = {};
  const trailHeads: TrailHead = {};

  const visitPoint = (point: Point, expectedValue: number): Set<string> | undefined => {
    if (point[0] < 0 || point[0] >= data.length || point[1] < 0 || point[1] >= data[0].length) return undefined;
    if (data[point[0]][point[1]] !== expectedValue) return undefined;

    const key = point.toString();
    if (key in coordsVisited) return coordsVisited[key];

    const localSet = new Set<string>();
    if (expectedValue === 9) {
      localSet.add(key);
      coordsVisited[key] = localSet;
      return localSet;
    };

    directions.forEach((dir) => {
      const nextPoint: Point = [point[0] + dir[0], point[1] + dir[1]];
      const nextSet = visitPoint(nextPoint, expectedValue + 1);
      if (nextSet !== undefined)
      {
        nextSet.forEach((coord) => {
          localSet.add(coord);
        });
      }
    });

    if (localSet.size === 0) return undefined;
    coordsVisited[key] = localSet;
    return localSet;
  };
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === 0) {
        const key = [i, j].toString();
        if (key in coordsVisited) continue;
        const set = visitPoint([i, j], 0);
        if (set !== undefined) {
          trailHeads[key] = set;
        }
      }
    }
  }
  return trailHeads;
}

function countTrailheads(trailheads: TrailHead): number {
  const trailHeads = Object.values(trailheads);
  return trailHeads.reduce((acc, set) => acc + set.size, 0);
}

type Point = [number, number];

type PointCount = Record<string, Set<string>>;
type TrailHead = PointCount;
