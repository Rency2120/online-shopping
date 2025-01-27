export class Logger {
    public static info(message: string): void {
      console.log(`\x1b[32m${message}\x1b[0m`);
    }
  
    public static error(message: string, error: Error): void {
      console.error(`\x1b[31m${message}\x1b[0m`, error);
    }
  }
  