import { Injectable } from '@nestjs/common';

@Injectable()
export class OathUserService {
    login(): string {
        return "Test!!";
    }
}
