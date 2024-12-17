// Path: src/2024/day16
import { openInput } from '../openInput.ts';

const file = openInput(2024, 16);

const map = file.trim().split('\n');
const res = getLowerScore(
  map,
  { x: 1, y: map.length - 2 },
  { x: map[0].length - 2, y: 1 },
);
console.log(res);

function getLowerScore(
  map: string[],
  { x: startX, y: startY }: Point,
  { x: endX, y: endY }: Point,
): number {
  const directions: Record<Direction, Point> = {
    [Direction.north]: { x: 0, y: -1 },
    [Direction.east]: { x: 1, y: 0 },
    [Direction.south]: { x: 0, y: 1 },
    [Direction.west]: { x: -1, y: 0 },
  };
  const heap = new MinHeap<State>((a, b) => a.cost - b.cost);
  const minCost = new Map<string, number>();

  heap.insert({
    x: startX,
    y: startY,
    direction: Direction.east,
    cost: 0,
  });
  minCost.set(`${startX},${startY},${Direction.east}`, 0);
  while (heap.size() > 0) {
    const current = heap.extractMin();
    if (current === undefined) break;

    const { x, y, direction, cost } = current;
    if (x === endX && y === endY) {
      return cost;
    }

    for (let i = -1; i < 2; i++) {
      const newDirection: Direction = (direction + i + 4) % 4;
      const newX = x + directions[newDirection].x;
      const newY = y + directions[newDirection].y;
      const turnCost = direction === newDirection ? 1 : 1001;
      const newCost = cost + turnCost;

      if (isValid(newX, newY, map)) {
        const key = `${newX},${newY},${newDirection}`;
        const currentCost = minCost.get(key);

        if (currentCost === undefined || newCost < currentCost) {
          minCost.set(key, newCost);
          heap.insert({
            x: newX,
            y: newY,
            direction: newDirection,
            cost: newCost,
          });
        }
      }
    }
  }

  return -1;
}

function isValid(x: number, y: number, map: string[]): boolean {
  return (
    y >= 0 && y < map.length && x >= 0 && x < map[0].length && map[y][x] !== '#'
  );
}

enum Direction {
  north = 0,
  east = 1,
  south = 2,
  west = 3,
}

interface Point {
  x: number;
  y: number;
}

interface State {
  x: number;
  y: number;
  direction: Direction;
  cost: number;
}

// My own MinHeap with a heapify function :D
class MinHeap<T> {
  private heap: T[] = [];

  constructor(
    private readonly compare: (a: T, b: T) => number,
    array?: T[],
  ) {
    if (array === undefined) return;
    this.heap = array;
    for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
      this.heapify(i);
    }
  }

  size(): number {
    return this.heap.length;
  }

  insert(value: T): void {
    this.heap.push(value);
    this.bubbleUp();
  }

  extractMin(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    const last = this.heap.pop();
    if (last !== undefined) {
      this.heap[0] = last;
      this.bubbleDown();
    }
    return root;
  }

  private bubbleDown(): void {
    let current = 0;
    while (true) {
      const left = 2 * current + 1;
      const right = 2 * current + 2;
      let smallest = current;
      if (
        left < this.heap.length &&
        this.compare(this.heap[left], this.heap[smallest]) < 0
      ) {
        smallest = left;
      }
      if (
        right < this.heap.length &&
        this.compare(this.heap[right], this.heap[smallest]) < 0
      ) {
        smallest = right;
      }
      if (smallest === current) {
        break;
      }
      const tmp = this.heap[current];
      this.heap[current] = this.heap[smallest];
      this.heap[smallest] = tmp;
      current = smallest;
    }
  }

  private bubbleUp(): void {
    let current = this.heap.length - 1;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.compare(this.heap[current], this.heap[parent]) >= 0) {
        break;
      }
      const tmp = this.heap[current];
      this.heap[current] = this.heap[parent];
      this.heap[parent] = tmp;
      current = parent;
    }
  }

  private heapify(index: number): void {
    const left = 2 * (index + 1);
    const right = 2 * (index + 2);
    let smallest = index;
    if (
      left < this.heap.length &&
      this.compare(this.heap[left], this.heap[smallest]) < 0
    ) {
      smallest = left;
    }
    if (
      right < this.heap.length &&
      this.compare(this.heap[right], this.heap[smallest]) < 0
    ) {
      smallest = right;
    }
    if (smallest !== index) {
      const temp = this.heap[index];
      this.heap[index] = this.heap[smallest];
      this.heap[smallest] = temp;
      this.heapify(smallest);
    }
  }
}
