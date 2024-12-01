import fs from "fs";
import readline from "readline";
import { join } from "path";
import { format } from "@formkit/tempo";
import { createDir, askUser, fetchDayData } from "./src/utils.ts";

console.log("Starting a new day!");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Today is: " + format(new Date(), "long"));

const day = await getDate();
if (!day) {
  console.log("Exiting...");
  rl.close();
  process.exit(1);
}

createDir("inputs", __dirname);

console.log("Selected day: " + format(day, "long"));
const dayData = await fetchDayData(day);
if (!dayData) {
  console.log("Failed to fetch day data.");
  rl.close();
  process.exit(1);
}

const inputDir = `inputs/${format(day, "YYYY")}`;
const srcDir = `src/${format(day, "YYYY")}`;
createDir(inputDir, __dirname);
createDir(srcDir, __dirname);

const inputFileName = join(__dirname, `${inputDir}/${format(day, "DD")}.txt`);
fs.writeFileSync(inputFileName, dayData);
console.log(`Input data saved to ${inputFileName}`);

const baseCode = `// Path: src/${format(day, "YYYY")}/day${format(day, "DD")}\nimport { openInput } from '../openInput.ts';\n\nconst file = openInput(${format(day, "YYYY")}, ${format(day, "D")});\n\n`;

await writeCodeFile(srcDir, `day${format(day, "DD")}-1.ts`, baseCode);
await writeCodeFile(srcDir, `day${format(day, "DD")}-2.ts`, baseCode);

console.log("Done!");
rl.close();

async function getDate(): Promise<Date | null> {
  const currentDate = new Date();
  if (currentDate.getMonth() === 11 && currentDate.getDate() <= 25) {
    console.log("Currently is Advent of Code season!");
    const answer = await askUser(rl, "Do you want to get the current day file? (y/n): ");
    if (answer.toLowerCase() === "y") return currentDate;
  }

  const year = parseInt(await askUser(rl, "Enter the year of the challenge: "));
  if (isNaN(year) || year < 2015 || year > currentDate.getFullYear()) {
    console.log("Invalid year!");
    return null;
  }

  const day = parseInt(await askUser(rl, "Enter the day of the challenge: "));
  if (isNaN(day) || day < 1 || day > 25 || (year === currentDate.getFullYear() && day > currentDate.getDate())) {
    console.log("Invalid day!");
    return null;
  }

  return new Date(year, 11, day);
}

async function writeCodeFile(dir: string, fileName: string, content: string) {
  const filePath = join(__dirname, `${dir}/${fileName}`);
  const file = Bun.file(filePath);
  if (await file.exists()) {
    const overwrite = await askUser(rl, `File ${fileName} already exists. Overwrite? (y/n): `);
    if (overwrite.toLowerCase() !== "y") {
      console.log(`Skipped: ${fileName}`);
      return;
    }
  }
  Bun.write(filePath, content);
  console.log(`File created: ${filePath}`);
}
