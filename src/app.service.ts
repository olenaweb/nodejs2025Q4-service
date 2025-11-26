import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'RSS Home Library Service -> olenaweb/nodejs2025Q4-service';
  }
}
