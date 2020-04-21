import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class AppService {
  async getHello() {
    throw new NotFoundException;
  }
}
