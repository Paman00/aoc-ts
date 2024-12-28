// Path: src/2024/day17

import { openInput } from '../openInput.ts';

const file = openInput(2024, 17);

/*
Initial Program (value of A doesn't matter):
----------------
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
----------------

Program simulation:
----------------
do {
  A = A >> 3
  out(A % 8)
} while (A!=0)
----------------

A = 117440

A = A >> 3 -> A is now 14680
out(A % 8) -> 0

A is not 0
A = A >> 3 -> A is now 1835
out(A % 8) -> 3

A is not 0
A = A >> 3 -> A is now 229
out(A % 8) -> 5

A is not 0
A = A >> 3 -> A is now 28
out(A % 8) -> 4

A is not 0
A = A >> 3 -> A is now 3
out(A % 8) -> 3

A is not 0
A = A >> 3 -> A is now 0
out(A % 8) -> 0

A is 0
end

Program out: 0,3,5,4,3,0
Initial Program: 0,3,5,4,3,0
*/

/*
Initial Program (value of A doesn't matter):
----------------
Register A: 33940147
Register B: 0
Register C: 0

Program: 2,4,1,5,7,5,1,6,4,2,5,5,0,3,3,0
----------------

Program simulation:
----------------
do {
  B = A % 8 // 2: bst (combo of 4 is A)
  B = B ^ 5 // 1: bxl (literal 5)
  C = A >> B // 7: cdv (combo of 5 is B)
  B = B ^ 6 // 1: bxl (literal 6)
  B = B ^ C // 4: bxc (no operand)
  out(B % 8) // 5: out (combo of 5 is B)
  A = A >> 3 // 0: adv (combo of 3 is 3)
} while (A!=0) // 3: jnz (combo of 0 is A)

* Notes:
* n >> x, is the same as Math.floor(n / Math.pow(2, x))
* n << x, is the same as n * Math.pow(2, x), if n is negative the result is not the same
* When moving bits in javascript, we must use BigInt, cause for default javascript uses 32 bits for numbers
*
* for the last value is 0, A must be 0 for out, and B must be 0, cause 8 is out of bounds
* we can try to find the value doing all the program for A = 0 -> 7, cause any of this values will end the program when adv 3 (A >> 3) is 0
* In this case, A must be 3, this must print B % 8 (after the previus operations) and then A = 3 >> 3 = 0 so the program ends :D
*/

// TODO: Implement the program for every input
const instructions = parseData(file);
const res = find(instructions, 0);
console.log(res);

function parseData(file: string): number[] {
  const lines = file.trim().split('\n');
  const lastLine = lines.splice(-1, 1)[0];
  const instructions = lastLine.replace('Program: ', '').split(',').map(Number);

  return instructions;
}

function find(instructions: number[], res: number): number| undefined {
  if (instructions.length === 0) return res;

  let A: bigint | undefined = undefined;
  let B: bigint | undefined = undefined;
  let C: bigint | undefined = undefined;
  for (let b = 0n; b < 8n; b++) {
    A = (BigInt(res) << 3n) | b;
    B = A % 8n;
    B = B ^ 5n;
    C = A >> B;
    B = B ^ 6n;
    B = B ^ C;

    if (Number(B) % 8 === instructions[instructions.length - 1]) {
      const next = find(instructions.slice(0, -1), Number(A));
      if (next !== undefined) {
        return next;
      }
    }
  }
  return undefined;
}
