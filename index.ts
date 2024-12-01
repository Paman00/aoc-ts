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
  console.log(filePath)
  if (fs.existsSync(filePath)) {
    const overwrite = await askUser(rl, `File ${fileName} already exists. Overwrite? (y/n): `);
    if (overwrite.toLowerCase() !== "y") {
      console.log(`Skipped: ${fileName}`);
      return;
    }
  }
  fs.writeFileSync(filePath, content);
  console.log(`File created: ${filePath}`);
}
/*
console.log("Starting a new day!")
const rl: ReadLine = readline.createInterface({ input, output });
console.log("Today is: " + format(new Date(), "long"));

const day = await getDate();
if (day == null) {
  rl.close();
  process.exit(1);
}
console.log("Selected day: " + format(day, "long"));
const dayData = fetchDayData(day);
createDir("input");
createDir("src");
dayData.then(async (data) => {
  createDir(`input/${format(day, "YYYY")}`);
  createDir(`src/${format(day, "YYYY")}`);
  const inputFileName = join(__dirname, `input/${format(day, "YYYY/DD")}.txt`);
  fs.writeFileSync(inputFileName, data);
  const text = `// Path: src/${format(day, "YYYY")}\nimport { openInput } from '../../openInput';\n\nconst file = openInput(${format(day, "YYYY")}, ${format(day, "D")});\n\n`;

  let mustWriteFile1 = true;
  if (fs.existsSync(join(__dirname, `src/${format(day, "YYYY")}/day${format(day, "DD")}-1.ts`))) {
    mustWriteFile1 = false;
    console.log("File 1 already exists!")
    const answer = await askUser("Do you want to overwrite it? (y/n) ");
    if (answer == 'y')
      mustWriteFile1 = true;
  }
  if (mustWriteFile1) {
    const codeFileName1 = join(__dirname, `src/${format(day, "YYYY")}/day${format(day, "DD")}-1.ts`);
    fs.writeFileSync(codeFileName1, text);
  }
  if (fs.existsSync(join(__dirname, `src/${format(day, "YYYY")}/day${format(day, "DD")}-2.ts`))) {
    console.log("File 2 already exists!")
    const answer = await askUser("Do you want to overwrite it? (y/n) ");
    if (answer != 'y')
      return;
  }
  const codeFileName2 = join(__dirname, `src/${format(day, "YYYY")}/day${format(day, "DD")}-2.ts`);
  fs.writeFileSync(codeFileName2, text);
}).then(() => {
  rl.close();
  console.log("Done!");
})

async function getDate(): Promise<Date | null> {
  const currentDate = new Date();
  if (currentDate.getMonth() == 11 && currentDate.getDate() <= 25) {
    console.log("Currently is Advent of Code season!");
    const answer = await askUser("Do you want to get the current day file? (y/n) ");
    if (answer == 'y')
      return currentDate;
  }
  const year = await askUser("Enter the year of the challenge: ");
  const yearNumber = parseInt(year);
  if (!year || isNaN(yearNumber) || yearNumber < 2015 || yearNumber > currentDate.getFullYear()) {
    console.log("Invalid year!");
    return null;
  }
  const day = await askUser("Enter the day of the challenge: ");
  const dayNumber = parseInt(day);
  if (!day || isNaN(dayNumber) || dayNumber < 1 || dayNumber > 25 || (yearNumber == currentDate.getFullYear() && dayNumber > currentDate.getDate())) {
    console.log("Invalid day!");
    return null;
  }
  return new Date(yearNumber, 11, dayNumber);
}

function askUser(question:string): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer: string) => {
      resolve(answer);
    });
  });
}

function createDir(subpath: string) {
  const path = join(__dirname, subpath);
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

async function fetchDayData(day: Date): Promise<string | null> {
  try {
    const cookie = process.env.ADVENTOFCODE_SESSION;
    if (!cookie) {
      throw new Error("Cookie not found");
    }
    const url = `https://adventofcode.com/${format(day, "YYYY")}/day/${format(day, "D")}/input`;
    console.log("Fetching data from: " + url);
    const data = await fetch(url, { headers: { cookie } });
    const response = await data.text();
    if (!data.ok) {
      throw new Error(response);
    }
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
*/
