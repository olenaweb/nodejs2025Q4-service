import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

/**
 * Creates and configures Winston logger
 *
 *Features:
 * - Rotation by date (new file every day)
 * - Rotation by size (when maxSize is reached)
 * - Separate file for errors
 * - Customizable logging level via ENV
 * - JSON format for files, color for the console
 */
export const createWinstonLogger = () => {
  const logLevel = process.env.LOG_LEVEL || '3';
  const maxFileSize = process.env.LOG_FILE_MAX_SIZE || '10m';
  const maxFiles = process.env.LOG_FILE_MAX_FILES || '14d';
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Mapping NestJS levels (0-5) to Winston
  // 0 = fatal → error
  // 1 = error → error
  // 2 = warn → warn
  // 3 = log → info
  // 4 = debug → debug
  // 5 = verbose → verbose
  const nestToWinstonLevel: Record<string, string> = {
    '0': 'error', // fatal
    '1': 'error', // error
    '2': 'warn', // warn
    '3': 'info', // log
    '4': 'debug', // debug
    '5': 'verbose', // verbose
  };

  const winstonLevel = nestToWinstonLevel[logLevel] || 'info';

  // Format for console (colorful, readable)
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, context, trace }) => {
      const ctx = context ? `[${context}]` : '';
      const traceStr = trace ? `\n${trace}` : '';
      return `${timestamp} ${level} ${ctx} ${message}${traceStr}`;
    }),
  );

  // Format for files (JSON, structured)
  const fileFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

  // Transports (where logs are written)
  const transports: winston.transport[] = [];

  // Console (only in development)
  if (nodeEnv === 'development') {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
      }),
    );
  }

  // File for all logs (application-%DATE%.log)
  // - Rotation by date: new file every day
  // - Rotation by size: new file when maxSize is reached
  // - Auto deletion: files older than maxFiles are deleted
  transports.push(
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: maxFileSize,
      maxFiles: maxFiles,
      format: fileFormat,
      auditFile: 'logs/.audit-application.json', // Service file for rotation tracking
    }),
  );

  // File for errors only (error-%DATE%.log)
  // - Only error level and above (fatal will also be included)
  // - Separate rotation
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: maxFileSize,
      maxFiles: maxFiles,
      level: 'error',
      format: fileFormat,
      auditFile: 'logs/.audit-error.json',
    }),
  );

  return winston.createLogger({
    level: winstonLevel,
    transports,
  });
};
