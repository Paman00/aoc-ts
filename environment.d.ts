declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADVENTOFCODE_SESSION: string | undefined;
    }
  }
}
export {};
