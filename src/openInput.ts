import fs from 'fs';
import { join } from 'path';

export function openInput(year: number, day: number): string {
  let fileName;
  const dayFormatted = day.toString().padStart(2, '0');
  /*
  if (__dirname.includes(year.toString()))
    fileName = join(__dirname, `../../inputs/${year}/${dayFormatted}.txt`);
  else
    fileName = join(__dirname, `../inputs/${year}/${dayFormatted}.txt`);
  */
  fileName = join(__dirname, `../inputs/${year}/${dayFormatted}.txt`);
  const file = fs.readFileSync(fileName, 'utf-8');
  return file;
}
