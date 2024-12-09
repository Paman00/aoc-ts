// Path: src/2024/day09
import { openInput } from '../openInput.ts';

const file = openInput(2024, 9);
const initialMemory = parseMemory(file);
const orderedMemory = reorderMemory(initialMemory);
const res = getMemorySum(orderedMemory);
console.log(res);

function parseMemory(file: string): string[] {
  const line = file.trim();
  const memory: string[] = [];
  line.split('').forEach((curr, index) => {
    const count = parseInt(curr);
    if (index % 2 === 0) {
      const charId = (index / 2).toString();
      for (let i = 0; i < count; i++) {
        memory.push(charId);
      }
    }
    else {
      memory.push(...'.'.repeat(count));
    }
  }, '');
  return memory;
}

function reorderMemory(initialMemory: string[]): string[] {
  while (true)
  {
    const lastNumberIndex = initialMemory.findLastIndex((curr) => curr !== '.');
    const firstEmptyIndex = initialMemory.indexOf('.');

    if (lastNumberIndex > firstEmptyIndex) {
      const tmp = initialMemory[lastNumberIndex];
      initialMemory[lastNumberIndex] = initialMemory[firstEmptyIndex];
      initialMemory[firstEmptyIndex] = tmp;
    }
    else {
      break;
    }
  }
  return initialMemory;
}

function getMemorySum(orderedMemory: string[]): number {
  return orderedMemory.reduce((acc, curr, index) => {
    if (curr === '.') return acc;
    return acc + (parseInt(curr) * index);
  }, 0);
}
