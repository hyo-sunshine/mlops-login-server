import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getDbServerInfo(): object {
    const {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME} = process.env;
    return {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME};
  }
}
