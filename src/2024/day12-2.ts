import { openInput } from '../openInput.ts';

const file = openInput(2024, 12);
const garden = file.trim().split('\n');
const totalPrice = calculateGardenPrice(garden);
console.log(totalPrice);

function calculateGardenPrice(garden: string[]): number {
  const directions = [ [0, 1], [1, 0], [0, -1], [-1, 0], ];
  const visited = new Set<string>();
  const regions = new Map<string, Set<string>>();

  const exploreRegion = (i: number, j: number, plantType: string): Set<string> => {
    const region = new Set<string>();
    const queue = [[i, j]];
    region.add(`${i},${j}`);
    visited.add(`${i},${j}`);
    while (queue.length > 0) {
      const value = queue.shift();
      if (value === undefined) break;
      const [x, y] = value;
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (isValidCell(newX, newY, plantType, region)) {
          const key = `${newX},${newY}`;
          region.add(key);
          queue.push([newX, newY]);
          visited.add(key);
        }
      }
    }
    return region;
  };

  function countSides(region: Set<string>): number {
    const edges = new Map<string, string>();
    for (const cell of region) {
      const [x, y] = cell.split(',').map(Number);
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        const key = `${newX},${newY}`;
        if (!region.has(key)) {
          const edgeKey = `${(x + newX) / 2},${(y + newY) / 2}`;
          edges.set(edgeKey, `${(x + newX) / 2 - x},${(y + newY) / 2 - y}`);
        }
      }
    }

    const visitedEdges = new Set<string>();
    let sides = 0;
    for (const [edge, direction] of edges.entries()) {
      if (visitedEdges.has(edge)) continue;
      visitedEdges.add(edge);
      sides++;
      traverseEdges(edge, direction);
    }
    return sides;

    function traverseEdges(edge: string, direction: string): void {
      const [edgeX, edgeY] = edge.split(',').map(Number);

      const traverse = ([dx, dy]: [number, number]): void => {
        let nextX = edgeX + dx;
        let nextY = edgeY + dy;
        let nextEdge = `${nextX},${nextY}`;
        while (edges.get(nextEdge) === direction) {
          visitedEdges.add(nextEdge);
          nextX += dx;
          nextY += dy;
          nextEdge = `${nextX},${nextY}`;
        }
      };

      if (edgeX % 1 === 0) {
        traverse([-1, 0]);
        traverse([1, 0]);
      } else {
        traverse([0, -1]);
        traverse([0, 1]);
      }
    }
  }

  for (let i = 0; i < garden.length; i++) {
    for (let j = 0; j < garden[i].length; j++) {
      const cellKey = `${i},${j}`;
      if (!visited.has(cellKey)) {
        const region = exploreRegion(i, j, garden[i][j]);
        regions.set(cellKey, region);
      }
    }
  }

  return Array.from(regions.values()).reduce((acc, region) => {
    if (region.size === 0) return acc;
    const sides = countSides(region);
    return acc + region.size * sides;
  }, 0);
}

function isValidCell(x: number, y: number, plantType: string, region: Set<string>): boolean {
  return ( x >= 0 && x < garden.length && y >= 0 && y < garden[x].length && garden[x][y] === plantType && !region.has(`${x},${y}`));
}
