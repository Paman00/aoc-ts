// Path: src/2024/day17
import { openInput } from '../openInput.ts';

const file = openInput(2024, 17);

const KEY_A = 'A';
const KEY_B = 'B';
const KEY_C = 'C';

const entry = parseData(file);
solve(entry);

function parseData(file: string): Entry {
  const lines = file.trim().split('\n');
  const lastLine = lines.splice(-1, 1)[0];
  const instructions = lastLine.replace('Program: ', '').split(',').map(Number);
  const registers: Registers = {};
  lines.forEach((line) => {
    const splited = line.split(' ');
    if (splited.length < 3) return;
    registers[splited[1][0]] = Number(splited[2]);
  });
  return { instructions, registers };
}

function getCombo(operand: number, registers: Registers): number {
  if (operand >= 0 && operand <= 3) return operand;
  if (operand === 4) return registers[KEY_A];
  if (operand === 5) return registers[KEY_B];
  if (operand === 6) return registers[KEY_C];
  else throw new Error('Invalid operand');
}

function adv(operand: number, registers: Registers): void {
  const numerator = registers[KEY_A];
  const combo = getCombo(operand, registers);
  const denominator = Math.pow(2, combo);
  registers[KEY_A] = Math.floor(numerator / denominator);
}

function bxl(operand: number, registers: Registers): void {
  const literal = operand;
  const res = registers[KEY_B] ^ literal;
  registers[KEY_B] = res;
}

function bst(operand: number, registers: Registers): void {
  const combo = getCombo(operand, registers);
  const res = combo % 8;
  registers[KEY_B] = res;
}

function jnz(operand: number, registers: Registers, ip: number): number {
  if (registers[KEY_A] === 0) return ip;
  const literal = operand;
  return literal - 2;
}

function bxc(_operand: number, registers: Registers): void {
  const res = registers[KEY_B] ^ registers[KEY_C];
  registers[KEY_B] = res;
}

function out(operand: number, registers: Registers): string {
  const combo = getCombo(operand, registers);
  const res = combo % 8;
  return res.toString();
}

function bdv(operand: number, registers: Registers): void {
  const combo = getCombo(operand, registers);
  if (combo === -1) return;
  const numerator = registers[KEY_A];
  const denominator = Math.pow(2, combo);
  registers[KEY_B] = Math.floor(numerator / denominator);
}

function cdv(operand: number, registers: Registers): void {
  const combo = getCombo(operand, registers);
  if (combo === -1) return;
  const numerator = registers[KEY_A];
  const denominator = Math.pow(2, combo);
  registers[KEY_C] = Math.floor(numerator / denominator);
}

function solve({ instructions, registers }: Entry): void {
  const log: string[] = [];
  for (let ip = 0; ip < instructions.length; ip += 2) {
    const opcode = instructions[ip];
    const operand = instructions[ip + 1];
    if (opcode === 0) {
      adv(operand, registers);
    } else if (opcode === 1) {
      bxl(operand, registers);
    } else if (opcode === 2) {
      bst(operand, registers);
    } else if (opcode === 3) {
      ip = jnz(operand, registers, ip);
    } else if (opcode === 4) {
      bxc(operand, registers);
    } else if (opcode === 5) {
      const res = out(operand, registers);
      log.push(res);
    } else if (opcode === 6) {
      bdv(operand, registers);
    } else if (opcode === 7) {
      cdv(operand, registers);
    }
  }
  console.log(log.join(','));
}

type Registers = Record<string, number>;

interface Entry {
  instructions: number[];
  registers: Registers;
}
