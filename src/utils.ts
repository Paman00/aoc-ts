import { format } from "@formkit/tempo";
import { join } from "path";
import fs from "fs";
import type { Interface } from "readline";

// Dirname must be the __dirname of the file that calls, else must be from utils.ts file
export function createDir(subpath: string, dirname: string = __dirname) {
  const path = join(dirname, subpath);
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

export async function askUser(rl: Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => resolve(answer.trim()));
  });
}

export async function fetchDayData(day: Date): Promise<string | null> {
  try {
    const cookie = process.env.ADVENTOFCODE_SESSION;
    if (!cookie) throw new Error("Session cookie not found in environment variables, create as ADVENTOFCODE_SESSION");

    const url = `https://adventofcode.com/${format(day, "YYYY")}/day/${format(day, "D")}/input`;
    console.log("Fetching data from: " + url);
    const response = await fetch(url, { headers: { cookie } });

    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    return await response.text();
  } catch (error) {
    console.error(error);
    return null;
  }
}
