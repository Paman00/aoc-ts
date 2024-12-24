// Path: src/2024/day24
import { openInput } from '../openInput.ts';

const file = openInput(2024, 24);

const [wires, dependenciesQ] = parseData(file);
solveWires(wires, dependenciesQ);
const res = getWiresValue('z', wires);
console.log(res);

function parseData(file: string): [Wires, Dependents[]] {
  const lines = file.trim().split('\n');

  const emptyLine = lines.indexOf('');
  const boolLines = lines.splice(0, emptyLine);

  const wires: Wires = {};
  for (const line of boolLines) {
    if (line === '') continue;
    const [key, value] = line.split(': ');
    wires[key] = parseInt(value, 2);
  }

  const regexp =
    /([a-zA-Z0-9]{3}) (AND|OR|XOR) ([a-zA-Z0-9]{3}) -> ([a-zA-Z0-9]{3})/;
  const dependenciesQ: Dependents[] = [];
  let match: RegExpExecArray | null = null;
  let index = 0;
  while ((match = regexp.exec(lines[1])) !== null) {
    const [, a, op, b, c] = match;
    if (op !== 'AND' && op !== 'OR' && op !== 'XOR') continue;
    if (a in wires && b in wires) {
      dependenciesQ.unshift({
        inputs: [a, b],
        door: op,
        output: c,
      });
    } else {
      index--;
      dependenciesQ.splice(index, 0, {
        inputs: [a, b],
        door: op,
        output: c,
      });
    }
    lines.shift();
  }
  return [wires, dependenciesQ];
}

function solveWires(wires: Wires, dependenciesQ: Dependents[]): void {
  while (dependenciesQ.length > 0) {
    const next = dependenciesQ.pop();
    if (next === undefined) break;
    const { inputs, door, output }: Dependents = next;
    const [a, b] = inputs.map((input) =>
      input in wires ? wires[input] : undefined,
    );
    if (a !== undefined && b !== undefined) {
      if (door === 'AND') {
        wires[output] = a & b;
      } else if (door === 'OR') {
        wires[output] = a | b;
      } else {
        wires[output] = a ^ b;
      }
    } else {
      dependenciesQ.unshift(next);
    }
  }
}

function getWiresValue(letter: string, wires: Wires): number {
  const binary = Object.entries(wires)
    .filter(([key]) => key.startsWith(letter))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value.toString())
    .reverse()
    .join('');
  return parseInt(binary, 2);
}

type Door = 'AND' | 'OR' | 'XOR';

interface Dependents {
  inputs: [string, string];
  door: Door;
  output: string;
}

type Wires = Record<string, number>;
