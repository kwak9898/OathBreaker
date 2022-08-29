import { Module } from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./user.service";

@Module({
    imports: [UserModule],
    controller : [UserController],
    providers  : [UserService],
})
export class UserModule {}
