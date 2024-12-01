import fs from 'fs';
import { join } from 'path';

export function openInput(year: number, day: number): string {
  let file;
  const dayFormatted = day.toString().padStart(2, '0');
  /*
  if (__dirname.includes(year.toString()))
    file = fs.readFileSync(join(__dirname, `../../input/${year}/${day}.txt`), 'utf-8');
  else
  */

  file = fs.readFileSync(join(__dirname, `../inputs/${year}/${dayFormatted}.txt`), 'utf-8');
  return file;
}
