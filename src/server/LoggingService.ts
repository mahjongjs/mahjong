import { injectable } from 'inversify';
import winston from 'winston';

export interface ILoggingService {
  warn(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
}

@injectable()
export class LoggerService implements ILoggingService {
  private logger = winston.createLogger({
    transports: [new winston.transports.Console()],
  });

  warn(...args) {
    //@ts-ignore
    this.logger.warn(...args);
  }
  info(...args) {
    //@ts-ignore
    this.logger.info(...args);
  }
  error(...args) {
    //@ts-ignore
    this.logger.error(...args);
  }
}
