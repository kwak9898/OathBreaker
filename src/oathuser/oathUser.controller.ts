import { Controller, Get, Post } from '@nestjs/common';
import {OathUserService} from "./oathUser.service";

@Controller('oath-user')
export class OathUserController {
    constructor(private oathUserService: OathUserService) {
    }

    @Post('/login')
    login() {
        return "ss"
    }
}
