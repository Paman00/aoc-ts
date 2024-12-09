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
    if (count !== 0) {
      if (index % 2 === 0) {
        const charId = (index / 2).toString();
        for (let i = 0; i < count; i++) {
          memory.push(charId);
        }
      } else {
        memory.push(...'.'.repeat(count));
      }
    }
  }, '');
  return memory;
}

function reorderMemory(initialMemory: string[]): string[] {
  let lastNumberIndex = -1;
  let lastNumberLength = -1;

  while (true) {
    [lastNumberIndex, lastNumberLength] = getLastNumberInfo(
      initialMemory,
      lastNumberIndex,
    );
    if (lastNumberIndex === -1) break;
    let emptyIndex = -1;
    let emptyLength = -1;
    while (true) {
      [emptyIndex, emptyLength] = getFirstSpaceMemoryIndex(
        initialMemory,
        lastNumberLength,
        emptyIndex,
      );
      if (emptyIndex === -1) break;

      if (lastNumberIndex > emptyIndex && lastNumberLength <= emptyLength) {
        moveBlock(initialMemory, lastNumberIndex, emptyIndex, lastNumberLength);
        break;
      }
      emptyIndex += emptyLength;
    }
  }

  return initialMemory;
}

function getLastNumberInfo(
  initialMemory: string[],
  lastNumberIndex: number,
): [number, number] {
  const numberIndex =
    lastNumberIndex === -1
      ? initialMemory.findLastIndex((curr) => curr !== '.')
      : initialMemory.findLastIndex(
          (curr, index) => index < lastNumberIndex && curr !== '.',
        );
  if (numberIndex === -1) return [-1, 0];

  let length = 1;
  while (
    numberIndex - length >= 0 &&
    initialMemory[numberIndex - length] === initialMemory[numberIndex]
  ) {
    length++;
  }

  return [numberIndex - length + 1, length];
}

function getFirstSpaceMemoryIndex(
  initialMemory: string[],
  requiredLength: number,
  fromIndex: number,
): [number, number] {
  let emptyIndex =
    fromIndex === -1
      ? initialMemory.indexOf('.')
      : initialMemory.indexOf('.', fromIndex);
  while (emptyIndex !== -1) {
    let length = 1;
    while (
      emptyIndex + length < initialMemory.length &&
      initialMemory[emptyIndex + length] === '.'
    ) {
      length++;
    }

    if (length >= requiredLength) return [emptyIndex, length];
    emptyIndex = initialMemory.indexOf('.', emptyIndex + length);
  }

  return [-1, -1];
}

function moveBlock(
  memory: string[],
  fromIndex: number,
  toIndex: number,
  length: number,
): void {
  for (let i = 0; i < length; i++) {
    memory[toIndex + i] = memory[fromIndex + i];
    memory[fromIndex + i] = '.';
  }
}

function getMemorySum(orderedMemory: string[]): number {
  return orderedMemory.reduce((acc, curr, index) => {
    if (curr === '.') return acc;
    return acc + parseInt(curr) * index;
  }, 0);
}
