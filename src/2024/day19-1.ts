// Path: src/2024/day19
import { openInput } from '../openInput.ts';

const file = openInput(2024, 19);

const [towels, designs] = parseData(file);
const res = designs.filter((design) => isValidDesign(design, towels)).length;
console.log(res);

function parseData(file: string): [string[], string[]] {
  const lines = file.trim().split('\n');
  const emptyLine = 1;
  const towels = lines[0].split(', ');
  const designs = lines.slice(emptyLine + 1);
  return [towels, designs];
}

function isValidDesign(design: string, towels: string[], i = 0): boolean {
  if (design === '' || i >= design.length) return true;

  for (const towel of towels) {
    if (design.startsWith(towel, i)) {
      const nextI = i + towel.length;
      if (isValidDesign(design, towels, nextI)) return true;
    }
  }
  return false;
}
