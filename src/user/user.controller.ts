import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from "./user.service";
import { Request } from "express";
import {UserLoginDto} from "./dto/userLogin.dto";

@Controller('oath-user')
export class UserController {
    constructor(private oathUserService: UserService) {}

    @Post('/login')
    async login(@Body() userLoginDto: UserLoginDto) {
        const { userId, password } = userLoginDto;
        return await this.oathUserService.existUserLogin( userId, password )
    }
}
