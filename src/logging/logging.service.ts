import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { Logger } from 'winston';
import { createWinstonLogger } from './winston.config';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger: Logger;
  private logLevel: number;

  private readonly LOG_LEVELS: Record<LogLevel, number> = {
    fatal: 0,
    error: 1,
    warn: 2,
    log: 3,
    debug: 4,
    verbose: 5,
  };

  constructor() {
    this.logger = createWinstonLogger();
    this.logLevel = parseInt(process.env.LOG_LEVEL || '3', 10);
  }

  private shouldLog(level: LogLevel): boolean {
    const messageLevel = this.LOG_LEVELS[level];
    return messageLevel <= this.logLevel;
  }

  private formatMessage(message: string | object): string {
    return typeof message === 'object' ? JSON.stringify(message) : String(message);
  }

  log(message: string | object, context?: string): void {
    if (this.shouldLog('log')) {
      this.logger.info(this.formatMessage(message), { context });
    }
  }

  fatal(message: string | object, trace?: string, context?: string): void {
    if (this.shouldLog('fatal')) {
      this.logger.error(this.formatMessage(message), { context, trace, level: 'fatal' });
    }
  }

  error(message: string | object, trace?: string, context?: string): void {
    if (this.shouldLog('error')) {
      this.logger.error(this.formatMessage(message), { context, trace });
    }
  }

  warn(message: string | object, context?: string): void {
    if (this.shouldLog('warn')) {
      this.logger.warn(this.formatMessage(message), { context });
    }
  }

  debug(message: string | object, context?: string): void {
    if (this.shouldLog('debug')) {
      this.logger.debug(this.formatMessage(message), { context });
    }
  }

  verbose(message: string | object, context?: string): void {
    if (this.shouldLog('verbose')) {
      this.logger.verbose(this.formatMessage(message), { context });
    }
  }
}
