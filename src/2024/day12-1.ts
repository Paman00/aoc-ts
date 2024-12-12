// Path: src/2024/day12
import { openInput } from '../openInput.ts';

const file = openInput(2024, 12);
const garden = file.trim().split('\n');
const totalPrice = calculateGardenPrice(garden);
console.log(totalPrice);

function calculateGardenPrice(garden: string[]): number {
  const directions = [ [0, 1], [1, 0], [0, -1], [-1, 0], ];
  const visited = new Set<string>();

  const exploreRegion = (i: number, j: number, plantType: string): { perimeter: number, area: number } => {
    if (i < 0 || i >= garden.length || j < 0 || j >= garden[i].length) {
      return { perimeter: 1, area: 0 };
    } else if (garden[i][j] !== plantType){
      return { perimeter: 1, area: 0 };
    }
    const key = `${i},${j}`;
    if (visited.has(key)) {
      return { perimeter: 0, area: 0 };
    }
    visited.add(key);

    let totalArea = 1;
    let totalPerimeter = 0;
    for(const [dx, dy] of directions) {
      const { perimeter, area } = exploreRegion(i + dx, j + dy, plantType);
      totalPerimeter += perimeter;
      totalArea += area;
    };
    return { perimeter: totalPerimeter, area: totalArea };
  };

  let totalPrice = 0;
  for (let i = 0; i < garden.length; i++) {
    for (let j = 0; j < garden[i].length; j++) {
      const cellKey = `${i},${j}`;
      if (!visited.has(cellKey)) {
        const plantType = garden[i][j];
        const { perimeter, area } = exploreRegion(i, j, plantType);
        totalPrice += area * perimeter;
      }
      visited.delete(cellKey);
    }
  }
  return totalPrice;
}
