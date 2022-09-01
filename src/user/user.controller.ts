import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { UserLoginDto } from "./dto/userLogin.dto";
import { AuthGuard } from "../guard/auth.guard";

@UseGuards(AuthGuard)
@Controller("oath-user")
export class UserController {
  constructor(private userService: UserService) {}

  // 회원 Login Controller
  @UseGuards(AuthGuard)
  @Post("/login")
  async login(@Body() userLoginDto: UserLoginDto) {
    const { userId, password } = userLoginDto;
    return await this.userService.login(userId, password);
  }

  // 회원 Password 변경
  @Patch()
  async updateByUserPassword(@Param() userLoginDto: UserLoginDto) {
    const { userId, password } = userLoginDto;
    return await this.userService.checkUserExist(userId);
  }
}
