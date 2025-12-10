import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggingService } from './logging.service';
import { AllExceptionsFilter } from './all-exceptions.filter';

@Global()
@Module({
  providers: [
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
