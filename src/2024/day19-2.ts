// Path: src/2024/day19
import { openInput } from '../openInput.ts';

const file = openInput(2024, 19);

const [towels, designs] = parseData(file);
const res = countDesigns(designs, towels);
console.log(res);

function parseData(file: string): [Set<string>, string[]] {
  const lines = file.trim().split('\n');
  const emptyLine = 1;
  const towels = new Set(lines[0].split(', '));
  const designs = lines.slice(emptyLine + 1);
  return [towels, designs];
}

function countDesigns(designs: string[], towels: Set<string>): number {
  const memo = new Map<string, number>();
  const countValidDesigns = (design: string): number => {
    if (design === '') return 1;
    if (memo.has(design)) {
      const value = memo.get(design);
      if (value !== undefined) return value;
    }

    let count = 0;
    for (let i = 0; i < design.length; i++) {
      const prefix = design.slice(0, i + 1);
      if (towels.has(prefix)) {
        count += countValidDesigns(design.slice(i + 1));
      }
    }
    memo.set(design, count);
    return count;
  };

  let count = 0;
  for (const design of designs) {
    count += countValidDesigns(design);
  }
  return count;
}
