// Path: src/2024/day07
import { openInput } from '../openInput.ts';

const file = openInput(2024, 7);

const num = getCalibrationTotal(file);
console.log(num);

function getCalibrationTotal(file: string): number {
  const lines = file.split('\n').slice(0, -1);
  return lines.reduce((acc, line) => {
    const [number, values] = line.split(': ');
    const valuesSplit = values.split(' ').map(Number);
    const searched = Number(number);
    if (checkIsValid(searched, valuesSplit)) {
      return acc + searched;
    }
    return acc;
  }, 0);
}

function checkIsValid(searched: number, values: number[]): boolean {
  if (values.length === 1) return values[0] === searched;
  if (values[0] > searched) return false;

  const [first, second, ...rest] = values;

  const sum = first + second;
  const mul = first * second;

  if (checkIsValid(searched, [sum, ...rest])) return true;
  if (checkIsValid(searched, [mul, ...rest])) return true;
  return false;
}
