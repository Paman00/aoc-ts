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

let res = 0;
const rightCount = new Map<number, number>();
right.forEach((num) => {
  rightCount.set(num, (rightCount.get(num) || 0) + 1);
});

left.forEach((num) => {
  const count = rightCount.get(num) || 0;
  res += (num * count);
  rightCount.delete(num);
});

console.log(res);;

/*
left.forEach((num) => {
  let index;
  let count = 0;
  do {
    index = right.indexOf(num);
    if (index !== -1) {
      right.splice(index, 1);
      count++;
    }
  } while (index !== -1);
  res += (num * count);
})
console.log(res);
*/
