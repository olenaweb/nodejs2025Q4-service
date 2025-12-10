import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingService } from './logging.service';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
