import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RequestWithUser } from "./interfaces/auth/requestWithUser.interface";
import { LocalAuthenticationGuard } from "../guard/localAuthentication.guard";
import { Response } from "express";
import { JwtAuthGuard } from "../guard/jwtAuth.guard";

@Controller("oath-user")
export class UserController {
  constructor(private userService: UserService) {}

  // 회원 로그인
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post("login")
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.userService.getCookieWithJwtToken(user.userId);
    response.setHeader("Set-Cookie", cookie);
    user.password = undefined;
    return response.send(user);
  }

  // 회원 로그아웃 (JWT 파기)
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader("Set-Cookie", await this.userService.signOut());

    return response.sendStatus(200);
  }

  // 토큰 확인
  @UseGuards(JwtAuthGuard)
  @Get()
  async getByToken(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;

    return user;
  }
}
