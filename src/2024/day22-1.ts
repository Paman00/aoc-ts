// Path: src/2024/day22
import { openInput } from '../openInput.ts';

const file = openInput(2024, 22);

const secretsNumbers = file.trim().split('\n').map(Number);
const res = secretsNumbers
  .map((seed) => randomizeTimes(seed, 2000))
  .reduce((acc, cur) => acc + cur, 0);
console.log(res);

function xor(a: number, b: number): number {
  return Number(BigInt(a) ^ BigInt(b));
}

function randomize(seed: number): number {
  let res = seed;
  res = xor(res, res * 64) % 16777216;
  res = xor(res, Math.floor(res / 32)) % 16777216;
  res = xor(res, res * 2048) % 16777216;
  return res;
}

function randomizeTimes(seed: number, times: number): number {
  let res = seed;
  for (let i = 0; i < times; i++) {
    res = randomize(res);
  }
  return res;
}
