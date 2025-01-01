import { openInput } from '../openInput.ts';

const file = openInput(2024, 24);
const formulas = parseData(file);
const res = solve();
console.log(res);

function parseData(file: string): Formulas {
  const lines = file.trim().split('\n');
  const emptyLine = lines.indexOf('');
  const input = lines.slice(emptyLine + 1);
  const regexp =
    /([a-zA-Z0-9]{3}) (AND|OR|XOR) ([a-zA-Z0-9]{3}) -> ([a-zA-Z0-9]{3})/;
  const formulas: Formulas = {};

  for (const line of input) {
    const match = regexp.exec(line);
    if (match === null) continue;
    const [, a, op, b, c] = match;
    if (op !== 'AND' && op !== 'OR' && op !== 'XOR') continue;
    formulas[c] = {
      inputs: b.localeCompare(a) < 0 ? [b, a] : [a, b],
      door: op,
    };
  }
  return formulas;
}

function makeWire(char: string, value: number): string {
  return char + value.toString().padStart(2, '0');
}

function verifyIntermediateXor(wire: string, value: number): boolean {
  if (!(wire in formulas)) return false;
  const {
    inputs: [a, b],
    door,
  } = formulas[wire];
  if (door !== 'XOR') return false;
  return a === makeWire('x', value) && b === makeWire('y', value);
}

function verifyDirectCarryBit(wire: string, value: number): boolean {
  if (!(wire in formulas)) return false;
  const {
    inputs: [a, b],
    door,
  } = formulas[wire];
  if (door !== 'AND') return false;
  return a === makeWire('x', value) && b === makeWire('y', value);
}

function verifyReCarryBit(wire: string, value: number): boolean {
  if (!(wire in formulas)) return false;
  const {
    inputs: [a, b],
    door,
  } = formulas[wire];
  if (door !== 'AND') return false;
  return (
    (verifyIntermediateXor(a, value) && verifyCarryBit(b, value)) ||
    (verifyIntermediateXor(b, value) && verifyCarryBit(a, value))
  );
}

function verifyCarryBit(wire: string, value: number): boolean {
  if (!(wire in formulas)) return false;
  const {
    inputs: [a, b],
    door,
  } = formulas[wire];
  if (value === 1) {
    if (door !== 'AND') return false;
    return a === makeWire('x', 0) && b === makeWire('y', 0);
  }
  if (door !== 'OR') return false;
  return (
    (verifyDirectCarryBit(a, value - 1) && verifyReCarryBit(b, value - 1)) ||
    (verifyDirectCarryBit(b, value - 1) && verifyReCarryBit(a, value - 1))
  );
}

function verifyZ(wire: string, value: number): boolean {
  if (!(wire in formulas)) return false;
  const {
    inputs: [a, b],
    door,
  } = formulas[wire];
  if (door !== 'XOR') return false;
  if (value === 0) return a === 'x00' && b === 'y00';
  return (
    (verifyIntermediateXor(a, value) && verifyCarryBit(b, value)) ||
    (verifyIntermediateXor(b, value) && verifyCarryBit(a, value))
  );
}

function verify(value: number): boolean {
  return verifyZ(makeWire('z', value), value);
}

function progress(): number {
  let i = 0;
  while (verify(i)) {
    i++;
  }
  return i;
}

function solve(): string {
  const res: string[] = [];
  for (let i = 0; i < 4; i++) {
    const baseline = progress();
    let swapped = false;

    for (const a in formulas) {
      for (const b in formulas) {
        if (a === b) continue;
        [formulas[a], formulas[b]] = [formulas[b], formulas[a]];
        if (progress() > baseline) {
          res.push(a, b);
          swapped = true;
          break;
        }
        [formulas[a], formulas[b]] = [formulas[b], formulas[a]];
      }
      if (swapped) break;
    }
  }
  return res.sort().join(',');
}

type Door = 'AND' | 'OR' | 'XOR';

interface Dependents {
  door: Door;
  inputs: [string, string];
}

type Formulas = Record<string, Dependents>;
