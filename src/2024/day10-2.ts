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
  const trailheads: TrailHead = {};

  const visitPoint = (point: Point, expectedValue: number): number => {
    if (point[0] < 0 || point[0] >= data.length || point[1] < 0 || point[1] >= data[0].length) return 0;
    if (data[point[0]][point[1]] !== expectedValue) return 0;
    if (expectedValue === 9) return 1;
    const key = point.toString();
    if (key in coordsVisited) return coordsVisited[key];
    coordsVisited[key] = 0;
    directions.forEach((dir) => {
      coordsVisited[key] += visitPoint([point[0] + dir[0], point[1] + dir[1]], expectedValue + 1);
    });
    return coordsVisited[key];
  };
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === 0) {
        const key = [i, j].toString();
        trailheads[key] = visitPoint([i, j], 0);
      }
    }
  }
  return trailheads;
}

function countTrailheads(trailheads: TrailHead): number {
  return Object.values(trailheads).reduce((acc, count) => acc + count, 0);
}

type Point = [number, number];

type PointCount = Record<string, number>;
type TrailHead = PointCount;
