// Path: src/2024/day08
import { openInput } from '../openInput.ts';

const file = openInput(2024, 8);
const [map, antennas] = parseData(file);
const antinodes = countAntinodes(map, antennas);
console.log(antinodes);

function parseData(file: string): [string[], Ubications] {
  const lines = file.split('\n').slice(0, -1);
  const ubications: Ubications = {};
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] !== '.') {
        const key = lines[i][j];
        ubications[key] ??= [];
        ubications[key].push({ x: j, y: i });
      }
    }
  }
  return [lines, ubications];
}

function countAntinodes(map: string[], antennas: Ubications): number {
  const antinodes = new Set<string>();

  const addAntinodes = (x: number, y: number, dx: number, dy: number): void => {
    while (isValidAntinode(map, { x, y })) {
      antinodes.add(`${x},${y}`);
      x += dx;
      y += dy;
    }
  };

  Object.keys(antennas).forEach((antenna) => {
    const coords = antennas[antenna];

    for (let i = 0; i < coords.length - 1; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const dx = coords[i].x - coords[j].x;
        const dy = coords[i].y - coords[j].y;

        addAntinodes(coords[i].x, coords[i].y, dx, dy);
        addAntinodes(coords[j].x, coords[j].y, -dx, -dy);
      }
    }
  });

  return antinodes.size;
}

function isValidAntinode(map: string[], { x, y }: Coord): boolean {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length;
}

interface Coord {
  x: number;
  y: number;
}
type Ubications = Record<string, Coord[]>;
