// Path: src/2024/day01
import { openInput } from '../openInput.ts';

const file = openInput(2024, 1);

const numbers: number[] = file
  .split('\n').join(' ').split(' ')
  .filter(Boolean)
  .map(Number);

const left: number[] = [];
const right: number[] = [];
for (let i = 0; i < numbers.length; i++) {
  (i % 2 === 0 ? left : right).push(numbers[i]);
}

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

const res = left.reduce((acc, num, i) => acc + Math.abs(num - right[i]), 0);

console.log(res);

/*
// Input: ../../input/2024/01.txt
import { openInput } from '../openInput';

const file = openInput(2024, 1);

const numbers: string[] = file.split('\n').join(' ').split(' ').filter(Boolean);
let left: number[] = [];
let right: number [] = [];
numbers.forEach((number, index) => {
  if (index % 2 === 0) {
    left.push(parseInt(number));
  }
  else {
    right.push(parseInt(number));
  }
});
left.sort((a, b) => a - b);
right.sort((a, b) => a - b);
let res = 0;
for(let i = 0; i < left.length; i++) {
  res += Math.abs(left[i] - right[i]);
}
console.log(res);
*/
