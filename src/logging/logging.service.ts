import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
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
    this.logLevel = parseInt(process.env.LOG_LEVEL || '3', 10);
  }

  // should be logged at a given level
  private shouldLog(level: LogLevel): boolean {
    const messageLevel = this.LOG_LEVELS[level];
    return messageLevel <= this.logLevel;
  }

  private formatMessage(level: string, message: string | object, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextString = context ? `[${context}]` : '';
    const messageString = typeof message === 'object' ? JSON.stringify(message) : String(message);

    return `${timestamp} [${level.toUpperCase()}] ${contextString} ${messageString}`;
  }

  log(message: string | object, context?: string): void {
    if (this.shouldLog('log')) {
      console.log(this.formatMessage('log', message, context));
    }
  }

  fatal(message: string | object, trace?: string, context?: string): void {
    if (this.shouldLog('fatal')) {
      console.error(this.formatMessage('fatal', message, context));
      if (trace) {
        console.error(`Stack trace: ${trace}`);
      }
    }
  }

  error(message: string | object, trace?: string, context?: string): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context));
      if (trace) {
        console.error(`Stack trace: ${trace}`);
      }
    }
  }

  warn(message: string | object, context?: string): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  debug(message: string | object, context?: string): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: string | object, context?: string): void {
    if (this.shouldLog('verbose')) {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}
