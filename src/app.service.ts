import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hello() {
    return 'Hello World!';
  }
}
