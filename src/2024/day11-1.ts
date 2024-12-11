// Path: src/2024/day11
import { openInput } from '../openInput.ts';

const file = openInput(2024, 11);
const stones = file.trim().split(' ');
const blinkedStones = blinkMultipleTimes(25, stones);
const res = blinkedStones.length;
console.log(res);

function blinkOnce(stones: string[]): string[] {
  const newStones: string[] = [];
  stones.forEach((stone) => {
  if (stone === '0') {
    newStones.push('1');
  }
  else if (stone.length % 2 === 0) {
      const half = stone.length / 2;
      const left = parseInt(stone.slice(0, half)).toString();
      const right = parseInt(stone.slice(half)).toString();
      newStones.push(left, right);
    }
    else {
      const newStone = (parseInt(stone) * 2024).toString();
      newStones.push(newStone);
    }
  });
  return newStones;
}

function blinkMultipleTimes(times: number, stones: string[]): string[] {
  let blinkedStones = stones;
  for (let i = 0; i < times; i++) {
    blinkedStones = blinkOnce(blinkedStones);
  }
  return blinkedStones;
}
