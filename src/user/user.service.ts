import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getHello() {
        return process.env.DB_HOST;
    }
}
